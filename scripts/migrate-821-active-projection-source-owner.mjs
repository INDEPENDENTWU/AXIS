import fs from 'node:fs';

const fail=m=>{throw new Error(`[8.21 source-owner migration] ${m}`)};
const read=f=>fs.readFileSync(f,'utf8');
const write=(f,s)=>fs.writeFileSync(f,s);
const hits=(s,t)=>s.split(t).length-1;

const replaceOnce=(src,from,to,label)=>{
  const n=hits(src,from);
  if(n!==1)fail(`${label}: expected one anchor, found ${n}`);
  return src.replace(from,to);
};

const replaceBlock=(src,start,end,replacement,label)=>{
  const a=src.indexOf(start);
  if(a<0)fail(`${label}: start marker missing`);
  if(src.indexOf(start,a+start.length)>=0)fail(`${label}: start marker duplicated`);
  const b=src.indexOf(end,a);
  if(b<0)fail(`${label}: end marker missing`);
  return src.slice(0,a)+replacement+src.slice(b+end.length);
};

const signal="window.dispatchEvent(new CustomEvent('axis:active-truth-changed',{detail:{id:e.id,status:'active'}}))";
const listener="window.addEventListener('axis:active-truth-changed',()=>{renderNow(true);renderTimeline()})";

let v82=read('v82-runtime.js');
if(hits(v82,signal)!==1)fail(`v82 source signal count ${hits(v82,signal)}`);
new Function(v82);

let v87=read('v87-runtime.js');
const pageshow="window.addEventListener('pageshow',()=>{injectAudio();renderNow(true);renderTimeline()});";
if(hits(v87,listener)===0){
  v87=replaceOnce(v87,pageshow,listener+';'+pageshow,'v87 source listener insertion');
}else if(hits(v87,listener)!==1){
  fail(`v87 source listener count ${hits(v87,listener)}`);
}
if(hits(v87,listener)!==1)fail('v87 source listener not singular after migration');
new Function(v87);
write('v87-runtime.js',v87);

let seal=read('postbuild-821-executable-object-presentation-seal.mjs');
seal=replaceBlock(
  seal,
  "src=mutateModuleFunction(src,'v82-runtime.js','function startActivity(e,customEstimate)',fn=>{",
  "},'v82 Active synchronous presentation invalidation');",
  `{
 const fn=moduleFunctionRange(src,'v82-runtime.js','function startActivity(e,customEstimate)','v82 source-owned Active synchronous presentation invalidation').text;
 const signal="window.dispatchEvent(new CustomEvent('axis:active-truth-changed',{detail:{id:e.id,status:'active'}}))";
 if(fn.split(signal).length-1!==1)fail('v82 source-owned Active presentation invalidation missing or duplicated');
}`,
  'retire v82 postbuild mutation'
);
seal=replaceBlock(
  seal,
  "src=mutateModuleFunction(src,'v87-runtime.js','function installEvents()',fn=>{",
  "},'v87 synchronous Active projection listener');",
  `{
 const fn=moduleFunctionRange(src,'v87-runtime.js','function installEvents()','v87 source-owned Active projection listener').text;
 const listener="window.addEventListener('axis:active-truth-changed',()=>{renderNow(true);renderTimeline()})";
 if(fn.split(listener).length-1!==1)fail('v87 source-owned Active presentation listener missing or duplicated');
}`,
  'retire v87 postbuild mutation'
);
seal=replaceOnce(
  seal,
  "activeProjection:'same-task-invalidation',flowProjection:'same-task-current-encounter'",
  "activeProjection:'same-task-invalidation',activeProjectionOwner:'v82-runtime.js+v87-runtime.js',activeProjectionPostbuildMutation:false,flowProjection:'same-task-current-encounter'",
  'record Active projection provenance'
);
if(hits(seal,"src=mutateModuleFunction(src,'v82-runtime.js','function startActivity(e,customEstimate)'")!==0)fail('v82 postbuild Active mutation survived');
if(hits(seal,"src=mutateModuleFunction(src,'v87-runtime.js','function installEvents()'")!==0)fail('v87 postbuild Active listener mutation survived');
if(hits(seal,"activeProjectionPostbuildMutation:false")!==1)fail('Active projection postbuild-retirement provenance missing');
write('postbuild-821-executable-object-presentation-seal.mjs',seal);

console.log('[8.21 source-owner migration] PASS · v82 signal + v87 listener source-owned · postbuild mutation retired');
