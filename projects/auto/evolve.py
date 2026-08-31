#!/usr/bin/env python3
"""auto-adk evolve — decide, and justify, what this project should do next.

One command. It reads everything the project has recorded, derives candidate
questions from that record, checks each against the same record, and prints
the one question the evidence supports — or says plainly that there is none.

    python evolve.py              # what should we do next?
    python evolve.py --verbose    # and why each rejection was made
    python evolve.py --json       # machine-readable, for a runner
    python evolve.py --register   # create the experiment via auto-adk

The pipeline, and who owns each step:

    run record   →  proposer   →  metadetect  →  one question
    (engine)        (derived)     (checked)      (mechanical)

Mechanised: which parameters, which features, which controls are valid, which
selection rule, which question to ask, and whether that question is supported.

When the detectors are spent, the supervisor reads the trajectory and proposes
directions they cannot express — so exhaustion reports the limits of this
repertoire rather than the limits of the record.

The regress is real. ``metadetect`` is not itself checked, and could be wrong
in the way the proposer was. What the layering buys is that a wrong claim is
now caught by running something rather than by someone noticing.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys

AUTO_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AUTO_DIR)
sys.path.insert(0, os.path.join(ROOT, "tools"))

from metadetect import validate_proposals  # noqa: E402
from proposer import collect_run_record, propose_next_hypotheses  # noqa: E402


def evolve(project_root: str) -> dict:
    """Return the supported next question, plus everything filtered out."""
    record = collect_run_record(project_root)
    derived = propose_next_hypotheses(project_root)
    checked = validate_proposals(derived["proposals"], record["runs"])

    supported = checked["supported"]
    return {
        "next": supported[0] if supported else None,
        "n_runs": record["n_runs"],
        "n_raw": len(derived["proposals"]) + derived["n_resolved"],
        "n_open": len(derived["proposals"]),
        "n_supported": checked["n_supported"],
        "resolved": derived["resolved"],
        "rejected": checked["rejected"],
        "alternatives": supported[1:],
        "detectors": derived["detectors"],
        "checks": checked["checks"],
    }


def _print_human(result: dict, verbose: bool) -> None:
    print(
        f"read {result['n_runs']} runs   "
        f"{result['n_raw']} raw → {result['n_open']} open → "
        f"{result['n_supported']} supported"
    )
    print()

    nxt = result["next"]
    if nxt is None:
        print("NEXT: nothing. No question survives its own evidence check.")
        print()
        print("That is a real answer, not a failure. Either every recorded")
        print("defect has been closed by a later run, or the remaining claims")
        print("rest on runs that never re-measured their subject. Run another")
        print("experiment and the record will say more.")
    else:
        print(f"NEXT  [{nxt['detector']}, priority {nxt['priority']}]")
        print(f"  {nxt['question']}")
        print()
        print(f"  from     {nxt['experiment']}/{nxt['run_id']}")
        print(f"  evidence {json.dumps(nxt['evidence'])}")

    if result["alternatives"]:
        print()
        print(f"also supported ({len(result['alternatives'])}):")
        for alt in result["alternatives"]:
            print(f"  [{alt['priority']}] {alt['question'][:96]}")

    if verbose:
        if result["resolved"]:
            print()
            print(f"suppressed as already resolved ({len(result['resolved'])}):")
            for item in result["resolved"]:
                subject = item["evidence"].get("case") or item["evidence"].get(
                    "cases"
                )
                print(
                    f"  {item['detector']:<24} {str(subject)[:26]:<26} "
                    f"fixed by {item['resolved_by']}"
                )
        if result["rejected"]:
            print()
            print(f"rejected by the evidence check ({len(result['rejected'])}):")
            for item in result["rejected"]:
                print(f"  {item['verdict']:<13} {item['detector']}")
                print(f"      {item['why']}")


def _register(project_root: str, proposal: dict) -> int:
    """Create the experiment for a supported proposal via the CLI."""
    rationale = (
        f"Selected by evolve.py, not by a person. The {proposal['detector']} "
        f"detector raised this from {proposal['experiment']}/"
        f"{proposal['run_id']} on evidence {json.dumps(proposal['evidence'])}, "
        "and it survived the evidence check in metadetect.py while other "
        "candidates were rejected as unsupported or duplicate. "
        "A prediction and a refutation condition must be added here before "
        "the experiment is built: this tool chooses the question, and cannot "
        "yet state what result would refute the answer."
    )
    command = [
        "auto-adk",
        "experiment",
        "new",
        proposal["question"],
        "--rationale",
        rationale,
    ]
    print("registering:", proposal["question"][:88])
    return subprocess.call(command, cwd=project_root)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--path", default=ROOT)
    parser.add_argument("--json", action="store_true", help="machine-readable")
    parser.add_argument("--verbose", action="store_true", help="show rejections")
    parser.add_argument(
        "--register",
        action="store_true",
        help="create the experiment for the chosen question",
    )
    args = parser.parse_args()

    result = evolve(args.path)

    if args.json:
        print(json.dumps(result, indent=2, default=str))
    else:
        _print_human(result, args.verbose)

    if args.register:
        if result["next"] is None:
            print()
            print("nothing to register.")
            return 1
        print()
        return _register(args.path, result["next"])

    # Exit 2 when the record supports no further question, so a runner can
    # branch on it rather than parsing prose.
    return 0 if result["next"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
