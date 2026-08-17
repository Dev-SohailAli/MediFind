import type { Env } from '../types/env.js';

export type D1Outcome<TRow> =
  | { readonly status: 'ok'; readonly row: TRow | null }
  | {
      readonly status: 'unavailable';
      readonly reason: 'binding_disabled' | 'quota_or_provider_error';
    };

/**
 * Reads a single synthetic-only row and fails closed on any binding/provider
 * problem. D1 has no live binding in this task (see `Env.DB`), so today this
 * always resolves `unavailable`/`binding_disabled`; the error-handling path
 * is still exercised directly in tests using an injected binding so the
 * fail-closed contract is proven before any real binding is ever wired in.
 */
export async function readSyntheticConfig<TRow = unknown>(env: Env): Promise<D1Outcome<TRow>> {
  if (!env.DB) {
    return { status: 'unavailable', reason: 'binding_disabled' };
  }

  try {
    const row = await env.DB.prepare('SELECT * FROM synthetic_config LIMIT 1').bind().first<TRow>();

    return { status: 'ok', row };
  } catch {
    return { status: 'unavailable', reason: 'quota_or_provider_error' };
  }
}
