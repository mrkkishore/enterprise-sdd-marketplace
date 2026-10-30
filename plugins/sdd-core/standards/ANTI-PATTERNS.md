# Anti-patterns (blocked or flagged by checkers)

| ID | Anti-pattern | Why it is harmful | Detected by |
|----|--------------|-------------------|-------------|
| AP-01 | Writing code before the spec gate passes | Builds the wrong thing fast | validate-gates.js |
| AP-02 | Doer reviews its own output in the same context | Confirmation bias, no real review | Orchestrator, checker agents |
| AP-03 | Inventing a business rule to fill a gap | Silent behavior change | spec-checker, parity-verifier |
| AP-04 | Replacing exact decimal math with floating point | Financial rounding drift | semantic-parity slot, code-checker |
| AP-05 | Tests that assert the implementation, not the requirement | Tests pass, behavior wrong | code-checker |
| AP-06 | Weakening, skipping or deleting a failing test | Hides regressions | guard.js (test deletes), code-checker |
| AP-07 | "Big bang" migration of many capabilities in one slice | Unreviewable diffs | spec-checker (slice size) |
| AP-08 | Hard-coded credentials, URLs, environment names | Security and portability | guard.js, gitleaks |
| AP-09 | Catch-all error handling that swallows exceptions | Hidden failures | code-checker |
| AP-10 | Session reports and scratch files at repo root | Untraceable state | validate-gates.js (paths) |
| AP-11 | Superseding an ADR by copying it to a new folder | Two sources of truth | architecture-checker |
| AP-12 | Approving a gate with evidence from a different slice | False readiness | validate-gates.js |
| AP-13 | Adding a dependency without a dependency approval | Supply-chain risk | validate-gates.js |
| AP-14 | Logging PII, account numbers or tokens | Privacy breach | code-checker, stack-observability slot |
