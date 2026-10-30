---
name: sdd-execute-slice
description: Central orchestrator. Advances one slice through the SDD lifecycle by running doer and checker subagents per stage and checking gates. Stops at every human decision.
disable-model-invocation: true
argument-hint: "<SLICE-ID> [--to <STATE>] [--max-loops 3]"
---
# /sdd-core:sdd-execute-slice $ARGUMENTS

You orchestrate. You do not write specs, designs or code yourself; you delegate to subagents and check gates.

## Loop
Read `specs/slices/<SLICE-ID>*/status.yaml`. Then repeat until the target state, a human decision, or max loops:

| Current state | Doer subagent | Checker subagent | Gate to pass |
|---|---|---|---|
| DISCOVER | discovery-analyst | discovery-checker | DISCOVERY_READY |
| SPECIFY | spec-writer | spec-checker | SPEC_READY |
| DESIGN | solution-architect | architecture-checker | ARCHITECTURE_READY |
| TEST_DESIGN | test-designer | spec-checker (test-to-AC coverage mode) | — (moves to IMPLEMENT) |
| IMPLEMENT | implementer | code-checker (+ independent-reviewer if regulated) | IMPLEMENTATION_READY |
| VERIFY | parity-verifier (brownfield) / code-checker in verify mode (greenfield), then release-assessor for performance + deployment-readiness evidence | — | RELEASE_READY |
| RELEASE_READY | release-assessor | — | HUMAN_APPROVAL (human) |

For each stage:
1. Invoke the doer with: slice ID, stage, paths of inputs, slot skills to load (from `sdd.config.yaml > slots`).
2. Invoke the checker in a **separate** subagent call. Never pass it the doer's reasoning, only artifact paths.
3. If the checker FAILs: send findings to the doer, re-run, re-check. Count loops. After `--max-loops` (default 3) stop and escalate to the human with the findings.
4. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/validate-gates.js" --slice <ID> --gate <GATE>`.
5. If the gate passes, update `status.yaml` (`state`, `history[]` with date, gate, evidence files) and continue.
6. If a BLOCKER open question or a required approval is missing: stop, list exactly what the human must decide and which template to use.

## Never
- Advance past HUMAN_APPROVAL, DEPLOY, CUTOVER or DECOMMISSION on your own.
- Edit approvals, enterprise rules, or files outside scope.
- Commit.

## End of run
Write `.sdd/sessions/<date>-<SLICE-ID>.md`: states passed, loops used, evidence created, open questions, next human action.
