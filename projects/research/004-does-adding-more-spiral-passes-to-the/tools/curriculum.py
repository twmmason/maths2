"""UK Year 6 -> KS3 maths curriculum as a prerequisite graph. Stdlib only.

The topic list, strands and codes are extracted from ``/docs/PLAN.md`` (which
was itself distilled from the two DfE curriculum PDFs in ``/docs``). Each topic
carries an intrinsic ``difficulty`` in [0,1] and a list of prerequisite topic
ids. This graph is fixed ground truth so that experiments are reproducible.
"""
from __future__ import annotations

# id: (title, strand, difficulty, [prerequisite ids])
_TOPICS: dict[str, tuple[str, str, float, list[str]]] = {
    # ── Year 6: Number & Place Value ──────────────────────────────────────
    "6NPV-1": ("Powers of 10", "Number & Place Value", 0.25, []),
    "6NPV-2": ("Compose & decompose numbers to 10 million",
               "Number & Place Value", 0.30, ["6NPV-1"]),
    "6NPV-3": ("Numbers up to 10 million on the number line",
               "Number & Place Value", 0.35, ["6NPV-2"]),
    "6NPV-4": ("Divide powers of 10 / read scales",
               "Number & Place Value", 0.40, ["6NPV-1", "6NPV-3"]),
    # ── Year 6: Arithmetic & Structure ────────────────────────────────────
    "6ASMD-1": ("Additive vs multiplicative relationships",
                "Arithmetic & Structure", 0.40, ["6NPV-2"]),
    "6ASMD-2": ("Derive related calculations",
                "Arithmetic & Structure", 0.45, ["6ASMD-1"]),
    "6ASMD-3": ("Ratio relationships",
                "Arithmetic & Structure", 0.50, ["6ASMD-1"]),
    "6ASMD-4": ("Problems with two unknowns",
                "Arithmetic & Structure", 0.55, ["6ASMD-2", "6ASMD-3"]),
    # ── Year 6: Fractions ─────────────────────────────────────────────────
    "6F-1": ("Simplify fractions", "Fractions", 0.40, ["6ASMD-1"]),
    "6F-2": ("Common denomination & compare", "Fractions", 0.50, ["6F-1"]),
    "6F-3": ("Compare fractions (reasoning)", "Fractions", 0.55, ["6F-2"]),
    # ── Year 6: Geometry ──────────────────────────────────────────────────
    "6G-1": ("Draw, compose & decompose shapes", "Geometry", 0.45, ["6NPV-3"]),
    # ── KS3: Number ───────────────────────────────────────────────────────
    "KS3N-1": ("Factors, multiples & primes", "KS3 Number", 0.50, ["6ASMD-2"]),
    "KS3N-2": ("Negatives & order of operations (BIDMAS)",
               "KS3 Number", 0.55, ["6ASMD-2"]),
    # ── KS3: Algebra ──────────────────────────────────────────────────────
    "KS3A-1": ("Algebraic expressions", "KS3 Algebra", 0.60,
               ["6ASMD-4", "KS3N-2"]),
    "KS3A-2": ("Sequences", "KS3 Algebra", 0.60, ["KS3A-1"]),
    # ── KS3: Ratio & Proportion ───────────────────────────────────────────
    "KS3R-1": ("Percentages", "KS3 Ratio & Proportion", 0.60,
               ["6ASMD-3", "6F-2"]),
    # ── KS3: Geometry & Measures ──────────────────────────────────────────
    "KS3G-1": ("Area & perimeter", "KS3 Geometry & Measures", 0.55, ["6G-1"]),
    "KS3G-2": ("Angles", "KS3 Geometry & Measures", 0.55, ["6G-1"]),
    # ── KS3: Probability & Statistics ─────────────────────────────────────
    "KS3P-1": ("Probability", "KS3 Probability & Statistics", 0.60,
               ["6F-3", "KS3R-1"]),
    "KS3P-2": ("Averages (mean/median/mode)",
               "KS3 Probability & Statistics", 0.55, ["6ASMD-2"]),
}


def build_curriculum() -> dict:
    """Return the curriculum prerequisite graph.

    Returns a dict ``{"topics": [...], "strands": [...], "n_topics": int}``
    where each topic is ``{"id", "title", "strand", "difficulty",
    "prereqs"}``. Raises ValueError if any prerequisite id is unknown or if the
    prerequisite graph contains a cycle (which would make ordering impossible).
    """
    topics = []
    for tid, (title, strand, diff, prereqs) in _TOPICS.items():
        for p in prereqs:
            if p not in _TOPICS:
                raise ValueError(f"topic {tid} lists unknown prerequisite {p}")
        topics.append({
            "id": tid, "title": title, "strand": strand,
            "difficulty": diff, "prereqs": list(prereqs),
        })

    # Cycle check via Kahn's algorithm.
    indeg = {t["id"]: 0 for t in topics}
    for t in topics:
        for _ in t["prereqs"]:
            indeg[t["id"]] += 1
    ready = [tid for tid, d in indeg.items() if d == 0]
    seen = 0
    deps = {t["id"]: t["prereqs"] for t in topics}
    remaining = dict(indeg)
    queue = list(ready)
    while queue:
        cur = queue.pop()
        seen += 1
        for t in topics:
            if cur in deps[t["id"]]:
                remaining[t["id"]] -= 1
                if remaining[t["id"]] == 0:
                    queue.append(t["id"])
    if seen != len(topics):
        raise ValueError("prerequisite graph contains a cycle")

    strands = []
    for t in topics:
        if t["strand"] not in strands:
            strands.append(t["strand"])

    return {"topics": topics, "strands": strands, "n_topics": len(topics)}
