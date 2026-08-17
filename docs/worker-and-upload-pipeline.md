# Worker and upload pipeline

## Current state

The active PWA has no API call or upload capability. This document defines the
future web-only boundary so a coding agent does not add a client-side database
or public file path by accident.

## Worker boundary

The Cloudflare Worker is the only future business-operation boundary. It
validates requests, derives authorization context, applies rate limits and
safe errors, writes audit events, and accesses D1/R2/KV through server-only
bindings. The browser receives short-lived application responses, never binding
credentials or direct object URLs.

## Private files

R2 may be evaluated for private files after a separate task approves exact
object keys, content types, size limits, retention/deletion, access logging,
download authorization, malware scanning, failure handling and cost limits.
Prescriptions remain disabled until Fiji legal/privacy review, region and
processor review, quarantine/scanning design, recovery evidence and independent
security assessment are complete.

Public file URLs, public buckets, third-party upload scanners, browser-direct
object writes and sensitive offline queues are prohibited.
