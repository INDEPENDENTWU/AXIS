import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.21 final Object presentation] ${m}`)};
const runtimeFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json';
for(const f of [runtimeFile,indexFile,infoFile])if(!fs.existsSync(f))fail(`missing ${f}`);
let src=fs.readFileSync(runtimeFile,'utf8');

function functionRange(text,signature,label){
 const start=text.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(text.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=text.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} opening brace missing`);
 let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<text.length;i++){
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
function replaceFunction(text,signature,replacement,label){const r=functionRange(text,signature,label);return text.slice(0,r.start)+replacement+text.slice(r.end)}

if(!src.includes('function axis821EventMetricSummary(e)'))fail('schema-aware Encounter summary helper missing from final runtime');

/* Keep one factual formatter. Later Active modules may repaint presentation, but
 * they do not get their own interpretation of Object kind/schema. Export only a
 * read-only presentation bridge from the app owner; no state or writer escapes. */
{
 const r=functionRange(src,'function axis821EventMetricSummary(e)','Encounter metric summary');
 const bridge="\nwindow.__AXIS_821_EVENT_PRESENTATION__={version:'8.21',owner:'app.js-readonly',summary:e=>axis821EventMetricSummary(e),newFactOwner:false,newWriter:false};";
 if(src.includes('__AXIS_821_EVENT_PRESENTATION__'))fail('Encounter presentation bridge duplicated');
 src=src.slice(0,r.end)+bridge+src.slice(r.end);
}

src=replaceFunction(
 src,
 'function eventHtml(e)',
 `function eventHtml(e){const ph='<div class="ph">'+esc((e?.name||'').slice(0,1))+'</div>',meta=axis821EventMetricSummary(e);return '<button class="event" data-event="'+esc(e.id)+'"><span class="thumb" data-thumb="'+esc(e.id)+'">'+ph+'</span><span><strong>'+esc(e.name)+'</strong><small>'+esc(meta)+'</small></span><time>'+tlabel(e.time)+'</time></button>'}`,
 'final timeline event renderer'
);

/* v82 starts/pauses/resumes Activities after app.render(). Reassert the base
 * event summary at that exact later lifecycle boundary, then append status. */
src=replaceFunction(
 src,
 'function decorateTimeline()',
 `function decorateTimeline(){const c=readCore(),m=readMeta();for(const row of $$('#eventList [data-event]')){const e=(c.active?.events||[]).find(x=>x.id===row.dataset.event),a=e?m.events?.[e.id]?.activity:null;if(e){const small=row.querySelector('span:nth-child(2)>small'),summary=window.__AXIS_821_EVENT_PRESENTATION__?.summary?.(e);if(small&&summary)small.textContent=summary}let tag=$('.v82EventStatus',row);if(!a){tag?.remove();continue}if(!tag){tag=D.createElement('span');tag.className='v82EventStatus';row.querySelector('span:nth-child(2)')?.appendChild(tag)}if(tag)tag.textContent=activityStatusText(a)}}`,
 'v82 schema-aware Active timeline decoration'
);

/* v87 is the polished Active action/presentation owner and can repaint after
 * v82. It must preserve the same app-owned factual summary on every repaint. */
src=replaceFunction(
 src,
 'function renderTimeline()',
 `function renderTimeline(){const c=readCore(),m=readMeta();for(const row of $$('#eventList [data-event]')){const e=c.active?.events?.find(x=>x.id===row.dataset.event),a=e?m.events?.[e.id]?.activity:null;if(!e||!a)continue;const box=row.querySelector('span:nth-child(2)');if(!box)continue;const base=box.querySelector(':scope>small:not(.v87Metric)'),summary=window.__AXIS_821_EVENT_PRESENTATION__?.summary?.(e);if(base&&summary)base.textContent=summary;let tag=$('.v82EventStatus',box);if(tag)tag.textContent=a.status==='finished'?'已完成':isPlanComplete(e,a,m)?'计划完成':a.status==='paused'?'已暂停':'进行中';let line=$('.v87Metric',box);if(a.status==='finished'&&a.actualMs){if(!line){line=D.createElement('small');line.className='v87Metric';box.appendChild(line)}const est=a.estimateMs||a.actualMs,total=planned(e,m),tracked=(a.setDoneAt||[]).some(Boolean),set=tracked?' · '+(a.completedSets||0)+'/'+total+'组':'';line.textContent='实际 '+clock(a.actualMs)+' · 预计 '+clock(est)+' · '+signed(a.actualMs-est)+set}else line?.remove()}}`,
 'v87 schema-aware Active timeline repaint'
);

/* v879's Adjust Once controls are specifically weight/reps tooling. Stable
 * internal kind may still be strength for a custom timed Object, so execution
 * snapshot—not kind—decides whether that legacy tool is eligible. */
src=replaceFunction(
 src,
 'function editEntry()',
 `function editEntry(){const id=activeId(),host=$('#v87Now .v87Actions');if(!id||!host)return;const r=meta().events?.[id],e=eventById(id),mode=String(e?.executionModeSnapshot||'').trim(),classicSet=!mode||mode==='sets';if(!r?.activity||r.activity.status==='finished'||r.v879EditAt||!classicSet){$('#v879EditBtn')?.remove();return}if(!$('#v879EditBtn')){const b=D.createElement('button');b.id='v879EditBtn';b.className='v879EditBtn';b.textContent='调整一次';b.onclick=()=>openEdit(id);host.appendChild(b)}}`,
 'execution-scoped Adjust Once entry'
);

const finalRenderer=functionRange(src,'function eventHtml(e)','final timeline event renderer').text;
if(!finalRenderer.includes('axis821EventMetricSummary(e)'))fail('final timeline is not Encounter-schema driven');
if(finalRenderer.includes("e.kind==='strength'")||finalRenderer.includes('e.weight')||finalRenderer.includes('e.reps'))fail('legacy strength/cardio timeline derivation survived canonicalization');
if(/undefined次|undefined组|NaN/.test(finalRenderer))fail('invalid metric presentation token survived final renderer');
for(const [signature,label] of [['function decorateTimeline()','v82 timeline'],['function renderTimeline()','v87 timeline']]){
 const fn=functionRange(src,signature,label).text;if(!fn.includes('__AXIS_821_EVENT_PRESENTATION__'))fail(`${label} does not consume canonical Encounter presentation bridge`);
}
const editEntry=functionRange(src,'function editEntry()','Adjust Once entry').text;
if(!editEntry.includes("mode==='sets'"))fail('Adjust Once is not execution-scoped');
if(editEntry.includes("e.kind==='strength'"))fail('Adjust Once still trusts coarse Object kind');

/* Remaining kg copy is valid only in strength-specific reports/watermarks/set
 * tooling. No direct eventList small writer may derive its value from e.kind. */
const forbiddenTimelineWriter="small.textContent=e.kind==='strength'?fmt(e.weight)+'kg · '+e.reps+'次 · '+e.sets+'组':e.duration+'分钟 · 强度'+e.intensity";
if(src.includes(forbiddenTimelineWriter))fail('legacy v879 direct Timeline fact writer survived final convergence');
try{new Function(src)}catch(e){fail(`final canonical runtime syntax ${e.message}`)}

const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let html=fs.readFileSync(indexFile,'utf8');
const oldHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];if(!oldHash)fail('axis-core hash missing from index');
const newHash=hash(src);
fs.writeFileSync(runtimeFile,src);
html=html.replace(`/axis-core.js?v=${oldHash}`,`/axis-core.js?v=${newHash}`);fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newHash;
info.gates={...(info.gates||{}),executableObjectSchemaAwareTimeline821:true,activeTimelineSchemaAware821:true,adjustOnceExecutionScoped821:true};
info.axis821={...(info.axis821||{}),executableObjectPresentation:{schemaAwareTimeline:true,activeRepaintSchemaAware:true,adjustOnce:'sets-only',legacyFallback:'snapshot-absent-only',postCanonical:true}};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS 8.21 final Object presentation] PASS · app/v82/v87 share one Encounter schema formatter · Adjust Once sets-only · core ${oldHash}->${newHash}`);
