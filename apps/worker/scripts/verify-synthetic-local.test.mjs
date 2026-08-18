import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  assertMigrationApplied,
  assertNoArguments,
  buildEvidenceSummary,
  classifyTableState,
  parseResultRows,
  verifyExportDirectory,
  verifyRowCounts,
} from './verify-synthetic-local.mjs';

const scriptPath = fileURLToPath(new URL('./verify-synthetic-local.mjs', import.meta.url));
const committedExportDir = fileURLToPath(
  new URL('../exports/task-4-synthetic-d1-export-v1', import.meta.url),
);

const EXPECTED_TABLES = [
  { name: 'medicine_concepts', rowCount: 7 },
  { name: 'pharmacy_organisations', rowCount: 4 },
  { name: 'pharmacy_branches', rowCount: 4 },
  { name: 'medicine_listings', rowCount: 8 },
  { name: 'public_search_projection', rowCount: 7 },
  { name: 'public_search_terms', rowCount: 31 },
];
const EXPECTED_ROW_COUNTS = Object.fromEntries(EXPECTED_TABLES.map((t) => [t.name, t.rowCount]));

function spawnScript(args) {
  return spawnSync(process.execPath, [scriptPath, ...args], { encoding: 'utf8' });
}

function makeTempExportCopy() {
  const dir = mkdtempSync(join(tmpdir(), 'medifind-verify-export-'));
  cpSync(committedExportDir, dir, { recursive: true });
  return dir;
}

