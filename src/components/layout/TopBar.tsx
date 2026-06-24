import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Bell, Globe, ChevronDown, Sparkles, Bot, LifeBuoy, Settings, User,
  LayoutDashboard, Megaphone, FileVideo, Package, Link2, Users, ShoppingBag,
  Wallet, BarChart3, Trophy, Award, GraduationCap, QrCode, Calendar,
  Inbox, BadgeCheck, IdCard, Image as ImageIcon, Menu, X,
  MessagesSquare, BookOpen, Palette, Link as LinkIcon, CalendarClock,
  ImagePlus, LayoutTemplate, Wand2, Activity, ShieldCheck,
  Users2, KeyRound, TrendingUp, Banknote, FileText, UsersRound, Store,
  Download, ClipboardCheck, Handshake, Flame, Eye, Crown, Gauge, Zap,
  Star, Lock, Album, Heart, RefreshCcw, DollarSign, CalendarHeart, FileSignature,
  Contact, Newspaper, Vault, Brain, Building, Building2, Tv, Dna, BookMarked,
  Mic, Map, Briefcase, Gift, Target, CalendarDays, Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, LANGUAGES, CURRENCIES } from "@/lib/i18n/I18nProvider";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { label: string; to: string; icon: React.ComponentType<{ className?: string }> };
type NavGroup = { label: string; items: NavItem[] };

const primary: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Campaigns", to: "/campaigns", icon: Megaphone },
  { label: "Content", to: "/content-center", icon: FileVideo },
  { label: "Products", to: "/products", icon: Package },
  { label: "AI Studio", to: "/ai-studio", icon: Sparkles },
];

