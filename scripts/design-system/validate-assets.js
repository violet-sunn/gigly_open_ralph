const fs=require('fs'), path=require('path');
let bad=0, n=0;
for(const d of ['icons','brand','patterns']){
  const dir=path.join('public/assets/design-system',d);
  for(const f of fs.readdirSync(dir)){
    if(!f.endsWith('.svg'))continue;
    n++;
    const s=fs.readFileSync(path.join(dir,f),'utf8').trim();
    const opens=(s.match(/<svg[\s>]/g)||[]).length;
    const closes=(s.match(/<\/svg>/g)||[]).length;
    const balancedG=(s.match(/<g[\s>]/g)||[]).length===(s.match(/<\/g>/g)||[]).length;
    if(!/^<svg/.test(s)||opens!==1||closes!==1||!balancedG){ console.log('  MALFORMED:',f); bad++; }
  }
}
console.log(`checked ${n} svgs, malformed: ${bad}`);
process.exit(bad?1:0);
