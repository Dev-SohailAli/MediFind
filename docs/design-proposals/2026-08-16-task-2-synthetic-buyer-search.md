# Task 2 synthetic buyer-search design addendum

**Date:** 2026-08-16  
**Status:** approved corrective addendum; see [§8 Founder decision record](#8-founder-decision-record)  
**Task:** [issue #5](https://github.com/Dev-SohailAli/MediFind/issues/5)  
**Implementation PR:** [#7](https://github.com/Dev-SohailAli/MediFind/pull/7), draft and unmerged  
**Parent proposal:** [Initial MVP design proposal](initial-mvp-design-proposal.md), approved under ADR-257  
**Task authority:** [Task 2 specification](../task-2-synthetic-buyer-search-specification.md) and [Claude task brief](../task-2-synthetic-buyer-search-task-brief.md), approved under ADR-264

## 1. Scope, role and non-goals

This is a narrow, synthetic-only addendum for the buyer-search visual slice. It applies the already approved whole-MVP design to the first local implementation task: the default Search tab, static buyer navigation, local list-first result cards, local detail sheet, manual synthetic-area/sort controls and safe public-search visual states.

The displayed role is a **synthetic buyer presentation mode**, never an authenticated buyer. `Requests` and `Account` are inert placeholders that state the feature is not included in the prototype; they show no person, session, profile, request or protected state.

Non-goals: all real/realistic data; sign-in/onboarding; API/network/provider/cloud use; location permission, map/call handoff; pharmacy operations; prescription/reservation/payment/delivery; persistence/search history; analytics; notification; translated iTaukei/Fiji Hindi values or language settings; custom logo/font/asset; and any new policy/data/processor/cost decision.

## 2. Design rationale and token application

The addendum follows the parent proposal’s fast, low-data, list-first buyer-search rationale: make the next safe action and pharmacy-owned freshness visible without clinical or promissory language.

- Use the approved semantic light/dark `canvas`, `surface`, `surfaceMuted`, `border`, `primary`, `success`, `warning`, `danger`, `info`, `textPrimary` and `textSecondary` tokens; no hard-coded colour or custom visual asset.
- Use the approved system font, 4-point spacing scale, 16-point screen padding, 12-point card radius and 48 dp/pt target minimum.
- Use plain-language labelled status chips: `In stock`, `Low stock`, `Unavailable` and `May be outdated`; glyph/text carries meaning and colour is supplementary.
- Use one obvious screen-level primary action where appropriate. `Load more` is an explicit secondary action. No sale/discount/sponsored treatment exists.

## 3. Navigation and flow map

```text
Buyer presentation mode
  Search (default)
    -> local query / clear
    -> optional manual synthetic area
    -> explicit local sort
    -> list-first results
         -> local read-only result detail sheet
    -> Load more (max 20/page, 100/query)
  Requests -> inert prototype placeholder
  Account  -> inert prototype placeholder
```

No path invokes a native permission, external app, remote request, protected record, mutation or account flow. Result detail has no Call, Directions, Reserve, Upload or Request action.

## 4. Structured screen descriptions

### Search and results

Top to bottom: local synthetic-development marker → search field with clear control → manual synthetic-area control → sort control showing active sort → list-first result cards → explicit Load more when applicable → persistent pharmacy-owned availability/price safety note.

Each card reads in this order: fictional medicine identity and match label → availability label/glyph → exact-pack FJD price → fictional pharmacy attribution and synthetic distance context → freshness/last-updated context. `Active-ingredient match` opens no equivalence claim: product identity, strength, dosage form and pack remain visible.

### Result detail sheet

The read-only sheet repeats identity, strength, form, pack, pharmacy, availability, FJD price, freshness, match context and no-guarantee copy. It dismisses back to the search list. It contains no operational action.

### Placeholders

Requests and Account each render only a plainly labelled local-prototype notice. Neither simulates a future account or request journey.

## 5. Relevant shared states

| State | Task 2 treatment |
| --- | --- |
| Browse/empty query | Safe local browse prompt, not an availability claim. |
| Loading | Local skeleton/announced loading presentation only; no request is made. |
| Zero result | `No matching medicine listed in this prototype.` with spelling/approved-alias guidance and no substitute recommendation. |
| Offline | Visual public-search-only example; no cache, retry request or protected display. |
| Safe error | Plain local retry presentation with no stack/provider detail. |
| Stale | `May be outdated` label adjacent to listing price/availability. |
| Ineligible | Never appears in results. |
| Permission/security/success/maintenance | Not implemented because no Task 2 flow triggers a permission, sensitive action, mutation or service. |

## 6. Accessibility, language and safety review

All controls have semantic accessible name, role and selected/disabled state; focus order follows the rendered hierarchy. Result/safety text cannot rely on fixed-height clipping and supports the approved scaling/layout constraints. Status is never colour-only. No motion is required to understand state.

English development copy is held behind stable local keys. The prototype does not claim complete language support or machine-translate medicine identity. Future iTaukei/Fiji Hindi content and language selection remain subject to the accepted professional-review requirement.

Safety copy must state that pharmacy-provided availability/price may change, a reservation is not a guarantee, a valid prescription may be required and the pharmacy decides dispensing, and MediFind does not provide medical advice. The prototype does not offer a reservation/prescription path; these strings preserve the approved vocabulary without implying feature availability.

## 7. Open decisions

There is no unresolved product or visual decision for this bounded slice. The sole process exception is recorded below: the task-specific proposal was omitted before code began, despite the parent proposal and Task 2 brief already being approved. This addendum does not approve a new design choice or broaden Task 2.

## 8. Founder decision record

- **Proposal path:** `docs/design-proposals/2026-08-16-task-2-synthetic-buyer-search.md`
- **Review date/reviewer:** 2026-08-16 / MediFind founder
- **Outcome:** approved corrective addendum for bounded Task 2 implementation
- **Accepted screens/flows:** the synthetic Search/default-tab flow, list-first cards, local detail sheet, synthetic area/sort/load-more controls, listed local states and inert Requests/Account placeholders.
- **Explicit non-goals:** all items in §1; no production data, cloud provision, release, provider, permission or real account capability.
- **Process record:** the pre-existing initial whole-MVP proposal and Task 2 specification/brief supplied the approved design content, but a task-linked proposal document was not created before PR #7 implementation started. The founder accepts this one-time documented procedural correction after review. Future visual/UI tasks require their task-linked proposal and recorded founder outcome before code begins.

## Statement of no implementation change

This addendum adds no application code, dependency, cloud resource, service, real data, fixture, credential or configuration. It records the approved design authority and correction only; PR #7 remains separately reviewable and unmerged.