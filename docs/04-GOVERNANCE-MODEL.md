# 4. Governance model

## 4.1 Roles
| Role | Responsibilities |
|---|---|
| AI Engineering CoE | Owns `sdd-core`, standards, marketplace, versioning, metrics, training |
| Enterprise architecture | Approves standards changes, target-stack packs, exception waivers |
| Security | Owns SECURITY-STANDARDS and SECRETS; approves security changes; reviews hooks |
| Pack owners (guilds) | Maintain packs; respond to defects; quarterly review |
| Product team | Runs slices; owns spec quality; humans commit |
| Approvers (per role) | Sign approval files; accountable for decisions |

## 4.2 RACI for key decisions
| Decision | CoE | EA | Security | Pack owner | Team |
|---|---|---|---|---|---|
| Change to commandments / gates | A/R | C | C | I | I |
| New target pack | C | A | C | R | I |
| Change to security/secrets standards | C | C | A/R | I | I |
| Team gate profile | I | C | C | — | A/R |
| Exception waiver | I | A | C | — | R |

## 4.3 Versioning
- `sdd-core` uses semantic versioning. MAJOR = a gate or rule becomes stricter in a breaking way; MINOR = new agents, skills, checks behind profiles; PATCH = fixes.
- Projects pin `framework.core_version` in `sdd.config.yaml`; CI fetches validators at that tag.
- Supported versions: current MAJOR and previous MAJOR for 6 months.

## 4.4 Change process for the core
1. Change request issue with rationale and evidence from at least one project.
2. CoE drafts change in a branch; security reviews any hook/standard change.
3. Pilot on one project; record results.
4. Release notes + migration notes; tag `sdd-core-vX.Y.Z`.

## 4.5 Metrics (collected from evidence and status files)
| Metric | Why |
|---|---|
| Slice lead time (DISCOVER → RELEASE_READY) | Flow |
| Checker loop count per stage | Spec/design quality |
| Gate first-pass rate | Doer quality |
| Escaped defects per slice after release | Real quality |
| Parity diffs: defect vs. approved vs. unexplained | Modernization safety |
| Human approval wait time | Bottlenecks |
| Guardrail blocks by rule | Training needs, rule tuning |
