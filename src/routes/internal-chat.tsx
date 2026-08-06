import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/internal-chat")({
  head: () => ({ meta: [
    { title: "Internal Chat — Management Dashboard" },
    { name: "description", content: "Private team channels, direct messages and module-linked threads." },
    { property: "og:title", content: "Internal Chat — Management Dashboard" },
    { property: "og:description", content: "Private team channels, direct messages and module-linked threads." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="Internal Chat"
      subtitle="Private team channels, direct messages and module-linked threads."
      icon={MessageSquare}
      sections={["Channels", "Direct Messages", "Threads", "Mentions", "Archived"]}
    />
  ),
});
