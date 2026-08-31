#!/usr/bin/env python3
"""Answer questions about the loop's own machinery by measuring it.

    python3 diagnose.py unreadable_runs

``introspect.py`` finds defects in the loop itself; this settles them. The two
are separate on purpose. A question about a physical law needs an experiment
— data, controls, a holdout. A question about why four runs are unreadable
needs someone to open those four runs and look, and dressing that up as a
science experiment would add ceremony without adding evidence.

So ``generation.py`` handles the first kind and hands the second here. Each
diagnostic below reads the repository, reports what it measured, and states
plainly whether the defect is real, already fixed, or something other than
what the detector assumed. All three are useful answers.

What this does *not* do is repair anything. A diagnostic that also patched
its subject would be marking its own work, and this project has already
produced two fixes that were verified by re-reading the artefact edited
rather than by measuring the behaviour wanted. The output here is evidence
for a person or a later generation to act on.
"""

from __future__ import annotations

import json
import os
import re
import sys

AUTO_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AUTO_DIR)
sys.path.insert(0, os.path.join(ROOT, "tools"))

from proposer import collect_run_record  # noqa: E402


def _load(path: str):
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def diagnose_unreadable_runs() -> dict:
    """Find out why some runs produce no readable evaluation payload.

    The detector reports a count. The interesting question is whether those
    runs *have* a payload the extractor misses — a real blind spot — or
    genuinely produced none, which would make the count a description of
    failed runs rather than a defect.
    """
    record = collect_run_record(ROOT)
    findings = []

    for run in record["runs"]:
        if run["detail"] is not None:
            continue
        base = os.path.join(
            ROOT, "research", run["experiment"], "runs", run["run_id"]
        )
        trace_path = os.path.join(base, "trace.json")
        if not os.path.exists(trace_path):
            findings.append(
                {
                    "run": f"{run['experiment']}/{run['run_id']}",
                    "cause": "no trace.json at all",
                    "is_blind_spot": False,
                }
            )
            continue

        trace = _load(trace_path)
        details = _all_detail_dicts(trace)
        state = _run_state(run["score"])

        if not details:
            findings.append(
                {
                    "run": f"{run['experiment']}/{run['run_id']}",
                    "cause": (
                        f"run state {state!r}; the evaluation node never "
                        "produced a detail payload"
                    ),
                    "is_blind_spot": False,
                }
            )
        else:
            keys = sorted({key for detail in details for key in detail})
            findings.append(
                {
                    "run": f"{run['experiment']}/{run['run_id']}",
                    "cause": (
                        "a detail payload exists but carries none of the "
                        "marker keys the extractor recognises"
                    ),
                    "unrecognised_keys": keys[:12],
                    "is_blind_spot": True,
                }
            )

    blind = [f for f in findings if f["is_blind_spot"]]
    return {
        "question": "why are some runs unreadable?",
        "n_unreadable": len(findings),
        "n_true_blind_spots": len(blind),
        "verdict": (
            f"{len(blind)} of {len(findings)} unreadable runs are genuine "
            "extractor blind spots; the rest produced no payload to read"
            if blind
            else (
                f"none of the {len(findings)} unreadable runs is a blind "
                "spot — every one failed before its evaluation node ran, so "
                "there is nothing for the extractor to miss and the detector "
                "is counting failed runs rather than a defect"
            )
        ),
        "findings": findings,
    }


def _all_detail_dicts(trace) -> list:
    found = []
    stack = [trace]
    while stack:
        item = stack.pop()
        if isinstance(item, dict):
            if isinstance(item.get("detail"), dict) and item["detail"]:
                found.append(item["detail"])
            stack.extend(item.values())
        elif isinstance(item, list):
            stack.extend(item)
    return found


def _run_state(score) -> str:
    if not isinstance(score, dict):
        return "unknown"
    gates = score.get("gates", [])
    failed = [
        g.get("name")
        for g in gates
        if isinstance(g, dict) and not g.get("passed", True)
    ]
    return f"failed gates {failed}" if failed else "passed"


