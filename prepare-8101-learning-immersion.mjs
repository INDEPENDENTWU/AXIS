import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.1 immersion] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);

/* Settings: native row geometry + one compact state; detailed policy stays inside the dedicated panel. */
src=once(src,
"entry.className='settingLink v810ConfigEntry';entry.innerHTML='<span><b>学习安排</b><small id=\"v810ConfigSummary\"></small></span><i>›</i>';",
"entry.className='settingLink';entry.innerHTML='<span>学习安排</span><b id=\"v810ConfigSummary\"></b><i>›</i>';",
'native settings row');
src=once(src,
"if(summary)summary.textContent=(AXIS810_LABELS.mode[p.mode]||'智能')+' · '+(AXIS810_LABELS.track[p.track]||'自动内容')+' · '+(AXIS810_LABELS.cadence[p.cadence]||'智能出现')+' · '+(p.dailyTarget?('每日 '+p.dailyTarget):'日目标自动')",
"if(summary){const custom=p.mode!=='auto'||p.track!=='auto'||p.cadence!=='auto'||p.level!=='adaptive'||Number(p.dailyTarget)>0||p.opportunity!=='auto';summary.textContent=custom?'自定':'智能'}",
'compact settings summary');

/* Add opportunity policy to the isolated learning preference surface. */
src=once(src,
"const dailyTarget=[0,6,12,20].includes(Number(p.dailyTarget))?Number(p.dailyTarget):0;\n  return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0],mode,track,cadence,level,dailyTarget}",
"const dailyTarget=[0,6,12,20].includes(Number(p.dailyTarget))?Number(p.dailyTarget):0;\n  const opportunity=['auto','rest','pause','off'].includes(p.opportunity)?p.opportunity:'auto';\n  return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0],mode,track,cadence,level,dailyTarget,opportunity}",
'opportunity preference');
src=once(src,
"catch{return{on:false,native:'zh',target:'en',mode:'auto',track:'auto',cadence:'auto',level:'adaptive',dailyTarget:0}}",
"catch{return{on:false,native:'zh',target:'en',mode:'auto',track:'auto',cadence:'auto',level:'adaptive',dailyTarget:0,opportunity:'auto'}}",
'opportunity fallback');
src=once(src,
"dailyTarget:[[0,'自动'],[6,'6'],[12,'12'],[20,'20']]};",
"dailyTarget:[[0,'自动'],[6,'6'],[12,'12'],[20,'20']],opportunity:[['auto','智能'],['rest','仅组间'],['pause','暂停可用'],['off','关闭']]};",
'opportunity settings group');
src=once(src,
"level:{adaptive:'自适应',foundation:'基础',progress:'进阶',advanced:'高阶'}};",
"level:{adaptive:'自适应',foundation:'基础',progress:'进阶',advanced:'高阶'},opportunity:{auto:'智能机会',rest:'仅组间',pause:'暂停可用',off:'关闭'}};",
'opportunity settings labels');
src=once(src,
"<div class=\"v810SpeakBlock\"><div><span>日目标</span><b>每日接触上限</b></div><div data-v810-options=\"dailyTarget\"></div></div><div class=\"v810Progress\">",
"<div class=\"v810SpeakBlock\"><div><span>日目标</span><b>每日接触上限</b></div><div data-v810-options=\"dailyTarget\"></div></div><div class=\"v810SpeakBlock\"><div><span>机会学习</span><b>不抢训练主线</b></div><div data-v810-options=\"opportunity\"></div></div><div class=\"v810Progress\">",
'opportunity settings block');

