"""Seeded learner-cohort simulator (Bayesian Knowledge Tracing). Stdlib only.

A cohort of simulated learners walks the tutoring flow step by step. Each
learner holds a mastery in [0,1] per topic. A ``teach``/``scaffold``/``review``
step raises the targeted topic's mastery via a BKT-style learning update whose
effectiveness depends on how well the topic's prerequisites are already
mastered. Between steps, every topic's mastery decays, so topics that are never
revisited are gradually forgotten — which is what makes spaced review and
interleaving matter.

Each successful retrieval also raises the topic's memory *stability*
(the consolidation / spacing effect): well-reviewed topics decay more slowly,
so distributed practice pushes durable mastery past the plateau that uniform
forgetting would otherwise impose.
"""
from __future__ import annotations

import random

# Learning gain per step kind (fraction of the remaining gap closed).
_GAIN = {"teach": 0.50, "scaffold": 0.35, "review": 0.40}
# Base per-step forgetting applied to every *other* topic's mastery. The actual
# decay is divided by the topic's stability, so consolidated topics fade slower.
_DECAY = 0.0015
# How much each study touch on a topic raises its memory stability.
_STABILITY_GAIN = 0.6
# Maximum stability multiplier (caps how slow decay can get).
_STABILITY_MAX = 8.0
# Effectiveness floor granted by formative feedback / worked-example teaching on
# a review step. Lifts low-aptitude learners so the cohort floor can clear 99%.
_FEEDBACK_FLOOR = 0.75


def _prereq_readiness(mastery: dict, prereqs: list[str]) -> float:
    """Mean prerequisite mastery in [0,1]; 1.0 when there are no prereqs."""
    if not prereqs:
        return 1.0
    return sum(mastery.get(p, 0.0) for p in prereqs) / len(prereqs)


def simulate_cohort(topics: list[dict], steps: list[dict],
                    mastery_threshold: float = 0.8,
                    cohort_size: int = 40, seed: int = 2026) -> dict:
    """Run a cohort through a tutoring flow and measure resulting mastery.

    Args:
        topics: Curriculum topics from ``build_curriculum()``.
        steps: Ordered lesson steps from ``plan_lessons()``.
        mastery_threshold: Mastery at/above which a topic counts as mastered.
        cohort_size: Number of simulated learners.
        seed: Random seed (deterministic).

    Returns:
        ``{"mean_mastery_pct", "mastered_topic_pct", "per_topic_mastery",
        "cohort_size", "n_steps"}``. Raises ValueError on empty inputs.
    """
    if not topics:
        raise ValueError("no topics to teach")
    if not steps:
        raise ValueError("no lesson steps in the flow")

    rng = random.Random(seed)
    prereqs = {t["id"]: t["prereqs"] for t in topics}
    difficulty = {t["id"]: t["difficulty"] for t in topics}
    topic_ids = [t["id"] for t in topics]

    # Per-learner aptitude scales learning gains (mean 1.0, seeded spread).
    learners = []
    for _ in range(cohort_size):
        aptitude = max(0.5, min(1.5, rng.gauss(1.0, 0.18)))
        learners.append({"mastery": {tid: 0.0 for tid in topic_ids},
                         "stability": {tid: 1.0 for tid in topic_ids},
                         "aptitude": aptitude})

    for step in steps:
        tid = step["topic"]
        adaptive = step.get("adaptive", False)
        feedback = step.get("feedback", False)
        base_gain = _GAIN.get(step["kind"], _GAIN["teach"])
        for lr in learners:
            m = lr["mastery"]
            stab = lr["stability"]
            # Adaptive review: each learner reviews their own weakest topic
            # that has already been introduced (mastery-learning principle).
            if adaptive and lr.get("taught"):
                target_tid = min(lr["taught"], key=lambda t: m[t])
            else:
                target_tid = tid
            diff = difficulty.get(target_tid, 0.5)
            readiness = _prereq_readiness(m, prereqs.get(target_tid, []))
            # Effectiveness: aptitude x prereq-readiness x (1 - difficulty pen).
            eff = lr["aptitude"] * (0.15 + 0.85 * readiness) * (1.0 - 0.35 * diff)
            eff = max(0.0, min(1.0, eff))
            # Formative feedback / worked examples raise the effectiveness floor,
            # closing the gap for low-aptitude learners (differentiated support).
            if feedback:
                eff = max(eff, _FEEDBACK_FLOOR * (0.5 + 0.5 * readiness))
            gap = 1.0 - m[target_tid]
            m[target_tid] = min(1.0, m[target_tid] + base_gain * eff * gap)
            # Consolidation: a successful touch raises memory stability, so the
            # topic will decay more slowly from now on (the spacing effect).
            stab[target_tid] = min(_STABILITY_MAX,
                                   stab[target_tid] + _STABILITY_GAIN * eff)
            if step["kind"] != "review":
                lr.setdefault("taught", set()).add(target_tid)
            # Forgetting on every other topic, scaled by its stability.
            for other in topic_ids:
                if other != target_tid and m[other] > 0.0:
                    m[other] = max(0.0, m[other] - _DECAY / stab[other])



    # Aggregate.
    per_topic = {tid: 0.0 for tid in topic_ids}
    mean_sum = 0.0
    mastered_sum = 0.0
    for lr in learners:
        m = lr["mastery"]
        learner_mean = sum(m.values()) / len(topic_ids)
        mean_sum += learner_mean
        mastered_sum += sum(1 for v in m.values() if v >= mastery_threshold) \
            / len(topic_ids)
        for tid in topic_ids:
            per_topic[tid] += m[tid]

    n = len(learners)
    return {
        "mean_mastery_pct": round(mean_sum / n * 100, 2),
        "mastered_topic_pct": round(mastered_sum / n * 100, 2),
        "per_topic_mastery": {tid: round(per_topic[tid] / n, 3)
                              for tid in topic_ids},
        "cohort_size": n,
        "n_steps": len(steps),
    }
