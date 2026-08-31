"""Grade a run against the prediction registered before it started.

This replaces the last judgement a person was making each generation. It
does not decide whether a result is *interesting* — that is not decidable
from a trace. It decides three things that are:

* did the registered prediction hold, comparing the recorded number against
  the operator and threshold written down before the run;
* did the falsification controls behave, so a green result obtained by a
  broken criterion is not scored as a finding;
* was the run internally coherent — gates passed, an evaluation value
  produced.

Why it reads the prediction from the file rather than being told: run 008
reported all three of its predictions HELD when, on the text as registered,
two had failed. The evaluation node tested ``max > min`` where the registered
claim was "more than 8", and the same person wrote both. Reading the JSON
block that ``templates.py`` wrote means the threshold graded is the threshold
registered, and a mismatch is impossible rather than merely discouraged.

Scoring is deliberately harsh in one direction. A refuted prediction still
earns scientific value, because a refutation is a finding. A **void control**
caps the score regardless of everything else, because a measurement that
cannot fail has not measured anything.
"""

from __future__ import annotations

import json
import os
import re
from typing import Any

#: A prediction that fails still teaches; a broken control does not.
_VOID_CONTROL_CAP: float = 0.35


def _load(path: str) -> Any:
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def read_prediction(root: str, slug: str) -> dict | None:
    """Recover the machine-checkable prediction from HYPOTHESIS.md."""
    path = os.path.join(root, "research", slug, "HYPOTHESIS.md")
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as handle:
        text = handle.read()
    blocks = re.findall(r"```json\s*(\{.*?\})\s*```", text, re.S)
    for block in reversed(blocks):
        try:
            parsed = json.loads(block)
        except json.JSONDecodeError:
            continue
        if "metric" in parsed and "op" in parsed:
            return parsed
    return None


def _find_metric(payload: Any, metric: str) -> Any:
    """Search a nested structure for the named metric."""
    stack = [payload]
    while stack:
        item = stack.pop()
        if isinstance(item, dict):
            if metric in item:
                return item[metric]
            stack.extend(item.values())
        elif isinstance(item, list):
            stack.extend(item)
    return None


def _compare(observed: Any, op: str, expected: Any) -> bool:
    if observed is None:
        return False
    try:
        if op == ">":
            return observed > expected
        if op == ">=":
            return observed >= expected
        if op == "<":
            return observed < expected
        if op == "<=":
            return observed <= expected
        if op == "==":
            return observed == expected
    except TypeError:
        return False
    raise ValueError(f"unknown comparison operator {op!r}")


def audit_run(root: str, slug: str, run_id: str, proposal: dict, claim: str) -> dict:
    """Judge a completed run and return ratings plus a written rationale."""
    base = os.path.join(root, "research", slug, "runs", run_id)
    score = _load(os.path.join(base, "score.json"))
    trace = _load(os.path.join(base, "trace.json")) if os.path.exists(
        os.path.join(base, "trace.json")
    ) else {}

    gates = score.get("gates", []) if isinstance(score, dict) else []
    failed_gates = [
        g.get("name") for g in gates if isinstance(g, dict) and not g.get("passed", True)
    ]

    prediction = read_prediction(root, slug)
    observed = None
    held = None
    if prediction is not None:
        observed = _find_metric(trace, prediction["metric"])
        held = _compare(observed, prediction["op"], prediction["value"])

    control_rate = _find_metric(trace, "unreachable_recovery_rate")
    control_void = isinstance(control_rate, (int, float)) and control_rate > 0.0

    # Ratings. Implementation tracks whether the machinery ran; method
    # fidelity tracks whether the measurement can support a claim; scientific
    # value tracks what was learned, and a refutation counts.
    implementation = 0.8 if not failed_gates else 0.3
    if control_void:
        method = _VOID_CONTROL_CAP
        value = _VOID_CONTROL_CAP
    elif prediction is None:
        method = 0.4
        value = 0.3
    elif held:
        method = 0.75
        value = 0.65
    else:
        method = 0.7
        value = 0.6

    parts = []
    if failed_gates:
        parts.append(f"Gates failed: {failed_gates}. This is not a result.")
    if control_void:
        parts.append(
            f"VOID CONTROL: unreachable_recovery_rate is {control_rate}, so a "
            "case that provably cannot be solved was scored as solved. The "
            "criterion is measuring fit rather than correctness and the "
            "headline number is void with it. Scores are capped at "
            f"{_VOID_CONTROL_CAP} regardless of the rest."
        )
    if prediction is None:
        parts.append(
            "No machine-checkable prediction was registered, so nothing here "
            "could have been refuted and the run cannot be scored as a test."
        )
    else:
        verdict = "HELD" if held else "FAILED"
        parts.append(
            f"Registered prediction {verdict}: {prediction['metric']} was "
            f"{observed}, predicted {prediction['op']} {prediction['value']}. "
            f"Claim: {claim} Graded against the JSON block written into "
            "HYPOTHESIS.md before the run, not against a criterion restated "
            "afterwards."
        )
        if not held:
            parts.append(
                "A refuted prediction is a finding, not a failure, and is "
                "scored as such. The refutation condition registered was: "
                f"{prediction.get('refuted_if', 'not stated')}"
            )
    parts.append(
        f"Question chosen by the {proposal['detector']} detector from "
        f"{proposal['experiment']}/{proposal['run_id']}; no person selected "
        "it. Boundary: the experiment instantiates a fixed template, so this "
        "generation tested a designed question rather than an invented one."
    )

    rationale = " ".join(parts)
    summary = (
        f"{'gates failed' if failed_gates else 'gates passed'}; "
        f"prediction {'n/a' if held is None else ('HELD' if held else 'FAILED')}"
        f"{'; VOID CONTROL' if control_void else ''}"
    )

    learning = (
        f"[{slug}] {claim} Registered prediction "
        f"{'held' if held else 'was refuted'}: {prediction['metric'] if prediction else 'n/a'} "
        f"= {observed}, predicted {prediction['op'] if prediction else ''} "
        f"{prediction['value'] if prediction else ''}. "
        + (
            "A control that provably cannot be solved was scored as solved, so "
            "this run's headline is void."
            if control_void
            else "Falsification controls behaved as intended."
        )
    )

    return {
        "scientific_value": round(value, 2),
        "method_fidelity": round(method, 2),
        "implementation_quality": round(implementation, 2),
        "rationale": rationale,
        "summary": summary,
        "learning": learning,
        "prediction_held": held,
        "observed": observed,
        "control_void": control_void,
    }
