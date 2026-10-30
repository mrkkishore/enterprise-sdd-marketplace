# 2. Team adoption guide

## 2.1 Prerequisites (per developer, Windows Command Prompt)
```bat
node --version
git --version
claude --version
winget install gitleaks
```
Node.js 18+ is required for the hooks and validators.

## 2.2 Decide before you start (30-minute team session)
| Decision | Options | Who |
|---|---|---|
| Mode | greenfield / brownfield | Tech lead |
| Gate profile | lite / standard / regulated | Product owner + architect |
| Target pack | existing pack, or build one (Section 3) | Architect |
| Source pack (brownfield) | existing pack, or build one | Architect |
| Approvers per role | names + git emails | Product owner |
| First slice | smallest valuable, low-risk capability | Team |

## 2.3 Set up the repository
```bat
cd C:\work\my-app
git checkout -b sdd-setup
claude
```
Inside Claude Code:
```
/plugin marketplace add https://github.com/mrkkishore/enterprise-sdd-marketplace
/plugin install sdd-core@enterprise-sdd
/plugin install <your-target-pack>@enterprise-sdd
/sdd-core:sdd-init
```
Then, in Command Prompt, review and commit the scaffold yourself:
```bat
git config core.hooksPath .githooks
git status
git diff
git add -A
git commit -m "chore: adopt enterprise SDD framework"
```

## 2.4 Brownfield path
1. **Program analysis (once):** run prompt P-03 (Prompt Library) to produce `analysis/00-repository-inventory.md` through `analysis/04-slice-plan.md`. A human reviews the slice plan and waves.
2. **Create slices** from the plan: `/sdd-core:sdd-new-slice <name> <capability>`.
3. **Run a slice:** `/sdd-core:sdd-execute-slice SLICE-001`. It stops at every gate that needs a human.
4. **POCs early:** anything risky in the design (connectivity, decimal parity, auth) becomes a POC with explicit success criteria and a `poc-approval`.
5. **Parity:** build golden datasets before implementation (TEST_DESIGN). The parity-verifier must show zero unexplained diffs.
6. **Cutover and decommission** are human decisions with their own approvals.

## 2.5 Greenfield path
1. Write a business brief in `analysis/00-business-brief.md` (problem, users, outcomes, constraints).
2. Use the discovery-analyst for domain and integration discovery (no legacy).
3. Same slice loop; parity gates are skipped automatically.

## 2.6 Day-to-day loop for a developer
```
/sdd-core:sdd-status
/sdd-core:sdd-execute-slice SLICE-004 --to SPEC_READY
(review spec in VS Code; answer open questions; product owner signs approvals)
/sdd-core:sdd-execute-slice SLICE-004 --to IMPLEMENTATION_READY
(review diff; run tests yourself; commit)
```

## 2.7 What a team may customize
| Allowed | Not allowed |
|---|---|
| Add rules in `.claude/rules/team/` | Edit `.claude/rules/enterprise/` |
| Choose gate profile (with architect sign-off) | Lower the profile below the data classification minimum |
| Add domain packs and team skills | Override core agent names or disable core hooks |
| Raise coverage or add evidence checks | Remove gates or evidence |
| Add approvers | Approve your own AI-generated change as the only approver |

## 2.8 Troubleshooting
| Symptom | Cause | Fix |
|---|---|---|
| "SDD guardrail blocked this action" | A hook rule fired | Read the message; widen scope in `status.yaml` or advance the slice properly |
| Gate fails "changed after review" | Artifact edited after checker PASS | Re-run the checker for that stage |
| "slot unmapped" | Missing pack | Install the pack or map the slot in `sdd.config.yaml` |
| Checker loops 3 times | Spec or design genuinely ambiguous | Answer the open questions; don't raise max loops |
