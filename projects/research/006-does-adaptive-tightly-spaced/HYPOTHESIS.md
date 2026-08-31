---
hypothesis: Does adaptive, tightly-spaced distributed practice over more spiral passes reach >=95% mean mastery (from 83.5%)?
parent: 005-does-adding-more-spiral-passes-to-the
generation: 3
status: run
best_run: 20260831-124859
best_score: 0.86
created_at: 2026-08-31T12:48:59+00:00
---

# 006-does-adaptive-tightly-spaced

## Hypothesis

Does adaptive, tightly-spaced distributed practice over more spiral passes reach >=95% mean mastery (from 83.5%)?

## Rationale

Chosen by the distributed_practice detector from 005-does-adding-more-spiral-passes-to-the/20260831-124211 on evidence {"best_mastery": 83.55, "target": 95.0}, and it survived the evidence check. Template: adaptive-distributed-practice. Adaptive review (each learner drills their weakest topic) with tight spacing (every 2 teaches) over 10 spiral passes, exploiting the consolidation/spacing effect. PREDICTION: Adaptive, tightly-spaced distributed practice over 10 spiral passes reaches >=95% mean mastery Machine-checkable as mean_mastery_pct >= 95.0. REFUTED IF: mean_mastery_pct < 95.0

## Lineage

Descends from `005-does-adding-more-spiral-passes-to-the` (generation 3).

## Prediction

```json
{"claim": "Adaptive, tightly-spaced distributed practice over 10 spiral passes reaches >=95% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 95.0, "refuted_if": "mean_mastery_pct < 95.0"}
```
