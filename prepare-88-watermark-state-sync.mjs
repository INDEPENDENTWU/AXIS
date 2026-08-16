import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8 watermark state sync: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

{
  const FILE='v85-runtime.js';
  let src=read(FILE);
  src=once(src,
    "function setWm(k,v){const m=readMeta();m.prefs[k]=v;writeMeta(m);renderWm()}",
    "function setWm(k,v){const m=readMeta();m.prefs[k]=v;if(!writeMeta(m))return false;renderWm();window.dispatchEvent(new CustomEvent('axis:watermark-pref-change',{detail:{key:k,value:v}}));return true}",
    'canonical watermark preference writer event');
  syntax(src,FILE);write(FILE,src);
}

{
  const FILE='v8710-watermark.js';
  let src=read(FILE);
  const old="D.addEventListener('input',e=>{if(e.target.id==='v877OpacityRange'||e.target.id==='v876OpacityRange')setTimeout(render,0)},true);D.addEventListener('click',e=>{if(e.target.closest('#v85WmName,#v85WmData,#v85WmLocation,#v85WmTime'))setTimeout(render,0)},false);";
  const next="D.addEventListener('input',e=>{if(e.target.id==='v877OpacityRange'||e.target.id==='v876OpacityRange')setTimeout(render,0)},true);window.addEventListener('axis:watermark-pref-change',e=>{const d=e.detail||{};if(d.key==='v85WmLocation'&&d.value===true)refreshPlace();else render()});";
  src=once(src,old,next,'retire click-order watermark repaint');
  if(src.includes("e.target.closest('#v85WmName,#v85WmData,#v85WmLocation,#v85WmTime')"))fail('click-order watermark repaint survived');
  if(!src.includes("axis:watermark-pref-change"))fail('canonical watermark preference event missing');
  syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.8 watermark state] convergence passed · persisted preference event -> one final preview owner');