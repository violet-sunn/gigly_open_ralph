#!/usr/bin/env node
/**
 * validate-token-purity.js — token-purity lint (Fidelity DoD F2).
 *
 * Scans app/ and components/ for raw design literals used outside the token system:
 *   - colour literals: hex (#rgb/#rrggbb/#rrggbbaa), rgb()/rgba()/hsl()/hsla()
 *   - raw px values inside CSS files and inline style={{…}} / style="…" blocks
 *
 * Allowlisted: 0 / 0px, transparent, currentColor, inherit, data: URIs, and any
 * value already expressed via a token (Tailwind token utility / var(--token)).
 *
 * Policy: BASELINE-THEN-TIGHTEN. ~62 raw-hex literals pre-exist in Phase-2-doomed
 * legacy components. They are recorded in token-purity-baseline.json (counts per
 * file::type::literal) and do NOT block. Any NEW (non-baselined) violation fails
 * (exit 1). A later cleanup change flips this to fail-on-all once legacy is recomposed.
 *
 * Usage:
 *   node scripts/design-system/validate-token-purity.js                 # lint (fail on new)
 *   node scripts/design-system/validate-token-purity.js --update-baseline  # record current as baseline
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const SCAN_DIRS = ['app', 'components'];
const EXTS = new Set(['.ts', '.tsx', '.css', '.scss']);
const BASELINE_PATH = path.join(__dirname, 'token-purity-baseline.json');
const UPDATE = process.argv.includes('--update-baseline');

// ---- allowlist ----------------------------------------------------------
const ALLOWED_LITERALS = new Set(['transparent', 'currentcolor', 'inherit', 'none', 'initial', 'unset']);
const isAllowedHex = () => false; // every real hex colour is a violation
const ZERO_PX = /^0(\.0+)?px$/i;

// ---- file walk ----------------------------------------------------------
function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      walk(full, out);
    } else if (EXTS.has(path.extname(e.name))) {
      out.push(full);
    }
  }
  return out;
}

// ---- detectors ----------------------------------------------------------
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const COLOR_FN = /\b(?:rgba?|hsla?)\s*\([^)]*\)/gi;
// px only inside CSS files or inline style blocks
const PX = /\b\d+(?:\.\d+)?px\b/g;
const STYLE_BLOCK = /style\s*=\s*(?:\{\{[\s\S]*?\}\}|"[^"]*"|'[^']*')/g;

function findViolations(file, text) {
  const ext = path.extname(file);
  const isCss = ext === '.css' || ext === '.scss';
  const v = [];

  // colour literals — anywhere in source
  for (const m of text.matchAll(HEX)) {
    if (!isAllowedHex(m[0])) v.push({ type: 'hex', literal: m[0].toLowerCase() });
  }
  for (const m of text.matchAll(COLOR_FN)) {
    const lit = m[0].replace(/\s+/g, '').toLowerCase();
    // ignore fully-transparent helpers? keep strict: any rgb/hsl literal is a violation
    v.push({ type: 'colorfn', literal: lit });
  }

  // raw px — CSS files (whole text) or inline style blocks in TS/TSX
  const pxHaystacks = [];
  if (isCss) {
    pxHaystacks.push(text);
  } else {
    for (const m of text.matchAll(STYLE_BLOCK)) pxHaystacks.push(m[0]);
  }
  for (const hay of pxHaystacks) {
    for (const m of hay.matchAll(PX)) {
      if (ZERO_PX.test(m[0])) continue;
      v.push({ type: 'px', literal: m[0].toLowerCase() });
    }
  }
  return v;
}

// ---- scan ---------------------------------------------------------------
const files = SCAN_DIRS.flatMap((d) => walk(path.join(root, d)));
const counts = {}; // key: relfile::type::literal -> count
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  for (const { type, literal } of findViolations(file, text)) {
    const key = `${rel}::${type}::${literal}`;
    counts[key] = (counts[key] || 0) + 1;
  }
}

// ---- baseline mode ------------------------------------------------------
if (UPDATE) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(counts, null, 2) + '\n', 'utf8');
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`✓ Wrote token-purity baseline: ${Object.keys(counts).length} keys, ${total} occurrences -> ${path.relative(root, BASELINE_PATH)}`);
  process.exit(0);
}

let baseline = {};
try { baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')); }
catch { console.error('✗ No baseline found. Run with --update-baseline first.'); process.exit(1); }

// ---- compare: fail on any count exceeding baseline (i.e. NEW violations) -
const newViolations = [];
for (const [key, count] of Object.entries(counts)) {
  const allowed = baseline[key] || 0;
  if (count > allowed) newViolations.push({ key, count, allowed, extra: count - allowed });
}

if (newViolations.length === 0) {
  const baselined = Object.values(baseline).reduce((a, b) => a + b, 0);
  console.log(`✓ token-purity: PASS (no new off-token literals; ${baselined} pre-existing legacy occurrences baselined)`);
  process.exit(0);
}

console.error('✗ token-purity: FAIL — new off-token literal(s) outside the token system:');
for (const nv of newViolations) {
  const [rel, type, literal] = nv.key.split('::');
  console.error(`   ${rel}  [${type}]  ${literal}  (+${nv.extra} new)`);
}
console.error('\nUse design tokens instead of raw literals (see docs/DESIGN_SYSTEM_SPEC.md §2).');
console.error('If this is intentional legacy code, it must instead be recomposed in Phase 2 — not baselined.');
process.exit(1);
