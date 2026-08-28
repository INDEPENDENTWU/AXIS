import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.21 final Object presentation] ${m}`)};
const runtimeFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json';
for(const f of [runtimeFile,indexFile,infoFile])if(!fs.existsSync(f))fail(`missing ${f}`);
let src=fs.readFileSync(runtimeFile,'utf8');

function moduleRange(text,file,label){
 const marker=`/* ===== ${file} ===== */`;
 const start=text.indexOf(marker);if(start<0)fail(`${label} module marker missing`);if(text.indexOf(marker,start+marker.length)>=0)fail(`${label} module marker duplicated`);
 const next=text.indexOf('/* ===== ',start+marker.length),end=next<0?text.length:next;
 return{start,end,text:text.slice(start,end)};
}
function functionRange(text,signature,label,bounds={start:0,end:text.length}){
 const start=text.indexOf(signature,bounds.start);if(start<0||start>=bounds.end)fail(`${label} signature missing`);
 const duplicate=text.indexOf(signature,start+signature.length);if(duplicate>=0&&duplicate<bounds.end)fail(`${label} duplicated inside owner`);
 const brace=text.indexOf('{',start+signature.length-1);if(brace<0||brace>=bounds.end)fail(`${label} opening brace missing`);
 let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<bounds.end;i++){
  const ch=text[i],next=text[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:text.slice(start,end)};
}
function moduleFunctionRange(text,file,signature,label){return functionRange(text,signature,label,moduleRange(text,file,label))}
function replaceModuleFunction(text,file,signature,replacement,label){const r=moduleFunctionRange(text,file,signature,label);return text.slice(0,r.start)+replacement+text.slice(r.end)}
function mutateModuleFunction(text,file,signature,mutate,label){const r=moduleFunctionRange(text,file,signature,label),next=mutate(r.text);if(!next||next===r.text)fail(`${label} mutation did not change source`);return text.slice(0,r.start)+next+text.slice(r.end)}
function convergeOwnedLiteral(text,file,legacy,replacement,label){
 const owner=moduleRange(text,file,label),oldHits=owner.text.split(legacy).length-1,newHits=owner.text.split(replacement).length-1;
 if(oldHits>1||newHits>1)fail(`${label} duplicated inside owner`);
 if(oldHits===1&&newHits===1)fail(`${label} has legacy and canonical writers simultaneously`);
 if(oldHits===0){if(newHits!==1)fail(`${label} canonical writer missing`);return text}
 const at=owner.start+owner.text.indexOf(legacy);return text.slice(0,at)+replacement+text.slice(at+legacy.length);
}

if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');

/* Keep one factual formatter. Later Active modules may repaint presentation, but
 * they do not get their own interpretation of Object kind/schema. Export only a
 * read-only presentation bridge from the app owner; no state or writer escapes. */
{
 const app=moduleRange(src,'app.js','app presentation owner');
 const r=functionRange(src,'function axis821EventMetricSummary(e)','Encounter metric summary',app);
 const bridge="window.__AXIS_821_EVENT_PRESENTATION__={version:'8.21',owner:'app.js-readonly',summary:e=>axis821EventMetricSummary(e),newFactOwner:false,newWriter:false};";
 const token='window.__AXIS_821_EVENT_PRESENTATION__=';
 const hits=app.text.split(token).length-1;
 if(hits>1)fail('Encounter presentation bridge duplicated inside app owner');
 if(hits===1){if(!app.text.includes(bridge))fail('Encounter presentation bridge owner drift')}
 else src=src.slice(0,r.end)+'\n'+bridge+src.slice(r.end);
}

src=replaceModuleFunction(
 src,'app.js','function eventHtml(e)',
 `function eventHtml(e){const ph='<div class="ph">'+esc((e?.name||'').slice(0,1))+'</div>',meta=axis821EventMetricSummary(e);return '<button class="event" data-event="'+esc(e.id)+'"><span class="thumb" data-thumb="'+esc(e.id)+'">'+ph+'</span><span><strong>'+esc(e.name)+'</strong><small>'+esc(meta)+'</small></span><time>'+tlabel(e.time)+'</time></button>'}`,
 'final timeline event renderer'
);

/* 8.21 source preparation must not undo the 8.18 atomic detail handoff. */
src=replaceModuleFunction(
 src,'app.js',"function axis818DetailStage(e,eq,media='')",
 `function axis818DetailStage(e,eq,media=''){const rows=[['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—'],...axis821EventMetricEntries(e).map(x=>[x.label,x.text]),['记录时间',dlabel(e.time)+' '+tlabel(e.time)]],buttons=[];if(e.frameRefs?.length)buttons.push('<button id="axis818SavePhotos">保存照片</button>');if(e.clipRef)buttons.push('<button id="axis818SaveVideo">保存视频</button>');if(e.frameRefs?.length&&e.clipRef)buttons.push('<button id="axis818SaveAll">保存全部</button>');buttons.push('<button class="axis818DeleteEvent" id="axis818DeleteEvent">删除记录</button>');const stage=D.createElement('div');stage.innerHTML=(media||'')+'<div class="detailList">'+rows.map(r=>'<div class="detailRow"><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>').join('')+'</div><div class="detailActions axis818DetailActions">'+buttons.join('')+'<button id="makeSessionReport">训练报告</button></div>';return stage}`,
 'schema-aware atomic detail stage'
);
src=replaceModuleFunction(
 src,'app.js','async function openEvent(id)',
 `async function openEvent(id){const e=allEvents().find(x=>x.id===id);if(!e)return;const txn=++axis89DetailTxn,eq=eventEq(e);axis89CommitDetail(txn,e.name,axis818DetailStage(e,eq,''),[],()=>axis818BindDetailActions(e));void axis818HydrateEventMedia(txn,e,eq)}`,
 'schema-aware atomic event detail'
);

/* FlowRun currentEncounterId is persisted inside the Encounter commit. Paint the
 * embedded Flow status in the same task, before async Active admission can expose
 * a newer factual state next to an older Flow card. The queued lifecycle follow-up
 * remains intact and still owns sequencing. */
src=mutateModuleFunction(src,'app.js','function axis821CommitEncounter(e,eq)',fn=>{
 const from='state.active.events.push(e);save();queueMicrotask(()=>axis821FlowAfterCanonicalCommit(e,intent));return e';
 const to="state.active.events.push(e);save();if(intent?.mode==='current')axis821FlowSurfaceRenderHome?.();queueMicrotask(()=>axis821FlowAfterCanonicalCommit(e,intent));return e";
 if(!fn.includes(from))fail('Flow Encounter commit projection anchor missing');
 return fn.replace(from,to);
},'Flow Encounter immediate projection');

/* v61 may repaint the first <small> after app/v82/v87. Delegate its factual text. */
const legacyV61TimelineWriter="for(const r of $$('#eventList [data-event]')){const e=(c.active?.events||[]).find(x=>x.id===r.dataset.event);if(e?.kind==='strength'){const sm=$('small',r),v=summary(e);if(sm&&sm.textContent!==v)sm.textContent=v}}";
const canonicalV61TimelineWriter="for(const r of $$('#eventList [data-event]')){const e=(c.active?.events||[]).find(x=>x.id===r.dataset.event);if(e){const sm=$('small',r),v=window.__AXIS_821_EVENT_PRESENTATION__?.summary?.(e)||summary(e);if(sm&&sm.textContent!==v)sm.textContent=v}}";
src=convergeOwnedLiteral(src,'v61.js',legacyV61TimelineWriter,canonicalV61TimelineWriter,'v61 inherited Timeline fact observer');

/* v82 keeps Active Truth creation. Publish a synchronous presentation invalidation
 * immediately after the metadata commit so v87 cannot remain visibly bound to the
 * previous Encounter until its 500ms maintenance tick. */
src=mutateModuleFunction(src,'v82-runtime.js','function startActivity(e,customEstimate)',fn=>{
 const from='writeMeta(m);renderActiveRail();decorateTimeline();';
 const to="writeMeta(m);renderActiveRail();decorateTimeline();try{window.dispatchEvent(new CustomEvent('axis:active-truth-changed',{detail:{id:e.id,status:'active'}}))}catch{};";
 if(!fn.includes(from))fail('v82 Active start projection anchor missing');
 return fn.replace(from,to);
},'v82 Active synchronous presentation invalidation');

src=replaceModuleFunction(
 src,'v82-runtime.js','function decorateTimeline()',
 `function decorateTimeline(){const c=readCore(),m=readMeta();for(const row of $$('#eventList [data-event]')){const e=(c.active?.events||[]).find(x=>x.id===row.dataset.event),a=e?m.events?.[e.id]?.activity:null;if(e){const small=row.querySelector('span:nth-child(2)>small'),summary=window.__AXIS_821_EVENT_PRESENTATION__?.summary?.(e);if(small&&summary)small.textContent=summary}let tag=$('.v82EventStatus',row);if(!a){tag?.remove();continue}if(!tag){tag=D.createElement('span');tag.className='v82EventStatus';row.querySelector('span:nth-child(2)')?.appendChild(tag)}if(tag)tag.textContent=activityStatusText(a)}}`,
 'v82 schema-aware Active timeline decoration'
);

/* v87 is the polished Active presentation owner. Preserve the 8.8.4 completed
 * archive handoff when replacing its Timeline painter; dropping renderArchive was
 * a final-seal regression that left the archive control unmounted. */
src=replaceModuleFunction(
 src,'v87-runtime.js','function renderTimeline()',
 `function renderTimeline(){const c=readCore(),m=readMeta();for(const row of $$('#eventList [data-event]')){const e=c.active?.events?.find(x=>x.id===row.dataset.event),a=e?m.events?.[e.id]?.activity:null;if(!e||!a)continue;const box=row.querySelector('span:nth-child(2)');if(!box)continue;const base=box.querySelector(':scope>small:not(.v87Metric)'),summary=window.__AXIS_821_EVENT_PRESENTATION__?.summary?.(e);if(base&&summary)base.textContent=summary;let tag=$('.v82EventStatus',box);if(tag)tag.textContent=a.status==='finished'?'已完成':isPlanComplete(e,a,m)?'计划完成':a.status==='paused'?'已暂停':'进行中';let line=$('.v87Metric',box);if(a.status==='finished'&&a.actualMs){if(!line){line=D.createElement('small');line.className='v87Metric';box.appendChild(line)}const est=a.estimateMs||a.actualMs,total=planned(e,m),tracked=(a.setDoneAt||[]).some(Boolean),set=tracked?' · '+(a.completedSets||0)+'/'+total+'组':'';line.textContent='实际 '+clock(a.actualMs)+' · 预计 '+clock(est)+' · '+signed(a.actualMs-est)+set}else line?.remove()}renderArchive(c,m)}`,
 'v87 schema-aware Active timeline repaint'
);

src=mutateModuleFunction(src,'v87-runtime.js','function installEvents()',fn=>{
 const anchor="window.addEventListener('pageshow',()=>{injectAudio();renderNow(true);renderTimeline()});";
 const next="window.addEventListener('axis:active-truth-changed',()=>{renderNow(true);renderTimeline()});"+anchor;
 if(!fn.includes(anchor))fail('v87 presentation event anchor missing');
 if(fn.includes("axis:active-truth-changed"))fail('v87 Active presentation listener duplicated');
 return fn.replace(anchor,next);
},'v87 synchronous Active projection listener');

/* Current execution snapshots are authoritative. Preserve old strength/cardio
 * adjustment only for records that predate the snapshot contract, plus the 8.12
 * live-current event resolver and the post-kernel v87AdjustBtn identity. */
src=replaceModuleFunction(
 src,'v879-runtime.js','function editEntry()',
 `function editEntry(){const id=activeId(),host=$('#v87Now .v87Actions');if(!id||!host)return;const prune=()=>{let kept=false;for(const x of Array.from(host.querySelectorAll('button'))){if(!String(x.textContent||'').trim().startsWith('调整'))continue;if(x.id==='v87AdjustBtn'&&!kept){kept=true;continue}x.remove()}};prune();const r=meta().events?.[id],e=eventById(id),mode=String(e?.executionModeSnapshot||'').trim(),eligible=mode?mode==='sets':!!e&&(e.kind==='strength'||e.kind==='cardio');if(!r?.activity||r.activity.status==='finished'||r.v879EditAt||!eligible){$('#v87AdjustBtn')?.remove();return}if(!$('#v87AdjustBtn')){const b=D.createElement('button');b.id='v87AdjustBtn';b.className='v879EditBtn';b.textContent='调整';b.onclick=()=>{const current=activeId();if(current)openEdit(current)};host.appendChild(b);queueMicrotask(prune);setTimeout(prune,120)}}`,
 'execution-scoped Adjust Once entry'
);
src=replaceModuleFunction(
 src,'v879-runtime.js','function openEdit(id)',
 `function openEdit(id){ensureEdit();const c=core(),m=meta(),e=eventById(id,c),r=m.events?.[id];if(!e||!r||r.v879EditAt)return;const mode=String(e.executionModeSnapshot||'').trim(),eligible=mode?mode==='sets':e.kind==='strength'||e.kind==='cardio';if(!eligible)return;editId=id;const setLike=mode?mode==='sets':e.kind==='strength';if(setLike){const ss=Array.isArray(r.sets)?r.sets:[],done=Number(r.activity?.completedSets)||0,b=ss[done]||ss.at(-1)||{weight:e.weight||20,reps:e.reps||10};editDraft={kind:'s',done,sets:Math.max(done+1,ss.length||e.sets||1),w:Number(b.weight)||20,r:clamp(Number(b.reps)||10,1,300)}}else editDraft={kind:'c',min:Number(e.duration)||15,int:Number(e.intensity)||1};renderEdit();$('#v879Edit').classList.add('show');layer()}`,
 'execution-scoped Adjust Once editor'
);

const legacyV879TimelineWriter="small.textContent=e.kind==='strength'?fmt(e.weight)+'kg · '+e.reps+'次 · '+e.sets+'组':e.duration+'分钟 · 强度'+e.intensity";
const canonicalV879TimelineWriter="small.textContent=window.__AXIS_821_EVENT_PRESENTATION__?.summary?.(e)||''";
src=convergeOwnedLiteral(src,'v879-runtime.js',legacyV879TimelineWriter,canonicalV879TimelineWriter,'v879 direct Timeline fact writer');

const finalRenderer=moduleFunctionRange(src,'app.js','function eventHtml(e)','final timeline event renderer').text;
if(!finalRenderer.includes('axis821EventMetricSummary(e)'))fail('final timeline is not Encounter-schema driven');
if(finalRenderer.includes("e.kind==='strength'")||finalRenderer.includes('e.weight')||finalRenderer.includes('e.reps'))fail('legacy strength/cardio timeline derivation survived canonicalization');
if(/undefined次|undefined组|NaN/.test(finalRenderer))fail('invalid metric presentation token survived final renderer');
const atomicDetail=moduleFunctionRange(src,'app.js','async function openEvent(id)','schema-aware atomic event detail').text;
const detailStage=moduleFunctionRange(src,'app.js',"function axis818DetailStage(e,eq,media='')",'schema-aware atomic detail stage').text;
if(!atomicDetail.includes('axis89CommitDetail(txn,e.name,axis818DetailStage(e,eq,\'\')')||!atomicDetail.includes('void axis818HydrateEventMedia(txn,e,eq)'))fail('event detail lost atomic facts-first handoff');
if(atomicDetail.includes("setText('#detailTitle'")||/await\s+(?:mediaUrl|axis89MediaUrl|getMedia)\s*\(/.test(atomicDetail))fail('event detail reintroduced title/media precommit');
if(!detailStage.includes('axis821EventMetricEntries(e)'))fail('event detail stage is not Encounter-schema driven');
const flowCommit=moduleFunctionRange(src,'app.js','function axis821CommitEncounter(e,eq)','Flow Encounter projection').text;
if(!flowCommit.includes("if(intent?.mode==='current')axis821FlowSurfaceRenderHome?.()"))fail('Flow current Encounter is not synchronously projected');
const v61Decorate=moduleFunctionRange(src,'v61.js','function decorate()','v61 inherited Timeline observer').text;
if(!v61Decorate.includes('__AXIS_821_EVENT_PRESENTATION__'))fail('v61 inherited Timeline observer does not consume canonical Encounter presentation bridge');
if(v61Decorate.includes(legacyV61TimelineWriter))fail('legacy v61 strength-only Timeline fact writer survived final convergence');
const v82Start=moduleFunctionRange(src,'v82-runtime.js','function startActivity(e,customEstimate)','v82 Active start').text;
if(!v82Start.includes("axis:active-truth-changed"))fail('v82 Active commit does not invalidate polished presentation synchronously');
const v87Events=moduleFunctionRange(src,'v87-runtime.js','function installEvents()','v87 Active event listener').text;
if(!v87Events.includes("axis:active-truth-changed"))fail('v87 does not consume synchronous Active presentation invalidation');
const v87Timeline=moduleFunctionRange(src,'v87-runtime.js','function renderTimeline()','v87 timeline').text;
if(!v87Timeline.includes('__AXIS_821_EVENT_PRESENTATION__'))fail('v87 timeline does not consume canonical Encounter presentation bridge');
if(!v87Timeline.includes('renderArchive(c,m)'))fail('v87 timeline dropped 8.8.4 completed archive projection');
const v82Timeline=moduleFunctionRange(src,'v82-runtime.js','function decorateTimeline()','v82 timeline').text;
if(!v82Timeline.includes('__AXIS_821_EVENT_PRESENTATION__'))fail('v82 timeline does not consume canonical Encounter presentation bridge');
const editEntry=moduleFunctionRange(src,'v879-runtime.js','function editEntry()','Adjust Once entry').text;
const openEdit=moduleFunctionRange(src,'v879-runtime.js','function openEdit(id)','Adjust Once editor').text;
for(const [label,fn] of [['Adjust Once entry',editEntry],['Adjust Once editor',openEdit]]){
 if(!fn.includes('executionModeSnapshot')||!fn.includes("mode==='sets'"))fail(`${label} is not execution-scoped`);
 if(!fn.includes("kind==='strength'")||!fn.includes("kind==='cardio'"))fail(`${label} did not preserve snapshot-absent classic adjustment fallback`);
}
if(!editEntry.includes('v87AdjustBtn')||!editEntry.includes('queueMicrotask(prune)')||!editEntry.includes('setTimeout(prune,120)'))fail('post-kernel active-adjust identity/render-sync dedupe was lost');
if(editEntry.includes('b.onclick=()=>openEdit(id)')||!editEntry.includes('const current=activeId();if(current)openEdit(current)'))fail('8.12 live current-event adjustment resolver was lost');
const v879=moduleRange(src,'v879-runtime.js','v879 presentation owner').text;
if(v879.includes(legacyV879TimelineWriter))fail('legacy v879 direct Timeline fact writer survived final convergence');
if((v879.split(canonicalV879TimelineWriter).length-1)!==1)fail('canonical v879 Timeline fact writer is not singular');
try{new Function(src)}catch(e){fail(`final canonical runtime syntax ${e.message}`)}

const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let html=fs.readFileSync(indexFile,'utf8');
const oldHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];if(!oldHash)fail('axis-core hash missing from index');
const newHash=hash(src);
fs.writeFileSync(runtimeFile,src);
html=html.replace(`/axis-core.js?v=${oldHash}`,`/axis-core.js?v=${newHash}`);fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newHash;
info.gates={...(info.gates||{}),executableObjectSchemaAwareTimeline821:true,activeTimelineSchemaAware821:true,adjustOnceExecutionScoped821:true,eventDetailAtomicSchemaAware821:true,legacyActiveAdjustPreserved821:true,activeAdjustCurrentEventPreserved821:true,activeProjectionSynchronous821:true,flowProjectionSynchronous821:true,completedArchivePreserved821:true};
info.axis821={...(info.axis821||{}),executableObjectPresentation:{schemaAwareTimeline:true,activeRepaintSchemaAware:true,atomicSchemaAwareDetail:true,adjustOnce:'current-sets-legacy-classic',legacyFallback:'snapshot-absent-strength-cardio',activeAdjustBinding:'live-current-event',activeProjection:'same-task-invalidation',flowProjection:'same-task-current-encounter',completedArchive:'preserved-884',postCanonical:true,ownerScoped:true,idempotent:true}};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS 8.21 final Object presentation] PASS · canonical Encounter facts · atomic detail · synchronous Active/Flow projection · 8.8.4 archive preserved · snapshot-aware live-current Adjust Once · core ${oldHash}->${newHash}`);
