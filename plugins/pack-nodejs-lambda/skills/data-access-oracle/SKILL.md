---
name: data-access-oracle
description: Oracle access from Lambda (node-oracledb thin mode, connection reuse, RDS Proxy or private link to on-premises Oracle, transactions, transactional outbox). Load when designing or implementing data access.
---
# Oracle data access
- `node-oracledb` thin mode; pool created outside the handler, small pool (1–2) per Lambda instance.
- On-premises Oracle over Direct Connect/private link; RDS Proxy only when the DB is RDS.
- Bind variables always; no string-built SQL.
- Explicit transactions per use case; commit in the application layer, not repositories.
- Events emitted with data changes use a transactional outbox table + relay.
- Map `NUMBER(p,s)` to `Decimal`; fetch numbers as strings (`fetchAsString: [oracledb.NUMBER]`).
