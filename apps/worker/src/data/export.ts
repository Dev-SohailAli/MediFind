export interface ExportTable {
  readonly name: string;
  readonly rows: readonly object[];
}

export interface ExportManifest {
  readonly format_version: number;
  readonly schema_version: number;
  readonly synthetic_only: true;
  readonly contains_real_data: false;
  readonly tables: readonly string[];
  readonly row_counts: Readonly<Record<string, number>>;
  readonly checksums: Readonly<Record<string, string>>;
}

export interface BuiltExport {
  readonly manifest: ExportManifest;
  readonly files: Readonly<Record<string, string>>;
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** One complete JSON object per line, UTF-8, trailing newline if non-empty. */
function toJsonl(rows: readonly object[]): string {
  if (rows.length === 0) return '';
  return `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`;
}

/**
 * Builds the versioned logical export/checksum manifest described in
 * docs/task-4-synthetic-d1-data-contract-proposal.md ("Export and migration
 * shape"): one JSONL file per table (rows must already be supplied sorted by
 * primary key) plus a manifest with per-file SHA-256 checksums. This is
 * repository-local, review-time tooling — no production export artifact and
 * no D1 account are involved. Uses Web Crypto (`crypto.subtle`), the same
 * API already used by http/errors.ts's `crypto.randomUUID()`, so this stays
 * portable to the Worker runtime even though only tests/scripts call it.
 */
export async function buildSyntheticExport(
  tables: readonly ExportTable[],
  schemaVersion: number,
): Promise<BuiltExport> {
  const files: Record<string, string> = {};
  const rowCounts: Record<string, number> = {};
  const checksums: Record<string, string> = {};

  for (const table of tables) {
    const filename = `data/${table.name}.jsonl`;
    const content = toJsonl(table.rows);
    files[filename] = content;
    rowCounts[table.name] = table.rows.length;
    checksums[filename] = await sha256Hex(content);
  }

  const manifest: ExportManifest = {
    format_version: 1,
    schema_version: schemaVersion,
    synthetic_only: true,
    contains_real_data: false,
    tables: tables.map((table) => table.name),
    row_counts: rowCounts,
    checksums,
  };

  return { manifest, files };
}
