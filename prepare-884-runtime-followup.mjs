import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 follow-up] ${m}`)};
{
  const FILE='v87-runtime.js';let src=fs.readFileSync(FILE,'utf8');
  const from="const rows=$$('#eventList [data-event]'),finished=rows.filter(r=>done.has(r.dataset.event));";
  const to="const rows=Array.from(list.querySelectorAll('[data-event]')),finished=rows.filter(r=>done.has(r.dataset.event));";
  const n=src.split(from).length-1;if(n!==1)fail(`archive collection expected once, found ${n}`);src=src.replace(from,to);
  try{new Function(src)}catch(e){fail(`v87 syntax ${e.message}`)}
  fs.writeFileSync(FILE,src);
}
{
  const FILE='v8712-runtime.js';let src=fs.readFileSync(FILE,'utf8');
  const from="const top=sr.top,maxH=Math.max(126,Math.floor(safeTop-top));section.style.maxHeight=maxH+'px';";
  const to="const top=sr.top,maxH=Math.max(0,Math.floor(safeTop-top));section.style.maxHeight=maxH+'px';";
  const n=src.split(from).length-1;if(n!==1)fail(`strict safe-zone height expected once, found ${n}`);src=src.replace(from,to);
  try{new Function(src)}catch(e){fail(`v8712 syntax ${e.message}`)}
  fs.writeFileSync(FILE,src);
}
console.log('[AXIS 8.8.4 follow-up] PASS · explicit archive Array · active timeline cannot extend below the active-card safe edge');
