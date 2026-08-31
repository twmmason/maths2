#!/usr/bin/env python3
"""Keep running generations until there is genuinely nothing left to do.

    python3 loop.py                 # run until exhausted
    python3 loop.py --max 5         # or until five generations have run
    python3 loop.py --probe-only    # just show what a probe would ask

``generation.py`` runs one generation and stops. This restarts it, and does
the one thing that makes restarting worthwhile: when the record supports no
further question, it does not simply halt. It runs a **probe** — an
experiment whose purpose is to put a fresh, honestly-obtained observation
into the record — and then asks again.

That is the difference between a loop that idles and a loop that continues.
Exit 2 from ``generation.py`` means "nothing in the record justifies a
question", which is true and also self-perpetuating: a record that never
grows never produces a new question. A probe grows it.

What a probe is *not*: it is not a way to manufacture a defect so the loop
has something to chew on. Probes re-measure a case whose status is currently
unknown — the ``unsupported`` rejections, which are precisely the claims that
failed for want of evidence rather than for want of merit. If a probe finds
the case healthy, the loop stops for good and says so. That is the honest
terminal state, and it is reachable.

Stopping conditions, all of them real:

* no question, and no probe available          -> exhausted, exit 0
* a probe ran and the record still supports no question -> exhausted, exit 0
* the same generation fails twice in a row     -> stuck, exit 3
* ``--max`` generations completed              -> exit 0

There is no condition under which this prints "done" in the sense of the work
being finished. Exhausted means the current repertoire has nothing further to
ask, not that the questions have run out in general.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
import time


AUTO_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AUTO_DIR)

sys.path.insert(0, AUTO_DIR)
from audit import audit_run  # noqa: E402
from templates import build_experiment, template_for  # noqa: E402

sys.path.insert(0, os.path.join(ROOT, 'tools'))
from metadetect import validate_proposals  # noqa: E402
from proposer import collect_run_record, propose_next_hypotheses  # noqa: E402


def log(message: str) -> None:
    print(f"[loop {time.strftime('%H:%M:%S')}] {message}", flush=True)


def run_generation() -> int:
    """Run one generation, streaming its output."""
    proc = subprocess.run(
        [sys.executable, "generation.py"], cwd=AUTO_DIR, check=False
    )
    return proc.returncode


def find_probe() -> dict | None:
    """Find a case whose status is unknown and worth re-measuring.

    The proposals rejected as ``unsupported`` are exactly the claims the
    record cannot settle: something failed once and has not been measured
    since. Re-measuring one is a legitimate experiment with a real possible
    outcome in both directions, which is what distinguishes a probe from
    busywork.
    """
    record = collect_run_record(ROOT)
    derived = propose_next_hypotheses(ROOT)
    checked = validate_proposals(derived["proposals"], record["runs"])

    attempted = _already_probed(record)

    for item in checked["rejected"]:
        if item.get("verdict") != "unsupported":
            continue
        case = item.get("evidence", {}).get("case")
        if not case:
            continue

        # A probe that cannot measure its own target is not a probe. The
        # first version of this function did not check, so it re-probed
        # thin_lens every cycle: each probe added a run, none of them scored
        # thin_lens, the claim stayed unsupported, and the loop would have
        # run forever making experiments that could not answer their own
        # question. Refusing to repeat a probe that already failed to settle
        # its case is what turns an infinite cycle into a terminal state.
        if case in attempted:
            log(
                f"skipping {case!r}: already probed {attempted[case]} time(s) "
                "without the record settling it — the probe cannot measure "
                "this case, so repeating it would not help"
            )
            continue

        return {
            "case": case,
            "last_seen": item["evidence"].get("failed_in", "unknown"),
            "detector": item["detector"],
        }
    return None


def _already_probed(record: dict) -> dict:
    """Count probes that were *capable* of settling their case and did not.

    A probe leaves an experiment whose slug names the case it went after. But
    a probe that never scored its target tells us nothing about the target —
    only about the probe. Counting those as attempts would permanently retire
    a case on the strength of experiments that could not have answered it,
    which is the mirror image of the bug this guard was added to fix.

    So only probes whose scored output actually mentions the case count
    against it. A probe built before ``retarget`` existed is therefore not
    held against the case, and the improved probe gets its chance.
    """
    counts: dict = {}
    for run in record["runs"]:
        match = re.match(
            r"\d+-what-is-the-current-status-of-(.+)", run["experiment"]
        )
        if not match:
            continue
        case = match.group(1).replace("-", "_")

        detail = run.get("detail") or {}
        measured = {
            row.get("law")
            for row in detail.get("per_law", [])
            if row.get("law")
        }
        if case in measured:
            counts[case] = counts.get(case, 0) + 1
    return counts




def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--max", type=int, default=0, help="0 means unlimited")
    parser.add_argument("--probe-only", action="store_true")
    args = parser.parse_args()

    if args.probe_only:
        probe = find_probe()
        if probe is None:
            log("no probe available: no case has unknown status")
            return 0
        log(
            f"probe would re-measure {probe['case']!r}, last seen failing in "
            f"{probe['last_seen']}"
        )
        return 0

    completed = 0
    consecutive_failures = 0
    probed = False

    while True:
        if args.max and completed >= args.max:
            log(f"reached --max {args.max}")
            return 0

        log(f"--- generation {completed + 1} ---")
        code = run_generation()

        if code == 0:
            completed += 1
            consecutive_failures = 0
            probed = False  # a real generation resets the probe budget
            log(f"generation {completed} audited; continuing")
            continue

        if code == 3:
            consecutive_failures += 1
            log(f"generation failed ({consecutive_failures} in a row)")
            if consecutive_failures >= 2:
                log("failing repeatedly on the same state — stopping")
                return 3
            continue

        # code == 2: the record supports no question.
        if probed:
            log(
                "a probe already ran and the record still supports no "
                "question — exhausted"
            )
            log(
                "this is the honest terminal state: the current detectors and "
                "templates have nothing further to ask of this record"
            )
            return 0

        probe = find_probe()
        if probe is None:
            log("no question and no probe available — exhausted")
            return 0

        log(
            f"no question; probing {probe['case']!r} whose status is unknown "
            f"since {probe['last_seen']}"
        )
        code = run_probe(probe)
        probed = True
        if code != 0:
            log("probe did not complete; stopping rather than looping on it")
            return 3
        log("probe recorded; asking again")


def run_probe(probe: dict) -> int:
    """Re-measure a case whose status the record cannot currently settle."""
    from generation import sh

    template = template_for("regression_against_prior")
    if template is None:
        return 1

    proposal = {
        "detector": "regression_against_prior",
        "priority": 80,
        "experiment": probe["last_seen"].split("/")[0],
        "run_id": probe["last_seen"].split("/")[-1],
        "evidence": {"case": probe["case"], "failed_in": probe["last_seen"]},
        "question": (
            f"What is the current status of {probe['case']}, which failed in "
            f"{probe['last_seen']} and has not been measured since?"
        ),
    }

    slug, claim = build_experiment(ROOT, proposal, template, sh)
    if slug is None:
        return 1
    log(f"probe experiment {slug}")

    code, _ = sh(["auto-adk", "validate", slug])
    if code != 0:
        return 1

    code, out = sh(["auto-adk", "run", slug], timeout=1800)
    if code not in (0, 2):
        return 1

    run_id = None
    for line in out.splitlines():
        if "trace:" in line:
            run_id = line.strip().split("/")[-1]
    if run_id is None:
        return 1

    verdict = audit_run(ROOT, slug, run_id, proposal, claim)
    sh(
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
    sh(["auto-adk", "report", slug])
    sh(["auto-adk", "learn", verdict["learning"], "--run", run_id])
    log(f"probe: {verdict['summary']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
