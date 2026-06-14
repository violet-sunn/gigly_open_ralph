const fs=require('fs'),path=require('path'),sharp=require('sharp');
const DIR=process.argv[2], pat=new RegExp(process.argv[3]||'.');
const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.svg')&&pat.test(f)).sort();
const CELL=140,ICON=76,COLS=4;
const rows=Math.ceil(files.length/COLS),W=COLS*CELL,H=rows*CELL;
(async()=>{
  const comps=[];
  for(let i=0;i<files.length;i++){
    const buf=fs.readFileSync(path.join(DIR,files[i]));
    let png; try{png=await sharp(buf,{density:400}).resize(ICON,ICON,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();}catch(e){console.log('fail',files[i],e.message);continue;}
    const col=i%COLS,row=Math.floor(i/COLS);
    comps.push({input:png,left:col*CELL+(CELL-ICON)/2|0,top:row*CELL+12});
    const name=files[i].replace(/\.svg$/,'').replace(/^(r-|icon-)/,'');
    const lbl=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="20"><text x="6" y="14" fill="#4cacff" font-family="monospace" font-size="13">${name}</text></svg>`);
    comps.push({input:lbl,left:col*CELL,top:row*CELL+CELL-22});
  }
  await sharp({create:{width:W,height:H,channels:4,background:{r:26,g:26,b:36,alpha:1}}}).composite(comps).png().toFile(path.join(DIR,'..','sheet-region.png'));
  console.log('sheet:',files.length,'svgs');
})().catch(e=>{console.error(e);process.exit(1)});
