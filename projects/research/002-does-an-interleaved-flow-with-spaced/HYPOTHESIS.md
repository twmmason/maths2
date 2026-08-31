---
hypothesis: Does an interleaved flow with spaced review and scaffolding over 4 spiral passes reach >=60% mean mastery (from 11.7%)?
parent: 001-prereq-baseline
generation: 1
status: run
best_run: 20260831-124140-3
best_score: 0.7833
created_at: 2026-08-31T12:41:39+00:00
---

# 002-does-an-interleaved-flow-with-spaced

## Hypothesis

Does an interleaved flow with spaced review and scaffolding over 4 spiral passes reach >=60% mean mastery (from 11.7%)?

## Rationale

Chosen by the enrich_flow detector from 001-prereq-baseline/20260831-123851 on evidence {"best_mastery": 11.71, "target": 80.0}, and it survived the evidence check. Template: interleaved-review-scaffold. Interleave across strands, add spaced review every 4 teaches and scaffolding on hard topics, over 4 spiral passes. PREDICTION: Interleaved flow with spaced review and scaffolding over 4 spiral passes reaches >=60% mean mastery Machine-checkable as mean_mastery_pct >= 60.0. REFUTED IF: mean_mastery_pct < 60.0

## Lineage

Descends from `001-prereq-baseline` (generation 1).

## Prediction

```json
{"claim": "Interleaved flow with spaced review and scaffolding over 4 spiral passes reaches >=60% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 60.0, "refuted_if": "mean_mastery_pct < 60.0"}
```
