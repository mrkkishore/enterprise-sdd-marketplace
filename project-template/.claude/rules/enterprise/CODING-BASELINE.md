# Coding baseline (stack-agnostic)

Packs refine these in the `stack-coding-standards` slot.

- Small, single-purpose units; no function over ~50 lines without reason.
- Explicit types at module boundaries.
- Errors: domain errors vs. technical errors vs. unexpected errors, handled at clear layers; never swallowed.
- Every external call has a timeout, a retry policy (idempotent calls only) and a circuit breaker where the pack defines one.
- Idempotency keys for any operation that can be retried and changes state.
- Money and quantities use exact decimal types with explicit scale and rounding mode.
- Dates and times stored in UTC with explicit zone conversion at the edges.
- Configuration from environment/secret store, never constants.
- Tests: unit + contract + integration; test names reference requirement IDs.
