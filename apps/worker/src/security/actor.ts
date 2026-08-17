export interface ActorContext {
  readonly type: 'anonymous';
  readonly actorId: null;
}

// No approved web authentication adapter exists yet (see
// docs/task-3-protected-platform-foundation-specification.md), so every
// request is treated as anonymous regardless of any client-supplied
// actor/role/authorization header. This function intentionally never reads
// request headers to derive identity. The parameter is kept so call sites
// and the future adapter wiring do not need to change shape later.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deriveActor(request: Request): ActorContext {
  return { type: 'anonymous', actorId: null };
}
