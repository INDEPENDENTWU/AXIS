import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment selection stability] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_EQUIPMENT_MEMORY__'))fail('equipment memory must run first');
const from="if(manageEqSelectMode){manageEqSelected.has(id)?manageEqSelected.delete(id):manageEqSelected.add(id);renderManageEq();return}";
const to="if(manageEqSelectMode){manageEqSelected.has(id)?manageEqSelected.delete(id):manageEqSelected.add(id);row.querySelector('.v8123EqDot')?.classList.toggle('on',manageEqSelected.has(id));const batch=$('#v8123EqBatch [data-my-eq-batch]');if(batch){batch.disabled=!manageEqSelected.size;batch.textContent='移除 '+manageEqSelected.size+' 项'}return}";
const count=src.split(from).length-1;
if(count!==1)fail(`selection rerender boundary expected once, found ${count}`);
src=src.replace(from,to);
const marker="try{window.__AXIS_8123_EQUIPMENT_SELECTION_STABLE__={version:'8.12.3',rowDomStable:true,selectionRerender:false}}catch{}\n";
const anchor="try{window.__AXIS_8123_EQUIPMENT_MEMORY__=";
const i=src.indexOf(anchor);if(i<0)fail('equipment memory marker missing');
const lineEnd=src.indexOf('\n',i);if(lineEnd<0)fail('equipment memory marker boundary missing');
src=src.slice(0,lineEnd+1)+marker+src.slice(lineEnd+1);
for(const needle of ['selectionRerender:false','rowDomStable:true'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 equipment selection stability] PASS · selection toggles in place · no row DOM replacement while selecting');
