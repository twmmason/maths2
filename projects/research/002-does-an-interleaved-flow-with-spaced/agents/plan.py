"""Plan the tutoring flow from the curriculum and chosen strategy."""
from typing import ClassVar
from auto_adk import ScienceAgent, Port, Ports


class PlanFlow(ScienceAgent):
    assumptions: ClassVar[list[str]] = [
        "Ordering always respects prerequisites regardless of strategy.",
        "Scaffolding adds guided practice to topics at/above difficulty 0.55.",
    ]
    ports: Ports = Ports(
        inputs=[Port("settings", "json"), Port("curriculum", "json")],
        outputs=[Port("flow", "json")],
    )

    async def execute(self):
        s = await self.input("settings")
        cur = await self.input("curriculum")
        flow = await self.call_tool(
            "plan_lessons",
            topics=cur["topics"],
            order=s["order"],
            passes=s["passes"],
            review_spacing=s["review_spacing"],
            scaffolding=s["scaffolding"],
        )
        await self.log(
            f"planned {flow['n_steps']} steps "
            f"({flow['n_teach']} teach, {flow['n_review']} review)"
        )
        return {"flow": flow}
