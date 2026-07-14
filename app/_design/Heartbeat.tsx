"use client";

// profile-experience-fixes — presence ping. Mounted once in the authenticated shell; touches
// User.lastSeenAt via the `heartbeat` server action on mount and every ~60s so getProfile can derive a
// real online indicator (online = showOnlineStatus && lastSeenAt within ONLINE_WINDOW). Renders nothing.
// Best-effort: the action swallows its own errors; we also ignore the promise here.

import { useEffect } from "react";
import { heartbeat } from "@/app/actions/presence";

const HEARTBEAT_INTERVAL_MS = 60_000;

export function Heartbeat() {
  useEffect(() => {
    const ping = () => {
      // Skip while the tab is hidden — no need to mark a backgrounded tab as active.
      if (typeof document !== "undefined" && document.hidden) return;
      void heartbeat();
    };
    ping(); // initial mark on mount
    const id = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
