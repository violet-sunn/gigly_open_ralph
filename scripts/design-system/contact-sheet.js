const fs=require('fs'), path=require('path'), sharp=require('sharp');
const DIR=process.argv[2];
const files=fs.readdirSync(DIR).filter(f=>/^icon-\d+\.svg$/.test(f)).sort();
const CELL=110, ICON=72, COLS=5, PAD=18;
const rows=Math.ceil(files.length/COLS);
const W=COLS*CELL, H=rows*CELL;
(async()=>{
  const comps=[];
  for(let i=0;i<files.length;i++){
    const buf=fs.readFileSync(path.join(DIR,files[i]));
    // recolor: force a visible stroke/fill by wrapping on light bg cell instead
    let png;
    try { png=await sharp(buf,{density:300}).resize(ICON,ICON,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer(); }
    catch(e){ console.log('fail',files[i],e.message); continue; }
    const col=i%COLS, row=Math.floor(i/COLS);
    comps.push({input:png, left:col*CELL+(CELL-ICON)/2|0, top:row*CELL+(CELL-ICON)/2|0});
    // index label as small white SVG text
    const lbl=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="16"><text x="3" y="12" fill="#4cacff" font-family="monospace" font-size="12">${i.toString().padStart(2,'0')}</text></svg>`);
    comps.push({input:lbl,left:col*CELL,top:row*CELL+CELL-16});
  }
  await sharp({create:{width:W,height:H,channels:4,background:{r:26,g:26,b:36,alpha:1}}})
    .composite(comps).png().toFile(path.join(DIR,'..','icons-contact-sheet.png'));
  console.log('contact sheet:',files.length,'icons,',COLS,'x',rows);
})().catch(e=>{console.error(e);process.exit(1)});
