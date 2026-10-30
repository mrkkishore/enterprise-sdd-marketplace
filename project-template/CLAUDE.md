# CLAUDE.md — project memory

This repository follows the **Enterprise AI Spec-Driven Development (SDD) framework**. Read this first in every session.

## How work happens here
- All work is done in **slices** under `specs/slices/SLICE-NNN-*`. The active slice is in `.sdd/active-slice`.
- Lifecycle and gates: `.claude/rules/enterprise/GATES.md`. Drive a slice with `/sdd-core:sdd-execute-slice <SLICE-ID>`.
- Configuration (mode, gate profile, packs, slot skills, approvers): `sdd.config.yaml`.

## Binding rules
- Enterprise rules: `.claude/rules/enterprise/` (read-only, checksum protected). Team additions: `.claude/rules/team/`.
- Spec before code. Doers never check their own work. Evidence decides readiness.
- AI never commits, pushes, approves, deploys, or reads secrets. Humans commit after reviewing the diff.
- Unknowns go to `docs/registers/OPEN-QUESTIONS.md`; never assume.

## Project facts (team fills in)
- Business purpose: <one paragraph>
- Users and access model: <roles, intranet/internet>
- Key integrations: <system — protocol — owner>
- Glossary: `docs/GLOSSARY.md`
- Build: `<command>`  Test: `<command>`  Lint: `<command>`

## Where things go
| Artifact | Location |
|---|---|
| Program-level analysis (inventory, sources, current state) | `analysis/` |
| Slice spec, design, tests plan, evidence, approvals | `specs/slices/<slice>/` |
| ADRs | `docs/architecture/adr/ADR-NNNN-*.md` |
| Registers (questions, assumptions, risks, decisions) | `docs/registers/` |
| Session logs | `.sdd/sessions/` (never repo root) |
