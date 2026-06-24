import { createFileRoute } from "@tanstack/react-router";
import {
  Megaphone, CheckCircle2, Clock, TrendingUp, Target, Wallet, Plus, Download,
} from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface CampaignRow {
  id: string; name: string; brand: string; status: string;
  reward: number; reach: number; deadline: string;
}

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Influencer Dashboard" },
      { name: "description", content: "Browse, join and manage promotion campaigns." },
      { property: "og:title", content: "Campaigns" },
      { property: "og:description", content: "Browse, join and manage promotion campaigns." },
    ],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const { formatCurrency, formatNumber, formatDate, t } = useI18n();

  const columns: DataColumn<CampaignRow>[] = [
    { key: "name",     header: "Campaign", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "brand",    header: "Brand", sortable: true },
    { key: "status",   header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
    { key: "reward",   header: "Reward", sortable: true, align: "right", render: (r) => formatCurrency(r.reward) },
    { key: "reach",    header: "Reach", sortable: true, align: "right", render: (r) => formatNumber(r.reach) },
    { key: "deadline", header: "Deadline", sortable: true, render: (r) => formatDate(r.deadline) },
  ];

  return (
    <ListPage
      title="Campaigns"
      subtitle="Browse, join and track every promotion campaign from brands you collaborate with."
      icon={Megaphone}
      ctaLabel="Browse Marketplace"
      ctaTo="/products"
      permission="campaigns:view"
      sections={["Available", "Active", "Upcoming", "Completed", "Rules", "Rewards", "Analytics"]}
      kpis={[
        { label: "Active",    icon: CheckCircle2, tint: "text-accent-emerald" },
        { label: "Available", icon: Megaphone, tint: "text-primary-glow" },
        { label: "Upcoming",  icon: Clock, tint: "text-accent-amber" },
        { label: "Reach",     icon: TrendingUp, tint: "text-primary-glow" },
        { label: "Leads",     icon: Target, tint: "text-accent-pink" },
        { label: "Rewards",   icon: Wallet, tint: "text-accent-emerald" },
      ]}
    >
      <DataTable<CampaignRow>
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="campaigns:view"
        searchPlaceholder={t("search", "Search campaigns…")}
        filters={[
          { key: "status",   label: "Status",   options: [
            { value: "available", label: "Available" },
            { value: "active",    label: "Active" },
            { value: "upcoming",  label: "Upcoming" },
            { value: "completed", label: "Completed" },
          ]},
          { key: "category", label: "Category", options: [
            { value: "saas",    label: "SaaS" },
            { value: "d2c",     label: "D2C" },
            { value: "service", label: "Service" },
          ]},
        ]}
        bulkActions={[
          { id: "export", label: t("export", "Export"), permission: "analytics:export", onRun: () => {} },
        ]}
        toolbar={
          <>
            <Button size="sm" variant="outline" className="h-9 gap-1.5"><Download className="h-3.5 w-3.5" /> {t("export", "Export")}</Button>
            <Button size="sm" className="h-9 gap-1.5"><Plus className="h-3.5 w-3.5" /> {t("new", "New")}</Button>
          </>
        }
      />
    </ListPage>
  );
}
