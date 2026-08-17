import type { ActorContext } from './actor.js';

export interface AuthorizationRequest {
  readonly actor: ActorContext;
  readonly action: string;
  readonly resourceBranchId?: string;
}

export type AuthorizationDecision =
  { readonly allowed: true } | { readonly allowed: false; readonly reason: 'unauthenticated' };

// The only action approved for this foundation task is the public
// health/config read (see the "Health/config" foundation candidate in
// docs/v1-api-endpoint-inventory.md). Every other action is denied because no
// authenticated actor can exist yet: this is a fail-closed default, not an
// allow-list waiting to be filled in ad hoc by a route handler.
const PUBLIC_ACTIONS = new Set<string>(['health:read']);

export function authorize(request: AuthorizationRequest): AuthorizationDecision {
  if (PUBLIC_ACTIONS.has(request.action)) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'unauthenticated' };
}
