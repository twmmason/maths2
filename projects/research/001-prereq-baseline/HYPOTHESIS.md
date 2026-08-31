---
hypothesis: Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery
generation: 0
status: run
best_run: 20260831-123940
best_score: 0.75
created_at: 2026-08-31T12:37:42+00:00
---

# 001-prereq-baseline

## Hypothesis

Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery

## Rationale

A prerequisite-respecting sequence is the textbook default; test whether it alone suffices.

## Prediction

```json
{"claim": "Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery", "metric": "mean_mastery_pct", "op": ">=", "value": 80.0, "refuted_if": "mean_mastery_pct < 80.0"}
```
