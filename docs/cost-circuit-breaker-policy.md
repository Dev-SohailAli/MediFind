# Cost circuit-breaker policy

## Purpose

MediFind is a founder-funded, low-cost pilot. Budget alerts and circuit breakers prevent unexpected consumption from turning into an uncontrolled bill while preserving the safest useful service for buyers.

## Thresholds and actions

| Approved monthly FJD ceiling | Action |
| --- | --- |
| 50% | Notify founder; review current usage, anomaly indicators and forecast. |
| 80% | Notify founder urgently; investigate/contain non-essential growth and prepare circuit-breaker action. |
| 100% | Activate the tested provider-level OTP breaker and pause new prescription upload/scan initiation. Keep authenticated safe search and existing non-sensitive viewing available where safe. |

The exact approved monthly ceiling begins at FJD 50-100 and is stored in server-controlled configuration, not the mobile client. Cost data can lag; per-service quotas/max instances/rate limits remain primary containment controls rather than relying solely on billing alerts.

Fiji SMS is excluded from that infrastructure ceiling but has its own founder-approved daily and monthly amount/volume cap. Firebase's mobile SDK/provider performs the actual send outside the MediFind business API, so a server feature flag alone is not a hard SMS cap. Configure a Fiji-only Identity Platform SMS-region policy, Authentication App Check, provider monitoring/quotas and a tested least-privilege provider disable/restore action. Activate that provider-level breaker when either the SMS cap or the overall 100% circuit breaker is reached. Track sent, verified and blocked messages because traffic pumping can incur cost even when verification fails and billing alerts may lag.

## Safety boundaries

- Never automatically disable the entire app, delete data, revoke existing legitimate records or misrepresent availability solely because a cost threshold is crossed.
- New prescription upload/scan initiation remains paused at the 100% breaker. Existing quarantined/under-review work follows safe fail-closed/status handling; do not silently lose or forward a request.
- New verification sends are blocked by the tested provider-level OTP breaker; registration/recovery entry points also close through server configuration. Show generic retry/support guidance without revealing budgets, thresholds or security controls. If the provider cannot demonstrate a reliable breaker before beta, phone registration remains disabled.
- Search is retained where it can safely operate, with truthful maintenance/cost status language that does not expose internal cost/security detail.

## Override and recovery

Only the founder-controlled authorised path may raise the approved ceiling or re-enable a paused high-cost function. The change requires fresh MFA, reason, current cost/usage review, safe limit/quota change, timestamp and immutable audit event. Re-enable one function at a time where practical and monitor for recurrence. A repeated/unknown cost anomaly follows incident handling.

## Verification

Test safe simulated 50/80/100 events in non-production/synthetic environments: alert routing, provider-level OTP block and restore, registration/recovery entry-point closure, upload/scan pause, generic buyer response, preserved search, no deletion, founder-only audited restore and post-event monitoring. Measure alert/configuration propagation delay and account for it in the approved SMS volume/spend cap.
