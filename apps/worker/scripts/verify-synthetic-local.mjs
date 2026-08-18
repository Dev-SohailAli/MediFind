#!/usr/bin/env node
// Local-only synthetic environment verifier.
//
// This command applies (idempotently) or verifies the reviewed Task 4
// synthetic D1 migration against the LOCAL Wrangler/D1 runtime declared in
// `wrangler.local.toml`, checks the exact expected row counts, foreign-key
// integrity and the stale/excluded-listing invariant, verifies the committed
// export manifest/checksums, and prints one safe, redacted JSON summary.
//
// Safety properties (see docs/local-synthetic-development.md and
// docs/claude-tasks/task-5-synthetic-verification-tooling.md):
//   - Accepts zero arguments. Any argument (including `--remote`) is
//     rejected before anything else runs -- no subprocess is spawned.
//   - Every Wrangler invocation uses a fixed argument array with `--local`
//     and the fixed `wrangler.local.toml` config; nothing from argv, the
//     environment, or any external input is ever interpolated into a
//     command or SQL string.
//   - Wrangler is invoked via `execFileSync(process.execPath, [wranglerJs,
//     ...fixedArgs])` -- never through a shell -- so there is no shell
//     interpolation on any platform.
//   - Raw Wrangler stdout/stderr, SQL text, file contents and row values are
//     never written to this process's stdout/stderr; only fixed, safe,
//     generic messages and the final approved JSON summary are printed.
//   - Never applies, drops or resets local data automatically; a partial or
//     unexpected existing schema fails closed instead of being mutated.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const workerRoot = fileURLToPath(new URL('..', import.meta.url));
const wranglerConfigPath = fileURLToPath(new URL('../wrangler.local.toml', import.meta.url));
const migrationPath = fileURLToPath(
  new URL('../migrations/0001_task4_synthetic_search.sql', import.meta.url),
);
const exportDirectoryPath = fileURLToPath(
  new URL('../exports/task-4-synthetic-d1-export-v1', import.meta.url),
);
// bin/wrangler.js is Wrangler's real (Node-executable) CLI entry point.
// Invoking it directly with `process.execPath` avoids the Windows
// `.cmd`-via-execFileSync EINVAL failure that would otherwise force using a
// shell, keeping this command shell-free on every platform.
const wranglerBinPath = fileURLToPath(
  new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url),
);

const DATABASE_NAME = 'medifind-synthetic-search-local';
const MIGRATION_NAME = '0001_task4_synthetic_search.sql';

const EXPECTED_TABLES = [
  { name: 'medicine_concepts', rowCount: 7 },
  { name: 'pharmacy_organisations', rowCount: 4 },
  { name: 'pharmacy_branches', rowCount: 4 },
  { name: 'medicine_listings', rowCount: 8 },
  { name: 'public_search_projection', rowCount: 7 },
  { name: 'public_search_terms', rowCount: 31 },
];
const EXPECTED_TABLE_NAMES = EXPECTED_TABLES.map((table) => table.name);
const EXPECTED_ROW_COUNTS = Object.fromEntries(
  EXPECTED_TABLES.map((table) => [table.name, table.rowCount]),
);

const EXCLUDED_LISTING_ID = 'excludex-solandra-ineligible';

const TABLE_CHECK_SQL =
  "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN " +
  "('medicine_concepts','pharmacy_organisations','pharmacy_branches'," +
  "'medicine_listings','public_search_projection','public_search_terms') " +
  'ORDER BY name';

const ROW_COUNT_SQL =
  'SELECT ' +
  '(SELECT COUNT(*) FROM medicine_concepts) AS medicine_concepts, ' +
  '(SELECT COUNT(*) FROM pharmacy_organisations) AS pharmacy_organisations, ' +
  '(SELECT COUNT(*) FROM pharmacy_branches) AS pharmacy_branches, ' +
  '(SELECT COUNT(*) FROM medicine_listings) AS medicine_listings, ' +
  '(SELECT COUNT(*) FROM public_search_projection) AS public_search_projection, ' +
  '(SELECT COUNT(*) FROM public_search_terms) AS public_search_terms';

const FOREIGN_KEY_CHECK_SQL = 'PRAGMA foreign_key_check';

const EXCLUSION_CHECK_SQL =
  'SELECT ' +
  `(SELECT COUNT(*) FROM medicine_listings WHERE id = '${EXCLUDED_LISTING_ID}' AND listing_state = 'excluded') AS excluded_listing_count, ` +
  `(SELECT COUNT(*) FROM public_search_projection WHERE listing_id = '${EXCLUDED_LISTING_ID}') AS excluded_projection_count, ` +
  `(SELECT COUNT(*) FROM public_search_terms WHERE listing_id = '${EXCLUDED_LISTING_ID}') AS excluded_term_count`;

