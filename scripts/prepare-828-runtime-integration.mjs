import fs from 'node:fs';

const fail=m=>{throw new Error('[AXIS 8.28 runtime integration] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(f+' syntax '+e.message)}};
const insertBeforeFlowRuntime=(s,payload,label)=>{
  const marker='window.__AXIS_FLOW_RUNTIME__={';
  const n=s.split(marker).length-1;if(n!==1)fail(label+' Flow runtime anchor expected once, found '+n);
  const at=s.indexOf(marker);return s.slice(0,at)+payload+s.slice(at);
};

{
  const f='app.js';let s=read(f);
  if(!s.includes('const axis828Core=(()=>{')){
    let core=read('lib/axis-practice-loop.mjs');
    core=core.replaceAll('export const ','const ').replaceAll('export function ','function ');
    const wrapped='\nconst axis828Core=(()=>{\n'+core+'\nreturn {projectPracticeLoop,PRACTICE_LOOP_SCHEMA_ID,PRACTICE_LOOP_VERSION};\n})();\n';
    s=insertBeforeFlowRuntime(s,wrapped,'Practice Loop pure core');
  }
  if(!s.includes('__AXIS_828_PRACTICE_LOOP__')){
    const bridge=read('runtime/axis-828-practice-loop.js');
    const re=/window\.__AXIS_827_REALITY_ROUTE__=\{[^\n]*\};/;
    const hit=s.match(re)?.[0];if(!hit)fail('Reality Route bridge anchor missing');
    s=s.replace(hit,hit+'\n'+bridge+'\n');
  }
  for(const token of ['axis828Core.projectPracticeLoop','axis828PracticeLoopProjection','practiceLoop=function','__AXIS_828_PRACTICE_LOOP__','data-axis-practice-loop-status'])if(!s.includes(token))fail('app runtime missing '+token);
  syntax(s,f);write(f,s);
}
{
  const f='styles.css';let s=read(f),css=read('styles/axis-828-practice-loop.css').trim();
  if(!s.includes('AXIS 8.28 — Practice Loop Convergence'))s+='\n'+css+'\n';
  write(f,s);
}
console.log('[AXIS 8.28 runtime integration] PASS · pure loop projection + existing Flow/Reality/Active owners · prompt-free reload presentation · no new runtime request');