const groups: NavGroup[] = [
  {
    label: "Promote",
    items: [
      { label: "Marketplace", to: "/marketplace", icon: Store },
      { label: "Campaigns", to: "/campaigns", icon: Megaphone },
      { label: "Products", to: "/products", icon: Package },
      { label: "Brand Collaboration", to: "/brand-collaboration", icon: Handshake },
      { label: "Sponsorship Center", to: "/sponsorship", icon: Handshake },
      { label: "Collaboration Center", to: "/collaboration", icon: Users },
      { label: "Contract Center", to: "/contracts", icon: FileSignature },
      { label: "Booking Center", to: "/booking", icon: Calendar },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Content Center", to: "/content-center", icon: FileVideo },
      { label: "Content Calendar", to: "/content-calendar", icon: CalendarDays },
      { label: "Content Approval", to: "/content-approval", icon: ClipboardCheck },
      { label: "Content Vault", to: "/content-vault", icon: Vault },
      { label: "Download Center", to: "/download-center", icon: Download },
      { label: "Media Library", to: "/media-library", icon: ImageIcon },
      { label: "Brand Assets", to: "/brand-assets", icon: Palette },
      { label: "Thumbnail Generator", to: "/thumbnail-generator", icon: ImagePlus },
      { label: "Banner Generator", to: "/banner-generator", icon: LayoutTemplate },
      { label: "Media Kit", to: "/media-kit", icon: ImageIcon },
      { label: "Press Kit", to: "/press-kit", icon: Newspaper },
    ],
  },
  {
    label: "Audience",
    items: [
      { label: "Social Accounts", to: "/social-accounts", icon: BadgeCheck },
      { label: "Multi-Channel", to: "/multi-channel", icon: LayoutDashboard },
      { label: "Fan Club", to: "/fan-club", icon: Heart },
      { label: "Subscriptions", to: "/creator-subscriptions", icon: RefreshCcw },
      { label: "Influence Map", to: "/influence-map", icon: Map },
      { label: "Community Mgr (AI)", to: "/ai-community-manager", icon: MessagesSquare },
      { label: "Inbox", to: "/inbox", icon: Inbox },
      { label: "Messages", to: "/messages", icon: MessagesSquare },
    ],
  },
  {
    label: "Referral",
    items: [
      { label: "Referrals", to: "/referrals", icon: Link2 },
      { label: "Short Links", to: "/short-links", icon: Link2 },
      { label: "UTM Builder", to: "/utm-builder", icon: Link2 },
      { label: "QR Center", to: "/qr", icon: QrCode },
      { label: "Link in Bio", to: "/link-in-bio", icon: LinkIcon },
    ],
  },
  {
    label: "Performance",
    items: [
      { label: "Live Performance", to: "/live-performance", icon: Activity },
      { label: "Leads", to: "/leads", icon: Users },
      { label: "Sales", to: "/sales", icon: ShoppingBag },
      { label: "Commissions", to: "/commissions", icon: Wallet },
      { label: "Analytics", to: "/analytics", icon: BarChart3 },
      { label: "Top Content", to: "/top-content", icon: Flame },
      { label: "Competitor Insights", to: "/competitor-insights", icon: Eye },
      { label: "Market Intelligence", to: "/market-intelligence", icon: BarChart3 },
      { label: "Opportunity Engine", to: "/opportunity-engine", icon: Flame },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Creator Banking", to: "/creator-banking", icon: Banknote },
      { label: "Wallet", to: "/wallet", icon: Wallet },
      { label: "Revenue", to: "/revenue", icon: TrendingUp },
      { label: "Payouts", to: "/payouts", icon: Banknote },
      { label: "Withdrawals", to: "/withdrawals", icon: Wallet },
      { label: "Media Value", to: "/media-value", icon: DollarSign },
      { label: "Loyalty", to: "/loyalty", icon: Gift },
    ],
  },
  {
    label: "Rank & Awards",
    items: [
      { label: "Leaderboard", to: "/leaderboard", icon: Trophy },
      { label: "Rank & XP", to: "/rank", icon: TrendingUp },
      { label: "Creator Levels", to: "/creator-levels", icon: TrendingUp },
      { label: "Prestige", to: "/prestige", icon: Award },
      { label: "Achievements", to: "/achievements", icon: Award },
      { label: "Badges", to: "/achievements", icon: BadgeCheck },
      { label: "Trophy Room", to: "/trophy-room", icon: Trophy },
      { label: "Hall of Fame", to: "/hall-of-fame", icon: Crown },
      { label: "Award Ceremony", to: "/award-ceremony", icon: Trophy },
      { label: "Record Book", to: "/record-book", icon: BookOpen },
      { label: "Founder Spotlight", to: "/founder-spotlight", icon: Star },
      { label: "Secret Achievements", to: "/secret-achievements", icon: Lock },
      { label: "Challenges", to: "/challenges", icon: Target },
      { label: "Streaks", to: "/streaks", icon: Flame },
      { label: "Memory Capsule", to: "/memory-capsule", icon: Album },
    ],
  },
  {
    label: "Brand",
    items: [
      { label: "Personal Brand", to: "/personal-brand", icon: Sparkles },
      { label: "Social Score", to: "/social-score", icon: Gauge },
      { label: "Power Score", to: "/power-score", icon: Zap },
      { label: "Creator Economy Score", to: "/creator-economy-score", icon: Gauge },
      { label: "Brand Safety", to: "/brand-safety", icon: ShieldCheck },
      { label: "Reputation Engine", to: "/reputation", icon: Star },
      { label: "Creator DNA", to: "/creator-dna", icon: Dna },
      { label: "Public Profile", to: "/profile", icon: User },
      { label: "Creator Passport", to: "/creator-passport", icon: IdCard },
      { label: "Influencer Store", to: "/influencer-store", icon: Store },
      { label: "Website Builder", to: "/website-builder", icon: Globe },
      { label: "Verification", to: "/verification", icon: IdCard },
    ],
  },
  {
    label: "AI",
    items: [
      { label: "AI Studio", to: "/ai-studio", icon: Sparkles },
      { label: "AI Chat", to: "/ai-chat", icon: Bot },
      { label: "AMS", to: "/ams", icon: Sparkles },
      { label: "AI Toolkit", to: "/ai-tools", icon: Wand2 },
      { label: "Digital Twin", to: "/digital-twin", icon: Bot },
      { label: "AI Social Manager", to: "/ai-social-manager", icon: Sparkles },
      { label: "AI Community Manager", to: "/ai-community-manager", icon: MessagesSquare },
      { label: "AI Sales Agent", to: "/ai-sales-agent", icon: Bot },
      { label: "AI Brand Negotiator", to: "/ai-brand-negotiator", icon: Handshake },
      { label: "AI Avatar", to: "/ai-avatar", icon: Bot },
      { label: "AI Content Factory", to: "/ai-content-factory", icon: Sparkles },
      { label: "AI Video Factory", to: "/ai-video-factory", icon: FileVideo },
      { label: "AI Podcast Factory", to: "/ai-podcast-factory", icon: Mic },
      { label: "AI Newsroom", to: "/ai-newsroom", icon: Newspaper },
      { label: "Brand Matching AI", to: "/brand-matching", icon: Sparkles },
      { label: "Creator Intelligence", to: "/creator-intelligence", icon: Brain },
      { label: "Enterprise Chat", to: "/enterprise-chat", icon: MessagesSquare },
      { label: "Knowledge Base", to: "/knowledge-base", icon: BookOpen },
    ],
  },
  {
    label: "Learn & Events",
    items: [
      { label: "Academy", to: "/academy", icon: GraduationCap },
      { label: "Creator University", to: "/creator-university", icon: GraduationCap },
      { label: "Knowledge Vault", to: "/knowledge-vault", icon: BookOpen },
      { label: "Success Playbook", to: "/success-playbook", icon: BookMarked },
      { label: "Events", to: "/events", icon: CalendarHeart },
      { label: "Creator TV", to: "/creator-tv", icon: Tv },
      { label: "Calendar", to: "/calendar", icon: Calendar },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Command Center", to: "/command-center", icon: LayoutDashboard },
      { label: "CEO Dashboard", to: "/ceo-dashboard", icon: Briefcase },
      { label: "CFO Dashboard", to: "/cfo-dashboard", icon: Banknote },
      { label: "Growth Dashboard", to: "/growth-dashboard", icon: TrendingUp },
      { label: "Creator ERP", to: "/creator-erp", icon: Briefcase },
      { label: "Creator CRM", to: "/creator-crm", icon: Contact },
      { label: "Creator Marketplace", to: "/creator-marketplace", icon: ShoppingBag },
      { label: "Creator App Store", to: "/creator-app-store", icon: Store },
      { label: "Company Mode", to: "/company-mode", icon: Building },
      { label: "Agency Mode", to: "/agency-mode", icon: Building2 },
      { label: "White Label", to: "/white-label", icon: Palette },
      { label: "Employees", to: "/employees", icon: Users2 },
      { label: "Team", to: "/team", icon: UsersRound },
      { label: "Assets Vault", to: "/assets-vault", icon: Vault },
      { label: "Documentation", to: "/documentation", icon: FileText },
      { label: "API Center", to: "/api-center", icon: Code2 },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Orders", to: "/orders", icon: ShoppingBag },
      { label: "Customers", to: "/customers", icon: Users2 },
      { label: "Reviews", to: "/reviews", icon: Star },
      { label: "Licenses", to: "/licenses", icon: KeyRound },
      { label: "Subscriptions", to: "/subscriptions", icon: RefreshCcw },
      { label: "Coupons", to: "/coupons", icon: Gift },
      { label: "Promotions", to: "/promotions", icon: Flame },
      { label: "Drafts", to: "/drafts", icon: FileText },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Activity", to: "/activity", icon: Activity },
      { label: "Notifications", to: "/notifications", icon: Bell },
      { label: "Security", to: "/security", icon: ShieldCheck },
      { label: "Settings", to: "/settings", icon: Settings },
      { label: "Support", to: "/support", icon: LifeBuoy },
    ],
  },
];

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, currency, setLanguage, setCurrency, t } = useI18n();

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            SV
          </span>
          <span className="hidden md:block text-sm font-semibold tracking-tight">Software Vala</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5 ml-2 min-w-0">
          {primary.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-2.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                isActive(item.to)
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {item.label}
            </Link>
          ))}

          {groups.map((group, gi) => {
            const open = openGroup === group.label;
            const groupActive = group.items.some((i) => isActive(i.to));
            const alignRight = gi >= groups.length - 3;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    groupActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {group.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <div
                    className={cn(
                      "absolute top-full pt-2 w-[280px] max-w-[calc(100vw-2rem)]",
                      alignRight ? "right-0" : "left-0",
                    )}
                  >
                    <div className="rounded-xl border border-border bg-popover p-2 shadow-2xl max-h-[70vh] overflow-y-auto">
                      {group.items.map((item) => (
                        <Link
                          key={item.to + item.label}
                          to={item.to}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive(item.to)
                              ? "bg-primary/15 text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
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

        <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 w-44 lg:w-56 2xl:w-72">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            placeholder="Search…"
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground flex-1 min-w-0"
          />
          <kbd className="hidden 2xl:inline text-[10px] text-muted-foreground border border-border px-1.5 rounded">⌘K</kbd>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 w-44 lg:w-56 2xl:w-72">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            placeholder={t("search", "Search…")}
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground flex-1 min-w-0"
          />
          <kbd className="hidden 2xl:inline text-[10px] text-muted-foreground border border-border px-1.5 rounded">⌘K</kbd>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden lg:flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground" aria-label={t("language", "Language")}>
              <Globe className="h-3.5 w-3.5" /> {language.code.toUpperCase()}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel>{t("language", "Language")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGUAGES.map((l) => (
              <DropdownMenuItem
                key={l.code}
                onSelect={() => setLanguage(l.code)}
                className={cn("justify-between gap-2", language.code === l.code && "bg-primary/10 text-foreground")}
              >
                <span className="truncate">{l.native}</span>
                <span className="text-[10px] uppercase text-muted-foreground">{l.code}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden lg:flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground" aria-label={t("currency", "Currency")}>
              <span className="font-semibold">{currency.symbol}</span> {currency.code}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel>{t("currency", "Currency")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CURRENCIES.map((c) => (
              <DropdownMenuItem
                key={c.code}
                onSelect={() => setCurrency(c.code)}
                className={cn("justify-between gap-2", currency.code === c.code && "bg-primary/10 text-foreground")}
              >
                <span className="truncate">{c.label}</span>
                <span className="text-[10px] font-semibold">{c.symbol} {c.code}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/support" className="hidden lg:grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Support">
          <LifeBuoy className="h-4 w-4" />
        </Link>
        <Link to="/notifications" className="relative grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-pink" />
        </Link>
        <Link to="/settings" className="hidden lg:grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Link>

        <Link to="/profile" className="flex items-center gap-2 rounded-full bg-surface border border-border pl-1 pr-3 py-1 shrink-0">
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent-pink to-primary" />
          <span className="hidden sm:block text-xs font-medium">Sign in</span>
        </Link>

        <button
          className="xl:hidden grid place-items-center h-9 w-9 rounded-lg border border-border shrink-0"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
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
                      key={i.to + i.label}
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
