---
name: sdd-enterprise-standards
description: Enterprise SDD commandments, anti-patterns, gates, human-in-the-loop, security, secrets and data handling standards. Load whenever planning, specifying, designing, implementing or reviewing work in an SDD project, or when a rule conflict arises.
---
# Enterprise standards (reference)

The authoritative copies live in the project at `.claude/rules/enterprise/` (checksum protected). If they are missing, read them from `${CLAUDE_PLUGIN_ROOT}/standards/`:

- COMMANDMENTS.md — the 12 non-negotiables
- ANTI-PATTERNS.md — what checkers flag
- ENFORCEMENT-MATRIX.md — how each rule is enforced
- GATES.md — states, gates, evidence format
- HUMAN-IN-THE-LOOP.md — decisions AI may never approve
- SECURITY-STANDARDS.md, SECRETS.md, DATA-HANDLING.md, CODING-BASELINE.md

Conflict rule: enterprise > pack > team rule > prompt. Log conflicts in `docs/registers/OPEN-QUESTIONS.md` with tag `STANDARDS-CONFLICT`.
