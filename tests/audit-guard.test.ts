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

describe('audit-guard evaluateAuditReport - malformed nested entries fail closed', () => {
  const wellFormedFinding = {
    version: '1.2.1',
    paths: ['apps__mobile>expo>@expo/cli>metro>image-size'],
  };

  function reportRaw(advisoryOverride: Record<string, unknown>): string {
    return JSON.stringify({
      advisories: {
        '1138808': {
          id: 1138808,
          title: 'synthetic test advisory',
          module_name: 'image-size',
          severity: 'high',
          github_advisory_id: 'GHSA-w3rx-r6r6-pgpr',
          findings: [wellFormedFinding],
          ...advisoryOverride,
        },
      },
    });
  }

  it('fails closed when severity is missing', () => {
    const raw = reportRaw({ severity: undefined });
    // JSON.stringify drops `undefined` properties, so this genuinely omits the field.
    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('severity');
  });

  it('fails closed when severity is a non-string value', () => {
    const raw = reportRaw({ severity: 3 });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('severity');
  });

  it('fails closed when severity is a string but not a recognised severity level', () => {
    const raw = reportRaw({ severity: 'extreme' });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('severity');
  });

  it('fails closed when findings is not an array', () => {
    const raw = reportRaw({ findings: 'not-an-array' });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('findings');
  });

  it('fails closed when findings is an empty array', () => {
    const raw = reportRaw({ findings: [] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('findings');
  });

  it('fails closed when a finding is not an object', () => {
    const raw = reportRaw({ findings: ['not-an-object'] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
  });

  it("fails closed when a finding's version is missing", () => {
    const raw = reportRaw({ findings: [{ paths: wellFormedFinding.paths }] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('version');
  });

  it("fails closed when a finding's version is a non-string value", () => {
    const raw = reportRaw({ findings: [{ version: 1.2, paths: wellFormedFinding.paths }] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('version');
  });

  it("fails closed when a finding's paths field is not an array", () => {
    const raw = reportRaw({
      findings: [{ version: '1.2.1', paths: 'apps__mobile>expo>metro>image-size' }],
    });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('paths');
  });

  it("fails closed when a finding's paths array is empty", () => {
    const raw = reportRaw({ findings: [{ version: '1.2.1', paths: [] }] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('paths');
  });

  it("fails closed when a finding's paths array contains a non-string entry", () => {
    const raw = reportRaw({ findings: [{ version: '1.2.1', paths: [123] }] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('paths');
  });

  it("fails closed when a finding's paths array contains an empty string", () => {
    const raw = reportRaw({ findings: [{ version: '1.2.1', paths: [''] }] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('paths');
  });

  it('fails closed when an advisory entry itself is not an object', () => {
    const raw = JSON.stringify({ advisories: { '1138808': 'not-an-object' } });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
  });

  it('fails closed when the advisories field is an array instead of an object', () => {
    const raw = JSON.stringify({ advisories: [] });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
  });

  it('fails closed when module_name is missing', () => {
    const raw = reportRaw({ module_name: undefined });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('module_name');
  });

  it('fails closed when github_advisory_id is present but not a string', () => {
    const raw = reportRaw({ github_advisory_id: 42 });

    const result = evaluateAuditReport(raw, baseOptions);

    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.details.join(' ')).toContain('github_advisory_id');
  });
});
