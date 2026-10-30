# 6. What we generalized from the first modernization pilot

| Pilot asset | Generic form in the framework |
|---|---|
| 7 stack-named agents (`*-nodejs`) | 12 stack-agnostic agents that load skills by **slot** |
| ~20 stack skills in one folder | Packs: source pack + target pack + optional domain pack |
| COMMANDMENTS / ANTI-PATTERNS / ENFORCEMENT-MATRIX | Same three files, generalized, checksum-protected in every repo |
| HUMAN-IN-THE-LOOP.md | Policy table with roles, templates and the gate each approval unblocks |
| 5 approval templates | 10 templates covering every decision AI may not approve |
| `evidence/POC-06-PASS/FAIL` | Standard evidence front matter with artifact hash; FAIL history kept |
| `validate-scope.ts`, `validate-implementation-gates.ts` | `guard.js` (real time) + `validate-gates.js` (pre-commit and CI), zero dependencies |
| `generated/01…08` phase folders | Program analysis in `analysis/` + per-slice folders in `specs/slices/` |
| Session and phase reports at repo root | `.sdd/sessions/` (AP-10) |
| ADR `v2.0/` subfolder | Single ADR folder with `Supersedes / Superseded by` (AP-11) |
| OPEN-QUESTIONS, REMOVED-ASSUMPTIONS registers | Standard registers in `docs/registers/` |
| Independent code checker | Required in the `regulated` profile |
| BigDecimal parity POC | `semantic-parity` slot + parity-verifier + data-parity gate |
| `execute-slice` orchestrator | `sdd-execute-slice` skill with loop limits and escalation |

## Lessons that shaped the design
1. **Evidence beats narrative.** Completion reports were useful to humans but not machine-checkable; gates now read front matter.
2. **Checkers need a fresh context.** Reviews were stronger when the checker saw only the artifact.
3. **Prompts are not enforcement.** Rules that mattered got a hook or a validator.
4. **Parity is where modernizations fail.** Decimal scale, rounding and time zones need first-class treatment.
5. **Small slices.** Reviews collapse when a slice covers more than one capability.
6. **Keep generated output organized from day one.** Folder sprawl made it hard to see current state.
