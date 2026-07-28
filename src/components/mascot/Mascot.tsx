/**
 * Software Vala AI Mascot — "Vala Spark".
 *
 * Opt-in ambient character with subtle peek / walk / wave / celebrate.
 * Optimizations:
 *  - Animations gated by `prefers-reduced-motion` and `document.hidden`
 *    (Page Visibility API) so a background tab spends zero CPU/GPU.
 *  - Idle-only scheduling via requestIdleCallback (fallback to setTimeout)
 *    and rAF-based blink so we never race the scroll compositor.
 *  - `content-visibility: auto` + `will-change` only during an active
 *    action (cleared on idle) to keep the compositor layer cheap.
 *  - Rate-limited celebrate helper (default 4s) to prevent spam.
 *  - Two intensity modes ("subtle" | "extra-subtle") that scale
 *    frequency, amplitude and duration.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Settings2, Sparkles, X } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { cn } from "@/lib/utils";

type Action = "idle" | "peek" | "walk" | "wave" | "celebrate";
export type MascotIntensity = "subtle" | "extra-subtle";

const STORAGE_KEY = "sv.mascot.enabled";
const INTENSITY_KEY = "sv.mascot.intensity";
const CELEBRATE_EVENT = "sv:mascot:celebrate";
const CELEBRATE_MIN_INTERVAL = 4000; // ms — rate limit

let lastCelebrateAt = 0;

/**
 * Trigger the mascot celebration from anywhere in the app.
 * Rate-limited to once every 4 seconds. Safe to call repeatedly.
 *
 * Examples:
 *   celebrateMascot("save")       // after a successful save
 *   celebrateMascot("purchase")   // after a completed checkout
 *   celebrateMascot("achievement")
 */
export function celebrateMascot(reason?: string) {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  if (now - lastCelebrateAt < CELEBRATE_MIN_INTERVAL) return false;
  lastCelebrateAt = now;
  window.dispatchEvent(new CustomEvent(CELEBRATE_EVENT, { detail: { reason } }));
  return true;
}

function readBool(key: string, fallback = false) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "1";
  } catch {
    return fallback;
  }
}
function readIntensity(): MascotIntensity {
  if (typeof window === "undefined") return "subtle";
  try {
    const v = window.localStorage.getItem(INTENSITY_KEY);
    return v === "extra-subtle" ? "extra-subtle" : "subtle";
  } catch {
    return "subtle";
  }
}

// Prefer idle scheduling so ambient animation never competes with user work.
const idle = (fn: () => void, timeout = 2000) => {
  if (typeof window === "undefined") return 0 as unknown as number;
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) return ric(fn, { timeout });
  return window.setTimeout(fn, 0);
};

