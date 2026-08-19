import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 visual memory seal] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_EQUIPMENT_GALLERY__'))fail('equipment gallery must run first');
if(!src.includes('window.__AXIS_LOCAL_VISION__={version:2'))fail('current Local Vision v2 owner missing');
if(!src.includes('function visualSigFromCanvas'))fail('Local Vision multi-signal compiler missing');
if(!src.includes('function localVisualDistance'))fail('Local Vision v2 distance owner missing');

const replaceLine=(start,to,label)=>{
 const a=src.indexOf(start);if(a<0)fail(`${label} start missing`);
 const b=src.indexOf('\n',a);if(b<0)fail(`${label} line end missing`);
 src=src.slice(0,a)+to+src.slice(b)
};

replaceLine('function learnMemory(id){',`function learnMemory(id){if(!id){localVisionLast={stage:'learn',version:2,reason:'missing-equipment-id',frameCount:state.frames.length};return}const arr=state.profile.memories||(state.profile.memories=[]),before=arr.length,same=()=>arr.filter(x=>x.equipmentId===id);let learned=0,skipped=0;for(const f of state.frames.slice(0,5)){if(!(f.fp||f.sig))continue;const dup=same().some(m=>localVisualDistance(m,f)<1.35);if(dup){skipped++;continue}arr.push({equipmentId:id,fp:f.fp||null,sig:f.sig||null,t:Date.now(),source:'record'});learned++}const by={};for(const m of arr){if(!m?.equipmentId||(!m.fp&&!m.sig))continue;(by[m.equipmentId]||(by[m.equipmentId]=[])).push(m)}state.profile.memories=Object.values(by).flatMap(xs=>{const sorted=[...xs].sort((a,b)=>(b.t||0)-(a.t||0)),dedicated=sorted.filter(x=>x.sourceRef).slice(0,10),recent=sorted.filter(x=>!x.sourceRef).slice(0,Math.max(0,24-dedicated.length));return dedicated.concat(recent)});save();localVisionLast={stage:'learn',version:2,equipmentId:id,before,after:state.profile.memories.length,learned,skipped,frameCount:state.frames.length}}`,'confirmed-record memory owner');

replaceLine('async function equipmentPhotoFromFile(file){',`async function equipmentPhotoFromFile(file){const u=URL.createObjectURL(file),img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=u});const max=1440,scale=Math.min(1,max/Math.max(1,img.naturalWidth,img.naturalHeight)),cv=D.createElement('canvas');cv.width=Math.max(2,Math.round(img.naturalWidth*scale));cv.height=Math.max(2,Math.round(img.naturalHeight*scale));const c=cv.getContext('2d',{alpha:false});c.fillStyle='#08090b';c.fillRect(0,0,cv.width,cv.height);c.drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(u);const fp=fpFromCanvas(cv),sig=visualSigFromCanvas(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.86));if(!blob)throw new Error('photo encode');return{blob,fp,sig}}`,'dedicated equipment photo signature');

const destructure='const {blob,fp}=await equipmentPhotoFromFile(file)';
const destructureNext='const {blob,fp,sig}=await equipmentPhotoFromFile(file)';
if((src.split(destructure).length-1)!==1)fail('equipment photo destructure contract changed');
src=src.replace(destructure,destructureNext);
const persist="list.push({ref,fp,t,source});if(fp)memories.push({equipmentId:id,fp,t,sourceRef:ref,source:'equipment-photo'})";
const persistNext="list.push({ref,fp,sig:sig||null,t,source});if(fp||sig)memories.push({equipmentId:id,fp,sig:sig||null,t,sourceRef:ref,source:'equipment-photo'})";
if((src.split(persist).length-1)!==1)fail('equipment photo memory persistence contract changed');
src=src.replace(persist,persistNext);

for(const needle of ["version:2,equipmentId:id","localVisualDistance(m,f)<1.35","sig:f.sig||null","sig:sig||null","sourceRef:ref","slice(0,Math.max(0,24-dedicated.length))"])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 visual memory seal] PASS · current Local Vision v2 dedupe/diagnostics preserved · recording + dedicated equipment photos retain multi-signal signatures · no new runtime owner');
