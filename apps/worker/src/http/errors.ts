export type SafeErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_FAILED'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'CONFLICT'
  | 'UNAVAILABLE';

export interface SafeFieldError {
  readonly field: string;
  readonly code: string;
  readonly messageKey: string;
}

export interface SafeErrorBody {
  readonly code: SafeErrorCode;
  readonly messageKey: string;
  readonly requestId: string;
  readonly retryable: boolean;
  readonly fieldErrors?: readonly SafeFieldError[];
}

const STATUS_BY_CODE: Record<SafeErrorCode, number> = {
  NOT_FOUND: 404,
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  RATE_LIMITED: 429,
  CONFLICT: 409,
  UNAVAILABLE: 503,
};

// Only failures the caller can usefully retry unchanged (capacity/availability
// pressure) are marked retryable; validation/authorization outcomes will not
// change on retry.
const RETRYABLE_CODES = new Set<SafeErrorCode>(['RATE_LIMITED', 'UNAVAILABLE']);

export interface BuildErrorResponseOptions {
  readonly fieldErrors?: readonly SafeFieldError[];
  readonly headers?: Readonly<Record<string, string>>;
}

export function buildErrorResponse(
  code: SafeErrorCode,
  messageKey: string,
  options: BuildErrorResponseOptions = {},
): Response {
  const body: SafeErrorBody = {
    code,
    messageKey,
    requestId: crypto.randomUUID(),
    retryable: RETRYABLE_CODES.has(code),
    ...(options.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
  };

  return new Response(JSON.stringify(body), {
    status: STATUS_BY_CODE[code],
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...options.headers,
    },
  });
}
