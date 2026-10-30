# Decision rights and service levels

| Decision | Decided by | Approval template | Target response |
|----------|-----------|-------------------|-----------------|
| Project onboarding (mode, profile, packs) | EA + tech lead at kickoff | project-intake.md | 5 business days |
| Slice plan and waves (brownfield) | EA reviews, product owner owns | — (review comment) | 5 business days |
| New project-level ADR that touches an EA-ADR area | Solution architect; EA consulted | framework-decision.APPROVED.md | 5 business days |
| Exception to an Accepted EA-ADR or enterprise standard | Enterprise Architecture (+ Security if security-related) | exception-waiver.APPROVED.md | 10 business days |
| New target stack / new pack | EA + pack owner | pack-request.md | 15 business days |
| Change to sdd-core or enterprise standards | AI Engineering CoE (A), EA and Security (C) | core-change-request.md | Next minor release |
| Business behavior change | Product owner + business SME | behavior-change.APPROVED.md | Team-set |
| Security / identity change | Security architect | security-change.APPROVED.md | 5 business days |
| Production release, cutover, decommission | Product owner + release manager / ops | release-readiness / cutover / decommission | Team-set |

EA does **not** review routine slices, specs or code. EA governs through the core, the baseline ADRs and the packs.
