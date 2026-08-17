# Task 2: synthetic web buyer search specification

## Status

This is the historical behaviour specification now implemented in `apps/web`.
It is retained as a web-only source of truth; the former native implementation
has been archived and is not a consumer of this contract.

## Scope

The app uses invented in-memory listings and deterministic local search. It
supports search, alias/ingredient matching, area and sort controls, pagination,
detail display, freshness/availability labels and safe loading, empty, offline
and error states.

## Prohibited capability

The synthetic app must not use a runtime network request, account, API binding,
database, object store, browser storage, analytics, permission prompt, real
data, prescription upload, reservation mutation, payment or delivery action.

## Safety

Every result states that availability and price come from the pharmacy and may
change. It does not provide medical advice, recommend substitutes or guarantee
dispensing/supply. A valid prescription may be required and the pharmacy makes
the final decision.

## Acceptance

The web tests must prove deterministic matching/ranking, safe zero-result and
offline states, accessibility semantics, responsive rendering and absence of
the prohibited capability. All fixtures remain clearly synthetic.
