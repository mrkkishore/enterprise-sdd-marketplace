# Gates and required evidence

A slice moves through these states. Each `*_READY` state is a gate. `validate-gates.js` checks the evidence listed for the configured gate profile (`lite`, `standard`, `regulated`).

```
DISCOVER → DISCOVERY_READY → SPECIFY → SPEC_READY → DESIGN → ARCHITECTURE_READY
→ TEST_DESIGN → IMPLEMENT → IMPLEMENTATION_READY → VERIFY → RELEASE_READY
→ HUMAN_APPROVAL → DEPLOY → OBSERVE → CUTOVER → DECOMMISSION → DONE
```

| Gate | Evidence file(s) in `specs/slices/<slice>/evidence/` | lite | standard | regulated |
|------|------|------|----------|-----------|
| DISCOVERY_READY | `discovery-review.md` (checker PASS) | ✓ | ✓ | ✓ |
| | no BLOCKER open questions for slice | ✓ | ✓ | ✓ |
| SPEC_READY | `spec-review.md` (spec-checker PASS) | ✓ | ✓ | ✓ |
| | traceability: every REQ has ≥1 acceptance criterion | ✓ | ✓ | ✓ |
| | behavior/data change approvals (if any) | ✓ | ✓ | ✓ |
| ARCHITECTURE_READY | `architecture-review.md` (architecture-checker PASS) | — | ✓ | ✓ |
| | ADRs referenced exist with status Accepted | — | ✓ | ✓ |
| | threat model section present | — | ✓ | ✓ |
| | POC approvals for spikes listed in design | — | ✓ | ✓ |
| IMPLEMENTATION_READY | `code-review.md` (code-checker PASS) | ✓ | ✓ | ✓ |
| | `independent-review.md` (independent-reviewer PASS) | — | — | ✓ |
| | `test-results.md` all pass, coverage ≥ config | ✓ | ✓ | ✓ |
| | `security-scan.md` (SAST + SCA + secrets) no high/critical | ✓ | ✓ | ✓ |
| | dependency approvals for new deps | — | ✓ | ✓ |
| RELEASE_READY | `functional-parity.md` PASS (brownfield) | — | ✓ | ✓ |
| | `data-parity.md` PASS (brownfield) | — | — | ✓ |
| | `performance.md` within SLO | — | ✓ | ✓ |
| | `accessibility.md` (UI slices) | — | ✓ | ✓ |
| | `deployment-readiness.md` (runbook, rollback, alarms) | — | ✓ | ✓ |
| HUMAN_APPROVAL | `release-readiness.APPROVED.md` | ✓ | ✓ | ✓ |
| CUTOVER | `cutover.APPROVED.md` | — | ✓ | ✓ |
| DECOMMISSION | `decommission.APPROVED.md` | — | ✓ | ✓ |

## Evidence file format
Every evidence file starts with YAML front matter:
```yaml
---
slice: SLICE-003
gate: SPEC_READY
check: spec-review
result: PASS            # PASS | FAIL
produced_by: spec-checker
reviewed_artifact: specs/slices/SLICE-003-payment-allocation/02-spec.md
artifact_sha256: <hash>
date: 2026-10-29
---
```
A FAIL file is kept (renamed `*-FAIL-<n>.md`) as history; the gate only looks at the latest PASS whose hash matches the current artifact.
