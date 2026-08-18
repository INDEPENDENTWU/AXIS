import fs from 'node:fs';

const FILE='v61.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 recording selection reconcile] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(src.includes('__AXIS_8123_RECORDING_SELECTION_RECONCILE__'))fail('selection reconcile already installed');

const observer="const nm=$('#equipmentName');if(nm)new MutationObserver(()=>{const e=selected(),box=$('#v8Sets'),key=String(e?.id||e?.name||'');if(e?.type==='strength'){if(box&&!box.classList.contains('hidden')&&box.dataset.axisEquipment===key)return;prepare(e.id)}else hideSets()}).observe(nm,{childList:true,subtree:true});";
const observerCount=src.split(observer).length-1;
if(observerCount!==1)fail(`semantic equipment observer expected once, found ${observerCount}`);

const helper=`function axis8123ReconcileSelectedRecording(){
 const e=selected(),box=$('#v8Sets'),key=String(e?.id||e?.name||'');
 if(e?.type==='strength'){
  if(box&&!box.classList.contains('hidden')&&box.dataset.axisEquipment===key){window.__AXIS_GROUP_PLAN_SYNC__?.();return}
  prepare(e.id);return
 }
 hideSets()
}
try{window.__AXIS_8123_RECORDING_SELECTION_RECONCILE__={version:'8.12.3',owner:'v61-recording',catalogRoute:true,observerFallback:true,idempotentByEquipment:true}}catch{}
`;
src=src.replace(observer,helper+"const nm=$('#equipmentName');if(nm)new MutationObserver(axis8123ReconcileSelectedRecording).observe(nm,{childList:true,subtree:true});");

const route="const b=e.target.closest('button,[data-edit-eq]');if(!b)return;if(b.dataset.axisStep)return;";
const routeCount=src.split(route).length-1;
if(routeCount!==1)fail(`recording click router expected once, found ${routeCount}`);
src=src.replace(route,route+"if(b.matches('#eqSheet [data-eq]'))setTimeout(axis8123ReconcileSelectedRecording,0);");

for(const needle of ['__AXIS_8123_RECORDING_SELECTION_RECONCILE__',"owner:'v61-recording'","b.matches('#eqSheet [data-eq]')","new MutationObserver(axis8123ReconcileSelectedRecording)"])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 recording selection reconcile] PASS · catalog selection and equipment-name fallback converge on one idempotent v61 recording initializer');