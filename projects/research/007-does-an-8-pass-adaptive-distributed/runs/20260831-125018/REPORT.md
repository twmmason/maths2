# 007-does-an-8-pass-adaptive-distributed — run 20260831-125018

> Run completed. **Score 0.86.**

## Hypothesis

Does an 8-pass adaptive distributed tutoring flow reach >=95.0% mean mastery (from current 97.45% at 10 passes) while reducing total instruction steps?

## Research question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Result

**mean_mastery_pct: 95.45**

This meets the target of 95.

## What ran

| node | state | time |
|---|---|---|
| `config` | passed | 0.01s |
| `curriculum` | passed | 0.01s |
| `plan` | passed | 0.04s |
| `simulate` | passed | 0.05s |
| `evaluate` | passed | 0.01s |

## Outputs

| node | port | value |
|---|---|---|
| `config` | `settings` | {'order': 'interleaved', 'passes': 8, 'review_spacing': 2, 'review_mode': 'ad... |
| `curriculum` | `curriculum` | {'topics': [{'id': '6NPV-1', 'title': 'Powers of 10', 'strand': 'Number & Pla... |
| `plan` | `flow` | {'order': 'interleaved', 'passes': 8, 'review_mode': 'adaptive', 'steps': [{'... |
| `simulate` | `result` | {'mean_mastery_pct': 95.45, 'mastered_topic_pct': 96.79, 'per_topic_mastery':... |
| `evaluate` | `metric` | mean_mastery_pct |
| `evaluate` | `value` | 95.45 |
| `evaluate` | `detail` | {'order': 'interleaved', 'passes': 8, 'review_spacing': 2, 'review_mode': 'ad... |

## Gates

- ✓ **execution_completed** — All nodes ran to completion.
- ✓ **all_nodes_ran** — 5 node(s) produced output.
- ✓ **result_measured** — evaluate reported a measurement.
- ✓ **metric_is_finite** — evaluate reported finite value(s).
- ✓ **produced_output** — 7 output value(s) recorded.
- ✓ **tool_use_verified** — Declared tool use matches the record.

## Audit

- implementation quality: **0.95**
- method fidelity: **0.85**
- scientific value: **0.78**

**Overall: 0.86**

Prediction HELD: mean_mastery_pct=95.45, predicted >= 95.0. Claim: Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Detector: efficiency_reduction from 006-does-adaptive-tightly-spaced/20260831-124859.

## Changes from parent

Derived from `006-does-adaptive-tightly-spaced` with parameter changes:

  - `config.passes`: `10` → `8`

## Provenance

Tools called:
- `build_curriculum` ×1
- `plan_lessons` ×1
- `simulate_cohort` ×1

---

_Generated from `trace.json` for run 20260831-125018. Every number above came from the recorded execution._
