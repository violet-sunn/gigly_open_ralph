// Transform-aware leaf extractor for frames.svg: walks tags with a matrix stack,
// computes canvas-space bbox per leaf, supports diag + emit (bakes accumulated transform).
const fs=require('fs');
const SRC='screens/frames.svg';
const s=fs.readFileSync(SRC,'utf8');
const I=[1,0,0,1,0,0]; // a,b,c,d,e,f
function mul(A,B){return [A[0]*B[0]+A[2]*B[1], A[1]*B[0]+A[3]*B[1], A[0]*B[2]+A[2]*B[3], A[1]*B[2]+A[3]*B[3], A[0]*B[4]+A[2]*B[5]+A[4], A[1]*B[4]+A[3]*B[5]+A[5]];}
function parseTransform(t){
  if(!t)return I;
  let M=I.slice();
  for(const m of t.matchAll(/(translate|matrix|scale)\(([^)]+)\)/g)){
    const v=m[2].split(/[ ,]+/).map(Number);
    let T;
    if(m[1]==='translate')T=[1,0,0,1,v[0],v[1]||0];
    else if(m[1]==='scale')T=[v[0],0,0,v[1]==null?v[0]:v[1],0,0];
    else T=v; // matrix
    M=mul(M,T);
  }
  return M;
}
function apply(M,x,y){return [M[0]*x+M[2]*y+M[4], M[1]*x+M[3]*y+M[5]];}
function pathBBox(d){
  const toks=d.match(/[a-zA-Z]|-?\d+(?:\.\d+)?/g)||[];let xs=[],ys=[],ex=true,cmd='';
  for(const tk of toks){if(/[a-zA-Z]/.test(tk)){cmd=tk;ex=true;continue;}const v=parseFloat(tk);
    if(cmd==='H'||cmd==='h'){xs.push(v);continue;}if(cmd==='V'||cmd==='v'){ys.push(v);continue;}
    if(ex)xs.push(v);else ys.push(v);ex=!ex;}
  if(!xs.length||!ys.length)return null;return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
}
// walk
const leaves=[];
const tagRe=/<(\/?)(g|path|rect|circle|defs|clipPath|pattern|filter|mask|linearGradient|radialGradient)\b([^>]*?)(\/?)>/g;
let m, stack=[I.slice()], defsDepth=0;
while((m=tagRe.exec(s))){
  const close=m[1]==='/', name=m[2], attrs=m[3], selfClose=m[4]==='/';
  if(['defs','clipPath','pattern','filter','mask','linearGradient','radialGradient'].includes(name)){
    if(name==='defs'){ if(close)defsDepth--; else if(!selfClose)defsDepth++; }
    continue;
  }
  if(name==='g'){
    if(close){ stack.pop(); }
    else { const t=(attrs.match(/transform="([^"]+)"/)||[])[1]; const M=mul(stack[stack.length-1],parseTransform(t)); if(!selfClose)stack.push(M); }
    continue;
  }
  if(defsDepth>0)continue;
  // leaf: path/rect/circle
  const M=stack[stack.length-1];
  let lb=null;
  if(name==='path'){const d=(attrs.match(/\bd="([^"]+)"/)||[])[1]; if(d)lb=pathBBox(d);}
  else if(name==='rect'){const g=k=>{const r=attrs.match(new RegExp(k+'="([0-9.\-]+)"'));return r?+r[1]:null;};const x=g('x'),y=g('y'),w=g('width'),h=g('height');if(x!=null&&w!=null)lb=[x,y,x+w,y+h];}
  else if(name==='circle'){const g=k=>{const r=attrs.match(new RegExp(k+'="([0-9.\-]+)"'));return r?+r[1]:null;};const cx=g('cx'),cy=g('cy'),r=g('r')||0;if(cx!=null)lb=[cx-r,cy-r,cx+r,cy+r];}
  if(!lb)continue;
  const c1=apply(M,lb[0],lb[1]),c2=apply(M,lb[2],lb[3]),c3=apply(M,lb[0],lb[3]),c4=apply(M,lb[2],lb[1]);
  const X=[c1[0],c2[0],c3[0],c4[0]],Y=[c1[1],c2[1],c3[1],c4[1]];
  leaves.push({raw:m[0],name,M,minX:Math.min(...X),minY:Math.min(...Y),maxX:Math.max(...X),maxY:Math.max(...Y)});
}
const mode=process.argv[2];
if(mode==='diag'){
  const [x0,y0,x1,y1]=process.argv.slice(3).map(Number);
  const hits=leaves.filter(e=>{const cx=(e.minX+e.maxX)/2,cy=(e.minY+e.maxY)/2;return cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1;}).sort((a,b)=>a.minX-b.minX);
  console.log(`leaves total:${leaves.length}  in region:${hits.length}`);
  hits.forEach(e=>console.log(`  ${e.name} canvas x=${e.minX.toFixed(0)}-${e.maxX.toFixed(0)} y=${e.minY.toFixed(0)}-${e.maxY.toFixed(0)}  ${e.raw.slice(0,30)}`));
}
if(mode==='emit'){
  const OUT=process.argv[3];const [x0,y0,x1,y1]=process.argv.slice(4).map(Number);
  const hits=leaves.filter(e=>{const cx=(e.minX+e.maxX)/2,cy=(e.minY+e.maxY)/2;return cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1;});
  if(!hits.length){console.log('NONE');process.exit(0);}
  const minX=Math.min(...hits.map(e=>e.minX)),minY=Math.min(...hits.map(e=>e.minY)),maxX=Math.max(...hits.map(e=>e.maxX)),maxY=Math.max(...hits.map(e=>e.maxY));
  const vx=Math.floor(minX),vy=Math.floor(minY),vw=Math.ceil(maxX)-vx,vh=Math.ceil(maxY)-vy;
  const body=hits.map(e=>`<g transform="matrix(${e.M.join(',')})">${e.raw}</g>`).join('\n');
  fs.writeFileSync(OUT,`<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="${vx} ${vy} ${vw} ${vh}" fill="none">\n${body}\n</svg>\n`);
  console.log(`emit ${OUT} ${hits.length} els viewBox=${vx} ${vy} ${vw} ${vh}`);
}
