const sharp=require('sharp'), fs=require('fs'), path=require('path');
const S=process.argv[2];
(async()=>{
  const full=path.join(S,'frames-full.png');
  const meta=await sharp(full).metadata();
  const w=Math.min(1300,meta.width), tileH=1500, n=Math.ceil(meta.height/tileH);
  for(let i=0;i<n;i++){const top=i*tileH,h=Math.min(tileH,meta.height-top);
    await sharp(full).extract({left:0,top,width:w,height:h}).png().toFile(path.join(S,`fr-col-${i}.png`));}
  console.log('frames left-col tiles:',n,'(',w,'wide )');
})().catch(e=>{console.error(e.message);process.exit(1);});
