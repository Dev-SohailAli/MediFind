import { describe, expect, it } from 'vitest';

import {
  ALLOWED_HIGH_CRITICAL_ADVISORIES,
  AUDIT_EXCEPTION_EXPIRY,
  AUDIT_EXCEPTION_REFERENCE,
  evaluateAuditReport,
} from '../scripts/audit-guard.mts';

const WITHIN_EXPIRY = new Date('2026-08-16T00:00:00Z');
const AFTER_EXPIRY = new Date('2026-09-16T00:00:00Z');

function advisory(overrides: {
  id: number;
  githubAdvisoryId?: string;
  moduleName?: string;
  severity?: string;
  version?: string;
  paths?: string[];
}) {
  return {
    id: overrides.id,
    title: 'synthetic test advisory',
    module_name: overrides.moduleName ?? 'image-size',
    severity: overrides.severity ?? 'high',
    github_advisory_id: overrides.githubAdvisoryId,
    findings: [
      {
        version: overrides.version ?? '1.2.1',
        paths: overrides.paths ?? ['apps__mobile>expo>@expo/cli>metro>image-size'],
      },
    ],
  };
}

function report(advisories: ReturnType<typeof advisory>[]): string {
  const byId: Record<string, ReturnType<typeof advisory>> = {};
  for (const entry of advisories) {
    byId[String(entry.id)] = entry;
  }
  return JSON.stringify({ advisories: byId });
}

const baseOptions = {
  now: WITHIN_EXPIRY,
  expiryDate: AUDIT_EXCEPTION_EXPIRY,
  allowedAdvisories: ALLOWED_HIGH_CRITICAL_ADVISORIES,
};

describe('audit-guard evaluateAuditReport', () => {
  it('passes when audit reports no CRITICAL/HIGH findings at all', () => {
    const result = evaluateAuditReport(report([]), baseOptions);

    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
  });

  it('passes when only the two allowed image-size advisories are present, unexpired', () => {
    const raw = report([
      advisory({ id: 1138808, githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr' }),
      advisory({ id: 1138809, githubAdvisoryId: 'GHSA-5p2g-fcmc-qvqq' }),
    ]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(result.summary).toContain(AUDIT_EXCEPTION_REFERENCE);
    expect(result.summary).toContain('GHSA-w3rx-r6r6-pgpr');
    expect(result.summary).toContain('GHSA-5p2g-fcmc-qvqq');
  });

  it('fails when an unexpected HIGH/CRITICAL advisory appears alongside the allowed ones', () => {
    const raw = report([
      advisory({ id: 1138808, githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr' }),
      advisory({ id: 1138809, githubAdvisoryId: 'GHSA-5p2g-fcmc-qvqq' }),
      advisory({
        id: 9999999,
        githubAdvisoryId: 'GHSA-zzzz-zzzz-zzzz',
        moduleName: 'left-pad',
        severity: 'critical',
      }),
    ]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary).toContain('Unexpected');
    expect(result.summary).toContain('GHSA-zzzz-zzzz-zzzz');
  });

  it('fails when only one of the two expected advisories is present (partial match)', () => {
    const raw = report([advisory({ id: 1138808, githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr' })]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary).toContain('missing');
    expect(result.summary).toContain('GHSA-5p2g-fcmc-qvqq');
  });

  it("fails when the advisory's package changes unexpectedly", () => {
    const raw = report([
      advisory({
        id: 1138808,
        githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr',
        moduleName: 'not-image-size',
      }),
      advisory({ id: 1138809, githubAdvisoryId: 'GHSA-5p2g-fcmc-qvqq' }),
    ]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary).toContain('module');
  });

  it("fails when the advisory's version changes unexpectedly", () => {
    const raw = report([
      advisory({ id: 1138808, githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr', version: '2.0.0' }),
      advisory({ id: 1138809, githubAdvisoryId: 'GHSA-5p2g-fcmc-qvqq' }),
    ]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary).toContain('version');
  });

  it("fails when the advisory's dependency path changes unexpectedly", () => {
    const raw = report([
      advisory({
        id: 1138808,
        githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr',
        paths: ['apps__api>some-new-consumer>image-size'],
      }),
      advisory({ id: 1138809, githubAdvisoryId: 'GHSA-5p2g-fcmc-qvqq' }),
    ]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary).toContain('dependency path');
  });

  it('fails closed when the audit output cannot be parsed as JSON', () => {
    const result = evaluateAuditReport('not valid json {{{', baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary.toLowerCase()).toContain('parsed');
  });

  it('fails closed when the audit output is valid JSON but the wrong shape', () => {
    const result = evaluateAuditReport(JSON.stringify({ unexpected: true }), baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
  });

  it('fails when the exception is evaluated after its expiry date', () => {
    const raw = report([
      advisory({ id: 1138808, githubAdvisoryId: 'GHSA-w3rx-r6r6-pgpr' }),
      advisory({ id: 1138809, githubAdvisoryId: 'GHSA-5p2g-fcmc-qvqq' }),
    ]);

    const result = evaluateAuditReport(raw, { ...baseOptions, now: AFTER_EXPIRY });

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.summary).toContain('expired');
  });

  it('ignores MODERATE/LOW findings and does not require the exception for them', () => {
    const raw = report([
      advisory({ id: 42, githubAdvisoryId: 'GHSA-mmmm-mmmm-mmmm', severity: 'moderate' }),
    ]);

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
  });
});
