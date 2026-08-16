import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 field fix] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Final saved-photo watermark has one physical owner. Historical canvas/restamp layers remain compatibility-only. */
{
  const FILE='v85-canvas-fix.js';let src=read(FILE);
  src=regexOnce(src,/P\.drawImage=function\(src,\.\.\.args\)\{[\s\S]*?return out\};/,"P.drawImage=function(src,...args){return native.call(this,src,...args)};",'retire v85 physical watermark painter');
  syntax(src,FILE);write(FILE,src);
}
{
  const FILE='v876-runtime.js';let src=read(FILE);
  src=regexOnce(src,/function installCanvasFinal\(\)\{[\s\S]*?\}\nfunction timelineStatus/,"function installCanvasFinal(){return false}\nfunction timelineStatus",'retire v876 canvas watermark painter');
  src=src.replace('<button id="v876Locate">获取当前位置</button><button id="v876EditPlace">编辑名称</button>','<button id="v876Locate">更新位置</button><button id="v876EditPlace">编辑</button>');
  syntax(src,FILE);write(FILE,src);
}
{
  const FILE='v877-runtime.js';let src=read(FILE);
  src=regexOnce(src,/function prepRawForSave\(\)\{[\s\S]*?\}\nfunction bind/,"function prepRawForSave(){return false}\nfunction bind",'retire v877 physical restamp owner');
  src=src.replace(/Math\.max\(4,Math\.min\(48,Number\(e\.target\.value\)\|\|18\)\)/g,'Math.max(1,Math.min(100,Number(e.target.value)||18))');
  src=src.replace("if(range)range.value=String(p.opacity);","if(range){range.value=String(p.opacity);range.style.setProperty('--axis-opacity-pct',p.opacity+'%')};");
  if(/Math\.min\(48,Number\(e\.target\.value\)/.test(src))fail('v877 opacity input still clamps at 48');
  syntax(src,FILE);write(FILE,src);
}
{
  const FILE='v8710-watermark.js';let src=read(FILE);
  src=src.replace("brand.style.opacity=String(Math.max(.04,Math.min(.48,p.opacity/100)))","brand.style.opacity=String(Math.max(.01,Math.min(1,p.opacity/100)))");
  src=src.replace('async function stamp(blob,e){','async function stamp(blob,e,shot=null){');
  src=src.replace('const p=pref(),L=p.resolvedLang','const p=shot||pref(),L=(shot||pref()).resolvedLang');
  src=src.replace("if(e.target.closest('#watermarkBtn'))setTimeout(()=>{ensure();refreshPlace()},120)","if(e.target.closest('#watermarkBtn'))setTimeout(()=>{ensure();render()},120)");
  src=src.replace("if(e.target.closest('#v876Locate'))setTimeout(()=>refreshPlace(true),0)","if(e.target.closest('#v876Locate')){const b=$('#v876Locate');if(b){b.disabled=true;b.textContent='定位中…'}refreshPlace(true).finally(()=>{const x=$('#v876Locate');if(x){x.disabled=false;x.textContent='更新位置'}});return}");
  src=regexOnce(src,/async function finishStamp\(a\)\{[\s\S]*?\}\nfunction arm\(\)\{[\s\S]*?\}\nfunction suppressLegacy\(\)\{[\s\S]*?\}\nfunction bind\(\)\{/,
`async function finishStamp(a){
 try{
  const shot=await a.shot,e=await newest(a.before);if(!e)return;
  await new Promise(r=>setTimeout(r,280));
  for(const ref of e.frameRefs||[]){const b=await dbGet(ref);if(!b)continue;const out=await stamp(b,e,shot);if(out)await dbPut(ref,out)}
 }catch(e){console.warn('[AXIS] final watermark skipped',e)}finally{
  const c=core();c.prefs=c.prefs||{};c.prefs.watermark=c.prefs.watermark||{};c.prefs.watermark.photoMode=a.oldMode||'wm';write(CORE,c);render()
 }
}
function arm(){
 const wm=$('#photoWmMode [data-value="wm"]');if(!wm?.classList.contains('active')){armed=null;return}
 const c=core(),p=pref(),shot={...p,geo:p.geo?{...p.geo}:null};
 armed={before:new Set((c.active?.events||[]).map(e=>e.id)),oldMode:c.prefs?.watermark?.photoMode||'wm',shot:Promise.resolve(shot)}
}
function suppressLegacy(){
 if(!armed)return;const a=armed;armed=null;const c=core();c.prefs=c.prefs||{};c.prefs.watermark=c.prefs.watermark||{};c.prefs.watermark.photoMode='raw';write(CORE,c);setTimeout(()=>finishStamp(a),0)
}
function bind(){`,'canonical watermark snapshot + raw legacy suppression');
  if(!src.includes("window.__AXIS_8710_WATERMARK_READY__=true"))fail('v8710 watermark readiness marker missing');
  src=src.replace("window.__AXIS_8710_WATERMARK_READY__=true;","window.__AXIS_8710_WATERMARK_READY__=true;window.__AXIS_WATERMARK_PHYSICAL_OWNER__='v8710';window.__AXIS_LOCATION_OWNER__='v8710';");
  syntax(src,FILE);write(FILE,src);
}

/* Multi-item active control gets one direct owner. Reconciliation uses the newest real activity timestamp. */
{
  const FILE='v87-runtime.js';let src=read(FILE);
  src=src.replace("(y.a.lastResumedAt||0)-(x.a.lastResumedAt||0)","(y.a.lastResumedAt||y.a.startedAt||0)-(x.a.lastResumedAt||x.a.startedAt||0)");
  src=src.replace("current&&(current.a.startedAt||current.a.lastResumedAt||0)>(x.a.planCompletedAt||0)","current&&Math.max(current.a.startedAt||0,current.a.lastResumedAt||0)>(x.a.planCompletedAt||0)");
  for(const old of [
    "if(e.target.closest('#v87Toggle')){toggle($('#v87Toggle').dataset.id);return}",
    "if(e.target.closest('#v87Primary')&&!$('#v87Primary').disabled){completeSet($('#v87Primary').dataset.id);return}",
    "if(e.target.closest('#v87Add')){addSet($('#v87Add').dataset.id);return}",
    "const sw=e.target.closest('#v87Paused button');if(sw){toggle(sw.dataset.id);return}"
  ])src=once(src,old,'','retire delegated active action '+old.slice(0,24));
  src=once(src,'function installEvents(){',`function installActiveControlOwner(){
 const host=$('#v87Now');if(!host||host.dataset.axis884Owner==='1')return;host.dataset.axis884Owner='1';
 host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!host.contains(b)||b.id==='v87Finish')return;
  if(b.id==='v87Toggle'){e.preventDefault();e.stopPropagation();toggle(b.dataset.id);return}
  if(b.id==='v87Primary'&&!b.disabled){e.preventDefault();e.stopPropagation();completeSet(b.dataset.id);return}
  if(b.id==='v87Add'){e.preventDefault();e.stopPropagation();addSet(b.dataset.id);return}
  if(b.closest('#v87Paused')){e.preventDefault();e.stopPropagation();toggle(b.dataset.id);return}
 },false);
 window.__AXIS_ACTIVE_CONTROL__={owner:'v87-direct-884',toggle,activePair,pausedPairs};
}
function installEvents(){`,'direct active-control owner');
  src=once(src,'function boot(){injectStyle();ensureUI();migrateAudio();injectAudio();installEvents();',"function boot(){injectStyle();ensureUI();installActiveControlOwner();migrateAudio();injectAudio();installEvents();",'mount direct active-control owner');
  src=once(src,"else line?.remove()}}\nfunction showResult",`else line?.remove()}renderArchive(c,m)}
function renderArchive(c=readCore(),m=readMeta()){
 const list=$('#eventList');if(!list||!c.active)return;const done=new Set((c.active.events||[]).filter(e=>m.events?.[e.id]?.activity?.status==='finished').map(e=>e.id));
 const rows=$$('#eventList [data-event]'),finished=rows.filter(r=>done.has(r.dataset.event));let bar=$('#axis884ArchiveToggle');
 if(!finished.length){bar?.remove();rows.forEach(r=>r.classList.remove('axis884Archived'));return}
 if(!bar){bar=D.createElement('button');bar.type='button';bar.id='axis884ArchiveToggle';bar.className='axis884ArchiveToggle';list.prepend(bar)}
 const expanded=list.dataset.axis884ArchiveExpanded==='1';finished.forEach(r=>r.classList.toggle('axis884Archived',!expanded));bar.setAttribute('aria-expanded',String(expanded));bar.innerHTML='<span>已完成 '+finished.length+' 项</span><b>'+(expanded?'收起':'展开')+'</b>';
 bar.onclick=()=>{list.dataset.axis884ArchiveExpanded=expanded?'0':'1';renderArchive(readCore(),readMeta())}
}
function showResult`,'completed-item archive');
  syntax(src,FILE);write(FILE,src);
}

/* Historical flow may render a rail, but no longer hides arbitrary rows by index. */
{
  const FILE='v874-professional.js';let src=read(FILE);
  src=once(src,"rows.forEach((row,i)=>row.classList.toggle('v874Folded',!flowExpanded&&i>=3));","rows.forEach(row=>row.classList.remove('v874Folded'));",'retire index-based event folding');
  syntax(src,FILE);write(FILE,src);
}

/* Completed Home shows both boundaries of the workout, not only the finish time. */
{
  const FILE='app.js';let src=read(FILE);
  src=once(src,"const items=ev(last).length,sets=homeCompletedSets(last,m),parts=[items+'项'];if(sets)parts.push(sets+'组');parts.push('完成于 '+tlabel(end));","const items=ev(last).length,sets=homeCompletedSets(last,m),parts=['开始 '+tlabel(Number(last.start)||end),'完成 '+tlabel(end),items+'项'];if(sets)parts.push(sets+'组');",'completed Home start time');
  syntax(src,FILE);write(FILE,src);
}

/* Safe zone ends above the active card itself and avoids transformed hit-test layers on iOS. */
{
  const FILE='v8712-runtime.js';let src=read(FILE);
  src=once(src,"const vv=window.visualViewport,viewportBottom=vv?(vv.offsetTop+vv.height):window.innerHeight,dr=dock.getBoundingClientRect(),safeTop=Math.min(viewportBottom,dr.top)-14,sr=section.getBoundingClientRect(),prev=section.previousElementSibling,prevBottom=prev?prev.getBoundingClientRect().bottom:sr.top,freeGap=Math.max(0,sr.top-prevBottom),overlap=Math.max(0,sr.bottom-safeTop),lift=Math.min(64,overlap,Math.max(0,freeGap-16));section.classList.add('axis883TimelineSafe');D.body.classList.add('axis883-active-safe');section.style.setProperty('--axis883-lift',lift+'px');section.style.transform=lift?'translateY(-'+lift+'px)':'';section.style.marginBottom=lift?(-lift)+'px':'';const top=sr.top-lift,maxH=Math.max(126,Math.floor(safeTop-top));","const vv=window.visualViewport,viewportBottom=vv?(vv.offsetTop+vv.height):window.innerHeight,dr=dock.getBoundingClientRect(),nr=$('#v87Now')?.classList.contains('show')?$('#v87Now').getBoundingClientRect():null,safeTop=Math.min(viewportBottom,dr.top,nr?.top??Infinity)-14,sr=section.getBoundingClientRect();section.classList.add('axis883TimelineSafe');D.body.classList.add('axis883-active-safe');section.style.removeProperty('--axis883-lift');section.style.transform='';section.style.marginBottom='';const top=sr.top,maxH=Math.max(126,Math.floor(safeTop-top));",'active-card-aware safe zone');
  syntax(src,FILE);write(FILE,src);
}

/* Touch geometry and settings polish: large precise slider, compact location actions, restrained archive row. */
{
  const FILE='v88.css';let css=read(FILE);
  if(css.includes('AXIS 8.8.4 field-test fixes'))fail('8.8.4 CSS duplicated');
  css+=`\n\n/* AXIS 8.8.4 field-test fixes */
#watermarkSheet #v877OpacityRange{-webkit-appearance:none!important;appearance:none!important;width:100%!important;height:34px!important;margin:10px 0 0!important;padding:0!important;background:transparent!important;touch-action:manipulation!important;--axis-opacity-pct:18%}
#watermarkSheet #v877OpacityRange::-webkit-slider-runnable-track{height:5px!important;border-radius:999px!important;background:linear-gradient(90deg,#737cff 0 var(--axis-opacity-pct),#2a2e37 var(--axis-opacity-pct) 100%)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.045)!important}
#watermarkSheet #v877OpacityRange::-webkit-slider-thumb{-webkit-appearance:none!important;appearance:none!important;width:27px!important;height:27px!important;margin-top:-11px!important;border-radius:50%!important;background:#f4f3ef!important;border:7px solid #737cff!important;box-shadow:0 4px 16px rgba(0,0,0,.34),0 0 0 1px rgba(255,255,255,.12)!important}
#watermarkSheet #v877OpacityRange::-moz-range-track{height:5px!important;border-radius:999px!important;background:#2a2e37!important}
#watermarkSheet #v877OpacityRange::-moz-range-progress{height:5px!important;border-radius:999px!important;background:#737cff!important}
#watermarkSheet #v877OpacityRange::-moz-range-thumb{width:15px!important;height:15px!important;border-radius:50%!important;background:#f4f3ef!important;border:6px solid #737cff!important}
#watermarkSheet .v876LocationActions{display:flex!important;justify-content:flex-end!important;gap:8px!important;margin-top:10px!important}
#watermarkSheet .v876LocationActions button{width:auto!important;min-width:0!important;height:36px!important;padding:0 13px!important;border-radius:11px!important;font-size:11.5px!important;font-weight:630!important;touch-action:manipulation!important}
#watermarkSheet #v876Locate{background:rgba(115,124,255,.13)!important;color:#bcc0ff!important}
#watermarkSheet #v876Locate:disabled{opacity:.55!important}
#watermarkSheet #v876EditPlace{background:transparent!important;color:#858d99!important}
html body #v87Now{z-index:78!important;pointer-events:auto!important}
html body #v87Now button{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
html body #v87Now .v87Paused{touch-action:pan-x!important;-webkit-overflow-scrolling:touch!important}
html body #v87Now .v87Paused button{min-height:34px!important;padding:0 11px!important}
#eventList .axis884ArchiveToggle{width:100%!important;height:42px!important;padding:0 2px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border-top:1px solid var(--line2)!important;border-bottom:1px solid var(--line2)!important;color:#767f8b!important;background:transparent!important;text-align:left!important;touch-action:manipulation!important}
#eventList .axis884ArchiveToggle span{font-size:11.5px!important;letter-spacing:.01em!important}
#eventList .axis884ArchiveToggle b{font-size:10.5px!important;font-weight:620!important;color:#9ca3ae!important}
#eventList .event.axis884Archived{display:none!important}
html body.axis883-active-safe #activeHome .axis883TimelineSafe{transform:none!important;margin-bottom:0!important}
`;
  write(FILE,css);
}

/* Build-time invariants for the exact reported failures. */
{
 const v85=read('v85-canvas-fix.js'),v876=read('v876-runtime.js'),v877=read('v877-runtime.js'),wm=read('v8710-watermark.js'),v87=read('v87-runtime.js'),v8712=read('v8712-runtime.js'),app=read('app.js');
 if(!/P\.drawImage=function\(src,\.\.\.args\)\{return native\.call/.test(v85))fail('legacy v85 photo painter survived');
 if(!/function installCanvasFinal\(\)\{return false\}/.test(v876))fail('legacy v876 photo painter survived');
 if(!/function prepRawForSave\(\)\{return false\}/.test(v877))fail('legacy v877 restamp survived');
 if(!wm.includes("__AXIS_WATERMARK_PHYSICAL_OWNER__='v8710'"))fail('final watermark physical owner marker missing');
 if(/Math\.min\(48,Number\(e\.target\.value\)/.test(v877))fail('48% opacity input clamp survived');
 if(!v87.includes("owner:'v87-direct-884'"))fail('direct active-control owner missing');
 if(!v87.includes('axis884ArchiveToggle'))fail('completed archive missing');
 if(/translateY\('-'\+lift/.test(v8712))fail('transformed active safe-zone survived');
 if(!app.includes("parts=['开始 '+tlabel"))fail('completed Home start time missing');
}
console.log('[AXIS 8.8.4 field fix] PASS · one watermark painter · 1..100 slider · direct multi-item controls · card-aware safe zone · completed archive · start time');
