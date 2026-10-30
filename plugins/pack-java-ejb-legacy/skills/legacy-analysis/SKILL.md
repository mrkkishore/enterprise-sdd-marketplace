---
name: legacy-analysis
description: How to analyze Java 8 / EJB 3.x / JSF 2.x / PrimeFaces / EclipseLink JPA / Oracle / WebLogic applications to extract capabilities, business rules, data semantics and integrations. Load at DISCOVER for Java EE legacy systems.
---
# Java EE legacy analysis

## Where behavior hides (search in this order)
1. **Entry points:** JSF `*.xhtml` + backing beans (`@ManagedBean`, `@Named`), JAX-RS resources (`@Path`), servlets, `@Schedule`/`TimerService` EJB timers, MDBs (`@MessageDriven`), WebLogic startup classes.
2. **Business logic:** `@Stateless`/`@Stateful`/`@Singleton` EJBs, service classes, validators, JSF converters (often contain formatting/rounding rules).
3. **Transactions:** `@TransactionAttribute` (REQUIRES_NEW changes commit boundaries), container-managed rollback on runtime exceptions vs. application exceptions (`@ApplicationException(rollback=…)`).
4. **Data:** JPA entities (`@Column(precision, scale)`), `orm.xml`, named queries, native SQL, Oracle PL/SQL packages, triggers, sequences, views. Triggers and packages frequently hold business rules.
5. **Config:** `ejb-jar.xml`, `persistence.xml`, `weblogic*.xml`, JNDI names, data sources, JMS modules, mail sessions.
6. **Security:** `@RolesAllowed`, `web.xml` security constraints, custom filters.

## Must-capture semantics
- `BigDecimal` scale and `RoundingMode` at every arithmetic site; `setScale` calls; `MathContext` usage.
- `java.util.Date`/`Calendar`/`Timestamp` time zone assumptions; Oracle `DATE` vs `TIMESTAMP WITH TIME ZONE`.
- Null vs empty string (Oracle treats `''` as NULL).
- Sort order and collation in queries feeding UIs or reports.
- Exception-to-message mapping shown to users.

## Output conventions
Cite `path/File.java:line`. Mark rules found only in PL/SQL or triggers with `DB-SIDE`.
