import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.21 product convergence proof] ${m}`)};
const app='app.js',css='styles.css',v874='v874-professional.js';
let s=fs.readFileSync(app,'utf8');
const from="pickerOwner:'existing-eqSheet-select-only',recordingOwner:'existing-v61+app'";
const to="pickerOwner:'existing-eqSheet',pickerMode:'select-only',recordingOwner:'existing-v61+app'";
const n=s.split(from).length-1;if(n!==1)fail(`surface picker provenance expected once, found ${n}`);s=s.replace(from,to);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}fs.writeFileSync(app,s);
const checks=[
 [app,["mode:'select',owner:'flow'","context.mode==='select'",'flowAddDoesNotRecord:true',"pickerMode:'select-only'",'selectOnly:true']],
 [v874,['axis821PropertyGroups','axis821PropertyRow','axis821NativeAddRow']],
 [css,['AXIS 8.21 Product Convergence','.axis821PropertyRow{width:100%','.axis821Stepper{height:64px']]
];
for(const [f,tokens] of checks){const x=fs.readFileSync(f,'utf8');for(const t of tokens)if(!x.includes(t))fail(`${f} missing ${t}`)}
console.log('[AXIS 8.21 product convergence proof] PASS · existing eqSheet owner preserved · select-only mode explicit · native property rows + Group Plan geometry sealed');

await import('./prepare-821-flow-experience-convergence.mjs');
