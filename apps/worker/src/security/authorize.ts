import type { ActorContext } from './actor.js';

export interface AuthorizationRequest {
  readonly actor: ActorContext;
  readonly action: string;
  readonly resourceBranchId?: string;
}

export type AuthorizationDecision =
  { readonly allowed: true } | { readonly allowed: false; readonly reason: 'unauthenticated' };

// The only actions approved so far are the public health/config read (Task
// 3 foundation) and the read-only synthetic search/listing routes accepted
// in ADR-275 / docs/task-4-synthetic-d1-data-contract-proposal.md ("Worker
// route authorization and response mapper" is the sole owner of this
// decision; the database never receives a role from the browser). Every
// other action is denied because no authenticated actor can exist yet: this
// is a fail-closed default, not an allow-list waiting to be filled in ad hoc
// by a route handler.
const PUBLIC_ACTIONS = new Set<string>(['health:read', 'search:read', 'listing:read']);

export function authorize(request: AuthorizationRequest): AuthorizationDecision {
  if (PUBLIC_ACTIONS.has(request.action)) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'unauthenticated' };
}
