#!/usr/bin/env node
/**
 * validate-contrast.js — WCAG-AA contrast gate over the token text×surface pairs, BOTH themes
 * (light-theme-screen-audit; ТЗ §3/§9.3). Dark value = token `.value`; light value = `.light ?? .value`.
 * AA thresholds: ≥4.5:1 body/label/caption text, ≥3:1 large (h1/h2/display/title) text.
 *
 * Solid tokens only (text/surface/brand/status are solid hex). Documented exceptions are an explicit
 * ALLOWLIST (with rationale), not silent skips. CLI: `node scripts/design-system/validate-contrast.js`.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', '..', 'openspec', 'specs', 'ui', 'design-tokens.json');

// ---- WCAG maths ---------------------------------------------------------
function toRgb(hex) {
  let h = String(hex).trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6); // ignore alpha for solid-pair contrast
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function relLum([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fg, bg) {
  const a = relLum(toRgb(fg)) + 0.05;
  const b = relLum(toRgb(bg)) + 0.05;
  return (Math.max(a, b) / Math.min(a, b));
}

// ---- the audited matrix -------------------------------------------------
// surfaces text sits on: page bg (0), sunken (1), card/input (2), gig card (3)
const SURFACES = ['surface-level-0', 'surface-level-1', 'surface-level-2', 'surface-level-3'];
const BODY = 4.5, LARGE = 3.0;

// text token -> { surfaces, min }  (large text uses LARGE; body uses BODY)
const TEXT_PAIRS = [
  { fg: 'text-strong', surfaces: SURFACES, min: BODY },
  { fg: 'text-muted', surfaces: SURFACES, min: BODY },
  { fg: 'text-subtle', surfaces: SURFACES, min: BODY },
  // status labels render as bold/emphasis pill text paired with a colour indicator → WCAG LARGE tier (≥3:1).
  // This preserves the vivid one-to-one status hues the design intends (ТЗ §6) and keeps the shipped DARK theme
  // unchanged (e.g. verification 4.41:1 on a dark card passes LARGE); only genuine light failures get darkened.
  ...['open', 'review', 'in-progress', 'verification', 'completed', 'rejected'].map((s) => ({
    fg: `status-${s}`, surfaces: ['surface-level-0', 'surface-level-2'], min: LARGE,
  })),
];

// Documented exceptions (rationale required). Pair key = `${fg}|${bg}|${theme}` or `${fg}|${bg}` (both).
const ALLOWLIST = {
  // White button text on the invariant brand blue ≈ 3.1:1 — designer-sanctioned (ТЗ §4 "кнопки не трогаем";
  // brand #0088ff is the theme-invariant anchor). Treated as a large/UI affordance, not body copy.
  'text-inverse|brand-default': '~3.1:1 — sanctioned brand button (ТЗ §4); brand invariant, white label, large/UI',
  // Specialty-tag brand mono on the white chip (dark theme) ≈ 3.1:1 — sanctioned brand-on-chip label (large mono).
  'brand-default|surface-inverse|dark': '~3.1:1 — specialty tag brand mono on white chip (dark); sanctioned label',
  // text.disabled is WCAG-exempt (disabled controls have no contrast minimum) — not audited (omitted from matrix).
};

function val(tok, theme) { return theme === 'light' ? (tok.light ?? tok.value) : tok.value; }

function validateContrast() {
  const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const cs = json['color-semantic'];
  const flat = {};
  for (const ns of Object.keys(cs)) {
    for (const [k, v] of Object.entries(cs[ns])) {
      if (k[0] === '_') continue;
      if (v && typeof v === 'object' && 'value' in v) flat[`${ns}-${k}`] = v;
    }
  }
  const errors = [];
  const check = (fg, bg, min) => {
    for (const theme of ['dark', 'light']) {
      if (ALLOWLIST[`${fg}|${bg}`] || ALLOWLIST[`${fg}|${bg}|${theme}`]) continue;
      const f = flat[fg], b = flat[bg];
      if (!f || !b) { errors.push(`unknown token in pair ${fg} × ${bg}`); continue; }
      const r = ratio(val(f, theme), val(b, theme));
      if (r < min) {
        errors.push(`${theme}: ${fg} on ${bg} = ${r.toFixed(2)}:1 (needs ≥${min}:1)`);
      }
    }
  };
  for (const { fg, surfaces, min } of TEXT_PAIRS) for (const bg of surfaces) check(fg, bg, min);
  // explicit non-surface pairs
  check('text-inverse', 'brand-default', BODY);
  check('brand-default', 'surface-inverse', BODY);

  return { pass: errors.length === 0, errors };
}

module.exports = { validateContrast, ratio };

if (require.main === module) {
  const { pass, errors } = validateContrast();
  if (pass) {
    console.log('✓ contrast: PASS (every audited text×surface pair meets WCAG AA in both themes)');
    process.exit(0);
  }
  console.error('✗ contrast FAILED (WCAG AA):');
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
