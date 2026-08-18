# Task 4 synthetic Cloudflare environment brief

## Authority

This is the founder-approved addendum to the accepted Task 4 data-contract
proposal and ADR-276. It authorizes the narrow remote development environment
needed to make the read-only synthetic Worker/D1 slice usable outside one
developer machine.

## Authorized resources

- One Cloudflare D1 database named `medifind-synthetic-search`.
- One Cloudflare Worker named `medifind-synthetic-worker`.
- The reviewed `0001_task4_synthetic_search.sql` migration and the six-table
  invented Task 4 export only.
- The existing anonymous read routes: `GET /v1/health`, `GET /v1/search` and
  `GET /v1/listings/{id}`.

## Explicit exclusions

This environment must not add Pages hosting, custom domains, accounts,
authentication, secrets, real or protected data, R2, KV, queues, analytics,
provider integrations, runtime mutations, reservation/prescription flows or
production release authority. The browser receives only public Worker
responses and never a D1 credential or direct binding.

## Cost and safety boundary

Use the founder-owned Cloudflare account and the free-first plan where
available. Keep the environment synthetic and read-only, with the existing
bounded query/page/body/rate-limit controls. Do not add a payment method,
upgrade a plan or accept paid usage as part of this task. Re-check usage before
any future expansion.

## Verification and rollback

After provisioning, verify the D1 row counts, foreign keys, excluded-listing
projection rule, migration/export checksums, Worker health/search/listing
responses and safe invalid-input errors. Record exact names, IDs, URL,
migration revision and timestamp in the infrastructure blueprint. If the
environment is no longer needed, export the synthetic data, delete the Worker
and then delete the D1 database; no protected or production data may be
affected.
