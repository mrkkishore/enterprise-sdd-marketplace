---
name: coding-standards
description: Node.js/TypeScript coding standards for Lambda services (strict TS, module layout, error layers, decimals, config). Load when writing or reviewing TypeScript service code.
---
# Node.js / TypeScript coding standards
- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`; no `any` without a justification comment.
- Layout per service: `handlers/` (thin, adapt event → use case) · `application/` (use cases) · `domain/` (pure logic, no I/O) · `infrastructure/` (DB, HTTP, AWS clients).
- Three-layer errors: `DomainError` (4xx, expected) · `IntegrationError` (retryable/non-retryable) · unexpected (500, alarm). Map once in the handler.
- Money: `decimal.js` with explicit precision and `ROUND_HALF_UP` unless the spec says otherwise.
- Config via typed `config.ts` reading env; secrets via the secrets client only.
- ESLint + Prettier enforced in CI; no disabled rules without a ticket reference.
