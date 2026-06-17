import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [
    { title: "Leads — Influencer Dashboard" },
    { name: "description", content: "Track generated, qualified and converted leads." },
    { property: "og:title", content: "Leads" },
    { property: "og:description", content: "Track generated, qualified and converted leads." },
  ]}),
  component: () => <StubPage title="Leads" subtitle="Every lead you generate, qualified and converted." icon={Users}
    sections={["All", "Generated", "Qualified", "Converted", "History", "Analytics"]} />,
});
