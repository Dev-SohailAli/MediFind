import type { Env, WorkerEnvironment } from '../types/env.js';

export interface HealthConfig {
  readonly status: 'ok';
  readonly service: 'medifind-worker';
  readonly environment: WorkerEnvironment;
}

// Safe public configuration only (docs/v1-api-endpoint-inventory.md "Health/
// config" foundation candidate). Never add a binding presence flag, account
// identifier or anything else derived from `env` here without a task that
// approves disclosing it publicly and unauthenticated.
export function buildHealthConfig(env: Env): HealthConfig {
  return {
    status: 'ok',
    service: 'medifind-worker',
    environment: env.ENVIRONMENT ?? 'local',
  };
}
