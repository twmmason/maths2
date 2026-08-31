"""Build the UK Year 6 -> KS3 maths curriculum prerequisite graph."""
from typing import ClassVar
from auto_adk import ScienceAgent, Port, Ports


class BuildCurriculum(ScienceAgent):
    source_kind: ClassVar[str] = "fixed-extraction"
    assumptions: ClassVar[list[str]] = [
        "Topics, strands and prerequisites are extracted from /docs/PLAN.md.",
        "Intrinsic difficulty is a fixed [0,1] estimate per topic.",
    ]
    ports: Ports = Ports(
        inputs=[Port("settings", "json")],
        outputs=[Port("curriculum", "json")],
    )

    async def execute(self):
        cur = await self.call_tool("build_curriculum")
        await self.log(
            f"{cur['n_topics']} topics across {len(cur['strands'])} strands"
        )
        return {"curriculum": cur}
