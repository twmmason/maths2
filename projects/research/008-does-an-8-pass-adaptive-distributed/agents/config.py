"""Tutoring-flow strategy and cohort parameters."""
from auto_adk import ScienceAgent, Port, Ports


class FlowConfig(ScienceAgent):
    ports: Ports = Ports(inputs=[], outputs=[Port("settings", "json")])

    async def execute(self):
        s = {
            "order": self.param("order", "prereq"),
            "passes": self.param("passes", 1),
            "review_spacing": self.param("review_spacing", 0),
            "review_mode": self.param("review_mode", "cyclic"),
            "scaffolding": self.param("scaffolding", False),
            "mastery_threshold": self.param("mastery_threshold", 0.8),
            "cohort_size": self.param("cohort_size", 40),
            "seed": self.param("seed", 2026),
        }
        await self.log(
            f"strategy: order={s['order']} passes={s['passes']} "
            f"review_spacing={s['review_spacing']} scaffolding={s['scaffolding']}"
        )
        return {"settings": s}
