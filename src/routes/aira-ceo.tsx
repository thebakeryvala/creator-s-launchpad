import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/aira-ceo")({
  head: () => ({ meta: [
    { title: "AIRA CEO — Management Dashboard" },
    { name: "description", content: "Your AI chief of staff for decisions, briefings and executive follow-ups." },
    { property: "og:title", content: "AIRA CEO — Management Dashboard" },
    { property: "og:description", content: "Your AI chief of staff for decisions, briefings and executive follow-ups." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="AIRA CEO"
      subtitle="AI chief of staff — daily briefings, decision support and executive follow-ups."
      icon={Brain}
      sections={["Briefing", "Decisions", "Risks", "Follow-ups", "Reports"]}
    />
  ),
});
