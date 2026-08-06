import { createFileRoute } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/promise-tracker")({
  head: () => ({ meta: [
    { title: "Promise Tracker — Management Dashboard" },
    { name: "description", content: "Track promises, commitments, deadlines and follow-ups in one place." },
    { property: "og:title", content: "Promise Tracker — Management Dashboard" },
    { property: "og:description", content: "Track promises, commitments, deadlines and follow-ups in one place." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="Promise Tracker"
      subtitle="Track every promise, commitment, deadline and follow-up across the company."
      icon={Handshake}
      sections={["Pending", "Due Soon", "Completed", "Overdue", "Follow-ups"]}
    />
  ),
});
