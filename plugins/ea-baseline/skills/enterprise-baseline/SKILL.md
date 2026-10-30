---
name: enterprise-baseline
description: Enterprise Architecture baseline decisions (EA-ADRs) every project inherits — identity, API management, network exposure, secrets, observability, integration, data classification and hosting platform — plus the approved pack catalog. Load at DESIGN and when reviewing any architecture decision.
---
# Enterprise architecture baseline

Projects **cite** these decisions (e.g. "complies with EA-ADR-001") and do not re-decide them. A project that needs to deviate raises an `exception-waiver` approved by Enterprise Architecture.

| ID | Decision | Status |
|----|----------|--------|
| EA-ADR-001 | Identity: enterprise IdP (Microsoft Entra ID), OAuth 2.0 / OIDC | see file |
| EA-ADR-002 | API exposure through the enterprise API management gateway | see file |
| EA-ADR-003 | Network exposure: intranet-only by default; private endpoints | see file |
| EA-ADR-004 | Secrets in a managed secrets store with rotation | see file |
| EA-ADR-005 | Observability: structured logs, correlation IDs, traces, alarms | see file |
| EA-ADR-006 | Integration: synchronous APIs + queues; event streaming by exception | see file |
| EA-ADR-007 | Data classification determines minimum SDD gate profile | see file |
| EA-ADR-008 | Application hosting platform | see file (pending decision) |

Read the relevant file in `references/` before designing. Only decisions with status **Accepted** are binding; a **Proposed** decision means "ask EA" — log an open question, do not assume.

Approved packs: `references/PACK-CATALOG.md`.
