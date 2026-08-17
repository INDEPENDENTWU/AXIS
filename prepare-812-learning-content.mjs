import fs from 'node:fs';
import {auditAxis812,AXIS812_FAMILIES,AXIS812_TURNS} from './lib/learning-studio-812.mjs';

const FILE='v87-runtime.js',fail=m=>{throw new Error(`[AXIS 8.12 Language Studio] ${m}`)};
const audit=auditAxis812();
for(const lang of ['en','ja','ko','zh'])if(audit.newByLanguage[lang]!==4896)fail(`${lang} corpus count ${audit.newByLanguage[lang]}`);
if(audit.totalNew!==19584)fail(`new corpus total ${audit.totalNew}`);
if(Object.values(audit.tailPairMax).some(n=>n>40))fail(`dialogue tail distribution ${JSON.stringify(audit.tailPairMax)}`);

let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');if(end<0)fail('runtime IIFE end not found');
const studioSource=fs.readFileSync('lib/learning-studio-812.mjs','utf8');
const from=studioSource.indexOf("export const AXIS812_VERSION=");
const to=studioSource.indexOf('export function auditAxis812');
if(from<0||to<0||to<=from)fail('cannot extract browser-safe Language Studio source');
const browserCore=studioSource.slice(from,to).replaceAll('export const ','const ').replaceAll('export function ','function ');
const block=String.raw`
/* AXIS 8.12 — Language Studio: native-first corpus + non-repeating complete dialogue + active learning loop. */
const AXIS812_STUDIO=(()=>{'use strict';
__AXIS812_BROWSER_CORE__
return{version:AXIS812_VERSION,build:buildAxis812NativeStudio,turns:AXIS812_TURNS,conversation,extension}
})();
const AXIS812_CACHE=Object.create(null);
function axis812StudioUnits(lang){lang=['en','ja','ko','zh'].includes(lang)?lang:'en';return AXIS812_CACHE[lang]||(AXIS812_CACHE[lang]=AXIS812_STUDIO.build(lang))}
const axis812BasePool=axis891Pool;
axis891Pool=function(lang){const base=axis812BasePool(lang),extra=axis812StudioUnits(lang);return base.concat(extra)};
const axis812BasePhrase=axis891Phrase;
axis891Phrase=function(id){const old=axis812BasePhrase(id);if(old)return old;const m=String(id||'').match(/^(en|ja|ko|zh)812-/);if(!m)return null;return axis812StudioUnits(m[1]).find(x=>x.id===id)||null};
function axis812LegacyLesson(r){
 const target=String(r?.target||''),words=target.split(/\s+/),cloze=words.length>2?words.map((w,i)=>i===Math.floor(words.length*.62)?'＿＿＿':w).join(' '):target;
 return{method:'meaning-noticing-retrieval-response-shadow-transform-review',intent:r?.scenario||'把这句话放回真实互动里',notice:r?.nativeNote||r?.connected||'先注意真实说话时的信息顺序和语气。',contrast:r?.alt?('自然表达 · '+target+'\n换一种说法 · '+r.alt):('自然表达 · '+target),cloze,recall:'不看原句，只看场景和意思，把这句话完整说出来。',respond:r?.followup||r?.response||'接住对方下一句，不要只复述目标句。',transform:'把人物、时间、条件或态度换成你今天真实会遇到的版本，再说一次。',trap:r?.mistake||'不要逐词翻译；先保留意图、语块和真实语气。',steps:['看懂意图','注意母语差异','盲回想','接下一句','影子跟读','换条件再说','隔天复现']}
}
function axis812ConversationFor(r){
 const p=axis89SpeakPrefs(),lang=['en','ja','ko','zh'].includes(r?.lang)?r.lang:(p.target||'en'),id=String(r?.id||r?.target||'axis812');
 let base=Array.isArray(r?.conversation)&&r.conversation.length>=8?r.conversation.slice(0,8):AXIS812_STUDIO.conversation(lang,id,String(r?.target||''),String(r?.alt||r?.target||''));
 const ext=Array.isArray(r?.conversationExtension)&&r.conversationExtension.length>=4?r.conversationExtension.slice(0,4):AXIS812_STUDIO.extension(lang,id);
 const depth=p.dialogueDepth||'full',n=depth==='short'?4:depth==='immersive'?12:8;
 return base.concat(ext).slice(0,n)
}
const axis812BaseRich=axis891Rich;
axis891Rich=function(x,p){
 const r=axis812BaseRich(x,p),raw=x||{},lesson=raw.lesson||r.lesson||axis812LegacyLesson({...raw,...r});
 return{...r,lesson,conversation:axis812ConversationFor({...raw,...r}),conversationExtension:raw.conversationExtension||r.conversationExtension||[]}
};
const axis812BaseDialogueTurns=axis8103DialogueTurns;
axis8103DialogueTurns=function(r){try{return axis812ConversationFor(r)}catch{return axis812BaseDialogueTurns(r)}};
const axis812BasePanelRows=axis891PanelRows;
axis891PanelRows=function(r){
 const rows=axis812BasePanelRows(r),l=r?.lesson||axis812LegacyLesson(r);
 const lead=[['真实意图',l.intent],['母语感',l.notice]];
 const tail=[['不要这样学',l.trap],['换条件再说',l.transform]];
 return lead.concat(rows).concat(tail)
};
function axis812MethodLab(panel,r){
 let root=$('#v812MethodLab',panel);if(!root){root=D.createElement('div');root.id='v812MethodLab';root.className='v812MethodLab';root.innerHTML='<div class="v812MethodHead"><span>学习路径</span><b>懂 → 注意 → 回想 → 接话 → 影子 → 改写 → 复现</b></div><div class="v812MethodActions"><button type="button" data-v812-method="recall">盲回想</button><button type="button" data-v812-method="respond">接下一句</button><button type="button" data-v812-method="transform">换条件</button></div><div class="v812MethodResult" id="v812MethodResult"></div>';panel.querySelector('.v891SpeakActions')?.before(root)}
 const l=r?.lesson||axis812LegacyLesson(r);root.dataset.recall=l.recall+'\n提示 · '+l.cloze;root.dataset.respond='下一句 · '+l.respond;root.dataset.transform=l.transform;const result=$('#v812MethodResult',root);if(result&&!result.textContent)result.textContent='不要反复看答案：先回想，再接话，最后把条件换掉。'
}
const axis812BaseMountPractice=axis8101MountPractice;
axis8101MountPractice=function(panel,r,x,p){axis812BaseMountPractice(panel,r,x,p);axis812MethodLab(panel,r)};
D.addEventListener('click',e=>{const b=e.target instanceof Element?e.target.closest('[data-v812-method]'):null;if(!b)return;const root=b.closest('#v812MethodLab'),out=$('#v812MethodResult',root);if(!root||!out)return;const k=b.dataset.v812Method;out.textContent=k==='recall'?root.dataset.recall:k==='respond'?root.dataset.respond:root.dataset.transform;root.querySelectorAll('[data-v812-method]').forEach(x=>x.classList.toggle('active',x===b))},true);
try{
 const style=D.createElement('style');style.id='v812LanguageStudioStyle';style.textContent='.v812MethodLab{margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.055)}.v812MethodHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.v812MethodHead span{color:#757f8d;font-size:9px}.v812MethodHead b{max-width:72%;text-align:right;color:#aeb5c0;font-size:9px;line-height:1.45;font-weight:560}.v812MethodActions{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:8px}.v812MethodActions button{height:31px;border-radius:10px;background:rgba(255,255,255,.035);color:#858e9a;font-size:9.5px}.v812MethodActions button.active{background:rgba(115,124,255,.14);color:#c7caff}.v812MethodResult{min-height:34px;margin-top:7px;padding:8px 9px;border-radius:10px;background:rgba(255,255,255,.025);color:#929ba8;font-size:9.5px;line-height:1.5;white-space:pre-line}';D.head.appendChild(style)
}catch{}
try{
 const legacy=window.__AXIS_REST_SPEAK__;if(legacy){legacy.availableEnglish=10632;legacy.availableUnits=25716;legacy.availablePhrases=()=>25716}
 window.__AXIS_812_LEARNING__={version:'8.12',owner:'axis_v89_speak',newPerLanguage:4896,totalNew:19584,availableByLanguage:{en:10632,ja:5028,ko:5028,zh:5028},totalAvailable:25716,dialogueTurns:{short:4,full:8,immersive:12},teachingLoop:['meaning','noticing','retrieval','response','shadow','transform','review'],tailPairMax:__AXIS812_TAILS__,networkRequired:false,trainingOwner:false,autoplay:false}
}catch{}
`;
const runtimeBlock=block.replace('__AXIS812_BROWSER_CORE__',browserCore).replace('__AXIS812_TAILS__',JSON.stringify(audit.tailPairMax));
src=src.slice(0,end)+runtimeBlock+'\n'+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log(`[AXIS 8.12 Language Studio] PASS · 19,584 new units · 25,716 available · 4/8/12-turn dialogue · active seven-step teaching loop · tail max ${JSON.stringify(audit.tailPairMax)}`);
