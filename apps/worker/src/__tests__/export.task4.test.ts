import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  medicineConcepts,
  medicineListings,
  pharmacyBranches,
  pharmacyOrganisations,
  publicSearchProjection,
  publicSearchTerms,
} from '../fixtures/task4SyntheticD1.js';
import { buildSyntheticExport } from '../data/export.js';

const exportDir = fileURLToPath(
  new URL('../../exports/task-4-synthetic-d1-export-v1', import.meta.url),
);

async function buildTask4Export() {
  return buildSyntheticExport(
    [
      {
        name: 'medicine_concepts',
        rows: [...medicineConcepts].sort((a, b) => a.id.localeCompare(b.id)),
      },
      {
        name: 'pharmacy_organisations',
        rows: [...pharmacyOrganisations].sort((a, b) => a.id.localeCompare(b.id)),
      },
      {
        name: 'pharmacy_branches',
        rows: [...pharmacyBranches].sort((a, b) => a.id.localeCompare(b.id)),
      },
      {
        name: 'medicine_listings',
        rows: [...medicineListings].sort((a, b) => a.id.localeCompare(b.id)),
      },
      { name: 'public_search_projection', rows: publicSearchProjection }, // already sorted by projection.ts
      { name: 'public_search_terms', rows: publicSearchTerms }, // already sorted by projection.ts
    ],
    1,
  );
}

describe('Task 4 synthetic export (built from the accepted fixture set)', () => {
  it('produces the exact accepted table set and row counts', async () => {
    const built = await buildTask4Export();

    expect(built.manifest.tables).toEqual([
      'medicine_concepts',
      'pharmacy_organisations',
      'pharmacy_branches',
      'medicine_listings',
      'public_search_projection',
      'public_search_terms',
    ]);
    expect(built.manifest.row_counts).toEqual({
      medicine_concepts: 7,
      pharmacy_organisations: 4,
      pharmacy_branches: 4,
      medicine_listings: 8,
      public_search_projection: 7,
      public_search_terms: publicSearchTerms.length,
    });
    expect(built.manifest.synthetic_only).toBe(true);
    expect(built.manifest.contains_real_data).toBe(false);
  });

  it('matches the committed reviewable export evidence in apps/worker/exports/ exactly', async () => {
    const built = await buildTask4Export();
    const committedManifest = JSON.parse(readFileSync(`${exportDir}/manifest.json`, 'utf8'));

    expect(committedManifest).toEqual(built.manifest);

    for (const [filename, content] of Object.entries(built.files)) {
      expect(readFileSync(`${exportDir}/${filename}`, 'utf8')).toBe(content);
    }
  });

  it('the committed schema.sql is byte-identical to the DDL portion of the migration', () => {
    const migration = readFileSync(
      fileURLToPath(new URL('../../migrations/0001_task4_synthetic_search.sql', import.meta.url)),
      'utf8',
    );
    const committedSchema = readFileSync(`${exportDir}/schema.sql`, 'utf8');

    // The schema.sql evidence file is the DDL-only prefix of the migration
    // (everything up to, but not including, the first INSERT statement).
    const ddlOnly = migration.slice(0, migration.indexOf('\n-- Reviewed synthetic fixtures'));
    expect(committedSchema.trim()).toBe(ddlOnly.trim());
  });
});
