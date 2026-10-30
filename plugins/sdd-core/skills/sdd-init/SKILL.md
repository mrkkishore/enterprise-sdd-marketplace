---
name: sdd-init
description: Bootstrap a repository for enterprise spec-driven development. Interviews the team, writes sdd.config.yaml, CLAUDE.md, SECURITY.md, the standard folder structure, copies enterprise rules and installs git hooks. Run once per repository.
disable-model-invocation: true
---
# /sdd-core:sdd-init

You are setting up this repository for the enterprise SDD framework. Do not write application code.

## Step 1 — Interview (ask in one message, wait for answers)
1. Project name and short ID (e.g. `PAYHUB`)
2. Mode: `greenfield` or `brownfield`
3. Brownfield only: legacy source location(s) and legacy stack
4. Target stack (choose an installed target pack, or `none yet`)
5. Data classification first, then gate profile — the minimum profile comes from EA-ADR-007 in `ea-baseline`; never accept a weaker one. Gate profile: `lite` (internal tools), `standard` (default), `regulated` (financial, SOX, customer data)
6. Data classification (public / internal / confidential / restricted)
7. Approvers by role: product owner, business SME, solution architect, security architect, data owner, release manager (names + git emails)
8. Repository paths for src, tests (defaults: `src/`, `tests/`)

## Step 2 — Generate (feature delta only; never overwrite an existing file — create `<name>.sdd-proposed` instead)
Copy from `${CLAUDE_PLUGIN_ROOT}/templates/project/`:
- `sdd.config.yaml` filled with the answers and the slot map from the chosen packs' `PACK.yaml`
- `CLAUDE.md`, `SECURITY.md`, `.gitleaks.toml`, `.github/CODEOWNERS`, `.github/workflows/sdd-gates.yml`, `.githooks/pre-commit`
- `.claude/settings.json` (marketplace + enabled plugins)
- Folders: `specs/slices/`, `docs/architecture/adr/`, `docs/governance/approvals/`, `docs/registers/`, `analysis/`, `.sdd/sessions/`
- Copy `${CLAUDE_PLUGIN_ROOT}/scripts/*.js` to `.sdd/tools/` (used by the pre-commit hook; CI fetches its own pinned copy)
- Copy `${CLAUDE_PLUGIN_ROOT}/templates/approvals/*` to `docs/governance/approvals/templates/`
- Copy `${CLAUDE_PLUGIN_ROOT}/standards/*.md` to `.claude/rules/enterprise/` and write `.claude/rules/enterprise/CHECKSUMS.sha256`
- Create `.claude/rules/team/README.md` explaining team rules may only add restrictions

## Step 3 — Verify
Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-pack-contract.js"` and `node "${CLAUDE_PLUGIN_ROOT}/scripts/verify-standards.js"`. Report missing slots.

## Step 4 — Hand over
Print: files created, files proposed (not overwritten), missing slots, and the next command:
`git config core.hooksPath .githooks` (the human runs it) then `/sdd-core:sdd-new-slice`.
Do not commit.
