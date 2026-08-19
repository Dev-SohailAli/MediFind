import { describe, expect, it } from 'vitest';

import { buildSyntheticExport } from '../export.js';

const tables = [
  { name: 'medicine_concepts', rows: [{ id: 'concept-a', display_name: 'Aardvarkin' }] },
  { name: 'pharmacy_organisations', rows: [] },
];

describe('buildSyntheticExport', () => {
  it('produces one sorted-primary-key JSONL file per table with a trailing newline', async () => {
    const built = await buildSyntheticExport(tables, 1);

    expect(built.files['data/medicine_concepts.jsonl']).toBe(
      '{"id":"concept-a","display_name":"Aardvarkin"}\n',
    );
    expect(built.files['data/pharmacy_organisations.jsonl']).toBe('');
  });

  it('reports exact row counts per table', async () => {
    const built = await buildSyntheticExport(tables, 1);

    expect(built.manifest.row_counts).toEqual({ medicine_concepts: 1, pharmacy_organisations: 0 });
  });

  it('marks the export synthetic-only and containing no real data', async () => {
    const built = await buildSyntheticExport(tables, 1);

    expect(built.manifest.synthetic_only).toBe(true);
    expect(built.manifest.contains_real_data).toBe(false);
  });

  it('computes a stable SHA-256 checksum per file, deterministic across repeated builds', async () => {
    const first = await buildSyntheticExport(tables, 1);
    const second = await buildSyntheticExport(tables, 1);

    expect(first.manifest.checksums).toEqual(second.manifest.checksums);
    expect(first.manifest.checksums['data/medicine_concepts.jsonl']).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces a different checksum when the row content changes', async () => {
    const changed = await buildSyntheticExport(
      [{ name: 'medicine_concepts', rows: [{ id: 'concept-a', display_name: 'Different' }] }],
      1,
    );
    const original = await buildSyntheticExport(
      [{ name: 'medicine_concepts', rows: [{ id: 'concept-a', display_name: 'Aardvarkin' }] }],
      1,
    );

    expect(changed.manifest.checksums['data/medicine_concepts.jsonl']).not.toBe(
      original.manifest.checksums['data/medicine_concepts.jsonl'],
    );
  });

  it('lists every table name in manifest.tables in the order supplied', async () => {
    const built = await buildSyntheticExport(tables, 1);

    expect(built.manifest.tables).toEqual(['medicine_concepts', 'pharmacy_organisations']);
  });
});
