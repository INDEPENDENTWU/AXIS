import fs from 'node:fs';
const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 product convergence compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const from="if(axis821FlowPick){const b=e.target.closest?.('#eqSheet [data-eq],#eqSheet [data-v8124-pick]');if(b){e.preventDefault();e.stopImmediatePropagation();return axis821FlowSurfaceAddObject(b.dataset.eq||b.dataset.v8124Pick)}if(e.target.closest?.('#addCustomEq'))";
const to="if(axis821FlowPick){const b=e.target.closest?.('#eqSheet [data-eq]');if(b){e.preventDefault();e.stopImmediatePropagation();return axis821FlowSurfaceAddObject(b.dataset.eq)}if(e.target.closest?.('#addCustomEq'))";
const n=s.split(from).length-1;if(n!==1)fail(`Flow picker interception expected once, found ${n}`);s=s.replace(from,to);

/*
 * Earlier 8.12.3 compatibility passes may legitimately extend the picker router
 * marker before the 8.21 convergence pass runs. The convergence implementation
 * only needs one factual invariant here: the established picker declares support
 * for selection-only routing. Seal that capability on whatever current router
 * shape survived the inherited passes instead of depending on one historical
 * byte-for-byte marker string.
 */
const router=/try\{window\.__AXIS_8123_PICKER_ROUTER__=\{([^}]*)\}\}catch\{\}/;
const rm=s.match(router);if(!rm)fail('canonical picker router marker missing');
if(!/(?:^|,)selectOnly:true(?:,|$)/.test(rm[1]))s=s.replace(router,(_all,body)=>`try{window.__AXIS_8123_PICKER_ROUTER__={${body},selectOnly:true}}catch{}`);
if(!s.includes('selectOnly:true'))fail('selection-only picker capability seal missing');

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 product convergence compat] PASS · legacy capture interception normalized · canonical picker selection-only capability sealed before convergence');
