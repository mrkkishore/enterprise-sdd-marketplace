# 5. Prompt library

Copy-paste prompts for Claude Code. Every prompt states scope, a **do NOT touch** list, and that the AI must not commit. Replace `<…>`.

---
## P-01 — Build the enterprise core from an existing pilot repository (CoE, one time)
```
Context: <pilot-repo-path> contains a working AI spec-driven modernization setup (.claude/agents, rules, skills, workflows, docs/governance, scripts, .githooks).
Goal: extract a stack-agnostic enterprise core into <marketplace-path>/plugins/sdd-core, following the structure of the starter kit already in <marketplace-path>.

Do:
1. Inventory every agent, rule, skill, workflow, template, script in the pilot. Classify each as CORE (stack-agnostic), PACK (stack/domain specific) or PROJECT (application specific). Write the table to <marketplace-path>/docs/extraction-inventory.md.
2. For CORE items: merge pilot improvements into the existing sdd-core files. Remove every application name, business term, technology name and environment detail. Replace technology references with slot names (see docs/01-FRAMEWORK-OVERVIEW.md 1.3).
3. For PACK items: place them in the matching pack (source or target) as slot skills.
4. List PROJECT items only; do not copy them.
5. Run check-pack-contract.js for every pack and report results.

Do NOT touch: the pilot repository (read-only), .claude/rules/enterprise in any project, any *.APPROVED.md, any secrets or .env files.
Do not commit. Deliver feature delta only and list every file created or changed.
```

## P-02 — Onboard a repository (team, one time)
```
/sdd-core:sdd-init
```
Follow-up if files already existed:
```
Compare each *.sdd-proposed file with the existing file. Propose a merged version that keeps our project facts and adds the enterprise sections. Show diffs only; do not overwrite. Do NOT touch src/, tests/, .claude/rules/enterprise/. Do not commit.
```

## P-03 — Program-level brownfield analysis (team, once per program)
```
Using the legacy-analysis slot skill from sdd.config.yaml, analyze the legacy code at <paths.legacy> (read-only).
Produce in analysis/: 00-repository-inventory.md, 00-documentation-sources.md, 01-current-state.md, 02-domain-model.md, 03-gaps-and-conflicts.md, 04-slice-plan.md.
The slice plan groups capabilities into vertical slices of ≤15 requirements each, ordered in waves by dependency and risk, with the first wave being low-risk read-only capabilities.
Every claim cites file:line. Unknowns go to docs/registers/OPEN-QUESTIONS.md.
Do NOT touch: the legacy code, src/, tests/, specs/slices/. Do not commit.
```

## P-04 — Greenfield discovery
```
Read analysis/00-business-brief.md and any integration docs in <paths>. Produce analysis/01-current-landscape.md (systems, data owners, integrations), analysis/02-domain-model.md and analysis/04-slice-plan.md. Ask me for anything not in the documents instead of assuming.
Do NOT touch: src/, tests/. Do not commit.
```

## P-05 — Create a slice
```
/sdd-core:sdd-new-slice <short-name> <one-sentence capability>
```

## P-06 — Run a slice to a target gate
```
/sdd-core:sdd-execute-slice SLICE-<NNN> --to SPEC_READY
```
Use `--to ARCHITECTURE_READY`, `--to IMPLEMENTATION_READY`, `--to RELEASE_READY` to stop at later gates.

## P-07 — Resolve open questions with the product owner
```
List all OPEN questions for SLICE-<NNN> in docs/registers/OPEN-QUESTIONS.md as a short interview, one question at a time, with the options you see and the evidence for each. After I answer, record the answer and decision reference. Do NOT edit the spec yourself; the spec-writer will be re-run. Do not commit.
```

## P-08 — Draft an approval request (AI drafts, human approves)
```
For SLICE-<NNN>, draft specs/slices/<slice>/approvals/<type>.REQUEST.md using the matching template in docs/governance/approvals/templates/. Include the exact evidence files and their sha256 hashes, the risks, and what the approver is agreeing to. Do NOT create any *.APPROVED.md file. Do not commit.
```

## P-09 — Review an AI-generated diff before commit (developer)
```
Summarize the uncommitted changes for SLICE-<NNN>: files changed, which REQ/AC each change serves, tests added, anything outside status.yaml scope, any new dependency, any TODO. Flag anything a reviewer should look at closely. Change nothing.
```

## P-10 — Create a new pack (pack owner)
```
/sdd-core:sdd-new-pack pack-<name> <target|source|domain>
```
Then:
```
For each slot skill in plugins/pack-<name>, interview me about our mandatory standards, approved libraries and versions, patterns and review checklist. Write concise SKILL.md files and move long material to references/. Run check-pack-contract.js. Do NOT touch plugins/sdd-core or other packs. Do not commit.
```

## P-11 — Standards conflict
```
A pack or team rule conflicts with an enterprise standard in SLICE-<NNN>: <describe>. Apply the enterprise standard, log the conflict in docs/registers/OPEN-QUESTIONS.md with tag STANDARDS-CONFLICT, and draft an exception-waiver.REQUEST.md if the team believes an exception is justified. Do not commit.
```

## P-12 — Retrospective after a slice
```
Read .sdd/sessions/*SLICE-<NNN>*, the evidence FAIL files and status.yaml history. Report: checker loops per stage, top finding categories, guardrail blocks, human wait time, and 3 concrete improvements, each labeled CORE (send to CoE), PACK (send to pack owner) or TEAM (team rules). Change nothing.
```
