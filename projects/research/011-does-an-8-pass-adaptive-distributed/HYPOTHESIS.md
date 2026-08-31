---
hypothesis: Does an 8-pass adaptive distributed tutoring flow reach >=95.0% mean mastery (from current 98.29% at 10 passes) while reducing total instruction steps?
parent: 010-does-adding-formative-feedback-worked
generation: 5
status: run
best_run: 20260831-125553-4
best_score: 0.7333
created_at: 2026-08-31T12:55:52+00:00
---

# 011-does-an-8-pass-adaptive-distributed

## Hypothesis

Does an 8-pass adaptive distributed tutoring flow reach >=95.0% mean mastery (from current 98.29% at 10 passes) while reducing total instruction steps?

## Rationale

Chosen by the efficiency_reduction detector from 010-does-adding-formative-feedback-worked/20260831-125550 on evidence {"best_mastery": 98.29, "passes": 12, "steps": 498}, and it survived the evidence check. Template: streamlined-adaptive-passes. Reduce spiral passes from 10 to 8 to test if the adaptive distributed practice maintains >=95.0% mastery with fewer steps. PREDICTION: Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Machine-checkable as mean_mastery_pct >= 95.0. REFUTED IF: mean_mastery_pct < 95.0

## Lineage

Descends from `010-does-adding-formative-feedback-worked` (generation 5).

## Prediction

```json
{"claim": "Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 95.0, "refuted_if": "mean_mastery_pct < 95.0"}
```
