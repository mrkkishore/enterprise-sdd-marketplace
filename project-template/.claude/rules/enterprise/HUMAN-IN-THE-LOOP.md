# Human-in-the-loop policy

AI agents may **prepare** any of the decisions below (analysis, options, recommendation, draft approval file). Only a named human may **approve** them, by committing a completed `*.APPROVED.md` file from the templates.

| Decision | Approver role | Approval template | Gate it unblocks |
|----------|---------------|-------------------|------------------|
| Business behavior change vs. legacy | Product owner + business SME | behavior-change.APPROVED.md | Spec Ready |
| Architecture decision or exception to standards | Solution / enterprise architect | framework-decision.APPROVED.md, exception-waiver.APPROVED.md | Architecture Ready |
| Security or identity change | Security architect | security-change.APPROVED.md | Architecture Ready |
| Data semantic change (meaning, precision, retention) | Data owner | data-change.APPROVED.md | Spec Ready |
| Privacy decision (PII use, masking, retention) | Privacy officer | data-change.APPROVED.md | Spec Ready |
| New third-party dependency | Tech lead + security | dependency-approval.APPROVED.md | Implementation Ready |
| POC acceptance | Solution architect | poc-approval.APPROVED.md | Architecture Ready |
| Production release | Release manager + product owner | release-readiness.APPROVED.md | Human Approval |
| Cutover | Product owner + operations | cutover.APPROVED.md | Cutover |
| Legacy decommissioning | Product owner + application owner | decommission.APPROVED.md | Decommission |

Rules
- Approval files are written by humans. The `guard.js` hook blocks AI writes to them.
- CI verifies the commit author of each approval file is listed for that role in `sdd.config.yaml > approvers`.
- An approval references the exact slice ID and evidence file hashes it approves. If evidence changes, approval is void.
