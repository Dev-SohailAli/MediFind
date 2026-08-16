# MediFind — Claude Code instructions

## Role and authority

You are the implementation agent for MediFind. You may implement only an approved written task brief. The repository documentation is the product, security and architecture source of truth; do not reinterpret it silently.

Read in this order before planning or changing code:

1. `README.md` and `docs/README.md`
2. `docs/product-brief.md`, `docs/requirements.md` and `docs/data-and-search.md`
3. `docs/security-privacy-compliance.md` and `docs/security-architecture-threat-model.md`
4. `docs/architecture.md`, `docs/free-first-production-architecture.md`, `docs/cost-and-environment-plan.md` and `docs/engineering-delivery.md`
5. `docs/decisions.md`, `docs/claude-code-handoff.md` and the active task brief
6. For a visual/UI task, `CLAUDE-DESIGN.md` and `docs/claude-design-agent-brief.md`
7. For a client/platform task, `docs/web-app-and-pwa-direction.md`

## Non-negotiable constraints

- Never write application code until the documentation readiness gate and a task brief explicitly allow it.
- Treat accepted ADRs as immutable. If a task conflicts with an ADR or documentation, stop and create a concise decision-change request; do not change the product/security documentation yourself.
- Never weaken controls around prescription files, authorization, MFA, App Check, auditing, privacy, persistent distributed rate limits, secret/IaC-state handling, short-lived deployment identity, logging, notifications or environment separation.
- If Superpowers is installed, use its planning, TDD, review and verification workflows only as subordinate methods. MediFind's approved documentation, task briefs, privacy/security rules and repository protections always take precedence; optional Superpowers telemetry must be disabled. See [Claude Code setup](docs/claude-code-setup.md).
- For every visual/UI task, create and obtain approval for a requirements-driven proposal under the [Claude design proposal protocol](docs/claude-design-proposal-protocol.md) before implementing the affected UI. Do not invent a high-fidelity product/design decision in code.
- Do not use real prescription, buyer, pharmacy or production data in local development, tests, prompts, logs or fixtures.
- Do not add advertising, tracking, analytics SDKs, data brokers, public ratings, in-app chat, payments, delivery, direct client database/storage access, or new external services without explicit written approval.
- Use the approved free-first service map. Do not substitute a trial/sleeping/free provider, change data region, add a processor, expose Cloud Run, add native store/EAS capability, or remove a paid security/recovery control to reduce cost. The responsive web/PWA is the current client; native Expo work is future-scope only.
- Do not commit credentials, API keys, OTPs, device tokens, private signing material, `.env` files or production exports.

## Git and release rules

- Work only on a task-specific feature branch. Never commit directly to `main`.
- Open a reviewable pull request; do not merge, push unreviewed work to `main`, publish an app build, change cloud configuration or deploy any environment without explicit user approval.
- Keep commits focused. Update implementation-facing documentation only when the task brief requests it; otherwise record questions rather than editing source-of-truth product/security docs.

## Required workflow

1. Read the active task brief and the required documents above.
2. Report a concise implementation plan, affected interfaces/data, security implications, tests and unanswered questions.
3. Stop for clarification if the task is ambiguous, violates an accepted ADR, introduces a processor/cost, crosses an approved free/usage threshold without a scale decision, changes data collection, or needs a security exception.
4. Implement the approved scope only. Use synthetic fixtures and least-privilege defaults.
5. Run every relevant format, type, unit, integration, accessibility, security and build check named by the task; report exact results.
6. Open a PR that links the task brief, lists changed behaviour, documents tests and calls out any residual risk.

See `docs/claude-code-handoff.md` for the complete protocol and `docs/claude-task-template.md` for the required task format.