/**
 * Rejects any user-supplied argument. This is the no-argument command's
 * entire attack surface: `--remote`, `--config`, arbitrary SQL and any
 * future unreviewed flag are all rejected together by requiring an empty
 * argument list, before any subprocess is ever spawned.
 */
export function assertNoArguments(argv) {
  if (argv.length > 0) {
    throw new Error('verify:local accepts no arguments; local config and SQL are fixed');
  }
}

/**
 * Parses one fixed-shape Wrangler `d1 execute ... --json` stdout payload
 * (raw text) and returns the single statement's result rows. Fails closed
 * -- with a safe, generic, stage-named error and no echoed payload -- on
 * malformed JSON, an unexpected number of statement results, a reported
 * failure, or a missing `results` array.
 */
export function parseResultRows(value, stage) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`local Wrangler verification failed at ${stage}`);
  }

  if (!Array.isArray(parsed) || parsed.length !== 1) {
    throw new Error(`local Wrangler verification failed at ${stage}`);
  }

  const [entry] = parsed;
  if (
    !entry ||
    typeof entry !== 'object' ||
    entry.success !== true ||
    !Array.isArray(entry.results)
  ) {
    throw new Error(`local Wrangler verification failed at ${stage}`);
  }

  return entry.results;
}

/**
 * Parses the multi-statement Wrangler JSON payload produced by applying the
 * migration file and confirms every statement succeeded.
 */
export function assertMigrationApplied(value, stage) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`local Wrangler verification failed at ${stage}`);
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length === 0 ||
    !parsed.every((entry) => entry && typeof entry === 'object' && entry.success === true)
  ) {
    throw new Error(`local Wrangler verification failed at ${stage}`);
  }
}

/**
 * Classifies the local database's schema state relative to the six expected
 * tables: 'absent' (apply the migration), 'complete' (verify existing
 * state, idempotently), or 'partial' (fail closed -- never drop, reset or
 * alter local data automatically).
 */
export function classifyTableState(existingTableNames, expectedTableNames) {
  const existing = new Set(existingTableNames);
  const matched = expectedTableNames.filter((name) => existing.has(name));

  if (matched.length === 0) return 'absent';
  if (matched.length === expectedTableNames.length) return 'complete';
  return 'partial';
}

/**
 * Verifies a row-count record matches the expected six-table shape exactly:
 * no missing table, no extra table, no mismatched count.
 */
export function verifyRowCounts(actualRowCounts, expectedRowCounts) {
  const expectedKeys = Object.keys(expectedRowCounts);
  const actualKeys = Object.keys(actualRowCounts ?? {});

  if (actualKeys.length !== expectedKeys.length) {
    throw new Error(
      'local synthetic database row counts do not match the expected six-table shape',
    );
  }

  for (const key of expectedKeys) {
    if (actualRowCounts[key] !== expectedRowCounts[key]) {
      throw new Error(
        'local synthetic database row counts do not match the expected six-table shape',
      );
    }
  }

  return true;
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/**
 * Verifies the committed logical export directory: `synthetic_only` /
 * `contains_real_data` safety flags, the exact expected table list and row
 * counts, and a SHA-256 checksum match for every expected JSONL file with
 * no missing or unapproved extra file. Fails closed (throws a safe, generic
 * error) on any drift; never returns a partial/best-effort result.
 */
export function verifyExportDirectory(exportDirectory, expectedTables) {
  const manifestPath = join(exportDirectory, 'manifest.json');

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    throw new Error('export manifest is missing or unreadable');
  }

  if (manifest.synthetic_only !== true || manifest.contains_real_data !== false) {
    throw new Error('export manifest failed the synthetic-only safety check');
  }

  const expectedNames = expectedTables.map((table) => table.name);
  if (!Array.isArray(manifest.tables) || !arraysEqual(manifest.tables, expectedNames)) {
    throw new Error('export manifest table list does not match the expected tables');
  }

  const rowCounts = manifest.row_counts ?? {};
  if (Object.keys(rowCounts).length !== expectedTables.length) {
    throw new Error('export manifest row counts do not match the expected tables');
  }
  for (const { name, rowCount } of expectedTables) {
    if (rowCounts[name] !== rowCount) {
      throw new Error('export manifest row counts do not match the expected tables');
    }
  }

  const expectedFiles = expectedTables.map((table) => `data/${table.name}.jsonl`);
  const checksums = manifest.checksums ?? {};
  const checksumKeys = Object.keys(checksums);
  if (!arraysEqual([...checksumKeys].sort(), [...expectedFiles].sort())) {
    throw new Error('export manifest checksum file list does not match the expected files');
  }

  for (const filename of expectedFiles) {
    let content;
    try {
      content = readFileSync(join(exportDirectory, filename), 'utf8');
    } catch {
      throw new Error('export data file is missing or unreadable');
    }

    const digest = createHash('sha256').update(content, 'utf8').digest('hex');
    if (digest !== checksums[filename]) {
      throw new Error('export data checksum does not match the manifest');
    }
  }

  return true;
}

