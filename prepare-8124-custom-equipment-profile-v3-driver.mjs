import fs from 'node:fs';

const PREP='prepare-8124-custom-equipment-profile-v2.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom equipment v3] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const original=read(PREP);
const obsolete=" src=onceRe(src,/function renderManageEq\\(\\)\\{[^\\n]*\\}/g,rename(generatedRenderManageEq,'renderManageEq'),'custom list recording summary');\n";
let prepared=once(original,obsolete,'','retire pre-polish renderManageEq replacement');
write(PREP,prepared);
let ok=false;
try{await import('./prepare-8124-custom-equipment-profile-v2.mjs');ok=true}finally{write(PREP,original)}
if(!ok)fail('v2 transform did not complete');

/* Personal-library Settings rows were already upgraded by 8.12.3; decorate their metadata at runtime instead of replacing that owner. */
{
 const FILE='app.js';let src=read(FILE);if(!src.includes('__AXIS_8124_CUSTOM_EQUIPMENT_PROFILE__'))fail('v2 runtime marker missing');
 const end=src.lastIndexOf('})();');if(end<0)fail('app IIFE end missing');
 const block=String.raw`
const axis8124RenderManageEqBase=renderManageEq;
renderManageEq=function(){axis8124RenderManageEqBase();const labels={weight:'重量',reps:'次数',duration:'时间',intensity:'强度',level:'档位'};for(const row of $$('#manageEqList [data-my-eq-id],#manageEqList [data-edit-eq]')){const id=row.dataset.myEqId||row.dataset.editEq,e=(state.profile.customEq||[]).find(x=>x.id===id);if(!e)continue;const metric=(e.recording?.metrics||[]).map(x=>labels[x]).filter(Boolean).join(' · ');if(!metric)continue;const secondary=row.querySelector('small,.v8123EqMeta,span span');if(secondary&&!String(secondary.textContent||'').trim())secondary.textContent=metric}}
try{window.__AXIS_8124_CUSTOM_EQUIPMENT_V3__={version:'8.12.4',personalLibraryOwnerPreserved:true,recordingProfileMetadata:true,trainingOwner:false}}catch{}
`;
 src=src.slice(0,end)+block+'\n'+src.slice(end);syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.12.4 custom equipment v3] PASS · existing personal-library render owner preserved · recording-profile metadata additive');
