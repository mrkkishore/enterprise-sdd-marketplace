# EA-ADR-003: Intranet-only by default
- Status: Proposed
## Decision
Business applications are intranet-only unless an approved exception exists. Use private endpoints / private APIs; no public ingress. Internet exposure requires Security approval and a WAF.
## Compliance check
- [ ] No public endpoint or public stage in IaC
