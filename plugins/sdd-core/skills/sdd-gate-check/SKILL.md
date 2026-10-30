---
name: sdd-gate-check
description: Run the deterministic gate validator for a slice and explain any failures in plain language.
argument-hint: "<SLICE-ID> <GATE>"
---
# /sdd-core:sdd-gate-check $ARGUMENTS

Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/validate-gates.js" --slice <SLICE-ID> --gate <GATE>`. Explain each failing check and which agent or human role fixes it. Do not fix anything and do not edit evidence.
