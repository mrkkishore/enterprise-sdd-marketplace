# Team runbook: from the EA repository to a released slice

Commands use **Windows Command Prompt** syntax. Lines that start with `/` are typed **inside Claude Code**. Replace `<org>`, `<app>` and slice names with your own. The AI never commits or pushes; every `git commit` below is typed by a human.

## Part 0 — EA publishes the framework (once)

### 0.1 Unpack and validate
```bat
cd C:\work
tar -xf enterprise-sdd-marketplace.zip
cd enterprise-sdd-marketplace
node tools\validate-marketplace.js
```

### 0.2 Ratify the baseline ADRs
Open each file in `plugins\ea-baseline\skills\enterprise-baseline\references\` and change `Status: Proposed` to `Status: Accepted` for every decision EA has approved. Leave EA-ADR-008 (hosting platform) as Proposed until the platform decision is made. Replace the `@ai-coe`, `@enterprise-architecture` and `@security-architecture` handles in `.github\CODEOWNERS` with your real groups.

### 0.3 Point the framework at your repository URL
```bat
node tools\configure-repo-url.js https://github.com/<org>/enterprise-sdd-marketplace.git
```

### 0.4 Push and tag
```bat
git init -b main
git add -A
git commit -m "feat: EA-approved SDD framework v1.0.0"
git remote add origin https://github.com/<org>/enterprise-sdd-marketplace.git
git push -u origin main
git tag sdd-core-v1.0.0
git push origin sdd-core-v1.0.0
```
Team CI pipelines fetch the validators at the tag named in each project's `sdd.config.yaml` (`core_version`), so every release needs a matching `sdd-core-vX.Y.Z` tag.

### 0.5 Protect the repository
Enable branch protection on `main`: pull request required, CODEOWNERS review required, `validate-marketplace` check required.

### 0.6 Make the core mandatory (IT / endpoint team)
Run in an **administrator** Command Prompt on each machine, or push the file with Intune/SCCM:
```bat
mkdir "C:\Program Files\ClaudeCode"
copy org-admin\managed-settings.json "C:\Program Files\ClaudeCode\managed-settings.json"
```
Confirm the location and keys against the current Claude Code settings documentation before rollout.

## Part 1 — Prepare each developer machine (once per person)
```bat
node --version
git --version
claude --version
winget install --id Gitleaks.Gitleaks
```
Node.js must be 18 or later (20 recommended). Install Claude Code from your enterprise software catalog if `claude --version` fails.

## Part 2 — Onboard a repository (tech lead, once per application)

### 2.1 Intake and kickoff
Fill in `enterprise/intake/project-intake.md` from the EA repository and send it to EA. In the 30-minute kickoff, agree mode, data classification, gate profile, packs and approvers.

### 2.2 Install the framework in the repository
```bat
cd C:\work\<app>
git checkout -b chore/adopt-sdd
claude
```
```
/plugin marketplace add https://github.com/<org>/enterprise-sdd-marketplace.git
/plugin install sdd-core@enterprise-sdd
/plugin install ea-baseline@enterprise-sdd
/plugin install pack-java-ejb-legacy@enterprise-sdd
/plugin install pack-nodejs-lambda@enterprise-sdd
```
Install only the packs agreed at kickoff. Restart Claude Code (`/exit`, then `claude`) so the plugins load.

### 2.3 Run the setup interview
```
/sdd-core:sdd-init
```
Answer in one message, for example:
```
1. Name: Receivables Hub, ID: RCVH
2. Mode: brownfield
3. Legacy: C:\work\rcvh-legacy (Java 8, EJB 3.1, JSF 2.2, EclipseLink, Oracle 12c, WebLogic)
4. Target pack: pack-nodejs-lambda
5. Data classification: confidential -> profile: standard
6. Approvers: PO jane.doe@example.com; SME raj.k@example.com; architect arch.lead@example.com; security sec.arch@example.com; data owner data.owner@example.com; release manager rel.mgr@example.com
7. Paths: src/ and tests/
```
If any file already existed, sdd-init writes `<name>.sdd-proposed` instead of overwriting. Merge those with this prompt:
```
Compare each *.sdd-proposed file with the existing file. Propose a merged version that keeps our project facts and adds the enterprise sections. Show diffs only.
Do NOT touch: src/, tests/, .claude/rules/enterprise/. Do not commit.
```

### 2.4 Review, enable hooks, commit, open a pull request
```bat
git status
git diff --stat
git config core.hooksPath .githooks
git add -A
git commit -m "chore: adopt enterprise SDD framework"
git push -u origin chore/adopt-sdd
```
Open the pull request. After merge, enable branch protection on `main` with the `sdd-gates` check required.

## Part 3 — Every developer joining the project
```bat
git clone https://github.com/<org>/<app>.git
cd <app>
git config core.hooksPath .githooks
claude
```
Accept the prompt to trust the repository and install its marketplace and plugins, then:
```
/sdd-core:sdd-status
```

## Part 4 — Program analysis (once per application)

### 4.1 Brownfield
```bat
git checkout -b analysis/program
claude
```
```
Using the legacy-analysis slot skill from sdd.config.yaml, analyze the legacy code at paths.legacy (read-only).
Produce in analysis/: 00-repository-inventory.md, 00-documentation-sources.md, 01-current-state.md, 02-domain-model.md, 03-gaps-and-conflicts.md, 04-slice-plan.md.
The slice plan groups capabilities into vertical slices of at most 15 requirements each, ordered in waves by dependency and risk; wave 1 is low-risk, read-only capabilities.
Every claim cites file:line. Unknowns go to docs/registers/OPEN-QUESTIONS.md.
Do NOT touch: the legacy code, src/, tests/, specs/slices/. Do not commit.
```

### 4.2 Greenfield
Write `analysis\00-business-brief.md` (problem, users, outcomes, constraints), then:
```
Read analysis/00-business-brief.md and the integration documents in <paths>. Produce analysis/01-current-landscape.md, analysis/02-domain-model.md and analysis/04-slice-plan.md. Ask me for anything not in the documents instead of assuming.
Do NOT touch: src/, tests/. Do not commit.
```

### 4.3 EA checkpoint
```bat
git add analysis docs\registers
git commit -m "docs: program analysis and slice plan"
git push -u origin analysis/program
```
Open a pull request and add Enterprise Architecture as reviewer. EA reviews the slice plan and waves. Merge after approval.

## Part 5 — The slice loop (repeat for every slice)

### 5.1 Create the slice and its branch
```bat
git checkout main
git pull
git checkout -b slice/SLICE-001-payment-allocation
claude
```
```
/sdd-core:sdd-new-slice payment-allocation Allocate incoming customer payments to open invoices
```
Confirm the scope paths it proposes. The slice becomes the active slice. To switch later: `echo SLICE-002>.sdd\active-slice`

### 5.2 Discover → DISCOVERY_READY
```
/sdd-core:sdd-execute-slice SLICE-001 --to DISCOVERY_READY
```
Review `01-discovery.md` and `evidence\discovery-review.md`. If it stops on open questions, answer them with the product owner:
```
List all OPEN questions for SLICE-001 in docs/registers/OPEN-QUESTIONS.md as a short interview, one question at a time, with the options you see and the evidence for each. After I answer, record the answer and decision reference.
Do NOT edit the spec yourself. Do not commit.
```
Then re-run the same `sdd-execute-slice` command.

### 5.3 Specify → SPEC_READY
```
/sdd-core:sdd-execute-slice SLICE-001 --to SPEC_READY
```
If the spec contains `Type: CHANGE` requirements, a behavior-change approval is needed. Let the AI draft the request:
```
For SLICE-001, draft specs/slices/SLICE-001-payment-allocation/approvals/behavior-change.REQUEST.md from docs/governance/approvals/templates/behavior-change.APPROVED.md.template. Include the CHANGE requirements, the evidence files and their sha256 hashes, and the risks.
Do NOT create any *.APPROVED.md file. Do not commit.
```
The **product owner** (as git author) creates and commits the approval:
```bat
copy docs\governance\approvals\templates\behavior-change.APPROVED.md.template specs\slices\SLICE-001-payment-allocation\approvals\behavior-change.APPROVED.md
notepad specs\slices\SLICE-001-payment-allocation\approvals\behavior-change.APPROVED.md
git add specs\slices\SLICE-001-payment-allocation\approvals
git commit -m "approve(SLICE-001): behavior change"
```
Re-run to SPEC_READY, then save progress:
```bat
git add specs docs
git commit -m "spec(SLICE-001): spec ready"
```

### 5.4 Design → ARCHITECTURE_READY
```
/sdd-core:sdd-execute-slice SLICE-001 --to ARCHITECTURE_READY
```
If the design needs a new decision:
```
/sdd-core:sdd-adr Use idempotency keys for payment allocation API
```
New ADRs are `Proposed`; the solution architect sets them to `Accepted`. If the design deviates from an Accepted EA-ADR, submit `enterprise/intake/exception-request.md`; EA commits `exception-waiver.APPROVED.md`. POCs listed in the design need `poc-approval.APPROVED.md` from the architect.
```bat
git add specs docs
git commit -m "design(SLICE-001): architecture ready"
```

### 5.5 Test design and implement → IMPLEMENTATION_READY
```
/sdd-core:sdd-execute-slice SLICE-001 --to IMPLEMENTATION_READY
```
Review the changes before committing:
```
Summarize the uncommitted changes for SLICE-001: files changed, which REQ/AC each change serves, tests added, anything outside status.yaml scope, any new dependency, any TODO. Flag anything a reviewer should look at closely. Change nothing.
```
Run the tests yourself, then commit (the pre-commit hook runs the gates and gitleaks):
```bat
npm test
git diff
git add -A
git commit -m "feat(SLICE-001): payment allocation"
```
New dependencies need `dependency-approval.APPROVED.md` from the tech lead and security.

### 5.6 Verify → RELEASE_READY
```
/sdd-core:sdd-execute-slice SLICE-001 --to RELEASE_READY
```
For brownfield, the parity-verifier must show zero unexplained differences. Review `06-verification.md`, the evidence files and `07-release-readiness.md`.
```bat
git add -A
git commit -m "verify(SLICE-001): release ready"
git push -u origin slice/SLICE-001-payment-allocation
```

### 5.7 Human approval, pull request and merge
The release manager or product owner creates and commits `release-readiness.APPROVED.md` the same way as in 5.3. Open the pull request; CI runs `sdd-gates` (standards, slots, gates, approvers, secrets). Merge after review.

### 5.8 Deploy, observe, cut over, decommission
Deploy through the normal pipeline (humans only). Record each step:
```
Record that SLICE-001 was deployed to production on <date> with release <id>. Set state to OBSERVE in its status.yaml and add a history entry. Change nothing else. Do not commit.
```
Cutover and legacy decommissioning each need their approval file (`cutover.APPROVED.md`, `decommission.APPROVED.md`) before the state moves.

### 5.9 Retrospective
```
Read .sdd/sessions/*SLICE-001*, the evidence FAIL files and status.yaml history. Report: checker loops per stage, top finding categories, guardrail blocks, human wait time, and 3 concrete improvements, each labeled CORE (send to CoE), PACK (send to pack owner) or TEAM (team rules). Change nothing.
```
Send CORE items with `enterprise/intake/core-change-request.md`; add TEAM items to `.claude/rules/team/`.

## Part 6 — Command cheat sheet

| Goal | Command (inside Claude Code) |
|---|---|
| See all slices and what's blocking | `/sdd-core:sdd-status` |
| Start a slice | `/sdd-core:sdd-new-slice <name> <capability>` |
| Advance a slice | `/sdd-core:sdd-execute-slice SLICE-NNN --to <GATE>` |
| Explain a failing gate | `/sdd-core:sdd-gate-check SLICE-NNN <GATE>` |
| Draft an ADR | `/sdd-core:sdd-adr <title>` |
| Build a new pack | `/sdd-core:sdd-new-pack pack-<name> <target/source/domain>` |

| Goal | Command (Command Prompt) |
|---|---|
| Check gates locally | `node .sdd\tools\validate-gates.js --all` |
| Check one gate | `node .sdd\tools\validate-gates.js --slice SLICE-001 --gate SPEC_READY` |
| Check enterprise rules intact | `node .sdd\tools\verify-standards.js` |
| Check slot mapping | `node .sdd\tools\check-pack-contract.js` |
| Switch active slice | `echo SLICE-002>.sdd\active-slice` |

## Part 7 — Upgrading to a new framework version
Inside Claude Code:
```
/plugin marketplace update enterprise-sdd
```
Then in Command Prompt (humans only, because the guardrails block AI edits to enterprise rules):
```bat
git checkout -b chore/sdd-upgrade
git clone --depth 1 --branch sdd-core-v1.1.0 https://github.com/<org>/enterprise-sdd-marketplace.git %TEMP%\sdd
xcopy /Y %TEMP%\sdd\plugins\sdd-core\standards\*.md .claude\rules\enterprise\
xcopy /Y %TEMP%\sdd\plugins\sdd-core\scripts\*.js .sdd\tools\
node .sdd\tools\verify-standards.js --write
rmdir /S /Q %TEMP%\sdd
```
Update `core_version` in `sdd.config.yaml`, then commit and open a pull request.

## Part 8 — Troubleshooting

| Symptom | Fix |
|---|---|
| "SDD guardrail blocked this action" | Read the reason. Widen `scope` in the slice's `status.yaml`, or advance the slice to the right state. Never work around the hook. |
| Gate says "changed after review" | The artifact was edited after the checker passed it. Re-run the slice to that gate. |
| "slot unmapped" | Install the missing pack or map the slot in `sdd.config.yaml`. |
| Checker failed 3 times and stopped | The spec or design is ambiguous. Answer the open questions; don't raise the loop limit. |
| Pre-commit fails on approver | The approval file must be committed by the approver's own git identity listed in `sdd.config.yaml`. |
| Plugins not available after install | Exit and restart Claude Code. |
