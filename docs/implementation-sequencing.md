# Approved web-only implementation sequencing

## Rule

Every task must match the active web-only Cloudflare architecture. No native
app, Firebase/GCP resource, real data, production secret or public protected
workflow is implied by task order.

## Planned order

1. **Web foundation.** Keep the pnpm workspace limited to `apps/web`,
   `apps/worker`, `packages/contracts` and `packages/config`; maintain local
   quality gates and static Pages preview configuration.
2. **Synthetic buyer experience.** Finish the responsive search/result/detail
   flow against invented fixtures. Verify accessibility, offline, install and
   safe states in browsers. No account or persistence.
3. **Cloudflare Worker foundation.** Add a minimal Worker route boundary,
   environment separation, safe errors, request validation, server-owned
   authorization seams, rate-limit seams and observability redaction. Use
   synthetic data only. Do not bind real data or enable sensitive workflows.
4. **Synthetic D1 data slice.** Define and test the smallest D1 schema and
   repository adapter for synthetic pharmacy/listing records. Prove migration,
   export, quota failure and safe degradation before considering a pilot.
5. **Protected web workflow.** After authentication, privacy, legal, cost,
   backup and operational gates, implement pharmacy verification, listings,
   buyer requests and collection status as separate approved slices.
6. **Prescription capability.** Only after region, privacy, retention,
   quarantine, malware scanning, access control, recovery and independent
   security gates are complete. Real prescription activation is a separate
   founder approval.

## Permanent exclusions from this sequence

Native mobile applications, Expo/React Native, app stores, Firebase, Google
Cloud, Cloud Run, API Gateway, Firestore, native push SDKs, payment, delivery,
public ratings and external medicine catalogs are not future tasks in this
roadmap unless the founder creates a new product decision that explicitly
reopens them.
