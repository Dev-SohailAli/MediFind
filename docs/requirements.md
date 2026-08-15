# Functional requirements and journeys

## Roles and permissions

| Role | May do |
| --- | --- |
| Buyer | Maintain own account, search listings, submit own prescription, view own request/reservation status |
| Pharmacy staff | Maintain assigned verified pharmacy listings; review requests; approve, decline or expire reservations |
| Pharmacy owner | Manage assigned staff and pharmacy-submitted information |
| MediFind verifier/admin | Verify/suspend pharmacies, manage reports, audit access and support operations |

Least privilege applies. Pharmacy staff may access only requests sent to their pharmacy; admins do not decide whether a prescription can be dispensed.

## Buyer journey

1. Buyer registers, verifies their account and accepts privacy terms.
2. Buyer searches by brand/generic name, strength or dosage form and may use Suva location sorting.
3. Results show medicine identity, verified pharmacy, location, availability status, listed FJD price and last-updated time; no quantity is shown.
4. Buyer opens a result for hours, directions, safety wording and pharmacy details.
5. For a prescription-required medicine, buyer selects one verified pharmacy and uploads a legible prescription. The app explains that submission is not approval or a promise to dispense.
6. The selected pharmacy decides the review outcome. The buyer receives a push update and sees the same status in-app.
7. When approved, buyer requests or receives a collection reservation with pickup instructions and an expiry. The pharmacy completes all sale and dispensing decisions directly.

## Pharmacy journey

1. Owner self-registers a pharmacy, submits business, location, contact and responsible-person evidence.
2. The profile remains private until a MediFind verifier approves it. Only then can public listings, prescription review and reservations operate.
3. Owner assigns staff. Staff manually create or update medicine listings with identity details, availability (`in stock`, `low stock`, `unavailable`), price in FJD and timestamp.
4. When a prescription arrives, authorised staff receive a secure email link, authenticate, inspect it in-app, then approve, decline, or request buyer contact according to their professional process.
5. Staff approve/decline a reservation, specify collection instructions and expiry, and keep status current.

## Admin journey

1. Admin reviews submitted pharmacy identity/licensing information, documents decision and enables or rejects public visibility.
2. Admin handles duplicate, misleading, stale or unsafe listings; suspends access where necessary; and retains audit records.
3. Admin may not alter a pharmacy's clinical review outcome.

## Functional acceptance criteria

- An unverified pharmacy cannot appear in search or receive prescription data.
- Each public result includes identity, pharmacy, location, availability, FJD price and a visible last-updated time.
- A prescription file is routed only to the buyer-selected verified pharmacy.
- Buyer and pharmacy see an auditable state history: submitted, under review, approved, declined, expired, and reservation status.
- A reservation makes no payment, delivery, stock-guarantee or dispensing claim.
- Every protected action requires authenticated, authorised access and is recorded for audit.
