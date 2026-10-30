---
name: sdd-adr
description: Draft a new Architecture Decision Record or supersede an existing one using the enterprise ADR template.
argument-hint: "<title> | supersede ADR-NNNN <title>"
---
# /sdd-core:sdd-adr $ARGUMENTS

- Use `${CLAUDE_PLUGIN_ROOT}/templates/adr/ADR-template.md`. Next number from `docs/architecture/adr/`.
- Status is always `Proposed`. Only a human sets `Accepted`.
- To supersede: create the new ADR, and in the old ADR change only the `Superseded by:` line. Never copy ADRs into version folders (AP-11).
- Include context, options (≥2) with trade-offs, decision, consequences, compliance with enterprise standards, links to slices.
