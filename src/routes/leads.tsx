import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, Download } from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface LeadRow {
  id: string; name: string; source: string; status: string;
  value: number; createdAt: string;
}

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [
    { title: "Leads — Influencer Dashboard" },
    { name: "description", content: "Track generated, qualified and converted leads." },
  ]}),
  component: LeadsPage,
});

function LeadsPage() {
  const { formatCurrency, formatDate, t } = useI18n();

  const columns: DataColumn<LeadRow>[] = [
    { key: "name",      header: "Lead", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "source",    header: "Source", sortable: true },
    { key: "status",    header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
    { key: "value",     header: "Value", sortable: true, align: "right", render: (r) => formatCurrency(r.value) },
    { key: "createdAt", header: "Created", sortable: true, render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <ListPage
      title="Leads"
      subtitle="Every lead you generate — qualified, contacted and converted."
      icon={Users}
      sections={["All", "Generated", "Qualified", "Converted", "History", "Analytics"]}
    >
      <DataTable<LeadRow>
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        searchPlaceholder={t("search", "Search leads…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "new",       label: "New" },
            { value: "qualified", label: "Qualified" },
            { value: "contacted", label: "Contacted" },
            { value: "converted", label: "Converted" },
            { value: "lost",      label: "Lost" },
          ]},
          { key: "source", label: "Source", options: [
            { value: "referral",  label: "Referral" },
            { value: "campaign",  label: "Campaign" },
            { value: "qr",        label: "QR" },
            { value: "shortlink", label: "Short link" },
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
