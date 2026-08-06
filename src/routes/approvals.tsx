import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [
    { title: "Approvals — Management Dashboard" },
    { name: "description", content: "One queue for every approval request across content, payouts and contracts." },
    { property: "og:title", content: "Approvals — Management Dashboard" },
    { property: "og:description", content: "One queue for every approval request across content, payouts and contracts." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="Approvals"
      subtitle="A single queue for every approval across content, payouts, contracts and access."
      icon={CheckCircle2}
      sections={["Pending", "Awaiting Me", "Approved", "Rejected", "Escalated"]}
    />
  ),
});
