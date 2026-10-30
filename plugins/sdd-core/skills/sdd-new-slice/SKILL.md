---
name: sdd-new-slice
description: Create a new vertical slice (one coherent capability) with its charter, status file and folder from templates. Use when starting a new piece of work.
disable-model-invocation: true
argument-hint: "<short-name> [capability description]"
---
# /sdd-core:sdd-new-slice $ARGUMENTS

1. Determine next ID from `specs/_index.md` (`SLICE-NNN`).
2. Create `specs/slices/SLICE-NNN-<short-name>/` by copying `${CLAUDE_PLUGIN_ROOT}/templates/slice/`.
3. Fill `00-slice-charter.md` from the description: goal, users, in scope, out of scope, legacy entry points (brownfield), success measures. Leave unknowns as open questions.
4. Fill `scope:` in `status.yaml` with the paths this slice may change (ask the human to confirm).
5. Set `state: DISCOVER`. Write the slice ID to `.sdd/active-slice` (this makes it the active slice for guardrails). Add a row to `specs/_index.md`.
6. Sizing check: if the description covers more than one capability or likely >15 requirements, propose a split and stop.
