import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 learning simplify] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');
if(src.includes('__AXIS_8123_LEARNING__'))fail('8.12.3 learning simplification already installed');

const block=String.raw`
/* AXIS 8.12.3 — one Settings rhythm + simple listen / record / replay learning surface. */
function axis8123Style(){
 if($('#v8123Style'))return;
 const s=D.createElement('style');s.id='v8123Style';s.textContent=
 '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{height:60px!important;min-height:60px!important;padding:0 28px!important;border:0!important;background:transparent!important}'+
 '#settingsSheet #v813LearningGate>.settingLink>span,#settingsSheet #v813ServiceGate>.settingLink>span{font-size:13px!important;font-weight:520!important;letter-spacing:0!important}'+
 '#settingsSheet #v813LearningGate>.settingLink>b,#settingsSheet #v813ServiceGate>.settingLink>b{font-size:12px!important;font-weight:620!important;letter-spacing:0!important}'+
 '#settingsSheet #v813LearningGate>.v8711Fold,#settingsSheet #v813ServiceGate>.v8711Fold{border:0!important}'+
 '#settingsSheet .v811CoreHead{display:block!important;margin:0 0 10px!important}'+
 '#settingsSheet .v811CoreHead>b,#settingsSheet .axis8122Head small,#settingsSheet .axis8122ServiceNote{display:none!important}'+
 '#settingsSheet .v811CoreGroup{padding:16px 0 8px!important;border:0!important}'+
 '#settingsSheet .v811CoreGroup+.v811CoreGroup{padding-top:20px!important}'+
 '#settingsSheet .v811CoreHead>span{font-size:13px!important;line-height:1.35!important;font-weight:540!important;color:var(--muted)!important}'+
 '#settingsSheet .v811CoreOptions{gap:10px!important}'+
 '#settingsSheet .v811CoreOptions button{height:44px!important;min-height:44px!important;border-radius:13px!important;font-size:13px!important;font-weight:590!important}'+
 '#settingsSheet .v811CoreOptions.level{grid-template-columns:repeat(2,minmax(0,1fr))!important}'+
 '#settingsSheet .axis8122Head{margin-bottom:10px!important}'+
 '#settingsSheet .axis8122Head span{font-size:13px!important;line-height:1.35!important;font-weight:540!important}'+
 '#settingsSheet .axis8122Group{padding-top:16px!important}'+
 '#settingsSheet #v811FineTune>summary{border:0!important}'+
 '.axis8123Practice{margin-top:14px!important;padding-top:14px!important;border-top:1px solid rgba(255,255,255,.055)!important}'+
 '.axis8123PracticeActions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:9px!important}'+
 '.axis8123PracticeActions button{height:44px!important;min-width:0!important;border:0!important;border-radius:13px!important;background:rgba(255,255,255,.04)!important;color:#a9b0bc!important;font-size:12.5px!important;font-weight:620!important;text-align:center!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}'+
 '.axis8123PracticeActions button.primary{background:rgba(115,124,255,.15)!important;color:#d0d2ff!important}'+
 '.axis8123PracticeActions button.recording{background:rgba(227,130,123,.12)!important;color:#e6b0ab!important}'+
 '.axis8123PracticeActions button:disabled{opacity:.36!important}'+
 '.axis8123PracticeStatus{min-height:18px;margin-top:7px;color:#727b88;font-size:10.5px;line-height:1.4}'+
 '@media(max-width:380px){#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{padding-left:28px!important;padding-right:28px!important}.axis8123PracticeActions{gap:7px!important}.axis8123PracticeActions button{font-size:12px!important}}';
 D.head.appendChild(s)
}

function axis8123FineGroup(key,title,note,current,items,cols=3){
 const known=items.some(x=>String(x[0])===String(current)),state=known?(items.find(x=>String(x[0])===String(current))?.[1]||''):'自定';
 return '<section class="axis8122Group" data-v8122-fine="'+key+'"><div class="axis8122Head"><div><span>'+title+'</span></div><b>'+state+'</b></div><div class="axis8122Grid c'+cols+'">'+items.map(x=>'<button type="button" data-v8122-learning="'+key+'" data-v8122-value="'+x[0]+'" class="'+(String(x[0])===String(current)?'active':'')+'">'+x[1]+'</button>').join('')+'</div></section>'
}
axis8122FineGroup=axis8123FineGroup;

function axis8123RenderLearningCore(){
 axis8123Style();
 const core=$('#v811CoreLearning'),summary=$('#v810ConfigSummary');if(!core)return;
 const p=axis89SpeakPrefs();
 core.innerHTML=
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>目标</span></div>'+axis812CoreButtons('purpose',[['auto','智能'],['native','母语口语'],['travel','旅行生活'],['work','工作社交'],['gym','健身'],['ielts','IELTS']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>强度</span></div>'+axis812CoreButtons('intensity',[['light','轻量'],['standard','标准'],['deep','深入']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>难度</span></div>'+axis812CoreButtons('level',[['adaptive','自适应'],['foundation','起步'],['progress','实用'],['advanced','高阶']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>对话</span></div>'+axis812CoreButtons('dialogueDepth',[['short','短 · 4轮'],['full','完整 · 8轮'],['immersive','沉浸 · 12轮']],p)+'</div>';
 const labels={auto:'智能',native:'母语口语',travel:'旅行生活',work:'工作社交',gym:'健身',ielts:'IELTS'};if(summary)summary.textContent=labels[p.purpose]||'智能';
 try{const d=window.__AXIS_812_LEARNING_SETTINGS__;if(d){d.visibleCore=['purpose','intensity','level','dialogueDepth'];d.methods=[];d.methodRetired=true}}catch{}
}
function axis8123CleanService(){
 axis8123Style();const entry=$('#v811ServiceEntry');if(entry){const label=entry.querySelector(':scope>span');if(label)label.textContent='云端与AI'}
 $$('#v813ServiceGate .axis8122Head small,#v813ServiceGate .axis8122ServiceNote').forEach(e=>e.remove());
}
const axis8123BaseLearningRender=axis810RenderSettings;
axis810RenderSettings=function(){axis8123BaseLearningRender();axis8123RenderLearningCore();axis8123CleanService()};
const axis8123BaseServiceRender=axis811RenderService;
axis811RenderService=function(){axis8123BaseServiceRender();axis8123CleanService()};

function axis8123Status(text=''){
 const e=$('#v8101PracticeStatus');if(!e)return;
 const t=String(text||'');
 e.textContent=/正在录/.test(t)?'录音中':/已录好/.test(t)?'已录好':/麦克风权限/.test(t)?'需要麦克风权限':/不支持.*录音|录音暂不可用/.test(t)?'录音暂不可用':''
}
function axis8123ListenOriginal(){
 const r=axis8101Rich();if(!r?.target)return;axis8123Status('');
 const lang=typeof axis8103Lang==='function'?axis8103Lang():'en',rate=typeof axis8103Rate==='function'?axis8103Rate(lang,'natural'):.98,u=axis8101Utter(r.target,lang,rate,1);if(!u)return;
 try{speechSynthesis.cancel()}catch{};u.onend=()=>axis8123Status('');u.onerror=u.onend;speechSynthesis.speak(u)
}
async function axis8123ToggleRecord(){
 const q=AXIS8101_PRACTICE,b=$('#v8101Record'),play=$('#v8101Playback');
 if(q.rec&&q.rec.state==='recording'){q.rec.stop();return}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){axis8123Status('录音暂不可用');return}
 try{
  axis8101StopMic({discard:true});q.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});q.chunks=[];const mt=axis8101AudioMime();q.rec=new MediaRecorder(q.stream,mt?{mimeType:mt}:undefined);
  q.rec.ondataavailable=e=>{if(e.data?.size)q.chunks.push(e.data)};
  q.rec.onstop=()=>{try{q.stream?.getTracks?.().forEach(t=>t.stop())}catch{}q.stream=null;if(!q.discard&&q.chunks.length){const blob=new Blob(q.chunks,{type:q.rec?.mimeType||q.chunks[0].type||'audio/webm'});if(q.url)try{URL.revokeObjectURL(q.url)}catch{}q.url=URL.createObjectURL(blob);if(play){play.disabled=false;play.hidden=false}axis8123Status('已录好')}q.rec=null;q.chunks=[];if(b){b.classList.remove('recording');b.textContent='录音'}};
  q.discard=false;q.rec.start();if(b){b.classList.add('recording');b.textContent='结束'}axis8123Status('正在录')
 }catch(err){axis8101StopMic({discard:true});if(b)b.textContent='录音';axis8123Status(err?.name==='NotAllowedError'?'麦克风权限':'录音暂不可用')}
}
function axis8123Playback(){const q=AXIS8101_PRACTICE;if(!q.url)return;try{const a=new Audio(q.url);a.play().catch(()=>{})}catch{}}
function axis8123MountPractice(panel,r,x,p){
 axis8123Style();let root=$('#v8101Practice',panel);if(!root){root=D.createElement('div');root.id='v8101Practice';panel.querySelector('.v891SpeakActions')?.before(root)}
 root.className='v8101Practice axis8123Practice';root.innerHTML='<div class="axis8123PracticeActions"><button type="button" class="primary" data-v8123-action="listen">听原声</button><button type="button" id="v8101Record" data-v8123-action="record">录音</button><button type="button" id="v8101Playback" data-v8123-action="playback" disabled>听我的</button></div><div class="axis8123PracticeStatus" id="v8101PracticeStatus" aria-live="polite"></div>';
 $('#v812MethodLab',panel)?.remove();axis8123Status('')
}
axis8101MountPractice=axis8123MountPractice;
D.addEventListener('click',e=>{const b=e.target instanceof Element?e.target.closest('#v891SpeakPanel [data-v8123-action]'):null;if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.v8123Action;if(a==='listen')axis8123ListenOriginal();else if(a==='record')axis8123ToggleRecord();else if(a==='playback')axis8123Playback()},false);

function axis8123Converge(){axis8123Style();try{axis813ConvergeSettings()}catch{}try{axis810RenderSettings()}catch{}try{axis811RenderService()}catch{}try{const d=window.__AXIS_8101_PRACTICE__;if(d){d.dialogue=false;d.echo=false;d.shadow=false;d.simpleAudio=true}const v=window.__AXIS_8103_VOICE__;if(v){v.echo='retired';v.shadow='retired';v.ab=false}}catch{}}
axis8123Converge();
D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(axis8123Converge,100)},true);
try{window.__AXIS_8123_LEARNING__={version:'8.12.3',settingsMethod:false,listenOriginal:true,localRecording:true,localPlayback:true,echo:false,shadow:false,ab:false,upload:false,autoplay:false,trainingOwner:false,learningStore:'axis_v89_speak'}}catch{}
`;

src=src.slice(0,end)+block+'\n'+src.slice(end);
for(const needle of ['__AXIS_8123_LEARNING__','axis8101MountPractice=axis8123MountPractice','settingsMethod:false','shadow:false','ab:false'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 learning simplify] PASS · native Settings alignment · method retired · listen / record / replay only · no current shadow/A-B owner');
