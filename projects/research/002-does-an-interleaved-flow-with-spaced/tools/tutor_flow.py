"""Turn a curriculum graph into an ordered lesson plan. Stdlib only.

A *tutoring flow* is an ordered sequence of lesson steps. Each step targets one
topic and is either a first-time ``teach`` or a spaced ``review``. The ordering
strategy, spaced-review spacing and scaffolding depth are all configurable so
that experiments can search the strategy space for the flow that maximizes
downstream cohort mastery.
"""
from __future__ import annotations


def _topo_order(topics: list[dict]) -> list[dict]:
    """Prerequisite-respecting order; ties broken by (difficulty, id)."""
    by_id = {t["id"]: t for t in topics}
    placed: list[str] = []
    placed_set: set[str] = set()
    remaining = list(topics)
    while remaining:
        ready = [t for t in remaining
                 if all(p in placed_set for p in t["prereqs"])]
        if not ready:  # should not happen (graph is acyclic) but stay safe
            ready = list(remaining)
        ready.sort(key=lambda t: (t["difficulty"], t["id"]))
        chosen = ready[0]
        placed.append(chosen["id"])
        placed_set.add(chosen["id"])
        remaining.remove(chosen)
    return [by_id[i] for i in placed]


def _strand_order(topics: list[dict]) -> list[dict]:
    """Group by strand (blocked practice), prereqs respected within order."""
    topo = _topo_order(topics)
    strands: list[str] = []
    for t in topo:
        if t["strand"] not in strands:
            strands.append(t["strand"])
    out: list[dict] = []
    for s in strands:
        out.extend(t for t in topo if t["strand"] == s)
    return out


def _difficulty_order(topics: list[dict]) -> list[dict]:
    """Easiest currently-unlocked topic first (prereqs always respected)."""
    by_id = {t["id"]: t for t in topics}
    placed_set: set[str] = set()
    out: list[dict] = []
    remaining = list(topics)
    while remaining:
        unlocked = [t for t in remaining
                    if all(p in placed_set for p in t["prereqs"])]
        unlocked = unlocked or list(remaining)
        unlocked.sort(key=lambda t: (t["difficulty"], t["id"]))
        chosen = unlocked[0]
        out.append(by_id[chosen["id"]])
        placed_set.add(chosen["id"])
        remaining.remove(chosen)
    return out


def _interleaved_order(topics: list[dict]) -> list[dict]:
    """Round-robin across strands (interleaved practice), prereqs respected."""
    by_id = {t["id"]: t for t in topics}
    placed_set: set[str] = set()
    remaining = list(topics)
    strands: list[str] = []
    for t in _topo_order(topics):
        if t["strand"] not in strands:
            strands.append(t["strand"])
    out: list[dict] = []
    while remaining:
        progressed = False
        for s in strands:
            unlocked = [t for t in remaining if t["strand"] == s
                        and all(p in placed_set for p in t["prereqs"])]
            if not unlocked:
                continue
            unlocked.sort(key=lambda t: (t["difficulty"], t["id"]))
            chosen = unlocked[0]
            out.append(by_id[chosen["id"]])
            placed_set.add(chosen["id"])
            remaining.remove(chosen)
            progressed = True
        if not progressed:  # unlock via any ready topic to avoid stall
            unlocked = [t for t in remaining
                        if all(p in placed_set for p in t["prereqs"])]
            unlocked = unlocked or list(remaining)
            unlocked.sort(key=lambda t: (t["difficulty"], t["id"]))
            chosen = unlocked[0]
            out.append(by_id[chosen["id"]])
            placed_set.add(chosen["id"])
            remaining.remove(chosen)
    return out


_ORDERERS = {
    "prereq": _topo_order,
    "strand": _strand_order,
    "difficulty": _difficulty_order,
    "interleaved": _interleaved_order,
}


def plan_lessons(topics: list[dict], order: str = "prereq",
                 passes: int = 2, review_spacing: int = 4,
                 scaffolding: bool = True,
                 scaffold_threshold: float = 0.55,
                 review_mode: str = "cyclic",
                 feedback: bool = False) -> dict:
    """Build a tutoring flow (ordered list of lesson steps) from a curriculum.

    Args:
        topics: Curriculum topics from ``build_curriculum()``.
        order: One of ``prereq``, ``strand``, ``difficulty``, ``interleaved``.
        passes: How many times to spiral through the curriculum (>=1). Later
            passes revisit every topic, letting mastery accumulate.
        review_spacing: Insert a spaced ``review`` of an earlier topic every
            ``review_spacing`` teach steps (0 disables spaced review).
        scaffolding: If True, hard topics get an extra guided practice step.
        scaffold_threshold: Difficulty at/above which scaffolding applies.
        review_mode: ``cyclic`` cycles review through taught topics in order;
            ``adaptive`` marks review steps so each learner reviews their own
            weakest topic (mastery-learning / targeted spaced repetition).
        feedback: If True, every step carries formative feedback / worked-example
            teaching, which raises the effectiveness floor for weaker learners
            (differentiated support that lifts the cohort floor toward 99%).

    Returns:
        ``{"order", "passes", "review_mode", "feedback", "steps": [...],
        "n_teach", "n_review", "n_steps"}`` where each step is ``{"topic",
        "kind", "difficulty"}`` (steps also carry ``adaptive``/``feedback``)
        and ``kind`` is one of ``teach``, ``scaffold`` or ``review``. Raises
        ValueError on unknown order/review_mode, passes < 1, or negative spacing.
    """
    if order not in _ORDERERS:
        raise ValueError(f"unknown order {order!r}; "
                         f"choose from {sorted(_ORDERERS)}")
    if review_mode not in ("cyclic", "adaptive"):
        raise ValueError(f"unknown review_mode {review_mode!r}; "
                         "choose from ['adaptive', 'cyclic']")
    if passes < 1:
        raise ValueError("passes must be >= 1")
    if review_spacing < 0:
        raise ValueError("review_spacing must be >= 0")

    ordered = _ORDERERS[order](topics)
    steps: list[dict] = []
    taught: list[str] = []
    review_cursor = 0
    teach_count = 0
    adaptive = review_mode == "adaptive"

    for _pass in range(passes):
        for t in ordered:
            steps.append({"topic": t["id"], "kind": "teach",
                          "difficulty": t["difficulty"],
                          "feedback": feedback})
            if scaffolding and t["difficulty"] >= scaffold_threshold:
                steps.append({"topic": t["id"], "kind": "scaffold",
                              "difficulty": t["difficulty"],
                              "feedback": feedback})
            if t["id"] not in taught:
                taught.append(t["id"])
            teach_count += 1

            if review_spacing and teach_count % review_spacing == 0 and taught:
                review_id = taught[review_cursor % len(taught)]
                review_cursor += 1
                rt = next(x for x in ordered if x["id"] == review_id)
                steps.append({"topic": review_id, "kind": "review",
                              "difficulty": rt["difficulty"],
                              "adaptive": adaptive,
                              "feedback": feedback})

    n_teach = sum(1 for s in steps if s["kind"] == "teach")
    n_review = sum(1 for s in steps if s["kind"] == "review")
    return {"order": order, "passes": passes, "review_mode": review_mode,
            "feedback": feedback, "steps": steps, "n_teach": n_teach,
            "n_review": n_review, "n_steps": len(steps)}




