# 006-does-adaptive-tightly-spaced — run 20260831-124859

> Run completed. **Score 0.86.**

## Hypothesis

Does adaptive, tightly-spaced distributed practice over more spiral passes reach >=95% mean mastery (from 83.5%)?

## Research question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Result

**mean_mastery_pct: 97.45**

This meets the target of 95.

## What ran

| node | state | time |
|---|---|---|
| `config` | passed | 0.00s |
| `curriculum` | passed | 0.01s |
| `plan` | passed | 0.05s |
| `simulate` | passed | 0.06s |
| `evaluate` | passed | 0.00s |

## Outputs

| node | port | value |
|---|---|---|
| `config` | `settings` | {'order': 'interleaved', 'passes': 10, 'review_spacing': 2, 'review_mode': 'a... |
| `curriculum` | `curriculum` | {'topics': [{'id': '6NPV-1', 'title': 'Powers of 10', 'strand': 'Number & Pla... |
| `plan` | `flow` | {'order': 'interleaved', 'passes': 10, 'review_mode': 'adaptive', 'steps': [{... |
| `simulate` | `result` | {'mean_mastery_pct': 97.45, 'mastered_topic_pct': 97.62, 'per_topic_mastery':... |
| `evaluate` | `metric` | mean_mastery_pct |
| `evaluate` | `value` | 97.45 |
| `evaluate` | `detail` | {'order': 'interleaved', 'passes': 10, 'review_spacing': 2, 'review_mode': 'a... |

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

Prediction HELD: mean_mastery_pct=97.45, predicted >= 95.0. Claim: Adaptive, tightly-spaced distributed practice over 10 spiral passes reaches >=95% mean mastery Detector: distributed_practice from 005-does-adding-more-spiral-passes-to-the/20260831-124211.

## Changes from parent

Derived from `005-does-adding-more-spiral-passes-to-the` with parameter changes:

  - `config.passes`: `7` → `10`
  - `config.review_mode`: `—` → `adaptive`
  - `config.review_spacing`: `4` → `2`
Modified agents: `config.py`, `evaluate.py`, `plan.py`

## Provenance

Tools called:
- `build_curriculum` ×1
- `plan_lessons` ×1
- `simulate_cohort` ×1

---

_Generated from `trace.json` for run 20260831-124859. Every number above came from the recorded execution._
