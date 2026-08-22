import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.18 Object + Route Foundation] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Object Truth: recording metrics describe what is recorded; equipment type describes what the object is.
   They are independent. Reuse the existing axis_v8124_custom_profiles sidecar rather than creating storage. */
{
 let s=read('v873-smart-input.js');
 const oldChoose="function axis8124MetricChoose(metric){let set=new Set(axis8124MetricActive()),strength=metric==='weight'||metric==='reps',cardio=!strength;if(strength){set.delete('duration');set.delete('intensity');set.delete('level')}else{set.delete('weight');set.delete('reps');if(metric==='level')set.delete('intensity');if(metric==='intensity')set.delete('level')}set.has(metric)?set.delete(metric):set.add(metric);if(!set.size)set=new Set(strength?['weight','reps']:['duration',metric==='level'?'level':'intensity']);axis8124MetricSet([...set]);const type=[...set].some(x=>x==='weight'||x==='reps')?'strength':'cardio';$$('#customType [data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===type))}";
 const newChoose="function axis8124MetricChoose(metric){if(!AXIS8124_CUSTOM_METRICS.includes(metric))return;const set=new Set(axis8124MetricActive());if(set.has(metric)){if(set.size===1)return;set.delete(metric)}else set.add(metric);axis8124MetricSet([...set])}";
 s=once(s,oldChoose,newChoose,'independent metric selection');
 const oldType="const type=e.target.closest?.('#customType [data-type]');if(type)setTimeout(()=>{const active=axis8124MetricActive(),isStrength=active.some(x=>x==='weight'||x==='reps');if(!active.length||(type.dataset.type==='strength'&&!isStrength)||(type.dataset.type==='cardio'&&isStrength))axis8124MetricSet(axis8124MetricDefaults(type.dataset.type))},0)";
 const newType="const type=e.target.closest?.('#customType [data-type]');if(type)setTimeout(()=>axis8124MetricSet(axis8124MetricActive()),0)";
 s=once(s,oldType,newType,'type no longer rewrites metrics');
 const oldFamily="const family=metrics.some(x=>x==='weight'||x==='reps')?'strength':'cardio';$$('#customType [data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===family));";
 const newFamily="const family=$('#customType .active')?.dataset.type||'strength';";
 s=once(s,oldFamily,newFamily,'save keeps object type independent');
 const marker="window.__AXIS_8124_CUSTOM_SAFE__={version:'8.12.4',owner:'v873-additive',allCustomSearchable:true,directNoMatchCreate:true,recordingProfiles:true,metrics:[...AXIS8124_CUSTOM_METRICS],trainingOwner:false};";
 const bridge=`window.__AXIS_OBJECT_SCHEMA__={version:2,owner:'v873-profile-projection',storage:'axis_v8124_custom_profiles',metricIds:[...AXIS8124_CUSTOM_METRICS],forEquipment:(id,type='strength')=>{const eq=axis8124CustomById(id)||{id,type};return{version:2,equipmentId:id,type:eq.type||type,metrics:[...axis8124CustomMetrics(eq)]}},typeIndependent:true,unknownMetricSafe:true};\n${marker}`;
 s=once(s,marker,bridge,'Object Schema bridge');
 syntax(s,'v873-smart-input.js');write('v873-smart-input.js',s);
}

