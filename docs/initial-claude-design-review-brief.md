# Initial Claude design-review brief

## Goal

Before any UI implementation, Claude produces one cohesive low-fidelity mobile design proposal for the MediFind MVP. The proposal must make discovery, pharmacy-owned information, prescription privacy, reservations and role boundaries easy to understand on a low/variable-connectivity Fiji mobile connection.

This is a documentation/design deliverable only. It authorises no application code, provider setup, account, storage, API or production work.

## Required deliverables

1. **Design-system proposal:** semantic token roles; accessible light/dark colour approach; system-font typography scale; spacing/radius/elevation; touch targets; status/error/safety components; icon usage; 200% text-scale behaviour; and English/iTaukei/Fiji Hindi layout considerations.
2. **Navigation/role map:** clear buyer, inventory-manager, reviewer, owner and MediFind admin navigation. Include buyer/staff workspace switching without cross-context data exposure. Owner-only navigation must not imply prescription access without reviewer role.
3. **Low-fidelity wireframes:** screen-by-screen mobile wireframes/descriptions for the core flows below, including primary content hierarchy and actions.
4. **State inventory:** loading, offline, retry, empty, zero-result, stale, permission request/denial, unauthenticated, forbidden, validation/conflict, generic safe error, security alert, success and kill-switch/maintenance states for every affected flow.
5. **Safety/accessibility review:** explain how the proposed design meets product boundaries, generic notifications, screen-reader/focus behaviour, text scaling, contrast/non-colour status and translated/system-vs-pharmacy-authored content rules.
6. **Open questions:** list no more than the material decisions that actually block an approved visual design. Do not fill gaps by silently changing a MediFind policy.

## Core flows to design

### Buyer

- Welcome, language selection and skippable onboarding.
- Phone/email registration/sign-in, notification/location/camera/picker just-in-time permission explanations, account recovery/security hold and workspace switch where relevant.
- Search, result list/pagination, zero result, stale listing, manual area/nearby-sort choice and pharmacy/medicine detail.
- OTC reservation request, pending/approved/declined/cancelled/expired/collected states, confirmed price and pickup instructions.
- Prescription selected-pharmacy flow: consent, file selection/capture, technical-error retry, submitted/quarantined/under-review/approved/rejected/expired/cancelled status. Do not render prescription content in notifications or unauthorised screens.
- Account, privacy/deletion request, devices/sessions, security alerts and suspicious-message reporting.

### Pharmacy roles

- Owner self-service application/verification, evidence status, agreement acceptance, branch context, staff invitation/role control and reviewer-continuity state.
- Inventory manager listing creation/edit/identity-review status, exact-pack FJD price, availability refresh/staleness and permitted dynamic note input.
- Explicit reviewer queue, generic notification entry, fresh MFA/biometric gate, restricted quarantine state, prescription review decision and reservation approval/decline/collection/cancellation.
- Owner/admin audit/review screens that expose only the permitted safe record projection.

### MediFind admin

- Pharmacy verification, catalog identity moderation, listing report, support/security and audit queues.
- Break-glass/kill-switch entry points with reason, fresh MFA and high-risk confirmation; no routine prescription-content screen.

## Hard constraints

- Follow all accepted ADRs and the design, accessibility, dynamic-content, permission, error, notification and security policies.
- Use clean clinical/friendly visual direction, semantic blue/teal accent roles, system icons and no custom logos/illustrations in MVP.
- Use list-first search; directions launches installed maps; no embedded map, in-app chat, payment, delivery, ratings/reviews, advertising or clinical advice.
- Show pharmacy ownership of price/availability and no stock/reservation/dispensing guarantee in context, without overwhelming every screen.
- No prescription file, patient detail, medicine name/price/reservation detail or sensitive content in notification/artifact/log proposals unless explicitly authorised by the relevant screen/role.

## Approval gate

Claude presents the proposal to the founder/documentation agent. It may revise based on feedback, but cannot implement visual/UI code until the proposal is explicitly accepted and any material decisions are recorded.
