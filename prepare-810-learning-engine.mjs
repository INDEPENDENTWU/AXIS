import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 learning engine] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);

src=regexOnce(src,/function axis89SpeakStore\(\)\{[\s\S]*?\n\}\nfunction axis89SaveSpeak/,`function axis89SpeakStore(){
 try{
  const raw=JSON.parse(localStorage.getItem(AXIS89_SPEAK_KEY)||'null'),s=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  s.seen=s.seen&&typeof s.seen==='object'&&!Array.isArray(s.seen)?s.seen:{};
  s.current=s.current&&typeof s.current==='object'&&!Array.isArray(s.current)?s.current:null;
  s.prefs=s.prefs&&typeof s.prefs==='object'&&!Array.isArray(s.prefs)?s.prefs:{};
  s.mastered=s.mastered&&typeof s.mastered==='object'&&!Array.isArray(s.mastered)?s.mastered:{};
  s.review=s.review&&typeof s.review==='object'&&!Array.isArray(s.review)?s.review:{};
  s.daily=s.daily&&typeof s.daily==='object'&&!Array.isArray(s.daily)?s.daily:{};
  s.sessions=s.sessions&&typeof s.sessions==='object'&&!Array.isArray(s.sessions)?s.sessions:{};
  s.history=Array.isArray(s.history)?s.history.slice(-160):[];
  return s
 }catch{return{seen:{},current:null,prefs:{},mastered:{},review:{},daily:{},sessions:{},history:[]}}
}
function axis89SaveSpeak`,'8.10 accessory store');

src=regexOnce(src,/function axis89SpeakPrefs\(\)\{[\s\S]*?\n\}\nfunction axis89PickPhrase/,`function axis89SpeakPrefs(){
 try{
  const s=axis89SpeakStore(),p=s.prefs||{},native=p.native==='en'?'en':'zh',allowed=native==='zh'?['en','ja','ko']:['zh','ja','ko'];
  const mode=['auto','light','standard','deep'].includes(p.mode)?p.mode:'auto';
  const track=['auto','daily','gym','social','travel','work','service','ielts','native'].includes(p.track)?p.track:'auto';
  const cadence=['auto','every','long','manual'].includes(p.cadence)?p.cadence:'auto';
  const level=['adaptive','foundation','progress','advanced'].includes(p.level)?p.level:'adaptive';
  const dailyTarget=[0,6,12,20].includes(Number(p.dailyTarget))?Number(p.dailyTarget):0;
  return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0],mode,track,cadence,level,dailyTarget}
 }catch{return{on:false,native:'zh',target:'en',mode:'auto',track:'auto',cadence:'auto',level:'adaptive',dailyTarget:0}}
}
function axis89PickPhrase`,'8.10 preferences');

