import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/campaigns")({
  head: () => ({ meta: [
    { title: "Campaigns — Influencer Dashboard" },
    { name: "description", content: "Browse, join and manage promotion campaigns." },
    { property: "og:title", content: "Campaigns" },
    { property: "og:description", content: "Browse, join and manage promotion campaigns." },
  ]}),
  component: () => <StubPage title="Campaigns" subtitle="Browse, join and track your promotion campaigns." icon={Megaphone}
    sections={["Available", "Active", "Upcoming", "Completed", "Rules", "Rewards", "Analytics"]} />,
});