/* Canonical event persistence + detail projection consume the schema snapshot, not eq.type branching. */
{
 let s=read('app.js');
 const saveHead='async function saveScan(){';
 const helpers=`const AXIS818_PROFILE='axis_v8124_custom_profiles',AXIS818_METRICS=['weight','reps','duration','intensity','level'];
function axis818Profile(){try{return JSON.parse(localStorage.getItem(AXIS818_PROFILE)||'null')||{items:{}}}catch{return{items:{}}}}
function axis818Metrics(eq){const side=axis818Profile().items?.[eq?.id]?.metrics,own=eq?.recording?.metrics,raw=Array.isArray(side)?side:Array.isArray(own)?own:null,clean=[...new Set((raw||[]).filter(x=>AXIS818_METRICS.includes(x)))];return clean.length?clean:(eq?.type==='cardio'?['duration','intensity']:['weight','reps'])}
function axis818ApplyMetricValues(e,eq){const metrics=axis818Metrics(eq);e.recording={version:2,metrics:[...metrics],typeIndependent:true};e.metricValues={};if(metrics.includes('weight')){e.weight=nval('weight',0,1000,0);e.metricValues.weight=e.weight}if(metrics.includes('reps')){e.reps=choiceVal('reps',10);e.metricValues.reps=e.reps}if(metrics.some(x=>x==='weight'||x==='reps'))e.sets=choiceVal('sets',3);if(metrics.includes('duration')){e.duration=nval('duration',1,600,15);e.metricValues.duration=e.duration}if(metrics.includes('intensity')){e.intensity=choiceVal('intensity',5);e.metricValues.intensity=e.intensity}if(metrics.includes('level')){e.level=choiceVal('intensity',5);e.metricValues.level=e.level;if(e.intensity==null)e.intensity=e.level}return metrics}
function axis818EventMetrics(e,eq){const snap=e?.recording?.metrics;if(Array.isArray(snap)&&snap.length)return snap.filter(x=>AXIS818_METRICS.includes(x));return axis818Metrics(eq)}
function axis818EventRows(e,eq){const metrics=axis818EventMetrics(e,eq),rows=[];for(const m of metrics){if(m==='weight')rows.push(['重量',numFmt(e.weight)+' kg']);else if(m==='reps')rows.push(['次数',(e.reps??'—')+' 次']);else if(m==='duration')rows.push(['时间',(e.duration??'—')+' 分钟']);else if(m==='intensity')rows.push(['强度',(e.intensity??'—')+' / 10']);else if(m==='level')rows.push(['档位',String(e.level??e.intensity??'—')])}if(metrics.some(x=>x==='weight'||x==='reps')&&e.sets!=null)rows.push(['组数',e.sets+' 组']);return rows}
`;
 s=once(s,saveHead,helpers+saveHead,'Object schema app helpers');
 const oldBranch=";if(eq.type==='strength'){e.weight=nval('weight',0,1000,0);e.reps=choiceVal('reps',10);e.sets=choiceVal('sets',3)}else{e.duration=nval('duration',1,600,15);e.intensity=choiceVal('intensity',5)}try{";
 s=once(s,oldBranch,";axis818ApplyMetricValues(e,eq);try{",'schema-driven event persistence');
 const oldRows="const rows=e.kind==='strength'?[['重量',numFmt(e.weight)+' kg'],['次数',e.reps+' 次'],['组数',e.sets+' 组']]:[['时间',e.duration+' 分钟'],['强度',e.intensity+' / 10']];";
 s=once(s,oldRows,"const rows=axis818EventRows(e,eq);",'schema-driven detail rows');

 /* Route Truth: the selected nav route is authoritative on pageshow/focus/resume.
    Exactly one main view may remain active; home-only fixed controls are route-gated. */
 const end=s.lastIndexOf('})();');if(end<0)fail('app IIFE end missing');
 const route=String.raw`
/* AXIS 8.18 — Route Truth. Derived UI state only; no new persistence owner. */
(function axis818InstallRouteTruth(){
 if(D.documentElement.dataset.axis818RouteOwner==='1')return;D.documentElement.dataset.axis818RouteOwner='1';
 let syncing=false,queued=0;
 const views=()=>$$('main>.view'),navs=()=>$$('.nav [data-view]');
 function resolve(){
  if(syncing)return;syncing=true;
  try{
   const ns=navs(),vs=views(),selected=ns.find(b=>b.classList.contains('active')&&D.getElementById(b.dataset.view)),active=vs.filter(v=>v.classList.contains('active'));
   const id=selected?.dataset.view||(active.length===1?active[0].id:'todayView'),target=D.getElementById(id)||D.getElementById('todayView');if(!target)return;
   vs.forEach(v=>v.classList.toggle('active',v===target));ns.forEach(b=>b.classList.toggle('active',b.dataset.view===target.id));D.body.dataset.axisRoute=target.id;
   const today=target.id==='todayView';for(const el of [$('#dock'),$('#v87Now'),$('#v82ActiveRail')].filter(Boolean)){el.setAttribute('aria-hidden',String(!today));if(!today)el.classList.remove('show','v8-force')}
   if(!today)D.body.classList.remove('v87-now','v82-has-rail');
  }finally{syncing=false}
 }
 function queue(){clearTimeout(queued);queued=setTimeout(resolve,0)}
 D.addEventListener('click',e=>{if(e.target.closest('.nav [data-view]'))setTimeout(resolve,0)},true);
 D.addEventListener('visibilitychange',()=>{if(!D.hidden){resolve();setTimeout(resolve,80)}},{passive:true});
 window.addEventListener('pageshow',()=>{resolve();setTimeout(resolve,80);setTimeout(resolve,320)},{passive:true});
 window.addEventListener('focus',queue,{passive:true});
 const mo=new MutationObserver(queue);for(const x of [...views(),...navs()])mo.observe(x,{attributes:true,attributeFilter:['class']});
 resolve();window.__AXIS_ROUTE_TRUTH__={version:'8.18',owner:'app-derived',sync:resolve,persisted:false};
})();
try{window.__AXIS_818_OBJECT_FOUNDATION__={version:'8.18',profileStore:'axis_v8124_custom_profiles',schemaVersion:2,typeIndependent:true,eventSnapshot:true,detailSchemaDriven:true,newPersistence:false};window.__AXIS_818_ROUTE_FOUNDATION__={version:'8.18',oneActiveView:true,resumeReconciled:true,homeOverlaysRouteGated:true,newPersistence:false}}catch{}
`;
 s=s.slice(0,end)+route+'\n'+s.slice(end);
 syntax(s,'app.js');write('app.js',s);
}

{
 let c=read('styles.css');if(c.includes('AXIS 8.18 Route Truth'))fail('8.18 Route CSS duplicated');
 c+='\n\n/* AXIS 8.18 Route Truth — fixed Home affordances can never bleed into Record/Trends. */\nbody[data-axis-route]:not([data-axis-route="todayView"]) #dock,body[data-axis-route]:not([data-axis-route="todayView"]) #v87Now,body[data-axis-route]:not([data-axis-route="todayView"]) #v82ActiveRail{display:none!important;visibility:hidden!important;pointer-events:none!important}\n';write('styles.css',c);
}

console.log('[AXIS 8.18 Object + Route Foundation] PASS · type/metrics decoupled · event schema snapshots · schema-driven detail · PWA route reconciled · no new persistence');
