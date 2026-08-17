import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.13 settings convergence] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');

const block=String.raw`
/* AXIS 8.13 — Settings convergence. Learning + Cloud/AI stay inside the canonical Settings sheet. */
function axis813SettingsStyle(){
 if($('#v813SettingsStyle'))return;
 const s=D.createElement('style');s.id='v813SettingsStyle';s.textContent=
 '#settingsSheet .v813SettingsGate{margin-top:0;border-top:1px solid var(--line)}'+
 '#settingsSheet .v813SettingsGate>.settingLink{height:54px!important;min-height:54px!important;padding:0!important;border:0!important;border-bottom:1px solid var(--line2)!important;background:transparent!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto 16px!important;align-items:center!important;gap:10px!important;text-align:left!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>span{min-width:0;color:var(--muted)!important;font-size:var(--axis-ui)!important;font-weight:520!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>b{max-width:48vw;color:var(--text)!important;font-size:var(--axis-ui)!important;font-weight:620!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:right!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>i{font-style:normal!important;color:var(--dim)!important;font-size:18px!important;line-height:1!important;text-align:right!important;transition:transform .18s ease!important}'+
 '#settingsSheet .v813SettingsGate.open>.settingLink>i{transform:rotate(90deg)}'+
 '#settingsSheet .v813SettingsGate>.v8711Fold{display:none;padding:0 0 7px!important}#settingsSheet .v813SettingsGate.open>.v8711Fold{display:block}'+
 '#v813LearningGate #v810ConfigPanel{position:static!important;inset:auto!important;z-index:auto!important;display:block!important;background:transparent!important;padding:0!important}'+
 '#v813LearningGate .v810SpeakControls{padding:0 0 2px!important}#v813LearningGate .v811CoreLearning{padding:0!important}'+
 '#v813LearningGate .v811CoreGroup{padding:10px 0!important;border-bottom:1px solid rgba(255,255,255,.045)!important}'+
 '#v813LearningGate .v811CoreHead{margin-bottom:7px!important;gap:10px!important}#v813LearningGate .v811CoreHead span{font-size:10.5px!important;color:#9ca4b0!important}#v813LearningGate .v811CoreHead b{font-size:8.6px!important;color:#626b78!important}'+
 '#v813LearningGate .v811CoreOptions{gap:5px!important}#v813LearningGate .v811CoreOptions button{height:32px!important;border-radius:9px!important;padding:0 5px!important;font-size:9.3px!important;font-weight:630!important}'+
 '#v813LearningGate #v811FineTune{margin:3px 0 0!important;border-bottom:1px solid rgba(255,255,255,.045)!important}#v813LearningGate #v811FineTune>summary{min-height:40px!important;font-size:10px!important}'+
 '#v813LearningGate #v811FineTune .v810SpeakBlock,#v813LearningGate .v812FineBlock{padding:9px 0!important}#v813LearningGate .v810SpeakBlock>div:first-child{margin-bottom:7px!important}'+
 '#v813LearningGate .v810Options,#v813LearningGate .v812FineOptions{gap:5px!important}#v813LearningGate .v810Options button,#v813LearningGate .v812FineOptions button{height:31px!important;border-radius:9px!important;font-size:9px!important}'+
 '#v813LearningGate .v810Progress{padding:9px 0 1px!important}#v813LearningGate .v810Progress span{font-size:9px!important}#v813LearningGate .v810Progress button{height:31px!important;border-radius:9px!important;padding:0 10px!important;font-size:9.5px!important}'+
 '#v813ServiceGate #v811ServicePanel{display:block!important;position:static!important;inset:auto!important;z-index:auto!important;background:transparent!important;padding:0!important;pointer-events:none!important}#v813ServiceGate .v813ServiceContent{pointer-events:auto!important}'+
 '#v813ServiceGate .v813ServiceBlock{padding:10px 0;border-bottom:1px solid rgba(255,255,255,.045)}#v813ServiceGate .v813ServiceHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:7px}#v813ServiceGate .v813ServiceHead span{color:#9ca4b0;font-size:10.5px}#v813ServiceGate .v813ServiceHead b{color:#68717e;font-size:8.8px;font-weight:560}'+
 '#v813ServiceGate .v811ServiceSeg{gap:5px!important}#v813ServiceGate .v811ServiceSeg button{height:32px!important;border-radius:9px!important;font-size:9.3px!important}#v813ServiceGate .v811ServiceNote{margin-top:7px!important;font-size:8.8px!important;line-height:1.45!important}'+
 '#v813ServiceGate .v813ServiceDetails{border-bottom:1px solid rgba(255,255,255,.045)}#v813ServiceGate .v813ServiceDetails>summary{list-style:none;min-height:40px;display:flex;align-items:center;justify-content:space-between;gap:12px;color:#89919d;font-size:9.8px;cursor:pointer}#v813ServiceGate .v813ServiceDetails>summary::-webkit-details-marker{display:none}#v813ServiceGate .v813ServiceDetails>summary:after{content:"＋";color:#626b78;font-size:13px}#v813ServiceGate .v813ServiceDetails[open]>summary:after{content:"−"}'+
 '#v813ServiceGate .v811ServiceFacts{margin-top:0!important}#v813ServiceGate .v811ServiceFact{min-height:33px!important;font-size:9px!important}#v813ServiceGate .v811PrivacyRow{min-height:35px!important}#v813ServiceGate .v811PrivacyRow span{font-size:9px!important}#v813ServiceGate .v811PrivacyRow button{height:27px!important;min-width:52px!important;border-radius:8px!important;font-size:8.6px!important}'+
 '@media(max-width:380px){#settingsSheet .v813SettingsGate>.settingLink>b{max-width:42vw}#v813LearningGate .v811CoreOptions.purpose,#v813LearningGate .v811CoreOptions.method{grid-template-columns:repeat(3,minmax(0,1fr))!important}}';
 D.head.appendChild(s)
}
function axis813SetGate(gate,open){if(!gate)return false;gate.classList.toggle('open',!!open);gate.querySelector(':scope>.settingLink')?.setAttribute('aria-expanded',open?'true':'false');return !!open}
function axis813ToggleGate(gate){return axis813SetGate(gate,!gate?.classList.contains('open'))}

const axis813BaseEnsureLearningConfig=axis810EnsureConfig;
function axis813EnsureLearningInline(){
 axis813SettingsStyle();
 const box=$('#v89SpeakSettings');if(!box)return null;
 let entry=$('#v810ConfigEntry',box);
 if(!entry){entry=D.createElement('button');entry.type='button';entry.id='v810ConfigEntry';entry.className='v810ConfigEntry';entry.innerHTML='<span><b>学习安排</b><small id="v810ConfigSummary"></small></span><i>›</i>';box.appendChild(entry)}
 let gate=$('#v813LearningGate');
 if(!gate){
  const clean=entry.cloneNode(true);entry.replaceWith(clean);entry=clean;
  gate=D.createElement('div');gate.id='v813LearningGate';gate.className='v8711SettingGate v813SettingsGate';
  entry.parentNode.insertBefore(gate,entry);gate.appendChild(entry);entry.className='settingLink';entry.innerHTML='<span>学习安排</span><b id="v810ConfigSummary"></b><i>›</i>';entry.setAttribute('aria-expanded','false');
  const fold=D.createElement('div');fold.className='v8711Fold';fold.id='v813LearningFold';gate.appendChild(fold);
  entry.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();axis810OpenConfig()},false)
 }
 let panel=$('#v810ConfigPanel');
 if(panel&&!gate.contains(panel)){
  const controls=$('#v810SpeakControls',panel);panel.remove();panel=D.createElement('div');panel.id='v810ConfigPanel';panel.className='v813InlineSettingsPanel';if(controls)panel.appendChild(controls);$('#v813LearningFold')?.appendChild(panel)
 }
 if(!panel){
  const legacy=axis813BaseEnsureLearningConfig();const controls=$('#v810SpeakControls',legacy);legacy?.remove();panel=D.createElement('div');panel.id='v810ConfigPanel';panel.className='v813InlineSettingsPanel';if(controls)panel.appendChild(controls);$('#v813LearningFold')?.appendChild(panel)
 }
 return panel
}
axis810EnsureConfig=function(){return axis813EnsureLearningInline()};
axis810OpenConfig=function(){const panel=axis813EnsureLearningInline();if(!panel)return;axis810RenderSettings();axis813ToggleGate($('#v813LearningGate'))};
axis810CloseConfig=function(){axis813SetGate($('#v813LearningGate'),false)};

const axis813BaseEnsureServicePanel=axis811EnsureServicePanel;
function axis813EnsureServiceInline(){
 axis813SettingsStyle();axis811EnsureServiceEntry();
 const entry=$('#v811ServiceEntry');if(!entry)return null;
 let gate=$('#v813ServiceGate');
 if(!gate){
  gate=D.createElement('div');gate.id='v813ServiceGate';gate.className='v8711SettingGate v813SettingsGate';entry.parentNode.insertBefore(gate,entry);gate.appendChild(entry);entry.setAttribute('aria-expanded','false');
  const fold=D.createElement('div');fold.className='v8711Fold';fold.id='v813ServiceFold';gate.appendChild(fold)
 }
 const old=$('#v811ServicePanel');if(old&&!gate.contains(old))old.remove();
 let panel=$('#v811ServicePanel',gate);if(panel)return panel;
 panel=D.createElement('div');panel.id='v811ServicePanel';panel.className='v813InlineServicePanel';panel.innerHTML='<div class="v813ServiceContent"><div class="v813ServiceBlock"><div class="v813ServiceHead"><span>云端同步</span><b id="v811CloudState">未连接</b></div><div class="v811ServiceSeg" id="v811CloudMode"><button data-v811-cloud="off">关闭</button><button data-v811-cloud="data">仅数据</button><button data-v811-cloud="media">数据 + 媒体</button></div><div class="v811ServiceNote" id="v811CloudNote">训练与学习始终先保存在本机。</div></div><div class="v813ServiceBlock"><div class="v813ServiceHead"><span>AXIS AI</span><b id="v811AIState">本地能力</b></div><div class="v811ServiceSeg" id="v811AIMode"><button data-v811-ai="off">关闭</button><button data-v811-ai="assist">辅助</button><button data-v811-ai="smart">智能</button></div></div><details class="v813ServiceDetails"><summary>能力状态</summary><div class="v811ServiceFacts" id="v811AIFacts"></div></details><details class="v813ServiceDetails"><summary>发送范围</summary><div id="v811PrivacyRows"></div></details></div>';
 $('#v813ServiceFold')?.appendChild(panel);return panel
}
axis811EnsureServicePanel=function(){return axis813EnsureServiceInline()};
axis811OpenService=function(){const panel=axis813EnsureServiceInline();if(!panel)return;const gate=$('#v813ServiceGate'),opening=!gate.classList.contains('open');axis813SetGate(gate,opening);axis811RenderService();if(opening&&!AXIS811_SERVICE_STATUS.loaded)axis811LoadServiceStatus()};
axis811CloseService=function(){axis813SetGate($('#v813ServiceGate'),false)};

function axis813ConvergeSettings(){
 axis813SettingsStyle();axis813EnsureLearningInline();axis813EnsureServiceInline();
 try{axis810RenderSettings()}catch{}
 try{axis811RenderService()}catch{}
 const learning=$('#v813LearningGate'),service=$('#v813ServiceGate');
 if(learning&&service&&learning.parentNode===service.parentNode&&learning.nextElementSibling!==service){learning.after(service)}
}
axis813ConvergeSettings();
D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(axis813ConvergeSettings,80)},true);
try{window.__AXIS_813_SETTINGS__={version:'8.13-settings-convergence',owner:'canonical-settings-inline',learningInline:true,serviceInline:true,separateLearningSheet:false,separateServiceSheet:false,learningStore:'axis_v89_speak',serviceStore:AXIS811_SERVICE_KEY,trainingOwner:false,userInvokedServiceNetwork:true}}catch{}
`;

src=src.slice(0,end)+block+'\n'+src.slice(end);
if(/v813SettingsGate[^\n]*position\s*:\s*fixed/.test(block))fail('converged settings regained fixed positioning');
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.13 settings convergence] PASS · Learning + Cloud/AI inline Settings folds · compact progressive disclosure · stores/owners preserved');
