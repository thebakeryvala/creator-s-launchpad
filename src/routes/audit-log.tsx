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
  const [query, setQuery] = useState<DataQuery | null>(null);

  const all = useMemo<AuditEntry[]>(() => {
    void tick;
    return readAuditLog().slice().reverse();
  }, [tick]);

  const actions = useMemo(() => Array.from(new Set(all.map((r) => r.action))).sort(), [all]);
  const resources = useMemo(() => Array.from(new Set(all.map((r) => r.resource))).sort(), [all]);

  const filtered = useMemo(() => {
    if (!query) return all;
    const q = query.search.trim().toLowerCase();
    let out = all.filter((r) => {
      if (query.filters.action && r.action !== query.filters.action) return false;
      if (query.filters.resource && r.resource !== query.filters.resource) return false;
      if (!q) return true;
      return (
        r.action.toLowerCase().includes(q) ||
        r.resource.toLowerCase().includes(q) ||
        (r.actorId ?? "").toLowerCase().includes(q) ||
        (r.ids?.join(",") ?? "").toLowerCase().includes(q)
      );
    });
    if (query.sort) {
      const { key, dir } = query.sort;
      const sign = dir === "asc" ? 1 : -1;
      out = [...out].sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[key];
        const bv = (b as unknown as Record<string, unknown>)[key];
        if (av == null) return 1;
        if (bv == null) return -1;
        return av > bv ? sign : av < bv ? -sign : 0;
      });
    }
    return out;
  }, [all, query]);

  const pageSize = query?.pageSize ?? 25;
  const page = query?.page ?? 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);


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
        data={paged}
        total={filtered.length}
        rowKey={(r) => r.id}
        realtime={{ channel: "audit" }}
        onQueryChange={setQuery}
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
