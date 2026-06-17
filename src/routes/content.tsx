import { createFileRoute } from "@tanstack/react-router";
import { FileVideo } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/content")({
  head: () => ({ meta: [
    { title: "Content Center — Influencer Dashboard" },
    { name: "description", content: "Ready-made posts, reels, scripts, captions and hashtags." },
    { property: "og:title", content: "Content Center" },
    { property: "og:description", content: "Ready-made posts, reels, scripts, captions and hashtags." },
  ]}),
  component: () => <StubPage title="Content Center" subtitle="Ready-made content for every channel — posts, reels, scripts, captions, hashtags and CTAs." icon={FileVideo}
    sections={["Ready Made", "Instagram", "Facebook", "LinkedIn", "WhatsApp", "Telegram", "YouTube", "Shorts", "Reels", "TikTok", "Captions", "Hashtags", "CTAs"]} />,
});
