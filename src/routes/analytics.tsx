import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [
    { title: "Analytics — Influencer Dashboard" },
    { name: "description", content: "Growth across followers, reach, views, leads, sales and commission." },
    { property: "og:title", content: "Analytics" },
    { property: "og:description", content: "Growth across followers, reach, views, leads, sales and commission." },
  ]}),
  component: () => <StubPage title="Analytics" subtitle="Growth across every metric that matters to your creator business." icon={BarChart3}
    sections={["Followers", "Reach", "Views", "Clicks", "Leads", "Sales", "Commission", "Top Campaigns", "Top Content", "Top Products"]} />,
});
