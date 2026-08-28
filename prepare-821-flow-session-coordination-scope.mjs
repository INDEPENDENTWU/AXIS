import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Flow Session coordination scope] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');

/*
 * Flow Session coordination consumes private app/Flow helpers and state. Every
 * event/timer consumer therefore belongs in the same lexical region as the helper
 * block. Moving only axis:active-started was insufficient: the click, hold and UI
 * timer consumers still referenced D/$/state from the global tail and could abort
 * the app module during hardened isolation.
 *
 * Relocate the complete emitted consumer block as one unit. No private helper is
 * exported and no new event/state owner is introduced.
 *
 * The integrated Active projection also owns no Activity state. Its pause button
 * must delegate to the existing v87 Active API; resume keeps using the established
 * Flow conflict-safe begin/resume path so one-foreground+paused semantics remain
 * authoritative in v87.
 */
const emittedBlock=`window.addEventListener('axis:active-started',e=>axis821FlowOnActiveStarted(e?.detail));
D.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')){axis821FlowCloseSwitch();return}if(e.target.closest?.('[data-axis-flow-switch-confirm]')){axis821FlowConfirmSwitch();return}if(e.target.closest?.('[data-axis-flow-active-set]')){const id=state.flowRun?.currentEncounterId;if(id&&axis821FlowActiveApi()?.completeSet?.(id)){axis821FlowSurfaceRenderHome()}return}if(e.target.closest?.('[data-axis-flow-active-toggle]')){axis821BeginCurrentItem();return}},true);
D.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]');if(!b)return;const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi();if(!id||!api?.beginFinishHold?.(id,e))return;e.preventDefault();b.classList.add('holding')},true);
for(const type of ['pointerup','pointercancel'])D.addEventListener(type,e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]')||$('#axis821FlowHome [data-axis-flow-active-finish].holding');if(!b)return;b.classList.remove('holding');axis821FlowActiveApi()?.cancelFinishHold?.()},true);
clearInterval(axis821FlowUiTimer);axis821FlowUiTimer=setInterval(()=>{if(D.visibilityState==='visible'&&state.flowRun?.status==='active')axis821FlowSurfaceRenderHome?.()},1000);`;
const hits=s.split(emittedBlock).length-1;
if(hits!==1)fail(`coordination runtime consumer block expected once, found ${hits}`);
s=s.replace(emittedBlock,'');

const toggleHelper=`function axis821FlowToggleCurrentActive(){
 const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi(),own=id?api?.get?.(id):null;if(!id||!api||!own)return false;
 if(own.status==='active'){const ok=api.pause?.(id)===true;if(ok)axis821FlowSurfaceRenderHome?.();return ok}
 if(own.status==='paused')return axis821BeginCurrentItem();
 if(own.status==='finished')return axis821FlowOnActiveFinished(id);
 return false
}`;
if(s.includes('function axis821FlowToggleCurrentActive()'))fail('Flow Active toggle helper duplicated');

const runtimeBlock=`window.addEventListener('axis:active-started',e=>axis821FlowOnActiveStarted(e?.detail));
D.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')){axis821FlowCloseSwitch();return}if(e.target.closest?.('[data-axis-flow-switch-confirm]')){axis821FlowConfirmSwitch();return}if(e.target.closest?.('[data-axis-flow-active-set]')){const id=state.flowRun?.currentEncounterId;if(id&&axis821FlowActiveApi()?.completeSet?.(id)){axis821FlowSurfaceRenderHome()}return}if(e.target.closest?.('[data-axis-flow-active-toggle]')){axis821FlowToggleCurrentActive();return}},true);
D.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]');if(!b)return;const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi();if(!id||!api?.beginFinishHold?.(id,e))return;e.preventDefault();b.classList.add('holding')},true);
for(const type of ['pointerup','pointercancel'])D.addEventListener(type,e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]')||$('#axis821FlowHome [data-axis-flow-active-finish].holding');if(!b)return;b.classList.remove('holding');axis821FlowActiveApi()?.cancelFinishHold?.()},true);
clearInterval(axis821FlowUiTimer);axis821FlowUiTimer=setInterval(()=>{if(D.visibilityState==='visible'&&state.flowRun?.status==='active')axis821FlowSurfaceRenderHome?.()},1000);`;

const helperNames=[
 'function axis821FlowOnActiveStarted(detail)',
 'function axis821FlowCloseSwitch()',
 'function axis821FlowConfirmSwitch()',
 'function axis821FlowActiveApi()',
 'function axis821FlowSurfaceRenderHome()'
];
const anchor='function axis821BeginCurrentItem()';
const anchorAt=s.indexOf(anchor);
if(anchorAt<0)fail('Flow begin-current anchor missing');
for(const helper of helperNames){const at=s.indexOf(helper);if(at<0)fail(`private helper missing: ${helper}`);if(at>=anchorAt)fail(`private helper outside Flow item region: ${helper}`)}
s=s.slice(0,anchorAt)+toggleHelper+'\n'+runtimeBlock+'\n'+s.slice(anchorAt);

const placed=s.indexOf(runtimeBlock),toggleAt=s.indexOf(toggleHelper),newAnchorAt=s.indexOf(anchor),stateAt=s.indexOf('let state={'),appClose=s.indexOf('})();');
if(!(stateAt>=0&&stateAt<toggleAt&&toggleAt<placed&&placed<newAnchorAt&&newAnchorAt<appClose))fail('coordination consumers are not inside canonical app/Flow lexical owner');
if((s.split(runtimeBlock).length-1)!==1)fail('coordination runtime block duplication after relocation');
if((s.match(/function axis821FlowToggleCurrentActive\(/g)||[]).length!==1)fail('Flow Active toggle helper must exist exactly once');
const toggleFn=s.slice(toggleAt,placed);
if(!toggleFn.includes("own.status==='active'")||!toggleFn.includes('api.pause?.(id)===true'))fail('integrated Flow pause does not delegate to v87 Active owner');
if(!toggleFn.includes("own.status==='paused'")||!toggleFn.includes('axis821BeginCurrentItem()'))fail('integrated Flow resume lost conflict-safe coordination path');
for(const privateName of ['axis821FlowOnActiveStarted','axis821FlowCloseSwitch','axis821FlowConfirmSwitch','axis821FlowActiveApi','axis821FlowToggleCurrentActive']){
 if(s.includes(`window.${privateName}=`)||s.includes(`window['${privateName}']`))fail(`private Flow helper exported: ${privateName}`);
}
if(s.slice(appClose).includes("D.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')"))fail('Flow click consumer survives outside app owner');
if(s.slice(appClose).includes('axis821FlowUiTimer=setInterval'))fail('Flow UI timer survives outside app owner');
if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');

const marker="expectedDurationPlanning:true,flowActiveProjection:true";
if(!s.includes(marker))fail('Flow Session coordination capability marker missing');
s=s.replace(marker,"expectedDurationPlanning:true,flowActiveProjection:true,integratedToggleDelegatesActiveOwner:true,bootScopedCoordinationConsumers:true");

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Flow Session coordination scope] PASS · click/hold/timer consumers boot-scoped · projected pause delegates to v87 · resume remains conflict-safe · no private export · one Encounter append');
