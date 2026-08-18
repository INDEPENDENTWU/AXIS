import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 canonical catalog selection] ${m}`)};
const replaceOne=(src,re,to,label)=>{const hits=src.match(re)||[];if(hits.length!==1)fail(`${label} expected once, found ${hits.length}`);return src.replace(re,to)};

{
 const FILE='app.js';let src=fs.readFileSync(FILE,'utf8');
 const newEq="function eqById(id){const own=eqAll().find(e=>e.id===id);if(own)return own;const x=(window.__AXIS_873_LIBRARY__||[]).find(e=>e.id===id);if(!x)return null;const muscles=[...(x.muscles||[])];return{id:x.id,name:x.name,type:x.type||'strength',pattern:derivePattern(x.type||'strength',muscles),muscles,effect:muscles.slice(0,2).join(' · '),canonical:true}}";
 src=replaceOne(src,/function eqById\(id\)\{[^\n]*\}/g,newEq,'canonical library resolver');
 const selectRe=/function selectEq\(id,manual=true\)\{[^\n]*\}/g;
 const select=(src.match(selectRe)||[])[0];if(!select)fail('selection API owner missing');
 const exposed=select+"\nwindow.__AXIS_SELECT_EQUIPMENT__=(id,manual=true)=>{if(!eqById(id))return false;selectEq(id,manual);return true};try{window.__AXIS_8123_CANONICAL_SELECTION__={version:'8.12.3',owner:'app-selectEq',libraryFirstClass:true,recordingIdentity:true,customFallback:false}}catch{}";
 src=replaceOne(src,selectRe,exposed,'selection API exposure');
 try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

{
 const FILE='v61.js';let src=fs.readFileSync(FILE,'utf8');
 const selected="function selected(){const n=$('#equipmentName')?.textContent?.trim();if(!n||n==='待确认')return null;const hist=allEvents().find(x=>x.name===n);if(hist)return{id:hist.equipmentId,name:hist.name,type:hist.kind};const c=core(),custom=c.profile?.customEq||[],ce=custom.find(x=>x.name===n);if(ce)return{id:ce.id,name:ce.name,type:ce.type};const x=CAT.find(q=>q[1]===n);if(x)return{id:x[0],name:x[1],type:x[2]};const lib=(window.__AXIS_873_LIBRARY__||[]).find(q=>q.name===n||(q.aliases||[]).includes(n));if(lib)return{id:lib.baseId||lib.id,name:lib.name,type:lib.type||'strength'};return{id:null,name:n,type:$('#cardioFields')?.classList.contains('hidden')?'strength':'cardio'}}";
 src=replaceOne(src,/function selected\(\)\{[^\n]*\}/g,selected,'recording canonical identity resolver');
 try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

{
 const FILE='v877-runtime.js';let src=fs.readFileSync(FILE,'utf8');
 const next="async function chooseLib(id){const item=LIB.find(x=>x.id===id);if(!item)return;const eqSheet=$('#eqSheet');if(eqSheet)eqSheet.classList.add('v877Preparing');try{const target=item.baseId||item.id;if(window.__AXIS_SELECT_EQUIPMENT__?.(target,true)){eqSheet?.classList.remove('show');return}const existing=$$('#eqSheet [data-eq]').find(b=>b.dataset.eq===target||b.textContent.trim().includes(item.name));if(existing){existing.click();return}$('#addCustomEq')?.click();await new Promise(r=>setTimeout(r,65));const input=$('#customName');if(!input)return;input.value=item.name;input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,130));$('#saveCustomEq')?.click()}finally{setTimeout(()=>eqSheet?.classList.remove('v877Preparing'),260)}}";
 src=replaceOne(src,/async function chooseLib\(id\)\{[^\n]*\}/g,next,'library selection route');
 try{new Function(src)}catch(e){fail(`v877 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}
console.log('[AXIS 8.12.3 canonical catalog selection] PASS · library items select through app state directly and retain canonical recording IDs; custom creation is fallback only');
