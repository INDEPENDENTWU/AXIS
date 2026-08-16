import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.2 standalone polish] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);
src=once(src,
 "function axis8102OpenStandalone(){const p=axis89SpeakPrefs();if(!p?.on||p.standalone==='off')return;const key='standalone:'+axis810DayKey()+':'+Date.now().toString(36),x=axis810SelectPhrase(key,45000,{force:true});if(!x)return;axis810CloseConfig();requestAnimationFrame(()=>axis8102OpenPhrase(x,key,'standalone'))}",
 "function axis8102OpenStandalone(){const p=axis89SpeakPrefs();if(!p?.on||p.standalone==='off')return;const key='standalone:'+axis810DayKey()+':'+Date.now().toString(36),x=axis810SelectPhrase(key,45000,{force:true});if(!x)return;axis810CloseConfig();$('#settingsSheet')?.classList.remove('show');requestAnimationFrame(()=>axis8102OpenPhrase(x,key,'standalone'))}",
 'standalone clean handoff from Settings');
src=once(src,
 "if(!target||!today||sheet){axis891CloseSpeak();host.classList.remove('show');D.body.classList.remove('v87-now');return}",
 "if(!target||!today||sheet){const keepStandalone=!sheet&&axis8102PanelSource()==='standalone';if(!keepStandalone)axis891CloseSpeak();host.classList.remove('show');D.body.classList.remove('v87-now');return}",
 'standalone lifetime outside active Home');
src=once(src,
 "'<div class=\"v810Options '+(k==='track'?'track':'')+'\">'",
 "'<div class=\"v810Options '+(k==='track'?'track':k==='standalone'?'standalone':'')+'\">'",
 'standalone three-column option geometry');
src=once(src,
 '.v8102StandaloneBlock .v8102StandaloneStart{width:100%;height:40px;',
 '.v810Options.standalone{grid-template-columns:repeat(3,minmax(0,1fr))}.v8102StandaloneBlock .v8102StandaloneStart{width:100%;height:40px;',
 'standalone option geometry CSS');
if(!src.includes("$('#settingsSheet')?.classList.remove('show')"))fail('Settings handoff remains layered');
if(!src.includes("keepStandalone=!sheet&&axis8102PanelSource()==='standalone'"))fail('Home repaint can still close standalone learning');
if(!src.includes("k==='standalone'?'standalone'"))fail('standalone option geometry missing');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.10.2 standalone polish] PASS · clean Settings handoff · independent Home lifetime · three-option geometry');
