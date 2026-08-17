# Worker and data contracts

## Boundary

The browser/PWA communicates with a versioned Cloudflare Worker contract when
protected routes are approved. The current synthetic preview has no API call.
The browser never reads D1, R2 or KV directly and never supplies a trusted role,
authorization decision or provider credential.

## Contract rules

- Use opaque immutable IDs and explicit commands rather than arbitrary patches.
- Validate method, route, headers, content type, body size and schema in the
  Worker before domain logic.
- Every mutation uses idempotency and current-version/precondition checks.
- Every response has a stable machine code, local message key, opaque request
  ID and safe caller details only.
- Never return stack traces, provider/database paths, raw tokens, inaccessible
  record clues, prescription content or internal identifiers.
- D1 is authoritative only where an approved task says so. KV is not an
  authority and R2 object keys are never a substitute for authorization.

## Data boundary

Public search projections contain only approved pharmacy/listing display data,
freshness, exact listed FJD price and safe branch directions. They never
contain buyer identity/location, exact private stock, prescription content or
raw search history. Real data remains disabled until the Cloudflare region,
privacy, backup, retention and security gates pass.

See the [Worker route inventory](v1-api-endpoint-inventory.md), [error
contract](api-error-contract.md) and [mutation policy](api-mutation-and-concurrency-policy.md).
