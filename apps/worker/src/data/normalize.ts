/**
 * Worker-owned copy of the deterministic normalization used by
 * apps/web/src/search/normalize.ts. The Worker package cannot depend on
 * apps/web (package boundary), so this is intentionally a second, identical
 * implementation rather than a shared import; a migration/projection-builder
 * test proves the two stay behaviourally equivalent for the accepted Task 4
 * fixture set. Trim, lowercase, collapse whitespace, strip only harmless
 * punctuation. No fuzzy/semantic transformation.
 */
const HARMLESS_PUNCTUATION = /[.,!?;:'"()[\]{}]/g;

export function normalizeText(raw: string): string {
  return raw.trim().toLowerCase().replace(HARMLESS_PUNCTUATION, '').replace(/\s+/g, ' ').trim();
}

export function tokenizeWords(normalized: string): string[] {
  return normalized.split(' ').filter((token) => token.length > 0);
}
