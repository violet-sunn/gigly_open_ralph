const fs=require('fs'), path=require('path');
const { chromium } = require('playwright');
const sharp=require('sharp');
const SCRATCH=process.argv[2]||'.';
(async()=>{
  const svg=fs.readFileSync('screens/frames.svg','utf8');
  const m=svg.match(/<svg[^>]*\bwidth="([0-9.]+)"[^>]*\bheight="([0-9.]+)"/);
  const W=Math.round(+m[1]), H=Math.round(+m[2]);
  console.log('frames canvas', W,'x',H);
  const band=2200, bands=Math.ceil(H/band);
  const browser=await chromium.launch();
  const page=await browser.newPage({ viewport:{width:W,height:band}, deviceScaleFactor:1 });
  const html=`<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}html,body{background:#01030e}</style></head><body>${svg}</body></html>`;
  await page.setContent(html,{waitUntil:'networkidle'});
  await page.evaluate(([w,h])=>{const el=document.querySelector('svg');el.setAttribute('width',w);el.setAttribute('height',h);el.style.display='block';},[W,H]);
  const parts=[];
  for(let i=0;i<bands;i++){
    const top=i*band;
    await page.evaluate(y=>window.scrollTo(0,y), top);
    await page.waitForTimeout(120);
    const p=path.join(SCRATCH,`frames-band-${i}.png`);
    const buf=await page.screenshot();           // viewport capture
    fs.writeFileSync(p,buf);
    const h=Math.min(band,H-top);
    parts.push({input:await sharp(p).extract({left:0,top:0,width:W,height:h}).png().toBuffer(), top, left:0});
    console.log('band',i,'scrollY',top,'h',h);
  }
  await browser.close();
  await sharp({create:{width:W,height:H,channels:3,background:{r:1,g:3,b:14}}}).composite(parts).png().toFile(path.join(SCRATCH,'frames-full.png'));
  const meta=await sharp(path.join(SCRATCH,'frames-full.png')).metadata();
  console.log('frames-full.png',meta.width,'x',meta.height,Math.round(fs.statSync(path.join(SCRATCH,'frames-full.png')).size/1024)+'KB');
  await sharp(path.join(SCRATCH,'frames-full.png')).resize({width:1200}).png().toFile(path.join(SCRATCH,'frames-preview.png'));
  console.log('preview written');
})().catch(e=>{console.error('FAILED:',e.message);process.exit(1);});
