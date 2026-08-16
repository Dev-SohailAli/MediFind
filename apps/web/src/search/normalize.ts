/**
 * Deterministic query/candidate normalization: trim, lowercase, collapse
 * whitespace and strip only harmless punctuation. No fuzzy/semantic
 * transformation is applied.
 */
const HARMLESS_PUNCTUATION = /[.,!?;:'"()[\]{}]/g;

export function normalizeText(raw: string): string {
  return raw.trim().toLowerCase().replace(HARMLESS_PUNCTUATION, '').replace(/\s+/g, ' ').trim();
}

export function tokenize(normalized: string): string[] {
  return normalized.split(' ').filter((token) => token.length > 0);
}
