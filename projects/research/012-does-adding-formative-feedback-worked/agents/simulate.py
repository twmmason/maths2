"""Run a simulated learner cohort through the tutoring flow."""
from typing import ClassVar
from auto_adk import ScienceAgent, Port, Ports


class SimulateCohort(ScienceAgent):
    assumptions: ClassVar[list[str]] = [
        "Learners follow a BKT-style update; prereq gaps slow learning.",
        "Unrevisited topics decay, so review and interleaving aid retention.",
    ]
    ports: Ports = Ports(
        inputs=[Port("settings", "json"), Port("curriculum", "json"),
                Port("flow", "json")],
        outputs=[Port("result", "json")],
    )

    async def execute(self):
        s = await self.input("settings")
        cur = await self.input("curriculum")
        flow = await self.input("flow")
        result = await self.call_tool(
            "simulate_cohort",
            topics=cur["topics"],
            steps=flow["steps"],
            mastery_threshold=s["mastery_threshold"],
            cohort_size=s["cohort_size"],
            seed=s["seed"],
        )
        await self.log(
            f"mean mastery {result['mean_mastery_pct']:.1f}% "
            f"({result['mastered_topic_pct']:.1f}% of topics mastered)"
        )
        return {"result": result}
