---
name: testing
description: Testing standards for Node.js Lambda services (Jest/Vitest, test naming with AC IDs, contract tests, Oracle integration tests in containers, parity test harness). Load at TEST_DESIGN, IMPLEMENT and VERIFY.
---
# Testing
- Unit: Vitest; test names start with the AC ID: `it('AC-003-002 rejects negative amount', …)`.
- Contract: validate handlers against the OpenAPI contract.
- Integration: Oracle in a container (gvenzl/oracle-free) with migration scripts; no shared DBs.
- Parity: `tests/parity/` reads golden files, runs the use case, compares with the semantic-parity rules; output written to `evidence/functional-parity.md` by the parity-verifier.
- Coverage threshold from `sdd.config.yaml > gates.coverage_min`.
