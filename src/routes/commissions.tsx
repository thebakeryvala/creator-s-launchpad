import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Download } from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface CommissionRow {
  id: string; orderId: string; product: string; status: string;
  amount: number; bonus: number; createdAt: string;
}

export const Route = createFileRoute("/commissions")({
  head: () => ({ meta: [
    { title: "Commissions — Influencer Dashboard" },
    { name: "description", content: "Pending, approved, paid and bonus commission." },
  ]}),
  component: CommissionsPage,
});

function CommissionsPage() {
  const { formatCurrency, formatDate, t } = useI18n();

  const columns: DataColumn<CommissionRow>[] = [
    { key: "orderId",   header: "Order", sortable: true, render: (r) => <span className="font-mono text-xs">{r.orderId}</span> },
    { key: "product",   header: "Product", sortable: true },
    { key: "status",    header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
    { key: "amount",    header: "Commission", sortable: true, align: "right", render: (r) => formatCurrency(r.amount) },
    { key: "bonus",     header: "Bonus", sortable: true, align: "right", render: (r) => formatCurrency(r.bonus) },
    { key: "createdAt", header: "Date", sortable: true, render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <ListPage
      title="Commissions"
      subtitle="Track everything you have earned — pending, approved, paid and bonus."
      icon={Wallet}
      permission="commissions:view"
      sections={["Pending", "Approved", "Paid", "Bonus", "History", "Payout Requests", "Wallet"]}
    >
      <DataTable<CommissionRow>
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="commissions:view"
        searchPlaceholder={t("search", "Search commissions…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "pending",  label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "paid",     label: "Paid" },
            { value: "reversed", label: "Reversed" },
          ]},
          { key: "type", label: "Type", options: [
            { value: "sale",    label: "Sale" },
            { value: "bonus",   label: "Bonus" },
            { value: "tier",    label: "Tier" },
          ]},
        ]}
        bulkActions={[
          { id: "export", label: t("export", "Export"), permission: "analytics:export", onRun: () => {} },
        ]}
        toolbar={
          <Button size="sm" variant="outline" className="h-9 gap-1.5"><Download className="h-3.5 w-3.5" /> {t("export", "Export")}</Button>
        }
      />
    </ListPage>
  );
}