const css=`
/* AXIS 8.10.1: practice is an accessory layer, never a training geometry owner. */
#v87Rest.v8101Opportunity{height:35px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:stretch!important;gap:1px!important;cursor:pointer!important;overflow:hidden!important;-webkit-tap-highlight-color:transparent!important}
#v87Rest.v8101Opportunity>span{display:flex;align-items:center;gap:6px;color:#b7bdc8;font-size:10px;line-height:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#v87Rest.v8101Opportunity>span i{width:6px;height:6px;border-radius:50%;background:#737cff;box-shadow:0 0 0 4px rgba(115,124,255,.10);flex:0 0 auto}#v87Rest.v8101Opportunity>small{color:#6f7886;font-size:8.75px;line-height:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v8101Practice{margin-top:11px;padding-top:10px;border-top:1px solid rgba(255,255,255,.055)}.v8101PracticeTabs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.v8101PracticeTabs button{height:31px;border-radius:10px;background:rgba(255,255,255,.035);color:#7d8694;font-size:9.5px;font-weight:650}.v8101PracticeTabs button.active{background:rgba(115,124,255,.14);color:#c6c9ff}.v8101PracticeBody{padding-top:9px}.v8101Turn{display:grid;grid-template-columns:36px minmax(0,1fr);gap:9px;padding:6px 0}.v8101Turn>span{padding-top:2px;color:#69727f;font-size:9px}.v8101Turn>b{color:#d9dbe0;font-size:11.5px;line-height:1.42;font-weight:620}.v8101Turn.me>b{color:#f0efec}.v8101Alt{margin-top:5px;color:#7e8794;font-size:9.5px;line-height:1.45}.v8101Cue{padding:8px 0 3px;color:#aeb4bf;font-size:10.5px;line-height:1.5}.v8101ShadowLine{margin:5px 0 1px;color:#e6e5e2;font-size:15px;line-height:1.48;font-weight:660;letter-spacing:-.01em}.v8101ShadowLine span{transition:color .12s ease,opacity .12s ease}.v8101ShadowLine span.on{color:#aeb3ff}.v8101Practice.doing .v8101ShadowLine{opacity:.92}.v8101PracticeStatus{min-height:16px;margin-top:5px;color:#717a88;font-size:9px;line-height:1.4}.v8101PracticeActions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-top:7px}.v8101PracticeActions button{height:32px;border-radius:10px;background:rgba(255,255,255,.04);color:#9aa2ae;font-size:9.5px;font-weight:630}.v8101PracticeActions button.primary{background:rgba(115,124,255,.14);color:#c5c9ff}.v8101PracticeActions button.recording{background:rgba(227,130,123,.12);color:#e5aaa5}.v8101Privacy{margin-top:6px;color:#5f6875;font-size:8.5px;line-height:1.4}.v8101Playback[hidden]{display:none!important}
@media(max-width:380px){.v8101Turn{grid-template-columns:32px minmax(0,1fr)}.v8101ShadowLine{font-size:14px}.v8101PracticeActions button{font-size:9px}}
`;

