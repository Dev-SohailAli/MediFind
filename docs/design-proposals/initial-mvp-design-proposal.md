# Initial MVP design proposal

**Source brief:** [Claude Design agent brief](../claude-design-agent-brief.md) v2026-08-16, applied with the [design system and screen specification](../design-system-and-screens.md), [initial Claude design-review brief](../initial-claude-design-review-brief.md) and accepted ADRs in [the decision log](../decisions.md).
**Prepared by:** Claude Design agent
**Status:** approved for bounded implementation (see [§9 Founder decision record](#9-founder-decision-record)); this approval does not authorise code until the remaining documentation readiness gates are complete
**Reviewed documentation:** `docs/claude-design-agent-brief.md`, `docs/design-system-and-screens.md`, `docs/initial-claude-design-review-brief.md`, `docs/requirements.md`, `docs/experience-and-content.md`, `docs/data-and-search.md`, `docs/accessibility-policy.md`, `docs/web-platform-capabilities-policy.md`, `docs/dynamic-pharmacy-content-policy.md`, `docs/notification-and-status-synchronisation.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`, `docs/decisions.md`, `docs/design-review-acceptance-checklist.md`, `docs/pharmacy-verification-policy.md`, `docs/pilot-pharmacy-agreement.md`, `docs/pharmacy-onboarding-and-training.md`, `docs/audit-log-policy.md`, `docs/web-app-and-pwa-direction.md`.

**Revision note (final approved pass):** removed the agreement-version re-acceptance hard block (initial acceptance before go-live only; later agreement-version handling deferred to a future documented decision), removed the audit-view `Export` action (authorised scoped in-app viewing only), and replaced the admin `Contact pharmacy` action with a safe in-app support-case/deferred-follow-up record that introduces no messaging, email or external provider. No product policy, service or infrastructure changed.

All examples in this proposal use fictional people, pharmacies, medicines and prices. No code, package, cloud resource, external service, library, real data or configuration was added or changed to produce this proposal.

---

## 1. Scope, roles and non-goals

### Scope

This is the first whole-MVP, low-fidelity design proposal (ADR-227). It covers every required buyer, pharmacy-staff and MediFind-admin journey named in the [initial design-review brief](../initial-claude-design-review-brief.md): onboarding, registration/sign-in, search and results, pharmacy/medicine detail, OTC and post-approval prescription reservation, prescription upload and review, requests/status tracking, account/security, pharmacy owner self-service application/verification/pilot-agreement acceptance, pharmacy dashboard/inventory/owner controls, and MediFind verification/canonical-identity moderation/audit-view/reports/break-glass.

### Roles covered

- Buyer (self-service account holder, may act for a child/dependent per request)
- Pharmacy inventory manager
- Pharmacy prescription reviewer
- Pharmacy owner
- MediFind verifier/admin

A named person may hold a buyer account and one or more pharmacy roles across one or more branches (ADR-200, ADR-201); the design must always show which workspace/branch context is active and never blend buyer and pharmacy data.

### Non-goals (explicit)

The following are out of scope for this proposal and for the MVP, and nothing in this proposal introduces them:

- Payments, delivery, in-app chat/free-text messaging, public ratings/reviews, advertising or sponsored placement (ADR-006, ADR-045, ADR-048, ADR-075).
- Embedded interactive map (ADR-126); directions open the device's installed maps app.
- Medicine favourites, saved searches or medicine-search history (ADR-051).
- Reusable dependent/patient profiles; patient identity is captured per request only (ADR-138).
- Barcode scanning, automated medicine-data imports or external/government catalog integrations (ADR-199).
- Custom logo, illustration library or paid visual asset (ADR-128); the separately accepted Caprasimo/Figtree typography system is the visual-system exception.
- WhatsApp support channel or transactional-email workflow notifications (ADR-151, ADR-245).
- Diagnostic language, clinical recommendations, dispensing/stock/price guarantees before approval.
- Any new permission, data field, processor, external service or cost beyond what the read documentation already approves.

### Statement of no implementation change

This proposal is documentation only. It does not add, remove or modify application code, packages, libraries, cloud configuration, infrastructure, credentials or production/test data. All examples use fictional buyers, pharmacies, medicines and prices (for example "Jone Waqa", "Suva Central Pharmacy", "Amoxicillin 500mg capsules, pack of 20", "FJD 8.50"). No proposed visual detail is final until the founder records an outcome on the [acceptance checklist](../design-review-acceptance-checklist.md).

---

## 2. Design rationale

MediFind is used in a real pharmacy-search moment, often on a variable connection and a narrow phone viewport, by a buyer who wants a fast, honest answer and a pharmacy worker who needs to act quickly between counter interactions. The design therefore favours:

1. **The next safe action.** Every screen leads with what the person can do right now (search, request, review, approve) rather than decorative content.
2. **Freshness and pharmacy ownership.** Because price/availability are pharmacy-managed and can be stale, freshness and "listed by the pharmacy" language sit next to the data itself, not buried in a details screen.
3. **Legibility under real conditions.** High-contrast text, large touch targets, list-first low-data screens, and layouts that survive 200% text scaling and iTaukei/Fiji Hindi text expansion.
4. **Plain-language trust.** No clinical or promissory language; every safety boundary (no guarantee, pharmacy decides, may be outdated) is stated in the same structured, translated vocabulary everywhere it appears.
5. **Polished restraint.** Warm organic terracotta/sage system, Lucide icons, no gradients/neon/discount styling, one obvious primary action per screen.

This ordering directly follows the priority list in the [Claude Design agent brief](../claude-design-agent-brief.md#design-outcome).

### Token application table

The proposal uses the semantic tokens from the design-agent brief exactly as defined there (see [colour](../claude-design-agent-brief.md#colour-tokens), [typography/spacing](../claude-design-agent-brief.md#typography-and-layout-tokens) tables). This table shows how each token is proposed to apply to concrete MediFind components; anything not covered by the brief and needing a judgment call is marked **(proposed)** and listed again in [§8 Open decisions](#8-open-decisions-needing-founder-approval) only if it is genuinely ambiguous.

| Element | Token(s) | Rationale |
| --- | --- | --- |
| App background | `canvas` | Calm neutral base, light/dark |
| Cards, sheets, list rows, inputs | `surface` on `border` | High-readability surface with a clear boundary instead of heavy shadow |
| Grouped/safety panels (freshness note, safety copy block, filter panel) | `surfaceMuted` | Calm emphasis without competing with primary content |
| Primary button (one per screen) | `primary` / `primaryPressed` | Single obvious action |
| Secondary action | outlined `border` + `textPrimary`, no fill | Avoids competing filled buttons |
| Destructive action (decline, cancel reservation, delete account, revoke staff) | `danger` fill/outline + explicit label, never icon-only | Matches brief's destructive-action rule |
| `In stock` status chip | `success` + check icon + label | Positive, pharmacy-confirmed state |
| `Low stock` status chip | `warning` + dot/exclamation icon + label | "Needs attention", not an error |
| `Unavailable` status chip **(proposed)** | neutral: `textSecondary` on `surfaceMuted` + slash icon + label | `danger` is reserved for errors/declines; showing "no red as normal browsing language" (brief) means a normal absence-of-stock state should read as neutral information, not alarm |
| `May be outdated` freshness chip | `warning` + clock icon + label | Matches "stale/pending/needs-attention" role definition |
| OTC badge | neutral `border` + `textSecondary` label "Over the counter" | Informational, low emphasis |
| Prescription-required badge | `info` + lock/rx icon + label "Prescription required" | Informational status, not alarming, distinct from OTC |
| Reservation: submitted / under review | `info` | Neutral in-progress state |
| Reservation: approved | `success` | Confirmed by pharmacy |
| Reservation: declined | `danger` | Requires explanation copy alongside |
| Reservation: expired / cancelled | `textSecondary` on `surfaceMuted`, neutral icon | Closed, non-error outcome |
| Reservation: collected | `success` + double-check icon (distinct glyph from "approved") | Terminal positive state, visually distinguishable from "approved" |
| Prescription: submitted / under review | `info` | |
| Prescription: quarantined | `warning` + lock icon + "Restricted — pharmacy review only" | Signals limited handling without implying malware/danger to the buyer |
| Prescription: approved | `success` | |
| Prescription: rejected | `danger` + reason copy | |
| Prescription: expired / cancelled | `textSecondary` on `surfaceMuted` | |
| Security alert (advisory: new device, contact change) | `warning` | Informational, action-recommended |
| Security hold / account restricted | `danger` outline banner | Blocking state, must be unmistakable |
| Maintenance / kill-switch banner | `warning` full-width persistent banner | Not an error the user caused; explains what is temporarily unavailable |
| Freshness/supporting metadata text | `supporting` type token, `textSecondary` | Never the only signal of staleness — always paired with the chip above it |

Spacing, radius and typography follow the accepted organic system: 4.4px-based spacing tokens, 16px minimum screen padding, 8/16/28px radius tiers, Caprasimo headings, Figtree body/UI text and soft ink-tinted elevation. Minimum touch target remains 48×48 dp/pt throughout, including inside dense list rows.

---

## 3. Role and navigation map

| Role | Bottom navigation | Notes |
| --- | --- | --- |
| Buyer | Search · Requests · Account | Search is the default tab |
| Inventory manager | Dashboard · Inventory · Account | No Requests tab — no prescription/reservation content |
| Prescription reviewer | Dashboard · Requests · Account | Requests opens only behind a fresh biometric/MFA gate |
| Pharmacy owner (no reviewer assignment) | Dashboard · Inventory · Account | Requests tab appears **only** when the owner is separately, explicitly assigned `prescription_reviewer` |
| Pharmacy owner + reviewer | Dashboard · Inventory · Requests · Account | Requests still requires the fresh MFA/biometric gate every time, regardless of ownership |
| MediFind verifier/admin | Verification · Reports · Account | Canonical-identity moderation and the audit view are reached from Verification and Account respectively (§5.3), not separate tabs, to keep the tab bar to the roles named in the design system spec; no prescription-content tab; break-glass is a distinct, separately confirmed entry point inside Account, never a routine tab |
| Pharmacy owner, no `live` branch yet | *(no bottom navigation)* | Before verification is approved and the pilot agreement accepted, the owner sees only the self-service application/status screen (§5.2) full-screen — Dashboard/Inventory/Requests do not exist until the branch reaches `live` |

### Workspace switch pattern

A person with both a buyer account and pharmacy staff access sees a **workspace switcher** as a labelled control in the top app bar (not a silent toggle): a pill button reading the current context, e.g. `Buyer` or `Suva Central Pharmacy · Owner`. Tapping it opens a full-screen sheet listing every context the signed-in identity holds, each row showing the pharmacy legal display name, branch (if applicable) and the specific role(s) held there. Selecting a row performs a full context switch: the app re-fetches role/branch-scoped data from the server (never trusts a cached role) and the navigation bar changes to match §3's table for that role. Buyer and pharmacy data are never shown together on one screen. Switching into a reviewer context still requires the fresh MFA/biometric gate before any Requests content renders — the switch itself does not grant prescription access.

```
┌─────────────────────────────┐
│ ≡  [ Suva Central · Owner ▾]│  ← workspace switcher pill, top app bar
├─────────────────────────────┤
│                              │
│         (screen content)     │
│                              │
├─────────────────────────────┤
│ Dashboard  Inventory  Account│  ← bottom nav for active role
└─────────────────────────────┘
```

Owner-only navigation (no reviewer role) never shows a Requests tab, a prescription badge/count or any prescription affordance anywhere in the dashboard — this is the visible expression of "ownership alone never exposes prescription content" (ADR-202).

---

## 4. Shared states and components

These shared patterns are defined once and referenced by name in every screen section in §5, instead of being redrawn per screen.

| Shared state | Pattern |
| --- | --- |
| **Loading** | Skeleton rows/cards matching the eventual layout (no spinner-only screens for list content); a single centred spinner only for full-screen transitions under ~1s |
| **Offline** | Persistent `surfaceMuted` banner at the top: "You're offline — showing saved results from [timestamp]" (`warning` icon, non-colour-only). Public search/listing content may show timestamped cached data; every protected/sensitive screen (Requests detail, Account, all pharmacy/admin screens) instead shows a full-screen "Reconnect to continue" state with a retry action — never a cached protected view |
| **Reconnect** | On reconnect, before showing any protected content the app silently re-fetches and re-authorises; a brief inline "Updating…" replaces the offline banner during that fetch |
| **Browser capability request (in-app explainer)** | An inline panel or dialog, shown only at the moment the buyer chooses the feature, with a plain-language reason, an "Allow" primary button (opens the browser prompt where supported) and a "Not now" secondary; never shown at first launch |
| **Permission denied** | Inline notice at the point of use ("Location off — showing all results, closest first once you enter an area") with a manual-fallback control (area/address entry, or a "Choose a file instead" for camera); a single "Open settings" link, never a repeated prompt |
| **Empty (no data yet)** | Icon + short label + explanation + primary action if one exists (e.g. inventory manager's first listing) |
| **Zero-result search** | Non-diagnostic copy: "No matching medicine listed nearby." + a broadened-search suggestion + a private "I couldn't find this medicine" report action. Never implies unavailability in Fiji |
| **Stale listing** | `May be outdated` chip directly beside the listing's price/availability, not only in a details screen; listings unrefreshed >7 days are absent from search entirely (server-side; no client state to design) |
| **Validation / conflict error** | Inline field-level message in `danger` text + icon, focus moves to the first invalid field (screen-reader announced); a record-conflict (e.g. price changed since screen loaded) shows a non-blaming "This has changed — showing the latest version" refresh prompt, never a silent overwrite |
| **Safe generic error** | Full-width `surfaceMuted` panel: short plain-language message, opaque request ID, "Try again" action; never a stack trace, provider name or internal code |
| **Unauthorised / forbidden** | Full-screen state distinguishing "sign in required" (offers sign-in) from "not permitted for your role" (explains plainly, no retry loop, support link) |
| **Security alert** | Non-blocking `warning` banner/notification-style card in Account/security: what happened, when, device/context, and a "This wasn't me" action |
| **Security hold** | Full-screen `danger`-outlined explanation (e.g. post-recovery 24-hour hold): what is blocked, what remains available (search), and when it lifts |
| **Maintenance / kill switch** | Persistent top banner across affected flows: which function is paused (e.g. "Prescription uploads are temporarily paused"), that search remains available, and a status-page link; never a full app takeover unless nothing is available |
| **Success / confirmation** | Full-screen or sheet confirmation for every high-risk action (brief §"Components and interaction rules"): checkmark, plain confirmation line, the safety/no-guarantee reminder where relevant, and the single next action |
| **Notification entry** | Generic title/body only ("You have a request update.") with a MediFind icon; opening it always re-authenticates and re-fetches before showing any detail — never renders cached content from the push payload |

### Component inventory

- **Buttons:** one filled `primary` action per screen; outlined secondary; text/tertiary for low-emphasis navigation; explicit labelled destructive (never icon-only, always with a confirmation sheet for high-impact ones).
- **Inputs:** labelled text field with visible label (never placeholder-only), helper/error text slot, 48pt min height, clear focus ring meeting contrast in both themes.
- **Listing/result card:** medicine identity + match-type label, availability chip, exact-pack FJD price, freshness label, pharmacy name/distance — in that scan order.
- **Status component (chip):** icon + short label + semantic token background/text pairing per §2 table; never colour alone.
- **Freshness label:** `supporting` text, relative + exact timestamp on long-press/tap ("Updated 3h ago · 16 Aug, 2:10pm"), always adjacent to the data it describes.
- **Empty/error/offline states:** shared layout — icon, `heading`, `body` explanation, optional action — used consistently so they're recognisable across the app.
- **Confirmation sheet:** title, plain-language summary of the action and its consequence, the relevant safety line (no-guarantee / pharmacy-decision / expiry), primary confirm + secondary cancel, focus starts on the sheet title for screen readers.
- **Notification entry (in-app list item):** generic icon, generic label, relative time, unread indicator; never medicine/price/prescription content.
- **High-risk action pattern:** fresh-MFA/biometric interstitial → full-screen confirmation sheet with explicit consequence text → success state; used for staff role changes, ownership/contact changes, prescription review access, break-glass, kill-switch.
- **Dynamic pharmacy-note component:** plain-text block, visible language tag chip ("Written in iTaukei") beside the pharmacy attribution, remaining-character counter while editing, never rendered as HTML/markdown/links.
- **Evidence-upload item:** per-category row (label, status chip, upload/replace control, reviewer note slot when `needs more information`); never renders the file itself outside the owner's own upload/status screen.
- **Agreement-acceptance record:** versioned document viewer + single explicit accept action (never pre-checked) + a read-only confirmation strip showing recorded version/timestamp on return visits.
- **Identity-match compare panel:** two-column read-only pharmacy entry vs. ranked canonical-concept candidates, used only in admin canonical-identity moderation; never editable on the pharmacy-entry side.

---

## 5. Screen-by-screen structured descriptions

Each entry lists purpose, content hierarchy (top→bottom), primary/secondary actions, safety-copy placement, and only the **flow-specific** states beyond the shared patterns in §4.

### 5.1 Buyer

#### Welcome, language and onboarding

- **Purpose:** Orient a first-time buyer before any account exists.
- **Hierarchy:** MediFind wordmark (system type, no logo asset) → language picker (English/iTaukei/Fiji Hindi, defaults to device language) → 4-step skippable sequence (search verified pharmacies → availability/price are pharmacy-managed and may change → prescriptions go only to your selected pharmacy, no medical advice/guarantee → reservations need pharmacy approval and expire) → privacy/terms links, support hours, emergency guidance link.
- **Actions:** `Skip` (secondary, always visible) and `Next`/`Get started` (primary) on each step; language picker reachable again later in Account.
- **Safety copy placement:** Step 3 carries the prescription-privacy line verbatim from the content guidance; emergency guidance ("MediFind does not provide medical advice. For urgent medical help in Fiji, call 911…") sits as a persistent small link, not a full step.
- **States:** first-use (default) only; no location/camera/notification permission requested here (permissions policy: no first-launch prompts).

#### Registration / sign-in

- **Purpose:** Passwordless buyer sign-in; separate privileged staff path.
- **Hierarchy (buyer):** phone number entry (`+679` pre-filled) → 18+ self-attestation checkbox + legal full name + email → OTP entry (6-digit, 10-minute expiry, resend invalidates prior code) → success.
- **Hierarchy (privileged staff, reached only via an owner's phone invitation link):** invited-phone confirmation → verified personal email as primary sign-in → authenticator-app/passkey MFA enrolment with plain-language "why MFA" explainer (content guidance §"Privileged-account security education") → success.
- **Actions:** `Send code` / `Verify` primary; `Resend code` secondary (throttled, generic message on repeated failure); biometric unlock offered post-sign-in to unlock an already-authenticated session (not a first-factor).
- **Safety copy placement:** anti-phishing line shown once beneath the OTP field: "MediFind will never call, text or email you asking for this code."
- **States beyond §4 shared:** invalid/expired OTP (generic, no enumeration of whether the number is registered); rate-limited retry (generic "Too many attempts — try again later" without revealing threshold); MFA setup incomplete (blocks privileged screens, offers resume); post-recovery security hold (full-screen `danger`-outline explaining the 24-hour hold and that search remains available).

#### Search

- **Purpose:** Fast, low-data entry point; default tab.
- **Hierarchy:** search field (brand/generic/strength/form) → `Near me` toggle (off by default, triggers the location permission explainer sheet on first use) with manual area/address field always visible alongside it → sort control (Best match/freshness default, Distance, Price) → recent structural hint ("Try: paracetamol, amoxicillin") — no personalised history.
- **Actions:** primary = submit search; `Near me` is a secondary toggle, never pre-selected.
- **Safety copy placement:** none needed at query time; deferred to results.
- **States beyond §4 shared:** location permission sheet (per §4 pattern) fires only on `Near me` tap, never on tab open.

```
┌─────────────────────────────┐
│  Search medicines            │
│ ┌───────────────────────┐   │
│ │ 🔍 e.g. amoxicillin    │   │
│ └───────────────────────┘   │
│ [ Near me ⚪ ]  Suva ▾        │
│ Sort: Best match ▾           │
│                              │
│  Try: paracetamol, ibuprofen │
└─────────────────────────────┘
```

#### Results and zero state

- **Purpose:** Scannable list-first results with explicit match type and freshness.
- **Hierarchy per card:** medicine name + "Exact match" / "Active-ingredient match" label → availability chip → exact-pack FJD price → pharmacy name + distance (if location available) → freshness label; 20 results per page with explicit `Load more` up to 100.
- **Actions:** primary = tap card → detail; `Load more` secondary; active sort/filter shown as a dismissible summary chip row.
- **Safety copy placement:** a persistent, non-intrusive footer note under the list: "Availability and price are listed by the pharmacy and may change."
- **States beyond §4 shared:** zero-result (per §4 pattern, with broadened-terms suggestion + private "I couldn't find this medicine" report); active-ingredient-match explainer (info icon opens a one-line sheet: "Same active ingredient, different brand — strength, form and pack may differ"); stale results interleaved with the `May be outdated` chip in place, not filtered out silently; result cap reached (message that refining the search narrows results, not an error).

```
┌─────────────────────────────┐
│ Results for "amoxicillin"    │
│ Sort: Best match ▾  Near me  │
├─────────────────────────────┤
│ Amoxicillin 500mg (20 caps)  │
│ Exact match                  │
│ ● In stock   FJD 8.50        │
│ Suva Central Pharmacy · 1.2km│
│ Updated 3h ago                │
├─────────────────────────────┤
│ Amoxil 500mg (20 caps)       │
│ Active-ingredient match ⓘ    │
│ ▲ Low stock  FJD 9.90        │
│ Nasese Pharmacy · 2.4km      │
│ ⚠ May be outdated (28h)      │
├─────────────────────────────┤
│      Load more (20/57)       │
├─────────────────────────────┤
│ Availability and price are   │
│ listed by the pharmacy and   │
│ may change.                  │
└─────────────────────────────┘
```

#### Pharmacy/medicine detail

- **Purpose:** Full identity, pharmacy context and the entry point to reservation or prescription upload.
- **Hierarchy:** medicine identity (brand/generic, strength, form, pack size) → OTC/Prescription-required badge → availability chip + exact price + freshness → pharmacy name, verified badge, hours (open/closed now), address → pharmacy-authored branch note (language-tagged, attributed, plain text) → safety copy block (no-guarantee + prescription boundary as applicable) → actions.
- **Actions:** `Call` and `Directions` (secondary, side by side; Directions opens the installed maps app with verified coordinates) as always-available actions; primary action is context-dependent — `Request reservation` for in-stock OTC, `Select this pharmacy to upload prescription` for prescription-required items; disabled with explanation when `Unavailable` or when the branch has no active reviewer (prescription-required only).
- **Safety copy placement:** immediately above the primary action, not just onboarding: "A reservation is not a guarantee of supply or dispensing." / "A valid prescription may be required. The pharmacy makes the final dispensing decision."
- **States beyond §4 shared:** `Unavailable` listing (chip + primary action disabled, "Ask the pharmacy directly" secondary via Call); branch has no active prescription reviewer (prescription-required primary action replaced with a plain explanation, OTC items on the same branch remain available); stale (>24h) shown inline, not hidden.

#### Reservation request (OTC, and prescription-required after approval)

- **Purpose:** A single reservation-request flow used in two entry contexts: (1) directly from an in-stock OTC listing, and (2) from a prescription-required listing **only after** that specific prescription has reached the `approved` state. The two contexts share this screen because the reservation itself is always a separate, buyer-initiated action — pharmacy prescription approval only clears the item to be reservable; it never creates, pre-fills-and-submits, or auto-queues a reservation on the buyer's behalf.
- **Hierarchy:** confirm medicine + pack + pharmacy → (prescription-required entry only) reference to the specific approved prescription request this reservation is for → patient section (self / child / dependent radio + legal name if not self, pre-filled from the approved request when reached that way, editable) → no-guarantee safety line → submit.
- **Actions:** primary `Request reservation` opens the confirmation sheet (shared high-risk pattern) before submitting; secondary `Cancel`.
- **Safety copy placement:** in the confirmation sheet itself, restating price is not final until pharmacy approval and that this reserves only, not purchases; the prescription-required entry additionally restates "Approval to dispense does not reserve stock — this creates a new, separate reservation request for the pharmacy to approve."
- **States beyond §4 shared:** already-has-active-reservation-for-this-person/medicine block (explains the one-active-reservation rule, links to existing request); reservation-suspended-after-no-shows block (plain explanation, support-review link, search remains usable); submitted success (per §4 success pattern, shows expected pharmacy response window); prescription-required entry attempted before approval (blocked — the app never offers this screen for a prescription-required item until its linked request is `approved`; from a non-approved prescription-required listing, only the upload/status path is offered).

#### Prescription upload

- **Purpose:** Selected-pharmacy-only prescription submission with explicit consent and expiry disclosure.
- **Hierarchy:** selected pharmacy confirmation (name, "only this pharmacy will receive your file") → capture/pick control (camera or system file picker, triggered only here) → file preview → legibility self-confirmation checkbox → explicit two-business-day expiry disclosure + retention-on-open explanation → distinct consent checkbox ("I understand this file will be shared only with [Pharmacy]") → submit.
- **Actions:** primary `Submit prescription` disabled until legibility + consent both confirmed; secondary `Choose a different file`/`Retake`; `Change pharmacy` returns to detail (a new pharmacy selection requires repeating consent — never implicit re-routing).
- **Safety copy placement:** the expiry and retention lines are not collapsed into a tooltip — both render as visible body text before the consent checkbox, per requirements.
- **States beyond §4 shared:** camera/picker permission explainer (§4 pattern, fires only on tap); unsupported/oversized/unsafe file (generic retry message, no detection detail, per security policy); pre-open cancel/delete available ("You can remove this until the pharmacy opens it"); post-open notice (banner explaining retention now applies, delete no longer immediate); submitted/quarantined/under-review/approved/rejected/expired/cancelled status all shown in Requests (§5.1 Requests below), not re-duplicated here.

```
┌─────────────────────────────┐
│ Upload prescription           │
│ To: Suva Central Pharmacy     │
│ Only this pharmacy will see it│
├─────────────────────────────┤
│  [ preview of selected file ] │
│  [ Retake ]  [ Choose file ]  │
├─────────────────────────────┤
│ ☐ This is legible and correct │
│                                │
│ Suva Central has 2 business    │
│ days to review. If not viewed, │
│ it expires automatically and   │
│ you'll be notified.            │
│ After they open it, the file   │
│ is retained under the privacy  │
│ policy and can't be removed    │
│ immediately.                   │
│                                │
│ ☐ Share only with Suva Central │
├─────────────────────────────┤
│      [ Submit prescription ]  │
└─────────────────────────────┘
```

#### Requests

- **Purpose:** Single authoritative timeline for both prescription and reservation status.
- **Hierarchy:** segmented view (All / Prescriptions / Reservations) → each row: item identity, current status chip, relative timestamp → tap for full state history + expiry + any pharmacy-provided reason.
- **Actions:** contextual per state — `Request reservation` (prescription **approved**, no reservation submitted yet — see below), `Cancel` (pending/approved reservation), `Confirm collected`/`No longer needed` (approved reservation), `Choose another pharmacy` (rejected/expired prescription), `Call pharmacy` always available on an active item.
- **Safety copy placement:** rejection/expiry cards show a plain non-clinical explanation and immediately offer the "choose another pharmacy" path; the app never implies the file was forwarded. The `approved` prescription card carries an explicit line: "The pharmacy has approved this prescription for review purposes. Request a reservation to ask them to hold it for collection."
- **States beyond §4 shared:** each prescription state (submitted, quarantined-generic — buyer sees only "under review," never "quarantined," since that label is pharmacy-internal — under review, **approved (no reservation requested yet — a persistent `Request reservation` action stays on this card until the buyer acts, since approval alone never creates a reservation)**, rejected, expired, cancelled) and each reservation state (submitted, approved w/ confirmed price + pickup instructions + expiry, declined w/ reason, cancelled, expired, collected) per the token table in §2; price-change-before-approval is surfaced explicitly ("Confirmed price: FJD 9.00 — updated from FJD 8.50") never silently. A prescription card and any reservation later requested against it are shown as linked entries (same item, two distinct state histories), never merged into one status.

#### Account / security

- **Purpose:** Profile, language, privacy, devices/sessions, security alerts.
- **Hierarchy:** profile summary (legal name, masked phone, email) → language picker → theme override (System/Light/Dark) → devices/sessions list with per-device `Revoke` → security alerts feed → privacy: data/deletion request entry → suspicious-activity report entry → support (hours, channels) → sign out.
- **Actions:** `Revoke` per device (secondary, confirmation sheet); `Request deletion` (destructive pattern, explains retained-record categories before confirming, per requirements); `Report suspicious activity`.
- **Safety copy placement:** anti-phishing reminder anchored above the suspicious-activity report entry.
- **States beyond §4 shared:** deletion-request confirmation (explains what is deleted vs retained and why, per requirements §Account deletion); phone/email change requiring fresh verification (interstitial before the change takes effect); new-device/security-alert list items (per §4 security-alert pattern).

### 5.2 Pharmacy staff and owner

#### Pharmacy owner self-service application, verification status and pilot-agreement acceptance

- **Purpose:** The entry point for a prospective pharmacy before any branch is public, and the recurring status/renewal surface afterwards. No public listing, prescription handling or reservation exists for a branch until this flow's verification and agreement steps both complete (requirements §Pharmacy journey; pharmacy-verification-policy; pilot-pharmacy-agreement; pharmacy-onboarding-and-training).
- **Hierarchy — application:** owner registers using the same privileged sign-in pattern as staff (verified personal email + authenticator/passkey MFA) → branch application form: pharmacy legal/display name, Fiji address, normal + exceptional hours, official contact details → evidence upload by category (business-registration, pharmacy/licensing, responsible-pharmacist practising/registration) → review-and-submit summary → confirmation.
- **Hierarchy — status (returning owner):** branch status header (see states below) → per-evidence-category status row → any reviewer request for more information, in plain language, per item → resubmission control where applicable.
- **Hierarchy — pilot-agreement acceptance (separate step, required once before go-live):** full current agreement text (versioned) → explicit "I have read and accept the current MediFind pilot agreement" action (not a pre-checked box, no implied consent) → confirmation showing the recorded version, branch and timestamp → the owner can reopen this screen at any time to view the accepted version.
- **Actions:** `Submit application`; per-evidence-category `Upload`/`Replace`; `Accept agreement` (high-risk-style single deliberate action, not a routine toggle, required once before a branch can reach `live`); `Start re-verification` (material-change path, described below).
- **Safety copy placement:** the application confirmation states plainly that the branch is **private** until MediFind approval; the agreement screen repeats MediFind's role boundary verbatim: "MediFind provides discovery, selected-pharmacy prescription routing and reservation-request tooling only. It does not prescribe, diagnose, sell, dispense, process payment, deliver, determine prescription validity or guarantee a sale."
- **States beyond §4 shared:**
  - `submitted` / `under review` (`info`) — private, no owner action needed;
  - `needs more information` (`warning`) — specific per-item reviewer request, resubmission control appears only on the flagged item;
  - `approved, agreement not yet accepted` (`warning`) — verification passed but the branch still cannot go live; the only action offered is `Accept agreement`;
  - `live` (`success`) — verified and agreement accepted; this is what unlocks the Dashboard/Inventory/Requests screens described below;
  - `rejected` (`danger`) — reason shown, reapplication path offered;
  - `reverification required` (`warning`) — a material change (ownership, legal/display name, branch address, licence/responsible-person evidence, official contact) was flagged; the design shows exactly which field triggered it; routine hours/price/availability edits never trigger this state;
  - `expiring soon` (`warning`, 60/30-day reminder banner, also surfaced on Dashboard) and `expired` (`danger`) — expiry without approved renewal immediately suspends public discovery, prescription handling and reservations for the branch, shown here and on Dashboard as a full-width notice, with an explicit "pending prescriptions are not forwarded to another pharmacy" line matching the buyer-side wording used at pharmacy suspension.
- **Note — initial acceptance only:** this proposal requires the pilot agreement to be accepted once, before a branch can first reach `live`. It does **not** propose a hard workflow block (re-acceptance gate, disabled prescription/reservation actions, forced interstitial) for a later change to the agreement version. If MediFind later republishes the agreement with material changes, how an already-`live` branch is notified and whether/when re-acceptance becomes mandatory is a future documented decision (updated agreement handling), not assumed or designed here; this proposal only shows that the owner can reopen this screen at any time to view the currently accepted version.
- **Note — training:** this flow determines only verification/agreement status. Role-relevant synthetic training completion and the go-live readiness review (pharmacy-onboarding-and-training) are operational/administrative steps enforced server-side alongside these states; this proposal does not add a separate training UI screen since none is named in the design-system screen inventory — training status may surface as an additional row on this same status screen if a future task brief requires it, which would be a material addition needing its own decision, not assumed here.

#### Dashboard

- **Purpose:** Branch-scoped at-a-glance status and entry point to work.
- **Hierarchy:** active branch/workspace context (from switcher) → stale-listing count/prompt ("3 listings need a refresh") → pending-request count with SLA framing ("2 requests — respond within 1 business day") → generic alerts (security, verification expiry reminders) — all scoped to the branches/roles the signed-in person actually holds.
- **Actions:** tapping a summary card deep-links into Inventory or Requests (respecting role — an inventory-only user sees no Requests summary card at all).
- **Safety copy placement:** none role-specific; verification-expiry reminders (60/30-day) shown here for owners.
- **States beyond §4 shared:** branch has no active reviewer (owner/inventory sees a plain notice that prescription listings are hidden, not an error); pharmacy suspended/expired verification (full-width `danger`-outline notice; all action cards disabled except viewing branch details and re-verification start).

#### Inventory

- **Purpose:** Create/maintain eligible listings.
- **Hierarchy:** branch-scoped list (identity, OTC/Rx badge, availability, price, freshness, moderation state) → `Add listing` → per-row edit.
- **Add/edit form hierarchy:** brand and/or active ingredient → dosage form → pack size → strength (if applicable) → OTC/prescription-required → availability (`In stock`/`Low stock`/`Unavailable`) → price (FJD) → optional non-clinical listing clarification note (language-tagged, char-limited).
- **Actions:** primary `Save`; availability/price quick-update affordance directly on the row for the daily-refresh workflow (no need to open full edit for a routine update).
- **Safety copy placement:** inline reminder that price/availability changes are audited and visible to buyers within minutes.
- **States beyond §4 shared:** listing pending identity review (`identity_review_required`, private, clearly labelled "Not yet public — MediFind is reviewing this medicine's identity"); duplicate/ambiguous-match warning at save time; listing auto-flagged stale (>24h, shown with the same `warning` chip buyers see, prompting refresh); required-field validation.

#### Requests (pharmacy)

- **Purpose:** Branch-scoped OTC + prescription queue for authorised reviewers only.
- **Hierarchy:** filter (New / In progress / All) → queue rows: patient/account-holder name, item, submitted time, SLA indicator → tap opens detail (prescription rows require the fresh MFA/biometric gate before content renders, even if the list metadata is already visible).
- **Actions:** OTC row → `Approve`/`Decline` with pickup instructions + price + expiry entry; prescription row → biometric/MFA gate → review detail (§5.2 Prescription review below).
- **Safety copy placement:** none beyond the gate itself; content only ever appears post-authentication.
- **States beyond §4 shared:** forbidden for inventory-only/owner-without-reviewer role (this tab does not exist for them at all — see §3, not a blocked-screen state); empty queue; SLA-breach highlight (still `warning`, not `danger` — this is an internal prompt, not a buyer-facing error).

#### Prescription review / quarantine

- **Purpose:** Restricted single-request review by an authorised reviewer only.
- **Hierarchy:** fresh biometric/MFA interstitial (always, even mid-session) → request summary (account-holder name, patient name/relationship, submitted time) → file viewer (screenshot/recording suppressed where the OS allows, with a note that physical photography can't be prevented) → quarantine label if applicable ("Restricted — flagged for legibility/duplicate check, review before deciding") → decision controls.
- **Actions:** `Approve`, `Decline` (requires a professional reason category, not free text limitless), or allow to expire (no forced action). Each decision is the high-risk confirmation-sheet pattern. `Approve` records only the prescription-validity decision and closes this screen — it does not open reservation terms, pre-fill a reservation, or take the reviewer anywhere near pickup price/expiry entry. A prescription-required reservation can exist only if the buyer separately submits one (§5.1 Reservation request) after seeing `approved` in their Requests timeline; that later reservation then arrives in the ordinary pharmacy Requests/Reservation-detail queue (§5.2) like any other reservation, for its own approve/decline decision.
- **Safety copy placement:** explicit reminder above the decision controls: "This is a professional/legal decision — MediFind does not determine validity or dispensing." The approval confirmation sheet adds: "Approving allows the buyer to request a reservation. It does not create or hold a reservation for them."
- **States beyond §4 shared:** quarantined-for-review (warning-styled restricted banner, distinct from a blocked/malware file which never reaches this inbox at all); already-expired-before-review (read-only, decision controls disabled); file-load failure (safe generic error, retry, never expose scan-pipeline detail).

#### Reservation detail (pharmacy)

- **Purpose:** Confirm/manage a reservation end-to-end from the pharmacy side.
- **Hierarchy:** item, patient, requested vs confirmed price, pickup instructions field (structured window + optional pharmacy note), expiry (pharmacy-selected, default 24h) → `Mark collected` once approved and picked up → `Cancel` with mandatory operational reason if supply changes.
- **Actions:** `Approve` (sets confirmed price/expiry), `Decline`, `Mark collected`, `Cancel approved reservation` (destructive, reason required, immediate buyer notice).
- **Safety copy placement:** price-change-before-approval is shown as an explicit diff if the pharmacy adjusts price during approval, so the buyer-facing confirmation is never a silent change.
- **States beyond §4 shared:** collected/cancelled/expired read-only history states; cancellation-reason required validation.

#### Owner controls

- **Purpose:** Staff invitation/role management and branch/ownership administration — highest-risk pharmacy screen set.
- **Hierarchy:** staff list (name, role(s), branch, status) → `Invite staff` (phone number + role selection) → per-staff `Change role`/`Revoke` → branch details/hours editor → ownership/legal-contact change entry, which hands off to the verification-status screen in `reverification required` state (§5.2 Pharmacy owner self-service application) rather than duplicating that flow here → branch-scoped audit view entry (the admin audit-view component from §5.3, scoped server-side to this branch's staff/listing/reservation history only, never another branch or prescription-file content).
- **Actions:** every mutating action here uses the high-risk pattern (fresh MFA → confirmation sheet with explicit consequence: "This immediately revokes [Name]'s access to prescription requests at Suva Central.").
- **Safety copy placement:** invitation screen explains the seven-day expiry and that the recipient must complete MFA before gaining access.
- **States beyond §4 shared:** invitation pending/expired/reissued (reissue explicitly invalidates the prior invite, shown in the row); last-active-owner protection (removal/downgrade blocked with an explanation, ownership transfer requires re-verification, not a same-screen toggle); staff MFA-loss reset flow entry (owner-initiated, audited).

#### Account / security (pharmacy)

- **Purpose:** Same shared pattern as buyer Account, plus privileged specifics.
- **Hierarchy:** profile (verified personal email as primary sign-in) → MFA management (authenticator app/passkey, no SMS-only option) → devices/sessions (max 2 for privileged roles, new-device enrolment requires MFA + alert) → phishing report entry → support.
- **States beyond §4 shared:** MFA re-enrolment after device loss (owner-initiated only, self-service bypass explicitly blocked with an explanation); session-expiry-after-8-hours re-auth prompt.

### 5.3 MediFind admin

#### Verification

- **Purpose:** Approve/suspend pharmacy public visibility.
- **Hierarchy:** queue (pharmacy name, submitted evidence categories, status) → detail: business-registration, licensing, responsible-pharmacist, address/contact evidence metadata (not raw prescription-adjacent content) → decision controls + reasoning note → activation/suspension toggle.
- **Actions:** `Approve`, `Reject` (reason required), `Suspend` (immediate: removes public listings, revokes staff access, shows a neutral status to pending buyers — the design must make clear this cascades immediately, not "at next refresh").
- **Safety copy placement:** suspension confirmation sheet explicitly states "Pending prescriptions are not forwarded to another pharmacy — affected buyers will need to choose again."
- **States beyond §4 shared:** re-verification-required (material change flagged, pharmacy stays live until the specific changed field, per policy) vs full re-submission; expiring-soon queue (60/30-day reminders surfaced here too).

#### Canonical medicine and alias moderation

- **Purpose:** Resolve ambiguous/unmatched pharmacy listings against MediFind's canonical medicine identity, and curate canonical concepts/aliases — identity/catalog moderation only, never pharmacy-owned price, availability, hours or clinical/dispensing content (data-and-search §Canonical identity workflow; ADR-176).
- **Hierarchy:** queue of listings in `identity_review_required` state (pharmacy name, pharmacy-entered display name, submitted timestamp) → detail: the pharmacy's exact entry shown read-only, side by side with proposed canonical-concept/alias matches ranked by confidence → decision controls → separate canonical-concept/alias curation area (add/edit approved generic/brand aliases, normalised terms) reached from the same screen.
- **Actions:** `Approve match` (links the listing to the canonical concept, subject to the listing's other publication checks), `Reject match` / `Request pharmacy correction` (keeps the listing private, sends the pharmacy a generic, non-accusatory correction prompt), `Flag as potential duplicate` (groups related pending listings for review without merging them), `Edit canonical concept/alias` (identity data only).
- **Safety copy placement:** persistent header reminder on every detail view: "Identity moderation only. Price, availability, hours and dispensing decisions remain with the pharmacy and are not shown or editable here."
- **States beyond §4 shared:** ambiguous with multiple candidate matches (side-by-side compare, no default pre-selection); duplicate-group flagged (linked list of related pending listings, explicitly not silently merged, each remaining attributable to its own pharmacy); already-resolved (read-only history, links to the audit view below); no safe high-confidence match (remains `identity_review_required`, not auto-published, per ADR-175).

#### Audit view (branch- or role-scoped safe projection)

- **Purpose:** Give MediFind admins — and, in a parallel branch-scoped form reached from pharmacy Owner controls, pharmacy owners — the minimum safe audit projection needed to investigate or operate, without ever exposing prescription-file content or another branch's data (audit-log-policy §Visibility and immutability; ADR-187, ADR-188).
- **Hierarchy:** filter row (actor role/type, action category, target type, date range — options are limited to what the signed-in viewer's role/branch actually permits, not shown-then-blocked) → event list: timestamp, pseudonymous actor reference, action name, target type, safe before/after summary → event detail (same safe fields plus recorded reason/reference where applicable, e.g. a decline reason category or a break-glass justification).
- **Actions:** filter/search and view detail within the permitted scope only. This proposal includes no `Export`, download or copy-out action — authorised, scoped in-app viewing only. A future export capability requires its own API/security decision (access scope, format, additional audit coverage of the export itself) and is not designed here.
- **Safety copy placement:** persistent header note: "This view never shows prescription file content, access tokens, OTPs or full contact values."
- **States beyond §4 shared:** empty result for the selected range/filter; scope boundary (an owner's filter options never list another branch or pharmacy — the option is simply absent, matching the role-boundary pattern used throughout this proposal, not a blocked query with an error message); admin-only anomalous-access banner surfacing the alert conditions named in the audit-log policy (e.g., unusual privileged/file access), distinct from the ordinary event list.

#### Reports

- **Purpose:** Listing-quality, suspicious-message and support queues — no routine prescription content.
- **Hierarchy:** tabs (Listing reports / Suspicious activity / Support) → each item shows only the safe projection needed to act (never the reporter's identity displayed as a public accusation, never prescription file content).
- **Actions:** `Resolve` with outcome note, `Escalate`, `Log support case` (creates an audited in-app case record scoped to the report — a written note for MediFind's own tracking, not a message sent anywhere), `Mark as deferred operational follow-up` (records that this report needs pharmacy contact and defers it, without sending anything — an admin follows up through the pharmacy's own existing published/verified channel outside this screen). Neither action sends an email, message or notification to the pharmacy from this screen; this proposal introduces no new messaging surface, email or external provider.
- **Safety copy placement:** header note on the case/follow-up actions: "This creates an internal record only. It does not contact the pharmacy."
- **States beyond §4 shared:** empty queue per tab; escalated-awaiting-founder state; case logged (read-only record, linked from the report); follow-up deferred (visibly flagged as outstanding until an admin marks it resolved).

#### Account / security (admin) and break-glass

- **Purpose:** Admin MFA/session management plus the distinct, high-friction break-glass entry point.
- **Hierarchy:** standard privileged Account pattern (§5.2 Account/security) → separate, visually distinct "Emergency access" section, collapsed by default, requiring an explicit tap to expand.
- **Actions:** break-glass request requires fresh MFA, a mandatory specific reason field, and a full-screen confirmation sheet stating the access is time-limited, fully audited, and may trigger buyer notification — this is the highest-friction confirmation pattern in the app, deliberately slower than any other action.
- **Safety copy placement:** the reason field and consequence text are never skippable or pre-filled.
- **States beyond §4 shared:** active break-glass session (persistent `danger`-outline banner for the admin themself, showing remaining time, for the duration of the grant); kill-switch activation entry point (same high-risk pattern; explains exactly which function pauses and that safe search remains available, per ADR-081/ADR-236).

---

## 6. Accessibility and localisation review

- **200% text scaling:** All layouts use flexible vertical stacks rather than fixed-height rows; status chips and freshness labels wrap onto a second line rather than truncate; no safety-critical text sits in a `micro`-token component (per brief, `micro` is explicitly non-essential-only). Confirmation sheets scroll rather than clip when content exceeds viewport height at 200%.
- **Browser screen-reader order and focus:** Reading order follows the hierarchy documented per page in §5 (top→bottom as written). On navigation, dialog open, validation error and status change, focus moves to the new title/message, announced via a live region for asynchronous status changes (e.g., reservation approved while Requests is open). Status chips expose an accessible name combining icon meaning + label (e.g., "Status: Low stock"), never relying on the icon glyph alone reaching the accessibility tree.
- **Non-colour status:** every semantic-token status in §2 pairs an icon and a text label with the colour; verified during design review by checking each chip reads correctly in greyscale.
- **Touch targets:** 48×48 dp/pt minimum enforced even in dense rows (Inventory quick-update, Requests queue); adjacent destructive/non-destructive controls keep 8pt+ separation to avoid mis-taps on high-risk actions.
- **Contrast:** all token pairings in §2 meet WCAG 2.2 AA in both themes per the brief's tokens; where a coloured token would fail against a proposed label colour, the design uses a tinted `surfaceMuted` background with `textPrimary`, not reduced-contrast text.
- **Dark mode:** defaults to device setting with the Account override from §5.1/§5.2; identical information hierarchy in both themes — dark mode never hides or reorders content present in light mode.
- **English / iTaukei / Fiji Hindi:** all system copy (onboarding, safety lines, status chips, error/confirmation text) is treated as a translation key with generous wrap allowance; buttons and chips use `min-width` sizing that accommodates the longest of the three languages rather than a fixed English-length pill. Pharmacy-authored notes remain in their entered language with a visible language tag and are never auto-translated or restyled to look like system copy — this is a hard visual distinction (different type weight/attribution row) so a reader can't confuse pharmacy text for a MediFind safety statement.
- **Reduced motion:** transitions (sheet open, tab switch) are simple fades/slides with no motion required to understand state; respects OS reduced-motion settings; no flashing content anywhere, including security alerts.
- **Permission and error copy tone:** plain, non-diagnostic, consistent with the approved vocabulary in `docs/experience-and-content.md` throughout — never "we have it," "guaranteed," "recommended alternative."

---

## 7. Safety and privacy review

- No screen implies MediFind has verified stock, guarantees dispensing, recommends a substitute or gives clinical/dosage advice; every reservation/prescription screen carries the applicable safety line from §2's token table at the point of decision, not only in onboarding.
- Prescription content never appears in: notifications (generic title/body only, per §4 Notification entry), offline/cached views (protected screens require reconnect), unauthorised screens, app-switcher previews (suppressed where the OS allows, with the physical-photography caveat stated to the reviewer), or the admin Reports/Verification screens.
- The buyer-selected-pharmacy-only rule is visually reinforced at three points: file upload consent, the Requests timeline, and rejection/expiry (which explicitly offers "choose another pharmacy" as a new, separate action rather than any implied re-routing).
- Owner/inventory-only navigation contains zero prescription affordances — not a disabled tab, an absent one — so role boundary violations aren't discoverable by exploring greyed-out UI.
- Admin designs contain no routine prescription-content screen; break-glass is deliberately the highest-friction, most visually distinct flow in the app.
- Dynamic pharmacy notes are visually and structurally distinct from MediFind system copy (separate component, language tag, attribution) and rendered as sanitised plain text only, consistent with the dynamic-content policy.
- Kill-switch/maintenance and security-hold states always state what remains available (safe search) rather than presenting a blank/broken app.
- Prescription-review approval and reservation creation are two distinct, separately confirmed actions with two distinct state histories (§5.1 Reservation request, §5.1 Requests, §5.2 Prescription review); no screen lets a reviewer's `Approve` action generate, pre-fill or auto-submit a reservation on the buyer's behalf.
- Canonical-identity moderation screens never expose an editable price/availability/hours field, and the audit view never exposes prescription-file content, tokens, OTPs or full contact values — both are read/decision-only over the safe projections defined in the data-and-search and audit-log policies.
- A pharmacy branch has no public listing, prescription handling or reservation capability until it is both verified and has an authorised owner's recorded pilot-agreement acceptance; the design never lets Dashboard/Inventory/Requests render for a branch that has not reached that combined `live` state.

---

## 8. Founder design decisions recorded

The founder approved the following decisions on 2026-08-16. They are binding for the revised proposal and any later bounded UI task:

1. **`Unavailable` status colour treatment:** use the proposed neutral, non-`danger` treatment. `danger` remains reserved for errors, declines and blocking security states.
2. **Buyer-visible prescription status:** show the generic buyer-facing label **Under review**. The internal quarantine classification remains visible only to an authorised pharmacy reviewer where permitted.
3. **Reservation `Collected` iconography:** use the proposed `success` treatment with a distinct double-check glyph from `Approved`, plus the text label and semantic accessibility name.

These decisions do not change product policy, data collection, services, infrastructure, or an accepted ADR.

---

## 9. Founder decision record

The founder has recorded the visual decisions in §8 and approved this complete proposal for bounded future UI implementation. This approval does not authorise application code until the remaining documentation-readiness gates and a narrow approved task brief are complete. It never authorises production data, cloud provisioning, release, a new service/provider, or an accepted-ADR change.

- Proposal path / commit / branch: `docs/design-proposals/initial-mvp-design-proposal.md` / approval recorded on `agent/free-first-documentation-baseline`
- Review date and reviewer: 2026-08-16 / Founder
- Outcome (`approved for bounded implementation` / `approved with recorded changes` / `decision required` / `not approved`): `approved for bounded implementation`
- Accepted screens/flows and explicit non-goals: the complete low-fidelity buyer, pharmacy-owner/staff and MediFind-admin proposal in §§2–7, including the §8 approved visual treatments. All stated non-goals remain unchanged.
- Required revisions or linked decision-change/ADR reference: none. Later agreement-version handling and any audit export remain deferred and require the normal decision-change process.
- **Resolved before approval:**
  1. Agreement-version re-acceptance is no longer a hard workflow block. Only the initial pilot-agreement acceptance remains required before a branch can first reach `live` (§5.2 Pharmacy owner self-service application). Handling of a later agreement-version change (notification, whether/when re-acceptance becomes mandatory) is explicitly left as a future documented decision, not designed here.
  2. The audit view's `Export` action is removed (§5.3 Audit view). The proposal now shows authorised, scoped in-app viewing only; any future export capability requires its own separate API/security decision.
  3. The admin `Contact pharmacy` action is replaced with `Log support case` (an internal, audited case record) and `Mark as deferred operational follow-up` (§5.3 Reports). Neither sends a message, email or notification from this screen; no messaging feature, email workflow or external provider is introduced.
- Confirmation that this approval does not permit production data, cloud provisioning or release: Confirmed.
