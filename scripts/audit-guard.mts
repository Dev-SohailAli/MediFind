import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const AUDIT_EXCEPTION_REFERENCE = 'issue #8 / ADR-263';
export const AUDIT_EXCEPTION_EXPIRY = new Date('2026-09-15T23:59:59Z');

export interface AllowedAdvisory {
  moduleName: string;
  version: string;
  pathPrefix: string;
  pathIncludes: string;
}

export const ALLOWED_HIGH_CRITICAL_ADVISORIES: ReadonlyMap<string, AllowedAdvisory> = new Map([
  [
    'GHSA-w3rx-r6r6-pgpr',
    {
      moduleName: 'image-size',
      version: '1.2.1',
      pathPrefix: 'apps__mobile>',
      pathIncludes: 'metro>image-size',
    },
  ],
  [
    'GHSA-5p2g-fcmc-qvqq',
    {
      moduleName: 'image-size',
      version: '1.2.1',
      pathPrefix: 'apps__mobile>',
      pathIncludes: 'metro>image-size',
    },
  ],
]);

interface PnpmAuditFinding {
  version: string;
  paths: string[];
}

interface PnpmAuditAdvisory {
  id: number;
  title: string;
  module_name: string;
  severity: string;
  github_advisory_id?: string;
  findings: PnpmAuditFinding[];
}

interface PnpmAuditReport {
  advisories: Record<string, PnpmAuditAdvisory>;
}

// pnpm audit's own severity vocabulary; anything outside this set is treated
// as malformed rather than silently non-blocking.
const KNOWN_SEVERITIES = new Set(['info', 'low', 'moderate', 'high', 'critical']);

