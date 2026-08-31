# 001-prereq-baseline — run 20260831-123940

> Run completed. **Score 0.68.**

## Hypothesis

Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery

## Research question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Result

**mean_mastery_pct: 11.71**

This does not meet the target of 80.

## What ran

| node | state | time |
|---|---|---|
| `config` | passed | 0.00s |
| `curriculum` | passed | 0.01s |
| `plan` | passed | 0.01s |
| `simulate` | passed | 0.01s |
| `evaluate` | passed | 0.01s |

## Outputs

| node | port | value |
|---|---|---|
| `config` | `settings` | {'order': 'prereq', 'passes': 1, 'review_spacing': 0, 'scaffolding': False, '... |
| `curriculum` | `curriculum` | {'topics': [{'id': '6NPV-1', 'title': 'Powers of 10', 'strand': 'Number & Pla... |
| `plan` | `flow` | {'order': 'prereq', 'passes': 1, 'steps': [{'topic': '6NPV-1', 'kind': 'teach... |
| `simulate` | `result` | {'mean_mastery_pct': 11.71, 'mastered_topic_pct': 0.0, 'per_topic_mastery': {... |
| `evaluate` | `metric` | mean_mastery_pct |
| `evaluate` | `value` | 11.71 |
| `evaluate` | `detail` | {'order': 'prereq', 'passes': 1, 'review_spacing': 0, 'scaffolding': False, '... |

## Gates

- ✓ **execution_completed** — All nodes ran to completion.
- ✓ **all_nodes_ran** — 5 node(s) produced output.
- ✓ **result_measured** — evaluate reported a measurement.
- ✓ **metric_is_finite** — evaluate reported finite value(s).
- ✓ **produced_output** — 7 output value(s) recorded.
- ✓ **tool_use_verified** — Declared tool use matches the record.

## Audit

- implementation quality: **0.95**
- method fidelity: **0.60**
- scientific value: **0.50**

**Overall: 0.68**

Prediction FAILED: mean_mastery_pct=11.71, predicted >= 80.0. Claim: Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery Refutation condition: mean_mastery_pct < 80.0 Run started by hand: 001-prereq-baseline/20260831-123940.

## Provenance

Tools called:
- `build_curriculum` ×1
- `plan_lessons` ×1
- `simulate_cohort` ×1

---

_Generated from `trace.json` for run 20260831-123940. Every number above came from the recorded execution._