function withTempExportCopy(mutate, assertFn) {
  const dir = makeTempExportCopy();
  try {
    mutate(dir);
    assertFn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('parseResultRows', () => {
  it('extracts rows from one successful fixed-shape Wrangler JSON result', () => {
    const value = JSON.stringify([{ results: [{ n: 1 }], success: true, meta: { duration: 0 } }]);
    expect(parseResultRows(value, 'test-stage')).toEqual([{ n: 1 }]);
  });

  it('rejects malformed (non-JSON) CLI output', () => {
    expect(() => parseResultRows('not json at all', 'test-stage')).toThrow(
      'local Wrangler verification failed at test-stage',
    );
  });

  it('rejects a non-array top-level payload', () => {
    expect(() => parseResultRows(JSON.stringify({ results: [] }), 'test-stage')).toThrow(
      /test-stage/,
    );
  });

  it('rejects zero or more than one statement result', () => {
    expect(() => parseResultRows(JSON.stringify([]), 'test-stage')).toThrow(/test-stage/);
    expect(() =>
      parseResultRows(
        JSON.stringify([
          { results: [], success: true },
          { results: [], success: true },
        ]),
        'test-stage',
      ),
    ).toThrow(/test-stage/);
  });

  it('rejects an entry reporting failure', () => {
    expect(() =>
      parseResultRows(JSON.stringify([{ success: false, results: [] }]), 'test-stage'),
    ).toThrow(/test-stage/);
  });

  it('rejects a missing results array', () => {
    expect(() => parseResultRows(JSON.stringify([{ success: true }]), 'test-stage')).toThrow(
      /test-stage/,
    );
  });

  it('never echoes the raw offending payload in the error message', () => {
    let thrown;
    try {
      parseResultRows('super-secret-token-xyz', 'test-stage');
    } catch (err) {
      thrown = err;
    }
    expect(thrown).toBeInstanceOf(Error);
    expect(thrown.message).not.toContain('super-secret-token-xyz');
  });
});

describe('assertMigrationApplied', () => {
  it('accepts a multi-statement payload where every statement succeeded', () => {
    const value = JSON.stringify([
      { results: [], success: true },
      { results: [], success: true },
    ]);
    expect(() => assertMigrationApplied(value, 'migration-apply')).not.toThrow();
  });

  it('rejects a payload where any statement failed', () => {
    const value = JSON.stringify([
      { results: [], success: true },
      { results: [], success: false },
    ]);
    expect(() => assertMigrationApplied(value, 'migration-apply')).toThrow(/migration-apply/);
  });

  it('rejects malformed CLI JSON', () => {
    expect(() => assertMigrationApplied('{not json', 'migration-apply')).toThrow(/migration-apply/);
  });

  it('rejects an empty statement list', () => {
    expect(() => assertMigrationApplied(JSON.stringify([]), 'migration-apply')).toThrow(
      /migration-apply/,
    );
  });
});

describe('classifyTableState', () => {
  const expected = EXPECTED_TABLES.map((t) => t.name);

  it('reports "absent" when none of the expected tables exist', () => {
    expect(classifyTableState([], expected)).toBe('absent');
  });

  it('reports "complete" when all expected tables exist', () => {
    expect(classifyTableState(expected, expected)).toBe('complete');
  });

  it('reports "partial" (fail-closed) when only some expected tables exist', () => {
    expect(classifyTableState([expected[0], expected[1]], expected)).toBe('partial');
  });
});

describe('verifyRowCounts', () => {
  it('accepts row counts that match exactly', () => {
    expect(verifyRowCounts(EXPECTED_ROW_COUNTS, EXPECTED_ROW_COUNTS)).toBe(true);
  });

  it('rejects an altered count for one table', () => {
    const altered = { ...EXPECTED_ROW_COUNTS, medicine_concepts: 9999 };
    expect(() => verifyRowCounts(altered, EXPECTED_ROW_COUNTS)).toThrow(
      'local synthetic database row counts do not match the expected six-table shape',
    );
  });

  it('rejects a missing table', () => {
    const missing = { ...EXPECTED_ROW_COUNTS };
    delete missing.medicine_concepts;
    expect(() => verifyRowCounts(missing, EXPECTED_ROW_COUNTS)).toThrow(/expected six-table shape/);
  });

  it('rejects an unexpected extra table', () => {
    const extra = { ...EXPECTED_ROW_COUNTS, unapproved_table: 1 };
    expect(() => verifyRowCounts(extra, EXPECTED_ROW_COUNTS)).toThrow(/expected six-table shape/);
  });
});

describe('verifyExportDirectory', () => {
  it('accepts the committed Task 4 export exactly as-is', () => {
    expect(verifyExportDirectory(committedExportDir, EXPECTED_TABLES)).toBe(true);
  });

  it('fails closed on an altered row count in the manifest', () => {
    withTempExportCopy(
      (dir) => {
        const manifestPath = join(dir, 'manifest.json');
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        manifest.row_counts.medicine_concepts = 42;
        writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export manifest row counts do not match the expected tables',
        );
      },
    );
  });

  it('fails closed on an altered checksum in the manifest', () => {
    withTempExportCopy(
      (dir) => {
        const manifestPath = join(dir, 'manifest.json');
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        manifest.checksums['data/medicine_concepts.jsonl'] = '0'.repeat(64);
        writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export data checksum does not match the manifest',
        );
      },
    );
  });

  it('fails closed when a data file is altered without updating its checksum', () => {
    withTempExportCopy(
      (dir) => {
        const dataPath = join(dir, 'data', 'medicine_concepts.jsonl');
        writeFileSync(dataPath, `${readFileSync(dataPath, 'utf8')}\n`, 'utf8');
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export data checksum does not match the manifest',
        );
      },
    );
  });

  it('fails closed when an expected data file is missing', () => {
    withTempExportCopy(
      (dir) => {
        rmSync(join(dir, 'data', 'medicine_concepts.jsonl'));
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export data file is missing or unreadable',
        );
      },
    );
  });

  it('fails closed when an unapproved extra table is added to the manifest', () => {
    withTempExportCopy(
      (dir) => {
        const manifestPath = join(dir, 'manifest.json');
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        manifest.tables.push('unapproved_table');
        manifest.row_counts.unapproved_table = 1;
        manifest.checksums['data/unapproved_table.jsonl'] = '0'.repeat(64);
        writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export manifest table list does not match the expected tables',
        );
      },
    );
  });

  it('fails closed when synthetic_only is false', () => {
    withTempExportCopy(
      (dir) => {
        const manifestPath = join(dir, 'manifest.json');
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        manifest.synthetic_only = false;
        writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export manifest failed the synthetic-only safety check',
        );
      },
    );
  });

  it('fails closed when contains_real_data is true', () => {
    withTempExportCopy(
      (dir) => {
        const manifestPath = join(dir, 'manifest.json');
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        manifest.contains_real_data = true;
        writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export manifest failed the synthetic-only safety check',
        );
      },
    );
  });

  it('fails closed when the manifest file is missing', () => {
    withTempExportCopy(
      (dir) => {
        rmSync(join(dir, 'manifest.json'));
      },
      (dir) => {
        expect(() => verifyExportDirectory(dir, EXPECTED_TABLES)).toThrow(
          'export manifest is missing or unreadable',
        );
      },
    );
  });
});

