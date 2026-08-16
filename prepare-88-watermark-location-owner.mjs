import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8 watermark location owner: ${m}`)};
const FILE='v85-canvas-fix.js';
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);src=src.replace(from,to)};

// v85-canvas-fix is a historical canvas compatibility module, not a visible preference owner.
// Retire its capture-phase location switch interception completely.
const owner=/function setGeo\(on,g=null\)\{[^\n]*\}\nD\.addEventListener\('click',e=>\{const b=e\.target\.closest\?\.\('#v85WmLocation'\);[^\n]*\},true\);/;
const hits=src.match(new RegExp(owner.source,'g'))||[];
if(hits.length!==1)fail(`legacy canvas location owner expected once, found ${hits.length}`);
src=src.replace(owner,'');

// It may still render capture frames, so it must observe the same Time contract and never paint coordinates.
once("return{name:p.v85WmName!==false,data:p.v85WmData!==false,location:!!p.v85WmLocation,pos:p.v85WmPos||c.prefs?.watermark?.pos||'bl',geo:p.v85LastGeo||null}","return{name:p.v85WmName!==false,data:p.v85WmData!==false,location:!!p.v85WmLocation,time:p.v85WmTime!==false,pos:p.v85WmPos||c.prefs?.watermark?.pos||'bl',geo:p.v85LastGeo||null}",'canvas preference shape');
once("const dt=new Date(ts),meta=`${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`+(p.location&&p.geo?` · ${coord(p.geo)}`:'');","const dt=new Date(ts),meta=p.time?`${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`:'';",'canvas metadata privacy/time contract');
once("c.font=`520 ${Math.max(9,sm*.82)}px -apple-system,BlinkMacSystemFont,Arial`;mw=Math.max(mw,c.measureText(meta).width);const lh=Math.round(f*1.28),bw=mw+pd*2,bh=pd*1.35+lh*(lines.length+1.45)","if(meta){c.font=`520 ${Math.max(9,sm*.82)}px -apple-system,BlinkMacSystemFont,Arial`;mw=Math.max(mw,c.measureText(meta).width)}const lh=Math.round(f*1.28),bw=mw+pd*2,bh=pd*1.35+lh*(lines.length+(meta?1.45:.45))",'canvas metadata geometry');
once("c.font=`520 ${Math.max(9,Math.round(sm*.82))}px -apple-system,BlinkMacSystemFont,Arial`;c.fillStyle='#9aa1ad';c.fillText(meta,x+pd,ty+1);c.restore()","if(meta){c.font=`520 ${Math.max(9,Math.round(sm*.82))}px -apple-system,BlinkMacSystemFont,Arial`;c.fillStyle='#9aa1ad';c.fillText(meta,x+pd,ty+1)}c.restore()",'canvas metadata draw');

if(/setGeo\(|closest\?\.\('#v85WmLocation'\)/.test(src))fail('legacy canvas location switch owner survived');
const withoutCoordHelper=src.replace(/function coord\(g\)\{[^\n]*\}/,'');
if(/coord\(p\.geo\)|toFixed\(4\).*N/.test(withoutCoordHelper))fail('raw-coordinate canvas painter survived');
try{new Function(src)}catch(e){fail(`syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8 watermark location] convergence passed · canvas-fix no longer owns location switch · time contract shared · raw coordinates not painted');