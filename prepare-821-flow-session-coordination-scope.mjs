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
 */
const runtimeBlock=`window.addEventListener('axis:active-started',e=>axis821FlowOnActiveStarted(e?.detail));
D.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')){axis821FlowCloseSwitch();return}if(e.target.closest?.('[data-axis-flow-switch-confirm]')){axis821FlowConfirmSwitch();return}if(e.target.closest?.('[data-axis-flow-active-set]')){const id=state.flowRun?.currentEncounterId;if(id&&axis821FlowActiveApi()?.completeSet?.(id)){axis821FlowSurfaceRenderHome()}return}if(e.target.closest?.('[data-axis-flow-active-toggle]')){axis821BeginCurrentItem();return}},true);
D.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]');if(!b)return;const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi();if(!id||!api?.beginFinishHold?.(id,e))return;e.preventDefault();b.classList.add('holding')},true);
for(const type of ['pointerup','pointercancel'])D.addEventListener(type,e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]')||$('#axis821FlowHome [data-axis-flow-active-finish].holding');if(!b)return;b.classList.remove('holding');axis821FlowActiveApi()?.cancelFinishHold?.()},true);
clearInterval(axis821FlowUiTimer);axis821FlowUiTimer=setInterval(()=>{if(D.visibilityState==='visible'&&state.flowRun?.status==='active')axis821FlowSurfaceRenderHome?.()},1000);`;
const hits=s.split(runtimeBlock).length-1;
if(hits!==1)fail(`coordination runtime consumer block expected once, found ${hits}`);
s=s.replace(runtimeBlock,'');

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
s=s.slice(0,anchorAt)+runtimeBlock+'\n'+s.slice(anchorAt);

const placed=s.indexOf(runtimeBlock),newAnchorAt=s.indexOf(anchor),stateAt=s.indexOf('let state={'),appClose=s.indexOf('})();');
if(!(stateAt>=0&&stateAt<placed&&placed<newAnchorAt&&newAnchorAt<appClose))fail('coordination consumers are not inside canonical app/Flow lexical owner');
if((s.split(runtimeBlock).length-1)!==1)fail('coordination runtime block duplication after relocation');
for(const privateName of ['axis821FlowOnActiveStarted','axis821FlowCloseSwitch','axis821FlowConfirmSwitch','axis821FlowActiveApi']){
 if(s.includes(`window.${privateName}=`)||s.includes(`window['${privateName}']`))fail(`private Flow helper exported: ${privateName}`);
}
if(s.slice(appClose).includes("D.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')"))fail('Flow click consumer survives outside app owner');
if(s.slice(appClose).includes('axis821FlowUiTimer=setInterval'))fail('Flow UI timer survives outside app owner');
if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');

const marker="expectedDurationPlanning:true,flowActiveProjection:true";
if(!s.includes(marker))fail('Flow Session coordination capability marker missing');
s=s.replace(marker,"expectedDurationPlanning:true,flowActiveProjection:true,bootScopedCoordinationConsumers:true");

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Flow Session coordination scope] PASS · all coordination click/hold/timer consumers share private Flow lexical region · no private export · one Encounter append');
