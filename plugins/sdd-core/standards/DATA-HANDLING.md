# Data handling for AI-assisted work

- Agents work on code, schemas and synthetic or masked data only. Production data is never copied into the repo or the context window.
- Parity testing uses masked production-shaped datasets produced by an approved masking job, stored outside the repo.
- Data semantics (precision, scale, rounding mode, time zone, null meaning, code values) are captured in the spec's data dictionary and are approval-controlled.
- Sample payloads in specs must be synthetic and labeled `synthetic: true`.
