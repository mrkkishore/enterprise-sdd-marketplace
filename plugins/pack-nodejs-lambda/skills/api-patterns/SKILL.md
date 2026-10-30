---
name: api-patterns
description: REST API patterns on API Gateway + Lambda (private REST API with VPC endpoint for intranet, OpenAPI-first contracts, validation, idempotency, correlation IDs). Load when designing or implementing APIs.
---
# API patterns
- OpenAPI 3.1 contract first; generated types; request validation with zod at the handler.
- Intranet-only apps: **private** REST API + VPC endpoint; no public stage.
- Correlation ID: accept `x-correlation-id`, else generate; propagate to logs and downstream calls.
- Idempotency key header for POST/PUT that change state; store results for 24h.
- Errors: RFC 7807 problem+json; never leak stack traces or SQL.
- Pagination: cursor-based; max page size enforced.
