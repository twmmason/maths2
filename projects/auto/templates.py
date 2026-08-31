#!/usr/bin/env python3
"""Experiment templates: turn a chosen question into a built experiment.

Templates are loaded from tools/templates.py in this project (if it
exports a TEMPLATES dict), then merged with any defined in this file.
Plugin templates take precedence.
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import shutil

AUTO_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AUTO_DIR)

TEMPLATES: dict = {}


def _load_plugin_templates() -> None:
    path = os.path.join(ROOT, "tools", "templates.py")
    if not os.path.exists(path):
        return
    spec = importlib.util.spec_from_file_location("_project_templates", path)
    if spec is None or spec.loader is None:
        return
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    plugin = getattr(mod, "TEMPLATES", None)
    if isinstance(plugin, dict):
        TEMPLATES.update(plugin)


_load_plugin_templates()


def template_for(detector: str) -> dict | None:
    return TEMPLATES.get(detector)


def build_experiment(root, proposal, template, sh):
    """Register experiment, copy workflow + agents. Returns (slug, claim)."""
    prediction = template["predict"](proposal.get("evidence", {}))
    rationale = (
        f"Chosen by the {proposal['detector']} detector from "
        f"{proposal['experiment']}/{proposal['run_id']} on evidence "
        f"{json.dumps(proposal['evidence'])}. "
        f"Template: {template['name']}. {template['summary']} "
        f"PREDICTION: {prediction['claim']} "
        f"{prediction['metric']} {prediction['op']} {prediction['value']}. "
        f"REFUTED IF: {prediction['refuted_if']}"
    )
    code, out = sh(
        ["auto-adk", "experiment", "new", proposal["question"],
         "--rationale", rationale]
    )
    if code != 0:
        return None, ""
    slug = None
    for line in out.splitlines():
        m = re.search(r"research/(\S+)/HYPOTHESIS\.md", line)
        if m:
            slug = m.group(1)
    if slug is None:
        return None, ""
    target = os.path.join(root, "research", slug)
    source = os.path.join(root, "research", template["source"])
    if not os.path.isdir(source):
        return None, ""
    src_wf = os.path.join(source, "workflow.json")
    if os.path.exists(src_wf):
        shutil.copy(src_wf, os.path.join(target, "workflow.json"))
    agents_dir = os.path.join(target, "agents")
    os.makedirs(agents_dir, exist_ok=True)
    src_agents = os.path.join(source, "agents")
    if os.path.isdir(src_agents):
        for entry in os.listdir(src_agents):
            if entry.endswith(".py"):
                shutil.copy(
                    os.path.join(src_agents, entry),
                    os.path.join(agents_dir, entry),
                )
    hyp = os.path.join(target, "HYPOTHESIS.md")
    with open(hyp, "a", encoding="utf-8") as f:
        f.write("\n\n## Registered prediction (machine-checkable)\n\n")
        f.write(f"{prediction['claim']}\n\n")
        f.write("```json\n")
        f.write(json.dumps(prediction, indent=2))
        f.write("\n```\n\n")
        f.write(f"**Refuted if** {prediction['refuted_if']}\n")
    return slug, prediction["claim"]
