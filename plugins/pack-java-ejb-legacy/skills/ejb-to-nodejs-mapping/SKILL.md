---
name: ejb-to-nodejs-mapping
description: Mapping rules from Java EE constructs (EJB, JPA, JSF, JMS, timers, JNDI) to target Node.js/TypeScript serverless constructs. Load at DESIGN and IMPLEMENT for Java EE to Node.js migrations.
---
# Java EE → Node.js / TypeScript mapping

| Legacy construct | Target pattern | Watch out for |
|---|---|---|
| `@Stateless` EJB service | Plain TypeScript service class, injected via constructor | No container transactions — make them explicit |
| CMT `REQUIRED` | Explicit DB transaction per use case (`withTransaction`) | Nested calls must share the connection |
| `REQUIRES_NEW` | Separate transaction + transactional outbox if it emits events | Partial commit semantics |
| EclipseLink JPA entity | Repository + typed row mapper (or Prisma/TypeORM per target pack) | Lazy loading → explicit queries |
| JPQL / named query | Parameterized SQL in repository | Implicit joins, fetch order |
| JSF backing bean | API endpoint + UI component (separate slice for UI) | Server-side state in session scope |
| JSF converter/validator | Schema validation (zod) + formatter | Locale-dependent formatting |
| EJB timer / `@Schedule` | Scheduled event (EventBridge Scheduler) → handler | At-least-once delivery → idempotency |
| MDB / JMS | SQS consumer | Ordering, redelivery, DLQ |
| JNDI data source / mail session | Config from env + secrets manager | No hard-coded names |
| `BigDecimal` | decimal library (decimal.js / big.js) with explicit scale and rounding | Never JS `number` for money |
| `@RolesAllowed` | Claims-based authorization middleware | Role name mapping table |
