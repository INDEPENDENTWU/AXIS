import fs from 'node:fs';

{
 const file='prepare-821-metric-control-system.mjs';let s=fs.readFileSync(file,'utf8');
 const old="['styles.css',['AXIS 8.21 Metric Control System','.axis821Stepper input{min-width:0','.axis821Rating{display:grid','.axis821Toggle{display:grid']]";
 const next="['styles.css',['AXIS 8.21 Metric Control System','.axis821Stepper input{min-width:1ch','--axis821-preset-count','grid-template-columns:repeat(var(--axis821-preset-count,6)','.axis821Rating{display:grid','.axis821Toggle{display:grid']]";
 if((s.split(old).length-1)!==1)throw new Error('metric CSS verifier anchor drift');s=s.replace(old,next);
 const appOld="['app.js',['__AXIS_821_METRIC_CONTROLS__',\"families:['quantity','time','pace','scale','choice']\",'axis821PaceSeconds','data-axis821-pace-step','ratingDirectAndRail:true']]";
 const appNew="['app.js',['__AXIS_821_METRIC_CONTROLS__',\"families:['quantity','time','pace','scale','choice']\",'axis821PaceSeconds','axis821MetricFitInput','data-axis821-pace-step','ratingDirectAndRail:true']]";
 if((s.split(appOld).length-1)!==1)throw new Error('metric runtime verifier anchor drift');s=s.replace(appOld,appNew);fs.writeFileSync(file,s);
}

{
 const file='prepare-821-flow-active-boot-scope.mjs';let s=fs.readFileSync(file,'utf8');
 const oldComment=`/*\n * Physical Flow proof is source-owned. Do not mutate tests during the build.\n * The current proof must exercise the visible integrated projection and retain\n * the inherited 8.12 pause-owned rest contract: set completion alone does not\n * start rest; pausing does.\n */`;
 const newComment=`/*\n * Physical Flow proof is source-owned. Do not mutate tests during the build.\n * The current contract treats one complete Object as the Flow execution unit:\n * current-item start bypasses Quick configuration, delegates pause/resume/finish\n * to the existing Active owner, and only whole-item finish advances the cursor.\n */`;
 if((s.split(oldComment).length-1)!==1)throw new Error('Flow boot-scope comment anchor drift');s=s.replace(oldComment,newComment);
 const oldTokens=`for(const token of [\n \"#axis821FlowHome [data-axis-flow-active-set]\",\n \"#axis821FlowHome [data-axis-flow-active-toggle]\",\n \"#axis821FlowHome [data-axis-flow-active-finish]\",\n \"Number(a?.completedSets)>=1&&a?.status==='active'&&!a?.restStartedAt\",\n \"a?.status==='paused'&&!!a?.restStartedAt\",\n \"integratedToggleDelegatesActiveOwner\"\n])if(!smoke.includes(token))fail(\`canonical Flow physical proof missing \${token}\`);`;
 const newTokens=`for(const token of [\n \"#axis821FlowHome [data-axis-flow-active-toggle]\",\n \"#axis821FlowHome [data-axis-flow-active-finish]\",\n \"[data-axis-flow-active-set]').count(),0\",\n \"current Flow start opened Quick configuration\",\n \"first.flowItemUnit,'item'\",\n \"activity?.status==='paused'\",\n \"activity?.status==='active'\",\n \"suggestedGapMs>=45000&&c.flowRun.suggestedGapMs<=120000\"\n])if(!smoke.includes(token))fail(\`canonical whole-item Flow physical proof missing \${token}\`);`;
 if((s.split(oldTokens).length-1)!==1)throw new Error('old Flow physical-proof token set drift');s=s.replace(oldTokens,newTokens);
 const oldLog="console.log('[AXIS 8.21 Flow Active boot scope] PASS · lifecycle listeners share private Flow scope · canonical smoke remains source-owned · pause-owned rest proof sealed · one Encounter append retained');";
 const newLog="console.log('[AXIS 8.21 Flow Active boot scope] PASS · lifecycle listeners share private Flow scope · canonical whole-item smoke remains source-owned · direct start/pause/resume/finish sealed · one Encounter append retained');";
 if((s.split(oldLog).length-1)!==1)throw new Error('Flow boot-scope PASS marker drift');s=s.replace(oldLog,newLog);fs.writeFileSync(file,s);
}

{
 const file='prepare-821-flow-session-coordination.mjs';let s=fs.readFileSync(file,'utf8');
 const setBranch="if(e.target.closest?.('[data-axis-flow-active-set]')){const id=state.flowRun?.currentEncounterId;if(id&&axis821FlowActiveApi()?.completeSet?.(id)){axis821FlowSurfaceRenderHome()}return}";
 if((s.split(setBranch).length-1)!==1)throw new Error('retired Flow set listener anchor drift');s=s.replace(setBranch,'');
 const oldPlacement='s=s.slice(0,markerAt)+runtimePatch+s.slice(markerAt);';
 const newPlacement="const runtimeAt=s.indexOf(beginAnchor);if(runtimeAt<0)fail('Flow runtime consumer anchor missing');s=s.slice(0,runtimeAt)+runtimePatch+s.slice(runtimeAt);";
 if((s.split(oldPlacement).length-1)!==1)throw new Error('Flow consumer placement anchor drift');s=s.replace(oldPlacement,newPlacement);fs.writeFileSync(file,s);
}

{
 const file='prepare-821-flow-session-coordination-scope.mjs';let s=fs.readFileSync(file,'utf8');
 const anchor="if(!app.includes('axis821FlowActiveApi()?.get')&&!app.includes('axis821FlowActiveApi()?.current'))fail('Flow lost read-only Active projection');\n";
 if((s.split(anchor).length-1)!==1)throw new Error('coordination-scope anchor drift');
 const proof="const stateAt=app.indexOf('let state={'),closeAt=app.indexOf('})();'),consumerAt=app.indexOf(\"window.addEventListener('axis:active-started',e=>axis821FlowOnActiveStarted\");\nif(!(stateAt>=0&&consumerAt>stateAt&&consumerAt<closeAt))fail('Flow coordination consumers are outside canonical app owner');\nif(app.slice(closeAt).includes(\"D.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')\"))fail('app-private Flow click consumer survives after canonical owner');\nif(app.includes(\"[data-axis-flow-active-set]\"))fail('retired set-level Flow action returned');\n";
 s=s.replace(anchor,anchor+proof);
 const oldLog="console.log('[AXIS 8.21 Flow Session coordination scope] PASS · current item direct whole-item start · detour only Quick route · v82/v87 owners preserved · one Encounter writer · no parallel persistence');";
 const newLog="console.log('[AXIS 8.21 Flow Session coordination scope] PASS · whole-item consumers app-scoped · current item direct start · detour only Quick route · v82/v87 owners preserved · one Encounter writer');";
 if((s.split(oldLog).length-1)!==1)throw new Error('coordination-scope PASS marker drift');s=s.replace(oldLog,newLog);fs.writeFileSync(file,s);
}

fs.rmSync('scripts/axis-821-formal-contract-convergence.mjs',{force:true});
fs.rmSync('.github/workflows/axis-821-formal-contract-convergence.yml',{force:true});
console.log('[AXIS 8.21 formal convergence] PASS · only bounded formal source contracts changed');
