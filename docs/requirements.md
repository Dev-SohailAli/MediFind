# Functional requirements and journeys

## Roles and permissions

| Role | May do |
| --- | --- |
| Buyer | Maintain own account, search listings, submit own prescription, view own request/reservation status |
| Pharmacy inventory manager | Create and maintain assigned pharmacy listings, prices and availability; no prescription access |
| Pharmacy prescription reviewer | Review only requests sent to the assigned pharmacy and approve, decline or expire reservations; no listing-management access unless separately assigned |
| Pharmacy owner | Invite, remove and assign pharmacy roles; manage pharmacy-submitted information; may hold all pharmacy permissions |
| MediFind verifier/admin | Verify/suspend pharmacies, manage reports, audit access and support operations |

Least privilege applies. A named user may hold more than one pharmacy role. Each staff member has an individual account; shared pharmacy credentials are prohibited. A pharmacy owner can revoke a staff member's pharmacy access immediately. Pharmacy staff may access only requests sent to their pharmacy; admins do not decide whether a prescription can be dispensed.

MediFind admins do not routinely view prescription contents. Exceptional technical/support break-glass access is time-limited, reasoned, auditable and subject to buyer notice where legally appropriate.

## Buyer journey

1. Buyer self-attests that they are 18 or older, registers with legal full name, verifies email and phone, and accepts privacy terms. Sign-in is passwordless: a one-time code is sent to the verified phone; verified email is used for recovery. Device biometrics may unlock the already authenticated app session. Date of birth, government ID and medical history are not collected in v1 unless Fiji legal advice requires them.
2. Buyer searches by brand/generic name, strength or dosage form and may use Suva location sorting. Device location is optional: buyers can instead enter or select an area/address.
3. Results show medicine identity, verified pharmacy, location, availability status, over-the-counter or prescription-required status, listed FJD price and last-updated time; no quantity is shown.
4. Buyer opens a result for hours, directions, safety wording and pharmacy details.
5. Buyer may privately report an inaccurate, expired, misleading or unavailable listing. The report is sent to MediFind for review and is not displayed publicly as an accusation against the pharmacy.
6. For an over-the-counter listing shown as in stock, buyer may request a collection reservation directly. The pharmacy decides whether to approve it and supplies pickup instructions, a confirmed FJD collection price and an expiry.
7. For a prescription-required medicine, buyer selects one verified pharmacy and uploads a legible prescription by camera capture or by selecting a supported PDF/image from their device. Before submission, the buyer separately confirms that the file will be shared only with this selected pharmacy and, after opening, retained under the privacy policy. MediFind performs technical integrity checks (supported file, size, malware scan, readability/duplicate/tamper signals) and asks the buyer to confirm legibility; it explains that submission is not approval or a promise to dispense.
8. The selected pharmacy's licensed/professionally authorised reviewer decides prescription validity, dispensing and the review outcome. MediFind never makes that clinical/legal decision. The reviewer may approve, reject or allow a request to expire; unviewed requests automatically expire after two pharmacy business days. Before submission, the buyer sees the expiry rule; on rejection/expiry, the buyer receives a push update, sees it in-app, and may choose another pharmacy and submit a new request. A prescription-required reservation may be created only after pharmacy approval.
9. Buyer follows up directly with the pharmacy by the published phone number, hours and directions. V1 provides no in-app chat or free-text buyer/pharmacy messaging.
10. Buyer may confirm that they collected an approved reservation or cancel a pending/approved reservation before collection. Buyer collection confirmation is feedback only; pharmacy staff remain the source of truth for the collected status. After a completed/cancelled reservation, MediFind may request private pilot feedback; v1 has no public pharmacy ratings or reviews.

An adult account holder may use MediFind for a child or dependent. Before upload/reservation, identify whether the medicine/prescription is for the account holder or another person. MediFind does not implement separate minor accounts or parental-consent flows in v1; the pharmacy remains responsible for authority and dispensing checks.

When no current result is found, MediFind may offer a broader spelling, brand or active-ingredient search and a private “I could not find this medicine” report. It must not recommend a therapeutic or clinical substitute.

V1 does not retain saved medicine searches, medicine favourites or medicine-search history. Pharmacy favourites are deferred rather than implemented implicitly.

An account holder may have only one active reservation for the same medicine and identified person (self/dependent) at a time. After three confirmed no-shows within 30 days, disable new reservation requests temporarily while retaining search access and provide a clear support-review path.

Before the selected pharmacy opens an uploaded prescription, the buyer may cancel the request and delete the file. Once the pharmacy has opened it, the app explains that the record is retained under the privacy policy; it may no longer be immediately deleted by the buyer.

## Account recovery

