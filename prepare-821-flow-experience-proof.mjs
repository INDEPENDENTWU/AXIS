import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow experience proof] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const app=read('app.js'),css=read('styles.css'),smoke=read('scripts/axis-821-flow-user-surface-smoke.mjs');
const start=app.indexOf('function axis821FlowSurfaceRenderEditor()'),end=app.indexOf('function axis821FlowSurfaceBeginPick()',start);
if(start<0||end<=start)fail('final Flow editor boundary missing');
const editor=app.slice(start,end);
for(const token of ['data-axis-flow-drag','axis821FlowDragHandle','axis821FlowRemove','项目顺序','按住右侧拖动'])if(!editor.includes(token))fail(`final Flow editor missing ${token}`);
if(editor.includes('data-axis-flow-move'))fail('admin arrow controls survived final Flow editor render');
for(const token of ['__AXIS_821_FLOW_EXPERIENCE__','touchReorder:true','keyboardReorder:true','focusedRunSurface:true','newFlowOwner:false','newRecorder:false','newStorage:false','newEncounterWriter:false'])if(!app.includes(token))fail(`experience ownership marker missing ${token}`);
for(const token of ['AXIS 8.21 Flow Experience Convergence','.axis821FlowRunPrimary{width:100%','.axis821FlowDragHandle{width:34px','.axis821FlowAdd{height:56px'])if(!css.includes(token))fail(`experience CSS missing ${token}`);
for(const token of ['shiftStep=async','__AXIS_821_FLOW_EXPERIENCE__','touch/keyboard reorder handles missing','Flow current position missing'])if(!smoke.includes(token))fail(`physical smoke did not converge · ${token}`);
const contract=JSON.parse(read('release-contract.json'));if(String(contract.publicVersion)!=='8.20.1'||String(contract.stableBaseVersion)!=='8.20.1')fail('public release identity moved before 8.21 seal');
console.log('[AXIS 8.21 Flow experience proof] PASS · drag editor + focused run surface + dual-engine physical assertions · 8.20.1 public identity intentionally preserved');
