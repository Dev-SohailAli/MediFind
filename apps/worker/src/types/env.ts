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
  // Never populated by this task. D1 stays disabled until a separate task
  // supplies an exact schema, migration and founder-approved synthetic
  // database (docs/task-3-protected-platform-foundation-specification.md).
  readonly DB?: D1LikeBinding;
}
