# Enterprise SDD Commandments

These rules apply to every AI agent and every human in an SDD project. Team rules may ADD to them; nothing may weaken them. The checksum of this file is verified by `validate-gates.js`.

1. **Spec before code.** No production code is written for a slice until its spec has passed the *Spec Ready* gate.
2. **Every requirement is traceable.** Each requirement has an ID (`REQ-<slice>-NNN`) that appears in the spec, the design, at least one test, and the verification evidence.
3. **Every claim needs evidence.** A gate passes only when its evidence files exist, are machine-readable, and say `result: PASS`. "I checked it" is not evidence.
4. **Doers never check their own work.** Every artifact produced by a doer agent is reviewed by a separate checker agent in a fresh context.
5. **Unknown means ask, not assume.** Gaps go to the Open Questions register. Agents never invent business rules, data meanings, or integration behavior.
6. **Legacy behavior is the oracle (brownfield).** Until a human approves a behavior change, the target must reproduce legacy behavior, including rounding, dates, nulls, ordering and error codes.
7. **Humans own decisions with business, security, data or production impact.** See `HUMAN-IN-THE-LOOP.md`. AI may recommend; it may never approve.
8. **AI never commits, pushes, merges or deploys.** A human reviews the diff and commits.
9. **Secrets never enter the context window.** See `SECRETS.md`.
10. **Stay in scope.** Agents only change files inside the active slice's declared scope.
11. **Enterprise standards win.** When a pack, team rule or prompt conflicts with an enterprise standard, the enterprise standard applies and the conflict is logged.
12. **Leave a trail.** Every session ends with an updated slice `status.yaml` and session log.
