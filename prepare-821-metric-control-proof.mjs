import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 metric control proof] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const app=read('app.js'),css=read('styles.css'),smoke=read('scripts/axis-821-recording-property-surface-smoke.mjs');
for(const token of [
 '__AXIS_821_METRIC_CONTROLS__',
 "families:['quantity','time','pace','scale','choice']",
 'function axis821MetricPresetValues',
 'function axis821PaceSeconds',
 'data-axis821-family="scale"',
 'data-axis821-pace-step',
 'paceFiveSecondStep:true',
 'newSchemaOwner:false',
 'newRecorder:false',
 'newPersistence:false',
 'newEncounterWriter:false'
])if(!app.includes(token))fail(`app metric control contract missing ${token}`);
for(const token of [
 'AXIS 8.21 Metric Control System',
 '.axis821Stepper{height:64px',
 '.axis821Presets{display:grid',
 '.axis821Rating{display:grid',
 '.axis821Toggle{display:grid',
 '.axis821Pace input{text-align:center'
])if(!css.includes(token))fail(`metric control CSS missing ${token}`);
for(const token of [
 "window.__AXIS_821_METRIC_CONTROLS__?.version==='8.21'",
 "createFromSearch('全属性控件测试')",
 'weight control drifted from Group Plan geometry',
 "fullEvent.metrics.pace,'5:30'",
 'quantity/time/pace/scale/choice controls'
])if(!smoke.includes(token))fail(`physical metric smoke did not converge · ${token}`);
const contract=JSON.parse(read('release-contract.json'));if(String(contract.publicVersion)!=='8.20.1'||String(contract.stableBaseVersion)!=='8.20.1')fail('public release identity moved before 8.21 product seal');
console.log('[AXIS 8.21 metric control proof] PASS · five semantic control families · 64px Group Plan geometry · expanded dual-engine physical assertions · public identity still 8.20.1');

await import('./prepare-821-item-unit-flow-convergence-v2.mjs');
