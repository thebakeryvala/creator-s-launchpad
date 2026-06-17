import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Bell, Globe, ChevronDown, Sparkles, Bot, LifeBuoy, Settings, User,
  LayoutDashboard, Megaphone, FileVideo, Package, Link2, Users, ShoppingBag,
  Wallet, BarChart3, Trophy, Award, GraduationCap, QrCode, Calendar,
  Inbox, BadgeCheck, IdCard, Image as ImageIcon, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: React.ComponentType<{ className?: string }> };
type NavGroup = { label: string; items: NavItem[] };

const primary: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Campaigns", to: "/campaigns", icon: Megaphone },
  { label: "Content", to: "/content", icon: FileVideo },
  { label: "Products", to: "/products", icon: Package },
];

const groups: NavGroup[] = [
  {
    label: "Earnings",
    items: [
      { label: "Referrals", to: "/referrals", icon: Link2 },
      { label: "Leads", to: "/leads", icon: Users },
      { label: "Sales", to: "/sales", icon: ShoppingBag },
      { label: "Commissions", to: "/commissions", icon: Wallet },
      { label: "Withdrawals", to: "/withdrawals", icon: Wallet },
    ],
  },
  {
    label: "Grow",
    items: [
      { label: "Analytics", to: "/analytics", icon: BarChart3 },
      { label: "Leaderboard", to: "/leaderboard", icon: Trophy },
      { label: "Achievements", to: "/achievements", icon: Award },
      { label: "Academy", to: "/academy", icon: GraduationCap },
    ],
  },
  {
    label: "Creator Tools",
    items: [
      { label: "Media Kit", to: "/media-kit", icon: ImageIcon },
      { label: "Short Links", to: "/short-links", icon: Link2 },
      { label: "QR Center", to: "/qr", icon: QrCode },
      { label: "Calendar", to: "/calendar", icon: Calendar },
      { label: "Inbox", to: "/inbox", icon: Inbox },
      { label: "Social Accounts", to: "/social-accounts", icon: BadgeCheck },
      { label: "Verification", to: "/verification", icon: IdCard },
      { label: "Public Profile", to: "/profile", icon: User },
    ],
  },
  {
    label: "AI",
    items: [
      { label: "AMS", to: "/ams", icon: Sparkles },
      { label: "AI Chat", to: "/ai-chat", icon: Bot },
    ],
  },
];

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            SV
          </span>
          <span className="hidden md:block text-sm font-semibold tracking-tight">Software Vala</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {primary.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.to)
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {item.label}
            </Link>
          ))}

          {groups.map((group) => {
            const open = openGroup === group.label;
            const groupActive = group.items.some((i) => isActive(i.to));
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    groupActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {group.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <div className="absolute top-full left-0 pt-2 min-w-[240px]">
                    <div className="rounded-xl border border-border bg-popover p-2 shadow-2xl">
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive(item.to)
                              ? "bg-primary/15 text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 w-64">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search campaigns, products…"
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground flex-1"
          />
          <kbd className="hidden lg:inline text-[10px] text-muted-foreground border border-border px-1.5 rounded">⌘K</kbd>
        </div>

        {/* Right cluster */}
        <button className="hidden md:flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Globe className="h-3.5 w-3.5" /> EN
        </button>
        <button className="hidden md:flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground">
          USD
        </button>

        <Link to="/support" className="hidden md:grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Support">
          <LifeBuoy className="h-4 w-4" />
        </Link>
        <button className="relative grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-pink" />
        </button>
        <Link to="/settings" className="hidden md:grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Link>

        <Link to="/profile" className="flex items-center gap-2 rounded-full bg-surface border border-border pl-1 pr-3 py-1">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent-pink to-primary" />
          <span className="hidden sm:block text-xs font-medium">Sign in</span>
        </Link>

        <button
          className="lg:hidden grid place-items-center h-9 w-9 rounded-lg border border-border"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-4">
            <div className="grid grid-cols-2 gap-1">
              {primary.map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                    isActive(i.to) ? "bg-primary/15" : "hover:bg-muted/60",
                  )}
                >
                  <i.icon className="h-4 w-4" /> {i.label}
                </Link>
              ))}
            </div>
            {groups.map((g) => (
              <div key={g.label}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">{g.label}</div>
                <div className="grid grid-cols-2 gap-1">
                  {g.items.map((i) => (
                    <Link
                      key={i.to}
                      to={i.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                        isActive(i.to) ? "bg-primary/15" : "hover:bg-muted/60",
                      )}
                    >
                      <i.icon className="h-4 w-4" /> {i.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
