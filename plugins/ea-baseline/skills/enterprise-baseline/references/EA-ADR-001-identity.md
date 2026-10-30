# EA-ADR-001: Identity and access with the enterprise IdP
- Status: Proposed  <!-- EA ratifies to Accepted before rollout -->
- Owner: Enterprise Architecture + Security
## Decision
All user and service authentication uses Microsoft Entra ID with OAuth 2.0 / OpenID Connect. Authorization uses app roles or group claims. No application-local user stores.
## Consequences
Legacy role models are mapped to Entra app roles in a reviewed mapping table per application. Service-to-service calls use client credentials or managed identity with secrets from EA-ADR-004.
## Compliance check (architecture-checker)
- [ ] Token validation (issuer, audience, signature, expiry) at the API boundary
- [ ] Roles mapped and documented
