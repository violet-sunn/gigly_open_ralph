import localFont from "next/font/local";

/*
 * Type layer — the design's SANCTIONED free-Cyrillic substitution (gigly_full_design/HANDOFF.md;
 * docs/TYPOGRAPHY.md). The redesign's intended families are not web-embeddable, so the design fixes
 * concrete OFL substitutes, now adopted as system fact:
 *   - accent / pixel : NKDuy Mono     -> Handjet   -> --font-mono   (logo, pixel headings, mono data)
 *   - grotesk / nums : Vremena Grotesk -> Manrope  -> --font-grotesk (gig price/term, message bodies, job-experience)
 *   - primary / body : SF Compact      -> system   -> --font-sans   (set in globals.css; no web font)
 *
 * SELF-HOSTED via `next/font/local` — the variable TTFs (OFL, from github.com/google/fonts) live in
 * app/fonts/. No build-time or runtime Google request, so the РФ build cluster and РФ end-users never
 * depend on Google Fonts (which is unreliable/blocked there). The literal `'Handjet'`/`'Manrope'`
 * family names used by the inline styles are registered separately via @font-face in app/_design/tokens.css.
 * The --font-sans / --font-mono / --font-grotesk contract names stay stable.
 */

export const fontMono = localFont({
  src: "./fonts/Handjet.ttf",
  weight: "100 900",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const fontGrotesk = localFont({
  src: "./fonts/Manrope.ttf",
  weight: "200 800",
  variable: "--font-grotesk",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
});
