# 1. Framework overview

## 1.1 Why a generic framework
The first modernization pilot proved that AI agents can discover legacy behavior, write specs, design, implement and verify with high quality **when** they work inside a disciplined loop: spec first, doer/checker separation, evidence-based gates and human approval for consequential decisions. It also showed that most of what made it work is not specific to Java, Node.js, Lambda or the application. Only about a third of the pilot's assets (its skills) were stack-specific. The rest — agents, workflows, rules, gates, templates, hooks — can be shared by every team.

## 1.2 Three layers
| Layer | Owned by | Contains | Changes how |
|---|---|---|---|
| **1. Enterprise core** (`sdd-core` plugin) | AI Engineering CoE | Lifecycle, 12 generic agents, orchestrator, gates, evidence format, HITL policy, security/secrets standards, guardrail hooks, validators, templates | CoE change request, semantic versioning |
| **2. Packs** (plugins) | Guilds / platform teams / domain teams | Skills that fill named **slots**: target stack, source stack (brownfield), domain knowledge | Pack owner PR, contract check |
| **3. Project configuration** (team repo) | Product team | `sdd.config.yaml`, `CLAUDE.md`, team rules (additive), slices, ADRs, evidence, approvals | Team, within guardrails |

## 1.3 The slot contract (the "plug" in plug-and-play)
Core agents never name a technology. They ask for a **slot**, and `sdd.config.yaml` says which pack skill fills it.

| Slot | Used by | Example filler |
|---|---|---|
| `stack-coding-standards` | implementer, code-checker | `pack-nodejs-lambda:coding-standards` |
| `stack-project-setup` | implementer | `pack-dotnet-aks:project-setup` |
| `stack-api-patterns` | solution-architect, implementer | `pack-spring-boot-openshift:api-patterns` |
| `stack-data-access` | solution-architect, implementer | `pack-nodejs-lambda:data-access-oracle` |
| `stack-testing` | test-designer, implementer | `pack-react-spa:testing` |
| `stack-security-integration` | architect, implementer, checkers | `pack-nodejs-lambda:security-entra-id` |
| `stack-observability` | architect, implementer | `pack-nodejs-lambda:observability` |
| `stack-deployment` | architect, release-assessor | `pack-nodejs-lambda:deployment-sam-cdk` |
| `legacy-analysis` (brownfield) | discovery-analyst | `pack-java-ejb-legacy:legacy-analysis` |
| `legacy-to-target-mapping` (brownfield) | architect, implementer | `pack-java-ejb-legacy:ejb-to-nodejs-mapping` |
| `semantic-parity` (brownfield) | test-designer, parity-verifier | `pack-java-ejb-legacy:financial-semantic-parity` |
| `domain-knowledge` (optional) | all doers | `pack-domain-billing:domain-knowledge` |

A Java → Spring Boot team and a .NET Framework → .NET 8 team run the **same** agents and gates; only their slot map differs.

## 1.4 Lifecycle
```
DISCOVER → [DISCOVERY_READY] → SPECIFY → [SPEC_READY] → DESIGN → [ARCHITECTURE_READY]
→ TEST_DESIGN → IMPLEMENT → [IMPLEMENTATION_READY] → VERIFY → [RELEASE_READY]
→ HUMAN APPROVAL → DEPLOY → OBSERVE → CUTOVER → DECOMMISSION
```
Brackets are evidence gates. Everything from HUMAN APPROVAL onward requires a named human. Greenfield skips legacy parity checks; brownfield must prove functional (and, for the regulated profile, data) parity.

## 1.5 Doer / checker agents
| Stage | Doer | Checker |
|---|---|---|
| Discover | discovery-analyst | discovery-checker |
| Specify | spec-writer | spec-checker |
| Design | solution-architect | architecture-checker |
| Test design | test-designer | spec-checker (coverage mode) |
| Implement | implementer | code-checker (+ independent-reviewer, regulated) |
| Verify | — | parity-verifier |
| Release | release-assessor (prepares only) | humans approve |

Checkers run in a separate subagent context and receive only artifact paths, never the doer's reasoning.

## 1.6 Gate profiles
| Profile | For | Adds |
|---|---|---|
| `lite` | Internal tools, low risk | Discovery, spec, code review, tests, security scan, release approval |
| `standard` | Most business applications (default) | Architecture review, threat model, functional parity, performance, deployment readiness, cutover/decommission approvals |
| `regulated` | Financial, SOX, customer data | Independent second reviewer, data parity |

## 1.7 Defense in depth (why rules are actually enforced)
1. **Prompt:** agents are told the rules (weakest).
2. **Hook:** `guard.js` blocks secret reads, AI approvals, enterprise-rule edits, out-of-scope writes, code before spec, and git commit/push, in real time.
3. **Pre-commit:** standards checksum, gates, gitleaks.
4. **CI:** the same validators from a pinned core version, plus approver verification against git authors.
5. **Managed settings:** IT-deployed policy so teams cannot disable the core plugin.
6. **CODEOWNERS + branch protection:** humans review governance changes.

## 1.8 Distribution
The framework is a Claude Code **plugin marketplace** in an internal git repo. Teams add the marketplace and enable plugins in their repo's `.claude/settings.json`, so every clone gets the same setup. Enterprise IT can enforce the marketplace and the core plugin through `managed-settings.json`.
