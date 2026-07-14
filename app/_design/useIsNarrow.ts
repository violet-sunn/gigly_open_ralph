"use client";

// Shared narrow-viewport hook for the targeted phone-width responsive pass (responsive-my-gigs / Гигли баги #5).
// Backed by matchMedia at the single 1024px breakpoint. Returns `false` until mounted so SSR + first client render
// use the DESKTOP branch — no hydration flash, and the ≥1024px layout is provably untouched. Consumers branch their
// (inline) style objects on the returned boolean; the desktop branch must stay identical to today.

import { useEffect, useState } from "react";

export const NARROW_MAX_WIDTH = 1023; // reflow at <1024px; desktop unchanged at ≥1024px
export const NARROW_QUERY = `(max-width: ${NARROW_MAX_WIDTH}px)`;

export function useIsNarrow(): boolean {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(NARROW_QUERY);
    const update = () => setIsNarrow(mql.matches);
    update();
    // addEventListener is the modern API; guarded for older Safari (addListener).
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);

  return isNarrow;
}
