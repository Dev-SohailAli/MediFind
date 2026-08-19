# Future protected-pilot task queue

These tasks describe the development path after the synthetic read-only phase.
They are deliberately gated. A brief can be used to prepare an approval or
implementation review, but no agent may infer a provider, region, credential,
real-data field, protected binding, budget, legal approval or production release
from this index.

| Task | Brief | Gate |
| --- | --- | --- |
| 7 | [Protected-pilot gate](task-7-protected-pilot-gate.md) | Founder/legal/privacy/security/cost evidence |
| 8 | [Identity, session and recovery](task-8-identity-session-recovery.md) | Task 7 provider and region decision |
| 9 | [Pharmacy verification and staff access](task-9-pharmacy-verification-staff-access.md) | Task 8 protected identity |
| 10 | [Listing lifecycle and price integrity](task-10-listing-lifecycle-price-integrity.md) | Task 9 branch/role authorization |
| 11 | [Buyer OTC reservations](task-11-buyer-otc-reservations.md) | Task 8 identity and Task 10 eligible listings |
| 12 | [Status refresh and notifications](task-12-status-refresh-notifications.md) | Task 11 state machine |
| 13 | [Prescription quarantine and scanning](task-13-prescription-quarantine-scanning.md) | Separate high-risk approval; currently not executable |
| 14 | [Support, reports and admin audit](task-14-support-reports-admin-audit.md) | Task 8 identity and audit/access review |
| 15 | [Public support/legal/status presence](task-15-public-support-presence.md) | Approved operator identity and contacts |

Tasks 8–12 and 14 require synthetic integration tests before any pilot data.
Task 13 requires an independent security review and cost rehearsal. Task 15
must remain static and must not become an application/API proxy.

After Tasks 7–15, continue with the [pilot operations and release queue](../operations/README.md).