/**
 * Builds the one approved, redacted JSON evidence summary. Only the fixed,
 * documented safe fields are ever included; `environment` and `remote` are
 * always forced to their fixed local-only values regardless of caller
 * input, so no caller can widen this command's declared safety shape.
 */
export function buildEvidenceSummary(input) {
  return {
    environment: 'local-synthetic',
    migrationName: input.migrationName,
    rowCounts: input.rowCounts,
    foreignKeyViolations: input.foreignKeyViolations,
    excludedProjectionCount: input.excludedProjectionCount,
    exportChecksumsValid: input.exportChecksumsValid,
    remote: false,
  };
}

function queryArgs(sql) {
  return [
    'd1',
    'execute',
    DATABASE_NAME,
    '--local',
    '--config',
    wranglerConfigPath,
    '--command',
    sql,
    '--json',
  ];
}

function fileArgs(filePath) {
  return [
    'd1',
    'execute',
    DATABASE_NAME,
    '--local',
    '--config',
    wranglerConfigPath,
    '--file',
    filePath,
    '--json',
  ];
}

/**
 * Runs one fixed Wrangler local D1 invocation via `execFileSync` with a
 * fixed argument array -- never a shell, never interpolated text. Only
 * stdout is captured for parsing; any failure (nonzero exit, spawn error)
 * is mapped to a safe, generic, stage-named error with the real
 * stdout/stderr discarded so no raw CLI output or credentials ever surface.
 */
function runWrangler(args, stage) {
  try {
    return execFileSync(process.execPath, [wranglerBinPath, ...args], {
      cwd: workerRoot,
      encoding: 'utf8',
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    throw new Error(`local Wrangler verification failed at ${stage}`);
  }
}

async function main() {
  assertNoArguments(process.argv.slice(2));

  const tableCheckRows = parseResultRows(
    runWrangler(queryArgs(TABLE_CHECK_SQL), 'schema-check'),
    'schema-check',
  );
  const existingTableNames = tableCheckRows.map((row) => row.name);
  const schemaState = classifyTableState(existingTableNames, EXPECTED_TABLE_NAMES);

  if (schemaState === 'partial') {
    throw new Error('local synthetic database has an incomplete or unexpected schema');
  }

  if (schemaState === 'absent') {
    assertMigrationApplied(
      runWrangler(fileArgs(migrationPath), 'migration-apply'),
      'migration-apply',
    );
  }

  const rowCountRows = parseResultRows(
    runWrangler(queryArgs(ROW_COUNT_SQL), 'row-count'),
    'row-count',
  );
  const rowCounts = rowCountRows[0] ?? {};
  verifyRowCounts(rowCounts, EXPECTED_ROW_COUNTS);

  const foreignKeyRows = parseResultRows(
    runWrangler(queryArgs(FOREIGN_KEY_CHECK_SQL), 'foreign-key-check'),
    'foreign-key-check',
  );
  if (foreignKeyRows.length !== 0) {
    throw new Error('local synthetic database failed the foreign-key integrity check');
  }

  const exclusionRows = parseResultRows(
    runWrangler(queryArgs(EXCLUSION_CHECK_SQL), 'exclusion-check'),
    'exclusion-check',
  );
  const exclusion = exclusionRows[0] ?? {};
  if (exclusion.excluded_listing_count !== 1 || exclusion.excluded_term_count !== 0) {
    throw new Error('local synthetic database failed the stale-listing exclusion check');
  }
  if (exclusion.excluded_projection_count !== 0) {
    throw new Error('local synthetic database failed the stale-listing exclusion check');
  }

  verifyExportDirectory(exportDirectoryPath, EXPECTED_TABLES);

  const summary = buildEvidenceSummary({
    migrationName: MIGRATION_NAME,
    rowCounts: {
      medicine_concepts: rowCounts.medicine_concepts,
      pharmacy_organisations: rowCounts.pharmacy_organisations,
      pharmacy_branches: rowCounts.pharmacy_branches,
      medicine_listings: rowCounts.medicine_listings,
      public_search_projection: rowCounts.public_search_projection,
      public_search_terms: rowCounts.public_search_terms,
    },
    foreignKeyViolations: [],
    excludedProjectionCount: exclusion.excluded_projection_count,
    exportChecksumsValid: true,
  });

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  main().catch((err) => {
    const message = err instanceof Error ? err.message : 'local synthetic verification failed';
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
