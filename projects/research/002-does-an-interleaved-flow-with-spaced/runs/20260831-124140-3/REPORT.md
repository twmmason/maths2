# 002-does-an-interleaved-flow-with-spaced — run 20260831-124140-3

> Run completed. **Score 0.78.**

## Hypothesis

Does an interleaved flow with spaced review and scaffolding over 4 spiral passes reach >=60% mean mastery (from 11.7%)?

## Research question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Result

**mean_mastery_pct: 79.99**

This does not meet the target of 80.

## What ran

| node | state | time |
|---|---|---|
| `config` | passed | 0.00s |
| `curriculum` | passed | 0.01s |
| `plan` | passed | 0.03s |
| `simulate` | passed | 0.03s |
| `evaluate` | passed | 0.00s |

## Outputs

| node | port | value |
|---|---|---|
| `config` | `settings` | {'order': 'interleaved', 'passes': 6, 'review_spacing': 4, 'scaffolding': Tru... |
| `curriculum` | `curriculum` | {'topics': [{'id': '6NPV-1', 'title': 'Powers of 10', 'strand': 'Number & Pla... |
| `plan` | `flow` | {'order': 'interleaved', 'passes': 6, 'steps': [{'topic': '6NPV-1', 'kind': '... |
| `simulate` | `result` | {'mean_mastery_pct': 79.99, 'mastered_topic_pct': 65.71, 'per_topic_mastery':... |
| `evaluate` | `metric` | mean_mastery_pct |
| `evaluate` | `value` | 79.99 |
| `evaluate` | `detail` | {'order': 'interleaved', 'passes': 6, 'review_spacing': 4, 'scaffolding': Tru... |

## Gates

- ✓ **execution_completed** — All nodes ran to completion.
- ✓ **all_nodes_ran** — 5 node(s) produced output.
- ✓ **result_measured** — evaluate reported a measurement.
- ✓ **metric_is_finite** — evaluate reported finite value(s).
- ✓ **produced_output** — 7 output value(s) recorded.
- ✓ **tool_use_verified** — Declared tool use matches the record.

## Audit

- implementation quality: **0.95**
- method fidelity: **0.75**
- scientific value: **0.65**

**Overall: 0.78**

Prediction HELD: mean_mastery_pct=79.99, predicted >= 60.0. Claim: Interleaved flow with spaced review and scaffolding over 4 spiral passes reaches >=60% mean mastery Detector: enrich_flow from 001-prereq-baseline/20260831-123851.

## Changes from parent

Derived from `001-prereq-baseline` with parameter changes:

  - `config.order`: `prereq` → `interleaved`
  - `config.passes`: `1` → `6`
  - `config.review_spacing`: `0` → `4`
  - `config.scaffolding`: `False` → `True`

## Provenance

Tools called:
- `build_curriculum` ×1
- `plan_lessons` ×1
- `simulate_cohort` ×1

---

_Generated from `trace.json` for run 20260831-124140-3. Every number above came from the recorded execution._
