# Pack template

1. Copy this folder to `plugins/<your-pack>/` (or run `/sdd-core:sdd-new-pack`).
2. Set `type` in `PACK.yaml`; keep only the slots for that type.
3. Fill each SKILL.md: mandatory standards, approved libraries, patterns, review checklist.
4. Validate: `node plugins/sdd-core/scripts/check-pack-contract.js --pack plugins/<your-pack>`
5. Add to `.claude-plugin/marketplace.json`, open a PR to the CoE marketplace repo.

Rules for packs: may be stricter than enterprise standards, never weaker; no hooks that disable core hooks; no agents that duplicate core agent names.