type ValidationResult = { ok: true } | { ok: false; reason: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Every field the guard reads is validated here so a malformed nested entry
// (wrong type, missing field, or an empty array where a real finding/path is
// required) cannot be silently ignored or misread as "not blocking" further
// down; any structural anomaly fails closed instead.
function validateFinding(value: unknown, context: string): ValidationResult {
  if (!isPlainObject(value)) {
    return { ok: false, reason: `${context} is not an object` };
  }

  if (typeof value.version !== 'string' || value.version.length === 0) {
    return { ok: false, reason: `${context}.version is missing or not a non-empty string` };
  }

  if (!Array.isArray(value.paths) || value.paths.length === 0) {
    return { ok: false, reason: `${context}.paths is missing, not an array, or empty` };
  }

  if (!value.paths.every((path) => typeof path === 'string' && path.length > 0)) {
    return { ok: false, reason: `${context}.paths contains a non-string or empty entry` };
  }

  return { ok: true };
}

function validateAdvisory(key: string, value: unknown): ValidationResult {
  const context = `advisories["${key}"]`;

  if (!isPlainObject(value)) {
    return { ok: false, reason: `${context} is not an object` };
  }

  if (typeof value.id !== 'number') {
    return { ok: false, reason: `${context}.id is missing or not a number` };
  }

  if (typeof value.title !== 'string') {
    return { ok: false, reason: `${context}.title is missing or not a string` };
  }

  if (typeof value.module_name !== 'string' || value.module_name.length === 0) {
    return { ok: false, reason: `${context}.module_name is missing or not a non-empty string` };
  }

  if (typeof value.severity !== 'string' || !KNOWN_SEVERITIES.has(value.severity)) {
    return {
      ok: false,
      reason: `${context}.severity is missing, not a string, or not a recognised severity level`,
    };
  }

  if (
    value.github_advisory_id !== undefined &&
    (typeof value.github_advisory_id !== 'string' || value.github_advisory_id.length === 0)
  ) {
    return {
      ok: false,
      reason: `${context}.github_advisory_id is present but not a non-empty string`,
    };
  }

  if (!Array.isArray(value.findings) || value.findings.length === 0) {
    return { ok: false, reason: `${context}.findings is missing, not an array, or empty` };
  }

  for (const [index, finding] of value.findings.entries()) {
    const findingResult = validateFinding(finding, `${context}.findings[${index}]`);
    if (!findingResult.ok) {
      return findingResult;
    }
  }

  return { ok: true };
}

function validateAuditReport(
  value: unknown,
): { ok: true; report: PnpmAuditReport } | { ok: false; reason: string } {
  if (!isPlainObject(value)) {
    return { ok: false, reason: 'audit output is not a JSON object' };
  }

  if (!isPlainObject(value.advisories)) {
    return { ok: false, reason: '"advisories" field is missing or not an object' };
  }

  for (const [key, advisory] of Object.entries(value.advisories)) {
    const advisoryResult = validateAdvisory(key, advisory);
    if (!advisoryResult.ok) {
      return advisoryResult;
    }
  }

  return { ok: true, report: value as unknown as PnpmAuditReport };
}

function isBlockingSeverity(severity: string): boolean {
  return severity === 'high' || severity === 'critical';
}

export interface AuditGuardOptions {
  now: Date;
  expiryDate: Date;
  allowedAdvisories: ReadonlyMap<string, AllowedAdvisory>;
}

export interface AuditGuardResult {
  ok: boolean;
  exitCode: 0 | 1;
  summary: string;
  details: string[];
}

function advisoryKey(advisory: PnpmAuditAdvisory): string {
  return advisory.github_advisory_id ?? String(advisory.id);
}

export function evaluateAuditReport(
  rawOutput: string,
  options: AuditGuardOptions,
): AuditGuardResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawOutput);
  } catch (error) {
    return {
      ok: false,
      exitCode: 1,
      summary: 'pnpm audit output could not be parsed as JSON. Failing closed.',
      details: [error instanceof Error ? error.message : String(error)],
    };
  }

  const validation = validateAuditReport(parsed);
  if (!validation.ok) {
    return {
      ok: false,
      exitCode: 1,
      summary: 'pnpm audit output did not match the expected report shape. Failing closed.',
      details: [validation.reason],
    };
  }

  const advisories = Object.values(validation.report.advisories);
  const blocking = advisories.filter((advisory) => isBlockingSeverity(advisory.severity));

  if (blocking.length === 0) {
    return {
      ok: true,
      exitCode: 0,
      summary: `No CRITICAL or HIGH pnpm audit findings. The ${AUDIT_EXCEPTION_REFERENCE} exception is not needed.`,
      details: [],
    };
  }

  const blockingIds = new Set(blocking.map(advisoryKey));
  const expectedIds = new Set(options.allowedAdvisories.keys());

  const unexpectedIds = [...blockingIds].filter((id) => !expectedIds.has(id));
  if (unexpectedIds.length > 0) {
    return {
      ok: false,
      exitCode: 1,
      summary: `Unexpected CRITICAL/HIGH audit finding(s) outside the ${AUDIT_EXCEPTION_REFERENCE} exception: ${unexpectedIds.join(', ')}. Failing closed.`,
      details: blocking
        .filter((advisory) => unexpectedIds.includes(advisoryKey(advisory)))
        .map(
          (advisory) =>
            `${advisoryKey(advisory)}: ${advisory.title} (module ${advisory.module_name}, severity ${advisory.severity})`,
        ),
    };
  }

  const missingIds = [...expectedIds].filter((id) => !blockingIds.has(id));
  if (missingIds.length > 0) {
    return {
      ok: false,
      exitCode: 1,
      summary: `Expected advisory/advisories from the ${AUDIT_EXCEPTION_REFERENCE} exception are missing from this audit result: ${missingIds.join(', ')}. This is a partial-match state that needs manual review before the exception can be trusted; failing closed.`,
      details: [],
    };
  }

  for (const advisory of blocking) {
    const id = advisoryKey(advisory);
    const expected = options.allowedAdvisories.get(id);
    if (!expected) {
      continue;
    }

    if (advisory.module_name !== expected.moduleName) {
      return {
        ok: false,
        exitCode: 1,
        summary: `Advisory ${id} now reports module "${advisory.module_name}", expected "${expected.moduleName}". The exception is scoped to a specific package; failing closed.`,
        details: [],
      };
    }

    for (const finding of advisory.findings) {
      if (finding.version !== expected.version) {
        return {
          ok: false,
          exitCode: 1,
          summary: `Advisory ${id} now reports version "${finding.version}", expected "${expected.version}". The exception is scoped to a specific version; failing closed.`,
          details: [],
        };
      }

      const unexpectedPaths = finding.paths.filter(
        (path) => !path.startsWith(expected.pathPrefix) || !path.includes(expected.pathIncludes),
      );
      if (unexpectedPaths.length > 0) {
        return {
          ok: false,
          exitCode: 1,
          summary: `Advisory ${id} now appears via an unexpected dependency path. The exception is scoped to the current build-tool chain; failing closed.`,
          details: unexpectedPaths,
        };
      }
    }
  }

  if (options.now.getTime() > options.expiryDate.getTime()) {
    return {
      ok: false,
      exitCode: 1,
      summary: `The temporary audit exception (${AUDIT_EXCEPTION_REFERENCE}) expired on ${options.expiryDate.toISOString().slice(0, 10)}. Remove the exception and resolve the findings; failing closed.`,
      details: [],
    };
  }

  return {
    ok: true,
    exitCode: 0,
    summary: `pnpm audit reports only the accepted temporary exception (${AUDIT_EXCEPTION_REFERENCE}): ${[...expectedIds].join(', ')}. Valid until ${options.expiryDate.toISOString().slice(0, 10)}.`,
    details: [],
  };
}

function runPnpmAudit(): { raw: string; error?: Error } {
  // A single command string (not an args array) avoids Node's DEP0190
  // shell-argument-escaping warning; the command is a fixed, static string
  // with no interpolated/untrusted input, so there is no injection risk.
  const result = spawnSync('pnpm audit --json', {
    encoding: 'utf8',
    shell: true,
  });

  if (result.error) {
    return { raw: '', error: result.error };
  }

  return { raw: result.stdout ?? '' };
}

function main(): void {
  console.log(
    `[audit-guard] Fail-closed pnpm audit exception guard. Tracked by ${AUDIT_EXCEPTION_REFERENCE}.`,
  );

  const { raw, error } = runPnpmAudit();

  console.log('----- BEGIN raw pnpm audit --json evidence -----');
  console.log(raw.trim().length > 0 ? raw : '(empty output)');
  console.log('----- END raw pnpm audit --json evidence -----');

  if (error) {
    console.error(`[audit-guard] FAIL: could not execute "pnpm audit": ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const result = evaluateAuditReport(raw, {
    now: new Date(),
    expiryDate: AUDIT_EXCEPTION_EXPIRY,
    allowedAdvisories: ALLOWED_HIGH_CRITICAL_ADVISORIES,
  });

  console.log(`\n[audit-guard] ${result.ok ? 'PASS' : 'FAIL'}: ${result.summary}`);
  for (const line of result.details) {
    console.log(`[audit-guard]   - ${line}`);
  }

  process.exitCode = result.exitCode;
}

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main();
}
