#!/usr/bin/env python3
"""Run one complete auto-adk generation, start to finish, unattended.

    python3 generation.py

Choose the question, register it, build the experiment, validate, run, score
against the registered prediction, audit, report, and record what was learned.
No step waits for a person.

Exit codes, so a scheduler can branch without parsing prose:

    0  a generation completed and was audited
    2  the record supports no further question — nothing to do
    3  the generation failed and the failure was recorded

The honest boundary. This script automates the *procedure*, and the repertoire
it draws on is written down rather than inferred:

* the detector vocabulary that decides which questions are askable
  (``tools/proposer.py``)
* the evidence rules that decide which are supported (``tools/metadetect.py``)
* the experiment templates in ``templates.py`` — a generation instantiates one,
  it does not invent an experimental design

A generation exhausts when that repertoire has nothing left to ask. The
supervisor then reads the trajectory and proposes directions outside it,
so ``evolve.py`` returning 2 bounds these detectors rather than the record.
Nothing here reaches a state that could be called "done".
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time

AUTO_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AUTO_DIR)

# Import framework modules from the project root BEFORE adding tools/ to the
# path, so a tools/templates.py plugin cannot shadow the framework's own
# templates.py.
sys.path.insert(0, AUTO_DIR)
from audit import audit_run  # noqa: E402
from templates import build_experiment, template_for  # noqa: E402

sys.path.insert(0, os.path.join(ROOT, 'tools'))
from metadetect import validate_proposals  # noqa: E402
from proposer import (  # noqa: E402
    collect_run_record,
    extraction_coverage,
    propose_next_hypotheses,
)


def log(message: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {message}", flush=True)


def sh(args: list, timeout: int = 900) -> tuple:
    """Run a command, return (exit_code, combined_output)."""
    env = dict(os.environ)
    # Ensure ~/.local/bin is on PATH (where auto-adk may be installed).
    local_bin = os.path.expanduser("~/.local/bin")
    if local_bin not in env.get("PATH", ""):
        env["PATH"] = f"{local_bin}:{env.get('PATH', '')}"
    proc = subprocess.run(
        args,
        cwd=ROOT,
        env=env,
        capture_output=True,
        text=True,
        timeout=timeout,
        check=False,
    )
    return proc.returncode, (proc.stdout or "") + (proc.stderr or "")


def choose() -> dict | None:
    """Pick the next question from the record, or None if none is supported."""
    record = collect_run_record(ROOT)
    coverage = extraction_coverage(ROOT)
    log(
        f"record: {coverage['n_readable']}/{coverage['n_runs']} runs readable"
        + (
            f" (unreadable: {len(coverage['unreadable'])})"
            if coverage["unreadable"]
            else ""
        )
    )

    derived = propose_next_hypotheses(ROOT)
    checked = validate_proposals(derived["proposals"], record["runs"])
    log(
        f"proposals: {len(derived['proposals']) + derived['n_resolved']} raw, "
        f"{derived['n_resolved']} already resolved, "
        f"{checked['n_rejected']} rejected, {checked['n_supported']} supported"
    )
    for item in checked["rejected"]:
        log(f"  rejected [{item['verdict']}] {item['why'][:100]}")

    return checked["supported"][0] if checked["supported"] else None


def _run_diagnostic(proposal: dict) -> int:
    """Settle a question about the loop's own machinery and record it.

    The verdict goes into LEARNINGS.md with the measurement behind it, which
    is what closes the question: the introspection detectors treat a
    recorded finding about their subject as an answer, so a diagnosed defect
    stops being re-raised whether the verdict was "real" or "false alarm".

    Nothing is repaired here. Two fixes in this project were verified by
    re-reading the file edited rather than by measuring the behaviour wanted,
    and a diagnostic that also patched its subject would be marking its own
    work.
    """
    from diagnose import DIAGNOSTICS  # noqa: PLC0415

    detector = proposal["detector"]
    log(f"machinery question — running diagnostic {detector!r}")

    result = DIAGNOSTICS[detector]()
    verdict = result.get("verdict", "no verdict produced")
    log(f"verdict: {verdict[:200]}")

    learning = (
        f"[diagnostic:{detector}] {result.get('question', '')} "
        f"VERDICT: {verdict}"
    )
    # The engine refuses a learning with nothing behind it, which is correct:
    # a diagnostic's verdict is only worth recording alongside what it
    # measured. The measurement travels as --evidence.
    evidence = json.dumps(
        {k: v for k, v in result.items() if k not in ("question", "verdict")}
    )[:1500]

    code, out = sh(
        ["auto-adk", "learn", learning, "--evidence", evidence]
    )

    if code != 0:
        log(f"could not record the finding: {out[-200:]}")
        return 3

    log("finding recorded")
    log("=== generation complete (diagnostic) ===")
    return 0


def main() -> int:
    log("=== auto-adk generation ===")


    proposal = choose()
    if proposal is None:
        log("no question survives its own evidence check — nothing to run")
        log(
            "this is a terminal state, not an error: the record justifies no "
            "further question"
        )
        return 2

    log(f"question [{proposal['detector']}]: {proposal['question'][:110]}")
    log(f"  evidence: {json.dumps(proposal['evidence'])[:140]}")

    # Templates are matched to detectors. A detector with no template cannot
    # be acted on automatically, and saying so is better than improvising an
    # experiment whose design nobody checked.
    # A question about the loop's own machinery is not answered by running a
    # science experiment. It is answered by measuring the repository. Those
    # go to diagnose.py, which reports a verdict and the evidence for it.
    from diagnose import DIAGNOSTICS  # noqa: E402

    if proposal["detector"] in DIAGNOSTICS:
        return _run_diagnostic(proposal)

    template = template_for(proposal["detector"])
    if template is None:
        log(
            f"no experiment template for detector {proposal['detector']!r}; "
            "a person must design this one"
        )
        return 2


    log(f"template: {template['name']}")

    slug, prediction = build_experiment(ROOT, proposal, template, sh)
    if slug is None:
        log("could not create the experiment")
        return 3
    log(f"created {slug}")
    log(f"  prediction: {prediction[:120]}")

    code, out = sh(["auto-adk", "validate", slug])
    if code != 0:
        log(f"validate failed:\n{out[-800:]}")
        return 3
    log("validated")

    log("running (this can take minutes)")
    code, out = sh(["auto-adk", "run", slug], timeout=1800)
    tail = "\n".join(out.strip().splitlines()[-12:])
    if code not in (0, 2):
        log(f"run errored:\n{tail}")
        return 3
    log(f"run finished (exit {code})")
    for line in tail.splitlines():
        log(f"  {line}")

    run_id = None
    for line in out.splitlines():
        if "trace:" in line:
            run_id = line.strip().split("/")[-1]
    if run_id is None:
        log("could not determine the run id; not auditing an unidentified run")
        return 3

    verdict = audit_run(ROOT, slug, run_id, proposal, prediction)
    log(f"audit: {verdict['summary'][:160]}")

    code, _ = sh(
        [
            "auto-adk",
            "audit",
            slug,
            "--run",
            run_id,
            "--scientific-value",
            str(verdict["scientific_value"]),
            "--method-fidelity",
            str(verdict["method_fidelity"]),
            "--implementation-quality",
            str(verdict["implementation_quality"]),
            "--rationale",
            verdict["rationale"],
        ]
    )
    if code != 0:
        log("audit command failed")
        return 3

    sh(["auto-adk", "report", slug])
    sh(["auto-adk", "learn", verdict["learning"], "--run", run_id])
    sh(["auto-adk", "campaign"])
    log(f"recorded: {slug}/{run_id}")

    log("=== generation complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
