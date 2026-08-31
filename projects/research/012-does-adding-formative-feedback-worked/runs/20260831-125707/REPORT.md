# 012-does-adding-formative-feedback-worked — run 20260831-125707

> Run completed. **Score 0.86.**

## Hypothesis

Does adding formative feedback / worked-example teaching to the adaptive distributed flow (12 passes) reach >=99.0% mean mastery (from 97.45%)?

## Research question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Result

**mean_mastery_pct: 99.08**

This meets the target of 99.

## What ran

| node | state | time |
|---|---|---|
| `config` | passed | 0.00s |
| `curriculum` | passed | 0.01s |
| `plan` | passed | 0.10s |
| `simulate` | passed | 0.07s |
| `evaluate` | passed | 0.01s |

## Outputs

| node | port | value |
|---|---|---|
| `config` | `settings` | {'order': 'interleaved', 'passes': 12, 'review_spacing': 2, 'review_mode': 'a... |
| `curriculum` | `curriculum` | {'topics': [{'id': '6NPV-1', 'title': 'Powers of 10', 'strand': 'Number & Pla... |
| `plan` | `flow` | {'order': 'interleaved', 'passes': 12, 'review_mode': 'adaptive', 'feedback':... |
| `simulate` | `result` | {'mean_mastery_pct': 99.08, 'mastered_topic_pct': 100.0, 'per_topic_mastery':... |
| `evaluate` | `metric` | mean_mastery_pct |
| `evaluate` | `value` | 99.08 |
| `evaluate` | `detail` | {'order': 'interleaved', 'passes': 12, 'review_spacing': 2, 'review_mode': 'a... |

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

Prediction HELD: mean_mastery_pct=99.08, predicted >= 99.0. Claim: Adaptive distributed flow with formative feedback over 12 passes reaches >=99.0% mean mastery Detector: differentiated_mastery from 006-does-adaptive-tightly-spaced/20260831-124859.

## Changes from parent

Derived from `006-does-adaptive-tightly-spaced` with parameter changes:

  - `config.feedback`: `—` → `True`
  - `config.passes`: `10` → `12`

## Provenance

Tools called:
- `build_curriculum` ×1
- `plan_lessons` ×1
- `simulate_cohort` ×1

---

_Generated from `trace.json` for run 20260831-125707. Every number above came from the recorded execution._
