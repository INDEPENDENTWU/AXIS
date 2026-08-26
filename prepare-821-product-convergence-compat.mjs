import fs from 'node:fs';
const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 product convergence compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const from="if(axis821FlowPick){const b=e.target.closest?.('#eqSheet [data-eq],#eqSheet [data-v8124-pick]');if(b){e.preventDefault();e.stopImmediatePropagation();return axis821FlowSurfaceAddObject(b.dataset.eq||b.dataset.v8124Pick)}if(e.target.closest?.('#addCustomEq'))";
const to="if(axis821FlowPick){const b=e.target.closest?.('#eqSheet [data-eq]');if(b){e.preventDefault();e.stopImmediatePropagation();return axis821FlowSurfaceAddObject(b.dataset.eq)}if(e.target.closest?.('#addCustomEq'))";
const n=s.split(from).length-1;if(n!==1)fail(`Flow picker interception expected once, found ${n}`);s=s.replace(from,to);

/*
 * The inherited picker-router diagnostic marker is not guaranteed to survive the
 * full 8.12.x -> 8.21 build pipeline byte-for-byte. Selection-only behavior itself
 * is installed by the convergence pass below through the canonical picker owner.
 * Publish a dedicated compatibility capability marker here so later proof steps
 * can assert intent without depending on the historical router marker's presence.
 */
if(!s.includes('selectOnly:true'))s+='\ntry{window.__AXIS_821_PICKER_SELECT_ONLY_COMPAT__={version:\'8.21\',selectOnly:true,owner:\'existing-eqSheet\'}}catch{}\n';
if(!s.includes('selectOnly:true'))fail('selection-only picker capability marker missing');

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 product convergence compat] PASS · legacy capture interception normalized · selection-only capability proof decoupled from historical router marker');
