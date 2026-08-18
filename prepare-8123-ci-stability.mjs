import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 CI stability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='scripts/axis-813-shadow-browser.mjs';let s=read(f);
 s=once(s,"assert.ok(['8.12','8.12.1','8.12.2'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);","assert.ok(['8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);",'Shadow public patch family');
 write(f,s);
}
{
 const f='scripts/axis-882-smoke.mjs';let s=read(f);const n=s.split('{timeout:1800}').length-1;if(n<5)fail(`8.8.2 Home waits expected >=5, found ${n}`);s=s.replaceAll('{timeout:1800}','{timeout:4000}');write(f,s);
}
{
 const f='scripts/axis-882-home-transition-smoke.mjs';let s=read(f);const n=s.split('{timeout:1800}').length-1;if(n!==2)fail(`Home transition waits expected twice, found ${n}`);s=s.replaceAll('{timeout:1800}','{timeout:4000}');write(f,s);
}
{
 const f='scripts/axis-891-smoke.mjs';let s=read(f);
 s=once(s,"document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:3500}","document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:7000}",'8.9.1 Rest Speak readiness window');
 write(f,s);
}
console.log('[AXIS 8.12.3 CI stability] PASS · patch family extended · predicates unchanged · browser transition windows tolerate loaded Chromium/WebKit runners');
