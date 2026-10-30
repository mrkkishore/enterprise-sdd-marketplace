---
name: sdd-status
description: Show the state, gate results, open questions and pending human decisions for one slice or all slices.
argument-hint: "[SLICE-ID]"
---
# /sdd-core:sdd-status $ARGUMENTS

Read `specs/_index.md`, each slice `status.yaml`, `docs/registers/OPEN-QUESTIONS.md`, and run `validate-gates.js --report`. Print a compact table: slice, state, next gate, missing evidence, BLOCKER questions, pending approvals (with owner role). Change nothing.
