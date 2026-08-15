# Dynamic pharmacy content policy

## Purpose

MediFind separates system-controlled safety/status content from pharmacy-authored operational notes. System content is professionally reviewed and available in English, iTaukei and Fiji Hindi. Pharmacy-authored content remains clearly attributable to the pharmacy and is never silently machine-translated.

## System-controlled content

Use structured, MediFind-owned templates for reservation state, price confirmation/change, pickup expiry, stale-data labels, prescription workflow status, safety warnings, errors, consent and support instructions. Templates are versioned, translated and accessible. A pharmacy selects approved structured values such as pickup window, expiry, collection location and safe reason category; it cannot replace the safety/status wording with arbitrary text.

## Pharmacy-authored operational notes

Permitted fields are limited to defined operational purposes, initially:

- branch note (for example, entrance/collection desk information);
- reservation pickup instruction supplement; and
- non-clinical listing clarification where approved.

Each note stores an entered-language tag selected by the pharmacy. The app labels that language and must not machine-translate or imply a translation. Medicine identity remains as authored/officially known. Text must not contain medical advice, diagnosis, treatment recommendation, prescription interpretation, urgency assessment, discriminatory content, promotion that affects search ranking, or a request for credentials/OTP/prescription files.

## Input, rendering and moderation controls

- Accept plain text only; sanitize/escape all rendering. No HTML, Markdown rendering, rich text, embedded media, scripts, tracking, shortened URLs or automatic linkification.
- Enforce purpose-specific conservative character limits in the task-level field schema. The first implementation must display remaining-character feedback and reject excess input server-side.
- Do not permit contact details, links or payment instructions in a dynamic note unless a future approved field explicitly supports a verified value. Use the verified public branch contact/directions fields instead.
- Display the pharmacy attribution and entered-language label beside the note. Screen readers announce both.
- Staff/admin moderation may hide/remove unsafe content and record a reason/audit event. Moderation does not rewrite a pharmacy note to change its meaning; the pharmacy submits a corrected note.

## Tests

Test template language coverage, dynamic-note language label/accessibility, maximum length, sanitisation/escaping, link/contact rejection, prohibited-content moderation state, branch scope and absence of note text in generic notifications/analytics/error logs.
