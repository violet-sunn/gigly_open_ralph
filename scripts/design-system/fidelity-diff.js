#!/usr/bin/env node
/**
 * fidelity-diff.js — the hard visual gate engine (Fidelity DoD F1).
 *
 * A pixelmatch-based comparator: load two images (PNG/JPG) to raw RGBA via sharp, optionally mask
 * dynamic regions, diff at a calibrated threshold (AA/colour tolerance), and emit artifacts
 * (diff + side-by-side + 50%-overlay). Pure Node — `pixelmatch@^5` (CommonJS) + `sharp`.
 *
 * NOTE ON SCOPE: this engine proves the GATE (control passes / 4px offset fails) and produces
 * vs-reference artifacts for review. Enforcing ≤1% against the existing reference renders is NOT
 * done here — those frames are lossy/draft (docs/design-system/reference-renders/frames/README.md),
 * the type uses a substitute font, the banner raster is unexported, and the design is unlocked.
 * Per-screen ≤1%-vs-Figma enforcement is Phase 2 (compose-*, design-lock-gated).
 *
 * Usage:
 *   node fidelity-diff.js <actual> <expected> [outDir]   # diff + artifacts; exit 1 if ratio > maxDiffRatio
 *   node fidelity-diff.js --selfcheck [outDir]            # prove the gate: control passes, 4px offset fails
 */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pixelmatch = require('pixelmatch');

/** Single calibration reused by Phase-2 baselines: ~1% threshold, AA/colour tolerance. */
const FIDELITY_CONFIG = { maxDiffRatio: 0.01, threshold: 0.15, includeAA: false, masks: [] };

async function loadRaw(input, resizeTo) {
  let pipeline = sharp(input).ensureAlpha();
  if (resizeTo) pipeline = pipeline.resize(resizeTo.width, resizeTo.height, { fit: 'fill' });
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/**
 * Diff two images. Returns { ratio, n, width, height, diffBuf }. The candidate is resized to the
 * reference dimensions; mask rectangles are copied from expected into actual so they don't count.
 */
async function diff(actualInput, expectedInput, opts = {}) {
  const cfg = { ...FIDELITY_CONFIG, ...opts };
  const expected = await loadRaw(expectedInput);
  const { width, height } = expected;
  const actual = await loadRaw(actualInput, { width, height });

  const a = Uint8Array.from(actual.data);
  const e = Uint8Array.from(expected.data);

  for (const m of cfg.masks || []) {
    const x0 = Math.max(0, m.x | 0);
    const y0 = Math.max(0, m.y | 0);
    const x1 = Math.min(width, (m.x | 0) + (m.width | 0));
    const y1 = Math.min(height, (m.y | 0) + (m.height | 0));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * width + x) * 4;
        a[i] = e[i]; a[i + 1] = e[i + 1]; a[i + 2] = e[i + 2]; a[i + 3] = e[i + 3];
      }
    }
  }

  const diffBuf = Buffer.alloc(width * height * 4);
  const n = pixelmatch(a, e, diffBuf, width, height, { threshold: cfg.threshold, includeAA: cfg.includeAA });
  return { ratio: n / (width * height), n, width, height, diffBuf };
}

/** Emit diff.png + side-by-side.png (actual | expected) + overlay-50.png (actual 50% over expected). */
async function writeArtifacts({ actualInput, expectedInput, diffBuf, width, height, outDir }) {
  fs.mkdirSync(outDir, { recursive: true });
  const norm = (input) => sharp(input).resize(width, height, { fit: 'fill' }).ensureAlpha();
  const actualPng = await norm(actualInput).png().toBuffer();
  const expectedPng = await norm(expectedInput).png().toBuffer();

  await sharp(diffBuf, { raw: { width, height, channels: 4 } }).png().toFile(path.join(outDir, 'diff.png'));

  await sharp({ create: { width: width * 2, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } })
    .composite([{ input: actualPng, left: 0, top: 0 }, { input: expectedPng, left: width, top: 0 }])
    .png()
    .toFile(path.join(outDir, 'side-by-side.png'));

  const actualRaw = await norm(actualInput).raw().toBuffer();
  const a50 = Buffer.from(actualRaw);
  for (let i = 3; i < a50.length; i += 4) a50[i] = Math.round(a50[i] * 0.5);
  const a50png = await sharp(a50, { raw: { width, height, channels: 4 } }).png().toBuffer();
  await sharp(expectedPng).composite([{ input: a50png, blend: 'over' }]).png().toFile(path.join(outDir, 'overlay-50.png'));

  return { dir: outDir, files: ['diff.png', 'side-by-side.png', 'overlay-50.png'] };
}

/** Self-validating proof of the gate: a known-good control passes; a 4px-shifted copy fails. */
async function selfcheck(outDir = path.join('docs', 'design-system', 'fidelity', 'out', 'selfcheck')) {
  const W = 64, H = 64, cell = 8;
  const checker = (phase) => {
    const buf = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const on = ((Math.floor((x + phase) / cell) + Math.floor(y / cell)) % 2) === 0;
        const v = on ? 255 : 0;
        const i = (y * W + x) * 4;
        buf[i] = v; buf[i + 1] = v; buf[i + 2] = v; buf[i + 3] = 255;
      }
    }
    return buf;
  };
  const toPng = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const basePng = await toPng(checker(0));
  const shiftedPng = await toPng(checker(4)); // 4px shift of an 8px checker → ~half the pixels flip

  const control = await diff(basePng, basePng);
  const offset = await diff(shiftedPng, basePng);
  await writeArtifacts({ actualInput: shiftedPng, expectedInput: basePng, diffBuf: offset.diffBuf, width: W, height: H, outDir });

  const controlOk = control.ratio <= FIDELITY_CONFIG.maxDiffRatio;
  const offsetDetected = offset.ratio > FIDELITY_CONFIG.maxDiffRatio;
  console.log(
    `fidelity selfcheck: control=${control.ratio.toFixed(4)} (${controlOk ? 'PASS' : 'FAIL'}); ` +
      `4px-offset=${offset.ratio.toFixed(4)} (${offsetDetected ? 'detected→FAIL-as-expected' : 'NOT-DETECTED'}); ` +
      `maxDiffRatio=${FIDELITY_CONFIG.maxDiffRatio}`,
  );
  return controlOk && offsetDetected;
}

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    if (args[0] === '--selfcheck') {
      const ok = await selfcheck(args[1]);
      if (ok) console.log('✓ fidelity: gate verified (control passes, offset fails)');
      else console.error('✗ fidelity: gate self-check FAILED');
      process.exit(ok ? 0 : 1);
    }
    const [actual, expected, outDir] = args;
    if (!actual || !expected) {
      console.error('usage: fidelity-diff <actual> <expected> [outDir]   |   fidelity-diff --selfcheck [outDir]');
      process.exit(2);
    }
    const r = await diff(actual, expected);
    if (outDir) await writeArtifacts({ actualInput: actual, expectedInput: expected, diffBuf: r.diffBuf, width: r.width, height: r.height, outDir });
    const pass = r.ratio <= FIDELITY_CONFIG.maxDiffRatio;
    console.log(`fidelity: ratio=${r.ratio.toFixed(4)} max=${FIDELITY_CONFIG.maxDiffRatio} → ${pass ? 'PASS' : 'FAIL'}`);
    process.exit(pass ? 0 : 1);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { diff, writeArtifacts, selfcheck, FIDELITY_CONFIG };