Buyers recover access through the verified email address and verification of a replacement phone number. A configurable security delay applies before a recovered account may open or submit prescription requests, and push/session tokens on the lost device are revoked. Pharmacy and admin account recovery requires a separate, logged support process that verifies the person's role with the pharmacy owner or MediFind verifier; it must never rely on email alone.

## Account deletion

Buyers can request account deletion in-app. Before confirmation, explain which profile/contact data will be deleted or de-identified and which opened-prescription, review, reservation and audit records must remain for the approved legal/operational retention period. Revoke sessions and notifications promptly; record the request and completion without retaining unnecessary personal data.

## Pharmacy journey

1. Owner self-registers a pharmacy, submits business-registration evidence, pharmacy/licensing evidence, responsible pharmacist practising/registration evidence, Fiji location/address and contact details.
2. The profile remains private until a MediFind verifier approves it. Only then can public listings, prescription review and reservations operate. On suspension, remove public listings immediately, revoke staff access and give pending buyers a neutral status notice; MediFind does not forward any pending prescription to another pharmacy.
3. Owner invites named staff by phone number and assigns inventory-manager and/or prescription-reviewer permissions. The recipient proves control of the invited number, creates their own account and completes required authentication before access is granted. A staff email address is optional for recovery, not required for operation. Inventory managers manually create or update eligible over-the-counter or prescription-required medicine listings with identity details, availability (`in stock`, `low stock`, `unavailable`), price in FJD and timestamp. Prescription reviewers handle requests and reservations.
4. When a prescription arrives, authorised staff receive a generic push notification, authenticate with required MFA, inspect it in-app, then approve, decline, or request buyer contact according to their professional process. Email may be an optional fallback, not a required workflow.
5. Staff approve/decline an over-the-counter reservation, or after prescription review approve/decline a prescription-required reservation; specify collection instructions, confirmed FJD collection price and expiry, and keep status current. Staff mark collected reservations as the operational source of truth. If cancelling an approved reservation because supply is no longer available, staff must provide a specific operational reason; MediFind records it and presents a clear non-clinical explanation to the buyer.

Safely processed uploads with a technical suspicion or legibility/duplicate flag may appear in a restricted, clearly labelled pharmacy quarantine inbox for an authorised prescription reviewer. Files blocked as malware or technically unsafe never enter that inbox.

Pharmacies refresh public availability and price at least once per business day and aim to respond to prescription/review requests within one pharmacy business day. An approved reservation defaults to 24 hours, but pharmacy staff choose the actual expiry.

New listings from verified pharmacies publish automatically after required-field, format and duplicate/safety checks pass. MediFind may later moderate, correct, suspend or remove a listing under the documented process.

A branch needs at least one active, authorised prescription reviewer to publish prescription-required listings or receive prescription requests. It may publish eligible OTC listings without that role. Controlled, restricted or otherwise legally sensitive medicines are excluded from MediFind until Fiji legal/pharmacy review explicitly approves a documented policy.

## Admin journey

1. Admin reviews submitted pharmacy identity/licensing information, documents decision and enables or rejects public visibility.
2. Admin handles duplicate, misleading, stale or unsafe listings; suspends access where necessary; and retains audit records.
3. Admin reviews private buyer listing reports, records the outcome, contacts the pharmacy where appropriate, and moderates listings without publishing report content or reporter identity.
4. Admin may not alter a pharmacy's clinical review outcome.

## Functional acceptance criteria

- An unverified pharmacy cannot appear in search or receive prescription data.
- Each public result includes identity, pharmacy, location, availability, FJD price and a visible last-updated time.
- A prescription file is routed only to the buyer-selected verified pharmacy.
- Buyer and pharmacy see an auditable state history for prescription and reservation requests: submitted, under review, approved, declined, expired, cancelled, and reservation status.
- An over-the-counter reservation can be requested directly; a prescription-required reservation cannot be created until pharmacy review approves it.
- The app exposes pharmacy contact details and directions but provides no in-app buyer/pharmacy chat or free-text messaging.
- A reservation makes no payment, delivery, stock-guarantee or dispensing claim.
- Reservation approval shows the pharmacy-confirmed FJD collection price or clearly identifies a price change before approval; buyers must not discover an uncommunicated price change at collection.
- Buyers can mark a reservation collected or no longer needed. Pharmacies can cancel an approved reservation only with a recorded reason and immediate buyer notification; the buyer sees an understandable explanation.
- A reservation automatically expires at its stated collection deadline unless it has already been collected or cancelled. Buyers may cancel pending or approved reservations before collection; immediately notify the pharmacy and audit the action.
- Enforce one active reservation per medicine/person. After three confirmed no-shows in 30 days, suspend new reservations pending MediFind review while preserving search access.
- Every protected action requires authenticated, authorised access and is recorded for audit.
