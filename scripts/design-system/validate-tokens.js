#!/usr/bin/env node
/**
 * validate-tokens.js — integrity + drift validation for the design-token engine.
 * Replaces the deleted scripts/validate-profile-tokens.mjs / profile-tokens.test.ts
 * (which read the now-deleted design-tokens.json).
 *
 * Asserts:
 *   1. design-tokens.json parses and contains every required taxonomy namespace
 *   2. the 6 gig statuses + 5 categories are present
 *   3. no pre-redesign "parody" hex leaks into the tokens
 *   4. generated-tokens.js is in sync with the JSON (no drift / hand-edits):
 *      every canonical colour leaf appears in tokens.colors with a matching value,
 *      and the canonical scale groups are emitted
 *   5. generated-tokens.css mirrors the canonical CSS vars
 *
 * Usable as a module (`const { validateTokens } = require('./validate-tokens')`)
 * or as a CLI (`node scripts/design-system/validate-tokens.js`).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const JSON_PATH = path.join(ROOT, 'openspec', 'specs', 'ui', 'design-tokens.json');
const GEN_JS_PATH = path.join(ROOT, 'scripts', 'generated-tokens.js');
const GEN_CSS_PATH = path.join(ROOT, 'scripts', 'generated-tokens.css');

const PARODY_HEX = ['#0a0e27', '#0ea5e9', '#141937', '#1e2447', '#2a3158', '#38bdf8'];
const STATUSES = ['open', 'review', 'in-progress', 'verification', 'completed', 'rejected'];
const CATEGORIES = ['marketing', 'design', 'programming', 'development', 'coding'];

// flatten color-semantic to dash keys (mirrors the parser's flattenObject for colours).
// Returns the leaf NODES ({value, light?}) so the light layer can be validated too.
function flattenColors(obj, prefix = '', out = {}) {
  for (const key of Object.keys(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    const val = obj[key];
    if (val && typeof val === 'object' && 'value' in val) out[newKey] = val;
    else if (val && typeof val === 'object') flattenColors(val, newKey, out);
  }
  return out;
}

// hexToRgba mirror of the parser (8-digit hex → rgba) so CSS values compare equal.
function hexToRgba(hex) {
  if (typeof hex === 'string' && /^#[0-9a-f]{8}$/i.test(hex)) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16), a = parseInt(hex.slice(7, 9), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  return hex;
}

// Parse a `selector { --k: v; … }` block from the generated CSS into a {var: value} map.
function cssVars(css, selectorRe) {
  const m = css.match(selectorRe);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*--([\w-]+):\s*(.+?);\s*$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function validateTokens() {
  const errors = [];

  // 1. JSON parses
  let json;
  try {
    json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  } catch (e) {
    return { pass: false, errors: [`design-tokens.json missing or invalid JSON: ${e.message}`] };
  }

  // 2. required taxonomy namespaces
  const cs = json['color-semantic'] || {};
  for (const ns of ['surface', 'text', 'border', 'brand', 'status', 'category']) {
    if (!cs[ns]) errors.push(`missing color-semantic namespace: ${ns}`);
  }
  if (!json.font || !json.font.typography) errors.push('missing font.typography');
  if (!json.effect || !json.effect.shadow) errors.push('missing effect.shadow');
  if (!json.gradient) errors.push('missing gradient');
  const nums = json.numbers || {};
  for (const g of ['spacing', 'corner', 'size', 'zIndex', 'opacity']) {
    if (!nums[g]) errors.push(`missing numbers.${g}`);
  }

  // 3. statuses + categories
  for (const s of STATUSES) if (!cs.status || !cs.status[s]) errors.push(`missing status: ${s}`);
  for (const c of CATEGORIES) if (!cs.category || !cs.category[c]) errors.push(`missing category: ${c}`);

  // 4. no parody hex anywhere in the JSON
  const jsonText = JSON.stringify(json).toLowerCase();
  for (const p of PARODY_HEX) if (jsonText.includes(p)) errors.push(`parody hex leaked into tokens: ${p}`);

  // 5. generated-tokens.js in sync with the JSON (drift detection)
  let gen;
  try {
    delete require.cache[require.resolve(GEN_JS_PATH)];
    gen = require(GEN_JS_PATH);
  } catch (e) {
    errors.push(`generated-tokens.js missing/unloadable: ${e.message}`);
    return { pass: errors.length === 0, errors };
  }
  // add-light-theme: colours are now var(--key) refs in JS; the real dark/light values live in the
  // CSS :root / [data-theme="light"] layers. Validate var-backing + both value layers (drift detection).
  let css = '';
  try { css = fs.readFileSync(GEN_CSS_PATH, 'utf8'); } catch (e) { errors.push(`generated-tokens.css missing: ${e.message}`); }
  const rootVars = cssVars(css, /:root\s*\{([\s\S]*?)\}/);
  const lightVars = cssVars(css, /\[data-theme="light"\]\s*\{([\s\S]*?)\}/);
  if (!rootVars) errors.push('generated-tokens.css missing :root block');

  const expectedColors = flattenColors(cs);
  for (const [key, node] of Object.entries(expectedColors)) {
    const darkVal = hexToRgba(node.value);
    // (a) JS must reference the var
    if (gen.colors?.[key] !== `var(--${key})`) {
      errors.push(`drift: generated-tokens.js colour "${key}" must be "var(--${key})" but is ${gen.colors?.[key]} (regenerate tokens)`);
    }
    // (b) :root must carry the dark value
    if (rootVars && String(rootVars[key]).toLowerCase() !== String(darkVal).toLowerCase()) {
      errors.push(`drift: :root --${key} = ${rootVars[key]} but JSON dark says ${darkVal} (regenerate tokens)`);
    }
    // (c) a declared light override must appear under [data-theme="light"]
    if (node.light !== undefined) {
      const lightVal = hexToRgba(node.light);
      if (!lightVars || String(lightVars[key]).toLowerCase() !== String(lightVal).toLowerCase()) {
        errors.push(`drift: [data-theme="light"] --${key} = ${lightVars?.[key]} but JSON light says ${lightVal} (regenerate tokens)`);
      }
    }
  }
  for (const group of ['fontSize', 'borderRadius', 'spacing', 'zIndex', 'opacity', 'gradient', 'size', 'boxShadow']) {
    if (!gen[group] || Object.keys(gen[group]).length === 0) errors.push(`drift: generated-tokens.js missing/empty group "${group}"`);
  }
  // CSS still mirrors the canonical non-colour vars
  for (const v of ['--radius-md', '--z-dropdown']) {
    if (css && !css.includes(v)) errors.push(`generated-tokens.css missing var ${v}`);
  }

  return { pass: errors.length === 0, errors, colorCount: Object.keys(expectedColors).length };
}

module.exports = { validateTokens };

if (require.main === module) {
  const { pass, errors, colorCount } = validateTokens();
  if (pass) {
    console.log(`✓ design tokens valid (${colorCount} canonical colours; taxonomy complete; generated outputs in sync; no parody)`);
    process.exit(0);
  }
  console.error('✗ design token validation FAILED:');
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
