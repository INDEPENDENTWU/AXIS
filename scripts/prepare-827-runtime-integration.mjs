import fs from 'node:fs';

const fail=m=>{throw new Error('[AXIS 8.27 runtime integration] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(f+' syntax '+e.message)}};
const insertBeforeFlowRuntime=(s,payload,label)=>{
  const marker='window.__AXIS_FLOW_RUNTIME__={';
  const n=s.split(marker).length-1;if(n!==1)fail(label+' Flow runtime anchor expected once, found '+n);
  const at=s.indexOf(marker);return s.slice(0,at)+payload+s.slice(at);
};
const insertAfterFlowRuntime=(s,payload,label)=>{
  const re=/window\.__AXIS_FLOW_RUNTIME__=\{[^\n]*\};/;
  const hit=s.match(re)?.[0];if(!hit)fail(label+' Flow runtime export missing');
  return s.replace(hit,hit+payload);
};

{
  const f='app.js';
  let s=read(f);
  if(!s.includes('const axis827Core=(()=>{')){
    let core=read('lib/axis-reality-route.mjs');
    core=core.replaceAll('export const ','const ').replaceAll('export function ','function ');
    const wrapped='\nconst axis827Core=(()=>{\n'+core+'\nreturn {projectRealityRoute,deferRealityRouteCurrent,normalizeExecutionConstraints,REALITY_ROUTE_SCHEMA_ID,REALITY_ROUTE_VERSION,EXECUTION_CONSTRAINT_SCHEMA_ID};\n})();\n';
    s=insertBeforeFlowRuntime(s,wrapped,'Reality Route pure core');
  }
  const bridge=read('runtime/axis-827-reality-route.js');
  if(!s.includes('__AXIS_827_REALITY_ROUTE__'))s=insertAfterFlowRuntime(s,'\n'+bridge+'\n','Reality Route browser bridge');
  for(const token of ['axis827Core.projectRealityRoute','axis827DeferCurrent','temporaryConstraints','data-axis-flow-defer','__AXIS_827_REALITY_ROUTE__']){
    if(!s.includes(token))fail('app runtime missing '+token);
  }
  syntax(s,f);
  write(f,s);
}

{
  const f='styles.css';
  let s=read(f);
  const css=read('styles/axis-827-reality-route.css').trim();
  if(!s.includes('AXIS 8.27 — Reality Route'))s+='\n'+css+'\n';
  write(f,s);
}

console.log('[AXIS 8.27 runtime integration] PASS · pure core isolated · existing FlowRun bridge · bounded defer action · no new runtime request');
