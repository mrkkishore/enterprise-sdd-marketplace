---
name: financial-semantic-parity
description: How to prove numeric, date, rounding, null and ordering parity between Java legacy and a new implementation, including golden dataset design and diff classification. Load at TEST_DESIGN and VERIFY for financial or regulated systems.
---
# Financial semantic parity

## Golden datasets
- Build from masked production-shaped data; include boundary values: 0, negative, max precision, scale+1 digits, half-up/half-even ties (x.xx5), leap days, DST changes, month ends, null/empty.
- Store inputs + legacy outputs as versioned golden files; record the legacy build version that produced them.

## Comparison rules
- Compare decimals as strings at the declared scale, never as floats.
- Compare timestamps in UTC; flag any zone drift.
- Compare collections with the legacy order unless the spec states order is irrelevant.
- Compare error outcomes: code, message key, HTTP status.

## Diff classification
DEFECT (fix) · APPROVED CHANGE (cite approval file) · UNEXPLAINED (= FAIL)

## Known Java→JS traps
`BigDecimal.ROUND_HALF_UP` vs `Math.round` (rounds .5 toward +∞) · `BigDecimal.equals` is scale-sensitive (`compareTo` is not) · integer division truncation · `SimpleDateFormat` default zone · Oracle NUMBER without scale.
