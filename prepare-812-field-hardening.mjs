import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12 field hardening] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/*
 * Temporary compatibility hardening on the 8.12 owner graph.
 * These changes deliberately happen after all inherited prepare steps and before build-hardened.
 * Stage 2+ Runtime work must absorb these semantics before this transform is retired.
 */

{
  const FILE='v874-set-bridge.js';
  let src=read(FILE);
  src=once(
    src,
    "function openPlan(){const a=values()[0]||activeInfo()||{w:20,r:10};planBase={w:Number(a.w)||0,r:Number(a.r)||1};planN=rows().length||1;planMode='same';renderPlan();$('#v875PlanSheet').classList.add('show')}",
    "function openPlan(){const owned=window.__AXIS_RECORDING__?.first?.(),a=owned||values()[0]||activeInfo()||{w:20,r:10};planBase={w:Number(a.w)||0,r:Number(a.r)||1};planN=Math.max(1,Number(owned?.count)||rows().length||1);planMode='same';renderPlan();$('#v875PlanSheet').classList.add('show')}",
    'plan uses recording-owner first set'
  );
  src=once(
    src,
    "D.addEventListener('axis:recording-render',()=>patch());",
    "D.addEventListener('axis:recording-render',()=>patch());D.addEventListener('axis:recording-change',()=>patch());",
    'immediate group-plan rebind after recording change'
  );
  syntax(src,FILE);write(FILE,src);
}

/* The canonical 8.7.12/8.12 plan sheet also reads the recording owner directly;
   its DOM preview may be rebuilt after the legacy entry opens. */
{
  const FILE='v8712-runtime.js';
  let src=read(FILE);
  src=once(
    src,
    " const vals=rowValues(),base=vals[0]||{w:20,r:10},n=Math.max(1,vals.length||1);",
    " const vals=rowValues(),owned=window.__AXIS_RECORDING__?.first?.(),base=owned||vals[0]||{w:20,r:10},n=Math.max(1,Number(owned?.count)||vals.length||1);",
    'canonical plan baseline from recording owner'
  );
  syntax(src,FILE);write(FILE,src);
}

