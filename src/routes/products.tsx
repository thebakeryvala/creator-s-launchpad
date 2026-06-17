import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [
    { title: "Products — Influencer Dashboard" },
    { name: "description", content: "Products available to promote and earn commission." },
    { property: "og:title", content: "Products" },
    { property: "og:description", content: "Products available to promote and earn commission." },
  ]}),
  component: () => <StubPage title="Products" subtitle="Discover featured, trending and top-selling products to promote." icon={Package}
    sections={["All", "Featured", "Trending", "Top Selling", "New Launches", "AI Ready", "Offline", "SaaS"]}
    emptyDescription="Products are sourced from the connected Marketplace. Connect your Software Vala login to load the live catalog." />,
});
