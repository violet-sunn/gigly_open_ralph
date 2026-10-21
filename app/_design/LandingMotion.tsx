"use client";

// Section entrances for the landing page: each [data-reveal] gets `is-in` once, when it enters. The hidden
// state lives only under `html.js` + no reduced motion (landing.css), so without JS everything is simply there.

import { useEffect } from "react";

export function LandingMotion() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".lp [data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
