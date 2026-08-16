import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9.1 speak] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);
const css=`
/* AXIS 8.9.1 keeps the training controls intact and gives language its own quiet rail. */
#v87Now .v87Actions{min-height:83px!important;display:flex!important;flex-wrap:wrap!important;align-content:flex-start!important;align-items:center!important;column-gap:8px!important;row-gap:4px!important;padding:0 14px 12px!important}
#v87Now .v87Actions>#v87Rest{order:-1!important;flex:0 0 100%!important;width:100%!important;height:35px!important;min-width:0!important;display:flex!important;align-items:center!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important}
#v87Now .v87Actions>#v87Rest.v89Speak{height:35px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:stretch!important;gap:1px!important;overflow:hidden!important;cursor:pointer!important;white-space:normal!important;-webkit-tap-highlight-color:transparent!important}
#v87Rest.v89Speak .v891RestLine{display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;align-items:start!important;gap:5px!important;width:100%!important;min-width:0!important;overflow:visible!important;white-space:normal!important}
#v87Rest.v89Speak .v891RestLine i{font-style:normal!important;color:#9ca4b2!important;font-size:9.5px!important;line-height:12px!important;font-variant-numeric:tabular-nums!important;white-space:nowrap!important}
#v87Rest.v89Speak .v891RestLine b{display:-webkit-box!important;min-width:0!important;overflow:hidden!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;white-space:normal!important;text-overflow:clip!important;color:#d2d5dd!important;font-size:var(--v891-speak-size,10.25px)!important;line-height:12px!important;font-weight:650!important;letter-spacing:-.008em!important}
#v87Rest.v89Speak .v891RestMeaning{display:block!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:#737c89!important;font-size:8.75px!important;line-height:9px!important}
body.v87-now .app{padding-bottom:330px!important}
.v891SpeakPanel{display:block;position:fixed;left:50%;transform:translateX(-50%) translateY(8px);width:min(calc(100% - 28px),500px);z-index:79;padding:15px 15px 13px;border-radius:20px;background:rgba(18,21,27,.985);box-shadow:inset 0 0 0 1px rgba(255,255,255,.075),0 22px 60px rgba(0,0,0,.42);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);opacity:0;visibility:hidden;pointer-events:none;overflow:auto;overscroll-behavior:contain;transition:opacity .15s ease,transform .15s ease}
.v891SpeakPanel.show{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.v891SpeakHead{display:flex;align-items:center;justify-content:space-between;gap:10px}.v891SpeakHead>span{min-width:0;color:#7f8897;font-size:9.5px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v891SpeakHead>button{width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.035);color:#9098a5;font-size:17px}
.v891SpeakPhrase{display:block;margin-top:9px;color:#f3f2ef;font-size:20px;line-height:1.22;font-weight:700;letter-spacing:-.018em}.v891SpeakMeaning{margin-top:7px;color:#b9bec8;font-size:12.5px;line-height:1.45}.v891SpeakPron{margin-top:5px;color:#858e9c;font-size:10.5px;line-height:1.4}.v891SpeakNative{margin:10px 0 0;padding-top:10px;border-top:1px solid rgba(255,255,255,.055);color:#aeb4bf;font-size:11px;line-height:1.55}
.v891SpeakMore{display:none;margin-top:9px;border-top:1px solid rgba(255,255,255,.055)}.v891SpeakPanel.expanded .v891SpeakMore{display:block}.v891SpeakMore>div{display:grid;grid-template-columns:80px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}.v891SpeakMore span{color:#737c89;font-size:9.5px;line-height:1.4}.v891SpeakMore b{color:#b8bdc6;font-size:10.5px;line-height:1.48;font-weight:540}
.v891SpeakActions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:11px}.v891SpeakActions button{height:34px;min-width:0;padding:0 6px;border-radius:11px;background:rgba(255,255,255,.045);color:#aeb4c0;font-size:10px;font-weight:620}.v891SpeakActions button:first-child{background:rgba(115,124,255,.14);color:#c1c5ff}.v891SpeakActions button:nth-child(3){color:#9fc3ae}
@media(min-width:430px){#v87Rest.v89Speak .v891RestLine b{-webkit-line-clamp:2!important}}
@media(max-width:380px){#v87Now .v87Actions{padding-left:12px!important;padding-right:12px!important}.v891SpeakPanel{width:calc(100% - 20px);padding:14px 13px 12px}.v891SpeakPhrase{font-size:18px}.v891SpeakMore>div{grid-template-columns:70px minmax(0,1fr)}}
`;
const style=`function axis891SpeakStyle(){
 if($('#v891SpeakStyle'))return;const s=D.createElement('style');s.id='v891SpeakStyle';s.textContent=${JSON.stringify(css)};D.head.appendChild(s)
}`;
src=once(src,'function axis89SetSpeak(k,v){',style+'\nfunction axis89SetSpeak(k,v){','8.9.1 learning style');
src=once(src,'function injectRestSpeak(){axis89SpeakStyle();','function injectRestSpeak(){axis89SpeakStyle();axis891SpeakStyle();','mount 8.9.1 style');
src=once(src,'migrateAudio();injectAudio();try{injectRestSpeak()}catch(err)','migrateAudio();injectAudio();axis891SpeakStyle();try{injectRestSpeak()}catch(err)','boot learning style');

