const fs=require('fs'), path=require('path');
const RAW=process.argv[2], OUT=process.argv[3];
// map: source slice -> [name, aria-label]
const MAP=[
  ['icon-00','dashboard','Dashboard'],
  ['icon-01','search','Search'],
  ['icon-02','bell','Notifications'],
  ['icon-03','gear','Settings'],
  ['icon-04','radio-off','Radio unselected'],
  ['icon-05','radio-on','Radio selected'],
  ['icon-07','filter','Filter'],
  ['icon-12','clear','Clear'],
  ['icon-13','verified','Verified'],
  ['icon-14','star','Rating star'],
  ['r-my-gigs','my-gigs','My gigs'],
  ['r-chats','chats','Chats'],
  ['r-finances','finances','Finances'],
  ['r-disputes','disputes','Disputes'],
  ['r-view-toggle','view-toggle','Toggle view'],
  ['r-grid','grid','Grid view'],
  ['r-list','list','List view'],
];
let n=0;
for(const [src,name,label] of MAP){
  const p=path.join(RAW, src+'.svg');
  if(!fs.existsSync(p)){ console.log('MISSING SRC',src); continue; }
  let svg=fs.readFileSync(p,'utf8');
  // inject role+aria-label into the <svg ...> open tag (after xmlns)
  svg=svg.replace(/<svg /, `<svg role="img" aria-label="${label}" `);
  // collapse whitespace lightly
  svg=svg.replace(/\n\s*\n/g,'\n').trim()+'\n';
  fs.writeFileSync(path.join(OUT, name+'.svg'), svg);
  n++;
}
// synthesize a faithful status-dot (a dot is geometrically exact, tinted per status via currentColor)
fs.writeFileSync(path.join(OUT,'status-dot.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" role="img" aria-label="Status indicator"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>\n`);
n++;
console.log('wrote',n,'icons');
