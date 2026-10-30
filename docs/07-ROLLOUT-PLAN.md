# 7. Rollout plan

| Phase | Duration | Outcome | Exit criteria |
|---|---|---|---|
| 0. Extract | 2–3 weeks | `sdd-core` v1.0 + 2 packs from the pilot (prompt P-01) | Pilot re-runs one slice on the generic core with equal or better gate results |
| 1. Harden | 2 weeks | Security review of hooks and standards; CI workflow; managed settings tested | Security sign-off; red-team attempts to bypass guardrails documented |
| 2. Pilot ×2 | 6–8 weeks | One brownfield team on a different stack (e.g. .NET), one greenfield team | Both reach RELEASE_READY on ≥2 slices; new packs pass the contract |
| 3. Scale | Quarterly waves | Marketplace published; training; office hours; pack guilds formed | 5+ teams; metrics dashboard live |
| 4. Mandate | After 2 quarters | SDD required for AI-assisted delivery on new and modernization projects | Exception process in place |

## Training path
1. Developer (2 hours): lifecycle, commands, reviewing AI diffs, guardrails.
2. Tech lead / architect (half day): config, gate profiles, ADRs, packs.
3. Approver (1 hour): what each approval means and how to sign it.
4. Pack author (half day): slot contract, writing skills, validation.

## Risks
| Risk | Mitigation |
|---|---|
| Teams see gates as overhead | Start with `lite`; show lead-time and defect metrics from the pilot |
| Approver bottleneck | Approval requests are pre-drafted with evidence; SLA per role |
| Pack quality varies | Contract check, quarterly review, CoE pack review |
| Product changes in Claude Code | Pin core version; CoE tests new Claude Code releases before rollout |
| Hook bypass via other tools | CI and branch protection repeat every check |
