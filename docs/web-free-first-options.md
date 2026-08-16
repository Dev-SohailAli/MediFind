# Web/PWA free-first options

## Decision boundary

The web/PWA approach reduces immediate platform cost, but “free” is not by
itself a security, privacy, backup, region or reliability decision. The
current buyer-search app remains local-fixture-only. No database, identity
provider, API, storage service or analytics provider is added to it.

This document records the bounded options for a temporary synthetic preview
and for later protected-platform evaluation. It does not authorise real data,
production identity, prescription storage, public account activation or a
provider migration.

## Recommended now: static HTTPS preview

Use Cloudflare Pages Free for the temporary web/PWA preview once the founder
creates or authorises the Cloudflare account:

- connect the public repository to a Pages project;
- build only `apps/web` and publish its static `dist` output;
- use pull-request preview URLs for iPhone Safari and desktop verification;
- keep the preview synthetic-only, with no Pages Functions, database, auth,
  cookies, analytics or application proxy; and
- delete or disable the preview when device verification is complete.

Cloudflare documents 500 free builds per month, unlimited active preview
deployments, HTTPS `pages.dev` preview URLs and a default `noindex` header on
previews. Preview URLs are public unless Cloudflare Access is separately
configured, so only the existing invented fixtures may be exposed.

Sources: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
and [Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

## Database options

| Option | What the free tier is useful for | Current decision |
| --- | --- | --- |
| Supabase Free | Synthetic Postgres, Auth and Storage experiments; Sydney (`ap-southeast-2`) is available; 500 MB database and 1 GB file storage | Candidate for a separate synthetic-only evaluation, not approved for protected or health data |
| Firebase Spark | Synthetic Firestore and most non-phone Authentication without payment details | Retain as the current approved platform candidate; Spark does not provide Cloud Run/Cloud Functions and phone verification is billed per SMS |
| Cloudflare D1/KV/R2 | Small edge/static experiments | Not selected for the protected platform; it would replace the approved API/IAM/data boundary and needs a separate architecture review |
| Self-hosted database | Avoids a vendor subscription | Rejected for now because backup, patching, availability and recovery would become founder-operated responsibilities |

Supabase Free is attractive for experiments, but free projects can pause after
low activity, have only two active free projects, and do not include automatic
backups or point-in-time recovery. Sydney availability does not itself prove
Fiji legal, privacy, processor or health-data suitability.

Sources: [Supabase pricing](https://supabase.com/pricing),
[Supabase regions](https://supabase.com/docs/guides/platform/regions),
[free-project pausing](https://supabase.com/docs/guides/platform/free-project-pausing),
and [Supabase backups](https://supabase.com/docs/guides/platform/backups).

## Authentication options

- The current PWA has no authentication by design.
- Firebase Authentication’s no-cost options are suitable for synthetic
  non-phone experiments, but phone verification is billed per SMS and Firebase
  Cloud Run/API services require the pay-as-you-go path.
- Supabase Auth is a candidate for a synthetic experiment, but its free plan
  limitations, project pausing, MFA feature split and missing backup/recovery
  controls must be reviewed before any protected use.
- No free tier authorises real buyer, pharmacy, prescription or privileged
  account activation. Identity, MFA, recovery, SMS cost and legal/privacy
  controls remain separate approval gates.

Source: [Firebase pricing and plans](https://firebase.google.com/pricing) and
[Firebase pricing-plan documentation](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).

## Hosting and protected-platform rule

Cloudflare Pages Free is approved only for the synthetic static preview. It
does not replace the approved future trust chain:

`browser/PWA -> API Gateway -> IAM-private API -> private data/services`

Before protected implementation, compare Firebase/GCP and any Supabase or
Cloudflare alternative against region, DPA/processor terms, server-derived
authorization, App Check or equivalent attestation, persistent rate limits,
audit redaction, backups, recovery, cost breakers and exit/migration evidence.
If an alternative changes that boundary, create and approve a decision-change
request before code or resource creation.