const engine=`const AXIS810_TRACKS=['gym','daily','social','travel','work','service','ielts','native'];
function axis810DayKey(t=Date.now()){const d=new Date(t),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return d.getFullYear()+'-'+m+'-'+day}
function axis810Daily(s){const date=axis810DayKey();if(s.daily?.date!==date)s.daily={date,count:0,ids:{},mastered:0};s.daily.ids=s.daily.ids&&typeof s.daily.ids==='object'?s.daily.ids:{};return s.daily}
function axis810SessionKey(){return String(readCore().active?.id||'no-active-session')}
function axis810Session(s){const key=axis810SessionKey();if(!s.sessions[key]||typeof s.sessions[key]!=='object')s.sessions[key]={count:0,ids:{},updatedAt:Date.now()};const q=s.sessions[key];q.ids=q.ids&&typeof q.ids==='object'?q.ids:{};q.updatedAt=Date.now();const keys=Object.keys(s.sessions);if(keys.length>16)keys.sort((a,b)=>(s.sessions[b]?.updatedAt||0)-(s.sessions[a]?.updatedAt||0)).slice(16).forEach(k=>delete s.sessions[k]);return q}
function axis810DailyTarget(p){if(Number(p.dailyTarget)>0)return Number(p.dailyTarget);return p.mode==='light'?6:p.mode==='deep'?20:p.mode==='standard'?12:12}
function axis810SessionCap(p){const target=axis810DailyTarget(p),base=p.mode==='light'?4:p.mode==='deep'?10:p.mode==='standard'?7:6;return Math.max(3,Math.min(12,Math.max(base,Math.ceil(target*.5))))}
function axis810Threshold(p){return p.mode==='light'?35000:p.mode==='deep'?12000:p.mode==='standard'?22000:20000}
function axis810CanSurface(p,s,rest,force=false){if(force)return true;if(p.cadence==='manual')return false;if(p.cadence==='long'&&rest<45000)return false;if(p.cadence==='auto'&&rest<axis810Threshold(p))return false;const d=axis810Daily(s),q=axis810Session(s);if(Number(d.count)||0>=axis810DailyTarget(p))return false;if(Number(q.count)||0>=axis810SessionCap(p))return false;return true}
function axis810Hash(s){let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function axis810AutoTrack(key){const weighted=['gym','gym','gym','gym','daily','daily','native','native','ielts','social','work','travel','service'];return weighted[axis810Hash(key)%weighted.length]}
function axis810LevelPenalty(x,p,s){const level=String(x?.level||axis891Rich(x,p).level||'').toUpperCase(),seen=Object.keys(s.seen||{}).length;let mode=p.level;if(mode==='adaptive')mode=seen<32?'foundation':seen<120?'progress':'advanced';if(mode==='foundation')return /C1/.test(level)?7e13:/B2/.test(level)?2e13:0;if(mode==='progress')return /A2/.test(level)?2e13:/^C1$/.test(level)?1.5e13:0;if(mode==='advanced')return /A2|^B1$/.test(level)?6e13:0;return 0}
function axis810ReviewState(s,id){const q=s.review?.[id];if(q&&typeof q==='object')return q;const mastered=Number(s.mastered?.[id])||0;return mastered?{strength:1,due:mastered+86400000,lastRating:'mastered'}:null}
function axis810Pool(p,key){let pool=axis891Pool(p.target);if(p.target!=='en')return pool;if(p.track!=='auto'){const f=pool.filter(x=>(x.track||axis891Rich(x,p).track||'daily')===p.track);if(f.length)pool=f}return pool}
function axis810RankPick(pool,s,p,key,exclude=''){
 const preferred=p.track==='auto'&&p.target==='en'?axis810AutoTrack(key):p.track,now=Date.now();
 const ranked=pool.filter(x=>x.id!==exclude).map(x=>{const q=s.seen[x.id]&&typeof s.seen[x.id]==='object'?s.seen[x.id]:{n:0,last:0},rv=axis810ReviewState(s,x.id),track=x.track||axis891Rich(x,p).track||'daily';let score=(Number(q.n)||0)*1e12+(Number(q.last)||0)+axis810LevelPenalty(x,p,s);if(preferred&&preferred!=='auto'&&track!==preferred)score+=3e11;if(rv){if(Number(rv.due)||0<=now)score-=5e15;else score+=5e15}return{x,score}}).sort((a,b)=>a.score-b.score);
 return ranked[0]?.x||pool.find(x=>x.id!==exclude)||pool[0]||null
}
function axis810RecordExposure(s,x,key){const d=axis810Daily(s),q=axis810Session(s),at=Date.now(),seen=s.seen[x.id]&&typeof s.seen[x.id]==='object'?s.seen[x.id]:{n:0,last:0};s.seen[x.id]={n:(Number(seen.n)||0)+1,last:at};d.count=(Number(d.count)||0)+1;d.ids[x.id]=(Number(d.ids[x.id])||0)+1;q.count=(Number(q.count)||0)+1;q.ids[x.id]=(Number(q.ids[x.id])||0)+1;s.history.push({id:x.id,at,track:x.track||'daily',session:axis810SessionKey(),key});if(s.history.length>160)s.history=s.history.slice(-160)}
function axis810SelectPhrase(key,rest,{force=false,exclude=''}={}){try{const p=axis89SpeakPrefs(),s=axis89SpeakStore();if(!p.on)return null;if(!exclude&&s.current?.key===key&&s.current?.target===p.target){const same=axis891Phrase(s.current.id);if(same)return same}if(!axis810CanSurface(p,s,rest,force))return null;const pool=axis810Pool(p,key);if(!pool.length)return null;const pick=axis810RankPick(pool,s,p,key,exclude);if(!pick)return null;axis810RecordExposure(s,pick,key);s.current={key,target:p.target,id:pick.id};axis89SaveSpeak(s);return pick}catch{return null}}
function axis810PaintPrompt(el,rest,key){el.classList.add('v810SpeakPrompt');el.dataset.key=key;el.dataset.restMs=String(rest);el.setAttribute('aria-label',clock(rest)+' · 学一句');el.innerHTML='<span><i>'+clock(rest)+' ·</i><b>学一句</b></span><small>手动 · 点击开始</small>'}
function axis810InvokeManual(el){const p=axis89SpeakPrefs(),key=el?.dataset?.key||'',rest=Number(el?.dataset?.restMs)||0,x=axis810SelectPhrase(key,rest,{force:true});if(!x||!el)return;axis891PaintRestPhrase(el,x,p,rest,key);axis891OpenSpeak(el)}
function axis810Review(id,rating='mastered'){const s=axis89SpeakStore(),old=axis810ReviewState(s,id)||{strength:0,due:0},strength=Math.min(6,(Number(old.strength)||0)+1),days=[0,1,3,7,14,30,60][strength]||60,at=Date.now();s.review[id]={strength,due:at+days*86400000,lastRating:rating,updatedAt:at};s.mastered[id]=at;const d=axis810Daily(s);d.mastered=(Number(d.mastered)||0)+1;axis89SaveSpeak(s);return s.review[id]}
function axis810ShouldExpand(p,rest){if(p.mode==='light')return false;if(p.mode==='deep')return rest>=25000;if(p.mode==='standard')return rest>=60000;return rest>=75000}
function axis810Snapshot(){const s=axis89SpeakStore(),p=axis89SpeakPrefs(),d=axis810Daily(s),q=axis810Session(s),now=Date.now();return{version:'8.10',prefs:p,english:axis891Pool('en').length,total:axis891AllPhrases().length,today:{count:Number(d.count)||0,target:axis810DailyTarget(p),mastered:Number(d.mastered)||0},session:{count:Number(q.count)||0,cap:axis810SessionCap(p)},due:Object.values(s.review||{}).filter(x=>(Number(x?.due)||Infinity)<=now).length,history:s.history.slice(-30)}}
`;
src=once(src,'function renderRestLine(rest,e,a,planDone){',engine+'\nfunction renderRestLine(rest,e,a,planDone){','autonomous learning engine');

