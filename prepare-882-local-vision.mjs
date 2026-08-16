import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`AXIS 8.8.2 local vision: ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const re=/function memoryGuess\(\)\{[\s\S]*?\}\nfunction learnMemory\(id\)\{[\s\S]*?\}\nfunction reviewFrames\(\)\{/g;
const matches=src.match(re)||[];
if(matches.length!==1)fail(`personal visual memory owner expected once, found ${matches.length}`);
const replacement=`let localVisionLast={stage:'idle'};
function localVisionSnapshot(){return{last:JSON.parse(JSON.stringify(localVisionLast||{})),memories:(state.profile.memories||[]).map(m=>({equipmentId:m.equipmentId,fp:m.fp||null,sig:m.sig?{full:m.sig.full||null,center:m.sig.center||null,zones:m.sig.zones||null}:null,t:m.t||0})),frames:(state.frames||[]).map(f=>({fp:f.fp||null,sig:f.sig?{full:f.sig.full||null,center:f.sig.center||null,zones:f.sig.zones||null}:null}))}}
function memoryGuess(){const mem=state.profile.memories||[],frames=state.frames||[];if(!mem.length||!frames.length){localVisionLast={stage:'guess',reason:!mem.length?'no-memory':'no-frame',memoryCount:mem.length,frameCount:frames.length,ranked:[]};return null}const by=new Map();for(const m of mem){if(!m.equipmentId)continue;let best=Infinity;for(const f of frames)best=Math.min(best,localVisualDistance(m,f));if(!Number.isFinite(best))continue;const a=by.get(m.equipmentId)||[];a.push(best);by.set(m.equipmentId,a)}const ranked=[...by].map(([id,a])=>{a.sort((x,y)=>x-y);const score=a.length>1?a[0]*.72+a[1]*.28:a[0];return{id,score,samples:a.slice(0,4)}}).sort((a,b)=>a.score-b.score);if(!ranked.length){localVisionLast={stage:'guess',reason:'no-ranked-candidate',memoryCount:mem.length,frameCount:frames.length,ranked:[]};return null}const best=ranked[0],second=ranked[1]?.score??99,margin=second-best.score,strong=best.score<=6.6&&margin>=1.6,usable=best.score<=10.2&&margin>=.8;localVisionLast={stage:'guess',memoryCount:mem.length,frameCount:frames.length,ranked:ranked.slice(0,5),best:{id:best.id,score:best.score},second,margin,strong,usable};if(!usable)return null;return{id:best.id,score:best.score,margin,confidence:strong?Math.min(.98,.86+(6.6-best.score)*.018):Math.max(.60,Math.min(.81,.78-best.score*.012+margin*.025)),strong}}
function learnMemory(id){if(!id){localVisionLast={stage:'learn',reason:'missing-equipment-id',frameCount:state.frames.length};return}const arr=state.profile.memories||(state.profile.memories=[]),before=arr.length;state.frames.slice(0,4).forEach(f=>(f.fp||f.sig)&&arr.push({equipmentId:id,fp:f.fp,sig:f.sig||null,t:Date.now()}));const by={};for(let i=arr.length-1;i>=0;i--){const m=arr[i];by[m.equipmentId]=by[m.equipmentId]||[];if(by[m.equipmentId].length<16)by[m.equipmentId].push(m)}state.profile.memories=Object.values(by).flat();save();localVisionLast={stage:'learn',equipmentId:id,before,after:state.profile.memories.length,learned:Math.max(0,state.profile.memories.length-before),frameCount:state.frames.length,framesWithSignature:state.frames.filter(f=>!!(f.fp||f.sig)).length}}
window.__AXIS_LOCAL_VISION__={snapshot:localVisionSnapshot,guess:()=>localVisionLast};
function reviewFrames(){`;
src=src.replace(re,replacement);
if(!src.includes('window.__AXIS_LOCAL_VISION__={snapshot:localVisionSnapshot'))fail('diagnostic surface missing');
if(!src.includes("localVisionLast={stage:'learn'"))fail('learning diagnostic missing');
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8.2 local vision] PASS · deterministic learn/guess diagnostics exposed without changing recognition thresholds');
