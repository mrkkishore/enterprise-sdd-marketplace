# Security standards (baseline for all stacks)

Packs implement these for their stack via the `stack-security-integration` slot. They may make them stricter, never weaker.

1. **Identity:** enterprise IdP only (OAuth 2.0 / OIDC). No local user stores. Service-to-service via managed identity or client credentials from a secrets manager.
2. **Authorization:** deny by default; role/claim checks at the API boundary and in the service layer.
3. **Transport:** TLS 1.2+ everywhere, including internal calls. Private endpoints for intranet-only applications.
4. **Input:** validate every external input against a schema; parameterized queries only.
5. **Output:** no stack traces, SQL or internal IDs in error responses. Correlation ID in every response.
6. **Logging:** structured logs; never log secrets, tokens, PII or full account numbers (mask to last 4).
7. **Dependencies:** pinned versions, approved sources only, SCA scan in CI; new dependencies need approval.
8. **Secrets:** see `SECRETS.md`.
9. **Data:** classify per enterprise policy; encrypt at rest and in transit; least-privilege DB accounts.
10. **Threat model:** every slice that adds an endpoint, integration or data store includes a STRIDE section in its design.
