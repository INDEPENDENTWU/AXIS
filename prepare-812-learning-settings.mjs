import fs from 'node:fs';
const FILE='v87-runtime.js',fail=m=>{throw new Error(`[AXIS 8.12 learning settings] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');const end=src.lastIndexOf('})();');if(end<0)fail('runtime IIFE end not found');
const block=String.raw`
/* AXIS 8.12 — learning schedule: five useful decisions, everything else stays progressive. */
const axis812BasePrefs=axis89SpeakPrefs;
axis89SpeakPrefs=function(){
 const p=axis812BasePrefs(),s=axis89SpeakStore(),q=s.prefs||{},legacy=q.focus==='ielts8'?'ielts':q.focus==='natural'?'native':'auto';
 return{...p,purpose:['auto','native','travel','work','gym','ielts'].includes(q.purpose)?q.purpose:legacy,method:['mixed','dialogue','listen','shadow','recall','dictation'].includes(q.method)?q.method:'mixed',dialogueDepth:['short','full','immersive'].includes(q.dialogueDepth)?q.dialogueDepth:'full',novelty:['balanced','review','new'].includes(q.novelty)?q.novelty:'balanced'}
};
function axis812SettingsStyle(){if($('#v812LearningSettingsStyle'))return;const s=D.createElement('style');s.id='v812LearningSettingsStyle';s.textContent='.v811CoreOptions.purpose,.v811CoreOptions.method{grid-template-columns:repeat(3,minmax(0,1fr))}.v811CoreOptions.dialogueDepth{grid-template-columns:repeat(3,minmax(0,1fr))}.v812FineBlock{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.045)}.v812FineBlock>div:first-child{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}.v812FineBlock span{color:#929aa7;font-size:10px}.v812FineBlock b{color:#646d79;font-size:8.8px;font-weight:560}.v812FineOptions{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.v812FineOptions button{height:34px;border-radius:10px;background:rgba(255,255,255,.035);color:#808995;font-size:9.5px}.v812FineOptions button.active{background:rgba(115,124,255,.14);color:#c8cbff}@media(max-width:380px){.v811CoreOptions.purpose,.v811CoreOptions.method{grid-template-columns:repeat(2,minmax(0,1fr))}}';D.head.appendChild(s)}
function axis812CoreValue(p,key){if(key==='purpose')return p.purpose;if(key==='method')return p.method;if(key==='intensity')return p.mode==='light'?'light':p.mode==='deep'?'deep':'standard';if(key==='level')return p.level||'adaptive';if(key==='dialogueDepth')return p.dialogueDepth||'full';return''}
function axis812CoreButtons(key,items,p){const val=axis812CoreValue(p,key);return '<div class="v811CoreOptions '+key+'">'+items.map(x=>'<button type="button" data-v812-core="'+key+'" data-v812-value="'+x[0]+'" class="'+(x[0]===val?'active':'')+'">'+x[1]+'</button>').join('')+'</div>'}
function axis812SavePref(patch,{resetCurrent=true}={}){const s=axis89SpeakStore(),p=s.prefs||(s.prefs={});Object.assign(p,patch);if(resetCurrent)s.current=null;axis89SaveSpeak(s);axis891CloseSpeak();axis810RenderSettings();try{renderNow(true)}catch{}}
function axis812ApplyCore(key,value){
 if(key==='purpose'){
  const v=['auto','native','travel','work','gym','ielts'].includes(value)?value:'auto',patch={purpose:v};
  if(v==='ielts'){patch.focus='ielts8';patch.track='auto';patch.level='advanced'}else if(v==='travel'){patch.focus='natural';patch.track='travel'}else if(v==='work'){patch.focus='natural';patch.track='work'}else if(v==='gym'){patch.focus='natural';patch.track='gym'}else if(v==='native'){patch.focus='natural';patch.track='auto'}else{patch.focus='auto';patch.track='auto'}
  axis812SavePref(patch);return
 }
 if(key==='method'){axis812SavePref({method:['mixed','dialogue','listen','shadow','recall','dictation'].includes(value)?value:'mixed'});return}
 if(key==='intensity'){
  if(value==='light')axis812SavePref({mode:'light',cadence:'auto',dailyTarget:6,opportunity:'auto'});
  else if(value==='deep')axis812SavePref({mode:'deep',cadence:'auto',dailyTarget:20,opportunity:'auto'});
  else axis812SavePref({mode:'auto',cadence:'auto',dailyTarget:0,opportunity:'auto'});return
 }
 if(key==='level'){axis812SavePref({level:['adaptive','foundation','progress','advanced'].includes(value)?value:'adaptive'});return}
 if(key==='dialogueDepth'){axis812SavePref({dialogueDepth:['short','full','immersive'].includes(value)?value:'full'});return}
}
function axis812FineCustom(p){return axis811LearningFineCustom(p)||p.novelty!=='balanced'}
function axis812ConvergeLearningSettings(){
 axis812SettingsStyle();const panel=axis810EnsureConfig(),controls=$('#v810SpeakControls',panel),core=$('#v811CoreLearning',controls),details=$('#v811FineTune',controls);if(!panel||!controls||!core||!details)return;
 const intro=panel.querySelector('.v810ConfigIntro');if(intro)intro.textContent='先决定为什么学、怎么练、练多深。其余交给 AXIS。';
 if(!core.dataset.v812Bound){core.dataset.v812Bound='1';core.addEventListener('click',e=>{const b=e.target?.closest?.('[data-v812-core]');if(!b)return;e.preventDefault();e.stopPropagation();axis812ApplyCore(b.dataset.v812Core,b.dataset.v812Value)},false)}
 const p=axis89SpeakPrefs();core.innerHTML=
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>目标</span><b>你最想先会什么</b></div>'+axis812CoreButtons('purpose',[['auto','智能'],['native','母语口语'],['travel','旅行生活'],['work','工作社交'],['gym','健身'],['ielts','IELTS']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>学法</span><b>大脑用什么方式练</b></div>'+axis812CoreButtons('method',[['mixed','混合'],['dialogue','对话'],['listen','听说'],['shadow','影子'],['recall','回想'],['dictation','听写']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>强度</span><b>每天出现多少</b></div>'+axis812CoreButtons('intensity',[['light','轻量'],['standard','标准'],['deep','深入']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>难度</span><b>表达复杂度</b></div>'+axis812CoreButtons('level',[['adaptive','自适应'],['foundation','起步'],['progress','实用'],['advanced','高阶']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>对话</span><b>一次练到多完整</b></div>'+axis812CoreButtons('dialogueDepth',[['short','短 · 4轮'],['full','完整 · 8轮'],['immersive','沉浸 · 12轮']],p)+'</div>';
 const body=$('#v811FineTuneBody',details);if(body&&!$('#v812Novelty',body)){const x=D.createElement('div');x.id='v812Novelty';x.className='v812FineBlock';x.innerHTML='<div><span>新旧比例</span><b>决定今天偏复习还是偏探索</b></div><div class="v812FineOptions"><button type="button" data-v812-novelty="review">多复习</button><button type="button" data-v812-novelty="balanced">平衡</button><button type="button" data-v812-novelty="new">多新内容</button></div>';body.prepend(x);x.addEventListener('click',e=>{const b=e.target?.closest?.('[data-v812-novelty]');if(!b)return;axis812SavePref({novelty:b.dataset.v812Novelty})})}
 $$('#v812Novelty [data-v812-novelty]').forEach(b=>b.classList.toggle('active',b.dataset.v812Novelty===p.novelty));
 const custom=axis812FineCustom(p),fine=$('#v811FineTuneState',details);if(fine)fine.textContent=custom?'已自定':'';details.open=custom;
 const labels={auto:'智能',native:'母语口语',travel:'旅行生活',work:'工作社交',gym:'健身',ielts:'IELTS'};const summary=$('#v810ConfigSummary');if(summary)summary.textContent=(labels[p.purpose]||'智能')+' · '+(p.method==='mixed'?'混合':p.method==='dialogue'?'对话':p.method==='listen'?'听说':p.method==='shadow'?'影子':p.method==='recall'?'回想':'听写')
}
const axis812BaseRenderLearningSettings=axis810RenderSettings;
axis810RenderSettings=function(){axis812BaseRenderLearningSettings();axis812ConvergeLearningSettings()};
const axis812BaseLearningPool=axis810Pool;
axis810Pool=function(p,key){
 let pool=axis812BaseLearningPool(p,key),purpose=p.purpose||'auto';
 if(purpose==='travel'){const f=pool.filter(x=>['travel','service'].includes(x.track));if(f.length)pool=f}
 else if(purpose==='work'){const f=pool.filter(x=>['work','social'].includes(x.track));if(f.length)pool=f}
 else if(purpose==='gym'){const f=pool.filter(x=>x.track==='gym');if(f.length)pool=f}
 else if(purpose==='ielts'){const f=pool.filter(x=>x.track==='ielts'||/C1/i.test(String(x.level||'')));if(f.length)pool=f}
 else if(purpose==='native'){const f=pool.filter(x=>x.track!=='ielts'&&['daily','social','native','service','travel','work','gym'].includes(x.track||'daily'));if(f.length)pool=f}
 const seen=axis89SpeakStore().seen||{};
 if(p.novelty==='new'){const f=pool.filter(x=>!seen[x.id]);if(f.length>=12)pool=f}
 else if(p.novelty==='review'){const f=pool.filter(x=>seen[x.id]);if(f.length>=6)pool=f}
 return pool
};
const axis812BasePracticeMount=axis8101MountPractice;
axis8101MountPractice=function(panel,r,x,p){
 const pref=axis89SpeakPrefs();if(pref.method==='dialogue')AXIS8101_PRACTICE.mode='dialogue';else if(pref.method==='listen')AXIS8101_PRACTICE.mode='echo';else if(pref.method==='shadow')AXIS8101_PRACTICE.mode='shadow';
 axis812BasePracticeMount(panel,r,x,p);const lab=$('#v812MethodLab',panel),out=$('#v812MethodResult',lab);if(!lab||!out)return;
 if(pref.method==='recall'){out.textContent=lab.dataset.recall;lab.querySelector('[data-v812-method="recall"]')?.classList.add('active')}
 else if(pref.method==='dictation'){out.textContent='听写 · 先只听整句，不看文本；第二遍写下来；第三遍才核对弱读、词尾和拼写。';}
};
try{window.__AXIS_812_LEARNING_SETTINGS__={version:'8.12',visibleCore:['purpose','method','intensity','level','dialogueDepth'],purposes:['auto','native','travel','work','gym','ielts'],methods:['mixed','dialogue','listen','shadow','recall','dictation'],dialogueDepth:{short:4,full:8,immersive:12},fineTune:['novelty','track','cadence','dailyTarget','opportunity'],legacyPrefsPreserved:true,trainingOwner:false}}catch{}
`;
src=src.slice(0,end)+block+'\n'+src.slice(end);try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12 learning settings] PASS · purpose + method + intensity + difficulty + dialogue depth · new/review ratio remains fine-tune');
