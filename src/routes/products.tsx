import { createFileRoute } from "@tanstack/react-router";
import {
  Package, Sparkles, Flame, Star, Rocket, MonitorSmartphone, Bot, Store,
  Link2, QrCode, Share2, Download, PlayCircle,
} from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Influencer Dashboard" },
      { name: "description", content: "Discover products available to promote and earn commission on." },
      { property: "og:title", content: "Products" },
      { property: "og:description", content: "Discover products available to promote and earn commission on." },
    ],
  }),
  component: () => (
    <StubPage
      title="Products"
      subtitle="Every product available to promote — featured, trending, top-sellers and new launches — with one-tap referral links, QR codes and media kits."
      icon={Package}
      ctaLabel="Open Marketplace"
      ctaTo="/products"
      sections={["All", "Featured", "Trending", "Top Selling", "New Launches", "AI Ready", "Offline", "SaaS"]}
      kpis={[
        { label: "Promoting", icon: Package, tint: "text-primary-glow" },
        { label: "Top Seller", icon: Flame, tint: "text-accent-pink" },
        { label: "New Launch", icon: Rocket, tint: "text-accent-amber" },
        { label: "AI Ready", icon: Bot, tint: "text-primary-glow" },
        { label: "Conversion", icon: Sparkles, tint: "text-accent-emerald" },
        { label: "Commission", icon: Star, tint: "text-accent-amber", unit: "USD" },
      ]}
      features={[
        { icon: Star,             title: "Featured Products",       description: "Hand-picked products with the highest payouts and ready-made assets." },
        { icon: Flame,            title: "Trending",                description: "Real-time momentum across the network — sales surge in last 24h." },
        { icon: Package,          title: "Top Selling",             description: "Best converting products for your audience segment and country." },
        { icon: Rocket,           title: "New Launches",            description: "First-mover access to fresh drops before the broader network." },
        { icon: Bot,              title: "AI Ready",                description: "Pre-generated captions, hashtags, reels and scripts for fast publishing." },
        { icon: MonitorSmartphone,title: "SaaS Products",           description: "Subscription products with recurring commission and demo flows." },
        { icon: Store,            title: "Offline Products",        description: "Physical / D2C SKUs with QR-driven attribution and in-store flows." },
        { icon: Link2,            title: "Referral & Short Links",  description: "Branded short links per product with country, device and conversion tracking." },
        { icon: QrCode,           title: "QR Codes",                description: "Print-ready and digital QR for posters, packaging and live events." },
        { icon: Download,         title: "Media Kit Downloads",     description: "Banners, posters, videos, logos and brand guidelines per product." },
        { icon: PlayCircle,       title: "Demo & Video",            description: "Watch the product demo, then publish testimonial reels in minutes." },
        { icon: Share2,           title: "One-Tap Share",           description: "Push to Instagram, WhatsApp, LinkedIn, Telegram and X in one click." },
      ]}
    />
  ),
});
