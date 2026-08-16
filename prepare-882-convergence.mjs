import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8.2 convergence: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Home is one state model. DOM is static; app.js only mutates values/data-mode. */
{
  const FILE='index.html';let src=read(FILE);
  src=once(src,
    '      <div class="pageHead"><h1>今天</h1><span id="todayDate"></span></div>\n      <div id="idleHome">',
`      <div class="pageHead"><h1>今天</h1><span id="todayDate"></span></div>
      <section class="axisNowHero" id="axisNowHero" data-mode="ready" aria-live="polite">
        <div class="axisNowTop"><span>现在</span><time id="axisNowClock">--:--</time></div>
        <div class="axisNowStage">
          <div class="axisNowCopy"><span id="axisNowTitle">准备开始</span><b id="axisNowValue">—</b><small id="axisNowMeta">今天还没有训练记录</small></div>
          <div class="axisNowDial" id="axisNowDial"><i></i><span id="axisNowDialText">—</span></div>
        </div>
        <div class="axisNowRail"><i id="axisNowRailFill"></i></div>
        <div class="axisNowFacts"><div><span id="axisNowFactALabel">本周</span><b id="axisNowFactA">0 分钟</b></div><div><span id="axisNowFactBLabel">训练</span><b id="axisNowFactB">0 次</b></div></div>
      </section>
      <div id="idleHome">`,
    'home now hero');
  write(FILE,src);
}

