import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon, title, description, action,
}: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="bento-card flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="grid place-items-center h-14 w-14 rounded-2xl bg-primary/15 text-primary mb-5">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-6 lg:py-8">{children}</div>;
}
