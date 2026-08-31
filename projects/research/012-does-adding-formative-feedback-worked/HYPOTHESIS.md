---
hypothesis: Does adding formative feedback / worked-example teaching to the adaptive distributed flow (12 passes) reach >=99.0% mean mastery (from 97.45%)?
parent: 006-does-adaptive-tightly-spaced
generation: 4
status: run
best_run: 20260831-125707
best_score: 0.86
created_at: 2026-08-31T12:57:07+00:00
---

# 012-does-adding-formative-feedback-worked

## Hypothesis

Does adding formative feedback / worked-example teaching to the adaptive distributed flow (12 passes) reach >=99.0% mean mastery (from 97.45%)?

## Rationale

Chosen by the differentiated_mastery detector from 006-does-adaptive-tightly-spaced/20260831-124859 on evidence {"best_mastery": 97.45, "feedback": false, "passes": 10}, and it survived the evidence check. Template: formative-feedback-differentiated. Add formative feedback / worked-example teaching (raises the effectiveness floor for weaker learners) to the adaptive distributed flow over 12 passes to reach near-total mastery. PREDICTION: Adaptive distributed flow with formative feedback over 12 passes reaches >=99.0% mean mastery Machine-checkable as mean_mastery_pct >= 99.0. REFUTED IF: mean_mastery_pct < 99.0

## Lineage

Descends from `006-does-adaptive-tightly-spaced` (generation 4).

## Prediction

```json
{"claim": "Adaptive distributed flow with formative feedback over 12 passes reaches >=99.0% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 99.0, "refuted_if": "mean_mastery_pct < 99.0"}
```
