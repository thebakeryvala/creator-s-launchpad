import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Download } from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface SaleRow {
  id: string; orderId: string; product: string; customer: string;
  status: string; total: number; commission: number; createdAt: string;
}

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [
    { title: "Sales — Influencer Dashboard" },
    { name: "description", content: "Orders, revenue, customers and conversions." },
  ]}),
  component: SalesPage,
});

function SalesPage() {
  const { formatCurrency, formatDate, t } = useI18n();

  const columns: DataColumn<SaleRow>[] = [
    { key: "orderId",    header: "Order", sortable: true, render: (r) => <span className="font-mono text-xs">{r.orderId}</span> },
    { key: "product",    header: "Product", sortable: true },
    { key: "customer",   header: "Customer" },
    { key: "status",     header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
    { key: "total",      header: "Total", sortable: true, align: "right", render: (r) => formatCurrency(r.total) },
    { key: "commission", header: "Commission", sortable: true, align: "right", render: (r) => formatCurrency(r.commission) },
    { key: "createdAt",  header: "Date", sortable: true, render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <ListPage
      title="Sales"
      subtitle="Orders, revenue, customers, conversions and top-selling products."
      icon={ShoppingBag}
      permission="orders:view"
      sections={["Orders", "Revenue", "Customers", "Conversions", "Top Products", "Analytics"]}
    >
      <DataTable<SaleRow>
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="orders:view"
        searchPlaceholder={t("search", "Search orders…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "paid",      label: "Paid" },
            { value: "pending",   label: "Pending" },
            { value: "refunded",  label: "Refunded" },
            { value: "cancelled", label: "Cancelled" },
          ]},
          { key: "channel", label: "Channel", options: [
            { value: "referral", label: "Referral" },
            { value: "campaign", label: "Campaign" },
            { value: "organic",  label: "Organic" },
          ]},
        ]}
        bulkActions={[
          { id: "export", label: t("export", "Export"), permission: "orders:export", onRun: () => {} },
        ]}
        toolbar={
          <Button size="sm" variant="outline" className="h-9 gap-1.5"><Download className="h-3.5 w-3.5" /> {t("export", "Export")}</Button>
        }
      />
    </ListPage>
  );
}
