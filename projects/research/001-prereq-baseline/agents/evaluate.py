"""Report cohort mean mastery as the experiment metric."""
from auto_adk import EvaluationAgent, Port, Ports


class EvaluateMastery(EvaluationAgent):
    ports: Ports = Ports(
        inputs=[Port("settings", "json"), Port("result", "json")],
        outputs=[Port("metric", "str"), Port("value", "float"),
                 Port("detail", "json", required=False)],
    )

    async def execute(self):
        s = await self.input("settings")
        result = await self.input("result")
        value = result["mean_mastery_pct"]
        await self.log(
            f"mean_mastery_pct={value:.2f} over {result['cohort_size']} "
            f"learners across {result['n_steps']} lesson steps"
        )
        return self.report(
            metric="mean_mastery_pct", value=value,
            detail={
                "order": s["order"],
                "passes": s["passes"],
                "review_spacing": s["review_spacing"],
                "review_mode": s.get("review_mode", "cyclic"),
                "scaffolding": s["scaffolding"],
                "feedback": s.get("feedback", False),
                "mastered_topic_pct": result["mastered_topic_pct"],
                "n_steps": result["n_steps"],
                "per_topic_mastery": result["per_topic_mastery"],
            },
        )
