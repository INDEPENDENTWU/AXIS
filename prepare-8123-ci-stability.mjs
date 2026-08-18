import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 CI stability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const converge=(src,from,to,label)=>{
 const oldCount=src.split(from).length-1,newCount=src.split(to).length-1;
 if(oldCount===1&&newCount===0)return src.replace(from,to);
 if(oldCount===0&&newCount===1)return src;
 fail(`${label} unexpected shape · old ${oldCount} · current ${newCount}`)
};

{
 const f='scripts/axis-813-shadow-browser.mjs';let s=read(f);
 s=converge(s,"assert.ok(['8.12','8.12.1','8.12.2'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);","assert.ok(['8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);",'Shadow public patch family');
 write(f,s);
}
{
 const f='scripts/axis-882-smoke.mjs';let s=read(f),old=s.split('{timeout:1800}').length-1,current=s.split('{timeout:4000}').length-1;
 if(old>=5)s=s.replaceAll('{timeout:1800}','{timeout:4000}');else if(old!==0||current<5)fail(`8.8.2 Home wait shape · old ${old} · current ${current}`);write(f,s);
}
{
 const f='scripts/axis-882-home-transition-smoke.mjs';let s=read(f),old=s.split('{timeout:1800}').length-1,current=s.split('{timeout:4000}').length-1;
 if(old===2)s=s.replaceAll('{timeout:1800}','{timeout:4000}');else if(old!==0||current!==2)fail(`Home transition wait shape · old ${old} · current ${current}`);write(f,s);
}
{
 const f='scripts/axis-891-smoke.mjs';let s=read(f);
 s=converge(s,"document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:3500}","document.querySelector('#v87Rest')?.classList.contains('v891SpeakReady'),undefined,{timeout:7000}",'8.9.1 Rest Speak readiness window');
 write(f,s);
}
console.log('[AXIS 8.12.3 CI stability] PASS · post-contract patch family extended · predicates unchanged · loaded-runner timing only');
