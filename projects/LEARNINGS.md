# Learnings

Empirical insights from this project. Append-only: each entry cites the run that produced it.

## 2026-08-27T19:24:13+00:00

[001-greedy-composite-index-selection-reduces] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-greedy-composite-index-selection-reduces` run `20260827-192412`

## 2026-08-27T19:24:42+00:00

[002-can-lowering-write-penalty-increase-cost] 10 indices + low write penalty achieves >=60% cost reduction Prediction held: cost_reduction_pct=77.93, predicted >= 60.0. Controls OK.

**Source:** `002-can-lowering-write-penalty-increase-cost` run `20260827-192441`

## 2026-08-27T20:43:26+00:00

[001-greedy-composite-index-selection-reduces] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-greedy-composite-index-selection-reduces` run `20260827-204325`

## 2026-08-27T20:43:34+00:00

[001-greedy-composite-index-selection-reduces] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-greedy-composite-index-selection-reduces` run `20260827-204334`

## 2026-08-27T20:48:54+00:00

[001-greedy-composite-index-selection-reduces] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-greedy-composite-index-selection-reduces` run `20260827-204854`

## 2026-08-27T20:50:05+00:00

[001-greedy-composite-index-selection-reduces] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-greedy-composite-index-selection-reduces` run `20260827-205004`

## 2026-08-27T20:51:52+00:00

[001-greedy-composite-index-selection-reduces] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-greedy-composite-index-selection-reduces` run `20260827-205151`

## 2026-08-31T12:38:51+00:00

[001-prereq-baseline] Ran to completion with no machine-checkable prediction registered, so nothing was tested. Controls OK.

**Source:** `001-prereq-baseline` run `20260831-123851`

## 2026-08-31T12:39:40+00:00

[001-prereq-baseline] Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery Prediction refuted: mean_mastery_pct=11.71, predicted >= 80.0. Controls OK.

**Source:** `001-prereq-baseline` run `20260831-123940`

## 2026-08-31T12:39:52+00:00

A prerequisite-ordered single pass reaches only ~12% mean mastery: correct ordering alone is far from sufficient; retention mechanisms (spiral passes, spaced review) are required.

**Evidence:** mean_mastery_pct=11.71 vs target 80

**Source:** `001-prereq-baseline`

## 2026-08-31T12:41:40+00:00

[002-does-an-interleaved-flow-with-spaced] Interleaved flow with spaced review and scaffolding over 4 spiral passes reaches >=60% mean mastery Prediction held: mean_mastery_pct=79.99, predicted >= 60.0. Controls OK.

**Source:** `002-does-an-interleaved-flow-with-spaced` run `20260831-124140-3`

## 2026-08-31T12:41:42+00:00

[003-does-adding-more-spiral-passes-to-the] Interleaved flow with review and scaffolding over 6 spiral passes reaches >=80% mean mastery Prediction refuted: mean_mastery_pct=79.99, predicted >= 80.0. Controls OK.

**Source:** `003-does-adding-more-spiral-passes-to-the` run `20260831-124142-5`

## 2026-08-31T12:41:44+00:00

[004-does-adding-more-spiral-passes-to-the] Interleaved flow with review and scaffolding over 6 spiral passes reaches >=80% mean mastery Prediction refuted: mean_mastery_pct=79.99, predicted >= 80.0. Controls OK.

**Source:** `004-does-adding-more-spiral-passes-to-the` run `20260831-124144-5`

## 2026-08-31T12:42:11+00:00

[005-does-adding-more-spiral-passes-to-the] Interleaved flow with review and scaffolding over 7 spiral passes reaches >=80% mean mastery Prediction held: mean_mastery_pct=83.55, predicted >= 80.0. Controls OK.

**Source:** `005-does-adding-more-spiral-passes-to-the` run `20260831-124211`

## 2026-08-31T12:42:37+00:00

Optimal tutoring flow for the Year 6->KS3 maths curriculum: interleave topics across strands (respecting prerequisites), insert spaced review every 4 teaches, scaffold hard topics, and spiral through the whole curriculum ~7 times. This reaches 83.6% mean mastery vs 11.7% for a naive single prerequisite-ordered pass.

