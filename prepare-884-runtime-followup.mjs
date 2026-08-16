import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 follow-up] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* One timeline owner only: keep the compact v876 training rail, retire v879 row folding. */
{
  const FILE='v879-runtime.js';let src=read(FILE);
  src=regexOnce(src,/function timeline\(\)\{[\s\S]*?\}\nfunction ensureEdit/,
`function timeline(){
 const l=$('#eventList');$('#v879More')?.remove();if(!l)return;
 l.classList.remove('v879Compact');$$(':scope>[data-event]',l).forEach(r=>r.classList.remove('v879Hide'))
}
function ensureEdit`,'retire v879 timeline compactor');
  src=once(src,"new MO(()=>{finishCue();timeline();editEntry()}).observe(evl,{childList:true,subtree:true,characterData:true})","new MO(()=>{finishCue();editEntry()}).observe(evl,{childList:true,subtree:true,characterData:true})",'retire v879 timeline mutation work');
  syntax(src,FILE);write(FILE,src);
}

/* Retire the dock-aware inner-scroll safe zone completely. Natural page scroll + fixed dock/card is safer on iOS. */
{
  const FILE='v8712-runtime.js';let src=read(FILE);
  src=regexOnce(src,/\n;\(\(\)=>\{'use strict';\nconst D=document,\$=s=>D\.querySelector\(s\);let raf=0,ro=null,mo=null;[\s\S]*?window\.__AXIS_883_SAFE_ZONE__=true;\n\}\)\(\);/,
"\n;window.__AXIS_883_SAFE_ZONE__='retired-884';",'retire dynamic timeline safe zone');
  if(src.includes('axis883TimelineSafe'))fail('timeline safe-zone runtime survived');
  syntax(src,FILE);write(FILE,src);
}

/* Completed rows are the only rows that may fold. Header lookup is structural, never sibling-order dependent. */
{
  const FILE='v87-runtime.js';let src=read(FILE);
  const re=/function renderArchive\(c=readCore\(\),m=readMeta\(\)\)\{[\s\S]*?\n\}\nfunction showResult/;
  const fn=`function renderArchive(c=readCore(),m=readMeta()){
 const list=$('#eventList'),section=list?.closest('.section'),head=section?.querySelector('.sectionHead');if(!list||!head||!c.active)return;
 $('#v879More')?.remove();list.classList.remove('v879Compact');
 const rows=Array.from(list.querySelectorAll(':scope>[data-event]'));rows.forEach(r=>r.classList.remove('v879Hide'));
 const done=new Set((c.active.events||[]).filter(e=>m.events?.[e.id]?.activity?.status==='finished').map(e=>e.id)),finished=rows.filter(r=>done.has(r.dataset.event));
 let bar=$('#axis884ArchiveToggle'),count=$('#eventCount');
 if(!finished.length){bar?.remove();rows.forEach(r=>r.classList.remove('axis884Archived'));if(count)count.style.display='';return}
 if(!bar){bar=D.createElement('button');bar.type='button';bar.id='axis884ArchiveToggle';bar.className='axis884ArchiveToggle'}
 if(bar.parentElement!==head)head.append(bar);if(count)count.style.display='none';
 const expanded=list.dataset.axis884ArchiveExpanded==='1';for(const r of rows)r.classList.toggle('axis884Archived',done.has(r.dataset.event)&&!expanded);
 const label=rows.length+' · 已完成 '+finished.length,action=expanded?'收起':'展开';if(bar.dataset.label!==label||bar.dataset.action!==action){bar.dataset.label=label;bar.dataset.action=action;bar.innerHTML='<span>'+label+'</span><b>'+action+'</b>'}
 bar.setAttribute('aria-expanded',String(expanded));bar.onclick=e=>{e.preventDefault();e.stopPropagation();list.dataset.axis884ArchiveExpanded=expanded?'0':'1';renderArchive(readCore(),readMeta())}
}
function showResult`;
  src=regexOnce(src,re,fn,'single completed archive owner');
  if(!src.includes("section?.querySelector('.sectionHead')"))fail('archive structural header lookup missing');
  if(src.includes('head=list?.previousElementSibling'))fail('sibling-order archive lookup survived');
  syntax(src,FILE);write(FILE,src);
}

