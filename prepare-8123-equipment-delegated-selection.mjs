import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment delegated selection] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_EQUIPMENT_SELECTION_STABLE__'))fail('selection stability must run first');
if(src.includes('__AXIS_8123_EQUIPMENT_SELECTION_DELEGATED__'))fail('delegated selection already installed');
const anchor="try{window.__AXIS_8123_EQUIPMENT_SELECTION_STABLE__={version:'8.12.3',rowDomStable:true,selectionRerender:false}}catch{}";
const count=src.split(anchor).length-1;if(count!==1)fail(`selection marker expected once, found ${count}`);
const block=`${anchor}\n(function axis8123InstallEquipmentSelectionOwner(){\n if(window.__AXIS_8123_EQUIPMENT_SELECTION_DELEGATED__)return;\n const updateBatch=()=>{const batch=$('#v8123EqBatch [data-my-eq-batch]');if(batch){batch.disabled=!manageEqSelected.size;batch.textContent='移除 '+manageEqSelected.size+' 项'}};\n D.addEventListener('click',e=>{const row=e.target?.closest?.('#manageEqList [data-my-eq-id]');if(!row||!manageEqSelectMode)return;e.preventDefault();e.stopImmediatePropagation();const id=row.dataset.myEqId;if(!id)return;manageEqSelected.has(id)?manageEqSelected.delete(id):manageEqSelected.add(id);row.querySelector('.v8123EqDot')?.classList.toggle('on',manageEqSelected.has(id));updateBatch()},true);\n window.__AXIS_8123_EQUIPMENT_SELECTION_DELEGATED__={version:'8.12.3',owner:'document-capture',scope:'#manageEqList [data-my-eq-id]',selectionOnly:true,rowDomStable:true};\n})()`;
src=src.replace(anchor,block);
for(const needle of ['__AXIS_8123_EQUIPMENT_SELECTION_DELEGATED__',"owner:'document-capture'","scope:'#manageEqList [data-my-eq-id]'",'e.stopImmediatePropagation()'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 equipment delegated selection] PASS · one capture owner survives inline/row lifecycle while selection mode is active');
