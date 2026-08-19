import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.4 catalog history compat] ${m}`)};
const once=(src,a,b,label)=>{const n=src.split(a).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(a,b)};
let src=fs.readFileSync(FILE,'utf8');

const from="if(!x)return null;const muscles=[...(x.muscles||[])];return{id:x.id";
const to="if(!x){const h=allEvents().find(e=>e.equipmentId===id);if(h)return{id:h.equipmentId,name:h.name,type:h.kind||'strength',pattern:h.pattern||derivePattern(h.kind||'strength',h.muscles||[]),muscles:[...(h.muscles||[])],effect:h.effect||'',canonical:true,historyFallback:true,detailMuscles:[],primaryTargets:[],secondaryTargets:[],stabilizers:[],bodyRegions:[],movementPattern:h.pattern||'',equipmentClass:'历史项目',targetKind:'movement',targetConfidence:'history'};return null}const muscles=[...(x.muscles||[])];return{id:x.id";
src=once(src,from,to,'history-backed enriched resolver');

if(!src.includes('historyFallback:true'))fail('8.12.4 history fallback marker missing after enrichment');
try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 catalog history compat] PASS · enriched native lookup retains history-only identity fallback');
