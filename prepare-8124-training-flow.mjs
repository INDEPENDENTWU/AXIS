import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 training flow] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const regexOnce=(src,re,to,label)=>{const hits=src.match(re)||[];if(hits.length!==1)fail(`${label} expected once, found ${hits.length}`);return src.replace(re,to)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Core equipment identity: Recent and Live Route must remain directly selectable even before the extended library hydrates. */
{
  const f='app.js';let s=read(f);
  const eq=`function eqById(id){const own=eqAll().find(e=>e.id===id);if(own)return own;const x=(window.__AXIS_873_LIBRARY__||[]).find(e=>e.id===id);if(x){const muscles=[...(x.muscles||[])];return{id:x.id,name:x.name,type:x.type||'strength',pattern:derivePattern(x.type||'strength',muscles),muscles,effect:muscles.slice(0,2).join(' · '),canonical:true}}const h=allEvents().find(e=>e.equipmentId===id);if(h)return{id:h.equipmentId,name:h.name,type:h.kind||'strength',pattern:h.pattern||derivePattern(h.kind||'strength',h.muscles||[]),muscles:[...(h.muscles||[])],effect:h.effect||'',canonical:true,historyFallback:true};return null}`;
  s=regexOnce(s,/function eqById\(id\)\{[^\n]*\}/g,eq,'history-backed equipment resolver');

  const bounds=`function homeSessionBounds(s,m=homeMeta()){if(!s)return{start:0,end:0};const starts=[Number(s.start)||0],ends=[Number(s.end)||0];for(const e of ev(s)){const a=m.events?.[e.id]?.activity,et=Number(e.time)||0;if(et)ends.push(et);if(a){const st=Number(a.startedAt)||0;if(st)starts.push(st);const fin=Number(a.finishedAt)||0,pause=Number(a.pausedAt)||0;if(fin)ends.push(fin);if(pause)ends.push(pause);for(const x of a.intervals||[]){const xs=Number(x.start)||0,xe=Number(x.end)||0;if(xs)starts.push(xs);if(xe)ends.push(xe)}}}const ss=Number(s.start)||Math.min(...starts.filter(Boolean)),start=Number.isFinite(ss)?ss:0,end=Math.max(start,...ends.filter(Number.isFinite));return{start,end}}\nfunction homeSessionEnd(s){return homeSessionBounds(s).end}`;
  s=regexOnce(s,/function homeSessionEnd\(s\)\{[^\n]*\}/g,bounds,'session bounds resolver');

  const latest=`function homeLatestActivity(s,m,t=Date.now()){let best=null,bestEnd=0;for(const e of ev(s)){const a=m.events?.[e.id]?.activity;let end=0;if(a){for(const x of a.intervals||[]){const xe=Number(x.end)||((a.status==='active'&&x===a.intervals.at(-1))?t:0);if(xe>end)end=xe}end=Math.max(end,Number(a.finishedAt)||0,Number(a.pausedAt)||0)}end=Math.max(end,Number(e.time)||0);if(end>=bestEnd){best=e;bestEnd=end}}return{e:best||ev(s).at(-1)||null,end:bestEnd||Number(s?.start)||t}}\n`;
  s=once(s,'function deriveHomeState(t=Date.now()){',latest+'function deriveHomeState(t=Date.now()){','latest activity helper');

  const transitionRe=/const events=ev\(s\);\s*if\(events\.length\)\{[\s\S]*?\n\s*\}\s*return\{\.\.\.base,visible:false,scope:'activity',mode:'session'/;
  const transition=`const events=ev(s);\n    if(events.length){\n      const latest=homeLatestActivity(s,m,t),last=latest.e,end=latest.end,gap=Math.max(0,t-end),th=Math.max(180000,homeRestThreshold(m,last)*1.5),over=Math.max(0,gap-th),mode=over>180000?'danger':over>0?'warn':'between';\n      const title=over>180000?'间歇过长':over>0?'可以开始下一项':'项目间歇';\n      const meta=over?last.name+' 已完成 · 已超出建议 '+homeClock(over):last.name+' 已完成 · 建议间隔 '+homeClock(th);\n      return{...base,visible:true,scope:'transition',mode,title,value:homeClock(gap),meta,progress:Math.min(1,gap/th),dial:over?'+'+homeClock(over):homeClock(Math.max(0,th-gap)),aLabel:'',a:'',bLabel:'',b:''};\n    }\n    return{...base,visible:false,scope:'activity',mode:'session'`;
  s=regexOnce(s,transitionRe,transition,'interval-derived project transition');

  const completedRe=/const last=state\.sessions\?\.\[0\];\s*if\(!last\)return base;[\s\S]*?\n\s*const usual=homeUsualGap\(\);/;
  const completed=`const last=state.sessions?.[0];\n  if(!last)return base;\n  const bounds=homeSessionBounds(last,m),start=bounds.start,end=bounds.end,gap=Math.max(0,t-end),span=Math.max(0,end-start);\n  if(homeSameDay(end,t)){\n    const items=ev(last).length,sets=homeCompletedSets(last,m),parts=[items+'项'];if(sets)parts.push(sets+'组');parts.unshift('开始 '+tlabel(start));parts.push('完成 '+tlabel(end));\n    return{...base,scope:'complete',mode:'complete',eyebrow:'今天完成',title:'',value:homeDurationLabel(span),meta:parts.join(' · '),progress:0,dial:'',aLabel:'',a:'',bLabel:'',b:''};\n  }\n  const usual=homeUsualGap();`;
  s=regexOnce(s,completedRe,completed,'completed session true start/end facts');

  const completeRe=/function completeFinish\(\)\{[^\n]*\}/g;
  const complete=`function sealSessionActivities(s,t){const m=homeMeta();for(const e of ev(s)){const a=m.events?.[e.id]?.activity;if(!a||a.status==='finished')continue;const was=a.status,last=a.intervals?.at(-1);if(was==='active'&&last&&!last.end)last.end=t;const lastEnd=Math.max(0,...(a.intervals||[]).map(x=>Number(x.end)||0));a.status='finished';a.finishedAt=was==='active'?t:(lastEnd||Number(a.pausedAt)||t);a.pausedAt=null;a.restStartedAt=null;a.actualMs=homeActivityElapsed(a,t)}try{localStorage.setItem(HOME_META,JSON.stringify(m))}catch{}}\nfunction completeFinish(){finishCancelHold();if(!state.active)return;const t=Date.now();state.active.end=t;const s=state.active;sealSessionActivities(s,t);state.sessions.unshift(s);state.active=null;save();setText('#finishDuration',mins(s)+'分钟');setText('#finishItems',ev(s).length);setText('#finishSets',ev(s).reduce((n,e)=>n+(e.kind==='strength'?Number(e.sets)||0:1),0));openSheet('finishSheet');render()}`;
  s=regexOnce(s,completeRe,complete,'session finish seal');

  if(!s.includes('function homeLatestActivity(')||!s.includes('function homeSessionBounds(')||!s.includes('sealSessionActivities'))fail('core time semantics markers missing');
  syntax(s,f);write(f,s);
}

/* Project switching: a strength item with every planned set completed is finished at the switch boundary; otherwise it is paused. */
{
  const f='v82-runtime.js';let s=read(f);
  const next=`function pauseOthers(except){const m=readMeta(),t=now();for(const e of currentSession()?.events||[]){if(e.id===except)continue;const a=m.events?.[e.id]?.activity;if(a?.status==='active'){closeOpenInterval(a,t);const planned=Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1),done=Math.max(0,Number(a.completedSets)||0),complete=e.kind==='strength'&&done>=planned;if(complete){a.status='finished';a.finishedAt=t;a.actualMs=elapsedActivity(a);a.pausedAt=null}else{a.status='paused';a.pausedAt=t}a.restStartedAt=null}}writeMeta(m)}`;
  s=regexOnce(s,/function pauseOthers\(except\)\{[^\n]*\}/g,next,'switch boundary semantics');
  syntax(s,f);write(f,s);
}

/* Quick Record is genuinely direct for Recent and external delegates such as Live Route. */
{
  const f='v61.js';let s=read(f);
  const quick=`function chooseQuick(id){$('#quickRecordSheet')?.classList.remove('show');let tries=0;const open=()=>{if(window.__AXIS_SELECT_EQUIPMENT__?.(id,true)){showQuickEditor(id);syncDock();return true}return false};if(open())return;const wait=()=>{if(open())return;if(tries++<60){setTimeout(wait,25);return}toast('暂时无法直接打开这个项目')};setTimeout(wait,0)}`;
  s=regexOnce(s,/function chooseQuick\(id\)\{[^\n]*\}/g,quick,'direct Quick Record route');

  const model=`function timeModel(s){if(!s?.events?.length)return{span:0,effective:0,gap:0,segments:0,lastEnd:0};const m=mread(),iv=[];for(const e of s.events){const activity=m.events?.[e.id]?.activity,real=(activity?.intervals||[]).map(x=>[Number(x.start)||0,Number(x.end)||((activity.status==='active')?Date.now():0)]).filter(x=>x[0]>0&&x[1]>=x[0]);if(real.length){iv.push(...real);continue}if(e.kind==='cardio'){const d=Math.max(1,Number(e.duration)||1)*60000,et=e.time||Date.now();iv.push([et-d,et]);continue}const a=(m.events?.[e.id]?.sets||setsOf(e)).map(x=>normalizeSavedSet(x,true)).filter(x=>x.state!=='unfinished'),done=a.map(x=>Number(x.doneAt)||0).filter(Boolean).sort((x,y)=>x-y);if(done.length)iv.push([done[0]-45000,done.at(-1)]);else{const n=Math.max(1,a.length),d=n*45000+Math.max(0,n-1)*90000,et=e.time||Date.now();iv.push([et-d,et])}}if(!iv.length)return{span:0,effective:0,gap:0,segments:0,lastEnd:0};iv.sort((a,b)=>a[0]-b[0]);const merged=[];for(const x of iv){const p=merged.at(-1);if(p&&x[0]<=p[1])p[1]=Math.max(p[1],x[1]);else merged.push([...x])}const span=Math.max(0,iv.at(-1)[1]-iv[0][0]),effective=merged.reduce((n,x)=>n+Math.max(0,x[1]-x[0]),0);return{span,effective,gap:Math.max(0,span-effective),segments:merged.length,lastEnd:Math.max(...iv.map(x=>x[1]))}}`;
  s=regexOnce(s,/function timeModel\(s\)\{[\s\S]*?\}\nfunction completedCount/g,model+'\nfunction completedCount','interval-union session time model');

  const marker=`\ntry{window.__AXIS_QUICK_RECORD_FOR__=(id)=>{id=String(id||'').trim();if(!id)return false;chooseQuick(id);return true};window.__AXIS_8124_QUICK_FLOW__={version:'8.12.4',recentDirect:true,liveRouteDelegate:true,catalogHop:false}}catch{}\n`;
  const end=s.lastIndexOf('})();');if(end<0)fail('v61 IIFE end missing');s=s.slice(0,end)+marker+s.slice(end);
  syntax(s,f);write(f,s);
}

/* Live Route stays read-only, but its suggestions become actionable delegates into Quick Record. */
{
  const f='runtime/browser/axis-live-route-presenter.js';let s=read(f);
  s=once(s," section.classList.remove('hidden');"," if(body){const leadEl=body.querySelector('.axis813RouteLead');if(leadEl){leadEl.dataset.axisRouteId=lead.id;leadEl.tabIndex=0;leadEl.setAttribute('role','button')}body.querySelectorAll('.axis813RouteTrail>div').forEach((el,i)=>{const item=rest[i];if(item){el.dataset.axisRouteId=item.id;el.tabIndex=0;el.setAttribute('role','button')}});const altEl=body.querySelector('.axis813RouteAlt');if(altEl&&model.alternative){altEl.dataset.axisRouteId=model.alternative.id;altEl.tabIndex=0;altEl.setAttribute('role','button')}}\n section.classList.remove('hidden');",'route action identities');
  const actions=`\nfunction installRouteActions(){\n const open=el=>{const id=String(el?.dataset?.axisRouteId||'').trim();if(!id)return false;return window.__AXIS_QUICK_RECORD_FOR__?.(id)===true};\n D.addEventListener('click',e=>{const row=e.target?.closest?.('#axis813Route [data-axis-route-id]');if(!row)return;e.preventDefault();open(row)},true);\n D.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const row=e.target?.closest?.('#axis813Route [data-axis-route-id]');if(!row)return;e.preventDefault();open(row)},true)\n}\n`;
  s=once(s,'function boot(){\n ensureRoute();installObservers();refresh(\'boot\');\n}',actions+"function boot(){\n ensureRoute();installRouteActions();installObservers();refresh('boot');\n}",'route action owner');
  s=once(s,"version:'8.13-stage3',owner:'v813-live-route',state:'booting',recordingOwner:false,storageOwner:false,networkOwner:false,writes:0,storageWrites:0,renderCount:0,lastReason:'boot',error:null,","version:'8.13-stage3',owner:'v813-live-route',state:'booting',recordingOwner:false,storageOwner:false,networkOwner:false,writes:0,storageWrites:0,actionDelegate:'quick-record',renderCount:0,lastReason:'boot',error:null,",'read-only action delegate marker');
  syntax(s,f);write(f,s);
}

/* Settings Learning / Cloud & AI use the exact native row height instead of the inherited 64px custom gate. */
{
  const f='v87-runtime.js';let s=read(f);const end=s.lastIndexOf('})();');if(end<0)fail('v87 runtime IIFE end missing');
  const block=String.raw`
/* AXIS 8.12.4 — exact native Settings row vertical geometry. */
(function axis8124SettingsNativeGeometry(){
 if(D.querySelector('#v8124SettingsNativeGeometry'))return;
 const st=D.createElement('style');st.id='v8124SettingsNativeGeometry';st.textContent=
  '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{height:60px!important;min-height:60px!important;padding-top:0!important;padding-bottom:0!important;align-items:center!important}';
 D.head.appendChild(st);
 const sync=()=>{const ref=$('#profileBtn'),h=ref?.getBoundingClientRect().height;if(!h)return false;for(const row of [$('#v810ConfigEntry'),$('#v811ServiceEntry')]){if(!row)continue;row.style.setProperty('height',h+'px','important');row.style.setProperty('min-height',h+'px','important')}return true};
 window.__AXIS_SYNC_SETTINGS_VERTICAL__=sync;
 const settle=()=>{sync();setTimeout(sync,70);setTimeout(sync,180)};
 D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(settle,0)},true);window.addEventListener('pageshow',()=>setTimeout(settle,0),{passive:true});setTimeout(settle,0)
})();
try{window.__AXIS_8124_SETTINGS_GEOMETRY__={version:'8.12.4',reference:'#profileBtn',nativeHeight:true,textCenter:true,chevronCenter:true,trainingOwner:false}}catch{}
`;
  s=s.slice(0,end)+block+'\n'+s.slice(end);syntax(s,f);write(f,s);
}

console.log('[AXIS 8.12.4 training flow] PASS · interval-derived gaps · sealed session bounds · direct Quick Record · actionable read-only Live Route · exact native Settings row geometry');
