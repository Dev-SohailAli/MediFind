# Design system and screen specification

## Visual direction

MediFind uses a warm, organic and calm visual style: readable warm surfaces, restrained terracotta and sage accents, clear status labels and no discount/sale aesthetic. The design must feel trustworthy and practical rather than diagnostic, promotional or overly playful. Support responsive browser layouts, light and dark themes, defaulting to the browser/OS setting with a manual Account override. Use the accepted semantic tokens in the [Claude Design agent brief](claude-design-agent-brief.md), not hard-coded colours, so contrast and theme changes remain safe.

## Design principles

- Prioritise a clear next action and current status over visual density.
- State data freshness, pharmacy ownership of availability/pricing, reservation limits and prescription boundaries plainly.
- Never use colour alone for stock, safety, error or status meaning.
- Meet the [accessibility policy](accessibility-policy.md): WCAG 2.2 AA target, large touch/pointer targets, 200% scalable text, contrast, screen-reader labels, keyboard focus/order and low-data list-first search.
- Show safe empty, loading, offline and error states. Never make a buyer assume that a missing/stale result means a medicine is unavailable everywhere.
- Use polished, accessible Lucide icons in the MVP at 2.75px stroke width. Do not spend pilot scope on custom logos or illustrations before validated demand.

## Buyer onboarding

Show a short, skippable onboarding sequence before registration:

1. Search medicines at verified pharmacies.
2. Availability and price are pharmacy-managed and may change.
3. Prescription files are shared only with the buyer-selected pharmacy; MediFind does not provide medical advice or guarantee dispensing.
4. Reservations require pharmacy approval and have an expiry.

The sequence links to language selection, privacy/terms, support hours and emergency guidance. It does not request location, camera or files until the buyer initiates the related feature.

## Role-specific navigation

| Role | Primary navigation | Notes |
| --- | --- | --- |
| Buyer | Search, Requests, Account | Search is default; no saved medicine history/favourites in v1 |
| Inventory manager | Dashboard, Inventory, Account | No prescription/request content |
| Prescription reviewer | Dashboard, Requests, Account | Prescription review uses biometric/MFA gate |
| Pharmacy owner | Dashboard, Inventory, Account; Requests only when explicitly assigned reviewer role | Staff/role controls are high-risk actions requiring fresh MFA; ownership alone never exposes prescription content |
| MediFind verifier/admin | Verification, Reports, Account | No routine prescription-content access |

The web app/PWA renders only the navigation and actions authorised for the signed-in role. A user with multiple pharmacy roles sees a clearly labelled role/branch context and never gains access by merely switching screens.

## Screen inventory

### Buyer

| Screen | Core content/actions |
| --- | --- |
| Welcome, language and onboarding | Skippable education, language selection, privacy/terms links |
| Registration/sign-in | Buyer: 18+ self-attestation, legal name, phone/email verification, passwordless phone sign-in and recovery. Privileged staff: phone invitation, verified personal email primary sign-in and authenticator-app MFA |
| Search | Medicine query, optional manual area/nearby search, list-first results and sort |
| Results and zero state | Exact/active-ingredient match labels, availability, FJD price, freshness, pharmacy, distance; non-clinical expanded search/unmet-demand report; 20-result pages with explicit load-more to a 100-result query maximum |
| Pharmacy/medicine detail | Identity/form/pack/strength, OTC/prescription status, price/freshness, hours, Call/Directions/Reservation actions and safety language; Directions opens the buyer's installed maps app |
| OTC reservation | Confirm selected medicine/person, pharmacy, no-guarantee language, result/status |
| Prescription upload | Selected pharmacy, specific consent, capture/file picker, type/size/legibility validation, two-business-day expiry disclosure |
| Requests | Prescription and reservation timeline, expiry, cancel, buyer collection confirmation, direct pharmacy contact |
| Account/security | Profile, language, privacy/delete request, devices/sessions, security alerts and suspicious-activity reporting |

### Pharmacy staff and owner

| Screen | Core content/actions |
| --- | --- |
| Dashboard | Branch context, stale-listing prompts, pending work, request SLA and generic alerts |
| Inventory | Add/edit eligible listing, mandatory medicine fields, price/availability/freshness, bulk quick update where later approved |
| Requests | Filtered branch-scoped OTC and prescription queues, clear state and expiry; no access for inventory-only or owner-only role unless explicit reviewer permission is assigned |
| Prescription review/quarantine | Fresh biometric/MFA gate, selected request only, safety/quarantine label, approve/reject/expire and reservation decision |
| Reservation detail | Confirm price, pickup instructions/hours/expiry, mark collected, cancellation reason if supply changes |
| Owner controls | Phone-number invitation, role assignment, immediate revocation, branch details/hours; fresh MFA for high-risk changes |
| Account/security | MFA, devices/sessions, alerts, phishing report and support |

### MediFind admin

| Screen | Core content/actions |
| --- | --- |
| Verification | Pharmacy evidence metadata, decision, audit trail and activation/suspension controls |
| Reports | Listing-quality, suspicious-message and support queues; no routine prescription content |
| Account/security | MFA, devices/sessions, break-glass procedure entry point and audit context |

## Shared interaction states

Every screen/page specification must include loading, offline, retry, capability-denied, unauthorized, empty, stale-data, success and safe-error states. Offline mode may show only timestamped cached public search/listing results; it disables protected displays and all sensitive submissions/changes until a fresh server check succeeds. Generic web notifications deep-link only to an authenticated web destination; they contain no medicine, price, prescription or reservation details.

## Implementation boundary

This specification fixes information architecture and safety behaviour. The accepted organic semantic colour values, Caprasimo/Figtree typography, spacing, radius, elevation and component rules used by the design agent are in the [Claude Design agent brief](claude-design-agent-brief.md) and [accepted visual-system proposal](design-proposals/2026-08-17-organic-visual-system.md). The founder approved the visual system on 2026-08-17; UI implementation remains a separate reviewable coding PR. The MVP uses external map-app directions rather than an embedded interactive map.
