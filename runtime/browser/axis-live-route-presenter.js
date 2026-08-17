(()=>{'use strict';
/* AXIS 8.13 Stage 3 — Continue + Live Route presenter. Read-only presentation owner. */
const D=document,$=(s,r=D)=>r?.querySelector?.(s)||null;
const CORE='axis_v60_state',META='axis_v8_meta';
const Runtime=AxisRuntime,Adapter=Axis812Adapter;
let scheduled=false,lastSignature='',lastSnapshot=null,renderCount=0,observers=[];

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'?v:fallback}catch{return fallback}};
const currentEventId=()=>String($('#v87Finish')?.dataset.id||'').trim()||null;
const compactMinutes=n=>{n=Math.max(0,Number(n)||0);return n%1?Math.round(n*10)/10:Math.round(n)};
const muscleLabel=item=>Array.isArray(item?.muscles)&&item.muscles.length?item.muscles.slice(0,2).join(' · '):(item?.kind==='cardio'?'心肺':'训练');
const itemMeta=item=>`约${compactMinutes(item?.estimatedMinutes||0)}分 · ${muscleLabel(item)}`;

function ensureRoute(){
 const home=$('#activeHome');if(!home)return null;
 let section=$('#axis813Route');if(section)return section;
 section=D.createElement('section');section.id='axis813Route';section.className='section axis813Route hidden';section.setAttribute('aria-label','接下来');
 section.innerHTML='<div class="sectionHead axis813RouteHead"><b>接下来</b><span id="axis813RouteMeta"></span></div><div class="axis813RouteBody" id="axis813RouteBody"></div>';
 const timeline=$('#eventList')?.closest?.('.section');if(timeline&&timeline.parentNode===home)home.insertBefore(section,timeline);else home.appendChild(section);
 return section
}

function hideRoute(state='hidden'){
 const section=ensureRoute();if(section)section.classList.add('hidden');
 lastSnapshot={state,currentEventId:currentEventId(),future:[],alternative:null,projection:null,facts:null};
 if(window.__AXIS_813_ROUTE__)window.__AXIS_813_ROUTE__.state=state
}

function compute(){
 const core=read(CORE,{active:null,sessions:[]});
 if(!core.active)return{state:'idle',core,meta:null,adapted:null,projection:null,future:[],alternative:null};
 const meta=read(META,{events:{},prefs:{}});
 const adapted=Adapter.adaptAxis812Snapshot({now:Date.now(),core,meta,currentEventId:currentEventId(),constraints:{}});
 const projection=Runtime.projectWorkout(adapted.input);
 const factualCurrent=adapted.facts?.activeEvents?.find(x=>x.current)||null;
 const currentEquipmentId=factualCurrent?.equipmentId||adapted.input.currentExercise?.id||null;
 const future=(projection.remaining||[]).filter(x=>String(x.id)!==String(currentEquipmentId||'')).slice(0,3);
 const futureIds=new Set(future.map(x=>String(x.id)));
 const alternative=(projection.alternatives||[]).find(x=>String(x.id)!==String(currentEquipmentId||'')&&!futureIds.has(String(x.id)))||null;
 return{state:future.length?'ready':'empty',core,meta,adapted,projection,future,alternative,currentEquipmentId}
}

function signatureOf(model){
 return JSON.stringify({state:model.state,current:model.currentEquipmentId||null,future:model.future.map(x=>[x.id,x.name,x.estimatedMinutes,x.kind,x.muscles]),alternative:model.alternative?[model.alternative.id,model.alternative.name]:null,budget:model.projection?.budget||null,reasons:model.projection?.reasonCodes||[]})
}

function render(model){
 const section=ensureRoute();if(!section)return;
 if(model.state!=='ready'){
  section.classList.add('hidden');lastSignature=signatureOf(model);lastSnapshot={state:model.state,currentEventId:currentEventId(),future:[],alternative:null,projection:model.projection,facts:model.adapted?.facts||null};
  return
 }
 const sig=signatureOf(model);if(sig===lastSignature&&section.classList.contains('hidden')===false){lastSnapshot={state:'ready',currentEventId:currentEventId(),future:model.future,alternative:model.alternative,projection:model.projection,facts:model.adapted?.facts||null};return}
 lastSignature=sig;renderCount++;
 const minutes=model.future.reduce((n,x)=>n+Math.max(0,Number(x.estimatedMinutes)||0),0),meta=$('#axis813RouteMeta'),body=$('#axis813RouteBody');
 if(meta)meta.textContent=`${model.future.length}项 · 约${compactMinutes(minutes)}分`;
 const [lead,...rest]=model.future;
 if(body)body.innerHTML=`<div class="axis813RouteLead"><span class="axis813RouteIndex">01</span><div><strong>${esc(lead.name)}</strong><small>${esc(itemMeta(lead))}</small></div></div>${rest.length?`<div class="axis813RouteTrail">${rest.map((x,i)=>`<div><span>0${i+2}</span><b>${esc(x.name)}</b><small>${esc(itemMeta(x))}</small></div>`).join('')}</div>`:''}${model.alternative?`<div class="axis813RouteAlt"><span>备选</span><b>${esc(model.alternative.name)}</b><small>${esc(itemMeta(model.alternative))}</small></div>`:''}`;
 section.classList.remove('hidden');
 lastSnapshot={state:'ready',currentEventId:currentEventId(),future:model.future,alternative:model.alternative,projection:model.projection,facts:model.adapted?.facts||null};
}

function refresh(reason='manual'){
 try{const model=compute();render(model);if(window.__AXIS_813_ROUTE__){window.__AXIS_813_ROUTE__.state=model.state;window.__AXIS_813_ROUTE__.lastReason=reason;window.__AXIS_813_ROUTE__.renderCount=renderCount}return model}catch(error){hideRoute('error');if(window.__AXIS_813_ROUTE__){window.__AXIS_813_ROUTE__.lastReason=reason;window.__AXIS_813_ROUTE__.error=String(error?.message||error)}return null}
}

function schedule(reason){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;refresh(reason)})
}

function installObservers(){
 const MO=window.__AXIS_NATIVE_MUTATION_OBSERVER__||MutationObserver;
 const eventList=$('#eventList'),nowCard=$('#v87Now'),activeHome=$('#activeHome');
 if(eventList){const o=new MO(()=>schedule('timeline'));o.observe(eventList,{childList:true,subtree:true,characterData:true});observers.push(o)}
 if(nowCard){const o=new MO(()=>schedule('active-card'));o.observe(nowCard,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['data-id']});observers.push(o)}
 if(activeHome){const o=new MO(()=>schedule('home-state'));o.observe(activeHome,{attributes:true,attributeFilter:['class']});observers.push(o)}
 D.addEventListener('axis:recording-render',()=>schedule('recording-render'));
 D.addEventListener('axis:recording-change',()=>schedule('recording-change'));
 window.addEventListener('pageshow',()=>schedule('pageshow'),{passive:true});
 window.addEventListener('focus',()=>schedule('focus'),{passive:true});
 D.addEventListener('visibilitychange',()=>{if(!D.hidden)schedule('visible')},{passive:true})
}

function boot(){
 ensureRoute();installObservers();refresh('boot');
}

window.__AXIS_813_ROUTE__={
 version:'8.13-stage3',owner:'v813-live-route',state:'booting',recordingOwner:false,storageOwner:false,networkOwner:false,writes:0,storageWrites:0,renderCount:0,lastReason:'boot',error:null,
 refresh:()=>refresh('diagnostic'),
 snapshot:()=>lastSnapshot?JSON.parse(JSON.stringify(lastSnapshot)):null
};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
