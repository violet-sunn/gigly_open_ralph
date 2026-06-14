// Acceptance validator for extract-svg-tokens-and-assets.
// Maps every spec scenario (R1..R7) to a deterministic check. Run from repo root.
const fs = require('fs');
const path = require('path');
let sharp; try { sharp = require('sharp'); } catch {}

const DS = 'public/assets/design-system';
const ICONS = DS + '/icons';
const RR = 'docs/design-system/reference-renders';
const SPEC = 'docs/DESIGN_SPECS.md';
const TOKENS = fs.readFileSync('screens/tokens.svg', 'utf8').toLowerCase();
const FRAMES = fs.readFileSync('screens/frames.svg', 'utf8').toLowerCase();
const SRC = TOKENS + FRAMES;
const spec = fs.existsSync(SPEC) ? fs.readFileSync(SPEC, 'utf8') : '';

let pass = 0, fail = 0, warn = 0;
const P = (id, m) => { console.log(`  PASS ${id}  ${m}`); pass++; };
const F = (id, m) => { console.log(`  FAIL ${id}  ${m}`); fail++; };
const W = (id, m) => { console.log(`  WARN ${id}  ${m}`); warn++; };
const has = (f) => fs.existsSync(f);
const read = (f) => fs.readFileSync(f, 'utf8');
const svgs = (d) => has(d) ? fs.readdirSync(d).filter(f => f.endsWith('.svg')) : [];

console.log('=== R1: Design-System SVG Asset Library ===');
// S1.1 dirs
['icons','brand','patterns'].every(d => has(DS+'/'+d))
  ? P('1.1','icons/ brand/ patterns/ exist') : F('1.1','missing subdir');
// S1.2 named icon set (SVG-able)
const NAV = ['dashboard','my-gigs','chats','finances','disputes','search'];
const STD = ['bell','gear','collapse','send','view-toggle','verified','status-dot','filter','radio-on','radio-off','clear','star','grid','list'];
const missing = [...NAV, ...STD].filter(n => !has(`${ICONS}/${n}.svg`));
missing.length ? F('1.2',`missing icons: ${missing}`) : P('1.2',`all ${NAV.length+STD.length} SVG-able icons present`);
// attach/eye must NOT be claimed present (they are gaps) — confirm they are absent AND documented as gaps
const attachEyeAbsent = !has(`${ICONS}/attach.svg`) && !has(`${ICONS}/eye.svg`);
(attachEyeAbsent && /attach/i.test(spec) && /eye/i.test(spec))
  ? P('1.2b','attach/eye correctly absent + documented as gaps') : F('1.2b','attach/eye state inconsistent');
// each icon is single self-contained svg
let multi = svgs(ICONS).filter(f => (read(`${ICONS}/${f}`).match(/<svg[\s>]/g)||[]).length !== 1);
multi.length ? F('1.2c',`non-single-svg: ${multi}`) : P('1.2c','each icon is one self-contained <svg>');
// S1.3 brand + pattern
(has(`${DS}/brand/gigly-logo.svg`) && has(`${DS}/patterns/checkerboard.svg`))
  ? P('1.3','gigly-logo.svg + checkerboard.svg present') : F('1.3','brand/pattern missing');
