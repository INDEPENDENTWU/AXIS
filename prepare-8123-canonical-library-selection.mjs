import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 canonical catalog selection] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const FILE='app.js';let src=fs.readFileSync(FILE,'utf8');
 const oldEq="function eqById(id){return eqAll().find(e=>e.id===id)}";
 const newEq="function eqById(id){const own=eqAll().find(e=>e.id===id);if(own)return own;const x=(window.__AXIS_873_LIBRARY__||[]).find(e=>e.id===id);if(!x)return null;const muscles=[...(x.muscles||[])];return{id:x.id,name:x.name,type:x.type||'strength',pattern:derivePattern(x.type||'strength',muscles),muscles,effect:muscles.slice(0,2).join(' · '),canonical:true}}";
 src=once(src,oldEq,newEq,'canonical library resolver');
 const select="function selectEq(id,manual=true){const e=eqById(id);if(!e)return;state.selectedEq=id;setText('#equipmentName',e.name);$('#strengthFields').classList.toggle('hidden',e.type!=='strength');$('#cardioFields').classList.toggle('hidden',e.type!=='cardio');renderMuscles(e);const last=lastEvent(id);$('#lastValue').classList.toggle('hidden',!last);if(last)setText('#lastValue','上次 '+eventMeta(last));applyEqDefaults(e,last);if(manual)setText('#aiStatus','已确认')}";
 const exposed=select+"\nwindow.__AXIS_SELECT_EQUIPMENT__=(id,manual=true)=>{if(!eqById(id))return false;selectEq(id,manual);return true};try{window.__AXIS_8123_CANONICAL_SELECTION__={version:'8.12.3',owner:'app-selectEq',libraryFirstClass:true,customFallback:false}}catch{}";
 src=once(src,select,exposed,'selection API exposure');
 try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

{
 const FILE='v877-runtime.js';let src=fs.readFileSync(FILE,'utf8');
 const old="async function chooseLib(id){const item=LIB.find(x=>x.id===id);if(!item)return;const eqSheet=$('#eqSheet');if(eqSheet)eqSheet.classList.add('v877Preparing');try{const existing=$$('#eqSheet [data-eq]').find(b=>b.textContent.trim().includes(item.name));if(existing){existing.click();return}if(item.baseId){const b=$(`#eqSheet [data-eq=\"${item.baseId}\"]`);if(b){b.click();return}}$('#addCustomEq')?.click();await new Promise(r=>setTimeout(r,65));const input=$('#customName');if(!input)return;input.value=item.name;input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,130));$('#saveCustomEq')?.click()}finally{setTimeout(()=>eqSheet?.classList.remove('v877Preparing'),260)}}";
 const next="async function chooseLib(id){const item=LIB.find(x=>x.id===id);if(!item)return;const eqSheet=$('#eqSheet');if(eqSheet)eqSheet.classList.add('v877Preparing');try{const target=item.baseId||item.id;if(window.__AXIS_SELECT_EQUIPMENT__?.(target,true)){eqSheet?.classList.remove('show');return}const existing=$$('#eqSheet [data-eq]').find(b=>b.dataset.eq===target||b.textContent.trim().includes(item.name));if(existing){existing.click();return}$('#addCustomEq')?.click();await new Promise(r=>setTimeout(r,65));const input=$('#customName');if(!input)return;input.value=item.name;input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,130));$('#saveCustomEq')?.click()}finally{setTimeout(()=>eqSheet?.classList.remove('v877Preparing'),260)}}";
 src=once(src,old,next,'library selection route');
 try{new Function(src)}catch(e){fail(`v877 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}
console.log('[AXIS 8.12.3 canonical catalog selection] PASS · library items select through app state directly; canonical IDs remain authoritative and custom creation is fallback only');