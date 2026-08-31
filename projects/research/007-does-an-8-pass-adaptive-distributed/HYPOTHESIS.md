---
hypothesis: Does an 8-pass adaptive distributed tutoring flow reach >=95.0% mean mastery (from current 97.45% at 10 passes) while reducing total instruction steps?
parent: 006-does-adaptive-tightly-spaced
generation: 4
status: run
best_run: 20260831-125018
best_score: 0.86
created_at: 2026-08-31T12:50:18+00:00
---

# 007-does-an-8-pass-adaptive-distributed

## Hypothesis

Does an 8-pass adaptive distributed tutoring flow reach >=95.0% mean mastery (from current 97.45% at 10 passes) while reducing total instruction steps?

## Rationale

Chosen by the efficiency_reduction detector from 006-does-adaptive-tightly-spaced/20260831-124859 on evidence {"best_mastery": 97.45, "passes": 10, "steps": 415}, and it survived the evidence check. Template: streamlined-adaptive-passes. Reduce spiral passes from 10 to 8 to test if the adaptive distributed practice maintains >=95.0% mastery with fewer steps. PREDICTION: Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Machine-checkable as mean_mastery_pct >= 95.0. REFUTED IF: mean_mastery_pct < 95.0

## Lineage

Descends from `006-does-adaptive-tightly-spaced` (generation 4).

## Prediction

```json
{"claim": "Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 95.0, "refuted_if": "mean_mastery_pct < 95.0"}
```
