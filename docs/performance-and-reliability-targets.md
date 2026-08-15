# Pilot performance and reliability targets

## Scope

These are measurable engineering targets for the invite-only Suva pilot, not guarantees of carrier/network availability. Measure them with privacy-minimised aggregate telemetry and synthetic/load checks; do not add raw search terms, prescription data or identifiers to performance events.

## Targets

| Capability | Target | Safe UX/operational behaviour |
| --- | --- | --- |
| Medicine search API | p95 server/API response within 2 seconds under representative pilot load | Client shows progress, retry and a safe offline/public-cache state on poor connectivity; no claim that a stalled request means no medicine exists. |
| First visible search results | within 3 seconds on a normal Fiji mobile connection under representative pilot conditions | Measure on physical devices/networks before beta; show loading/error/retry where target cannot be met. |
| Search result size | 20 results per page, at most 100 results for a query | Use explicit pagination/load-more; do not fetch or cache an unbounded catalogue on a device. |
| Listing update propagation | price/availability update visible in public search within 5 minutes | Preserve the pharmacy's actual last-updated time. If propagation fails, do not falsely show a fresh result; alert/repair through operational monitoring. |
| Scheduled reconciliation | invoke every 15 minutes; alert when a cursor has not completed for 30 minutes | API reads/actions enforce effective expiry/staleness from server time even during a delayed run; bounded work resumes from its cursor. |
| Malware definitions | updater checks every 6 hours; no scan proceeds with definitions older than 24 hours | Update failure alerts the founder; uploads remain quarantined/fail closed rather than bypassing the scanner. |

## Measurement and release rules

- Define representative synthetic load, device/network test scenarios, measurement method, baseline and acceptance evidence in each relevant Claude task brief.
- Monitor aggregate latency, timeout/error rate, page size, index/propagation lag and Cloud Run cold-start behaviour without logging raw query text or protected content.
- Investigate a sustained target miss or a regression versus the accepted baseline before expanding a beta cohort. Use feature flags, capacity/index adjustment or safe degraded UX; document a material architecture/cost change.
- Search remains non-sensitive and can show timestamped public cached results when offline. Prescription, reservation, staff/admin and other sensitive actions never degrade into stale/offline mutation.
