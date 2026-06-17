import type { LucideIcon } from "lucide-react";
import { PageShell, PageHeader, EmptyState } from "@/components/layout/PageShell";

export function StubPage({
  title, subtitle, icon, sections, emptyTitle, emptyDescription,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  sections?: string[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <PageShell>
      <PageHeader title={title} subtitle={subtitle} />
      {sections && sections.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {sections.map((s, i) => (
            <button
              key={s}
              className={
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
                (i === 0
                  ? "bg-primary/15 border-primary/30 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/60")
              }
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <EmptyState
        icon={icon}
        title={emptyTitle ?? `${title} — connect data`}
        description={emptyDescription ?? "This module is wired and ready. Connect your Software Vala login to populate live data — no mock data is shown."}
      />
    </PageShell>
  );
}