describe('buildEvidenceSummary', () => {
  it('emits exactly the approved safe fields in the documented shape', () => {
    const summary = buildEvidenceSummary({
      migrationName: '0001_task4_synthetic_search.sql',
      rowCounts: EXPECTED_ROW_COUNTS,
      foreignKeyViolations: [],
      excludedProjectionCount: 0,
      exportChecksumsValid: true,
    });

    expect(summary).toEqual({
      environment: 'local-synthetic',
      migrationName: '0001_task4_synthetic_search.sql',
      rowCounts: EXPECTED_ROW_COUNTS,
      foreignKeyViolations: [],
      excludedProjectionCount: 0,
      exportChecksumsValid: true,
      remote: false,
    });
    expect(Object.keys(summary)).toEqual([
      'environment',
      'migrationName',
      'rowCounts',
      'foreignKeyViolations',
      'excludedProjectionCount',
      'exportChecksumsValid',
      'remote',
    ]);
  });

  it('forces remote:false and environment:local-synthetic regardless of caller-supplied input', () => {
    const summary = buildEvidenceSummary({
      migrationName: 'x',
      rowCounts: {},
      foreignKeyViolations: [],
      excludedProjectionCount: 0,
      exportChecksumsValid: true,
      remote: true,
      environment: 'hosted',
    });
    expect(summary.remote).toBe(false);
    expect(summary.environment).toBe('local-synthetic');
  });
});

describe('assertNoArguments (pure)', () => {
  it('accepts an empty argument list', () => {
    expect(() => assertNoArguments([])).not.toThrow();
  });

  it('rejects any argument', () => {
    expect(() => assertNoArguments(['--remote'])).toThrow(
      'verify:local accepts no arguments; local config and SQL are fixed',
    );
  });
});

describe('command-line guard (spawned process)', () => {
  const cases = [
    { label: '--remote', args: ['--remote'] },
    { label: '--config wrangler.toml', args: ['--config', 'wrangler.toml'] },
    { label: 'arbitrary SQL-like argument', args: ['DROP TABLE medicine_concepts; --'] },
    { label: 'unknown flag', args: ['--some-unknown-flag'] },
  ];

  for (const { label, args } of cases) {
    it(`rejects ${label} with a nonzero exit and a safe stderr message, printing no stdout`, () => {
      const result = spawnScript(args);

      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain(
        'verify:local accepts no arguments; local config and SQL are fixed',
      );
      // Never leak SQL text, config file paths, credentials or provider text.
      expect(result.stderr).not.toMatch(
        /SELECT|INSERT|DROP|wrangler\.local\.toml|token|password|secret/i,
      );
    });
  }
});

describe('local command integration (spawned process against real local D1)', () => {
  // This exercises the actual command end-to-end against the real local
  // Wrangler/D1 runtime declared in wrangler.local.toml (--local only, no
  // Cloudflare account/login/token of any kind): it applies the migration
  // if the local database is empty, or verifies the existing state if it
  // is already initialized, then asserts the exact printed evidence
  // summary. Running it twice proves the already-initialized path is
  // idempotent -- it must not re-apply the migration or fail the second
  // time. Each Wrangler invocation takes roughly a second, and this test
  // makes up to ten of them (two full command runs), hence the extended
  // timeout.
  const expectedSummary = {
    environment: 'local-synthetic',
    migrationName: '0001_task4_synthetic_search.sql',
    rowCounts: EXPECTED_ROW_COUNTS,
    foreignKeyViolations: [],
    excludedProjectionCount: 0,
    exportChecksumsValid: true,
    remote: false,
  };

  it('prints the exact evidence summary and is idempotent across two consecutive runs', () => {
    const first = spawnScript([]);
    expect(first.status).toBe(0);
    expect(first.stderr).toBe('');
    const firstSummary = JSON.parse(first.stdout);
    expect(firstSummary).toEqual(expectedSummary);
    expect(Object.keys(firstSummary)).toEqual([
      'environment',
      'migrationName',
      'rowCounts',
      'foreignKeyViolations',
      'excludedProjectionCount',
      'exportChecksumsValid',
      'remote',
    ]);
    // No raw SQL, CLI output, credentials or provider text on stdout --
    // only the approved JSON summary.
    expect(first.stdout).not.toMatch(/SELECT|INSERT|PRAGMA|token|password|secret/i);

    // Re-run against the now-already-initialized local database: this
    // must take the idempotent verify-only path (no re-apply) and
    // produce the exact same result, not an error.
    const second = spawnScript([]);
    expect(second.status).toBe(0);
    expect(second.stderr).toBe('');
    const secondSummary = JSON.parse(second.stdout);
    expect(secondSummary).toEqual(expectedSummary);
    expect(secondSummary).toEqual(firstSummary);
  }, 60000);
});
