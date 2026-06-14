import localFont from "next/font/local";

/*
 * Type layer — dev-stage substitutes (see docs/TYPOGRAPHY.md).
 *
 * The redesign's intended families (SF Compact display/UI, NKDy Mono) are NOT
 * web-embeddable, so we self-host the closest freely-licensed (SIL OFL) substitutes:
 *   - sans  : Inter         (closest resemblance to SF Compact)        -> --font-sans
 *   - mono  : JetBrains Mono (substitute for NKDy Mono)                 -> --font-mono
 *
 * Loaded via next/font/local (self-hosted woff2 in app/fonts) for deterministic,
 * offline-safe builds. `display: 'swap'` + adjustFontFallback (size-adjusted
 * fallback metrics) prevent layout shift. To swap in a real licensed font later,
 * replace the `src` files here — the --font-sans / --font-mono contract stays stable.
 */

export const fontSans = localFont({
  src: [
    { path: "./fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["-apple-system", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
});

export const fontMono = localFont({
  src: [{ path: "./fonts/JetBrainsMono-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
