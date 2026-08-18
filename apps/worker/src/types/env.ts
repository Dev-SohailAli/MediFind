/**
 * Minimal structural shape of the one D1 operation this foundation seam
 * needs. This is intentionally not the official @cloudflare/workers-types
 * `D1Database` (no SDK dependency is added for this task); it is widened
 * only if a future approved task binds real D1 and needs more of its shape.
 */
export interface D1LikeBinding {
  prepare(query: string): {
    bind(...values: unknown[]): {
      first<T>(): Promise<T | null>;
      all<T>(): Promise<{ results: T[] }>;
    };
  };
}

export type WorkerEnvironment = 'local' | 'preview' | 'synthetic';

export interface Env {
  readonly ENVIRONMENT?: WorkerEnvironment;
  // The base/Pages Worker config leaves this optional. The local synthetic
  // Wrangler config binds the reviewed six-table D1 migration; hosted
  // bindings still require a founder-owned Cloudflare environment.
  readonly DB?: D1LikeBinding;
}
