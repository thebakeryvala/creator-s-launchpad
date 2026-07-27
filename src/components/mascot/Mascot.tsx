/**
 * Software Vala AI Mascot — "Vala Spark".
 *
 * Optional, opt-in ambient character that performs subtle animations:
 *  - peek: slides in from the top-right, hovers, slides back
 *  - walk: strolls across the bottom of the viewport
 *  - wave: bounces briefly with a small wave overlay
 *  - celebrate: emits sparkles and hops
 *  - blink: periodic soft brightness pulse (eyes are baked into the art)
 *
 * The character sits in a fixed layer, ignores pointer events except on the
 * mascot itself, and never covers UI chrome. Enable / disable via the
 * floating chip or `localStorage.setItem('sv.mascot.enabled','1')`.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import mascotAsset from "@/assets/mascot.png.asset.json";
import { cn } from "@/lib/utils";

type Action = "idle" | "peek" | "walk" | "wave" | "celebrate";

const STORAGE_KEY = "sv.mascot.enabled";

function readEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Fire a global celebrate from anywhere: `window.dispatchEvent(new Event('sv:mascot:celebrate'))` */
export function celebrateMascot() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("sv:mascot:celebrate"));
}

export function Mascot() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [action, setAction] = useState<Action>("idle");
  const [blink, setBlink] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setMounted(true);
    setEnabled(readEnabled());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const schedule = useCallback(
    (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    },
    [],
  );

  // Ambient loop: rotate between peek / walk / wave with long pauses.
  useEffect(() => {
    if (!enabled || reduced) return;
    let cancelled = false;

    const loop = () => {
      if (cancelled) return;
      const pick: Action[] = ["peek", "walk", "wave"];
      const next = pick[Math.floor(Math.random() * pick.length)];
      setAction(next);
      const duration = next === "walk" ? 9000 : next === "peek" ? 4200 : 2600;
      schedule(() => {
        if (cancelled) return;
        setAction("idle");
        // Long idle pause before next appearance (25s – 55s).
        schedule(loop, 25000 + Math.random() * 30000);
      }, duration);
    };

    // First appearance after a short delay.
    schedule(loop, 6000);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [enabled, reduced, schedule]);

  // Blink loop.
  useEffect(() => {
    if (!enabled || reduced) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setBlink(true);
      window.setTimeout(() => !cancelled && setBlink(false), 180);
      window.setTimeout(tick, 3200 + Math.random() * 2400);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [enabled, reduced]);

  // Celebrate event (dispatch from anywhere).
  useEffect(() => {
    if (!enabled) return;
    const onCelebrate = () => {
      clearTimers();
      setAction("celebrate");
      schedule(() => setAction("idle"), 2600);
    };
    window.addEventListener("sv:mascot:celebrate", onCelebrate);
    return () => window.removeEventListener("sv:mascot:celebrate", onCelebrate);
  }, [enabled, schedule]);

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

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden={!enabled}>
      {/* Floating enable / disable chip — bottom-left, tiny */}
      <button
        onClick={() => toggle(!enabled)}
        className="pointer-events-auto fixed bottom-4 left-4 z-40 group flex items-center gap-1.5 rounded-full border border-border bg-surface/80 backdrop-blur px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm hover:text-foreground hover:border-primary/40 hover:shadow-md transition-all"
        aria-pressed={enabled}
        aria-label={enabled ? "Disable AI mascot" : "Enable AI mascot"}
        title={enabled ? "Disable Vala Spark" : "Enable Vala Spark mascot"}
      >
        {enabled ? <X className="h-3 w-3" /> : <Sparkles className="h-3 w-3 text-primary" />}
        <span className="hidden sm:inline">{enabled ? "Hide mascot" : "Meet Vala"}</span>
      </button>

      {enabled && !reduced && (
        <div
          className={cn(
            "sv-mascot pointer-events-none absolute",
            action === "peek" && "sv-mascot--peek",
            action === "walk" && "sv-mascot--walk",
            action === "wave" && "sv-mascot--wave",
            action === "celebrate" && "sv-mascot--celebrate",
            action === "idle" && "sv-mascot--hidden",
          )}
        >
          <div className="sv-mascot__body relative">
            <img
              src={mascotAsset.url}
              alt=""
              width={128}
              height={128}
              loading="lazy"
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