{
  const FILE='app.js';let src=read(FILE);
  src=once(src,
    "const MUSCLES=['胸肌','背部','肩部','肱二头肌','肱三头肌','核心','臀部','股四头肌','腘绳肌','小腿','心肺'];",
    "const MUSCLES=['胸肌','背部','肩部','肱二头肌','肱三头肌','前臂','核心','腰部','臀部','股四头肌','腘绳肌','内收肌','髋屈肌','小腿','胫骨前肌','前锯肌','心肺'];",
    'expanded canonical muscle set');
  src=once(src,
    "let state={sessions:[],active:null,selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{...DEFAULT_PROFILE},prefs:JSON.parse(JSON.stringify(DEFAULT_PREFS))};",
    "let state={sessions:[],active:null,selectedEq:null,frames:[],clip:null,stream:null,ai:null,localGuess:null,forceClip:false,profile:{...DEFAULT_PROFILE},prefs:JSON.parse(JSON.stringify(DEFAULT_PREFS))};",
    'transient local recognition state');

  const homeModel=`
const HOME_META='axis_v8_meta';
function homeMeta(){try{const m=JSON.parse(localStorage.getItem(HOME_META)||'null')||{};m.events=m.events||{};m.prefs=m.prefs||{};return m}catch{return{events:{},prefs:{}}}}
function homeClock(ms){ms=Math.max(0,Number(ms)||0);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return h?\`${'${h}'}:${'${pad(m)}'}:${'${pad(s)}'}\`:\`${'${pad(m)}'}:${'${pad(s)}'}\`}
function homeGap(ms){ms=Math.max(0,Number(ms)||0);const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000);if(d)return\`${'${d}'}天${'${h?` ${h}小时`:``}'}\`;if(h)return\`${'${h}'}小时 ${'${m}'}分\`;return\`${'${Math.max(0,m)}'}分钟\`}
function homeActivityElapsed(a,t=Date.now()){return(a?.intervals||[]).reduce((n,x)=>n+Math.max(0,(x.end||((a.status==='active')?t:x.start))-x.start),0)}
function homePlanned(e,m){return Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1)}
function homeSessionEnd(s){if(!s)return 0;const xs=ev(s).map(e=>Number(e.time)||0).filter(Boolean);return Number(s.end)||Math.max(Number(s.start)||0,...xs)}
function homeMedian(a){if(!a.length)return 0;const x=[...a].sort((p,q)=>p-q),i=Math.floor(x.length/2);return x.length%2?x[i]:(x[i-1]+x[i])/2}
function homeUsualGap(){const xs=(state.sessions||[]).slice(0,9).map(s=>Number(s.start)||0).filter(Boolean),ds=[];for(let i=0;i<xs.length-1;i++){const d=xs[i]-xs[i+1];if(d>=8*3600000&&d<=10*86400000)ds.push(d)}if(ds.length>=2)return homeMedian(ds);const f=Math.max(0,Number(state.profile.freq)||0);return f?Math.max(20*3600000,7*86400000/f):48*3600000}
function homeRestThreshold(m,e){const v=String(m.prefs?.reminderTiming||'auto');if(v==='90')return 90000;if(v==='120')return 120000;if(v==='180')return 180000;const vals=[];for(const h of (state.sessions||[]).flatMap(s=>ev(s)).filter(x=>x.equipmentId===e?.equipmentId).slice(0,8)){const ts=(m.events?.[h.id]?.sets||[]).map(s=>Number(s.doneAt)||0).filter(Boolean).sort((a,b)=>a-b);for(let i=1;i<ts.length;i++){const d=ts[i]-ts[i-1]-45000;if(d>=45000&&d<=360000)vals.push(d)}}return vals.length>=2?Math.max(75000,Math.min(240000,homeMedian(vals))):120000}
function deriveHomeState(t=Date.now()){
 const r7=recent(7),weekMins=r7.reduce((a,s)=>a+mins(s),0),weekSessions=r7.length,base={mode:'ready',title:'准备开始',value:'—',meta:'今天还没有训练记录',progress:0,dial:'—',aLabel:'本周',a:\`${'${weekMins}'} 分钟\`,bLabel:'训练',b:\`${'${weekSessions}'} 次\`};
 const s=state.active,m=homeMeta();
 if(s){
  const sesMs=Math.max(0,t-s.start),pairs=ev(s).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a),active=pairs.filter(x=>x.a.status==='active').sort((x,y)=>(y.a.lastResumedAt||y.a.startedAt||0)-(x.a.lastResumedAt||x.a.startedAt||0))[0],paused=pairs.filter(x=>x.a.status==='paused').sort((x,y)=>(y.a.pausedAt||0)-(x.a.pausedAt||0))[0];
  if(active){const {e,a}=active,actual=homeActivityElapsed(a,t),est=Math.max(60000,Number(a.estimateMs)||actual||60000),total=homePlanned(e,m),done=Math.max(0,Number(a.completedSets)||0),rest=a.restStartedAt?Math.max(0,t-a.restStartedAt):0;if(rest){const th=homeRestThreshold(m,e),over=Math.max(0,rest-th),mode=over>120000?'danger':over>0?'warn':'rest',title=over>120000?'休息过久':over>0?'休息偏久':'组间休息';return{...base,mode,title,value:homeClock(rest),meta:\`${'${e.name}'} · 建议 ${'${homeClock(th)}'}\`,progress:Math.min(1,rest/th),dial:over?\`+${'${homeClock(over)}'}\`:\`${'${Math.max(0,Math.round((th-rest)/1000))}'}s\`,aLabel:'完成',a:e.kind==='strength'?\`${'${done}'}/${'${total}'} 组\`:'进行中',bLabel:over?'已超出':'还剩',b:over?homeClock(over):homeClock(Math.max(0,th-rest))}}
   return{...base,mode:'active',title:'正在训练',value:homeClock(actual),meta:\`${'${e.name}'}${'${e.kind===\'strength\'?` · ${done}/${total}组`:``}'} · 剩余 ${'${homeClock(Math.max(0,est-actual))}'}\`,progress:Math.min(1,actual/est),dial:\`${'${Math.round(Math.min(1,actual/est)*100)}'}%\`,aLabel:'本次',a:homeClock(sesMs),bLabel:'已记录',b:\`${'${ev(s).length}'} 项\`}}
  }
  if(paused){const {e,a}=paused,pause=Math.max(0,t-(a.pausedAt||t)),actual=homeActivityElapsed(a,t),total=homePlanned(e,m),done=Math.max(0,Number(a.completedSets)||0);return{...base,mode:'paused',title:'项目暂停',value:homeClock(pause),meta:\`${'${e.name}'} · 实际 ${'${homeClock(actual)}'}\`,progress:0,dial:'Ⅱ',aLabel:'完成',a:e.kind==='strength'?\`${'${done}'}/${'${total}'} 组\`:'暂停',bLabel:'本次',b:homeClock(sesMs)}}
  if(ev(s).length){const last=ev(s).at(-1),la=m.events?.[last.id]?.activity,end=Number(la?.finishedAt)||Number(last.time)||s.start,gap=Math.max(0,t-end),th=Math.max(180000,homeRestThreshold(m,last)*1.5),over=Math.max(0,gap-th),mode=over>180000?'danger':over>0?'warn':'between',title=over>180000?'休息过久':over>0?'休息偏久':'准备下一项';return{...base,mode,title,value:homeClock(gap),meta:\`${'${last.name}'} 已完成 · 本次 ${'${homeClock(sesMs)}'}\`,progress:Math.min(1,gap/th),dial:over?\`+${'${homeClock(over)}'}\`:\`${'${Math.round(Math.min(1,gap/th)*100)}'}%\`,aLabel:'已记录',a:\`${'${ev(s).length}'} 项\`,bLabel:over?'已超出':'建议切换',b:over?homeClock(over):homeClock(Math.max(0,th-gap))}}
  return{...base,mode:'session',title:'训练已开始',value:homeClock(sesMs),meta:'等待第一项记录',progress:0,dial:'●',aLabel:'已记录',a:'0 项',bLabel:'状态',b:'进行中'}
 }
 const last=state.sessions?.[0];if(!last)return base;const gap=Math.max(0,t-homeSessionEnd(last)),usual=homeUsualGap(),ratio=usual?gap/usual:0,mode=ratio>1.35?'warn':ratio>=.72?'ready':'recovery',title=ratio>1.35?'休息较久':ratio>=.72?'可以训练':'恢复中';return{...base,mode,title,value:homeGap(gap),meta:\`距上次训练 · 常见间隔约 ${'${homeGap(usual)}'}\`,progress:Math.min(1.25,ratio)/1.25,dial:ratio>1?\`+${'${Math.round((ratio-1)*100)}'}%\`:\`${'${Math.round(Math.min(1,ratio)*100)}'}%\`,aLabel:'上次',a:\`${'${mins(last)}'} 分钟\`,bLabel:'本周',b:\`${'${weekSessions}'} 次\`}}
function renderHomeState(t=Date.now()){const x=deriveHomeState(t),h=$('#axisNowHero');if(!h)return;h.dataset.mode=x.mode;setText('#axisNowClock',tlabel(t));setText('#axisNowTitle',x.title);setText('#axisNowValue',x.value);setText('#axisNowMeta',x.meta);setText('#axisNowDialText',x.dial);setText('#axisNowFactALabel',x.aLabel);setText('#axisNowFactA',x.a);setText('#axisNowFactBLabel',x.bLabel);setText('#axisNowFactB',x.b);h.style.setProperty('--axis-now-p',String(Math.max(0,Math.min(1,x.progress||0))*360)+'deg');const r=$('#axisNowRailFill');if(r)r.style.width=Math.max(0,Math.min(1,x.progress||0))*100+'%';window.__AXIS_HOME_STATE__=x}
`;
  src=once(src,'function render(){',homeModel+'function render(){','home state model insertion');
  src=regexOnce(src,/function render\(\)\{[\s\S]*?\}\nfunction renderLive\(\)\{/,
`function render(){setText('#todayDate',new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',weekday:'short'}).format(new Date()));const r7=recent(7);setText('#weekMins',r7.reduce((a,s)=>a+mins(s),0));setText('#weekSessions',r7.length);setText('#helloTitle',state.profile.name?\`${'${state.profile.name}'}，今天练吗\`:'尚未开始');setText('#lastSession',state.sessions[0]?\`${'${dlabel(state.sessions[0].start)}'} · ${'${mins(state.sessions[0])}'}分钟\`:'—');$('#idleHome').classList.toggle('hidden',!!state.active);$('#activeHome').classList.toggle('hidden',!state.active);$('#dock').classList.toggle('show',!!state.active);if(state.active)renderLive();renderHomeState();startTimer();renderHistory();renderInsights();renderSettings();bindDynamic();hydrateThumbs()}
function renderLive(){`,'canonical home render');
  src=regexOnce(src,/function renderLive\(\)\{[\s\S]*?\}\nfunction startTimer\(\)\{/,
`function renderLive(){const a=ev(state.active);setText('#liveItems',a.length);setText('#liveSets',a.reduce((n,e)=>n+(e.kind==='strength'?Number(e.sets)||0:1),0));setText('#eventCount',a.length);$('#eventList').innerHTML=a.length?a.slice().reverse().map(eventHtml).join(''):'<div class="empty">暂无记录</div>'}
function startTimer(){`,'retire old home signal writer');
  src=regexOnce(src,/function startTimer\(\)\{[\s\S]*?\}\nfunction stopTimer\(\)\{/,
`function startTimer(){stopTimer();const tick=()=>{const t=Date.now();if(state.active){const sec=Math.floor((t-state.active.start)/1000);setText('#liveTimer',\`${'${pad(Math.floor(sec/60))}'}:${'${pad(sec%60)}'}\`)}renderHomeState(t)};tick();timer=setInterval(tick,1000)}
function stopTimer(){`,'single home timer');

  const visualSig=`
function visualSigFromCanvas(cv){const hash=(sx,sy,sw,sh)=>{const s=D.createElement('canvas');s.width=9;s.height=8;const c=s.getContext('2d',{willReadFrequently:true});c.drawImage(cv,sx,sy,sw,sh,0,0,9,8);const d=c.getImageData(0,0,9,8).data;let bits='';for(let y=0;y<8;y++)for(let x=0;x<8;x++){const i=(y*9+x)*4,j=i+4,a=d[i]*.299+d[i+1]*.587+d[i+2]*.114,b=d[j]*.299+d[j+1]*.587+d[j+2]*.114;bits+=a>b?'1':'0'}let out='';for(let i=0;i<64;i+=4)out+=parseInt(bits.slice(i,i+4),2).toString(16);return out};const cx=Math.round(cv.width*.18),cy=Math.round(cv.height*.16),cw=Math.max(1,Math.round(cv.width*.64)),ch=Math.max(1,Math.round(cv.height*.68)),z=D.createElement('canvas');z.width=4;z.height=4;const c=z.getContext('2d',{willReadFrequently:true});c.drawImage(cv,0,0,4,4);const d=c.getImageData(0,0,4,4).data;let zones='';for(let i=0;i<16;i++){const q=i*4,l=d[q]*.299+d[q+1]*.587+d[q+2]*.114;zones+=Math.max(0,Math.min(15,Math.round(l/17))).toString(16)}return{full:hash(0,0,cv.width,cv.height),center:hash(cx,cy,cw,ch),zones}}
function zoneDistance(a,b){if(!a||!b)return 16;let n=0,k=0;for(let i=0;i<Math.min(a.length,b.length);i++){const x=parseInt(a[i],16),y=parseInt(b[i],16);if(Number.isFinite(x)&&Number.isFinite(y)){n+=Math.abs(x-y);k++}}return k?n/k:16}
function localVisualDistance(mem,frame){const mf=mem.sig?.full||mem.fp,ff=frame.sig?.full||frame.fp,full=hamming(mf,ff),center=mem.sig?.center&&frame.sig?.center?hamming(mem.sig.center,frame.sig.center):full,z=mem.sig?.zones&&frame.sig?.zones?zoneDistance(mem.sig.zones,frame.sig.zones):8;return full*.56+center*.32+z*.75}
`;
  src=once(src,'function hamming(a,b){',visualSig+'function hamming(a,b){','local visual signature helpers');
  src=once(src,"const fp=fpFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp}","const fp=fpFromCanvas(cv),sig=visualSigFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp,sig}",'camera local signature');
  src=once(src,"const fp=fpFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp}","const fp=fpFromCanvas(cv),sig=visualSigFromCanvas(cv),ts=captureSeal(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.8));return{blob,url:URL.createObjectURL(blob),ts,fp,sig}",'file local signature');
  src=regexOnce(src,/function memoryGuess\(\)\{[\s\S]*?\}\nfunction learnMemory\(id\)\{[\s\S]*?\}\nfunction reviewFrames\(\)\{/,
`function memoryGuess(){const mem=state.profile.memories||[];if(!mem.length||!state.frames.length)return null;const by=new Map();for(const m of mem){if(!m.equipmentId)continue;let best=Infinity;for(const f of state.frames)best=Math.min(best,localVisualDistance(m,f));if(!Number.isFinite(best))continue;const a=by.get(m.equipmentId)||[];a.push(best);by.set(m.equipmentId,a)}const ranked=[...by].map(([id,a])=>{a.sort((x,y)=>x-y);const score=a.length>1?a[0]*.72+a[1]*.28:a[0];return{id,score}}).sort((a,b)=>a.score-b.score);if(!ranked.length)return null;const best=ranked[0],second=ranked[1]?.score??99,margin=second-best.score,strong=best.score<=6.6&&margin>=1.6,usable=best.score<=10.2&&margin>=.8;if(!usable)return null;return{id:best.id,score:best.score,margin,confidence:strong?Math.min(.98,.86+(6.6-best.score)*.018):Math.max(.60,Math.min(.81,.78-best.score*.012+margin*.025)),strong}}
function learnMemory(id){if(!id)return;const arr=state.profile.memories||(state.profile.memories=[]);state.frames.slice(0,4).forEach(f=>(f.fp||f.sig)&&arr.push({equipmentId:id,fp:f.fp,sig:f.sig||null,t:Date.now()}));const by={};for(let i=arr.length-1;i>=0;i--){const m=arr[i];by[m.equipmentId]=by[m.equipmentId]||[];if(by[m.equipmentId].length<16)by[m.equipmentId].push(m)}state.profile.memories=Object.values(by).flat();save()}
function reviewFrames(){`,'personal visual memory scoring');
  src=regexOnce(src,/function reviewFrames\(\)\{[\s\S]*?\}\nasync function blobDataUrl/,
`function reviewFrames(){stopCamera();$('#captureStage').classList.add('hidden');$('#reviewStage').classList.remove('hidden');$('#film').innerHTML=state.frames.map(f=>\`<img src="${'${f.url}'}" alt="扫描画面">\`).join('');if($('#scanSheet')?.classList.contains('v882-quick-media')){const e=eqById(state.selectedEq);if(e){setText('#equipmentName',e.name);renderMuscles(e);setText('#aiStatus',state.clip?'已附加视频':'已附加照片');const last=lastEvent(e.id);$('#lastValue').classList.toggle('hidden',!last);if(last)setText('#lastValue','上次 '+eventMeta(last))}return}state.selectedEq=null;state.localGuess=null;renderMuscles(null);setText('#equipmentName','待确认');setText('#aiStatus','本地匹配');$('#lastValue').classList.add('hidden');const g=memoryGuess();if(g){const e=eqById(g.id);if(e){state.localGuess=g;selectEq(e.id,false);setText('#aiStatus',g.strong?'本地认出':'本地候选 · 请确认');if(g.strong)return}}analyzeFrames()}
async function blobDataUrl`,'local-first review flow');
  src=regexOnce(src,/async function analyzeFrames\(\)\{[\s\S]*?\}\nfunction resetScan\(\)\{/,
`async function analyzeFrames(){try{const picks=state.frames.length<=3?state.frames:[state.frames[0],state.frames[Math.floor(state.frames.length/2)],state.frames[state.frames.length-1]],frames=await Promise.all(picks.map(f=>blobDataUrl(f.blob))),recentEquipment=allEvents().slice(0,10).map(e=>e.equipmentId);const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({frames,recentEquipment})}),j=await r.json();if(!r.ok||!j.result){setText('#aiStatus',state.localGuess?'本地候选 · 请确认':'手动确认');return}state.ai=j.result;if(j.result.equipmentId&&j.result.confidence>=.58){selectEq(j.result.equipmentId,false);setText('#aiStatus',j.result.confidence>=.82?'已识别':'请确认');if(Number.isFinite(Number(j.result.weightKg)))setVal('weight',Number(j.result.weightKg));if(j.result.cardio){if(Number.isFinite(Number(j.result.cardio.durationMin)))setVal('duration',Math.round(Number(j.result.cardio.durationMin)));if(Number.isFinite(Number(j.result.cardio.resistance)))setChoice('intensity',Math.max(1,Math.min(10,Math.round(Number(j.result.cardio.resistance)))))} }else setText('#aiStatus',state.localGuess?'本地候选 · 请确认':'请确认')}catch(e){console.warn(e);setText('#aiStatus',state.localGuess?'本地候选 · 请确认':'手动确认')}}
function resetScan(preserveSelection=false){`,'AI fallback preserves local candidate');
  src=regexOnce(src,/function resetScan\(preserveSelection=false\)\{[\s\S]*?\}\nfunction setVal/,
`function resetScan(preserveSelection=false){state.frames.forEach(f=>{try{URL.revokeObjectURL(f.url)}catch{}});if(state.clip?.url)try{URL.revokeObjectURL(state.clip.url)}catch{};state.frames=[];state.clip=null;state.ai=null;state.localGuess=null;if(!preserveSelection){state.selectedEq=null;setText('#equipmentName','待确认');renderMuscles(null);$('#strengthFields').classList.add('hidden');$('#cardioFields').classList.add('hidden');$('#lastValue').classList.add('hidden')}$('#captureStage').classList.remove('hidden');$('#reviewStage').classList.add('hidden');$('#film').innerHTML='';$('#captureNow').disabled=false;setText('#scanState','就绪');setText('#aiStatus','本地匹配');if(!preserveSelection){state.forceClip=false;$('#scanSheet')?.classList.remove('v882-quick-media')}}
function beginQuickMedia(mode,id){const e=eqById(id);if(!e)return;resetScan(true);state.selectedEq=id;state.forceClip=mode!=='photo';captureMode=String(mode);selectEq(id,false);const s=$('#scanSheet');s?.classList.add('show','v8-quick','v882-quick-media');$('#captureStage')?.classList.remove('hidden');$('#reviewStage')?.classList.add('hidden');setText('#captureNow',mode==='photo'?'拍照':\`开始扫描 ${'${mode}'} 秒\`);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===String(mode)));startCamera()}
function setVal`,'quick media capture bridge');
  src=once(src,'if(state.prefs.keepClip&&window.MediaRecorder){','if((state.prefs.keepClip||state.forceClip)&&window.MediaRecorder){','explicit quick video recorder');
  src=once(src,'if(state.prefs.keepClip&&state.clip?.blob){','if((state.prefs.keepClip||state.forceClip)&&state.clip?.blob){','explicit quick video persistence');
  src=once(src,'window.addEventListener(\'pageshow\',render);D.addEventListener(\'visibilitychange\',()=>{if(!D.hidden)render()})','window.addEventListener(\'pageshow\',render);D.addEventListener(\'visibilitychange\',()=>{if(!D.hidden)render()})','pageshow contract');
  src=once(src,'load();buildChoices();bind();render();aiHealth();',"window.__AXIS_CAPTURE__={beginQuickMedia,prepareQuick:id=>{const e=eqById(id);if(!e)return false;state.selectedEq=id;selectEq(id,false);return true}};load();buildChoices();bind();render();aiHealth();",'capture bridge export');
  syntax(src,FILE);write(FILE,src);
}

/* Quick Record exposes saved custom items and attaches media through app.js's existing capture transaction. */
{
  const FILE='v61.js';let src=read(FILE);
  src=regexOnce(src,/function injectQuick\(\)\{[\s\S]*?\}\nfunction recentDistinct/,
`function injectQuick(){if($('#quickRecordBtn'))return;const d=$('#dock');if(!d)return;d.classList.add('v8-dual');d.insertAdjacentHTML('beforeend','<button id="quickRecordBtn" class="v8QuickBtn"><span>＋</span><b>快速记录</b></button>');D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="quickRecordSheet"><div class="sheet v8QuickSheet"><div class="grabber"></div><div class="sheetHead"><b>快速记录</b><button class="closeBtn" id="quickClose">×</button></div><div class="v8Block"><span>最近</span><div id="v8Recent"></div></div><div class="v8Block v882QuickMine hidden" id="v882QuickMine"><span>我的</span><div id="v882QuickCustom"></div></div><button class="v8Other" id="v8Other">其他器械 / 运动 <i>›</i></button><button class="v8New" id="v8New">＋ 新建自定义</button></div></div>');$('#quickRecordBtn').onclick=openQuick;$('#quickClose').onclick=()=>{$('#quickRecordSheet').classList.remove('show');syncDock()};$('#v8Recent').onclick=e=>{const b=e.target.closest('[data-qid]');if(b)chooseQuick(b.dataset.qid)};$('#v882QuickCustom').onclick=e=>{const b=e.target.closest('[data-qid]');if(b)chooseQuick(b.dataset.qid)};$('#v8Other').onclick=()=>{quickOther=true;$('#quickRecordSheet').classList.remove('show');$('#equipmentRow')?.click()};$('#v8New').onclick=()=>{$('#quickRecordSheet').classList.remove('show');$('#addCustomEq')?.click()}}
function recentDistinct`,'quick custom section');
  src=regexOnce(src,/function openQuick\(\)\{[\s\S]*?\}\nfunction chooseQuick/,
`function openQuick(){const c=core();let items=recentDistinct(5).map(e=>({id:e.equipmentId,name:e.name,meta:summary(e),today:!!c.active?.events?.some(x=>x.equipmentId===e.equipmentId)}));if(!items.length)items=CAT.slice(0,6).map(x=>({id:x[0],name:x[1],meta:x[2]==='cardio'?'有氧':'力量'}));$('#v8Recent').innerHTML=items.map(x=>\`<button class="v8QuickItem" data-qid="${'${x.id}'}"><span><b>${'${esc(x.name)}'}</b><small>${'${x.today?\'继续 · \':\'\'}'}${'${esc(x.meta)}'}</small></span><i>›</i></button>\`).join('');const custom=[...(c.profile?.customEq||[])],lastUse=new Map();for(const e of allEvents().sort((a,b)=>(b.time||0)-(a.time||0)))if(e.equipmentId&&!lastUse.has(e.equipmentId))lastUse.set(e.equipmentId,e.time||0);custom.sort((a,b)=>(lastUse.get(b.id)||0)-(lastUse.get(a.id)||0)||String(a.name).localeCompare(String(b.name),'zh-CN'));const mine=$('#v882QuickMine');mine?.classList.toggle('hidden',!custom.length);if($('#v882QuickCustom'))$('#v882QuickCustom').innerHTML=custom.map(x=>\`<button class="v8QuickItem" data-qid="${'${x.id}'}"><span><b>${'${esc(x.name)}'}</b><small>${'${esc((x.muscles||[]).slice(0,3).join(\' · \')||x.type||\'自定义\')}'}</small></span><i>›</i></button>\`).join('');$('#quickRecordSheet').classList.add('show');syncDock()}
function chooseQuick`,'quick custom population');
  const quickMedia=`
function ensureQuickMedia(id){let box=$('#v882QuickMedia');if(!box){box=D.createElement('div');box.id='v882QuickMedia';box.className='v882QuickMedia';box.innerHTML='<span>现场</span><div><button data-v882-media="photo">补拍照片</button><button data-v882-media="3">3秒视频</button><button data-v882-media="5">5秒视频</button></div>';$('#saveScan')?.insertAdjacentElement('beforebegin',box);box.onclick=e=>{const b=e.target.closest('[data-v882-media]');if(!b)return;const eq=selected();if(!eq?.id)return toast('请先确认器械');window.__AXIS_CAPTURE__?.beginQuickMedia?.(b.dataset.v882Media,eq.id)}}box.classList.remove('hidden');box.dataset.eq=id||''}
`;
  src=once(src,'function showQuickEditor(id){',quickMedia+'function showQuickEditor(id){','quick media controls');
  src=regexOnce(src,/function showQuickEditor\(id\)\{[\s\S]*?\}\nfunction prepare\(id\)\{/,
`function showQuickEditor(id){const s=$('#scanSheet');if(!s)return;s.classList.add('show','v8-quick');s.classList.remove('v882-quick-media');$('#captureStage')?.classList.add('hidden');$('#reviewStage')?.classList.remove('hidden');if($('#film'))$('#film').innerHTML='';const h=$('#scanSheet .sheetHead>b');if(h)h.textContent=editingId?'补一下':'快速记录';const e=selected();if(e?.id)window.__AXIS_CAPTURE__?.prepareQuick?.(e.id);ensureQuickMedia(id||e?.id);if(e?.type==='strength')prepare(id||e.id);syncDock()}
function prepare(id){`,'quick editor media preservation');
  src=once(src,"if(b.id==='scanBtn')setTimeout(()=>{$('#scanSheet')?.classList.remove('v8-quick');$('#captureStage')?.classList.remove('hidden');editingId=null;basic()},0);","if(b.id==='scanBtn')setTimeout(()=>{$('#scanSheet')?.classList.remove('v8-quick','v882-quick-media');$('#v882QuickMedia')?.classList.add('hidden');$('#captureStage')?.classList.remove('hidden');editingId=null;basic()},0);",'normal capture retires quick media affordance');
  syntax(src,FILE);write(FILE,src);
}

/* Richer non-duplicate movement library plus explicit waist / secondary muscle cores. */
{
  const FILE='v873-exercise-library.js';let src=read(FILE);
  src=once(src,
    "  chest:'胸肌',back:'背部',shoulder:'肩部',biceps:'肱二头肌',triceps:'肱三头肌',core:'核心',glutes:'臀部',quads:'股四头肌',hamstrings:'腘绳肌',calves:'小腿',cardio:'心肺'",
    "  chest:'胸肌',back:'背部',shoulder:'肩部',biceps:'肱二头肌',triceps:'肱三头肌',forearms:'前臂',core:'核心',lowerback:'腰部',glutes:'臀部',quads:'股四头肌',hamstrings:'腘绳肌',adductors:'内收肌',hipflexors:'髋屈肌',calves:'小腿',tibialis:'胫骨前肌',serratus:'前锯肌',cardio:'心肺'",
    'library muscle cores');
  src=once(src,
    "  '小腿':['小腿','腓肠','腓腸','calf','calves'],\n  '心肺':['心肺','有氧','耐力','cardio','aerobic','endurance']",
    "  '小腿':['小腿','腓肠','腓腸','calf','calves'],\n  '腰部':['腰','腰部','下背','下背部','lower back','lumbar','erector'],\n  '前臂':['前臂','握力','forearm','forearms','grip'],\n  '内收肌':['内收','內收','大腿内侧','大腿內側','adductor','adductors'],\n  '髋屈肌':['髋屈','髖屈','髂腰','hip flexor','hip flexors','iliopsoas'],\n  '胫骨前肌':['胫骨前','脛骨前','tibialis','tibialis anterior'],\n  '前锯肌':['前锯','前鋸','serratus','serratus anterior'],\n  '心肺':['心肺','有氧','耐力','cardio','aerobic','endurance']",
    'library muscle aliases');
  const additions=`  ['back-extension','45°罗马椅背伸',['45°羅馬椅背伸','罗马椅背伸','羅馬椅背伸','背伸','back extension','hyperextension'], 'strength',[M.lowerback,M.glutes,M.hamstrings]],
  ['reverse-hyper','反向挺身',['反向挺身','reverse hyper','reverse hyperextension'], 'strength',[M.glutes,M.hamstrings,M.lowerback]],
  ['cable-side-bend','绳索侧屈',['繩索側屈','绳索侧屈','cable side bend'], 'strength',[M.lowerback,M.core]],
  ['db-side-bend','哑铃侧屈',['啞鈴側屈','哑铃侧屈','dumbbell side bend'], 'strength',[M.lowerback,M.core]],
  ['bird-dog','鸟狗式',['鳥狗式','鸟狗式','bird dog','bird-dog'], 'strength',[M.lowerback,M.core,M.glutes]],
  ['dead-bug','死虫式',['死蟲式','死虫式','dead bug','dead-bug'], 'strength',[M.core,M.hipflexors]],
  ['woodchop','绳索伐木',['繩索伐木','绳索伐木','cable woodchop','wood chop','woodchopper'], 'strength',[M.core]],
  ['pendulum-squat','钟摆深蹲',['鐘擺深蹲','钟摆深蹲','pendulum squat'], 'strength',[M.quads,M.glutes]],
  ['belt-squat','腰带深蹲',['腰帶深蹲','腰带深蹲','belt squat'], 'strength',[M.quads,M.glutes]],
  ['nordic-curl','北欧腿弯举',['北歐腿彎舉','北欧腿弯举','nordic curl','nordic hamstring curl'], 'strength',[M.hamstrings]],
  ['ghr','臀腿挺身',['臀腿挺身','glute ham raise','glute-ham raise','ghr'], 'strength',[M.hamstrings,M.glutes,M.lowerback]],
  ['sissy-squat','西西深蹲',['西西深蹲','sissy squat'], 'strength',[M.quads]],
  ['tibialis-raise','胫骨前肌提拉',['脛骨前肌提拉','胫骨前肌提拉','tibialis raise'], 'strength',[M.tibialis]],
  ['wrist-curl','腕弯举',['腕彎舉','腕弯举','wrist curl'], 'strength',[M.forearms]],
  ['reverse-wrist-curl','反向腕弯举',['反向腕彎舉','反向腕弯举','reverse wrist curl'], 'strength',[M.forearms]],
  ['farmer-carry','农夫行走',['農夫行走','农夫行走','farmer carry','farmers walk','farmer walk'], 'strength',[M.forearms,M.core,M.glutes]],
  ['sled-push','雪橇推',['雪橇推','sled push','prowler push'], 'cardio',[M.cardio,M.quads,M.glutes]],
  ['sled-pull','雪橇拉',['雪橇拉','sled pull','sled drag'], 'cardio',[M.cardio,M.back,M.quads,M.glutes]],
  ['battle-rope','战绳',['戰繩','战绳','battle rope','battle ropes'], 'cardio',[M.cardio,M.shoulder,M.core,M.forearms]],
  ['medball-slam','药球砸地',['藥球砸地','药球砸地','medicine ball slam','med ball slam'], 'cardio',[M.cardio,M.core,M.shoulder]],
  ['box-jump','跳箱',['跳箱','box jump','box jumps'], 'cardio',[M.cardio,M.quads,M.glutes,M.calves]],
  ['cable-external-rotation','绳索外旋',['繩索外旋','绳索外旋','cable external rotation','shoulder external rotation'], 'strength',[M.shoulder]],
  ['pushup-plus','俯卧撑加',['俯臥撐加','俯卧撑加','push up plus','push-up plus'], 'strength',[M.chest,M.triceps,M.serratus]],
  ['copenhagen','哥本哈根侧桥',['哥本哈根側橋','哥本哈根侧桥','copenhagen plank'], 'strength',[M.adductors,M.core]],
  ['cable-hip-flexion','绳索屈髋',['繩索屈髖','绳索屈髋','cable hip flexion'], 'strength',[M.hipflexors,M.core]],
  ['landmine-row','地雷杆划船',['地雷桿划船','地雷杆划船','landmine row'], 'strength',[M.back,M.biceps]],
  ['machine-pullover','器械直臂下拉',['器械直臂下拉','machine pullover','pullover machine'], 'strength',[M.back,M.chest]],
`;
  src=once(src,"  ['treadmill','跑步机'",additions+"  ['treadmill','跑步机'",'expanded non-duplicate movement library');
  syntax(src,FILE);write(FILE,src);
}

/* Professional anatomy gets an explicit waist region and mappings for new secondary muscle cores. */
{
  const FILE='v874-professional.js';let src=read(FILE);
  src=once(src,
    " {id:'chest',label:'胸',core:'胸肌',items:['胸部整体','胸大肌上部','胸大肌中部','胸大肌下部','胸小肌']},",
    " {id:'chest',label:'胸',core:'胸肌',items:['胸部整体','胸大肌上部','胸大肌中部','胸大肌下部','胸小肌','前锯肌']},",
    'serratus detail');
  src=once(src,
    " {id:'core',label:'核心',core:'核心',items:['核心整体','腹直肌','腹外斜肌','腹内斜肌','腹横肌','多裂肌']},\n {id:'legs',label:'臀腿'",
    " {id:'core',label:'核心',core:'核心',items:['核心整体','腹直肌','腹外斜肌','腹内斜肌','腹横肌','多裂肌']},\n {id:'waist',label:'腰',core:'腰部',items:['腰部整体','腰方肌','竖脊肌腰段','腰多裂肌','髂腰肌']},\n {id:'legs',label:'臀腿'",
    'waist professional region');
  src=once(src,
    " '胸部整体':'胸肌','胸大肌上部':'胸肌','胸大肌中部':'胸肌','胸大肌下部':'胸肌','胸小肌':'胸肌',",
    " '胸部整体':'胸肌','胸大肌上部':'胸肌','胸大肌中部':'胸肌','胸大肌下部':'胸肌','胸小肌':'胸肌','前锯肌':'前锯肌',",
    'serratus core mapping');
  src=once(src,
    " '核心整体':'核心','腹直肌':'核心','腹外斜肌':'核心','腹内斜肌':'核心','腹横肌':'核心','多裂肌':'核心',",
    " '核心整体':'核心','腹直肌':'核心','腹外斜肌':'核心','腹内斜肌':'核心','腹横肌':'核心','多裂肌':'核心',\n '腰部整体':'腰部','腰方肌':'腰部','竖脊肌腰段':'腰部','腰多裂肌':'腰部','髂腰肌':'髋屈肌',",
    'waist detail mappings');
  src=once(src,
    " '胸肌':['胸部整体'],'背部':['背部整体'],'肩部':['肩部整体'],'肱二头肌':['肱二头肌'],'肱三头肌':['肱三头肌'],'核心':['核心整体'],'臀部':['臀腿整体'],'股四头肌':['股四头肌'],'腘绳肌':['腘绳肌'],'小腿':['腓肠肌','比目鱼肌'],'心肺':['心肺']",
    " '胸肌':['胸部整体'],'背部':['背部整体'],'肩部':['肩部整体'],'肱二头肌':['肱二头肌'],'肱三头肌':['肱三头肌'],'前臂':['前臂屈肌群','前臂伸肌群'],'核心':['核心整体'],'腰部':['腰部整体'],'臀部':['臀腿整体'],'股四头肌':['股四头肌'],'腘绳肌':['腘绳肌'],'内收肌':['内收肌群'],'髋屈肌':['髋屈肌群'],'小腿':['腓肠肌','比目鱼肌'],'胫骨前肌':['胫骨前肌'],'前锯肌':['前锯肌'],'心肺':['心肺']",
    'secondary core defaults');
  src=once(src,
    " if(/平板|plank/.test(n))add('腹横肌','腹直肌','多裂肌');",
    " if(/平板|plank/.test(n))add('腹横肌','腹直肌','多裂肌');\n if(/罗马椅|背伸|backextension|hyperextension|reversehyper|反向挺身|早安式|goodmorning/.test(n))add('竖脊肌腰段','腰多裂肌','臀大肌','腘绳肌');\n if(/侧屈|sidebend/.test(n))add('腰方肌','腹外斜肌','腹内斜肌');\n if(/鸟狗|birddog/.test(n))add('腰多裂肌','腹横肌','臀中肌 / 臀小肌');\n if(/死虫|deadbug/.test(n))add('腹横肌','髂腰肌');\n if(/伐木|woodchop/.test(n))add('腹外斜肌','腹内斜肌','腹横肌');\n if(/北欧|nordic|臀腿挺身|glutehamraise/.test(n))add('腘绳肌','臀大肌');\n if(/胫骨前|tibialis/.test(n))add('胫骨前肌');\n if(/腕弯举|wristcurl|农夫|farmercarry|farmerwalk/.test(n))add('前臂屈肌群','前臂伸肌群');\n if(/哥本哈根|copenhagen/.test(n))add('内收肌群','腹横肌');\n if(/屈髋|hipflexion/.test(n))add('髋屈肌群');\n if(/外旋|externalrotation/.test(n))add('肩袖');\n if(/俯卧撑加|pushupplus/.test(n))add('前锯肌','胸大肌中部','肱三头肌');\n if(/雪橇推|sledpush|钟摆深蹲|pendulumsquat|腰带深蹲|beltsquat|西西深蹲|sissysquat/.test(n))add('股四头肌','臀大肌');\n if(/战绳|battlerope|药球砸地|medballslam|跳箱|boxjump/.test(n))add('心肺');",
    'new movement professional inference');
  syntax(src,FILE);write(FILE,src);
}

/* Only natural countdown completion may emit an automatic training cue. */
{
  const FILE='v8710-sound-ui.js';let src=read(FILE);
  src=regexOnce(src,/function ensure\(\)\{[\s\S]*?\}\nfunction sync\(/,
`function ensure(){const host=$('#settingsSheet .settingsList.second');if(!host)return;if(!$('#v8710Audio')){const h=D.createElement('div');h.id='v8710Audio';h.className='v8710Audio';h.innerHTML='<div class="v8710Block"><div class="v8710Top"><span>声音提醒</span><b>倒计时到点</b></div><div class="v8710Seg two" id="v8710On"><button data-v="off">关闭</button><button data-v="on">开启</button></div></div><div class="v8710Block"><div class="v8710Top"><span>AXIS 声音</span><b>四种声纹</b></div><div class="v8710Tone" id="v8710Tone"><button data-v="kinetic"><b>KINETIC</b><small>推进 · 颗粒</small></button><button data-v="vector"><b>VECTOR</b><small>锋利 · 穿透</small></button><button data-v="drift"><b>DRIFT</b><small>低调 · 延展</small></button><button data-v="apex"><b>APEX</b><small>上扬 · 完成</small></button></div></div><div class="v8710Block"><div class="v8710Top"><span>播放方式</span><b></b></div><div class="v8710Seg three" id="v8710Repeat"><button data-v="once">一次</button><button data-v="double">双响</button><button data-v="loop">持续</button></div></div><div class="v8710Block"><button class="v8710AudioRow" id="v8710Item"><span>项目倒计时提醒</span><b></b></button><button class="v8710Test" id="v8710Test">试听 AXIS 声音</button></div>';host.appendChild(h)}if(!$('#v8710Stop'))D.body.insertAdjacentHTML('beforeend','<div class="v8710Stop" id="v8710Stop"><span>AXIS 持续提示</span><button id="v8710StopBtn">停止</button></div>');render()}
function sync(`,'countdown-only sound settings');
  src=regexOnce(src,/function render\(\)\{[\s\S]*?\}\nfunction elapsed/,
`function render(){const p=pref();sync('v8710On',p.on?'on':'off');sync('v8710Tone',p.set);sync('v8710Repeat',p.repeat);const a=$('#v8710Item b');if(a)a.textContent=p.item?'开启':'关闭'}
function elapsed`,'countdown-only sound render');
  src=regexOnce(src,/function check\(\)\{[\s\S]*?\}\nfunction bind\(\)\{/,
`function check(){if(D.visibilityState!=='visible'||!pref().on)return;const c=core(),m=meta(),p=pref();if(!c.active)return;for(const e of c.active.events||[]){const a=m.events[e.id]?.activity;if(!a||a.status!=='active')continue;const due=Math.max(60000,Number(a.estimateMs)||0);if(p.item&&due&&elapsed(a)>=due){const k=e.id+':'+a.startedAt;if(!itemSeen.has(k)){itemSeen.add(k);cue('item')}}}}
function bind(){`,'automatic sound single trigger');
  src=regexOnce(src,/function bind\(\)\{style\(\);migrate\(\);ensure\(\);seed\(\);clearInterval\(tick\);tick=setInterval\(check,650\);D\.addEventListener\('click',[\s\S]*?\}\nif\(D\.readyState/,
`function bind(){style();migrate();ensure();seed();clearInterval(tick);tick=setInterval(check,650);D.addEventListener('click',e=>{if(e.target.closest('#settingsBtn'))setTimeout(ensure,100);const b=e.target.closest('#v8710Audio [data-v]');if(b){const v=b.dataset.v;if(b.closest('#v8710On'))setPref('v8710SoundEnabled',v==='on');else if(b.closest('#v8710Tone')){setPref('v8710SoundSet',v);cue('test')}else if(b.closest('#v8710Repeat'))setPref('v8710Repeat',v);return}if(e.target.closest('#v8710Item')){setPref('v876ItemReminder',!pref().item);return}if(e.target.closest('#v8710Test')){cue('test');return}if(e.target.closest('#v8710StopBtn,#v87Primary,#v87Toggle,#v87Finish,#captureNow'))window.__AXIS_SONIC__?.stop()},true);D.addEventListener('visibilitychange',()=>{if(D.hidden)window.__AXIS_SONIC__?.stop()});window.addEventListener('pagehide',()=>{clearInterval(tick);window.__AXIS_SONIC__?.stop()},{once:true});window.addEventListener('pageshow',()=>{migrate();ensure();seed()})}
if(D.readyState`,'countdown-only sound events');
  if(/sets>old\.sets\)cue\('set'\)|status==='finished'.*cue\('item'\)|cue\('rest'\)|cue\('session'\)/.test(src))fail('manual/rest/session automatic sound cue survived');
  syntax(src,FILE);write(FILE,src);
}

/* Active-item frame has immutable outer geometry and stable action columns across set completion. */
{
  const FILE='v87-runtime.js';let src=read(FILE);
  src=once(src,
    "if(e.kind==='strength'&&a.status==='active'){pri.style.display='block';if(planDone){pri.textContent='计划完成';pri.classList.add('plan');pri.disabled=true;add.style.display='block';add.dataset.id=e.id}else{pri.textContent='完成一组';pri.classList.remove('plan');pri.disabled=false;pri.dataset.id=e.id;add.style.display='none'}}else{pri.style.display='none';add.style.display='none'}",
    "if(e.kind==='strength'&&a.status==='active'){pri.style.display='block';add.style.display='block';add.style.visibility=planDone?'visible':'hidden';add.style.pointerEvents=planDone?'auto':'none';if(planDone){pri.textContent='计划完成';pri.classList.add('plan');pri.disabled=true;add.dataset.id=e.id}else{pri.textContent='完成一组';pri.classList.remove('plan');pri.disabled=false;pri.dataset.id=e.id}}else{pri.style.display='none';add.style.display='none';add.style.visibility='hidden'}",
    'stable active action occupancy');
  syntax(src,FILE);write(FILE,src);
}

/* First-layer visual system and active-card geometry live in static CSS. */
{
  const FILE='product-convergence.css';let css=read(FILE);
  if(css.includes('AXIS 8.8.2 home intelligence'))fail('8.8.2 CSS duplicated');
  css+=`\n\n/* AXIS 8.8.2 home intelligence */\n#todayView>.pageHead{margin-bottom:2px!important}\n#axisNowHero{--axis-now-accent:#737cff;position:relative;width:100%;min-height:202px;margin:0 0 18px;padding:18px 0 16px;overflow:hidden;isolation:isolate;box-sizing:border-box}\n#axisNowHero:before{content:'';position:absolute;z-index:-1;right:-74px;top:4px;width:210px;height:210px;border-radius:50%;background:radial-gradient(circle, color-mix(in srgb,var(--axis-now-accent) 15%,transparent) 0,transparent 68%);opacity:.78;pointer-events:none}\n#axisNowHero[data-mode='rest']{--axis-now-accent:#8ba6ff}#axisNowHero[data-mode='active']{--axis-now-accent:#7d87ff}#axisNowHero[data-mode='paused']{--axis-now-accent:#a2a7b3}#axisNowHero[data-mode='warn']{--axis-now-accent:#d6a968}#axisNowHero[data-mode='danger']{--axis-now-accent:#df806f}#axisNowHero[data-mode='recovery']{--axis-now-accent:#8d99ae}#axisNowHero[data-mode='between']{--axis-now-accent:#91a0ff}\n.axisNowTop{height:22px;display:flex;align-items:center;justify-content:space-between}.axisNowTop>span{font-size:11px;font-weight:720;letter-spacing:.12em;color:var(--axis-now-accent)}.axisNowTop>time{font-size:11px;color:var(--dim);font-variant-numeric:tabular-nums}\n.axisNowStage{min-height:103px;display:grid;grid-template-columns:minmax(0,1fr) 76px;gap:16px;align-items:center}.axisNowCopy{min-width:0}.axisNowCopy>span{display:block;margin-bottom:4px;color:var(--muted);font-size:12px;font-weight:620}.axisNowCopy>b{display:block;min-height:42px;color:var(--text);font-size:clamp(35px,9.6vw,48px);line-height:.98;font-weight:690;letter-spacing:-.055em;font-variant-numeric:tabular-nums;white-space:nowrap}.axisNowCopy>small{display:block;max-width:100%;margin-top:8px;color:var(--muted);font-size:11px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.axisNowDial{--p:var(--axis-now-p,0deg);width:70px;height:70px;border-radius:50%;justify-self:end;display:grid;place-items:center;position:relative;background:conic-gradient(var(--axis-now-accent) var(--p),rgba(255,255,255,.055) 0);box-shadow:0 0 42px color-mix(in srgb,var(--axis-now-accent) 10%,transparent)}.axisNowDial:after{content:'';position:absolute;inset:3px;border-radius:50%;background:#0b0d11}.axisNowDial>i{position:absolute;z-index:1;width:5px;height:5px;border-radius:50%;background:var(--axis-now-accent);box-shadow:0 0 12px var(--axis-now-accent)}.axisNowDial>span{z-index:2;max-width:52px;color:var(--muted);font-size:10px;font-weight:650;font-variant-numeric:tabular-nums;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.axisNowRail{height:2px;background:rgba(255,255,255,.055);overflow:hidden}.axisNowRail>i{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--axis-now-accent),color-mix(in srgb,var(--axis-now-accent) 55%,white));transition:width .24s linear}\n.axisNowFacts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;margin-top:13px}.axisNowFacts>div{min-width:0;display:flex;align-items:baseline;gap:8px}.axisNowFacts>div+div{justify-content:flex-end}.axisNowFacts span{color:var(--dim);font-size:10px;white-space:nowrap}.axisNowFacts b{min-width:0;color:var(--muted);font-size:11px;font-weight:620;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#idleSignalWrap,#liveSignalWrap{display:none!important}\n#activeHome>.liveHead{margin-top:0!important}#activeHome>.metricPair.compact{margin-top:10px!important}\n#v87Now{left:50%!important;right:auto!important;width:min(calc(100vw - 28px),500px)!important;max-width:500px!important;box-sizing:border-box!important;transform:translate3d(-50%,0,0)!important;contain:layout paint!important}#v87Now .v87Main,#v87Now .v87Actions{width:100%!important;box-sizing:border-box!important}#v87Now .v87Actions{display:grid!important;grid-template-columns:96px minmax(0,1fr) 68px!important;align-items:center!important;column-gap:8px!important}#v87Now .v87Primary{width:96px!important;min-width:96px!important;padding:0!important}#v87Now .v87Rest{width:100%!important;text-align:left!important}#v87Now .v87Add{width:68px!important;min-width:68px!important;padding:0!important}\n#quickRecordSheet .v882QuickMine{margin-top:16px}.v882QuickMedia{padding:16px 0 18px;border-top:1px solid var(--line2)}.v882QuickMedia>span{display:block;margin-bottom:10px;color:var(--muted);font-size:12px}.v882QuickMedia>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v882QuickMedia button{height:42px;min-width:0;padding:0 8px;border-radius:12px;background:var(--s2);color:var(--muted);font-size:12px}.v882QuickMedia.hidden{display:none!important}\n@media(max-width:390px){#axisNowHero{min-height:190px;padding-top:14px}.axisNowStage{grid-template-columns:minmax(0,1fr) 68px;gap:12px;min-height:98px}.axisNowDial{width:64px;height:64px}.axisNowCopy>b{font-size:35px}#v87Now{width:calc(100vw - 20px)!important}.v882QuickMedia>div{gap:6px}.v882QuickMedia button{font-size:11px;padding:0 4px}}\n`;
  write(FILE,css);
}

console.log('[AXIS 8.8.2] convergence passed · home state model · local visual memory · quick custom/media · waist library · stable active geometry · countdown-only sound');