const helpers=`let AXIS8101_PRACTICE={mode:'dialogue',rec:null,stream:null,chunks:[],url:'',discard:false};
function axis8101Style(){if($('#v8101Style'))return;const s=D.createElement('style');s.id='v8101Style';s.textContent=${JSON.stringify(css)};D.head.appendChild(s)}
function axis8101Rich(){const p=$('#v891SpeakPanel'),x=axis891Phrase(p?.dataset?.phraseId);return x?axis891Rich(x,axis89SpeakPrefs()):null}
function axis8101Status(text){const e=$('#v8101PracticeStatus');if(e)e.textContent=text||''}
function axis8101StopMic({discard=false}={}){const q=AXIS8101_PRACTICE;q.discard=discard;try{if(q.rec&&q.rec.state!=='inactive'){q.rec.ondataavailable=null;q.rec.onstop=null;q.rec.stop()}}catch{}try{q.stream?.getTracks?.().forEach(t=>t.stop())}catch{}q.rec=null;q.stream=null;q.chunks=[];const b=$('#v8101Record');if(b){b.classList.remove('recording');b.textContent='录下自己'}if(discard&&q.url){try{URL.revokeObjectURL(q.url)}catch{}q.url='';const play=$('#v8101Playback');if(play)play.hidden=true}}
function axis8101StopPractice(){try{speechSynthesis?.cancel?.()}catch{}axis8101StopMic({discard:true});const root=$('#v8101Practice');root?.classList.remove('doing')}
function axis8101VoiceLang(lang){return lang==='ja'?'ja-JP':lang==='ko'?'ko-KR':lang==='zh'?'zh-CN':'en-US'}
function axis8101Utter(text,lang='en',rate=.96,pitch=1){if(!text||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return null;const u=new SpeechSynthesisUtterance(text);u.lang=axis8101VoiceLang(lang);u.rate=rate;u.pitch=pitch;return u}
function axis8101SpeakSequence(items,done){try{speechSynthesis.cancel()}catch{}let i=0;const next=()=>{if(i>=items.length){done?.();return}const item=items[i++],u=axis8101Utter(item.text,item.lang,item.rate,item.pitch);if(!u){done?.();return}u.onend=next;u.onerror=next;speechSynthesis.speak(u)};next()}
function axis8101PracticeHtml(mode,r){
 if(mode==='dialogue')return '<div class="v8101Turn me"><span>你</span><b>'+esc(r.target||'')+'</b></div><div class="v8101Turn"><span>对方</span><b>'+esc(r.response||'自然回应会因场景变化')+'</b></div>'+(r.alt?'<div class="v8101Alt">换一种说法 · '+esc(r.alt)+'</div>':'')+'<div class="v8101PracticeActions"><button type="button" class="primary" data-v8101-action="dialogue">听完整对话</button><button type="button" id="v8101Record" data-v8101-action="record">录下自己</button><button type="button" id="v8101Playback" class="v8101Playback" data-v8101-action="playback" hidden>回听自己</button></div><div class="v8101Privacy">录音只留在当前页面内存，关闭学习卡即删除。</div>';
 if(mode==='echo')return '<div class="v8101Cue">先听自然节奏，再完整复述。不要逐词追音，先抓重音和语块。</div><div class="v8101ShadowLine">'+esc(r.target||'')+'</div><div class="v8101PracticeActions"><button type="button" class="primary" data-v8101-action="echo">慢一点听</button><button type="button" id="v8101Record" data-v8101-action="record">录下自己</button><button type="button" id="v8101Playback" class="v8101Playback" data-v8101-action="playback" hidden>回听自己</button></div><div class="v8101Privacy">目标不是模仿音色，而是重音、弱读、连读和句子节奏。</div>';
 const words=String(r.target||'').split(/(\\s+)/).filter(Boolean);return '<div class="v8101Cue">声音开始后几乎同时开口，比它慢半拍即可。卡住也不要停，继续跟下一语块。</div><div class="v8101ShadowLine" id="v8101ShadowLine">'+words.map((w,i)=>/\\s+/.test(w)?w:'<span data-word="'+i+'">'+esc(w)+'</span>').join('')+'</div><div class="v8101PracticeActions"><button type="button" class="primary" data-v8101-action="shadow">开始影子跟读</button><button type="button" id="v8101Record" data-v8101-action="record">录下自己</button><button type="button" id="v8101Playback" class="v8101Playback" data-v8101-action="playback" hidden>回听自己</button></div><div class="v8101Privacy">建议戴耳机练影子跟读；录音不上传、不保存。</div>'
}
function axis8101MountPractice(panel,r,x,p){let root=$('#v8101Practice',panel);if(!root){root=D.createElement('div');root.id='v8101Practice';root.className='v8101Practice';root.innerHTML='<div class="v8101PracticeTabs"><button type="button" data-v8101-mode="dialogue">对话</button><button type="button" data-v8101-mode="echo">跟读</button><button type="button" data-v8101-mode="shadow">影子</button></div><div class="v8101PracticeBody" id="v8101PracticeBody"></div><div class="v8101PracticeStatus" id="v8101PracticeStatus"></div>';panel.querySelector('.v891SpeakActions')?.before(root)}const mode=AXIS8101_PRACTICE.mode||'dialogue';root.querySelectorAll('[data-v8101-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v8101Mode===mode));$('#v8101PracticeBody',root).innerHTML=axis8101PracticeHtml(mode,r);axis8101Status('')}
function axis8101SetMode(mode){if(!['dialogue','echo','shadow'].includes(mode))return;axis8101StopMic({discard:true});AXIS8101_PRACTICE.mode=mode;const panel=$('#v891SpeakPanel'),r=axis8101Rich(),x=axis891Phrase(panel?.dataset?.phraseId);if(panel&&r&&x)axis8101MountPractice(panel,r,x,axis89SpeakPrefs())}
function axis8101MarkAttempt(kind){try{const s=axis89SpeakStore();s.practice=s.practice&&typeof s.practice==='object'?s.practice:{};s.practice[kind]=(Number(s.practice[kind])||0)+1;s.practice.lastAt=Date.now();axis89SaveSpeak(s)}catch{}}
function axis8101SpeakDialogue(){const r=axis8101Rich();if(!r)return;axis8101Status('听两个人怎么接起来');axis8101MarkAttempt('dialogue');axis8101SpeakSequence([{text:r.target,lang:'en',rate:.96,pitch:1},{text:r.response||'',lang:'en',rate:.98,pitch:.94}],()=>axis8101Status('现在不看中文，再说一遍你的那句'))}
function axis8101Echo(){const r=axis8101Rich();if(!r)return;axis8101Status('听完后完整复述 · 不要逐词停顿');axis8101MarkAttempt('echo');axis8101SpeakSequence([{text:r.target,lang:'en',rate:.86,pitch:1}],()=>axis8101Status('轮到你 · 保持同样的重音和节奏'))}
function axis8101StartShadow(){const r=axis8101Rich(),root=$('#v8101Practice'),line=$('#v8101ShadowLine');if(!r||!root)return;axis8101Status('现在一起说 · 比声音慢半拍');axis8101MarkAttempt('shadow');root.classList.add('doing');line?.querySelectorAll('span').forEach(s=>s.classList.remove('on'));try{speechSynthesis.cancel()}catch{}const u=axis8101Utter(r.target,'en',.98,1);if(!u){root.classList.remove('doing');axis8101Status('当前浏览器没有可用的系统语音');return}u.onboundary=e=>{if(!line||typeof e.charIndex!=='number')return;let pos=0,chosen=null;for(const node of line.querySelectorAll('span')){const t=node.textContent||'',idx=String(r.target).indexOf(t,pos);if(idx<=e.charIndex){chosen=node;pos=Math.max(pos,idx+t.length)}else break}line.querySelectorAll('span.on').forEach(s=>s.classList.remove('on'));chosen?.classList.add('on')};u.onend=()=>{root.classList.remove('doing');line?.querySelectorAll('span.on').forEach(s=>s.classList.remove('on'));axis8101Status('很好 · 再来一次时尽量不看文字')};u.onerror=u.onend;speechSynthesis.speak(u)}
function axis8101AudioMime(){if(!window.MediaRecorder)return'';for(const t of ['audio/mp4','audio/webm;codecs=opus','audio/webm'])if(MediaRecorder.isTypeSupported?.(t))return t;return''}
async function axis8101ToggleRecord(){const q=AXIS8101_PRACTICE,b=$('#v8101Record');if(q.rec&&q.rec.state==='recording'){q.rec.stop();return}if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){axis8101Status('当前浏览器不支持页内录音；直接跟读即可');return}try{axis8101StopMic({discard:true});q.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});q.chunks=[];const mt=axis8101AudioMime();q.rec=new MediaRecorder(q.stream,mt?{mimeType:mt}:undefined);q.rec.ondataavailable=e=>{if(e.data?.size)q.chunks.push(e.data)};q.rec.onstop=()=>{try{q.stream?.getTracks?.().forEach(t=>t.stop())}catch{}q.stream=null;if(!q.discard&&q.chunks.length){const blob=new Blob(q.chunks,{type:q.rec?.mimeType||q.chunks[0].type||'audio/webm'});if(q.url)try{URL.revokeObjectURL(q.url)}catch{}q.url=URL.createObjectURL(blob);const play=$('#v8101Playback');if(play)play.hidden=false;axis8101Status('已录好 · 回听时只比较节奏和清晰度')}q.rec=null;q.chunks=[];if(b){b.classList.remove('recording');b.textContent='录下自己'}};q.discard=false;q.rec.start();if(b){b.classList.add('recording');b.textContent='结束录音'}axis8101Status('正在录 · 再点一次结束');axis8101MarkAttempt('record')}catch(err){axis8101StopMic({discard:true});axis8101Status(err?.name==='NotAllowedError'?'未获得麦克风权限 · 仍可直接跟读':'录音暂不可用 · 仍可直接跟读')}}
function axis8101Playback(){const q=AXIS8101_PRACTICE;if(!q.url)return;try{const a=new Audio(q.url);a.play().catch(()=>{})}catch{}}
function axis8101OpportunityAllowed(a,planDone){const p=axis89SpeakPrefs();if(!p?.on)return false;if(p.opportunity==='off'||p.opportunity==='rest')return false;if(a?.status==='paused')return p.opportunity==='auto'||p.opportunity==='pause';return !!planDone&&p.opportunity==='auto'}
function axis8101PaintOpportunity(el,e,a,planDone){el.classList.add('v8101Opportunity');const paused=a?.status==='paused',key=(e?.id||'active')+':opportunity:'+String(a?.pausedAt||a?.finishedAt||Date.now());el.dataset.key=key;el.dataset.restMs='0';el.setAttribute('aria-label',paused?'暂停中 · 练一轮口语':'计划完成 · 练一轮口语');el.innerHTML='<span><i></i><b>'+(paused?'暂停中 · 练一轮口语':'计划完成 · 来一轮对话')+'</b></span><small>可选 · 点开才播放 · 不影响训练</small>'}
function axis8101OpenOpportunity(el){const p=axis89SpeakPrefs(),key=el?.dataset?.key||('opportunity:'+Date.now()),x=axis810SelectPhrase(key,45000,{force:true});if(!x||!el)return;el.dataset.phraseId=x.id;el.dataset.key=key;el.dataset.restMs='0';axis891OpenSpeak(el);axis8101SetMode('dialogue')}
function axis8101Install(){axis8101Style();if(D.documentElement.dataset.axis8101Installed==='1')return;D.documentElement.dataset.axis8101Installed='1';D.addEventListener('click',e=>{if(!(e.target instanceof Element))return;const opportunity=e.target.closest('#v87Rest.v8101Opportunity');if(opportunity){e.preventDefault();e.stopPropagation();axis8101OpenOpportunity(opportunity);return}const mode=e.target.closest('#v891SpeakPanel [data-v8101-mode]');if(mode){e.preventDefault();e.stopPropagation();axis8101SetMode(mode.dataset.v8101Mode);return}const action=e.target.closest('#v891SpeakPanel [data-v8101-action]');if(!action)return;e.preventDefault();e.stopPropagation();const a=action.dataset.v8101Action;if(a==='dialogue')axis8101SpeakDialogue();else if(a==='echo')axis8101Echo();else if(a==='shadow')axis8101StartShadow();else if(a==='record')axis8101ToggleRecord();else if(a==='playback')axis8101Playback()},false);window.__AXIS_8101_PRACTICE__={version:'8.10.1',dialogue:true,echo:true,shadow:true,localRecording:true,autoplay:false,opportunity:true,storage:'axis_v89_speak-practice-counters-only'}}
`;

