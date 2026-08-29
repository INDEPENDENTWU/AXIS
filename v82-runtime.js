(()=>{'use strict';
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  if(method==='GET'&&/\/api\/analyze(?:\?|$)/.test(url)){
    return Promise.resolve(new Response(JSON.stringify({available:false,boot:true}),{status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}}));
  }
  return nativeFetch(input,init);
};
if('serviceWorker' in navigator){
  const sw=navigator.serviceWorker;
  try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}catch{try{sw.register=()=>Promise.resolve(null)}catch{}}
  const clear=()=>sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  clear();window.addEventListener('load',()=>setTimeout(clear,0),{once:true});
}
window.__AXIS_BOOT_READY__=true;

const boot82=()=>{
  const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s));
  const CORE='axis_v60_state',META='axis_v8_meta';
  let estimateMs=null,estimateAuto=true,precisionTimer=null,knownEvents=new Set(),saveArmed=false,finishHoldStart=0,finishHapticDone=false;
  const readCore=()=>{try{return JSON.parse(localStorage.getItem(CORE)||'null')||{sessions:[],active:null}}catch{return{sessions:[],active:null}}};
  const writeCore=c=>{try{localStorage.setItem(CORE,JSON.stringify(c));return true}catch{return false}};
  const readMeta=()=>{try{const m=JSON.parse(localStorage.getItem(META)||'null')||{};m.events=m.events||{};m.prefs=m.prefs||{};return m}catch{return{events:{},prefs:{}}}};
  const writeMeta=m=>{try{localStorage.setItem(META,JSON.stringify(m));return true}catch{return false}};
  const now=()=>Date.now(),pad=n=>String(n).padStart(2,'0'),fmt=n=>Number(n)%1?Number(n).toFixed(1):String(Number(n)||0);
  const events=()=>{const c=readCore();return (c.active?[c.active]:[]).concat(c.sessions||[]).flatMap(s=>s.events||[])};
  const currentSession=()=>readCore().active;
  const selectedName=()=>$('#equipmentName')?.textContent?.trim()||'';
  const selectedEventTemplate=()=>{const n=selectedName();return events().filter(e=>e.name===n).sort((a,b)=>(b.time||0)-(a.time||0))[0]||null};
  const vibration=ms=>{try{navigator.vibrate?.(ms)}catch{}};
  const elapsedActivity=a=>{
    if(!a)return 0;let total=0;
    for(const x of a.intervals||[])total+=Math.max(0,(x.end||((a.status==='active'&&x===a.intervals.at(-1))?now():x.start))-x.start);
    return total;
  };
  const activityFor=id=>readMeta().events?.[id]?.activity||null;
  const activeEvent=()=>{
    const m=readMeta(),ss=currentSession();if(!ss)return null;
    return (ss.events||[]).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a?.status==='active').sort((x,y)=>(y.a.lastResumedAt||0)-(x.a.lastResumedAt||0))[0]||null;
  };
  const pausedEvents=()=>{const m=readMeta(),ss=currentSession();if(!ss)return[];return (ss.events||[]).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a?.status==='paused').sort((x,y)=>(y.a.pausedAt||0)-(x.a.pausedAt||0))};
  function closeOpenInterval(a,t=now()){const x=a?.intervals?.at(-1);if(x&&!x.end)x.end=t}
  function pauseOthers(except){const m=readMeta();for(const e of currentSession()?.events||[]){if(e.id===except)continue;const a=m.events?.[e.id]?.activity;if(a?.status==='active'){closeOpenInterval(a);a.status='paused';a.pausedAt=now();a.restStartedAt=null}}writeMeta(m)}
  function autoEstimate(e){
    if(e?.kind==='cardio'){const d=Number(e.duration)||Number($('#duration')?.value)||15;return Math.max(60000,d*60000)}
    const hist=events().filter(x=>x.equipmentId===e?.equipmentId&&x.id!==e?.id).sort((a,b)=>(b.time||0)-(a.time||0));
    for(const h of hist){const a=activityFor(h.id);if(a?.actualMs&&a.actualMs>=60000&&a.actualMs<=90*60000)return a.actualMs}
    const rows=$$('#v8Sets .v8SetRow').length||Number($('#setsChoices .active')?.dataset.value)||3;
    return Math.max(3*60000,Math.min(45*60000,rows*150000));
  }
  function startActivity(e,customEstimate){
    if(!e)return;pauseOthers(e.id);const m=readMeta(),rec=m.events[e.id]||(m.events[e.id]={});const t=now();
    rec.activity={status:'active',startedAt:t,lastResumedAt:t,pausedAt:null,finishedAt:null,estimateMs:customEstimate||autoEstimate(e),intervals:[{start:t,end:null}],completedSets:0,setDoneAt:[],restStartedAt:null,restNotified:false,actualMs:null};
    writeMeta(m);renderActiveRail();decorateTimeline();try{window.dispatchEvent(new CustomEvent('axis:active-truth-changed',{detail:{id:e.id,status:'active'}}))}catch{};
  }
  function axis821StartExistingActivity(id,customEstimate){const e=currentSession()?.events?.find(x=>x.id===id);if(!e)return false;const a=activityFor(id);if(a?.status==='active')return true;if(a?.status==='finished')return false;if(a?.status==='paused'){resumeActivity(id);return activityFor(id)?.status==='active'}startActivity(e,customEstimate);return activityFor(id)?.status==='active'}
  window.__AXIS_ACTIVE_START__={version:'8.21',owner:'v82',truth:'axis_v8_meta',start:axis821StartExistingActivity};
  function pauseActivity(id){const m=readMeta(),a=m.events?.[id]?.activity;if(!a||a.status!=='active')return;closeOpenInterval(a);a.status='paused';a.pausedAt=now();a.restStartedAt=null;writeMeta(m);renderActiveRail();decorateTimeline()}
  function resumeActivity(id){const m=readMeta(),a=m.events?.[id]?.activity;if(!a||a.status==='finished')return;pauseOthers(id);const mm=readMeta(),aa=mm.events?.[id]?.activity;if(!aa)return;aa.status='active';aa.lastResumedAt=now();aa.pausedAt=null;aa.intervals=aa.intervals||[];aa.intervals.push({start:now(),end:null});writeMeta(mm);renderActiveRail();decorateTimeline()}
  function finishActivity(id){
    const c=readCore(),m=readMeta(),a=m.events?.[id]?.activity,e=(c.active?.events||[]).find(x=>x.id===id);if(!a||!e)return;
    if(a.status==='active')closeOpenInterval(a);a.status='finished';a.finishedAt=now();a.actualMs=elapsedActivity(a);a.restStartedAt=null;
    const sets=m.events?.[id]?.sets;if(Array.isArray(sets)&&a.completedSets>0){sets.forEach((s,i)=>{if(i<a.completedSets){s.state='done';s.doneAt=a.setDoneAt?.[i]||s.doneAt||null}else{s.state='unfinished';s.doneAt=null}});e.sets=a.completedSets;const done=sets.slice(0,a.completedSets),wr=done.find(x=>x.reps!=null),ww=done.map(x=>x.weight).filter(x=>x!=null);if(wr)e.reps=wr.reps;if(ww.length)e.weight=Math.max(...ww)}
    writeMeta(m);writeCore(c);vibration(24);renderActiveRail();decorateTimeline();
  }
  function completeOneSet(id){
    const m=readMeta(),a=m.events?.[id]?.activity,e=currentSession()?.events?.find(x=>x.id===id);if(!a||a.status!=='active'||!e)return;
    const planned=Math.max(1,m.events?.[id]?.sets?.length||Number(e.sets)||1);if(a.completedSets>=planned)return;
    a.completedSets+=1;a.setDoneAt=a.setDoneAt||[];a.setDoneAt[a.completedSets-1]=now();a.restStartedAt=now();a.restNotified=false;writeMeta(m);vibration(12);renderActiveRail();decorateTimeline();
  }
  function activityStatusText(a){if(!a)return'';if(a.status==='active')return'进行中';if(a.status==='paused')return'已暂停';if(a.status==='finished')return a.finishedAt?new Date(a.finishedAt).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})+' 完成':'已完成';return''}
  function formatClock(ms,mode='seconds'){
    ms=Math.max(0,ms);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),tenths=Math.floor(ms%1000/100),milli=Math.floor(ms%1000);
    const base=h?`${h}:${pad(m)}:${pad(s)}`:`${pad(m)}:${pad(s)}`;
    if(mode==='tenths')return`${base}.${tenths}`;if(mode==='milliseconds')return`${base}.${String(milli).padStart(3,'0')}`;return base;
  }
  function renderActiveRail(){
    let rail=$('#v82ActiveRail');if(!rail){rail=D.createElement('div');rail.id='v82ActiveRail';rail.className='v82ActiveRail';D.body.appendChild(rail)}
    const cur=activeEvent(),paused=pausedEvents(),target=cur||paused[0];const sheetOpen=$$('.sheetWrap.show').some(x=>x.id!=='finishSheet'),today=$('#todayView')?.classList.contains('active');
    if(!target||!today||sheetOpen){rail.classList.remove('show');D.body.classList.remove('v82-has-rail');return}
    const {e,a}=target,elapsed=elapsedActivity(a),estimate=a.estimateMs||autoEstimate(e),progress=Math.min(100,estimate?elapsed/estimate*100:0),planned=Math.max(1,readMeta().events?.[e.id]?.sets?.length||Number(e.sets)||1),rest=a.restStartedAt?now()-a.restStartedAt:0,prefs=readMeta().prefs||{},restMode=prefs.restMode||'soft',ready=rest>=120000;
    if(restMode!=='off'&&ready&&!a.restNotified){const m=readMeta();if(m.events?.[e.id]?.activity){m.events[e.id].activity.restNotified=true;writeMeta(m);if(restMode==='soft')vibration(18)}}
    rail.classList.add('show');D.body.classList.add('v82-has-rail');
    rail.innerHTML=`<div class="v82RailTop"><div class="v82RailCopy"><span>${a.status==='paused'?'已暂停':'正在进行'}</span><b>${e.name}</b><small>${formatClock(elapsed,'seconds')} · 预计约${Math.max(1,Math.round(estimate/60000))}分${e.kind==='strength'?` · ${a.completedSets||0}/${planned}组`:''}</small></div><div class="v82RailTools"><button class="v82Pause" data-v82-pause="${e.id}" aria-label="${a.status==='active'?'暂停':'继续'}">${a.status==='active'?'Ⅱ':'▶'}</button><button class="v82FinishNode" data-v82-finish="${e.id}" aria-label="长按完成"><i></i><span>✓</span></button></div></div><div class="v82Progress"><i style="width:${progress}%"></i></div><div class="v82RailBottom">${e.kind==='strength'?`<button class="v82SetDone" data-v82-setdone="${e.id}">完成一组</button>`:'<span></span>'}<span class="v82Rest">${restMode!=='off'&&rest?(restMode==='countdown'?`${ready?'可以开始':'还剩 '+formatClock(Math.max(0,120000-rest),'seconds')}`:`休息 ${formatClock(rest,'seconds')}${ready?' · 可以开始':' · 建议 2–3分'}`):' '}</span>${paused.length+(cur?0:-1)>0?`<button class="v82PausedCount" data-v82-paused>暂停 ${paused.length+(cur?0:-1)}</button>`:''}</div>`;
  }
  function injectPausedSheet(){if($('#v82PausedSheet'))return;D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="v82PausedSheet"><div class="sheet"><div class="grabber"></div><div class="sheetHead"><b>暂停中的项目</b><button class="closeBtn" data-v82-close-paused>×</button></div><div id="v82PausedList"></div></div></div>')}
  function showPaused(){injectPausedSheet();const list=pausedEvents();$('#v82PausedList').innerHTML=list.length?list.map(x=>`<button class="v82PausedRow" data-v82-resume="${x.e.id}"><span><b>${x.e.name}</b><small>${formatClock(elapsedActivity(x.a))} · 点击继续</small></span><i>▶</i></button>`).join(''):'<div class="empty">暂无暂停项目</div>';$('#v82PausedSheet').classList.add('show');renderActiveRail()}
  function decorateTimeline(){const c=readCore(),m=readMeta();for(const row of $$('#eventList [data-event]')){const e=(c.active?.events||[]).find(x=>x.id===row.dataset.event),a=e?m.events?.[e.id]?.activity:null;let tag=$('.v82EventStatus',row);if(!a){tag?.remove();continue}if(!tag){tag=D.createElement('span');tag.className='v82EventStatus';row.querySelector('span:nth-child(2)')?.appendChild(tag)}if(tag)tag.textContent=activityStatusText(a)}}
  function scanEstimateHost(){return $('#reviewStage:not(.hidden)')&&$('#saveScan')}
  function setEstimate(v,auto=false){estimateAuto=auto;estimateMs=v;renderEstimateControl()}
  function renderEstimateControl(){
    const save=$('#saveScan');if(!save||!scanEstimateHost())return;let b=$('#v82Estimate');if(!b){b=D.createElement('button');b.id='v82Estimate';b.className='v82Estimate';save.insertAdjacentElement('beforebegin',b);b.onclick=openEstimateSheet}
    const tmpl=selectedEventTemplate(),kind=tmpl?.kind||($('#cardioFields')?.classList.contains('hidden')?'strength':'cardio');if(kind==='cardio'){b.classList.add('hidden');return}b.classList.remove('hidden');if(estimateAuto||!estimateMs)estimateMs=autoEstimate(tmpl||{kind:'strength',equipmentId:tmpl?.equipmentId});b.innerHTML=`<span>预计时长</span><b>${estimateAuto?'自动 · ':''}约 ${Math.max(1,Math.round(estimateMs/60000))} 分</b><i>›</i>`
  }
  function injectEstimateSheet(){if($('#v82EstimateSheet'))return;D.body.insertAdjacentHTML('beforeend',`<div class="sheetWrap" id="v82EstimateSheet"><div class="sheet"><div class="grabber"></div><div class="sheetHead"><b>预计时长</b><button class="closeBtn" data-v82-close-est>×</button></div><div class="v82EstimateChoices" id="v82EstimateChoices"></div><div class="v82EstimateCustom"><span>自定</span><input id="v82EstimateInput" inputmode="numeric" placeholder="分钟"><button id="v82EstimateApply">应用</button></div></div></div>`);$('#v82EstimateChoices').onclick=e=>{const b=e.target.closest('[data-est]');if(!b)return;if(b.dataset.est==='auto'){estimateAuto=true;estimateMs=autoEstimate(selectedEventTemplate()||{kind:'strength'});}else{estimateAuto=false;estimateMs=Number(b.dataset.est)*60000}$('#v82EstimateSheet').classList.remove('show');renderEstimateControl()};$('#v82EstimateApply').onclick=()=>{const n=Math.max(1,Math.min(180,Number($('#v82EstimateInput').value)||0));if(!n)return;estimateAuto=false;estimateMs=n*60000;$('#v82EstimateSheet').classList.remove('show');renderEstimateControl()}}
  function openEstimateSheet(){injectEstimateSheet();const vals=['auto',3,5,7,10,15,20,30,45,60,90];$('#v82EstimateChoices').innerHTML=vals.map(v=>`<button data-est="${v}" class="${v==='auto'?estimateAuto:!estimateAuto&&Math.round(estimateMs/60000)===v?'active':''}">${v==='auto'?'自动':v+'分'}</button>`).join('');$('#v82EstimateSheet').classList.add('show')}
  function armSave(){if(!$('#reviewStage')||$('#reviewStage').classList.contains('hidden'))return;if($('#scanSheet .sheetHead>b')?.textContent?.includes('补一下'))return;saveArmed=true;const tmpl=selectedEventTemplate();if(estimateAuto||!estimateMs)estimateMs=autoEstimate(tmpl||{kind:$('#cardioFields')?.classList.contains('hidden')?'strength':'cardio'});setTimeout(watchSavedEvent,0)}
  function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1);startActivity(e,e.kind==='cardio'?(Number(e.duration)||15)*60000:estimateMs);saveArmed=false;estimateAuto=true;estimateMs=null;return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else saveArmed=false}
  function initKnown(){knownEvents=new Set((currentSession()?.events||[]).map(e=>e.id))}
  function augmentNumbers(){
    const setBox=$('#v8Sets');if(setBox&&!setBox.dataset.v82){setBox.dataset.v82='1'}
    const adj=setBox?.querySelectorAll('.v8Adjust>div');if(adj?.length>=2){const wrow=adj[0],rrow=adj[1];if(!wrow.querySelector('[data-v82-custom-weight]'))wrow.insertAdjacentHTML('beforeend','<button data-v82-custom-weight>自定</button>');if(!rrow.dataset.v82){rrow.dataset.v82='1';const active=rrow.querySelector('button.active')?.textContent?.trim();const vals=['—',1,3,5,6,8,10,12,15,20,25,30,40,50,75,100];rrow.innerHTML='<span>次数</span>'+vals.map(v=>`<button data-r="${v==='—'?'unknown':v}" class="${String(v)===active?'active':''}">${v}</button>`).join('')+'<button data-v82-custom-reps>自定</button>'}}
    const intensity=$('#intensityChoices');if(intensity&&!intensity.dataset.v82){const active=Number(intensity.querySelector('.active')?.dataset.value)||5;intensity.dataset.v82='1';intensity.innerHTML=Array.from({length:10},(_,i)=>i+1).map(v=>`<button data-choice="intensity" data-value="${v}" class="${v===active?'active':''}">${v}</button>`).join('')}
    const dur=$('#durationQuick');if(dur&&!dur.dataset.v82){const active=Number($('#duration')?.value)||15;dur.dataset.v82='1';dur.innerHTML=[5,10,15,20,30,45,60,90,120,180,240,300].map(v=>`<button data-quick="duration" data-value="${v}" class="${v===active?'active':''}">${v}</button>`).join('')}
  }
  function customNumber(kind){const max=kind==='reps'?999:1000,label=kind==='reps'?'次数':'重量 kg';let sheet=$('#v82NumberSheet');if(!sheet){D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="v82NumberSheet"><div class="sheet v82NumberSheet"><div class="grabber"></div><div class="sheetHead"><b id="v82NumberTitle">自定</b><button class="closeBtn" data-v82-close-num>×</button></div><input id="v82NumberInput" class="v82NumberInput" inputmode="decimal"><button id="v82NumberApply" class="saveRecord">应用</button></div></div>');sheet=$('#v82NumberSheet')}
    $('#v82NumberTitle').textContent=label;$('#v82NumberInput').value='';$('#v82NumberSheet').dataset.kind=kind;$('#v82NumberSheet').dataset.max=max;$('#v82NumberSheet').classList.add('show');setTimeout(()=>$('#v82NumberInput').focus(),80)
  }
  function applyCustomNumber(){const s=$('#v82NumberSheet'),kind=s?.dataset.kind,n=Math.max(0,Math.min(Number(s?.dataset.max)||999,Number($('#v82NumberInput').value)));if(!Number.isFinite(n))return;if(kind==='reps'){let b=$(`#v8Sets [data-r="${n}"]`);if(!b){b=D.createElement('button');b.dataset.r=String(n);b.style.display='none';$('#v8Sets')?.appendChild(b)}b.click()}else{let b=$(`#v8Sets [data-w="${n}"]`);if(!b){b=D.createElement('button');b.dataset.w=String(n);b.style.display='none';$('#v8Sets')?.appendChild(b)}b.click()}s.classList.remove('show')}
  function injectSettings(){
    const second=$('#settingsSheet .settingsList.second');if(!second||$('#v82Precision'))return;second.insertAdjacentHTML('afterbegin',`<div class="settingPlain v82Setting"><span>计时精度</span><div class="miniSeg" id="v82Precision"><button data-p="seconds">秒</button><button data-p="tenths">0.1秒</button><button data-p="milliseconds">毫秒</button></div></div><div class="settingPlain v82Setting"><span>组间提示</span><div class="miniSeg" id="v82RestMode"><button data-rm="off">关闭</button><button data-rm="soft">轻提示</button><button data-rm="countdown">倒计时</button></div></div>`);syncSettings()}
  function syncSettings(){const p=readMeta().prefs||{},precision=p.timerPrecision||'seconds',rest=p.restMode||'soft';$$('#v82Precision button').forEach(b=>b.classList.toggle('active',b.dataset.p===precision));$$('#v82RestMode button').forEach(b=>b.classList.toggle('active',b.dataset.rm===rest))}
  function setPref(k,v){const m=readMeta();m.prefs=m.prefs||{};m.prefs[k]=v;writeMeta(m);syncSettings();if(k==='timerPrecision')startPrecisionTimer();renderActiveRail()}
  function startPrecisionTimer(){clearInterval(precisionTimer);const mode=readMeta().prefs?.timerPrecision||'seconds',step=mode==='milliseconds'?33:mode==='tenths'?80:250;const tick=()=>{const c=readCore(),el=$('#liveTimer');if(!c.active||!el)return;el.textContent=formatClock(now()-c.active.start,mode)};tick();precisionTimer=setInterval(tick,step)}
  function styleSessionEnd(){const b=$('#finishHold');if(!b||b.dataset.v82)return;b.dataset.v82='1';b.innerHTML='<span class="v82EndGlyph"><i></i></span>';b.setAttribute('aria-label','长按结束训练')}
  function installNav(){const nav=$('.nav');if(nav)nav.classList.add('v82Nav')}
  function injectStyle(){if($('#v82Style'))return;const s=D.createElement('style');s.id='v82Style';s.textContent=`
:root{--muted:#a1a8b3;--dim:#747c88;--pad:20px}.pageHead>span,.metricPair span,.event small,.history small,.signal small,.evidence span,.nextCard span,.musclePanel>span,.numberLabel>small,.recognitionLine,.settingPlain>span,.settingLink>span{font-size:12.5px!important;line-height:1.45}.event .time,.history>b,.liveTag,.coverageCell span,.rhythmGrid span,.insightHero span,.v8SetHead span,.v81ContinueHead span{font-size:11.5px!important}.event strong,.history strong{font-size:15.5px!important;letter-spacing:-.012em}.sectionHead>b{font-size:15.5px!important}.sheetHead>b{font-size:19px!important}.resultRow span,.choiceControl>span,.numberLabel>span{font-size:13.5px!important}.nav.v82Nav{height:64px;padding:0 var(--pad) env(safe-area-inset-bottom);grid-template-columns:repeat(3,minmax(0,1fr));gap:0;background:linear-gradient(180deg,rgba(8,9,11,0),var(--bg) 25%)}.nav.v82Nav button{position:relative;border-radius:0;background:transparent!important;font-size:12.5px;font-weight:560;letter-spacing:.01em;color:var(--dim)}.nav.v82Nav button.active{color:var(--text);font-weight:650}.nav.v82Nav button.active:before{content:"";position:absolute;top:5px;left:50%;width:18px;height:2px;border-radius:99px;background:var(--accent);transform:translateX(-50%)}.captureDock{bottom:66px}.app{padding-bottom:100px}.holdFinish[data-v82="1"]{width:62px;height:62px;background:radial-gradient(circle at 36% 28%,rgba(255,255,255,.055),transparent 44%),#101319;box-shadow:inset 0 0 0 1px rgba(255,255,255,.045),0 12px 30px rgba(0,0,0,.22);transition:transform .14s ease}.holdFinish[data-v82="1"]:active{transform:scale(.965)}.holdFinish[data-v82="1"]:before{inset:0;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0);mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0)}.v82EndGlyph{width:18px;height:18px;border-radius:6px;display:grid;place-items:center;border:1px solid rgba(244,243,239,.22)}.v82EndGlyph i{display:block;width:6px;height:6px;border-radius:2px;background:var(--muted)}
.v82ActiveRail{display:none;position:fixed;left:50%;bottom:140px;transform:translateX(-50%);width:min(calc(100% - 40px),480px);z-index:43;padding:12px 13px 10px;border-radius:18px;background:rgba(16,19,25,.94);backdrop-filter:blur(18px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.055),0 20px 54px rgba(0,0,0,.34)}.v82ActiveRail.show{display:block}.v82RailTop{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center}.v82RailCopy{min-width:0}.v82RailCopy>span{display:block;font-size:10.5px;color:var(--accent2);font-weight:650;letter-spacing:.03em}.v82RailCopy>b{display:block;margin-top:2px;font-size:15.5px;font-weight:680;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v82RailCopy>small{display:block;margin-top:4px;font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums}.v82RailTools{display:flex;gap:7px;align-items:center}.v82Pause,.v82FinishNode{width:44px;height:44px;border-radius:14px;background:var(--s2);display:grid;place-items:center}.v82Pause{font-size:14px;color:var(--muted)}.v82FinishNode{position:relative;touch-action:none}.v82FinishNode:before{content:"";position:absolute;inset:1px;border-radius:14px;background:conic-gradient(var(--accent) var(--p,0%),rgba(255,255,255,.06) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0);mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0)}.v82FinishNode span{font-size:13px;color:var(--muted)}.v82Progress{height:2px;margin:9px 0 8px;border-radius:99px;background:rgba(255,255,255,.055);overflow:hidden}.v82Progress i{display:block;height:100%;border-radius:99px;background:var(--accent);opacity:.72;transition:width .35s ease}.v82RailBottom{min-height:28px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center}.v82SetDone{height:28px;padding:0 9px;border-radius:9px;background:rgba(115,124,255,.12);color:var(--accent2);font-size:11px;font-weight:650}.v82Rest{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v82PausedCount{font-size:10.5px;color:var(--dim)}.v82PausedRow{width:100%;min-height:66px;border-top:1px solid var(--line2);display:grid;grid-template-columns:1fr 36px;align-items:center;text-align:left}.v82PausedRow b{display:block;font-size:15px}.v82PausedRow small{display:block;margin-top:5px;font-size:11.5px;color:var(--muted)}.v82PausedRow i{font-style:normal;color:var(--accent2);text-align:center}.v82EventStatus{display:inline-block;margin-left:8px;padding:3px 6px;border-radius:999px;background:rgba(115,124,255,.1);color:var(--accent2);font-size:10.5px!important;font-weight:620}.v82Estimate{width:100%;height:54px;margin-top:8px;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);display:grid;grid-template-columns:1fr auto 16px;align-items:center;text-align:left}.v82Estimate>span{font-size:12.5px;color:var(--muted)}.v82Estimate>b{font-size:13px;font-weight:650}.v82Estimate>i{font-style:normal;color:var(--dim);font-size:19px;text-align:right}.v82EstimateChoices{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px 0 14px}.v82EstimateChoices::-webkit-scrollbar{display:none}.v82EstimateChoices button{height:40px;min-width:58px;padding:0 12px;border-radius:12px;background:var(--s2);font-size:12px;flex:0 0 auto}.v82EstimateChoices button.active{background:var(--text);color:#090a0c;font-weight:680}.v82EstimateCustom{height:58px;border-top:1px solid var(--line2);display:grid;grid-template-columns:60px 1fr 54px;align-items:center}.v82EstimateCustom span{font-size:12.5px;color:var(--muted)}.v82EstimateCustom input,.v82NumberInput{height:44px;border:0;background:transparent;color:var(--text);outline:0;font-size:20px;font-variant-numeric:tabular-nums}.v82EstimateCustom button{height:36px;border-radius:10px;background:var(--s2);font-size:11.5px}.v82NumberInput{width:100%;height:64px;border-bottom:1px solid var(--line2);font-size:34px;text-align:center}.v82Setting .miniSeg{min-width:190px}.v8Adjust>div{padding-bottom:2px}.v8Adjust button{min-width:50px}.choiceStrip,.quickValues{scroll-snap-type:x proximity}.choiceStrip button,.quickValues button{flex:0 0 auto;min-width:54px;scroll-snap-align:start}
@media(max-width:380px){:root{--pad:18px}.v82ActiveRail{width:calc(100% - 28px);bottom:136px}.v82RailCopy>b{font-size:15px}.v82RailCopy>small{font-size:11px}.v82Pause,.v82FinishNode{width:42px;height:42px}.v82Setting{align-items:flex-start!important;flex-direction:column!important;gap:10px!important;padding:12px 0!important}.v82Setting .miniSeg{width:100%}}
`;(D.head||D.documentElement).appendChild(s)}
  function finalizeSessionActivities(){const c=readCore(),s=c.sessions?.[0];if(!s)return;const m=readMeta();let dirty=false;for(const e of s.events||[]){const a=m.events?.[e.id]?.activity;if(!a||a.status==='finished')continue;if(a.status==='active')closeOpenInterval(a,s.end||now());a.status='finished';a.finishedAt=a.intervals?.at(-1)?.end||s.end||now();a.actualMs=elapsedActivity(a);a.restStartedAt=null;dirty=true}if(dirty)writeMeta(m)}
  function installObservers(){
    const evList=$('#eventList');if(evList)new MutationObserver(()=>{augmentNumbers();renderEstimateControl();renderActiveRail();decorateTimeline()}).observe(evList,{childList:true,subtree:true});
    new MutationObserver(()=>{augmentNumbers();renderEstimateControl();renderActiveRail();decorateTimeline();injectSettings();styleSessionEnd();installNav();if($('#finishSheet')?.classList.contains('show'))finalizeSessionActivities()}).observe(D.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  }
  function installEvents(){
    D.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.id==='saveScan')armSave();
      if(b.dataset.v82Pause){const a=activityFor(b.dataset.v82Pause);a?.status==='active'?pauseActivity(b.dataset.v82Pause):resumeActivity(b.dataset.v82Pause)}
      if(b.dataset.v82Setdone)completeOneSet(b.dataset.v82Setdone);
      if(b.hasAttribute('data-v82-paused'))showPaused();
      if(b.dataset.v82Resume){$('#v82PausedSheet')?.classList.remove('show');resumeActivity(b.dataset.v82Resume)}
      if(b.hasAttribute('data-v82-close-paused')){$('#v82PausedSheet')?.classList.remove('show');renderActiveRail()}
      if(b.hasAttribute('data-v82-close-est'))$('#v82EstimateSheet')?.classList.remove('show');
      if(b.hasAttribute('data-v82-close-num'))$('#v82NumberSheet')?.classList.remove('show');
      if(b.hasAttribute('data-v82-custom-reps')){e.preventDefault();e.stopPropagation();customNumber('reps')}
      if(b.hasAttribute('data-v82-custom-weight')){e.preventDefault();e.stopPropagation();customNumber('weight')}
      if(b.id==='v82NumberApply')applyCustomNumber();
      if(b.dataset.p)setPref('timerPrecision',b.dataset.p);
      if(b.dataset.rm)setPref('restMode',b.dataset.rm);
    },true);
    D.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-v82-finish]');if(!b)return;finishHoldStart=performance.now();b.setPointerCapture?.(e.pointerId);const dur=720,step=t=>{if(!finishHoldStart)return;const p=Math.min(1,(t-finishHoldStart)/dur);b.style.setProperty('--p',Math.round(p*100)+'%');if(p<1)b._raf=requestAnimationFrame(step);else{finishHoldStart=0;finishActivity(b.dataset.v82Finish);b.style.setProperty('--p','0%')}};b._raf=requestAnimationFrame(step)},true);
    ['pointerup','pointercancel','pointerleave'].forEach(type=>D.addEventListener(type,e=>{const b=e.target.closest?.('[data-v82-finish]');if(!b||!finishHoldStart)return;finishHoldStart=0;cancelAnimationFrame(b._raf);b.style.setProperty('--p','0%')},true));
    const finish=$('#finishHold');if(finish){finish.addEventListener('pointerdown',()=>{finishHapticDone=false;setTimeout(()=>{if(finish.matches(':active')&&!finishHapticDone){finishHapticDone=true;vibration(18)}},720)},true)}
    D.addEventListener('visibilitychange',()=>{if(!D.hidden){renderActiveRail();decorateTimeline();startPrecisionTimer()}});window.addEventListener('pageshow',()=>{renderActiveRail();decorateTimeline();startPrecisionTimer()})
  }
  injectStyle();injectEstimateSheet();injectPausedSheet();injectSettings();styleSessionEnd();installNav();initKnown();augmentNumbers();renderEstimateControl();renderActiveRail();decorateTimeline();startPrecisionTimer();installEvents();installObservers();
  setInterval(()=>{renderActiveRail();decorateTimeline()},500);
  const ver=$('.versionLine');if(ver)ver.textContent='版本 8.2';
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot82,{once:true});else setTimeout(boot82,0);
})();