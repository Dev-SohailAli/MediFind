# Security, privacy and compliance

## Security and privacy baseline

- Authenticate all accounts; require MFA for pharmacy owners, staff and admins before production launch.
- Enforce role-, pharmacy- and request-scoped authorisation server-side.
- Encrypt prescription files in transit and at rest; store them separately from public listing data; use short-lived signed access and email links that require re-authentication.
- Keep audit events for verification, staff access, upload/view/download, status decisions, listing edits and administrative action. Alert on anomalous prescription access.
- Obtain explicit buyer consent before upload; publish a plain-language privacy notice; support access, correction and deletion requests subject to legal-retention advice.
- Define retention and secure deletion periods with Fiji legal counsel before collection. Backups and logs must follow the same classification and retention controls.
- Maintain incident response: contain access, preserve evidence, assess affected people/data, notify stakeholders as legally required, remediate and document closure.

## Required pre-pilot validation

This is a product compliance checklist, not legal advice. Obtain written Fiji legal and pharmacy-professional review before activating any pharmacy or accepting any prescription.

- Confirm verification evidence against the Fiji Pharmacy Profession Board/Fiji MRA registers and applicable licensing requirements.
- Confirm the public-search, prescription-upload and reservation flows do not breach requirements for prescriptions, dispensing, record keeping, restricted supply, or advertising under the [Pharmacy & Poisons Act](https://www.health.gov.fj/wp-content/uploads/2014/09/20_Pharmacy-Poisons-Act-Cap-115.pdf).
- Confirm medicines listed by pharmacies are appropriate to advertise/search and that no controlled or restricted item is exposed contrary to law or professional guidance.
- Confirm privacy, hosting, cross-border transfer, retention, consent, breach notification and data-subject requirements applicable in Fiji.
- Review Fiji MRA requirements and the status of participating pharmacies/products with the [Fiji Medicines Regulatory Authority](https://www.health.gov.fj/fiji-mra/).
- Obtain pharmacy SOPs covering prescription review, reservation expiry, buyer communication, price accuracy and escalation of suspect/falsified medicine reports.

No legal/compliance check may be marked complete solely by product or engineering staff.
