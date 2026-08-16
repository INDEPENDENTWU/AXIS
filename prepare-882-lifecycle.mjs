import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8.2 lifecycle: ${m}`)};
const FILE='v61.js';
let src=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);src=src.replace(from,to)};

once(
  'function recentDistinct(limit=5){',
  "function markQuickReady(){window.__AXIS_QUICK_READY__=!!($('#quickRecordBtn')?.onclick&&$('#quickRecordSheet'))}\nfunction recentDistinct(limit=5){",
  'Quick Record readiness marker'
);
once(
  "window.addEventListener('pageshow',()=>{basic();syncDock();decorate();renderContinue();renderPending();staleCheck()});",
  "window.addEventListener('pageshow',()=>{injectQuick();markQuickReady();basic();syncDock();decorate();renderContinue();renderPending();staleCheck()});",
  'Quick Record pageshow self-heal'
);
once(
  "if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',bind,{once:true});else bind();",
  "if($('#dock')){injectQuick();markQuickReady()}if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',bind,{once:true});else bind();",
  'eager Quick Record interactive mount'
);

if(!src.includes("window.__AXIS_QUICK_READY__=!!($('#quickRecordBtn')?.onclick&&$('#quickRecordSheet'))"))fail('readiness marker missing');
if(!src.includes("if($('#dock')){injectQuick();markQuickReady()}"))fail('eager interactive mount missing');
if(!src.includes("pageshow',()=>{injectQuick();markQuickReady();"))fail('pageshow self-heal missing');
try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8.2 lifecycle] PASS · Quick Record owner mounts during module execution and self-heals on pageshow');
