# sdd-core

Mandatory enterprise core of the AI spec-driven development framework.

| Component | Contents |
|---|---|
| `agents/` | 12 stack-agnostic doer/checker subagents |
| `skills/` | `sdd-init`, `sdd-new-slice`, `sdd-execute-slice` (orchestrator), `sdd-status`, `sdd-gate-check`, `sdd-adr`, `sdd-new-pack`, `sdd-enterprise-standards` |
| `standards/` | Commandments, anti-patterns, enforcement matrix, gates, HITL, security, secrets, data, coding baseline |
| `hooks/` | SessionStart context + PreToolUse guardrails (secrets, approvals, scope, spec-before-code, no git commit) |
| `scripts/` | Zero-dependency Node.js validators used by hooks, pre-commit and CI |
| `templates/` | Project skeleton, slice templates, ADR, approval and evidence templates |

Teams never edit this plugin. Changes go through the CoE change process (`docs/04-GOVERNANCE-MODEL.md`).
Requires Node.js 18+ on developer machines and CI runners.
