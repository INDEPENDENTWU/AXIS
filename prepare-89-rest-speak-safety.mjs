import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9 speak safety] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);

src=regexOnce(src,/function axis89SpeakStore\(\)\{[\s\S]*?\}\nfunction axis89SaveSpeak/,`function axis89SpeakStore(){
 try{
  const raw=JSON.parse(localStorage.getItem(AXIS89_SPEAK_KEY)||'null'),s=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  s.seen=s.seen&&typeof s.seen==='object'&&!Array.isArray(s.seen)?s.seen:{};
  s.current=s.current&&typeof s.current==='object'&&!Array.isArray(s.current)?s.current:null;
  s.prefs=s.prefs&&typeof s.prefs==='object'&&!Array.isArray(s.prefs)?s.prefs:{};
  return s
 }catch{return{seen:{},current:null,prefs:{}}}
}
function axis89SaveSpeak`,'safe accessory store');

src=regexOnce(src,/function axis89SpeakPrefs\(\)\{[\s\S]*?\}\nfunction axis89PickPhrase/,`function axis89SpeakPrefs(){
 try{const s=axis89SpeakStore(),p=s.prefs||{},native=p.native==='en'?'en':'zh',allowed=native==='zh'?['en','ja','ko']:['zh','ja','ko'];return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0]}}
 catch{return{on:false,native:'zh',target:'en'}}
}
function axis89PickPhrase`,'safe accessory prefs');

src=regexOnce(src,/function axis89PickPhrase\(key\)\{[\s\S]*?\}\nfunction axis89SpeakMeaning/,`function axis89PickPhrase(key){
 try{
  const p=axis89SpeakPrefs(),s=axis89SpeakStore();if(!p.on)return null;
  if(s.current?.key===key&&s.current?.target===p.target)return AXIS89_SPEAK.find(x=>x.id===s.current.id)||null;
  const pool=AXIS89_SPEAK.filter(x=>x.lang===p.target);if(!pool.length)return null;
  const ranked=pool.map(x=>{const q=s.seen[x.id]&&typeof s.seen[x.id]==='object'?s.seen[x.id]:{n:0,last:0};return{x,q,score:(Number(q.n)||0)*1e12+(Number(q.last)||0)}}).sort((a,b)=>a.score-b.score),pick=ranked[0]?.x;if(!pick)return null;
  const q=s.seen[pick.id]&&typeof s.seen[pick.id]==='object'?s.seen[pick.id]:{n:0,last:0};s.seen[pick.id]={n:(Number(q.n)||0)+1,last:Date.now()};s.current={key,target:p.target,id:pick.id};axis89SaveSpeak(s);return pick
 }catch{return null}
}
function axis89SpeakMeaning`,'safe phrase selection');

src=regexOnce(src,/function renderRestSpeakSettings\(\)\{[^\n]*\}\nwindow\.__AXIS_REST_SPEAK__=/,`function renderRestSpeakSettings(){
 try{
  const box=$('#v89SpeakSettings');if(!box)return;
  const p=axis89SpeakPrefs()||{on:false,native:'zh',target:'en'};
  const target=$('#v89SpeakTarget',box),opts=p.native==='zh'?[['en','English'],['ja','日本語'],['ko','한국어']]:[['zh','中文'],['ja','日本語'],['ko','한국어']];
  if(target)target.innerHTML=opts.map(x=>'<button data-v="'+x[0]+'" class="'+(x[0]===p.target?'active':'')+'">'+x[1]+'</button>').join('');
  box.classList.toggle('on',!!p.on);
  for(const b of $$('#v89SpeakOn button',box))b.classList.toggle('active',b.dataset.v===(p.on?'on':'off'));
  for(const b of $$('#v89SpeakNative button',box))b.classList.toggle('active',b.dataset.v===p.native)
 }catch(err){console.warn('[AXIS Rest Speak] settings render skipped',err)}
}
window.__AXIS_REST_SPEAK__=`,'safe settings renderer');

src=regexOnce(src,/function renderRestLine\(rest,e,a\)\{[\s\S]*?\}\nfunction axis89SpeakVoice/,`function renderRestLine(rest,e,a,planDone){
 const el=$('#v87Now #v87Rest');if(!el)return;
 el.classList.remove('v89Speak');delete el.dataset.lang;delete el.dataset.speak;
 el.textContent=rest?\`休息 \${clock(rest)}\`:a.status==='paused'?'实际时间已暂停':planDone?'切换项目时自动结束':' ';
 if(!rest)return;
 try{
  const p=axis89SpeakPrefs();if(!p?.on)return;
  const x=axis89PickPhrase(e.id+':'+String(a.restStartedAt));if(!x)return;
  el.classList.add('v89Speak');el.dataset.lang=x.lang;el.dataset.speak=x.target;
  el.innerHTML='<span>'+clock(rest)+' · '+esc(x.target)+'</span><small>'+esc(axis89SpeakMeaning(x,p))+'</small>'
 }catch{}
}
function axis89SpeakVoice`,'canonical rest first, accessory second');

src=once(src,'renderRestLine(rest,e,a);','renderRestLine(rest,e,a,planDone);','pass canonical plan state into fail-open rest renderer');
src=once(src,"if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();injectRestSpeak()},90);","if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();try{injectRestSpeak()}catch(err){console.warn('[AXIS Rest Speak] settings accessory skipped',err)}},90);",'settings accessory fail-open');
src=once(src,'migrateAudio();injectAudio();injectRestSpeak();installEvents();','migrateAudio();injectAudio();try{injectRestSpeak()}catch(err){console.warn(\'[AXIS Rest Speak] boot accessory skipped\',err)}installEvents();','boot accessory fail-open');
src=once(src,"window.__AXIS_REST_SPEAK__={version:'8.9',owner:'passive-rest-reader'","window.__AXIS_REST_SPEAK__={version:'8.9',owner:'passive-rest-reader',failOpen:true",'fail-open public diagnostic');

if(/function renderRestLine[\s\S]{0,900}readMeta\(/.test(src))fail('Rest Speak renderer still reaches training metadata');
if(!src.includes("el.textContent=rest?`休息 ${clock(rest)}`"))fail('canonical rest copy is not written before accessory enhancement');
if(!src.includes("el.innerHTML='<span>'+clock(rest)+' · '"))fail('compact timer-first Rest Speak presentation missing');
if(!src.includes("[AXIS Rest Speak] settings render skipped"))fail('settings renderer is not fail-open');
if(!src.includes("[AXIS Rest Speak] boot accessory skipped"))fail('accessory boot is not fail-open');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.9 speak safety] PASS · compact rest phrase · settings/boot accessory cannot abort training UI');
