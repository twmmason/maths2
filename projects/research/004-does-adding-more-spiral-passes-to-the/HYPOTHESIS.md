---
hypothesis: Does adding more spiral passes to the enriched flow reach >=80% mean mastery (from 80.0%)?
parent: 002-does-an-interleaved-flow-with-spaced
generation: 2
status: run
best_run: 20260831-124144-5
best_score: 0.6833
created_at: 2026-08-31T12:41:44+00:00
---

# 004-does-adding-more-spiral-passes-to-the

## Hypothesis

Does adding more spiral passes to the enriched flow reach >=80% mean mastery (from 80.0%)?

## Rationale

Chosen by the add_spiral_passes detector from 002-does-an-interleaved-flow-with-spaced/20260831-124139-2 on evidence {"best_mastery": 79.99, "target": 80.0}, and it survived the evidence check. Template: more-spiral-passes. Keep interleaving + review + scaffolding but extend to 6 spiral passes to consolidate mastery. PREDICTION: Interleaved flow with review and scaffolding over 6 spiral passes reaches >=80% mean mastery Machine-checkable as mean_mastery_pct >= 80.0. REFUTED IF: mean_mastery_pct < 80.0

## Lineage

Descends from `002-does-an-interleaved-flow-with-spaced` (generation 2).

## Prediction

```json
{"claim": "Interleaved flow with review and scaffolding over 6 spiral passes reaches >=80% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 80.0, "refuted_if": "mean_mastery_pct < 80.0"}
```
