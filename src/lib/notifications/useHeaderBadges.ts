/**
 * Header badge counts (unread notifications, pending approvals, open tasks,
 * unread chat). Backed by a tiny in-memory store that any module can update
 * with `setHeaderBadges(...)`; changes broadcast over the realtime bus so
 * every open tab stays in sync.
 */
import { useEffect, useState } from "react";
import { emitRealtime, useRealtime } from "@/lib/realtime/useRealtime";

export interface HeaderBadges {
  tasks: number;
  approvals: number;
  notifications: number;
  chat: number;
}

const EMPTY: HeaderBadges = { tasks: 0, approvals: 0, notifications: 0, chat: 0 };

let store: HeaderBadges = { ...EMPTY };
const listeners = new Set<() => void>();

export const HEADER_BADGE_CHANNEL = "header-badges";

export function getHeaderBadges(): HeaderBadges {
  return store;
}

export function setHeaderBadges(next: Partial<HeaderBadges>) {
  store = { ...store, ...next };
  listeners.forEach((l) => {
    try { l(); } catch { /* ignore */ }
  });
  emitRealtime(HEADER_BADGE_CHANNEL);
}

export function useHeaderBadges(): HeaderBadges {
  const [badges, setBadges] = useState<HeaderBadges>(EMPTY);

  useEffect(() => {
    const sync = () => setBadges(store);
    listeners.add(sync);
    sync();
    return () => { listeners.delete(sync); };
  }, []);

  useRealtime(HEADER_BADGE_CHANNEL, () => setBadges(store));

  return badges;
}

/** Formats a count for a compact badge pill (99+ cap). */
export function formatBadge(count: number): string {
  return count > 99 ? "99+" : String(count);
}
