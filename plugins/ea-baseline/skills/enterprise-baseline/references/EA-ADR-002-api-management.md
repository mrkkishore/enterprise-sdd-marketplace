# EA-ADR-002: API exposure through enterprise API management
- Status: Proposed
- Owner: Enterprise Architecture + Integration CoE
## Decision
Every API consumed outside its owning application is published through the enterprise API management gateway (e.g. Azure APIM) with OpenAPI contracts, subscription keys or OAuth, throttling and versioning.
## Compliance check
- [ ] OpenAPI 3.x contract in the repo
- [ ] Versioning scheme (`/v1`) and deprecation policy stated
