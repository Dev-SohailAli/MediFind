import { describe, expect, it } from 'vitest';

import { createInMemoryAuditSink } from '../security/audit.js';
import type { AuditEvent } from '../security/audit.js';

const baseEvent: AuditEvent = {
  eventId: 'event-1',
  occurredAt: '2026-08-17T00:00:00.000Z',
  actorType: 'anonymous',
  actorId: null,
  action: 'health:read',
  targetType: 'worker_config',
  targetId: null,
  requestId: 'request-1',
  outcome: 'success',
};

describe('audit sink redaction seam', () => {
  it('accepts and stores a well-formed, minimum-field safe event', () => {
    const sink = createInMemoryAuditSink();

    sink.write(baseEvent);

    expect(sink.events).toEqual([baseEvent]);
  });

  it('rejects an event carrying a phone/email/name/prescription-shaped field', () => {
    const sink = createInMemoryAuditSink();

    const forbiddenKeys = [
      'phoneNumber',
      'email',
      'buyerName',
      'prescriptionNote',
      'otp',
      'password',
      'token',
    ];

    for (const key of forbiddenKeys) {
      expect(() => sink.write({ ...baseEvent, [key]: 'value' } as AuditEvent)).toThrow(
        /redaction/i,
      );
    }
  });

  it('never stores a rejected event', () => {
    const sink = createInMemoryAuditSink();

    try {
      sink.write({ ...baseEvent, email: 'buyer@example.com' } as AuditEvent);
    } catch {
      // expected
    }

    expect(sink.events).toEqual([]);
  });
});
