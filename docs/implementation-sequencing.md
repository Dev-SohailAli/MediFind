# Approved implementation sequencing

## Rule

No implementation task begins until the task brief and its relevant contracts are approved. This sequence is deliberately synthetic-data-first and does not authorise production deployment, real pharmacy/buyer data, real prescriptions, live cloud resources or a public app release.

## Planned task order

1. **Foundation only.** Create the approved pnpm monorepo/toolchain, quality gates, CI scaffolding, responsive web/PWA shell and API package skeleton. Use synthetic data only. Do not configure Firebase projects, authentication, Cloud Run, storage, production secrets or cloud deployment.
2. **Non-sensitive experience.** Implement the approved buyer search/navigation/design components in the web/PWA against synthetic fixtures only. No real user identity, pharmacy, medicine inventory, prescription, reservation or external data connection is allowed.
3. **Protected platform foundation.** Only after cloud-foundation documentation and live repository controls are approved: configure isolated synthetic Firebase/GCP environments and implement the server/API/auth boundaries with synthetic data. The web/PWA buyer-search brief must be complete and green before protected workflows are added.
4. **Pharmacy operations.** Implement verified pharmacy, branch/staff, catalog/listing and reservation capability in narrow, tested tasks after their exact schemas/authorization tests are approved.
5. **Prescription capability.** Implement prescription upload/quarantine/review only after all related security, legal/privacy, retention, scanning, assessment and pilot-readiness gates are satisfied. Real prescription activation remains a separate explicit approval.

Each task remains independently approved, tested, reviewed through a PR and documented. This order may change only through the decision-change process.
