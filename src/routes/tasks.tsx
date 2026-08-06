import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [
    { title: "Tasks — Management Dashboard" },
    { name: "description", content: "Assign, track and close tasks across every management module." },
    { property: "og:title", content: "Tasks — Management Dashboard" },
    { property: "og:description", content: "Assign, track and close tasks across every management module." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="Tasks"
      subtitle="Assign, track and close tasks across every management module."
      icon={ClipboardList}
      sections={["All", "My Tasks", "Assigned", "Due Today", "Overdue", "Completed"]}
    />
  ),
});
