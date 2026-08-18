/**
 * Single source of truth for the content patterns that must never appear in
 * a built, public Pages preview artifact: env files, credential-looking
 * secrets, Cloudflare account/binding identifiers, an emitted Pages
 * Function, an analytics SDK call, a cookie write or a client-storage
 * write.
 *
 * Both the CI/local `verify:preview` guard
 * (apps/web/scripts/verify-preview-build.mjs) and the artifact-boundary
 * test suite (apps/web/__tests__/pages-preview.test.ts) import this exact
 * list so the two enforcement paths can never drift apart on what counts as
 * a forbidden marker.
 *
 * Presence of the *inert, unused* bundled Worker adapter source (see
 * src/search/searchClient.ts) is deliberately NOT matched by any pattern
 * here — its `/v1/search` string and `fetch(` call are reachable-but-inert
 * code, not an emitted capability. Only an actual capability write (a
 * cookie assignment, a client-storage write, a Pages Function export, a
 * live binding/credential, or an analytics SDK invocation) is forbidden.
 */

/** @type {ReadonlyArray<{ code: string, pattern: RegExp }>} */
export const FORBIDDEN_CONTENT_PATTERNS = [
  { code: 'forbidden-account-id', pattern: /account_id/i },
  { code: 'forbidden-d1-binding', pattern: /\[\[d1_databases\]\]|d1_databases/i },
  { code: 'forbidden-kv-binding', pattern: /\[\[kv_namespaces\]\]|kv_namespaces/i },
  { code: 'forbidden-r2-binding', pattern: /\[\[r2_buckets\]\]|r2_buckets/i },
  { code: 'forbidden-credential', pattern: /CLOUDFLARE_API_TOKEN|AKIA[0-9A-Z]{16}/ },
  { code: 'forbidden-pages-function', pattern: /export\s+(async\s+)?function\s+onRequest/i },
  { code: 'forbidden-analytics', pattern: /google-analytics\.com|gtag\(|googletagmanager\.com/i },
  // Only an actual cookie *write* is a forbidden emitted capability — the
  // bundled-but-unused Worker adapter and any incidental library code may
  // legitimately reference `document.cookie` for a read without that being
  // a leak. See the module header for the "capability, not presence" rule.
  { code: 'forbidden-cookie-write', pattern: /document\.cookie\s*=/ },
  {
    code: 'forbidden-client-storage',
    pattern: /\b(localStorage|sessionStorage|indexedDB)\s*\.\s*(setItem|open|put|transaction)\s*\(/,
  },
];