src=regexOnce(src,/function renderRestLine\(rest,e,a,planDone\)\{[\s\S]*?\n\}\nfunction axis89SpeakVoice/,`function renderRestLine(rest,e,a,planDone){
 const el=$('#v87Now #v87Rest');if(!el)return;
 el.classList.remove('v89Speak','v891SpeakReady','v810SpeakPrompt');el.style.removeProperty('--v891-speak-size');delete el.dataset.lang;delete el.dataset.speak;delete el.dataset.phraseId;delete el.dataset.key;delete el.dataset.restMs;
 el.textContent=rest?\`休息 \${clock(rest)}\`:a.status==='paused'?'实际时间已暂停':planDone?'切换项目时自动结束':' ';
 if(!rest){axis891CloseSpeak();return}
 try{
  const p=axis89SpeakPrefs();if(!p?.on){axis891CloseSpeak();return}
  const key=e.id+':'+String(a.restStartedAt),x=axis810SelectPhrase(key,rest);if(x){axis891PaintRestPhrase(el,x,p,rest,key);return}
  if(p.cadence==='manual')axis810PaintPrompt(el,rest,key)
 }catch{}
}
function axis89SpeakVoice`,'8.10 delivery renderer');

src=regexOnce(src,/function axis891NextSpeak\(\)\{[\s\S]*?\n\}\nfunction axis891MasterSpeak/,`function axis891NextSpeak(){
 const panel=$('#v891SpeakPanel'),el=$('#v87Rest'),p=axis89SpeakPrefs();if(!panel||!el)return;const current=panel.dataset.phraseId||axis89SpeakStore().current?.id||'',key=el.dataset.key||panel.dataset.key||'',rest=Number(el.dataset.restMs||panel.dataset.sourceRest)||0,pick=axis810SelectPhrase(key,rest,{force:true,exclude:current});if(!pick)return;axis891PaintRestPhrase(el,pick,p,rest,key);axis891OpenSpeak(el)
}
function axis891MasterSpeak`,'8.10 next phrase');
src=regexOnce(src,/function axis891MasterSpeak\(\)\{[\s\S]*?\n\}\nfunction axis891ToggleMore/,`function axis891MasterSpeak(){
 const panel=$('#v891SpeakPanel'),id=panel?.dataset?.phraseId;if(!id)return;axis810Review(id,'mastered');axis891NextSpeak()
}
function axis891ToggleMore`,'8.10 spaced review mastery');
src=once(src,"const elapsed=Number(panel.dataset.sourceRest)||0;panel.classList.toggle('expanded',elapsed>=75000);","const elapsed=Number(panel.dataset.sourceRest)||0;panel.classList.toggle('expanded',axis810ShouldExpand(p,elapsed));",'time-aware learning depth');
src=once(src,"const speak=e.target.closest('#v87Rest.v89Speak');if(speak){axis891OpenSpeak(speak);return}","const prompt=e.target.closest('#v87Rest.v810SpeakPrompt');if(prompt){axis810InvokeManual(prompt);return}const speak=e.target.closest('#v87Rest.v89Speak');if(speak){axis891OpenSpeak(speak);return}",'manual learning invocation');
src=once(src,"window.__AXIS_REST_SPEAK__={version:'8.9',patch:'8.9.1',owner:'passive-rest-reader',failOpen:true,userInvokedPanel:true,richEnglish:72,prefs:axis89SpeakPrefs,phrases:()=>axis891AllPhrases().length};","window.__AXIS_REST_SPEAK__={version:'8.9',patch:'8.10',owner:'passive-rest-reader',failOpen:true,userInvokedPanel:true,autonomousCadence:true,richEnglish:456,totalUnits:492,prefs:axis89SpeakPrefs,phrases:()=>axis891AllPhrases().length,snapshot:axis810Snapshot};",'8.10 public diagnostic');

if(/setInterval\s*\(\s*axis810|new\s+MutationObserver\s*\(\s*axis810|new\s+ResizeObserver\s*\(\s*axis810/.test(src))fail('8.10 learning gained forbidden timer/observer owner');
for(const needle of ['function axis810SelectPhrase(','function axis810Review(','function axis810Snapshot(',"patch:'8.10'",'richEnglish:456','totalUnits:492'])if(!src.includes(needle))fail(`missing ${needle}`);
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.10 learning engine] PASS · smart cadence · user cadence · daily/session budget · due review · isolated history');
