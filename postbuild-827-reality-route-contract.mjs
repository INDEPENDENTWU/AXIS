import fs from 'node:fs';

const fail=m=>{throw new Error('[AXIS 8.27 Reality Route contract] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js'),css=read('axis-style.css'),core=read('lib/axis-reality-route.mjs');

const inherited828=info.version==='8.28'&&info.baseVersion==='8.28';
const inherited829=info.version==='8.29'&&info.baseVersion==='8.29';
if(!(info.version==='8.27'&&info.baseVersion==='8.27')&&!inherited828&&!inherited829)fail('release identity '+info.version+'/'+info.baseVersion);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');

for(const gate of ['activeContinuity826','activeRestState8261','activeRestSelectorBinding8262','activeRestConvergence8263','activeRestUtilityRail8264','recordingReviewGeometry8265'])if(info.gates?.[gate]!==true)fail('inherited gate missing '+gate);

for(const marker of [
  '__AXIS_827_REALITY_ROUTE__',
  "schema:'axis.reality-route.v1'",
  "constraintSchema:'axis.execution-constraints.v1'",
  'axis827Core.projectRealityRoute',
  'axis827RealityProjection',
  'axis827DeferCurrent',
  'temporaryConstraints',
  'deferCurrent=axis827DeferCurrent',
  'data-axis-flow-defer',
  '稍后'
])if(!runtime.includes(marker))fail('runtime marker missing '+marker);

for(const marker of ['AXIS 8.27 — Reality Route','[data-axis-flow-defer]','[data-substate="deferred-return"]'])if(!css.includes(marker))fail('Reality Route CSS missing '+marker);

for(const forbidden of ['window.','document.','localStorage','indexedDB','fetch(','XMLHttpRequest','WebSocket','navigator.'])if(core.includes(forbidden))fail('pure core contains platform dependency '+forbidden);

if((runtime.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership changed');
for(const forbidden of ['axis_route_','axis_reality_route_'])if(runtime.includes(forbidden))fail('new persistence namespace detected '+forbidden);
const inheritedMediaDbOwners=(runtime.match(/indexedDB\.open\(DB,1\)/g)||[]).length;
if(inheritedMediaDbOwners!==1)fail('existing media IndexedDB ownership drifted · '+inheritedMediaDbOwners);

info.gates=info.gates||{};
Object.assign(info.gates,{
  realityRoute827:true,
  realityRoutePureProjection827:true,
  realityRouteTemporaryDefer827:true,
  realityRouteFlowIntentImmutable827:true,
  realityRouteEncounterTruthImmutable827:true,
  realityRouteNoNewStorage827:true,
  realityRouteExistingOwnersPreserved827:true
});
info.axis827={
  release:true,
  scope:'reality-route',
  projection:{schema:'axis.reality-route.v1',pureOwner:'lib/axis-reality-route.mjs',currentNextRemainingDeferred:true,reasonCodes:true},
  constraints:{schema:'axis.execution-constraints.v1',storage:'axis_v60_state.flowRun.temporaryConstraints',deferCurrentOnlyBeforeStart:true,deferredReturnsAfterImmediateRoute:true},
  ownership:{flowDefinitionMutation:false,historicalEncounterRewrite:false,newStorage:false,newSessionWriter:false,newEncounterWriter:false,newRecorder:false,newActiveOwner:false,network:false,ai:false}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');

await import('./scripts/axis-827-reality-route-contract.mjs');
await import('./scripts/axis-827-governance-compat.mjs');

console.log('[AXIS 8.27 Reality Route contract] PASS · pure projection · bounded temporary defer · existing factual owners preserved · canonical single runtime unchanged'+(inherited828?' · inherited by 8.28':''));
if(inherited828||inherited829)await import('./postbuild-828-practice-loop-contract.mjs');
