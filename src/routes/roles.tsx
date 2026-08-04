import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck, ShieldAlert, Plus, Trash2, RotateCcw, Eye, EyeOff,
  Check, Search, KeyRound, Users2,
} from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { useAuthz } from "@/lib/rbac/AuthzProvider";
import { groups as navGroups, primary as navPrimary } from "@/lib/nav/navigation";
import { permissionForPath } from "@/lib/rbac/module-access";
import type { Permission } from "@/lib/rbac/permissions";
import {
  allRoles, effectiveGrants, isWildcardRole, roleActions, useRoleStore,
  type RoleDef,
} from "@/lib/rbac/role-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Permissions — Software Vala Creator Dashboard" },
      { name: "description", content: "Boss-only console to create roles, edit grants and assign module access across every workspace module." },
      { property: "og:title", content: "Roles & Permissions — Software Vala" },
      { property: "og:description", content: "Create roles, edit grants and assign module access per role." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RolesPage,
});

/** Every module row, grouped exactly as the sidebar presents them. */
function useModuleMatrix() {
  return useMemo(() => {
    const seen = new Set<string>();
    const build = (items: { label: string; to: string }[]) =>
      items
        .map((i) => ({ ...i, permission: permissionForPath(i.to) }))
        .filter((i): i is { label: string; to: string; permission: Permission } => {
          if (!i.permission || i.to === "/roles" || seen.has(i.to)) return false;
          seen.add(i.to);
          return true;
        });
    return [
      { label: "Core", items: build(navPrimary) },
      ...navGroups.map((g) => ({ label: g.label, items: build(g.items) })),
    ].filter((g) => g.items.length > 0);
  }, []);
}