{
  const FILE='v87-runtime.js';
  let src=read(FILE);

  src=once(src,
    "function elapsed(a,t=now()){if(!a)return 0;return(a.intervals||[]).reduce((n,x)=>n+Math.max(0,(x.end||((a.status==='active')?t:x.start))-x.start),0)}",
    "function elapsed(a,t=now()){if(!a)return 0;return(a.intervals||[]).reduce((n,x)=>n+Math.max(0,(x.end||((a.status==='active')?t:x.start))-x.start),0)}\nfunction restElapsed(a,t=now()){if(!a)return 0;const settled=Math.max(0,Number(a.restAccumulatedMs)||0),live=a.status==='paused'&&a.restStartedAt?Math.max(0,t-Number(a.restStartedAt)):0;return settled+live}\nfunction settleRest(a,t=now()){if(!a?.restStartedAt)return;const start=Number(a.restStartedAt)||t;a.restAccumulatedMs=Math.max(0,Number(a.restAccumulatedMs)||0)+Math.max(0,t-start);a.restStartedAt=null}",
    'rest accumulation helpers');

  src=once(src,
    "if(a.status==='active')closeOpen(a,t);a.status='finished';",
    "if(a.status==='active')closeOpen(a,t);else if(a.status==='paused')settleRest(a,t);a.status='finished';",
    'finish settles paused rest');

  src=once(src,
    "closeOpen(x.a,t);x.a.status='paused';x.a.pausedAt=t;x.a.restStartedAt=null",
    "closeOpen(x.a,t);x.a.status='paused';x.a.pausedAt=t;x.a.restStartedAt=t;x.a.restAccumulatedMs=Math.max(0,Number(x.a.restAccumulatedMs)||0)",
    'reconcile pause starts rest');

  src=regexOnce(src,/function toggle\(id\)\{[\s\S]*?\}\s*function completeSet/,`function toggle(id){
 const c=readCore(),m=readMeta(),a=m.events?.[id]?.activity;if(!c.active||!a||a.status==='finished')return;const t=now();
 if(a.status==='active'){
  closeOpen(a,t);a.status='paused';a.pausedAt=t;a.restStartedAt=t;a.restAccumulatedMs=Math.max(0,Number(a.restAccumulatedMs)||0)
 }else{
  for(const e of c.active.events||[]){if(e.id===id)continue;const x=m.events?.[e.id]?.activity;if(x?.status==='active'){closeOpen(x,t);x.status='paused';x.pausedAt=t;x.restStartedAt=t;x.restAccumulatedMs=Math.max(0,Number(x.restAccumulatedMs)||0)}}
  settleRest(a,t);a.status='active';a.lastResumedAt=t;a.pausedAt=null;a.intervals=a.intervals||[];a.intervals.push({start:t,end:null})
 }
 writeMeta(m);renderNow(true);renderTimeline()
}
function completeSet`,'pause/rest state semantics');

  src=once(src,
    "a.setDoneAt[done]=now();a.restStartedAt=now();a.restNotified=false;",
    "a.setDoneAt[done]=now();a.restStartedAt=null;a.restNotified=false;",
    'set completion does not imply rest');

  src=once(src,
    "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0;",
    "rest=a.status==='paused'?restElapsed(a):0;",
    'paused rest rendering');

  src=once(src,
    "$('#v87Rest').textContent=rest?`休息 ${clock(rest)}`:a.status==='paused'?'实际时间已暂停':planDone?'切换项目时自动结束':' ';",
    "$('#v87Rest').textContent=a.status==='paused'?`休息 ${clock(rest)}`:planDone?'切换项目时自动结束':' ';",
    'paused first frame renders rest at zero');

  src=once(src,
    ".v87Tool{width:46px;height:46px;border:0;border-radius:15px;background:rgba(255,255,255,.045);display:grid;place-items:center;color:var(--muted);font-size:13px}",
    ".v87Tool{width:46px;height:46px;border:0;border-radius:15px;background:rgba(255,255,255,.045);display:grid;place-items:center;color:var(--muted);font-size:13px;-webkit-tap-highlight-color:transparent;touch-action:manipulation}",
    'pause tap highlight removal');

  const lifecycle=`
function axis812ResumeLearning(){
 try{axis8101Install?.();injectRestSpeak?.();axis810RenderSettings?.();renderNow(true)}catch{}
}
function axis812InstallLearningResume(){
 if(D.documentElement.dataset.axis812LearningResume==='1')return;D.documentElement.dataset.axis812LearningResume='1';
 window.addEventListener('pageshow',axis812ResumeLearning,{passive:true});
 window.addEventListener('focus',axis812ResumeLearning,{passive:true});
 D.addEventListener('visibilitychange',()=>{if(!D.hidden)axis812ResumeLearning()},{passive:true})
}
`;
  src=once(src,"function boot(){",lifecycle+"\nfunction boot(){",'standalone learning lifecycle bridge');
  src=once(src,"axis8101Install();try{injectRestSpeak()}","axis8101Install();axis812InstallLearningResume();try{injectRestSpeak()}",'learning resume boot install');

  if(!src.includes('function restElapsed(')||!src.includes('function settleRest('))fail('rest accumulation model missing');
  if(!src.includes("a.restStartedAt=t")||src.includes('a.setDoneAt[done]=now();a.restStartedAt=now()'))fail('pause/rest semantics not converged');
  if(src.includes("a.status==='paused'?'实际时间已暂停'"))fail('paused transient copy survived');
  if(!src.includes('axis812InstallLearningResume()'))fail('standalone learning lifecycle bridge missing');
  if(lifecycle.includes('v89SpeakEnabled')||lifecycle.includes('readMeta()'))fail('standalone lifecycle must not recover learning preferences from training metadata');
  syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.12 field hardening] PASS · recording-owner group-plan baseline · pause-owned cumulative rest · first-frame rest · no set-complete rest · isolated standalone learning resume');
