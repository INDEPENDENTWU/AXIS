import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 learning entry] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const FILE='v87-runtime.js';let src=read(FILE);
src=src.replaceAll('#v89SpeakSettings .v810ConfigEntry','#settingsSheet .v810ConfigEntry');
src=regexOnce(src,/function axis810EnsureSettings\(box=\$\('#v89SpeakSettings'\)\)\{[\s\S]*?\}\nfunction axis810RenderGroup/,
`function axis810EnsureSettings(box=$('#v89SpeakSettings')){
 if(!box)return;const host=$('#settingsSheet .settingsList:not(.second)')||$('#settingsSheet .settingsList');if(!host)return;
 let entry=$('#v810ConfigEntry',host);
 if(!entry){entry=D.createElement('button');entry.type='button';entry.id='v810ConfigEntry';entry.className='settingLink v810ConfigEntry';entry.innerHTML='<span><b>学习安排</b><small id="v810ConfigSummary"></small></span><i>›</i>';host.appendChild(entry);entry.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();axis810OpenConfig()},false)}
 axis810EnsureConfig()
}
function axis810RenderGroup`,'top-level settings entry');
src=once(src,"const summary=$('#v810ConfigSummary',box);","const summary=$('#v810ConfigSummary');",'settings summary global lookup');
src=once(src,"function axis810CloseRecap(){$('#v810RecapPanel')?.classList.remove('show')}","function axis810CloseRecap(){$('#v810RecapPanel')?.classList.remove('show')}\nwindow.__AXIS_810_SETTINGS_ENTRY__={owner:'settings-primary-list',surface:'dedicated-config-panel'};",'settings entry diagnostic');
if(!src.includes("owner:'settings-primary-list'"))fail('settings primary-list diagnostic missing');
if(src.includes('#v89SpeakSettings .v810ConfigEntry'))fail('learning schedule entry still inherits accessory container visibility');
if(!src.includes("#settingsSheet .settingsList:not(.second)"))fail('learning schedule entry is not anchored to visible primary Settings list');
syntax(src,FILE);write(FILE,src);
console.log('[AXIS 8.10 learning entry] PASS · schedule entry is a top-level visible Settings row · dedicated panel preserved');
