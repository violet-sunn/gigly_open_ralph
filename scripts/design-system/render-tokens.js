// Render tokens.svg (component library sheet) with sharp, full + vertical tiles for inspection.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SCRATCH = process.argv[2] || '.';
const svgPath = 'screens/tokens.svg';
const svg = fs.readFileSync(svgPath);

// native canvas
const m = svg.toString('utf8').match(/<svg[^>]*\bwidth="([0-9.]+)"[^>]*\bheight="([0-9.]+)"/);
const W = Math.round(parseFloat(m[1])), H = Math.round(parseFloat(m[2]));
console.log('canvas', W, 'x', H);

(async () => {
  // Full render at native resolution
  const full = await sharp(svg, { density: 96 }).resize(W).png().toBuffer();
  fs.writeFileSync(path.join(SCRATCH, 'tokens-full.png'), full);
  const meta = await sharp(full).metadata();
  console.log('full png', meta.width, 'x', meta.height, Math.round(full.length/1024)+'KB');

  // Vertical tiles (~1300px tall) for legible inspection
  const tileH = 1300;
  const n = Math.ceil(meta.height / tileH);
  for (let i = 0; i < n; i++) {
    const top = i * tileH;
    const h = Math.min(tileH, meta.height - top);
    const tile = await sharp(full).extract({ left: 0, top, width: meta.width, height: h }).png().toBuffer();
    fs.writeFileSync(path.join(SCRATCH, `tokens-tile-${i}.png`), tile);
  }
  console.log('wrote', n, 'tiles');
})().catch(e => { console.error('RENDER FAILED:', e.message); process.exit(1); });
