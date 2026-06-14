import { describe, it, expect, beforeAll } from "vitest";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { diff, writeArtifacts, FIDELITY_CONFIG } from "@/scripts/design-system/fidelity-diff.js";

// Deterministic, browser-free proof of the F1 gate engine (no cross-OS screenshot flakiness):
// a known-good control passes, an injected 4px offset fails, masking ignores a region, and the
// diff/side-by-side/50%-overlay artifacts are emitted.

const W = 64;
const H = 64;
const CELL = 8;

function checker(phase: number): Buffer {
  const buf = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const on = (Math.floor((x + phase) / CELL) + Math.floor(y / CELL)) % 2 === 0;
      const v = on ? 255 : 0;
      const i = (y * W + x) * 4;
      buf[i] = v;
      buf[i + 1] = v;
      buf[i + 2] = v;
      buf[i + 3] = 255;
    }
  }
  return buf;
}

const toPng = (buf: Buffer) => sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
const OUT = path.join(process.cwd(), "__tests__/.tmp/fidelity");

describe("fidelity-harness / pixel-diff engine", () => {
  let basePng: Buffer;
  let shiftedPng: Buffer;

  beforeAll(async () => {
    basePng = await toPng(checker(0));
    shiftedPng = await toPng(checker(4)); // 4px shift of an 8px checker
    fs.mkdirSync(OUT, { recursive: true });
  });

  it("passes a known-good control (ratio ≈ 0)", async () => {
    const r = await diff(basePng, basePng);
    expect(r.ratio).toBeLessThanOrEqual(FIDELITY_CONFIG.maxDiffRatio);
    expect(r.ratio).toBe(0);
  });

  it("fails an injected 4px offset (ratio > threshold)", async () => {
    const r = await diff(shiftedPng, basePng);
    expect(r.ratio).toBeGreaterThan(FIDELITY_CONFIG.maxDiffRatio);
  });

  it("ignores a masked dynamic region", async () => {
    const r = await diff(shiftedPng, basePng, { masks: [{ x: 0, y: 0, width: W, height: H }] });
    expect(r.ratio).toBeLessThanOrEqual(FIDELITY_CONFIG.maxDiffRatio);
  });

  it("emits diff + side-by-side + 50%-overlay artifacts", async () => {
    const r = await diff(shiftedPng, basePng);
    await writeArtifacts({ actualInput: shiftedPng, expectedInput: basePng, diffBuf: r.diffBuf, width: r.width, height: r.height, outDir: OUT });
    for (const f of ["diff.png", "side-by-side.png", "overlay-50.png"]) {
      expect(fs.existsSync(path.join(OUT, f)), `missing artifact ${f}`).toBe(true);
    }
    const sbs = await sharp(path.join(OUT, "side-by-side.png")).metadata();
    expect(sbs.width).toBe(W * 2);
    expect(sbs.height).toBe(H);
  });

  it("exposes the calibration (≤1% threshold)", () => {
    expect(FIDELITY_CONFIG.maxDiffRatio).toBeLessThanOrEqual(0.01);
    expect(typeof FIDELITY_CONFIG.threshold).toBe("number");
  });
});
