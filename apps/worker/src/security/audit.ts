export interface AuditEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly actorType: string;
  readonly actorId: string | null;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string | null;
  readonly requestId: string;
  readonly outcome: 'success' | 'denied' | 'error';
}

export interface AuditSink {
  write(event: AuditEvent): void;
}

// Matches the audit-log-policy.md prohibited-content list (never prescription
// content, tokens, OTPs, passwords or raw contact/free-text values). This
// checks field *names* because this seam has no way to know a caller's
// runtime string is a real phone/email value; forbidding the shape of the
// field is the safe default for every future caller of this sink.
const FORBIDDEN_FIELD_NAME_PATTERN =
  /phone|email|name|prescription|password|token|otp|address|search|freetext|note/i;

const ALLOWED_EVENT_KEYS = new Set<keyof AuditEvent>([
  'eventId',
  'occurredAt',
  'actorType',
  'actorId',
  'action',
  'targetType',
  'targetId',
  'requestId',
  'outcome',
]);

export function assertRedacted(event: Record<string, unknown>): void {
  for (const key of Object.keys(event)) {
    if (
      !ALLOWED_EVENT_KEYS.has(key as keyof AuditEvent) ||
      FORBIDDEN_FIELD_NAME_PATTERN.test(key)
    ) {
      throw new Error(
        `audit event field "${key}" failed redaction: not an approved safe audit field`,
      );
    }
  }
}

export function createInMemoryAuditSink(): AuditSink & { readonly events: readonly AuditEvent[] } {
  const events: AuditEvent[] = [];

  return {
    events,
    write(event) {
      assertRedacted(event as unknown as Record<string, unknown>);
      events.push(event);
    },
  };
}