/* History/session detail is fully painted while invisible, then revealed once stable. */
{
  const FILE='app.js';let src=read(FILE);
  const start="function openSession(id){const s=state.sessions.find(x=>x.id===id);if(!s)return;setText('#detailTitle',dlabel(s.start));";
  const startTo="function openSession(id){const s=state.sessions.find(x=>x.id===id);if(!s)return;const detailSheet=$('#detailSheet');detailSheet?.classList.add('axis884Prepaint');setText('#detailTitle',dlabel(s.start));";
  src=once(src,start,startTo,'history detail prepaint start');
  src=once(src,"openSheet('detailSheet');bindDynamic();hydrateThumbs();$('#sessionReportBtn').onclick=", "openSheet('detailSheet');bindDynamic();hydrateThumbs();requestAnimationFrame(()=>setTimeout(()=>detailSheet?.classList.remove('axis884Prepaint'),72));$('#sessionReportBtn').onclick=",'history detail stable reveal');
  syntax(src,FILE);write(FILE,src);
}

/* Visual cleanup: no nested timeline scroller/sticky fade; archive remains a quiet header action. */
{
  const FILE='v88.css';let css=read(FILE);
  css+=`\n/* AXIS 8.8.4 timeline convergence — one passive rail, natural page scroll, no hit-test overlay. */\n#v879More{display:none!important}\nhtml body #activeHome .axis883TimelineSafe{max-height:none!important;overflow:visible!important;overscroll-behavior:auto!important;scroll-padding-bottom:0!important;padding-bottom:0!important;transform:none!important;margin-bottom:0!important;transition:none!important}\nhtml body #activeHome .axis883TimelineSafe>.sectionHead{position:static!important;top:auto!important;z-index:auto!important;padding:0!important;background:none!important}\nhtml body #activeHome .axis883TimelineSafe:after{display:none!important;content:none!important}\nhtml body #activeHome .sectionHead>#axis884ArchiveToggle{margin-left:auto!important;width:auto!important;height:30px!important;padding:0!important;border:0!important;background:transparent!important;display:inline-flex!important;align-items:center!important;gap:8px!important;color:#7d8591!important;white-space:nowrap!important;position:static!important;z-index:auto!important;pointer-events:auto!important;touch-action:manipulation!important}\nhtml body #activeHome .sectionHead>#axis884ArchiveToggle span{font-size:11px!important;font-weight:520!important;letter-spacing:.005em!important}\nhtml body #activeHome .sectionHead>#axis884ArchiveToggle b{font-size:11px!important;font-weight:650!important;color:#a8aeba!important}\n#detailSheet.axis884Prepaint{visibility:hidden!important;transition:none!important}\n`;
  write(FILE,css);
}

/* Final invariants: old timeline owners cannot return without failing the build. */
{
  const v879=read('v879-runtime.js'),v8712=read('v8712-runtime.js'),v87=read('v87-runtime.js'),app=read('app.js');
  if(v879.includes("classList.add('v879Hide')")||v879.includes("id='v879More'"))fail('v879 folding owner survived');
  if(v8712.includes('axis883TimelineSafe')||v8712.includes('ResizeObserver(q)')||v8712.includes('MutationObserver(q)'))fail('dynamic timeline geometry owner survived');
  if(!v87.includes("section?.querySelector('.sectionHead')"))fail('archive is not structurally anchored');
  if(!app.includes('axis884Prepaint'))fail('history detail prepaint missing');
}
console.log('[AXIS 8.8.4 follow-up] PASS · single timeline owner · natural scroll · completed-only archive · stable history detail reveal');
