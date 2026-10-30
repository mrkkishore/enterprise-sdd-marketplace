---
name: security-entra-id
description: Securing Lambda APIs with Microsoft Entra ID (OAuth 2.0/OIDC JWT validation, app roles, managed secrets with AWS Secrets Manager rotation). Load when designing or implementing authentication, authorization or secrets.
---
# Security with Entra ID
- Validate JWT (issuer, audience, signature via JWKS cache, expiry) in a Lambda authorizer or middleware.
- Authorization by Entra **app roles** claim; map legacy roles in a reviewed table.
- Secrets in AWS Secrets Manager with automatic rotation; read once per cold start and cache with TTL.
- Least-privilege IAM per function; no wildcard actions.
