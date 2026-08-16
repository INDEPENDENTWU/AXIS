import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9 speak] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

{
 const FILE='v87-runtime.js';let src=read(FILE);
 src=once(src,'<div class="v87Seg four" id="v87Rest">','<div class="v87Seg four" id="v87RestTiming">','rest reminder id separation');
 src=once(src,"syncSeg($('#v87Rest'),p.reminderTiming||'auto')","syncSeg($('#v87RestTiming'),p.reminderTiming||'auto')",'rest reminder render selector');
 src=once(src,"else if(b.closest('#v87Rest'))setPref('reminderTiming',b.dataset.v)","else if(b.closest('#v87RestTiming'))setPref('reminderTiming',b.dataset.v)",'rest reminder event selector');
 const speak=`const AXIS89_SPEAK_KEY='axis_v89_speak';
const AXIS89_SPEAK=[
 ['en01','en','Could you give me a hand?','能帮我一下吗？','Could you give me a hand?','','Could you + 动作'],
 ['en02','en','Is anyone using this?','这个有人在用吗？','Is anyone using this?','','Is anyone + 动作-ing?'],
 ['en03','en',"I'm almost done.",'我快好了。',"I'm almost done.",'',''],
 ['en04','en','Go ahead.','你先请。','Go ahead.','',''],
 ['en05','en','No worries.','没关系。','No worries.','',''],
 ['en06','en','That works for me.','这样我可以。','That works for me.','',''],
 ['en07','en','Could you wait a second?','能等一下吗？','Could you wait a second?','','Could you + 动作'],
 ['en08','en','Can I get this to go?','这个可以打包吗？','Can I get this to go?','','Can I get + 东西 + to go?'],
 ['en09','en','Where should I get off?','我应该在哪站下？','Where should I get off?','','Where should I + 动作?'],
 ['en10','en',"I'm just looking.",'我只是看看。',"I'm just looking.",'',''],
 ['en11','en','Sounds good.','听起来不错 / 就这么办。','Sounds good.','',''],
 ['en12','en','Could you say that again?','可以再说一遍吗？','Could you say that again?','','Could you + 动作'],
 ['ja01','ja','ちょっと待ってください。','请稍等一下。','Please wait a moment.','chotto matte kudasai',''],
 ['ja02','ja','これ、使っていますか？','这个有人在用吗？','Are you using this?','kore tsukatte imasu ka',''],
 ['ja03','ja','大丈夫です。','没关系 / 我没事。',"I'm okay / No worries.",'daijoubu desu',''],
 ['ja04','ja','お願いします。','麻烦你了 / 拜托了。','Please.','onegaishimasu',''],
 ['ja05','ja','もう一度お願いします。','请再说一次。','One more time, please.','mou ichido onegaishimasu',''],
 ['ja06','ja','これはいくらですか？','这个多少钱？','How much is this?','kore wa ikura desu ka',''],
 ['ja07','ja','ここで大丈夫です。','这里就可以。','Here is fine.','koko de daijoubu desu',''],
 ['ja08','ja','おすすめは何ですか？','有什么推荐？','What do you recommend?','osusume wa nan desu ka',''],
 ['ja09','ja','少しだけ。','只要一点。','Just a little.','sukoshi dake',''],
 ['ja10','ja','わかりました。','明白了。','Got it.','wakarimashita',''],
 ['ja11','ja','すみません、通ります。','不好意思，借过。','Excuse me, coming through.','sumimasen toorimasu',''],
 ['ja12','ja','また後で。','待会儿见 / 回头再说。','See you later.','mata ato de',''],
 ['ko01','ko','잠깐만요.','请等一下。','Wait a second.','jamkkanmanyo',''],
 ['ko02','ko','이거 쓰고 계세요?','这个有人在用吗？','Are you using this?','igeo sseugo gyeseyo',''],
 ['ko03','ko','괜찮아요.','没关系 / 我没事。',"I'm okay / No worries.",'gwaenchanayo',''],
 ['ko04','ko','부탁드릴게요.','麻烦你了。','Please / I would appreciate it.','butakdeurilgeyo',''],
 ['ko05','ko','다시 말해 주세요.','请再说一次。','Please say that again.','dasi malhae juseyo',''],
 ['ko06','ko','이거 얼마예요?','这个多少钱？','How much is this?','igeo eolmayeyo',''],
 ['ko07','ko','여기서 내려 주세요.','请让我在这里下车。','Please let me off here.','yeogiseo naeryeo juseyo',''],
 ['ko08','ko','추천해 주세요.','请给我推荐一下。','Please recommend something.','chucheonhae juseyo',''],
 ['ko09','ko','조금만 주세요.','请只给一点。','Just a little, please.','jogeumman juseyo',''],
 ['ko10','ko','알겠어요.','明白了。','Got it.','algesseoyo',''],
 ['ko11','ko','실례할게요.','不好意思，借过。','Excuse me.','sillyehalgeyo',''],
 ['ko12','ko','나중에 봐요.','待会儿见。','See you later.','najunge bwayo',''],
 ['zh01','zh','等一下。','等一下。','Wait a second.','děng yí xià',''],
 ['zh02','zh','这个有人用吗？','这个有人用吗？','Is anyone using this?','zhè ge yǒu rén yòng ma',''],
 ['zh03','zh','没关系。','没关系。','No worries.','méi guān xi',''],
 ['zh04','zh','麻烦你了。','麻烦你了。','Thanks for your help / Please.','má fan nǐ le',''],
 ['zh05','zh','可以再说一遍吗？','可以再说一遍吗？','Could you say that again?','kě yǐ zài shuō yí biàn ma',''],
 ['zh06','zh','这个多少钱？','这个多少钱？','How much is this?','zhè ge duō shao qián',''],
 ['zh07','zh','这里下就可以。','这里下就可以。','I can get off here.','zhè lǐ xià jiù kě yǐ',''],
 ['zh08','zh','有什么推荐吗？','有什么推荐吗？','What do you recommend?','yǒu shén me tuī jiàn ma',''],
 ['zh09','zh','少一点就好。','少一点就好。','Just a little is fine.','shǎo yì diǎn jiù hǎo',''],
 ['zh10','zh','明白了。','明白了。','Got it.','míng bai le',''],
 ['zh11','zh','不好意思，借过。','不好意思，借过。','Excuse me, coming through.','bù hǎo yì si jiè guò',''],
 ['zh12','zh','回头见。','回头见。','See you later.','huí tóu jiàn','']
].map(x=>({id:x[0],lang:x[1],target:x[2],zh:x[3],en:x[4],pron:x[5],pattern:x[6]}));
function axis89SpeakStore(){try{return JSON.parse(localStorage.getItem(AXIS89_SPEAK_KEY)||'null')||{seen:{},current:null}}catch{return{seen:{},current:null}}}
function axis89SaveSpeak(s){try{localStorage.setItem(AXIS89_SPEAK_KEY,JSON.stringify(s))}catch{}}
function axis89SpeakPrefs(){const p=readMeta().prefs||{},native=p.v89SpeakNative==='en'?'en':'zh',allowed=native==='zh'?['en','ja','ko']:['zh','ja','ko'];return{on:p.v89SpeakEnabled===true,native,target:allowed.includes(p.v89SpeakTarget)?p.v89SpeakTarget:allowed[0]}}
function axis89PickPhrase(key){const p=axis89SpeakPrefs(),s=axis89SpeakStore();if(!p.on)return null;if(s.current?.key===key&&s.current?.target===p.target){return AXIS89_SPEAK.find(x=>x.id===s.current.id)||null}const pool=AXIS89_SPEAK.filter(x=>x.lang===p.target);if(!pool.length)return null;const ranked=pool.map(x=>{const q=s.seen[x.id]||{n:0,last:0};return{x,q,score:q.n*1e12+q.last}}).sort((a,b)=>a.score-b.score),pick=ranked[0].x,q=s.seen[pick.id]||{n:0,last:0};s.seen[pick.id]={n:q.n+1,last:Date.now()};s.current={key,target:p.target,id:pick.id};axis89SaveSpeak(s);return pick}
function axis89SpeakMeaning(x,p){if(!x)return'';const meaning=p.native==='en'?x.en:x.zh;return x.pron&&x.lang!=='en'?x.pron+' · '+meaning:meaning}
function renderRestLine(rest,e,a){const el=$('#v87Now #v87Rest');if(!el)return;const p=axis89SpeakPrefs();if(rest&&p.on){const x=axis89PickPhrase(e.id+':'+String(a.restStartedAt));if(x){el.classList.add('v89Speak');el.dataset.lang=x.lang;el.dataset.speak=x.target;el.innerHTML='<span>'+clock(rest)+' · '+esc(x.target)+'</span><small>'+esc(axis89SpeakMeaning(x,p))+'</small>';return}}el.classList.remove('v89Speak');delete el.dataset.lang;delete el.dataset.speak;el.textContent=rest?\`休息 \${clock(rest)}\`:a.status==='paused'?'实际时间已暂停':isPlanComplete(e,a,readMeta())?'切换项目时自动结束':' '}
function axis89SpeakVoice(el){const text=el?.dataset?.speak,lang=el?.dataset?.lang;if(!text||!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang==='ja'?'ja-JP':lang==='ko'?'ko-KR':lang==='zh'?'zh-CN':'en-US';u.rate=lang==='en'?.91:.88;speechSynthesis.speak(u)}catch{}}
function axis89SpeakStyle(){if($('#v89SpeakStyle'))return;const s=D.createElement('style');s.id='v89SpeakStyle';s.textContent=\`#v87Rest.v89Speak{height:32px!important;min-width:0!important;display:flex!important;flex:1 1 auto!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;gap:2px!important;overflow:hidden!important;cursor:pointer!important;white-space:normal!important;-webkit-tap-highlight-color:transparent!important}#v87Rest.v89Speak span,#v87Rest.v89Speak small{display:block!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}#v87Rest.v89Speak span{font-size:10.5px!important;line-height:13px!important;color:#c3c7d2!important;font-weight:620!important}#v87Rest.v89Speak small{font-size:9px!important;line-height:11px!important;color:#747c89!important}.v89SpeakSettings{border-top:1px solid var(--line);margin-top:2px}.v89SpeakSettings .v89SpeakRow{min-height:50px;display:flex;align-items:center;justify-content:space-between;gap:12px}.v89SpeakSettings .v89SpeakRow>span{font-size:13px;color:var(--muted)}.v89SpeakSettings .v89SpeakChoices{display:flex;gap:4px;min-width:0}.v89SpeakSettings .v89SpeakChoices button{height:30px;padding:0 9px;border-radius:9px;background:transparent;color:var(--dim);font-size:10.5px}.v89SpeakSettings .v89SpeakChoices button.active{background:#2b2f3a;color:var(--text)}.v89SpeakSettings .v89SpeakSub{display:none}.v89SpeakSettings.on .v89SpeakSub{display:flex}.v89SpeakSettings .v89SpeakNote{display:none;padding:0 0 11px;color:#68717e;font-size:9.5px;line-height:1.4}.v89SpeakSettings.on .v89SpeakNote{display:block}\`;D.head.appendChild(s)}
function axis89SetSpeak(k,v){const m=readMeta();m.prefs=m.prefs||{};m.prefs[k]=v;if(k==='v89SpeakNative'){const allowed=v==='en'?['zh','ja','ko']:['en','ja','ko'];if(!allowed.includes(m.prefs.v89SpeakTarget))m.prefs.v89SpeakTarget=allowed[0]}writeMeta(m);renderRestSpeakSettings();renderNow(true)}
function injectRestSpeak(){axis89SpeakStyle();const host=$('#settingsSheet .settingsList.second');if(!host)return;let box=$('#v89SpeakSettings');if(!box){box=D.createElement('div');box.id='v89SpeakSettings';box.className='v89SpeakSettings';box.innerHTML='<div class="v89SpeakRow"><span>组间口语</span><div class="v89SpeakChoices" id="v89SpeakOn"><button data-v="off">关闭</button><button data-v="on">开启</button></div></div><div class="v89SpeakRow v89SpeakSub"><span>母语</span><div class="v89SpeakChoices" id="v89SpeakNative"><button data-v="zh">中文</button><button data-v="en">English</button></div></div><div class="v89SpeakRow v89SpeakSub"><span>学习</span><div class="v89SpeakChoices" id="v89SpeakTarget"></div></div><div class="v89SpeakNote">只在组间休息出现 · 不自动播放 · 不影响训练记录</div>';host.appendChild(box)}renderRestSpeakSettings()}
function renderRestSpeakSettings(){const box=$('#v89SpeakSettings');if(!box)return;const p=axis89SpeakPrefs();box.classList.toggle('on',p.on);for(const b of $$('#v89SpeakOn button',box))b.classList.toggle('active',b.dataset.v===(p.on?'on':'off'));for(const b of $$('#v89SpeakNative button',box))b.classList.toggle('active',b.dataset.v===p.native);const target=$('#v89SpeakTarget'),opts=p.native==='zh'?[['en','English'],['ja','日本語'],['ko','한국어']]:[['zh','中文'],['ja','日本語'],['ko','한국어']];target.innerHTML=opts.map(x=>'<button data-v="'+x[0]+'" class="'+(x[0]===p.target?'active':'')+'">'+x[1]+'</button>').join('')}
window.__AXIS_REST_SPEAK__={version:'8.9',owner:'passive-rest-reader',prefs:axis89SpeakPrefs,phrases:()=>AXIS89_SPEAK.length};
`;
 src=once(src,'function renderNow(force=false){',speak+'\nfunction renderNow(force=false){','rest speak helpers');
 src=regexOnce(src,/\$\('#v87Rest'\)\.textContent=rest\?`休息 \$\{clock\(rest\)\}`:a\.status==='paused'\?'实际时间已暂停':planDone\?'切换项目时自动结束':' ';/,"renderRestLine(rest,e,a);",'rest line passive renderer');
 src=once(src,"if(e.target.closest('#settingsBtn'))setTimeout(injectAudio,90);", "if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();injectRestSpeak()},90);",'settings speak injection');
 src=once(src,"function installEvents(){D.addEventListener('click',async e=>{",`function installEvents(){D.addEventListener('click',async e=>{const speak=e.target.closest('#v87Rest.v89Speak');if(speak){axis89SpeakVoice(speak);return}const sp=e.target.closest('#v89SpeakSettings button');if(sp){if(sp.closest('#v89SpeakOn'))axis89SetSpeak('v89SpeakEnabled',sp.dataset.v==='on');else if(sp.closest('#v89SpeakNative'))axis89SetSpeak('v89SpeakNative',sp.dataset.v);else if(sp.closest('#v89SpeakTarget'))axis89SetSpeak('v89SpeakTarget',sp.dataset.v);return}`, 'speak event routes');
 src=once(src,'migrateAudio();injectAudio();installEvents();','migrateAudio();injectAudio();injectRestSpeak();installEvents();','speak boot');
 if(src.includes('setInterval(axis89')||src.includes('MutationObserver(axis89')||src.includes('ResizeObserver(axis89'))fail('Rest Speak gained forbidden timing/geometry owner');
 syntax(src,FILE);write(FILE,src);
}
console.log('[AXIS 8.9 speak] PASS');
