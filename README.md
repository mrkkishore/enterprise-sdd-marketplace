# Enterprise SDD Marketplace (EA-approved, v1.0.0)

Claude Code plugin marketplace for enterprise AI spec-driven development. Owned by the AI Engineering CoE and Enterprise Architecture.

| Path | What it is |
|---|---|
| `.claude-plugin/marketplace.json` | Plugin catalog |
| `plugins/sdd-core/` | Mandatory core: agents, orchestrator, gates, guardrail hooks, standards, templates |
| `plugins/ea-baseline/` | Mandatory EA baseline: enterprise ADRs and pack catalog, loaded by architect agents |
| `plugins/pack-*/` | Stack and domain packs (template + examples) |
| `enterprise/` | Decision rights, pack catalog, intake forms |
| `docs/` | EA onboarding kit (00), playbook (01–08), **team runbook (09)** |
| `project-template/` | What a team repository looks like after setup |
| `org-admin/` | Managed settings for IT |
| `tools/` | `configure-repo-url.js`, `validate-marketplace.js` |

**Publish:** follow `docs/09-TEAM-RUNBOOK.md` Part 0. **Teams:** start at Part 1.

Requirements: Claude Code, Node.js 18+ (20 recommended), Git; gitleaks recommended.
