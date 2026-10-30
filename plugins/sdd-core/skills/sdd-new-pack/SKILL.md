---
name: sdd-new-pack
description: Scaffold a new stack, source or domain pack plugin from the pack template, with the slot contract filled in. For pack authors.
disable-model-invocation: true
argument-hint: "<pack-name> <type: target|source|domain>"
---
# /sdd-core:sdd-new-pack $ARGUMENTS

1. Copy `pack-template` to `plugins/<pack-name>/` in the marketplace repo.
2. Update `.claude-plugin/plugin.json` and `PACK.yaml` (type, slots provided, compatible core version).
3. Create one skill folder per slot the pack type requires (see `PACK.yaml` in the template).
4. Interview the author for each slot: standards, patterns, approved libraries, examples, checklists. Write them as concise SKILL.md files with `references/` for long material.
5. Run `check-pack-contract.js --pack plugins/<pack-name>`.
6. Add the pack to `.claude-plugin/marketplace.json` with version `0.1.0`. Do not commit.