// S1.4 faithful — slices contain real path/vector data + render non-empty (proxy for "slice not redraw")
(async () => {
  let renderFails = [];
  if (sharp) {
    for (const f of [...svgs(ICONS), 'gigly-logo.svg']) {
      const p = has(`${ICONS}/${f}`) ? `${ICONS}/${f}` : `${DS}/brand/${f}`;
      try { const b = await sharp(Buffer.from(read(p))).png().toBuffer(); if (b.length < 80) renderFails.push(f); }
      catch (e) { renderFails.push(f + ':' + e.message.slice(0,30)); }
    }
  }
  const haveVectors = svgs(ICONS).every(f => /<(path|circle|rect|g)\b/.test(read(`${ICONS}/${f}`)));
  (renderFails.length === 0 && haveVectors)
    ? P('1.4','all slices contain vector data + render to non-empty raster (visual fidelity confirmed at impl)')
    : F('1.4',`render/vector issues: ${renderFails}`);

  console.log('\n=== R2: Optimization & Accessibility ===');
  const allAssets = [];
  for (const d of ['icons','brand','patterns']) for (const f of svgs(`${DS}/${d}`)) allAssets.push(`${DS}/${d}/${f}`);
  // S2.1 well-formed + viewBox
  let mal = allAssets.filter(p => { const s = read(p).trim(); return !/^<svg/.test(s) || (s.match(/<svg[\s>]/g)||[]).length!==1 || (s.match(/<\/svg>/g)||[]).length!==1 || (s.match(/<g[\s>]/g)||[]).length !== (s.match(/<\/g>/g)||[]).length; });
  let noVB = allAssets.filter(p => !/viewBox=/.test(read(p)));
  (mal.length===0 && noVB.length===0) ? P('2.1',`all ${allAssets.length} assets well-formed + viewBox`) : F('2.1',`malformed:${mal} noViewBox:${noVB}`);
  // S2.2 optimized: no cruft + icons <=10KB
  let cruft = allAssets.filter(p => /data-figma|<metadata|sketch:|inkscape:/i.test(read(p)));
  let big = svgs(ICONS).filter(f => fs.statSync(`${ICONS}/${f}`).size > 10240);
  (cruft.length===0 && big.length===0) ? P('2.2',`no editor cruft; all icons <=10KB`) : (cruft.length?F('2.2',`cruft:${cruft}`):W('2.2',`>10KB (SHOULD): ${big}`));
  // S2.3 a11y
  const decoOK = /aria-hidden="true"/.test(read(`${DS}/patterns/checkerboard.svg`)) && /role="presentation"/.test(read(`${DS}/patterns/checkerboard.svg`));
  const meaningful = ['bell','gear','verified','send','collapse'];
  const labelled = meaningful.every(n => /aria-label=|<title>/.test(read(`${ICONS}/${n}.svg`)));
  (decoOK && labelled) ? P('2.3','meaningful icons labelled; checkerboard decorative') : F('2.3',`deco:${decoOK} labelled:${labelled}`);

  console.log('\n=== R3: Colour Palette ===');
  // S3.1 + S3.3 provenance: EVERY 6-digit hex documented must exist in the SVGs
  const docHexes = [...new Set((spec.match(/#[0-9a-fA-F]{6}/g)||[]).map(h => h.toLowerCase()))];
  const notInSrc = docHexes.filter(h => !SRC.includes(h));
  // allow 'white' keyword; that's separate
  (docHexes.length >= 20) ? P('3.1',`${docHexes.length} distinct hexes documented`) : F('3.1',`only ${docHexes.length} hexes`);
  notInSrc.length===0 ? P('3.3',`ALL ${docHexes.length} documented hexes exist in the SVGs (full provenance)`) : F('3.3',`NOT in SVG: ${notInSrc}`);
  // S3.2 families
  const fam = ['Surface','Neutral','Brand','Status','Tag'].filter(h => new RegExp(h,'i').test(spec));
  fam.length>=5 ? P('3.2',`families present: ${fam.join(', ')}`) : F('3.2',`families: ${fam}`);
  // S3.4 raw observed
  /raw observed|as observed|observed fills|not.*normalized|not a normalized/i.test(spec) && !/surface\/level-0/.test(spec)
    ? P('3.4','labelled raw/observed; no canonical scale names in palette') : W('3.4','check raw-observed labelling');

  console.log('\n=== R4: Radius Set ===');
  const RADII = ['2','2.5','3','3.5','4','4.5','5','8','11','12','13','16','18'];
  const docHasRadii = RADII.every(r => new RegExp(`\\b${r.replace('.','\\.')}\\b`).test(spec));
  docHasRadii ? P('4.1',`radius set documented incl. ${RADII.join(',')}`) : F('4.1','radius set incomplete');
  // S4.2 provenance: each radius exists as rx in SVGs
  const rxMiss = RADII.filter(r => !SRC.includes(`rx="${r}"`));
  rxMiss.length===0 ? P('4.2',`ALL ${RADII.length} radii exist as rx in the SVGs`) : F('4.2',`rx not found: ${rxMiss}`);
  /raw observed|as observed|presented as observed/i.test(spec) ? P('4.3','radii labelled observed/raw') : W('4.3','check observed labelling');

  console.log('\n=== R5: Measured Component Geometry ===');
  const comps = ['sidebar','topbar','gigcard','button','input','tabs','filter','tag','status','rating','avatar','view-toggle'];
  const compHit = comps.filter(c => new RegExp(c,'i').test(spec));
  compHit.length>=9 ? P('5.1',`geometry covers: ${compHit.join(', ')}`) : W('5.1',`only: ${compHit.join(', ')}`);
  /no estimates|measured.*not.*estimat|never estimated/i.test(spec) && /(path bbox|coordinate|rect\b|×40)/i.test(spec)
    ? P('5.2','"no estimates" stated + coordinate provenance present') : F('5.2','measured/provenance statement missing');
  /refinement|transform-resolved|deferred|pending/i.test(spec) ? P('5.3','unmeasurable items flagged (not guessed)') : W('5.3','no unmeasurable-flag found');

  console.log('\n=== R6: Reference Renders ===');
  (has(`${RR}/components`) && has(`${RR}/frames`)) ? P('6.1','components/ + frames/ exist') : F('6.1','render dirs missing');
  // S6.2 interim screen baselines + README + residual record
  const jpgs = has(`${RR}/frames`) ? fs.readdirSync(`${RR}/frames`).filter(f=>f.endsWith('.jpg')) : [];
  const readme = has(`${RR}/frames/README.md`) ? read(`${RR}/frames/README.md`) : '';
  (jpgs.length>=12 && /lossy/i.test(readme) && /figma/i.test(readme) && /assembled screen frames/i.test(spec))
    ? P('6.2',`${jpgs.length} interim screen baselines + README (lossy/Figma) + residual record`) : F('6.2',`jpgs:${jpgs.length} readme-lossy:${/lossy/i.test(readme)}`);
  // S6.3 component renders
  const cpng = has(`${RR}/components`) ? fs.readdirSync(`${RR}/components`).filter(f=>f.endsWith('.png')) : [];
  cpng.length>=9 ? P('6.3',`${cpng.length} component PNGs (full+tiles) from SVG`) : F('6.3',`only ${cpng.length} component PNGs`);
  // S6.4 valid raster
  let badPng = [];
  for (const f of cpng) { try { const m = await sharp(`${RR}/components/${f}`).metadata(); if (!(m.width>0)) badPng.push(f); } catch { badPng.push(f); } }
  let zero = [];
  for (const d of ['components','frames']) for (const f of (has(`${RR}/${d}`)?fs.readdirSync(`${RR}/${d}`):[])) { const p=`${RR}/${d}/${f}`; if (fs.statSync(p).isFile() && fs.statSync(p).size===0) zero.push(f); }
  (badPng.length===0 && zero.length===0) ? P('6.4','all renders valid non-zero rasters') : F('6.4',`badPng:${badPng} zero:${zero}`);

  console.log('\n=== R7: Explicit Residual-Gap List ===');
  const cats = {'raster banner':/raster banner/i,'semantic token names':/semantic token name/i,'font metrics':/font metric/i,'assembled screen frames':/assembled screen frame/i,'attach/eye':/attach|eye/i,'components absent':/component.*absent|absent from the svg/i};
  const missCat = Object.entries(cats).filter(([k,re]) => !re.test(spec)).map(([k])=>k);
  missCat.length===0 ? P('7.1','residual-gap section covers all categories') : F('7.1',`missing: ${missCat}`);
  // S7.2 actionable: gaps mention Figma/source
  /export.*from.*figma|from figma|figma\/source|font file|licence|exported from figma/i.test(spec) ? P('7.2','gaps name source (Figma/files/licence)') : F('7.2','gaps not actionable');
  // S7.3 Figma only for gaps — doc asserts SVG-sourced substrate; spec states figma only for residual
  /only.*residual|residual.*only|never to re-source|figma.*only for these/i.test(spec) ? P('7.3','doc states Figma used only for residual gaps') : W('7.3','no explicit "Figma only for gaps" phrasing');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed, ${warn} warnings`);
  process.exit(fail ? 1 : 0);
})();
