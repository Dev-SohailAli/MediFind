export type ValidationOutcome =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: 'VALIDATION_FAILED'; readonly messageKey: string };

// Small and generous for this foundation's single no-body route; a route
// that legitimately needs a larger payload sets its own cap in its own task.
export const MAX_BODY_BYTES = 16 * 1024;

/**
 * Rejects an oversized request before its body is read into memory, using
 * only the caller-declared Content-Length. A missing/lying header is still
 * caught after the fact by `validateNoBodyPayload`.
 */
export function checkDeclaredBodySize(request: Request): ValidationOutcome {
  const declared = request.headers.get('content-length');

  if (declared !== null && Number(declared) > MAX_BODY_BYTES) {
    return { ok: false, code: 'VALIDATION_FAILED', messageKey: 'error.validation.body_too_large' };
  }

  return { ok: true };
}

/**
 * Validates the actual body for a route that expects no payload (this
 * foundation's only route, GET /v1/health). Size is re-checked here because
 * `checkDeclaredBodySize` only trusts a caller-supplied header.
 */
export function validateNoBodyPayload(
  rawBody: string,
  contentType: string | null,
): ValidationOutcome {
  if (rawBody.length > MAX_BODY_BYTES) {
    return { ok: false, code: 'VALIDATION_FAILED', messageKey: 'error.validation.body_too_large' };
  }

  if (rawBody.length > 0 || (contentType !== null && !contentType.includes('application/json'))) {
    return { ok: false, code: 'VALIDATION_FAILED', messageKey: 'error.validation.unexpected_body' };
  }

  return { ok: true };
}