src=regexOnce(src,/function installEvents\(\)\{D\.addEventListener\('click',async e=>\{const speak=e\.target\.closest\('#v87Rest\.v89Speak'\);if\(speak\)\{axis89SpeakVoice\(speak\);return\}/,
`function installEvents(){D.addEventListener('click',async e=>{if(!(e.target instanceof Element))return;const speak=e.target.closest('#v87Rest.v89Speak');if(speak){axis891OpenSpeak(speak);return}const learn=e.target.closest('#v891SpeakPanel [data-v891-action]');if(learn){const a=learn.dataset.v891Action;if(a==='close')axis891CloseSpeak();else if(a==='voice'){const panel=$('#v891SpeakPanel'),x=axis891Phrase(panel?.dataset?.phraseId);if(x){const proxy={dataset:{speak:x.target,lang:x.lang}};axis89SpeakVoice(proxy)}}else if(a==='next')axis891NextSpeak();else if(a==='master')axis891MasterSpeak();else if(a==='more')axis891ToggleMore();return}`,
'learning panel event route');

src=once(src,"if(!target||!today||sheet){host.classList.remove('show');D.body.classList.remove('v87-now');return}",
"if(!target||!today||sheet){axis891CloseSpeak();host.classList.remove('show');D.body.classList.remove('v87-now');return}",
'close learning panel outside active home');

src=once(src,"window.__AXIS_REST_SPEAK__={version:'8.9',owner:'passive-rest-reader',failOpen:true,prefs:axis89SpeakPrefs,phrases:()=>AXIS89_SPEAK.length};",
"window.__AXIS_REST_SPEAK__={version:'8.9',patch:'8.9.1',owner:'passive-rest-reader',failOpen:true,userInvokedPanel:true,richEnglish:72,prefs:axis89SpeakPrefs,phrases:()=>axis891AllPhrases().length};",
'8.9.1 public diagnostic');

if(/setInterval\s*\(\s*axis891|new\s+MutationObserver\s*\(\s*axis891|new\s+ResizeObserver\s*\(\s*axis891/.test(src))fail('8.9.1 learning accessory gained forbidden timing/observer owner');
if(!src.includes("userInvokedPanel:true")||!src.includes("richEnglish:72"))fail('8.9.1 public learning marker missing');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.9.1 speak UI] PASS · dedicated language rail · complete phrase · guarded event target · explicit learning panel · no autoplay/timer/observer');