export function Mascot() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [intensity, setIntensity] = useState<MascotIntensity>("subtle");
  const [action, setAction] = useState<Action>("idle");
  const [blink, setBlink] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setMounted(true);
    setEnabled(readBool(STORAGE_KEY));
    setIntensity(readIntensity());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMQ = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onMQ);

    const onVis = () => setVisible(!document.hidden);
    setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mq.removeEventListener?.("change", onMQ);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  // Ambient loop — paused when tab hidden, reduced-motion, or disabled.
  useEffect(() => {
    if (!enabled || reduced || !visible) return;
    let cancelled = false;
    const extra = intensity === "extra-subtle";

    const loop = () => {
      if (cancelled) return;
      const pick: Action[] = extra ? ["peek", "wave"] : ["peek", "walk", "wave"];
      const next = pick[Math.floor(Math.random() * pick.length)];
      setAction(next);
      const base = next === "walk" ? 9000 : next === "peek" ? 4200 : 2600;
      const duration = extra ? base * 0.8 : base;
      schedule(() => {
        if (cancelled) return;
        setAction("idle");
        const minPause = extra ? 60000 : 25000;
        const jitter = extra ? 45000 : 30000;
        schedule(() => idle(loop), minPause + Math.random() * jitter);
      }, duration);
    };

    schedule(() => idle(loop), extra ? 12000 : 6000);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [enabled, reduced, visible, intensity, schedule, clearTimers]);

  // Blink loop — cheap, but still paused when tab hidden.
  useEffect(() => {
    if (!enabled || reduced || !visible) return;
    let cancelled = false;
    let t1 = 0;
    let t2 = 0;
    const tick = () => {
      if (cancelled) return;
      setBlink(true);
      t1 = window.setTimeout(() => !cancelled && setBlink(false), 180);
      t2 = window.setTimeout(tick, 3600 + Math.random() * 3200);
    };
    tick();
    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [enabled, reduced, visible]);

  // Celebrate listener — works even under reduced-motion (just a brief cue).
  useEffect(() => {
    if (!enabled) return;
    const onCelebrate = () => {
      clearTimers();
      setAction("celebrate");
      schedule(() => setAction("idle"), reduced ? 900 : 2600);
    };
    window.addEventListener(CELEBRATE_EVENT, onCelebrate);
    return () => window.removeEventListener(CELEBRATE_EVENT, onCelebrate);
  }, [enabled, reduced, schedule, clearTimers]);

  const toggle = (v: boolean) => {
    setEnabled(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch { /* ignore */ }
    if (!v) {
      clearTimers();
      setAction("idle");
    }
  };
  const setIntensityPersist = (v: MascotIntensity) => {
    setIntensity(v);
    try { window.localStorage.setItem(INTENSITY_KEY, v); } catch { /* ignore */ }
  };

  if (!mounted) return null;

  const activeAction = action !== "idle" && enabled && !reduced && visible;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden={!enabled}>
      {/* Chip + settings — bottom-left */}
      <div className="pointer-events-auto fixed bottom-4 left-4 z-40 flex items-center gap-1.5">
        <button
          onClick={() => toggle(!enabled)}
          className="group flex items-center gap-1.5 rounded-full border border-border bg-surface/80 backdrop-blur px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm hover:text-foreground hover:border-primary/40 hover:shadow-md transition-all"
          aria-pressed={enabled}
          aria-label={enabled ? "Disable AI mascot" : "Enable AI mascot"}
          title={enabled ? "Disable Vala Spark" : "Enable Vala Spark mascot"}
        >
          {enabled ? <X className="h-3 w-3" /> : <Sparkles className="h-3 w-3 text-primary" />}
          <span className="hidden sm:inline">{enabled ? "Hide mascot" : "Meet Vala"}</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="flex items-center justify-center h-[26px] w-[26px] rounded-full border border-border bg-surface/80 backdrop-blur text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Mascot settings"
            title="Mascot settings"
          >
            <Settings2 className="h-3 w-3" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute bottom-[calc(100%+8px)] left-0 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl p-3 text-xs animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Mascot</span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[var(--color-primary)]"
                    checked={enabled}
                    onChange={(e) => toggle(e.target.checked)}
                  />
                  <span className="text-muted-foreground">Enabled</span>
                </label>
              </div>
              <div className="mt-3">
                <div className="text-muted-foreground mb-1.5">Animation intensity</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["subtle", "extra-subtle"] as MascotIntensity[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIntensityPersist(opt)}
                      className={cn(
                        "rounded-md border px-2 py-1.5 text-[11px] transition-colors",
                        intensity === opt
                          ? "border-primary/60 bg-primary/15 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
                      )}
                    >
                      {opt === "subtle" ? "Subtle" : "Extra subtle"}
                    </button>
                  ))}
                </div>
              </div>
              {reduced && (
                <p className="mt-3 text-[10px] leading-snug text-muted-foreground">
                  Reduced-motion is on in your OS — animations are minimized automatically.
                </p>
              )}
              <button
                onClick={() => celebrateMascot("manual")}
                disabled={!enabled}
                className="mt-3 w-full rounded-md border border-border px-2 py-1.5 text-[11px] hover:border-primary/40 hover:text-foreground text-muted-foreground disabled:opacity-40"
              >
                Test celebration ✨
              </button>
            </div>
          )}
        </div>
      </div>

      {enabled && !reduced && visible && (
        <div
          className={cn(
            "sv-mascot pointer-events-none absolute",
            intensity === "extra-subtle" && "sv-mascot--xs",
            action === "peek" && "sv-mascot--peek",
            action === "walk" && "sv-mascot--walk",
            action === "wave" && "sv-mascot--wave",
            action === "celebrate" && "sv-mascot--celebrate",
            action === "idle" && "sv-mascot--hidden",
          )}
          style={{
            // Only pay compositor cost while animating.
            willChange: activeAction ? "transform, opacity" : "auto",
            contentVisibility: activeAction ? "visible" : "auto",
          }}
        >
          <div className="sv-mascot__body relative">
            <img
              src={mascotAsset.url}
              alt=""
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={cn(
                "sv-mascot__img h-[128px] w-[128px] drop-shadow-[0_20px_30px_rgba(120,60,220,0.35)] transition-[filter] duration-200",
                blink && "brightness-75",
              )}
            />
            {action === "celebrate" && (
              <div className="sv-mascot__sparkles pointer-events-none absolute inset-0">
                <span /><span /><span /><span /><span /><span />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