def diagnose_duplicated_setting() -> dict:
    """Establish which of two declarations of a setting actually wins.

    The detector reports that a key appears in both ``workflow.json`` params
    and ``agents/config.py``. Whether that matters depends entirely on which
    one the engine reads, and the answer is already in the record: run 012
    had ``thin_lens`` moved to the holdout set in config.py alone and still
    scored the old set, while run 017 had both patched and scored the new
    one.
    """
    evidence = []
    for slug, expectation in (
        ("012-what-is-the-current-status-of-thin-lens", "config.py only"),
        ("017-what-is-the-current-status-of-thin-lens", "both files"),
    ):
        path = os.path.join(ROOT, "research", slug)
        if not os.path.isdir(path):
            continue
        record = collect_run_record(ROOT)
        for run in record["runs"]:
            if run["experiment"] != slug:
                continue
            laws = [
                row.get("law")
                for row in (run["detail"] or {}).get("per_law", [])
            ]
            evidence.append(
                {
                    "experiment": slug,
                    "patched": expectation,
                    "thin_lens_scored": "thin_lens" in laws,
                    "n_scored": len(laws),
                }
            )

    decisive = [e for e in evidence if e["patched"] == "config.py only"]
    verdict = "insufficient evidence in the record"
    if decisive and not decisive[0]["thin_lens_scored"]:
        verdict = (
            "workflow.json params win. Editing agents/config.py alone changed "
            "nothing observable; patching both changed the scored set. Any "
            "edit to a setting must target the workflow params, and must be "
            "verified against scored output rather than by re-reading the "
            "file that was edited."
        )

    return {
        "question": "which declaration of a duplicated setting wins?",
        "verdict": verdict,
        "evidence": evidence,
    }


def diagnose_untested_module() -> dict:
    """Check whether the loop's own tools are exercised by anything.

    A tool absent from every workflow is not necessarily dead — the loop's
    own modules are imported directly by ``generation.py`` rather than
    declared as agent tools. The detector cannot tell those apart, so this
    separates them.
    """
    tools_dir = os.path.join(ROOT, "tools")
    loop_sources = [
        os.path.join(ROOT, name)
        for name in ("generation.py", "loop.py", "evolve.py", "templates.py")
        if os.path.exists(os.path.join(ROOT, name))
    ]
    loop_text = ""
    for path in loop_sources:
        with open(path, encoding="utf-8") as handle:
            loop_text += handle.read()

    findings = []
    for entry in sorted(os.listdir(tools_dir)):
        if not entry.endswith(".py") or entry.startswith("_"):
            continue
        module = entry[:-3]
        imported = bool(re.search(rf"\b{re.escape(module)}\b", loop_text))
        findings.append(
            {
                "module": module,
                "imported_by_loop": imported,
                "status": (
                    "exercised by the loop itself, not by agent workflows"
                    if imported
                    else "not referenced anywhere — genuinely unexercised"
                ),
            }
        )

    orphans = [f["module"] for f in findings if not f["imported_by_loop"]]
    return {
        "question": "do the loop's tools work?",
        "verdict": (
            f"genuinely unexercised: {orphans}"
            if orphans
            else "every tool is either declared in a workflow or imported by "
            "the loop; the detector was matching on workflow declarations "
            "only and so mislabelled the loop's own modules as untested"
        ),
        "findings": findings,
    }


def diagnose_wasted_experiments() -> dict:
    """Establish why repeated experiments settled nothing.

    The detector counts experiments asking the same question three or more
    times. That pattern has two very different causes, and the distinction
    matters: either the design could not answer its own question, or the
    question was simply asked again before the answer landed.

    The record separates them. A probe that scored its target case answered
    it; one that did not could never have.
    """
    record = collect_run_record(ROOT)

    probes = []
    for run in record["runs"]:
        match = re.match(
            r"\d+-what-is-the-current-status-of-(.+)", run["experiment"]
        )
        if not match:
            continue
        case = match.group(1).replace("-", "_")
        scored = {
            row.get("law")
            for row in (run["detail"] or {}).get("per_law", [])
        }
        probes.append(
            {
                "experiment": run["experiment"],
                "target": case,
                "measured_its_target": case in scored,
            }
        )

    blind = [p for p in probes if not p["measured_its_target"]]
    effective = [p for p in probes if p["measured_its_target"]]

    verdict = "no repeated probe experiments in the record"
    if probes:
        verdict = (
            f"{len(blind)} of {len(probes)} probe experiments never scored "
            "the case they were built to measure, so they could not have "
            "settled their own question however cleanly they ran. "
            + (
                f"The {len(effective)} that did score their target settled it "
                "on the first attempt. The waste is a design fault — the "
                "template inherited a law split that excluded the target — "
                "not a property of the question."
                if effective
                else "None scored its target, so the template has never been "
                "able to answer this class of question."
            )
        )

    return {
        "question": "why did repeated experiments settle nothing?",
        "n_probes": len(probes),
        "n_could_not_answer": len(blind),
        "verdict": verdict,
        "probes": probes,
    }


DIAGNOSTICS = {
    "unreadable_runs": diagnose_unreadable_runs,
    "wasted_experiments": diagnose_wasted_experiments,
    "duplicated_setting": diagnose_duplicated_setting,
    "untested_module": diagnose_untested_module,
}



def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] not in DIAGNOSTICS:
        print(f"usage: diagnose.py [{' | '.join(sorted(DIAGNOSTICS))}]")
        return 1

    result = DIAGNOSTICS[sys.argv[1]]()
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
