import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 follow-up] ${m}`)};
{
  const FILE='v87-runtime.js';let src=fs.readFileSync(FILE,'utf8');
  const filterFrom="finished=rows.filter(r=>done.has(r.dataset.event))";
  const filterTo="finished=Array.from(rows).filter(r=>done.has(r.dataset.event))";
  let n=src.split(filterFrom).length-1;if(n!==1)fail(`archive filter expected once, found ${n}`);src=src.replace(filterFrom,filterTo);
  const resetFrom="rows.forEach(r=>r.classList.remove('axis884Archived'))";
  const resetTo="Array.from(rows).forEach(r=>r.classList.remove('axis884Archived'))";
  n=src.split(resetFrom).length-1;if(n!==1)fail(`archive reset expected once, found ${n}`);src=src.replace(resetFrom,resetTo);
  if(/rows\.forEach\(r=>r\.classList\.(?:remove|toggle)\('axis884Archived'/.test(src))fail('unsafe archive row iteration survived');
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
console.log('[AXIS 8.8.4 follow-up] PASS · completed archive iteration is Array-safe · active timeline cannot extend below the active-card safe edge');
