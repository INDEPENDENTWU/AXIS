import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 follow-up] ${m}`)};
{
  const FILE='v87-runtime.js';let src=fs.readFileSync(FILE,'utf8');
  const re=/const rows=[^\n;]*?,finished=rows\.filter\(r=>done\.has\(r\.dataset\.event\)\);let bar=/;
  const hits=src.match(new RegExp(re.source,'g'))||[];if(hits.length!==1)fail(`archive row declaration expected once, found ${hits.length}`);
  src=src.replace(re,"const rows=Array.from(list.querySelectorAll('[data-event]')),finished=rows.filter(r=>done.has(r.dataset.event));let bar=");
  const resetFrom="rows.forEach(r=>r.classList.remove('axis884Archived'))";
  let n=src.split(resetFrom).length-1;if(n!==1)fail(`archive reset expected once, found ${n}`);
  const mountFrom='list.prepend(bar)';
  n=src.split(mountFrom).length-1;if(n!==1)fail(`archive mount expected once, found ${n}`);src=src.replace(mountFrom,'list.append(bar)');
  if(!src.includes("const rows=Array.from(list.querySelectorAll('[data-event]'))"))fail('native archive row query missing');
  if(src.includes('list.prepend(bar)'))fail('archive toggle can still be hidden under sticky section header');
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
console.log('[AXIS 8.8.4 follow-up] PASS · archive is native + below sticky header · active timeline cannot extend below the active-card safe edge');
