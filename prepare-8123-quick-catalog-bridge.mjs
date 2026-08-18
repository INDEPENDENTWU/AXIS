import fs from 'node:fs';

const FILE='v61.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 quick catalog bridge] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const old="function chooseQuick(id){$('#quickRecordSheet')?.classList.remove('show');$('#equipmentRow')?.click();setTimeout(()=>{const b=$$('#eqSheet [data-eq]').find(x=>x.dataset.eq===id);if(b){b.click();setTimeout(()=>showQuickEditor(id),0)}},0)}";
const next="function chooseQuick(id){$('#quickRecordSheet')?.classList.remove('show');if(window.__AXIS_SELECT_EQUIPMENT__?.(id,true)){setTimeout(()=>showQuickEditor(id),0);return}$('#equipmentRow')?.click();let mountTries=0;const resolve=()=>{const direct=$$('#eqSheet [data-eq]').find(x=>x.dataset.eq===id),lib=$$('#eqSheet [data-v877-lib]').find(x=>x.dataset.v877Lib===id),b=direct||lib;if(!b){if(mountTries++<40)setTimeout(resolve,25);return}b.click();let selectTries=0;const open=()=>{const e=selected();if(e&&(e.id===id||e.name&&e.name!=='待确认')){showQuickEditor(id);return}if(selectTries++<40)setTimeout(open,25)};setTimeout(open,0)};setTimeout(resolve,0)}";
const count=src.split(old).length-1;if(count!==1)fail(`quick chooser contract expected once, found ${count}`);
src=src.replace(old,next);
const marker="try{window.__AXIS_8123_QUICK_CATALOG_BRIDGE__={version:'8.12.3',recentToCanonical:true,directSelectionApi:true,nativeSelector:'data-eq',librarySelector:'data-v877-lib',waitsForCatalogFallback:true,waitsForSelectionFallback:true}}catch{}\n";
const end=src.lastIndexOf('})();');if(end<0)fail('v61 IIFE end missing');src=src.slice(0,end)+marker+src.slice(end);
for(const needle of ['__AXIS_8123_QUICK_CATALOG_BRIDGE__',"directSelectionApi:true","data-v877-lib","waitsForCatalogFallback:true"])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 quick catalog bridge] PASS · Quick Record selects canonical/history/custom IDs directly; catalog rendering is fallback only');