import { createFileRoute } from "@tanstack/react-router";
import { Video } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/meet-vala")({
  head: () => ({ meta: [
    { title: "Meet Vala — Management Dashboard" },
    { name: "description", content: "Instant meetings, standups and recorded sessions for the whole team." },
    { property: "og:title", content: "Meet Vala — Management Dashboard" },
    { property: "og:description", content: "Instant meetings, standups and recorded sessions for the whole team." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: () => (
    <StubPage
      title="Meet Vala"
      subtitle="Instant meetings, standups, recordings and shared notes for the whole team."
      icon={Video}
      sections={["Upcoming", "Instant Meeting", "Recordings", "Notes"]}
    />
  ),
});
