import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search, ClipboardList, CheckCircle2, Bell, MessageSquare, Brain,
  MonitorSmartphone, Handshake, Calendar, Globe, Settings, Plus, Menu,
  Crown, User, LayoutDashboard, ShieldCheck, KeyRound,
  ListPlus, Ticket, AlarmClock, Megaphone, Users, MoreHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, LANGUAGES } from "@/lib/i18n/I18nProvider";
import { useHeaderBadges, formatBadge } from "@/lib/notifications/useHeaderBadges";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Shared premium 3D-style icon button surface. */
const ICON_BTN =
  "icon3d relative grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground " +
  "transition-[transform,box-shadow,color,background-color] duration-200 " +
  "hover:text-foreground active:scale-[0.96] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background";

/** Count pill / dot rendered on top of a header icon. */
function CountBadge({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -top-1 -right-1 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background"
    >
      {formatBadge(count)}
      <span className="sr-only">{label}</span>
    </span>
  );
}

function IconAction({
  icon: Icon, label, to, count = 0,
  className,
}: { icon: LucideIcon; label: string; to: string; count?: number; className?: string }) {
  const accessibleName = count > 0 ? `${label} (${count} ${count === 1 ? "item" : "items"})` : label;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to} aria-label={accessibleName} className={cn(ICON_BTN, className)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          <CountBadge count={count} label={accessibleName} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom">{accessibleName}</TooltipContent>
    </Tooltip>
  );
}

const QUICK_ACTIONS: { label: string; icon: LucideIcon; to: string }[] = [
  { label: "New Task", icon: ListPlus, to: "/tasks" },
  { label: "New Ticket", icon: Ticket, to: "/support" },
  { label: "New Reminder", icon: AlarmClock, to: "/calendar" },
  { label: "New Announcement", icon: Megaphone, to: "/notifications" },
  { label: "New Internal Chat", icon: Users, to: "/internal-chat" },
];

/** Actions that collapse into the "More" dropdown on narrow screens. */
const OVERFLOW_ACTIONS: { label: string; icon: LucideIcon; to: string }[] = [
  { label: "AIRA CEO", icon: Brain, to: "/aira-ceo" },
  { label: "Assist Manager", icon: MonitorSmartphone, to: "/assist-manager" },
  { label: "Promise Tracker", icon: Handshake, to: "/promise-tracker" },
  { label: "Calendar", icon: Calendar, to: "/calendar" },
  { label: "Settings", icon: Settings, to: "/settings" },
];


export function TopBar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const { language, setLanguage, t } = useI18n();
  const navigate = useNavigate();
  const badges = useHeaderBadges();


  return (
    <TooltipProvider delayDuration={120}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-1.5 px-3 lg:px-5">
          <button
            className={cn(ICON_BTN, "lg:hidden")}
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>

          <Link to="/" className="lg:hidden mr-1 flex items-center gap-2 shrink-0" aria-label="Home">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground text-[11px] font-bold">
              SV
            </span>
          </Link>

          <div className="flex-1" />

          <nav className="flex items-center gap-1" aria-label="Global actions">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={ICON_BTN}
                  aria-label={t("search", "Global Search")}
                  onClick={() => navigate({ to: "/marketplace" })}
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Global Search</TooltipContent>
            </Tooltip>

            <IconAction icon={ClipboardList} label="Tasks" to="/tasks" />
            <IconAction icon={CheckCircle2} label="Approvals" to="/approvals" />
            <IconAction icon={Bell} label="Notifications" to="/notifications" dot />
            <IconAction icon={MessageSquare} label="Internal Chat" to="/internal-chat" />
            <IconAction icon={Brain} label="AIRA CEO" to="/aira-ceo" />
            <IconAction icon={MonitorSmartphone} label="Assist Manager" to="/assist-manager" />
            <IconAction icon={Handshake} label="Promise Tracker" to="/promise-tracker" />
            <IconAction icon={Calendar} label="Calendar" to="/calendar" />

            {/* Language */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className={ICON_BTN} aria-label={t("language", "Language")}>
                      <Globe className="h-[18px] w-[18px]" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Language · {language.code.toUpperCase()}</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto">
                <DropdownMenuLabel>{t("language", "Language")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onSelect={() => setLanguage(l.code)}
                    className={cn("justify-between gap-2", language.code === l.code && "bg-primary/12 text-foreground")}
                  >
                    <span className="truncate">{l.native}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">{l.code}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <IconAction icon={Settings} label="Settings" to="/settings" />

            {/* Quick Actions */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(ICON_BTN, "icon3d--accent text-primary-foreground")} aria-label="Quick Actions">
                      <Plus className="h-[18px] w-[18px]" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Quick Actions</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {QUICK_ACTIONS.map((a) => (
                  <DropdownMenuItem key={a.label} asChild>
                    <Link to={a.to} className="cursor-pointer">
                      <a.icon className="h-4 w-4 mr-2" /> {a.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="ml-0.5 relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground text-[11px] font-bold transition-transform duration-200 active:scale-[0.96] ring-1 ring-white/15" aria-label="Profile">
                      BV
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-emerald ring-2 ring-background" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Profile · Boss Vala</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-60 p-0 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                      BV
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">Boss Vala</div>
                      <div className="text-[11px] text-muted-foreground truncate">boss@softwarevala.com</div>
                    </div>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-primary/15 text-primary text-[10px] font-semibold px-1.5 py-0.5">
                    <Crown className="h-2.5 w-2.5" /> Founder
                  </span>
                </div>
                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer"><User className="h-4 w-4 mr-2" /> Public Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/command-center" className="cursor-pointer"><LayoutDashboard className="h-4 w-4 mr-2" /> Boss Panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/security" className="cursor-pointer"><ShieldCheck className="h-4 w-4 mr-2" /> Security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                    <KeyRound className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
    </TooltipProvider>
  );
}
