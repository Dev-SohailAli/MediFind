# Design-review acceptance checklist

## Purpose

This checklist turns a Claude Design proposal into a clear founder decision. It prevents a visually attractive but incomplete proposal from being mistaken for approved implementation scope.

It is required for the initial whole-MVP proposal and for any later proposal that changes a critical journey, role boundary, safety message, permission, accessibility behaviour, data collection or design-system rule.

Approval under this checklist authorises only the specifically recorded **future UI implementation scope**. It does not authorise cloud provisioning, real data, a new service/provider, app-store release, legal activation or a change to an accepted ADR.

## Review inputs

Before review, confirm that the proposal:

- is stored under `docs/design-proposals/` and names its source brief/version;
- links the [Claude Design agent brief](claude-design-agent-brief.md), [initial design-review brief](initial-claude-design-review-brief.md) and any affected task brief;
- states its role/flow scope and non-goals;
- uses fictional content only; and
- states that it did not add code, packages, services, cloud configuration or production data.

## Founder review checklist

### Product and flow integrity

- [ ] Buyer search is list-first and clearly distinguishes exact versus active-ingredient match without a recommendation or therapeutic substitution.
- [ ] Listing cards/details show pharmacy attribution, exact-pack FJD price, availability label and actual freshness/last-updated context; they never show exact inventory quantity.
- [ ] Pharmacy ownership of price/availability and the no-guarantee boundaries are clear at the point of decision without overwhelming ordinary browsing.
- [ ] OTC reservation and prescription routing use the buyer-selected pharmacy only; no alternate or nearby pharmacy receives a prescription implicitly.
- [ ] Reservation status, expiry, confirmed-price and collection states are represented accurately; pharmacy approval and final dispensing remain clear.
- [ ] No payment, delivery, in-app chat, ratings, advertising, diagnostic advice, public prescription sharing or unapproved feature has entered the design.

### Role and privacy boundaries

- [ ] Buyer, inventory manager, prescription reviewer, pharmacy owner and MediFind admin navigation/actions are visibly distinct.
- [ ] Inventory-only staff and owners without explicit reviewer permission cannot see prescription screens, content or actions.
- [ ] Admin designs show no routine prescription-content access; break-glass is reasoned, high-risk, time-limited and distinct.
- [ ] Sensitive screens re-authenticate/re-fetch as required and do not rely on cached/offline state.
- [ ] Notifications, app-switcher treatment and generic states do not expose medicine, price, patient, prescription or reservation detail outside an authorised in-app screen.

### Accessibility, localisation and content

- [ ] The proposal applies semantic light/dark tokens, 48-point targets, 200% text scaling, labelled iconography and non-colour status meaning.
- [ ] VoiceOver/TalkBack reading order, focus treatment and error/validation announcements are considered for each critical flow.
- [ ] English, iTaukei and Fiji Hindi expansion/wrapping are considered; safety-critical system content remains translatable and pharmacy-authored text is language-labelled.
- [ ] Permission prompts are just-in-time, explain why the permission is needed and show a usable denial/manual fallback.
- [ ] Copy is non-diagnostic, non-promissory and uses the approved MediFind vocabulary.

### Visual-system application

- [ ] The proposal applies the approved initial colour/type/spacing/component rules from the design-agent brief, or lists a specific exception for founder decision.
- [ ] One main action is visually clear per screen where practical; destructive and high-risk actions are explicit and confirmed.
- [ ] Loading, empty, zero-result, offline, stale, validation/conflict, unauthorised, safe-error, success, maintenance, kill-switch and security-hold states are covered where relevant.
- [ ] The proposal uses system icons and does not create a logo, illustration library, custom font, paid asset, embedded map or visual dependency without explicit approval.

### Implementation readiness

- [ ] Every proposed screen can be mapped to an approved journey and API/data boundary; unknown fields or state transitions are listed as decisions, not assumed.
- [ ] The proposed first implementation slice is narrow, synthetic-data-only and respects the approved implementation sequence.
- [ ] Any visual change that requires a new permission, library, processor, cost, telemetry, data collection or security exception is separated for a written decision-change request.
- [ ] The proposal contains only material open questions and no silent policy changes.

## Decision record

The founder records one of these outcomes at the end of the proposal file and, where material, in the decision log:

| Outcome | Meaning | Next action |
| --- | --- | --- |
| `approved for bounded implementation` | The checklist is satisfied and the allowed screen/flow scope is explicitly named. | Documentation agent creates a narrow synthetic-only Claude task brief. |
| `approved with recorded changes` | Only the listed changes are needed and do not alter an accepted ADR. | Claude revises the proposal; founder confirms the recorded changes. |
| `decision required` | A product, safety, data, architecture, cost or policy choice is unresolved. | Stop UI implementation; create a decision-change request. |
| `not approved` | The proposal is incomplete, unsafe or misaligned. | Return it with concrete feedback; no coding task is created. |

Record at least:

- proposal path and commit/branch reference;
- review date and reviewer (founder);
- selected outcome;
- accepted screens/flows and explicit non-goals;
- required revisions or linked decision-change/ADR reference; and
- confirmation that the approval does not permit production data, cloud provisioning or release.

## Handoff boundary

After approval, the documentation agent converts only the accepted portion into a task brief using the [Claude task template](claude-task-template.md). The coding agent still follows `CLAUDE.md`, API/data/security requirements, the test strategy and all repository controls. A design approval never overrides those documents.
