import { createFileRoute } from "@tanstack/react-router";
import {
  Megaphone, CalendarClock, CheckCircle2, Clock, BookOpen, Gift, BarChart3,
  TrendingUp, Users, Wallet, Target,
} from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Influencer Dashboard" },
      { name: "description", content: "Browse, join and manage promotion campaigns." },
      { property: "og:title", content: "Campaigns" },
      { property: "og:description", content: "Browse, join and manage promotion campaigns." },
    ],
  }),
  component: () => (
    <StubPage
      title="Campaigns"
      subtitle="Browse, join and track every promotion campaign from brands you collaborate with. Track rules, rewards and performance side-by-side."
      icon={Megaphone}
      ctaLabel="Browse Marketplace"
      ctaTo="/products"
      sections={["Available", "Active", "Upcoming", "Completed", "Rules", "Rewards", "Analytics"]}
      kpis={[
        { label: "Active", icon: CheckCircle2, tint: "text-accent-emerald" },
        { label: "Available", icon: Megaphone, tint: "text-primary-glow" },
        { label: "Upcoming", icon: Clock, tint: "text-accent-amber" },
        { label: "Reach", icon: TrendingUp, tint: "text-primary-glow" },
        { label: "Leads", icon: Target, tint: "text-accent-pink" },
        { label: "Rewards", icon: Wallet, tint: "text-accent-emerald", unit: "USD" },
      ]}
      features={[
        { icon: Megaphone,    title: "Available Campaigns",  description: "Open briefs you qualify for, sorted by reward and fit score." },
        { icon: CheckCircle2, title: "Active Campaigns",     description: "In-flight collabs with live progress, deadlines and deliverables." },
        { icon: Clock,        title: "Upcoming",             description: "Scheduled launches you've joined. Get assets ready in advance." },
        { icon: CalendarClock,title: "Completed",            description: "Closed campaigns with final results, payouts and ratings." },
        { icon: BookOpen,     title: "Rules & Briefs",       description: "Brand guidelines, do/don't lists, FTC disclosure and exclusivity." },
        { icon: Gift,         title: "Rewards",              description: "Cash, flat fees, performance bonuses and product gifts per campaign." },
        { icon: BarChart3,    title: "Campaign Analytics",   description: "Reach, clicks, leads, sales and ROI broken down by post and channel." },
        { icon: Users,        title: "Brand Roster",         description: "Brands that invited you, repeat collaborators and partnership history." },
        { icon: Wallet,       title: "Earnings From Campaigns", description: "Per-campaign commission, pending, approved and paid balances." },
      ]}
    />
  ),
});
