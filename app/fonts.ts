import { Handjet, Manrope } from "next/font/google";

/*
 * Type layer — the design's SANCTIONED free-Cyrillic substitution (gigly_full_design/HANDOFF.md;
 * docs/TYPOGRAPHY.md). The redesign's intended families are not web-embeddable, so the design fixes
 * concrete OFL substitutes, now adopted as system fact:
 *   - accent / pixel : NKDuy Mono     -> Handjet   -> --font-mono   (logo, pixel headings, mono data)
 *   - grotesk / nums : Vremena Grotesk -> Manrope  -> --font-grotesk (gig price/term, message bodies, job-experience)
 *   - primary / body : SF Compact      -> system   -> --font-sans   (set in globals.css; no web font)
 *
 * Handjet + Manrope are first-party Google OFL fonts; `next/font/google` SELF-HOSTS them at build
 * (no runtime Google request) and handles the Cyrillic subset + variable axes (so heading weights
 * 500/600 are native — no shipped-weight gap). The --font-sans / --font-mono contract names are kept
 * stable; `--font-mono` now resolves the Handjet pixel/accent face. To swap in licensed originals
 * later, replace these loaders — the variable contract stays.
 */

export const fontMono = Handjet({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const fontGrotesk = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-grotesk",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
});