**Evidence:** mean_mastery_pct=83.55 (target 80), prediction HELD

**Source:** `005-does-adding-more-spiral-passes-to-the`

## 2026-08-31T12:48:13+00:00

[001-prereq-baseline] Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery Prediction refuted: mean_mastery_pct=11.98, predicted >= 80.0. Controls OK.

**Source:** `001-prereq-baseline` run `20260831-124813`

## 2026-08-31T12:48:59+00:00

[006-does-adaptive-tightly-spaced] Adaptive, tightly-spaced distributed practice over 10 spiral passes reaches >=95% mean mastery Prediction held: mean_mastery_pct=97.45, predicted >= 95.0. Controls OK.

**Source:** `006-does-adaptive-tightly-spaced` run `20260831-124859`

## 2026-08-31T12:50:19+00:00

[007-does-an-8-pass-adaptive-distributed] Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Prediction held: mean_mastery_pct=95.45, predicted >= 95.0. Controls OK.

**Source:** `007-does-an-8-pass-adaptive-distributed` run `20260831-125018`

## 2026-08-31T12:50:21+00:00

[008-does-an-8-pass-adaptive-distributed] Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Prediction held: mean_mastery_pct=95.45, predicted >= 95.0. Controls OK.

**Source:** `008-does-an-8-pass-adaptive-distributed` run `20260831-125021`

## 2026-08-31T12:50:23+00:00

[009-does-an-8-pass-adaptive-distributed] Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Prediction held: mean_mastery_pct=95.45, predicted >= 95.0. Controls OK.

**Source:** `009-does-an-8-pass-adaptive-distributed` run `20260831-125023`

## 2026-08-31T12:51:02+00:00

Reaching >95% mean mastery requires modelling the consolidation/spacing effect (each retrieval raises memory stability, slowing decay) PLUS a flow that exploits it: interleaved order, adaptive review (each learner drills their own weakest topic), tight spacing (every 2 teaches), scaffolding, over ~10 spiral passes -> 97.45%. Cyclic review and mass practice plateau near 91% regardless of passes.

**Evidence:** mean_mastery_pct=97.45 (target 95), prediction HELD

**Source:** `006-does-adaptive-tightly-spaced`

## 2026-08-31T12:55:38+00:00

[001-prereq-baseline] Prerequisite-ordered single-pass tutoring reaches >=80% mean mastery Prediction refuted: mean_mastery_pct=11.98, predicted >= 80.0. Controls OK.

**Source:** `001-prereq-baseline` run `20260831-125538`

## 2026-08-31T12:55:50+00:00

[010-does-adding-formative-feedback-worked] Adaptive distributed flow with formative feedback over 12 passes reaches >=99.0% mean mastery Prediction refuted: mean_mastery_pct=95.45, predicted >= 99.0. Controls OK.

**Source:** `010-does-adding-formative-feedback-worked` run `20260831-125550-5`

## 2026-08-31T12:55:53+00:00

[011-does-an-8-pass-adaptive-distributed] Streamlined 8-pass adaptive flow reaches >=95.0% mean mastery Prediction held: mean_mastery_pct=95.45, predicted >= 95.0. Controls OK.

**Source:** `011-does-an-8-pass-adaptive-distributed` run `20260831-125553-4`

## 2026-08-31T12:57:07+00:00

[012-does-adding-formative-feedback-worked] Adaptive distributed flow with formative feedback over 12 passes reaches >=99.0% mean mastery Prediction held: mean_mastery_pct=99.08, predicted >= 99.0. Controls OK.

**Source:** `012-does-adding-formative-feedback-worked` run `20260831-125707`

## 2026-08-31T12:57:48+00:00

Reaching >=99% mean mastery requires lifting the low-aptitude floor, not just more practice: adding formative feedback / worked-example teaching (a minimum effectiveness on every step) on top of interleaved + adaptive review + spacing/consolidation + scaffolding over ~12 spiral passes yields 99.08% with 100% of topics mastered. Without a floor mechanism, adaptive distributed practice asymptotes near ~99% and cannot clear it reliably.

**Evidence:** mean_mastery_pct=99.08 (target 99), prediction HELD, mastered_topic_pct=100

**Source:** `012-does-adding-formative-feedback-worked`
