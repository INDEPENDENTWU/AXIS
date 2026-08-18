import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.2 settings] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');
if(src.includes('__AXIS_8122_SETTINGS__'))fail('8.12.2 settings already installed');

const block=String.raw`
/* AXIS 8.12.2 — decisive Settings refinement. Presentation only; existing learning/service stores remain authoritative. */
function axis8122SettingsStyle(){
 if($('#v8122SettingsStyle'))return;
 const s=D.createElement('style');s.id='v8122SettingsStyle';s.textContent=
 '#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{margin:0!important;border:0!important}'+
 '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{height:60px!important;min-height:60px!important;border:0!important;border-top:0!important;border-bottom:0!important;padding:0!important}'+
 '#settingsSheet #v813LearningGate>.settingLink>span,#settingsSheet #v813ServiceGate>.settingLink>span{font-size:13px!important;font-weight:520!important;letter-spacing:0!important}'+
 '#settingsSheet #v813LearningGate>.settingLink>b,#settingsSheet #v813ServiceGate>.settingLink>b{font-size:12px!important;font-weight:620!important;letter-spacing:0!important}'+
 '#settingsSheet #v813LearningGate>.v8711Fold,#settingsSheet #v813ServiceGate>.v8711Fold{padding:2px 0 14px!important;border:0!important}'+
 '#settingsSheet .axis8122Group{padding:14px 0 8px!important;margin:0!important;border:0!important}'+
 '#settingsSheet .axis8122Group+.axis8122Group{padding-top:18px!important}'+
 '#settingsSheet .axis8122Head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;gap:14px!important;margin:0 0 11px!important}'+
 '#settingsSheet .axis8122Head>div{min-width:0!important}'+
 '#settingsSheet .axis8122Head span{display:block!important;color:var(--muted)!important;font-size:13px!important;line-height:1.35!important;font-weight:540!important;letter-spacing:0!important}'+
 '#settingsSheet .axis8122Head small{display:block!important;margin-top:4px!important;color:var(--dim)!important;font-size:11.5px!important;line-height:1.4!important;font-weight:450!important}'+
 '#settingsSheet .axis8122Head>b{align-self:start!important;color:var(--text)!important;font-size:12px!important;line-height:1.35!important;font-weight:620!important;text-align:right!important;white-space:nowrap!important}'+
 '#settingsSheet .axis8122Grid{display:grid!important;gap:9px!important;width:100%!important}'+
 '#settingsSheet .axis8122Grid.c2{grid-template-columns:repeat(2,minmax(0,1fr))!important}'+
 '#settingsSheet .axis8122Grid.c3{grid-template-columns:repeat(3,minmax(0,1fr))!important}'+
 '#settingsSheet .axis8122Grid button{min-width:0!important;width:100%!important;height:44px!important;min-height:44px!important;padding:0 10px!important;border:0!important;border-radius:13px!important;background:rgba(255,255,255,.038)!important;color:#8d95a2!important;font-size:13px!important;line-height:1!important;font-weight:590!important;text-align:center!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}'+
 '#settingsSheet .axis8122Grid button.active{background:rgba(115,124,255,.16)!important;color:#d0d2ff!important;box-shadow:inset 0 0 0 1px rgba(115,124,255,.16)!important;font-weight:660!important}'+
 '#settingsSheet .axis8122Grid button:disabled{opacity:.32!important}'+
 '#settingsSheet #v811FineTune{margin:4px 0 0!important;border:0!important}'+
 '#settingsSheet #v811FineTune>summary{height:52px!important;min-height:52px!important;padding:0!important;border:0!important;color:var(--muted)!important;font-size:13px!important}'+
 '#settingsSheet #v811FineTuneState{font-size:12px!important;color:var(--text)!important}'+
 '#settingsSheet #v811FineTuneBody{padding:0!important;margin:0!important;overflow:visible!important}'+
 '#settingsSheet .axis8122StandaloneStart{width:100%!important;height:44px!important;margin:9px 0 0!important;border:0!important;border-radius:13px!important;background:rgba(115,124,255,.12)!important;color:#c9ccff!important;font-size:13px!important;font-weight:640!important}'+
 '#settingsSheet #v813ServiceGate #v811ServicePanel{padding:0 0 8px!important}'+
 '#settingsSheet .axis8122ServiceNote{margin:9px 0 0!important;color:var(--dim)!important;font-size:11.5px!important;line-height:1.5!important}'+
 '#settingsSheet .axis8122Facts{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;margin:0!important}'+
 '#settingsSheet .axis8122Fact{min-width:0!important;min-height:64px!important;padding:11px 12px!important;border:0!important;border-radius:13px!important;background:rgba(255,255,255,.028)!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;gap:7px!important}'+
 '#settingsSheet .axis8122Fact span{color:var(--muted)!important;font-size:12px!important;line-height:1.3!important}'+
 '#settingsSheet .axis8122Fact b{color:var(--text)!important;font-size:12px!important;line-height:1.3!important;font-weight:640!important;text-align:left!important;white-space:normal!important}'+
 '#settingsSheet .axis8122Fact b.local{color:#b8bcff!important}'+
 '#settingsSheet .axis8122LegacyPrivacy{display:none!important}'+
 '#settingsSheet .v811CoreOptions.level{grid-template-columns:repeat(2,minmax(0,1fr))!important}'+
 '@media(max-width:360px){#settingsSheet .axis8122Grid{gap:7px!important}#settingsSheet .axis8122Grid button{padding:0 7px!important;font-size:12.5px!important}#settingsSheet .axis8122Facts{gap:7px!important}}';
 D.head.appendChild(s)
}
function axis8122Active(v,current){return String(v)===String(current)?' active':''}
function axis8122FineGroup(key,title,note,current,items,cols=3){
 const known=items.some(x=>String(x[0])===String(current)),state=known?(items.find(x=>String(x[0])===String(current))?.[1]||''):'自定';
 return '<section class="axis8122Group" data-v8122-fine="'+key+'"><div class="axis8122Head"><div><span>'+title+'</span><small>'+note+'</small></div><b>'+state+'</b></div><div class="axis8122Grid c'+cols+'">'+items.map(x=>'<button type="button" data-v8122-learning="'+key+'" data-v8122-value="'+x[0]+'" class="'+axis8122Active(x[0],current).trim()+'">'+x[1]+'</button>').join('')+'</div></section>'
}
function axis8122ConvergeLearning(){
 axis8122SettingsStyle();
 const gate=$('#v813LearningGate'),entry=$('#v810ConfigEntry',gate),details=$('#v811FineTune'),body=$('#v811FineTuneBody',details);if(!gate||!entry||!details||!body)return;
 const label=entry.querySelector(':scope>span');if(label)label.textContent='学习安排';
 const p=axis89SpeakPrefs();
 body.innerHTML=
  axis8122FineGroup('novelty','新旧比例','复习与新内容的平衡',p.novelty,[['review','复习'],['balanced','平衡'],['new','探索']],3)+
  axis8122FineGroup('track','内容','只保留最常用范围',p.track,[['auto','自动'],['daily','日常'],['gym','健身'],['travel','旅行']],2)+
  axis8122FineGroup('cadence','出现','决定组间出现频率',p.cadence,[['auto','智能'],['every','每次'],['long','长休']],3)+
  axis8122FineGroup('dailyTarget','日目标','每天最多接触多少',Number(p.dailyTarget)||0,[[0,'自动'],[6,'6'],[12,'12'],[20,'20']],2)+
  axis8122FineGroup('opportunity','机会学习','不抢训练主线',p.opportunity,[['auto','智能'],['pause','仅暂停'],['off','关闭']],3)+
  axis8122FineGroup('standalone','独立学习','健身之外是否出现',p.standalone,[['off','关闭'],['manual','随时'],['daily','每日']],3)+
  ((p.on&&p.standalone!=='off')?'<button type="button" class="axis8122StandaloneStart" data-v8122-standalone-start>开始一轮</button>':'');
 if(!body.dataset.v8122Bound){
  body.dataset.v8122Bound='1';
  body.addEventListener('click',e=>{const b=e.target?.closest?.('[data-v8122-learning]');if(b){e.preventDefault();e.stopPropagation();const k=b.dataset.v8122Learning,v=b.dataset.v8122Value;if(k==='novelty')axis812SavePref({novelty:v});else if(['track','cadence','dailyTarget','opportunity','standalone'].includes(k))axis810SetLearningPref(k,v);return}if(e.target?.closest?.('[data-v8122-standalone-start]')){e.preventDefault();e.stopPropagation();axis8102OpenStandalone()}},false)
 }
 const fine=$('#v811FineTuneState',details);if(fine)fine.textContent=axis812FineCustom(p)?'已自定':'';
}
const axis8122BaseLearningRender=axis810RenderSettings;
axis810RenderSettings=function(){axis8122BaseLearningRender();axis8122ConvergeLearning()};

function axis8122ScopeValue(p){const q=p.privacy||{};if(q.text===true&&q.training===false&&q.image===false&&q.audio===false)return'min';if(q.text===true&&q.training===true&&q.image===false&&q.audio===false)return'balanced';if(q.text===true&&q.training===true&&q.image===true&&q.audio===true)return'extended';return'custom'}
function axis8122ApplyScope(mode){const p=axis811ServicePrefs();if(mode==='min')p.privacy={text:true,training:false,image:false,audio:false};else if(mode==='balanced')p.privacy={text:true,training:true,image:false,audio:false};else if(mode==='extended')p.privacy={text:true,training:true,image:true,audio:true};else return;axis811SaveServicePrefs(p);axis811RenderService()}
function axis8122EnsureServiceLayout(){
 axis8122SettingsStyle();
 const gate=$('#v813ServiceGate'),entry=$('#v811ServiceEntry',gate),panel=$('#v811ServicePanel',gate),content=$('.v813ServiceContent',panel);if(!gate||!entry||!panel||!content)return null;
 const label=entry.querySelector(':scope>span');if(label)label.textContent='云端与AI';panel.setAttribute('aria-label','云端与AI');
 if(content.dataset.v8122Layout==='1')return content;
 content.dataset.v8122Layout='1';
 content.innerHTML='<section class="axis8122Group"><div class="axis8122Head"><div><span>云端同步</span><small>本机始终是第一份数据</small></div><b id="v811CloudState">未连接</b></div><div class="axis8122Grid c3" id="v811CloudMode"><button type="button" data-v811-cloud="off">关闭</button><button type="button" data-v811-cloud="data">仅数据</button><button type="button" data-v811-cloud="media">数据与媒体</button></div><p class="axis8122ServiceNote" id="v811CloudNote"></p></section><section class="axis8122Group"><div class="axis8122Head"><div><span>AXIS AI</span><small>只做增强，不接管训练</small></div><b id="v811AIState">本地能力</b></div><div class="axis8122Grid c3" id="v811AIMode"><button type="button" data-v811-ai="off">本地</button><button type="button" data-v811-ai="assist">辅助</button><button type="button" data-v811-ai="smart">智能</button></div></section><section class="axis8122Group"><div class="axis8122Head"><div><span>发送范围</span><small>一次决定可发送的数据类型</small></div><b id="v8122ScopeState">最小</b></div><div class="axis8122Grid c3" id="v8122Scope"><button type="button" data-v8122-scope="min">最小</button><button type="button" data-v8122-scope="balanced">平衡</button><button type="button" data-v8122-scope="extended">扩展</button></div><div id="v811PrivacyRows" class="axis8122LegacyPrivacy" hidden></div></section><section class="axis8122Group"><div class="axis8122Head"><div><span>能力状态</span><small>当前实际可用能力</small></div><b>实时</b></div><div class="axis8122Facts" id="v811AIFacts"></div></section>';
 content.addEventListener('click',e=>{const b=e.target?.closest?.('[data-v8122-scope]');if(!b)return;e.preventDefault();e.stopPropagation();axis8122ApplyScope(b.dataset.v8122Scope)},false);
 return content
}
function axis8122PaintService(){
 const content=axis8122EnsureServiceLayout();if(!content)return;
 const {p,ai}=axis811ServiceEffective(),scope=axis8122ScopeValue(p),scopeState=$('#v8122ScopeState',content);if(scopeState)scopeState.textContent=scope==='min'?'最小':scope==='balanced'?'平衡':scope==='extended'?'扩展':'自定';
 $$('#v8122Scope [data-v8122-scope]',content).forEach(b=>b.classList.toggle('active',b.dataset.v8122Scope===scope));
 const cap=ai?.capabilities||{},rows=[['器械识别',cap.vision?'云端 + 本地':'本地'],['训练总结',cap.insight?'云端可用':'本地证据'],['自然语音',cap.voice?'云端可用':'系统语音'],['动态对话',cap.dialogue?'云端可用':'固定课程']],facts=$('#v811AIFacts',content);if(facts)facts.innerHTML=rows.map(x=>'<div class="axis8122Fact"><span>'+x[0]+'</span><b class="'+(/本地|系统|固定/.test(x[1])?'local':'')+'">'+x[1]+'</b></div>').join('')
}
const axis8122BaseServiceRender=axis811RenderService;
axis811RenderService=function(){axis8122EnsureServiceLayout();axis8122BaseServiceRender();axis8122PaintService()};
const axis8122BaseServiceInline=axis813EnsureServiceInline;
axis813EnsureServiceInline=function(){const panel=axis8122BaseServiceInline();axis8122EnsureServiceLayout();return panel};

function axis8122ConvergeSettings(){axis8122SettingsStyle();try{axis813ConvergeSettings()}catch{}try{axis810RenderSettings()}catch{}try{axis811RenderService()}catch{}const e=$('#v811ServiceEntry');if(e){const s=e.querySelector(':scope>span');if(s)s.textContent='云端与AI'}}
axis8122ConvergeSettings();
D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(axis8122ConvergeSettings,90)},true);
try{window.__AXIS_8122_SETTINGS__={version:'8.12.2',learningFineTune:['novelty','track','cadence','dailyTarget','opportunity','standalone'],serviceGroups:['cloud','ai','scope','capabilities'],serviceScopePresets:['min','balanced','extended'],separateSheet:false,trainingOwner:false,recordingOwner:false,learningStore:'axis_v89_speak',serviceStore:AXIS811_SERVICE_KEY}}catch{}
`;

src=src.slice(0,end)+block+'\n'+src.slice(end);
for(const needle of ['云端与AI','axis8122FineGroup','axis8122ApplyScope','serviceScopePresets','recordingOwner:false'])if(!block.includes(needle))fail(`missing ${needle}`);
if(/云端与\s+AI/.test(block))fail('Cloud/AI top-level spacing regressed');
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.2 settings] PASS · reduced Learning fine-tune · four-group Cloud/AI · native Settings spacing · no new owner');