src=once(src,'function renderRestLine(rest,e,a,planDone){',helpers+'\nfunction renderRestLine(rest,e,a,planDone){','8.10.1 immersion helpers');
src=once(src,
"el.classList.remove('v89Speak','v891SpeakReady','v810SpeakPrompt');",
"el.classList.remove('v89Speak','v891SpeakReady','v810SpeakPrompt','v8101Opportunity');",
'opportunity class reset');
src=once(src,
"if(!rest){axis891CloseSpeak();return}",
"if(!rest){axis891CloseSpeak();if(axis8101OpportunityAllowed(a,planDone))axis8101PaintOpportunity(el,e,a,planDone);return}",
'quiet non-rest opportunity');
src=once(src,
"$('#v891SpeakMore').innerHTML=axis891PanelRows(r).map(a=>'<div><span>'+esc(a[0])+'</span><b>'+esc(a[1])+'</b></div>').join('');",
"$('#v891SpeakMore').innerHTML=axis891PanelRows(r).map(a=>'<div><span>'+esc(a[0])+'</span><b>'+esc(a[1])+'</b></div>').join('');axis8101MountPractice(panel,r,x,p);",
'practice mount on learning panel');
src=once(src,
"function axis891CloseSpeak(){const p=$('#v891SpeakPanel');if(p){p.classList.remove('show','expanded');delete p.dataset.phraseId;delete p.dataset.key}}",
"function axis891CloseSpeak(){axis8101StopPractice();const p=$('#v891SpeakPanel');if(p){p.classList.remove('show','expanded');delete p.dataset.phraseId;delete p.dataset.key}}",
'practice cleanup on close');
src=once(src,
"migrateAudio();injectAudio();axis891SpeakStyle();axis810SpeakStyle();try{injectRestSpeak()}",
"migrateAudio();injectAudio();axis891SpeakStyle();axis810SpeakStyle();axis8101Install();try{injectRestSpeak()}",
'immersion boot');

for(const needle of ['function axis8101SpeakDialogue(','function axis8101StartShadow(','function axis8101ToggleRecord(','function axis8101OpportunityAllowed(',"version:'8.10.1',dialogue:true",'data-v810-options="opportunity"'])if(!src.includes(needle))fail(`missing ${needle}`);
if(/setInterval\s*\(\s*axis8101|new\s+MutationObserver\s*\(\s*axis8101|new\s+ResizeObserver\s*\(\s*axis8101/.test(src))fail('8.10.1 practice gained forbidden persistent timer/observer ownership');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.10.1 immersion] PASS · native Settings row · dialogue · echo · shadowing · ephemeral local recording · pause/plan-done opportunities · no autoplay/geometry owner');
