# 005-does-adding-more-spiral-passes-to-the — run 20260831-124211

> Run completed. **Score 0.86.**

## Hypothesis

Does adding more spiral passes to the enriched flow reach >=80% mean mastery (from 80.0%)?

## Research question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Result

**mean_mastery_pct: 83.55**

This meets the target of 80.

## What ran

| node | state | time |
|---|---|---|
| `config` | passed | 0.00s |
| `curriculum` | passed | 0.01s |
| `plan` | passed | 0.03s |
| `simulate` | passed | 0.03s |
| `evaluate` | passed | 0.01s |

## Outputs

| node | port | value |
|---|---|---|
| `config` | `settings` | {'order': 'interleaved', 'passes': 7, 'review_spacing': 4, 'scaffolding': Tru... |
| `curriculum` | `curriculum` | {'topics': [{'id': '6NPV-1', 'title': 'Powers of 10', 'strand': 'Number & Pla... |
| `plan` | `flow` | {'order': 'interleaved', 'passes': 7, 'steps': [{'topic': '6NPV-1', 'kind': '... |
| `simulate` | `result` | {'mean_mastery_pct': 83.55, 'mastered_topic_pct': 75.95, 'per_topic_mastery':... |
| `evaluate` | `metric` | mean_mastery_pct |
| `evaluate` | `value` | 83.55 |
| `evaluate` | `detail` | {'order': 'interleaved', 'passes': 7, 'review_spacing': 4, 'scaffolding': Tru... |

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
- scientific value: **0.79**

**Overall: 0.86**

Prediction HELD: mean_mastery_pct=83.55, predicted >= 80.0. Claim: Interleaved flow with review and scaffolding over 7 spiral passes reaches >=80% mean mastery Detector: add_spiral_passes from 002-does-an-interleaved-flow-with-spaced/20260831-124139-2.

## Changes from parent

Derived from `002-does-an-interleaved-flow-with-spaced` with parameter changes:

  - `config.passes`: `6` → `7`

## Provenance

Tools called:
- `build_curriculum` ×1
- `plan_lessons` ×1
- `simulate_cohort` ×1

---

_Generated from `trace.json` for run 20260831-124211. Every number above came from the recorded execution._
