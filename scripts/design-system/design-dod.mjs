#!/usr/bin/env node
/**
 * design-dod.mjs — deterministic part of DESIGN.md §15 (definition of done).
 *
 * Checks only what a script can prove. Taste, mode choice and art placement stay with
 * the reviewer. Exit code 1 on any finding so /ralphy-validate can gate on it.
 *
 * Scope: files passed as arguments, or every .tsx/.css under app/ when none are given.
 * Legacy prototype paths (app/_design, scripts/generated-tokens.css, gigly_full_design)
 * are skipped: they are the CURRENT state, not the target, and are retired per screen.
 *
 * Usage: node scripts/design-system/design-dod.mjs [files...]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..', '..');
const LEGACY = ['app/_design', 'app/lab', 'scripts/generated-tokens.css'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = relative(ROOT, p);
    if (LEGACY.some((l) => rel.startsWith(l))) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => resolve(ROOT, f))
  : walk(join(ROOT, 'app'));

const findings = [];
const add = (file, rule, detail) => findings.push({ file: relative(ROOT, file), rule, detail });

const RULES = [
  // DESIGN.md §4: tokens only, no hex in app/
  { rule: 'no-hex', re: /#[0-9a-fA-F]{3,8}\b(?![^<]*>)/g, detail: 'hard-coded hex; use an OKLCH token' },
  // §7: chamfer, not radius (avatars excepted by class name)
  { rule: 'no-border-radius', re: /border-radius\s*:|rounded-(?!none)[a-z0-9-]*/g, detail: 'border-radius / rounded-*; use clip-path chamfer (--cut-*)', skipLine: /avatar/i },
  // §5: box-shadow glow is a fallback, never the default
  { rule: 'box-shadow-default', re: /box-shadow\s*:\s*0\s+0\s+\d+px/g, detail: 'box-shadow glow outside the documented fallback; use the light layer', skipLine: /fallback|reduced-motion/i },
  // §10: scroll listeners banned
  { rule: 'no-scroll-listener', re: /addEventListener\(\s*['"]scroll['"]/g, detail: 'window scroll listener; use IntersectionObserver / scroll-driven animations' },
  // §10: no easeOutExpo
  { rule: 'no-ease-out-expo', re: /cubic-bezier\(\s*0?\.16\s*,\s*1\s*,\s*0?\.3\s*,\s*1\s*\)/g, detail: 'easeOutExpo; thresholds are cuts, workspace uses cubic-bezier(0.2,0,0,1)' },
  // §8: no monospace
  { rule: 'no-monospace', re: /font-family\s*:[^;]*mono|font-mono\b/g, detail: 'monospace; numbers use tabular figures of the text face' },
  // §13: banned words
  { rule: 'no-luxury-words', re: /премиум|люкс|premium|luxury/gi, detail: 'the words premium / luxury never appear in UI' },
  // §13: arrow after CTA text
  { rule: 'no-arrow-cta', re: />[^<]{2,40}\s*(→|&rarr;)\s*</g, detail: '"→" appended to link or button text' },
  // §2: achromatic gray/black tokens
  { rule: 'no-achromatic', re: /oklch\(\s*[\d.]+%?\s+0(\.0+)?\s+/g, detail: 'achromatic OKLCH (chroma 0); shadows carry the scene hue', skipLine: /data-scene="white"/ },
];

for (const file of files) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (const r of RULES) {
      if (r.skipLine && r.skipLine.test(line)) continue;
      if (r.re.test(line)) add(file, r.rule, `${r.detail} (line ${i + 1})`);
      r.re.lastIndex = 0;
    }
  });

  // §2.3: exactly one L0 per screen file (pages only)
  if (/\/page\.tsx$/.test(file)) {
    const l0 = (src.match(/data-level=["']0["']/g) || []).length;
    if (l0 !== 1) add(file, 'one-l0-per-screen', `found ${l0} elements with data-level="0"; exactly one expected`);
    if (!/data-mode=["'](scene|workspace)["']/.test(src)) add(file, 'declare-mode', 'page root must declare data-mode="scene" | "workspace"');
  }
}

if (findings.length) {
  console.error(`design-dod: ${findings.length} finding(s)\n`);
  for (const f of findings) console.error(`  ${f.file}  [${f.rule}]  ${f.detail}`);
  console.error('\nSee DESIGN.md §14–15. Documented deviations: note them in the change proposal and add a skip comment on the line.');
  process.exit(1);
}
console.log(`design-dod: ${files.length} file(s) clean`);
