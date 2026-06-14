// Slice 16x16 icon instances from a Figma-exported flat SVG by walking <g clip-path> blocks.
// Dedupe by normalized path data; emit standalone SVGs + a manifest. No transform surgery:
// the output viewBox is set to each icon's coordinate bounding box.
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2] || 'screens/tokens.svg';
const OUT = process.argv[3] || '/c/Users/apiso/AppData/Local/Temp/gigly_render/icons-raw';
fs.mkdirSync(OUT, { recursive: true });
const s = fs.readFileSync(SRC, 'utf8');

// Find <g clip-path="url(#...)"> ... </g> blocks via depth walk
const blocks = [];
const re = /<g clip-path="url\(#([^)]+)\)"[^>]*>/g;
let m;
while ((m = re.exec(s))) {
  const startTag = m[0], startIdx = m.index, contentStart = m.index + startTag.length;
  let depth = 1, i = contentStart;
  const tag = /<\/?g\b[^>]*>/g; tag.lastIndex = contentStart;
  let t;
  while ((t = tag.exec(s))) {
    if (t[0][1] === '/') { depth--; if (depth === 0) { i = t.index; break; } }
    else depth++;
  }
  const inner = s.slice(contentStart, i);
  blocks.push({ clip: m[1], inner });
}

// bbox from all numbers in d="" of inner paths
function bbox(inner) {
  const ds = [...inner.matchAll(/\bd="([^"]+)"/g)].map(x => x[1]).join(' ');
  const nums = ds.match(/-?\d+(?:\.\d+)?/g);
  if (!nums) return null;
  // crude pairing: SVG path numbers alternate x,y after commands; sample all as candidates
  // Better: collect coordinate pairs by scanning commands. Use a tolerant min/max over pairs.
  const toks = ds.match(/[a-zA-Z]|-?\d+(?:\.\d+)?/g);
  let xs = [], ys = [], expectX = true, cmd = '';
  for (const tk of toks) {
    if (/[a-zA-Z]/.test(tk)) { cmd = tk; expectX = true; continue; }
    const v = parseFloat(tk);
    // commands H/V take single coord
    if (cmd === 'H' || cmd === 'h') { xs.push(v); continue; }
    if (cmd === 'V' || cmd === 'v') { ys.push(v); continue; }
    if (expectX) xs.push(v); else ys.push(v);
    expectX = !expectX;
  }
  if (!xs.length || !ys.length) return null;
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function norm(inner) { return inner.replace(/\s+/g, ' ').replace(/[\d.]+/g, '#').trim(); }

const seen = new Map();
let uniq = 0;
const manifest = [];
for (const b of blocks) {
  const bb = bbox(b.inner);
  if (!bb) continue;
  const w = bb.maxX - bb.minX, h = bb.maxY - bb.minY;
  // icons ~16px; skip oversized (non-icon clip groups)
  if (w > 40 || h > 40 || w < 4 || h < 4) continue;
  const key = norm(b.inner);
  if (seen.has(key)) { manifest[seen.get(key)].count++; continue; }
  const id = uniq++;
  seen.set(key, id);
  // viewBox anchored to integer box around the icon
  const vx = Math.floor(bb.minX), vy = Math.floor(bb.minY);
  const vw = Math.ceil(bb.maxX) - vx, vh = Math.ceil(bb.maxY) - vy;
  const side = Math.max(vw, vh, 16);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="${vx} ${vy} ${side} ${side}" fill="none">\n${b.inner.trim()}\n</svg>\n`;
  fs.writeFileSync(path.join(OUT, `icon-${String(id).padStart(2,'0')}.svg`), svg);
  manifest.push({ id, clip: b.clip, x: vx, y: vy, w: vw, h: vh, count: 1 });
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('blocks:', blocks.length, ' unique icons:', uniq);
console.log('top by frequency:');
manifest.slice().sort((a,b)=>b.count-a.count).slice(0,20)
  .forEach(r=>console.log(`  icon-${String(r.id).padStart(2,'0')}  ${r.w}x${r.h} @(${r.x},${r.y})  x${r.count}`));
