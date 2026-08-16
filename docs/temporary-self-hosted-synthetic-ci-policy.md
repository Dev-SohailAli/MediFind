# Temporary self-hosted CI policy for synthetic work

## Purpose and boundary

GitHub-hosted Actions repeatedly ended in `startup_failure` / `BuildFailed` before creating a job, including Dependabot and a fresh post-billing-change retry. While that account-level problem is investigated, MediFind may use **one restricted self-hosted runner** for the first synthetic-only foundation task.

This is a temporary compensating control, not a production runner, deployment agent or general development environment. It does not authorise real data, prescriptions, cloud access, external vendors or weaker verification. The governing tracker is [issue #11](https://github.com/SohailMoinAli/MediFind/issues/11).

## Allowed scope

The runner may execute only the task-1 quality workflow for `SohailMoinAli/MediFind` while the repository is private/founder-controlled, the task remains synthetic-only and the trigger is a founder-owned non-`main` branch push.

It must never execute `pull_request`, fork, external-contributor, scheduled, workflow-dispatch, reusable-workflow or arbitrary workflow events. The temporary quality workflow uses the permitted branch-push event only; the resulting check still attaches to the matching pull-request head commit.

## Workstation isolation

Before registration, create a standard, non-administrator local Windows account dedicated to the runner (for example, `MediFindCI`) and an isolated directory owned by that account (for example, `C:\MediFindCI\runner`). It must not reuse the founder's everyday Windows profile.

The runner account/directory must not contain or access GitHub CLI, browser, password manager, personal documents, SSH key, cloud credential, Firebase/GCP/Expo login, Android signing material, IDE credential, mapped drive, shared personal profile, local administrator membership, Remote Desktop access, service-install authority, startup/login automation, `.env` file, Actions secret, deployment environment, API token or real/realistic MediFind data.

Start the runner interactively using that account's `run.cmd`. Do not install it as a Windows service or run it under the founder's everyday account. It handles one job at a time and is stopped when not needed.

## Registration and workflow controls

The founder creates a short-lived repository registration token only after the account/directory checks. Register with `--unattended`, a repository-specific name and custom `medifind-synthetic` label; never print, commit, paste or retain the registration/remove token.

The temporary quality workflow must:

- run only on `[self-hosted, Windows, X64, medifind-synthetic]`;
- use only non-`main` founder branch pushes, `contents: read` permission and SHA-pinned actions;
- retain the required format/lint/type/test/build/Gitleaks/Trivy/audit checks;
- supply no repository/environment/cloud secret and never publish, sign, deploy, upload an artifact, access a private package or contact production; and
- fail closed if the custom runner label is absent.

`pull_request_target`, `workflow_run`, `workflow_dispatch`, `schedule`, runner groups, unpinned actions and privileged containers are prohibited.

## Operating procedure

1. Founder verifies the dedicated account/directory restrictions and issue #11.
2. Download the official GitHub Actions runner while signed into the restricted account; validate the publisher/checksum supplied by GitHub.
3. Register it to this repository only using the short-lived token.
4. Start `run.cmd` interactively and push the approved founder branch.
5. Stop immediately and open an incident/decision issue for an unexpected workflow, permission, external destination, secret request or scope expansion.
6. Stop with `Ctrl+C` after validation; do not leave it unattended.

## Removal and exit criteria

Remove the runner and isolated directory after GitHub-hosted Actions completes a successful synthetic workflow, an approved CI replacement exists, or any sensitive/cloud/production scope begins. Use a short-lived removal token in the restricted account, verify removal from repository settings, then record removal on issue #11. If removal fails, disable the runner from repository settings first and open an incident/decision issue.

## Evidence

The first self-hosted run proves the custom label, repository-only attachment, founder-branch trigger, required checks and absence of secrets/cloud access. Standard pull-request evidence remains required before a merge.
