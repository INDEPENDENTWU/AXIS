import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 follow-up] ${m}`)};
{
  const FILE='v87-runtime.js';let src=fs.readFileSync(FILE,'utf8');
  const re=/function renderArchive\(c=readCore\(\),m=readMeta\(\)\)\{[\s\S]*?\n\}\nfunction showResult/;
  const hits=src.match(new RegExp(re.source,'g'))||[];if(hits.length!==1)fail(`archive owner expected once, found ${hits.length}`);
  const fn=`function renderArchive(c=readCore(),m=readMeta()){
 const list=$('#eventList'),head=list?.previousElementSibling;if(!list||!head||!c.active)return;
 const done=new Set((c.active.events||[]).filter(e=>m.events?.[e.id]?.activity?.status==='finished').map(e=>e.id));
 const rows=Array.from(list.querySelectorAll('[data-event]')),finished=rows.filter(r=>done.has(r.dataset.event));let bar=$('#axis884ArchiveToggle'),count=$('#eventCount');
 if(!finished.length){bar?.remove();rows.forEach(r=>r.classList.remove('axis884Archived'));if(count)count.style.display='';return}
 if(!bar){bar=D.createElement('button');bar.type='button';bar.id='axis884ArchiveToggle';bar.className='axis884ArchiveToggle';head.append(bar)}
 if(count)count.style.display='none';
 const expanded=list.dataset.axis884ArchiveExpanded==='1';finished.forEach(r=>r.classList.toggle('axis884Archived',!expanded));bar.setAttribute('aria-expanded',String(expanded));bar.innerHTML='<span>'+rows.length+' · 已完成 '+finished.length+'</span><b>'+(expanded?'收起':'展开')+'</b>';
 bar.onclick=()=>{list.dataset.axis884ArchiveExpanded=expanded?'0':'1';renderArchive(readCore(),readMeta())}
}
function showResult`;
  src=src.replace(re,fn);
  if(!src.includes("head.append(bar)"))fail('archive header mount missing');
  if(src.includes('list.prepend(bar)')||src.includes('list.append(bar)'))fail('archive control still lives in scroll body');
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
{
  const FILE='v88.css';let css=fs.readFileSync(FILE,'utf8');
  css+=`\n/* AXIS 8.8.4 archive header control — lives in the sticky timeline header, never under it. */\nhtml body #activeHome .sectionHead>#axis884ArchiveToggle{margin-left:auto!important;width:auto!important;height:30px!important;padding:0!important;border:0!important;background:transparent!important;display:inline-flex!important;align-items:center!important;gap:8px!important;color:#7d8591!important;white-space:nowrap!important;position:relative!important;z-index:5!important;pointer-events:auto!important;touch-action:manipulation!important}\nhtml body #activeHome .sectionHead>#axis884ArchiveToggle span{font-size:11px!important;font-weight:520!important;letter-spacing:.005em!important}\nhtml body #activeHome .sectionHead>#axis884ArchiveToggle b{font-size:11px!important;font-weight:650!important;color:#a8aeba!important}\n`;
  fs.writeFileSync(FILE,css);
}
console.log('[AXIS 8.8.4 follow-up] PASS · completed archive control is a native sticky-header action · active timeline cannot extend below the active-card safe edge');
