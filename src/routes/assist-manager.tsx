import { createFileRoute } from "@tanstack/react-router";
import { MonitorSmartphone } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/assist-manager")({
  head: () => ({ meta: [
    { title: "Assist Manager — Management Dashboard" },
    { name: "description", content: "Remote assistance, screen support, live collaboration and troubleshooting." },
    { property: "og:title", content: "Assist Manager — Management Dashboard" },
    { property: "og:description", content: "Remote assistance, screen support, live collaboration and troubleshooting." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="Assist Manager"
      subtitle="Remote assistance, screen support, live collaboration and troubleshooting."
      icon={MonitorSmartphone}
      sections={["Live Sessions", "Screen Support", "Collaboration", "Troubleshooting", "Session History"]}
    />
  ),
});
