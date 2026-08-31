---
question: What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?
target_metric: mean_mastery_pct
target_value: 99.0
target_direction: maximize
---

# Research Goal

## Question

What tutoring flow best teaches the UK Year 6 to KS3 maths curriculum to a simulated learner cohort, maximizing mean mastery?

## Background

The two curriculum PDFs in `/docs/` (Year 6 non-statutory guidance and the KS3
programme of study) define ~21 topics across 9 strands, distilled in
`/docs/PLAN.md`. Each topic has a strand, an intrinsic difficulty, and a set of
prerequisite topics (e.g. *common denomination* depends on *simplify
fractions*). Teaching order matters: presenting a topic before its
prerequisites are mastered wastes instruction, while good sequencing,
scaffolding, spaced review and interleaving compound into durable mastery.

This project encodes the curriculum as a prerequisite graph, generates a lesson
plan from a chosen **tutoring strategy**, then runs the plan through a seeded
learner-cohort simulator based on Bayesian Knowledge Tracing (BKT). Learning a
topic is faster when its prerequisites are already mastered; unreviewed topics
decay over time; spaced review and interleaving counteract that decay. The
evaluation reports the cohort's mean mastery after the full plan.

The strategy space includes:

- **order**: `prereq` (topological), `strand` (block by strand),
  `difficulty` (easiest first), `interleaved` (round-robin across strands).
- **passes**: how many times to spiral through the whole curriculum.
- **review_spacing**: how many lessons apart spaced-review touches are inserted.
- **review_mode**: `cyclic` (rotate through taught topics) or `adaptive` (each
  learner reviews their own weakest topic — mastery learning).
- **scaffolding**: extra guided practice on high-difficulty topics.
- **feedback**: formative feedback / worked-example teaching that raises the
  effectiveness floor for weaker learners (differentiated support).

The learner model captures the **consolidation / spacing effect**: each
successful retrieval raises a topic's memory stability, so well-reviewed topics
decay more slowly. This is what lets distributed, adaptive practice push durable
mastery past the plateau that uniform forgetting would otherwise impose.

## Success

`mean_mastery_pct >= 99` — the average learner masters at least 99% of the
curriculum by the end of the tutoring flow.

## Constraints

- All computation is local, stdlib-only, and deterministic (seeded).
- The learner model is a simplified BKT abstraction, not a real student.
- The curriculum graph is derived from `/docs/PLAN.md`, not re-parsed from the
