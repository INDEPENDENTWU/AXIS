import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 learning settings] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');
const block=String.raw`
/* AXIS 8.11 — converged learning schedule. Existing controls remain under progressive disclosure. */
function axis811SettingsStyle(){
 if($('#v811LearningSettingsStyle'))return;
 const s=D.createElement('style');s.id='v811LearningSettingsStyle';s.textContent=
 '.v811CoreLearning{padding:3px 0 6px}.v811CoreGroup{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.05)}'+
 '.v811CoreHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}.v811CoreHead span{color:#a8afba;font-size:12px}.v811CoreHead b{color:#66707e;font-size:9px;font-weight:560}'+
 '.v811CoreOptions{display:grid;gap:6px}.v811CoreOptions.goal,.v811CoreOptions.intensity{grid-template-columns:repeat(3,minmax(0,1fr))}.v811CoreOptions.level{grid-template-columns:repeat(4,minmax(0,1fr))}'+
 '.v811CoreOptions button{height:37px;min-width:0;padding:0 7px;border-radius:11px;background:rgba(255,255,255,.035);color:#808995;font-size:10px;font-weight:650;white-space:nowrap}'+
 '.v811CoreOptions button.active{background:rgba(115,124,255,.15);color:#c8cbff;box-shadow:inset 0 0 0 1px rgba(115,124,255,.10)}'+
 '#v811FineTune{margin:8px 0 2px;border-bottom:1px solid rgba(255,255,255,.045)}#v811FineTune summary{list-style:none;min-height:46px;display:flex;align-items:center;justify-content:space-between;gap:12px;color:#8f97a4;font-size:11px;cursor:pointer}'+
 '#v811FineTune summary::-webkit-details-marker{display:none}#v811FineTune summary:after{content:"＋";color:#626b78;font-size:15px;font-weight:400}#v811FineTune[open] summary:after{content:"−"}#v811FineTune summary b{font-size:9px;color:#626b78;font-weight:560;margin-left:auto}'+
 '#v811FineTune .v810SpeakBlock{padding:12px 0}.v811FineIntro{color:#68717e;font-size:9.5px;line-height:1.5;padding:9px 0 2px}'+
 '@media(max-width:380px){.v811CoreOptions.level{grid-template-columns:repeat(2,minmax(0,1fr))}}';
 D.head.appendChild(s)
}
function axis811LearningFineCustom(p){
 return p.track!=='auto'||p.cadence!=='auto'||Number(p.dailyTarget)>0||p.opportunity!=='auto'||p.mode==='standard'
}
function axis811CoreValue(p,key){
 if(key==='focus')return p.focus||'auto';
 if(key==='intensity')return p.mode==='light'?'light':p.mode==='deep'?'deep':'adaptive';
 if(key==='level')return p.level||'adaptive';
 return''
}
function axis811CoreButtons(key,items,p){
 const val=axis811CoreValue(p,key);
 return '<div class="v811CoreOptions '+(key==='focus'?'goal':key)+'">'+items.map(x=>'<button type="button" data-v811-core="'+key+'" data-v811-value="'+x[0]+'" class="'+(x[0]===val?'active':'')+'">'+x[1]+'</button>').join('')+'</div>'
}
function axis811ApplyCore(key,value){
 const s=axis89SpeakStore(),p=s.prefs||(s.prefs={});
 if(key==='focus'){
  p.focus=['auto','natural','ielts8'].includes(value)?value:'auto';p.track='auto';
  if(value==='ielts8')p.level='advanced';else if(p.level==='advanced'&&value==='auto')p.level='adaptive'
 }else if(key==='intensity'){
  if(value==='light'){p.mode='light';p.cadence='auto';p.dailyTarget=6;p.opportunity='auto'}
  else if(value==='deep'){p.mode='deep';p.cadence='auto';p.dailyTarget=20;p.opportunity='auto'}
  else{p.mode='auto';p.cadence='auto';p.dailyTarget=0;p.opportunity='auto'}
 }else if(key==='level'){
  p.level=['adaptive','foundation','progress','advanced'].includes(value)?value:'adaptive'
 }else return;
 s.current=null;axis89SaveSpeak(s);axis891CloseSpeak();axis810RenderSettings();try{renderNow(true)}catch{}
}
function axis811ConvergeLearningSettings(){
 axis811SettingsStyle();
 const panel=axis810EnsureConfig(),controls=$('#v810SpeakControls',panel);if(!panel||!controls)return;
 const intro=panel.querySelector('.v810ConfigIntro');if(intro){intro.textContent='默认只需要选目标、强度和难度。';intro.classList.add('v811FineIntro')}
 let core=$('#v811CoreLearning',controls);
 if(!core){
  core=D.createElement('div');core.id='v811CoreLearning';core.className='v811CoreLearning';
  controls.prepend(core);
  core.addEventListener('click',e=>{const b=e.target?.closest?.('[data-v811-core]');if(!b)return;e.preventDefault();e.stopPropagation();axis811ApplyCore(b.dataset.v811Core,b.dataset.v811Value)},false)
 }
 let details=$('#v811FineTune',controls);
 if(!details){
  details=D.createElement('details');details.id='v811FineTune';
  details.innerHTML='<summary><span>细调</span><b id="v811FineTuneState"></b></summary><div id="v811FineTuneBody"></div>';
  const progress=controls.querySelector('.v810Progress');if(progress)controls.insertBefore(details,progress);else controls.appendChild(details);
  const body=$('#v811FineTuneBody',details);
  [...controls.querySelectorAll(':scope > .v810SpeakBlock')].forEach(x=>body.appendChild(x))
 }
 const p=axis89SpeakPrefs(),custom=axis811LearningFineCustom(p);
 core.innerHTML=
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>目标</span><b>你要得到什么</b></div>'+axis811CoreButtons('focus',[['auto','智能'],['natural','真实口语'],['ielts8','IELTS 8+']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>强度</span><b>一天出现多少</b></div>'+axis811CoreButtons('intensity',[['light','轻量'],['adaptive','自适应'],['deep','深入']],p)+'</div>'+
  '<div class="v811CoreGroup"><div class="v811CoreHead"><span>难度</span><b>内容复杂度</b></div>'+axis811CoreButtons('level',[['adaptive','自适应'],['foundation','起步'],['progress','实用'],['advanced','高阶']],p)+'</div>';
 const fine=$('#v811FineTuneState',details);if(fine)fine.textContent=custom?'已自定':'';
 /* Fresh/default users see three decisions only. Existing/custom users keep their exact old controls immediately visible. */
 details.open=custom;
 const summary=$('#v810ConfigSummary');if(summary)summary.textContent=p.focus==='ielts8'?'IELTS 8+':p.focus==='natural'?'真实口语':'智能';
}
const axis811BaseRenderLearningSettings=axis810RenderSettings;
axis810RenderSettings=function(){axis811BaseRenderLearningSettings();axis811ConvergeLearningSettings()};
try{window.__AXIS_811_LEARNING_SETTINGS__={version:'8.11-candidate',visibleCore:['goal','intensity','level'],fineTunePreserves:['mode','track','cadence','level','dailyTarget','opportunity'],defaultFineTuneCollapsed:true,customFineTuneVisible:true,legacyPrefsPreserved:true,trainingOwner:false}}catch{}
`;
src=src.slice(0,end)+block+'\n'+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.11 learning settings] PASS · 3 core decisions by default · custom/legacy fine-tune remains immediately usable');
