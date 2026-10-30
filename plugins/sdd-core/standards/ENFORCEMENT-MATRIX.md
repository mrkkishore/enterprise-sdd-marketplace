# Enforcement matrix

Every rule must have at least one automated enforcer. A rule enforced only by "the agent was told to" is advisory, not enforced.

| Rule | Prompt (agent) | Hook (real time) | Local gate (pre-commit) | CI gate | Human |
|------|----------------|------------------|-------------------------|---------|-------|
| C1 Spec before code | implementer | guard.js blocks src/ writes when slice state < SPEC_READY | validate-gates.js | sdd-gates workflow | — |
| C2 Traceability | spec-writer, test-designer | — | validate-gates.js (trace check) | yes | — |
| C3 Evidence | all checkers | — | validate-gates.js | yes | Gate reviewer |
| C4 Doer/checker split | orchestrator | — | evidence must name a checker ≠ doer | yes | — |
| C5 No assumptions | all | — | open questions register must have no BLOCKER for gate | yes | Product owner |
| C6 Parity | parity-verifier | — | parity evidence required (regulated profile) | yes | Business SME |
| C7 Human decisions | all | guard.js blocks writes to `*.APPROVED.md` and `docs/governance/approvals/` | approval file present + approver in CODEOWNERS | yes (commit author check) | Approvers |
| C8 No AI commits | all | guard.js blocks `git commit/push/merge/rebase` | — | branch protection | Developer |
| C9 Secrets | all | guard.js blocks secret files and secret-looking content | gitleaks | gitleaks | — |
| C10 Scope | implementer | guard.js blocks writes outside slice scope | validate-gates.js (scope) | yes | — |
| C11 Standards integrity | — | guard.js blocks edits to `.claude/rules/enterprise/` | verify-standards checksum | yes | CoE |
| C12 Trail | orchestrator | SessionStart prints state | status.yaml schema check | yes | — |