function RolesPage() {
  const { isBoss, simulatedRole } = useAuthz();
  const store = useRoleStore();
  const matrix = useModuleMatrix();
  const roles = allRoles(store);
  const [selectedId, setSelectedId] = useState("manager");
  const [query, setQuery] = useState("");
  const [newRole, setNewRole] = useState({ label: "", description: "" });

  const selected: RoleDef = roles.find((r) => r.id === selectedId) ?? roles[0];
  const wildcard = isWildcardRole(selected.id, store);
  const grantSet = useMemo(
    () => new Set(effectiveGrants(selected.id, store)),
    [selected.id, store],
  );
  const has = (p: Permission) => wildcard || grantSet.has(p);

  const visibleMatrix = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matrix;
    return matrix
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q) || i.permission.includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [matrix, query]);

  const totalModules = matrix.reduce((n, g) => n + g.items.length, 0);
  const enabledModules = wildcard
    ? totalModules
    : matrix.reduce((n, g) => n + g.items.filter((i) => grantSet.has(i.permission)).length, 0);

  if (!isBoss) {
    return (
      <PageShell>
        <div className="bento-card flex flex-col items-center justify-center text-center py-20 px-6">
          <div className="grid place-items-center h-14 w-14 rounded-2xl bg-destructive/15 text-destructive mb-5">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Boss-only module</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Roles &amp; Permissions can only be opened by the workspace owner. Ask your Boss to adjust access for your role.
          </p>
        </div>
      </PageShell>
    );
  }

  const toggleGroup = (perms: Permission[], on: boolean) => {
    const next = new Set(wildcard ? [] : grantSet);
    for (const p of perms) (on ? next.add(p) : next.delete(p));
    roleActions.setGrants(selected.id, Array.from(next) as Permission[]);
  };

  return (
    <PageShell>
      {/* HERO */}
      <section className="hero-surface relative overflow-hidden p-5 sm:p-7 lg:p-9">
        <div className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-medium backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" /> Boss only
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight">
            Roles &amp; Permissions
          </h1>
          <p className="mt-1.5 text-sm sm:text-[15px] text-white/80 max-w-2xl">
            Create roles, edit their grants and assign module access across all {totalModules} workspace modules.
          </p>
          {simulatedRole && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 text-[11px]">
              <Eye className="h-3 w-3" /> Previewing as <b>{simulatedRole}</b>
              <button onClick={() => roleActions.simulate(null)} className="ms-1 underline">Exit preview</button>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* ROLE LIST */}
        <div className="space-y-3">
          <div className="bento-card !p-3">
            <p className="px-1 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Roles</p>
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              {roles.map((r) => {
                const count = isWildcardRole(r.id, store)
                  ? totalModules
                  : matrix.reduce((n, g) => n + g.items.filter((i) => new Set(effectiveGrants(r.id, store)).has(i.permission)).length, 0);
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={cn(
                      "w-full text-start rounded-xl px-3 py-2.5 border transition-colors",
                      r.id === selected.id
                        ? "bg-primary/20 border-primary/40"
                        : "border-transparent hover:bg-muted/60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{r.label}</span>
                      <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground shrink-0">
                        {count}/{totalModules}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{r.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CREATE ROLE */}
          <div className="bento-card !p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Create role</p>
            <input
              value={newRole.label}
              onChange={(e) => setNewRole({ ...newRole, label: e.target.value })}
              placeholder="Role name"
              className="w-full rounded-lg bg-muted/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <input
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="Short description"
              className="w-full rounded-lg bg-muted/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <button
              disabled={!newRole.label.trim()}
              onClick={() => {
                const id = newRole.label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
                if (!id) return;
                roleActions.createRole({ id, label: newRole.label.trim(), description: newRole.description.trim() || "Custom role" });
                setSelectedId(id);
                setNewRole({ label: "", description: "" });
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Add role
            </button>
          </div>
        </div>

        {/* MATRIX */}
        <div className="bento-card !p-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 justify-between border-b border-border p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-primary-glow" />
                <h2 className="text-base font-semibold truncate">{selected.label}</h2>
                {selected.builtin && (
                  <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">Built-in</span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {enabledModules} of {totalModules} modules enabled
                {wildcard && " · full access role"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find module"
                  className="w-44 rounded-lg bg-muted/60 border border-border ps-8 pe-3 py-1.5 text-xs outline-none focus:border-primary/50"
                />
              </div>
              <button
                onClick={() => roleActions.simulate(store.simulate === selected.id ? null : selected.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted/60"
              >
                {store.simulate === selected.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {store.simulate === selected.id ? "Exit preview" : "Preview as role"}
              </button>
              <button
                onClick={() => roleActions.resetRole(selected.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted/60"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              {!selected.builtin && (
                <button
                  onClick={() => { roleActions.deleteRole(selected.id); setSelectedId("manager"); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          </div>

          {!selected.builtin && (
            <div className="grid gap-2 sm:grid-cols-2 border-b border-border p-4">
              <input
                value={selected.label}
                onChange={(e) => roleActions.updateRole(selected.id, { label: e.target.value })}
                className="rounded-lg bg-muted/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
              <input
                value={selected.description}
                onChange={(e) => roleActions.updateRole(selected.id, { description: e.target.value })}
                className="rounded-lg bg-muted/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
            </div>
          )}

          {wildcard && (
            <p className="border-b border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
              This role has full access by default. Toggling any module converts it to an explicit grant list.
            </p>
          )}

          <div className="max-h-[620px] overflow-y-auto divide-y divide-border">
            {visibleMatrix.map((g) => {
              const perms = g.items.map((i) => i.permission);
              const allOn = perms.every(has);
              return (
                <div key={g.label} className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{g.label}</p>
                    <button
                      onClick={() => toggleGroup(perms, !allOn)}
                      className="text-[11px] text-primary-glow hover:underline"
                    >
                      {allOn ? "Disable all" : "Enable all"}
                    </button>
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
                    {g.items.map((i) => {
                      const on = has(i.permission);
                      return (
                        <button
                          key={i.to}
                          onClick={() => {
                            if (wildcard) {
                              const all = matrix.flatMap((x) => x.items.map((y) => y.permission));
                              roleActions.setGrants(selected.id, all.filter((p) => p !== i.permission));
                            } else {
                              roleActions.toggleGrant(selected.id, i.permission, !on);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-start transition-colors",
                            on ? "bg-primary/15 border-primary/35" : "border-border hover:bg-muted/60",
                          )}
                        >
                          <span className={cn(
                            "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                            on ? "bg-primary border-primary text-primary-foreground" : "border-border",
                          )}>
                            {on && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm truncate">{i.label}</span>
                            <span className="block text-[10px] font-mono text-muted-foreground truncate">
                              {i.permission}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="flex items-center justify-center gap-2 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
            <KeyRound className="h-3 w-3" />
            Changes apply instantly to the sidebar and every module guard.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
