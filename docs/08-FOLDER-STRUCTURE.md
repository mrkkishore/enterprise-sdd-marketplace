# 8. Standard folder structures

## 8.1 Marketplace repository (CoE)
```
enterprise-sdd-marketplace/
├── .claude-plugin/marketplace.json
└── plugins/
    ├── sdd-core/
    │   ├── .claude-plugin/plugin.json
    │   ├── agents/          discovery-analyst, discovery-checker, spec-writer, spec-checker,
    │   │                    solution-architect, architecture-checker, test-designer, implementer,
    │   │                    code-checker, independent-reviewer, parity-verifier, release-assessor
    │   ├── skills/          sdd-init, sdd-new-slice, sdd-execute-slice, sdd-status,
    │   │                    sdd-gate-check, sdd-adr, sdd-new-pack, sdd-enterprise-standards
    │   ├── standards/       COMMANDMENTS, ANTI-PATTERNS, ENFORCEMENT-MATRIX, GATES,
    │   │                    HUMAN-IN-THE-LOOP, SECURITY-STANDARDS, SECRETS, DATA-HANDLING, CODING-BASELINE
    │   ├── hooks/hooks.json
    │   ├── scripts/         lib, guard, session-context, validate-gates, verify-standards,
    │   │                    check-pack-contract, verify-approvers (.js)
    │   └── templates/       project/, slice/, adr/, approvals/, evidence/
    └── pack-<name>/
        ├── .claude-plugin/plugin.json
        ├── PACK.yaml        type, compatible_core, owner, provides: slot → skill
        └── skills/<skill>/SKILL.md (+ references/)
```

## 8.2 Team project repository (after `/sdd-core:sdd-init`)
```
<repo>/
├── CLAUDE.md                    project memory (Claude Code loads it every session)
├── SECURITY.md                  security policy and reporting
├── sdd.config.yaml              mode, profile, packs, slot map, paths, approvers
├── .nvmrc  .gitleaks.toml
├── .claude/
│   ├── settings.json            marketplace + enabled plugins + deny rules
│   └── rules/
│       ├── enterprise/          read-only copy of core standards + CHECKSUMS.sha256
│       └── team/                additive team rules
├── .githooks/pre-commit         standards checksum, gates, gitleaks
├── .github/
│   ├── CODEOWNERS
│   └── workflows/sdd-gates.yml
├── .sdd/
│   ├── active-slice
│   ├── sessions/                orchestrator session logs
│   └── tools/                   local copy of validators for pre-commit
├── analysis/                    program-level discovery and slice plan
├── specs/
│   ├── _index.md                slice backlog and state
│   └── slices/SLICE-NNN-<name>/
│       ├── status.yaml          state, scope, history
│       ├── 00-slice-charter.md  01-discovery.md  02-spec.md  03-design.md
│       ├── 04-test-design.md    05-implementation-notes.md   06-verification.md
│       ├── evidence/            checker and CI outputs (front matter, PASS/FAIL)
│       └── approvals/           *.APPROVED.md (humans only), *.REQUEST.md (AI drafts)
├── docs/
│   ├── architecture/adr/        ADR-NNNN-*.md
│   ├── governance/approvals/templates/
│   └── registers/               OPEN-QUESTIONS, ASSUMPTIONS, RISKS
├── src/
└── tests/
```
