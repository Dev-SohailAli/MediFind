# Claude Code setup for MediFind

## Purpose

Claude Code is MediFind's implementation agent. This setup complements the repository's `CLAUDE.md`, [handoff protocol](claude-code-handoff.md) and approved task briefs; it does not replace them.

## Install Superpowers before implementation

In Claude Code, install the Superpowers plugin from Anthropic's official marketplace:

```text
/plugin install superpowers@claude-plugins-official
```

Restart/start a fresh Claude Code session after installation and confirm the plugin is available before the first implementation task. Superpowers is an external MIT-licensed development-methodology plugin with skills for planning, TDD, debugging, review and Git workflow. Its official installation guidance also offers a separate third-party marketplace route; MediFind uses the official Anthropic marketplace route above. [Superpowers installation guide](https://github.com/obra/superpowers#claude-code)

## Privacy setting

Before using Superpowers with MediFind, disable its optional visual-companion telemetry in the Claude Code environment:

```text
SUPERPOWERS_DISABLE_TELEMETRY=true
```

Do not send MediFind prompts, documentation, source, credentials, test data, pharmacy information or prescription data to any unapproved external service. The plugin documentation states that this optional telemetry is version-only, but MediFind disables it as a privacy-by-default control. [Superpowers telemetry note](https://github.com/obra/superpowers#visual-companion-telemetry)

## Precedence and use

1. User-approved MediFind task brief and accepted documentation/ADRs are binding.
2. `CLAUDE.md`, security/privacy controls and repository protections are binding.
3. Superpowers methods—brainstorming, planning, TDD, review, verification and worktree use—apply only when consistent with the first two layers.

Claude must not use any Superpowers workflow to bypass documentation readiness, create production resources, use real data, alter accepted policy, merge/deploy, access secrets or broaden scope. If its defaults conflict with MediFind's branch/PR, synthetic-data, no-code-before-approved-task or privacy rules, MediFind rules win and Claude raises a decision-change request.

## First-session checklist

- [ ] Superpowers installed from the official marketplace and optional telemetry disabled.
- [ ] Read root `CLAUDE.md`, the handoff protocol, the documentation index and the approved task brief.
- [ ] Confirm `main` protection, secret scanning/push protection and dependency-alert configuration are live before implementation.
- [ ] Work only from a task-specific branch/worktree and synthetic environment.
- [ ] State the tests to be written first and the verification evidence required for the task.
