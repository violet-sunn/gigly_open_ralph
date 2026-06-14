const fs=require('fs'), path=require('path');
const SRC=process.argv[2]||'screens/tokens.svg';
const s=fs.readFileSync(SRC,'utf8');
function pathBBox(d){
  const toks=d.match(/[a-zA-Z]|-?\d+(?:\.\d+)?/g)||[];
  let xs=[],ys=[],ex=true,cmd='';
  for(const tk of toks){
    if(/[a-zA-Z]/.test(tk)){cmd=tk;ex=true;continue;}
    const v=parseFloat(tk);
    if(cmd==='H'||cmd==='h'){xs.push(v);continue;}
    if(cmd==='V'||cmd==='v'){ys.push(v);continue;}
    if(ex)xs.push(v);else ys.push(v); ex=!ex;
  }
  if(!xs.length||!ys.length)return null;
  return {minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)};
}
const els=[];
for(const m of s.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*\/?>/g)){const bb=pathBBox(m[1]);if(bb)els.push({raw:m[0],type:'path',...bb});}
for(const m of s.matchAll(/<rect\b([^>]*?)\/?>/g)){const a=m[1],g=k=>{const r=a.match(new RegExp('\b'+k+'="([0-9.\-]+)"'));return r?parseFloat(r[1]):null;};const x=g('x'),y=g('y'),w=g('width'),h=g('height');if(x!=null&&w!=null)els.push({raw:m[0],type:'rect',minX:x,minY:y,maxX:x+w,maxY:y+h});}
for(const m of s.matchAll(/<circle\b([^>]*?)\/?>/g)){const a=m[1],g=k=>{const r=a.match(new RegExp('\b'+k+'="([0-9.\-]+)"'));return r?parseFloat(r[1]):null;};const cx=g('cx'),cy=g('cy'),r=g('r')||0;if(cx!=null)els.push({raw:m[0],type:'circle',minX:cx-r,minY:cy-r,maxX:cx+r,maxY:cy+r});}

const mode=process.argv[3];
if(mode==='diag'){
  const [x0,y0,x1,y1]=process.argv.slice(4).map(Number);
  const hits=els.filter(e=>e.minX>=x0-2&&e.maxX<=x1+2&&e.minY>=y0-2&&e.maxY<=y1+2).sort((a,b)=>a.minY-b.minY);
  console.log(`[${x0},${y0}]-[${x1},${y1}]: ${hits.length} els`);
  hits.forEach(e=>console.log(`  ${e.type} y=${e.minY.toFixed(0)}-${e.maxY.toFixed(0)} x=${e.minX.toFixed(0)}-${e.maxX.toFixed(0)} ${e.raw.slice(0,34)}`));
}
if(mode==='circles'){
  els.filter(e=>e.type==='circle').sort((a,b)=>a.minY-b.minY).forEach(e=>console.log(`  cy=${((e.minY+e.maxY)/2).toFixed(0)} cx=${((e.minX+e.maxX)/2).toFixed(0)} r=${((e.maxX-e.minX)/2).toFixed(1)} ${e.raw.slice(0,60)}`));
}
if(mode==='emit'){
  const OUT=process.argv[4];
  const [x0,y0,x1,y1]=process.argv.slice(5).map(Number);
  const hits=els.filter(e=>{const cx=(e.minX+e.maxX)/2,cy=(e.minY+e.maxY)/2;return cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1;});
  if(!hits.length){console.log('NO ELEMENTS in region');process.exit(0);}
  const minX=Math.min(...hits.map(e=>e.minX)),minY=Math.min(...hits.map(e=>e.minY));
  const maxX=Math.max(...hits.map(e=>e.maxX)),maxY=Math.max(...hits.map(e=>e.maxY));
  const vx=Math.floor(minX),vy=Math.floor(minY),vw=Math.ceil(maxX)-vx,vh=Math.ceil(maxY)-vy;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="${vx} ${vy} ${vw} ${vh}" fill="none">\n${hits.map(e=>e.raw).join('\n')}\n</svg>\n`;
  fs.writeFileSync(OUT,svg);
  console.log(`emit ${OUT}  ${hits.length} els  viewBox=${vx} ${vy} ${vw} ${vh}`);
}
