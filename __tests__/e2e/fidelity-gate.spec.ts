import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { diff, writeArtifacts } from "../../scripts/design-system/fidelity-diff.js";

/**
 * F1 ≤1% VISUAL-FIDELITY GATE (refidelity-from-full-design, Phase 4) — the deferred ≤1% gate, turned on as a
 * SELF-REFERENTIAL golden-image regression: for every workbench surface in BOTH themes at 1440px, capture the live
 * render and diff it (via fidelity-diff.js) vs a committed golden, asserting the differing-pixel ratio ≤ 1%. When a
 * golden is absent (or FIDELITY_UPDATE=1) the golden is written instead of gated (baseline-on-first-run). Artifacts
 * (diff / side-by-side / overlay-50) are emitted for review. The gigly_full_design prototype frames remain the HUMAN
 * F1 overlay/calibration reference (the registry `reference`), not the automated target. Goldens are environment-pinned
 * to the project's Playwright Chromium — regenerate with `npm run test:fidelity:update` if it changes.
 */
const ROOT = process.cwd();
const GOLDEN = path.join(ROOT, "docs/design-system/fidelity/golden");
const OUT = path.join(ROOT, "docs/design-system/fidelity/out/gate");
const UPDATE = process.env.FIDELITY_UPDATE === "1";

// Every component surface (tokens/primitives/blocks/templates/layout) + the composed-screen sample + the generativity
// probe — the deterministic, fixture-driven fidelity capture model. (Live per-route screens stay F3 + human overlay.)
const SURFACES = [
  "/workbench",
  "/workbench/tokens",
  "/workbench/primitives",
  "/workbench/blocks",
  "/workbench/templates",
  "/workbench/layout",
  "/workbench/screens",
  "/workbench/generativity",
];
const THEMES = ["dark", "light"] as const;

test.use({ viewport: { width: 1440, height: 1024 } });

for (const theme of THEMES) {
  for (const url of SURFACES) {
    const slug = (url.replace(/\W+/g, "_").replace(/^_/, "") || "workbench") + "." + theme;

    test(`F1 ≤1% — ${url} (${theme})`, async ({ page }) => {
      // Set the theme before any page script runs (the boot script reads localStorage → [data-theme]).
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("gigly-theme", t as string);
        } catch {
          /* ignore */
        }
      }, theme);

      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => (document as { fonts?: { ready: Promise<unknown> } }).fonts?.ready); // avoid FOUT drift
      const shot = await page.screenshot({ fullPage: true });

      const goldenPath = path.join(GOLDEN, `${slug}.png`);
      if (UPDATE || !fs.existsSync(goldenPath)) {
        fs.mkdirSync(path.dirname(goldenPath), { recursive: true });
        fs.writeFileSync(goldenPath, shot);
        test.info().annotations.push({ type: "fidelity-baseline", description: `wrote golden ${slug}` });
        return; // baseline-on-first-run / --update: write, don't gate
      }

      const r = await diff(shot, goldenPath);
      await writeArtifacts({
        actualInput: shot,
        expectedInput: goldenPath,
        diffBuf: r.diffBuf,
        width: r.width,
        height: r.height,
        outDir: path.join(OUT, slug),
      });
      expect(
        r.ratio,
        `${url} (${theme}) drifted ${(r.ratio * 100).toFixed(2)}% (> 1%) vs its golden — see docs/design-system/fidelity/out/gate/${slug}/overlay-50.png`,
      ).toBeLessThanOrEqual(0.01);
    });
  }
}
