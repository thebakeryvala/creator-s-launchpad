import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn, type DataQuery } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { readAuditLog, type AuditEntry } from "@/lib/audit/audit";
import { useI18n } from "@/lib/i18n/I18nProvider";


export const Route = createFileRoute("/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — Software Vala" },
      { name: "description", content: "Search and filter bulk actions with timestamps and actor details." },
    ],
  }),
  component: AuditLogPage,
});

function AuditLogPage() {
  const { formatDate, t } = useI18n();
  const [tick, setTick] = useState(0);

  const rows = useMemo<AuditEntry[]>(() => {
    // read on every render tick so the manual refresh + realtime updates pull fresh entries
    void tick;
    return readAuditLog().slice().reverse();
  }, [tick]);

  const actions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.action))).sort(),
    [rows],
  );
  const resources = useMemo(
    () => Array.from(new Set(rows.map((r) => r.resource))).sort(),
    [rows],
  );

  const columns: DataColumn<AuditEntry>[] = [
    {
      key: "ts", header: "Timestamp", sortable: true, alwaysVisible: true,
      render: (r) => <span className="tabular-nums text-xs">{formatDate(r.ts)} · {new Date(r.ts).toLocaleTimeString()}</span>,
      exportValue: (r) => r.ts,
    },
    {
      key: "actorId", header: "Actor", sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.actorId ?? "system"}</span>,
      exportValue: (r) => r.actorId ?? "system",
    },
    {
      key: "action", header: "Action", sortable: true,
      render: (r) => <Badge variant="secondary" className="font-mono text-[11px]">{r.action}</Badge>,
      exportValue: (r) => r.action,
    },
    {
      key: "resource", header: "Resource", sortable: true,
      render: (r) => <span className="text-sm">{r.resource}</span>,
      exportValue: (r) => r.resource,
    },
    {
      key: "count", header: "Records", sortable: true, align: "right",
      render: (r) => r.count ?? "—",
      exportValue: (r) => r.count ?? 0,
    },
    {
      key: "ids", header: "IDs",
      render: (r) => (
        <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[260px] inline-block align-middle">
          {r.ids?.slice(0, 3).join(", ")}{r.ids && r.ids.length > 3 ? ` +${r.ids.length - 3}` : ""}
        </span>
      ),
      exportValue: (r) => r.ids?.join("|") ?? "",
    },
  ];

  return (
    <ListPage
      title="Audit Log"
      subtitle="Every bulk action — approve, archive, assign, status update and export — with actor and timestamp."
      icon={ShieldCheck}
      sections={["All", "Approvals", "Archives", "Assignments", "Status Updates", "Exports"]}
    >
      <DataTable<AuditEntry>
        tableId="audit-log"
        resource="audit-log"
        columns={columns}
        data={rows}
        total={rows.length}
        rowKey={(r) => r.id}
        realtime={{ channel: "audit" }}
        onRefresh={() => setTick((n) => n + 1)}
        searchPlaceholder={t("search", "Search audit log…")}
        emptyTitle="No audit entries yet"
        emptyDescription="Bulk actions and exports are logged here as soon as they run."
        filters={[
          { key: "action",   label: "Action",   options: actions.map((a) => ({ value: a, label: a })) },
          { key: "resource", label: "Resource", options: resources.map((r) => ({ value: r, label: r })) },
        ]}
      />
    </ListPage>
  );
}
