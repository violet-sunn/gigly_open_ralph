import { test, expect } from "@playwright/test";
import path from "node:path";
import { diff, writeArtifacts } from "../../scripts/design-system/fidelity-diff.js";

/**
 * FIDELITY CAPTURE — renders each catalogued (dev-only) workbench surface at 1440px with the seeded
 * fixtures and runs the pixel-diff engine vs the reference renders, emitting artifacts for review.
 *
 * PER-SCREEN ≤1%-vs-Figma ENFORCEMENT IS DEFERRED TO PHASE 2 (compose-*, design-lock-gated):
 * the reference frames are LOSSY/draft (docs/design-system/reference-renders/frames/README.md),
 * the type uses a substitute font, the banner raster is unexported, and the design is unlocked.
 * This spec proves the apparatus runs (1440px render + diff + artifacts); it does NOT assert ≤1%.
 */

const OUT = path.join(process.cwd(), "docs/design-system/fidelity/out");
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

test.use({ viewport: { width: 1440, height: 1024 } });

test("renders each catalogued surface at 1440px and captures it", async ({ page }) => {
  for (const url of SURFACES) {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(OUT, "captures", url.replace(/\W+/g, "_").replace(/^_/, "") + ".png"),
      fullPage: true,
    });
  }
});

test("diffs the composed screen vs its (lossy) reference frame into artifacts", async ({ page }) => {
  await page.goto("/workbench/screens");
  await page.waitForLoadState("networkidle");
  const shot = await page.screenshot({ fullPage: true });
  const ref = path.join(process.cwd(), "docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg");

  const r = await diff(shot, ref);
  await writeArtifacts({
    actualInput: shot,
    expectedInput: ref,
    diffBuf: r.diffBuf,
    width: r.width,
    height: r.height,
    outDir: path.join(OUT, "specialist-dashboard"),
  });

  // INFORMATIONAL ONLY — ≤1%-vs-Figma is deferred to Phase 2 (design lock + Figma frames + fonts +
  // raster). Assert only that the apparatus ran and produced a ratio; do NOT gate on the value.
  expect(typeof r.ratio).toBe("number");
});
