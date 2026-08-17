# Data and search

## Current state

The web preview searches invented in-memory listings. It has no database,
account, query history, location permission or network request.

## Future source of truth

After an approved synthetic data task, Cloudflare D1 is the first candidate for
authoritative structured records. The Worker owns reads/writes and produces a
minimum public search projection. KV is never authoritative. R2 is reserved
for deferred private files.

Public search may expose only verified pharmacy/listing display fields,
availability, exact listed FJD price, freshness and safe branch directions.
It must not expose exact stock quantity, buyer identity/location, private branch
records, prescription content or raw query history.

Search remains deterministic: exact tokens, prefixes and reviewed aliases. It
must not infer clinical substitutes or silently merge incompatible strength,
form, route, release, pack or brand values. Stale/unavailable results are
labelled plainly and never imply that a missing result means unavailable
everywhere.

The Worker owns the search contract so a later database/index migration does not
change the web UI or safety rules. Any D1 schema, projection, freshness target,
backup/export and migration must be approved in its own task.
