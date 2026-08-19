import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const fail=(m)=>{throw new Error(`[AXIS cross-platform foundation] ${m}`)};
const readJson=(f)=>JSON.parse(fs.readFileSync(f,'utf8'));
const ROOT=process.cwd();

const requiredDocs=[
  'docs/DOMAIN_CONTRACT.md',
  'docs/DATA_CONTRACT.md',
  'docs/PLATFORM_CONTRACT.md',
  'docs/IOS_ARCHITECTURE.md',
  'docs/AI_DEVELOPMENT_PROTOCOL.md',
  'docs/RELEASE_PROCESS.md',
  'docs/MIGRATION_POLICY.md',
  'docs/INCIDENT_POLICY.md',
  'docs/decisions/ADR-0001-web-ios-separate-shells.md',
  'docs/decisions/ADR-0002-contract-fixture-gate.md',
  'docs/decisions/ADR-0003-event-journal-after-domain-stability.md'
];
for(const f of requiredDocs)if(!fs.existsSync(path.join(ROOT,f)))fail(`missing ${f}`);

const manifest=readJson(path.join(ROOT,'shared/contracts/axis-contract-manifest.json'));
assert.equal(manifest.schema,'axis.contract-manifest.v1');
assert.equal(manifest.domain,'axis.domain.v1');
assert.equal(manifest.data,'axis.data.v1');
assert.equal(manifest.exchange,'axis.exchange.v1');
assert.equal(manifest.event,'axis.event.v1');
for(const [k,v] of Object.entries(manifest.invariants||{}))assert.equal(v,true,`manifest invariant ${k} is not sealed true`);

const eventSchema=readJson(path.join(ROOT,'shared/contracts/axis-event-v1.schema.json'));
const exchangeSchema=readJson(path.join(ROOT,'shared/contracts/axis-exchange-v1.schema.json'));
assert.equal(eventSchema.$id,'axis.event.v1');
assert.equal(exchangeSchema.$id,'axis.exchange.v1');

const closeOpen=(a,t)=>{
  const x=a.intervals.at(-1);
  if(x&&x.end==null)x.end=t;
};
const getActivity=(state,id,payload={})=>{
  let a=state.activities.get(id);
  if(!a){
    a={id,kind:payload.kind||'strength',plannedSets:Number(payload.plannedSets)||0,completedSets:0,status:'idle',intervals:[]};
    state.activities.set(id,a);
  }
  if(payload.kind)a.kind=payload.kind;
  if(Number.isFinite(Number(payload.plannedSets))&&Number(payload.plannedSets)>0)a.plannedSets=Number(payload.plannedSets);
  return a;
};
const switchAway=(state,targetId,t)=>{
  for(const a of state.activities.values()){
    if(a.id===targetId||a.status!=='active')continue;
    closeOpen(a,t);
    const completeStrength=a.kind==='strength'&&a.plannedSets>0&&a.completedSets>=a.plannedSets;
    a.status=completeStrength?'finished':'paused';
  }
};
const applyEvent=(state,e)=>{
  if(state.eventIds.has(e.id))return;
  state.eventIds.add(e.id);
  const t=Number(e.occurredAt);
  if(!Number.isFinite(t)||t<0)fail(`invalid time for ${e.id}`);
  switch(e.type){
    case 'workoutStarted':
      if(state.sessionStart==null)state.sessionStart=t;
      break;
    case 'activityStarted':
    case 'activityResumed':{
      if(!e.activityId)fail(`${e.type} missing activityId`);
      switchAway(state,e.activityId,t);
      const a=getActivity(state,e.activityId,e.payload);
      if(a.status==='finished')fail(`cannot resume finished activity ${a.id}`);
      closeOpen(a,t);
      a.intervals.push({start:t,end:null});
      a.status='active';
      break;
    }
    case 'activityPaused':{
      const a=getActivity(state,e.activityId,e.payload);closeOpen(a,t);a.status='paused';break;
    }
    case 'activityFinished':{
      const a=getActivity(state,e.activityId,e.payload);closeOpen(a,t);a.status='finished';break;
    }
    case 'setCompleted':{
      const a=getActivity(state,e.activityId,e.payload);a.completedSets+=1;break;
    }
    case 'equipmentSelected':
      break;
    case 'workoutFinished':
      for(const a of state.activities.values())if(a.status==='active'){closeOpen(a,t);a.status='finished'}
      state.sessionEnd=t;
      break;
    default: fail(`unknown event ${e.type}`);
  }
};
const duration=(a)=>a.intervals.reduce((n,x)=>n+Math.max(0,(x.end??x.start)-x.start),0);
const mergedDuration=(activities)=>{
  const ranges=[];
  for(const a of activities)for(const x of a.intervals)if(x.end!=null&&x.end>=x.start)ranges.push([x.start,x.end]);
  ranges.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  let total=0,start=null,end=null;
  for(const [s,e] of ranges){
    if(start==null){start=s;end=e;continue}
    if(s<=end){end=Math.max(end,e);continue}
    total+=end-start;start=s;end=e;
  }
  if(start!=null)total+=end-start;
  return total;
};
const latestEnd=(activities)=>{
  let out=null;
  for(const a of activities)for(const x of a.intervals)if(x.end!=null)out=out==null?x.end:Math.max(out,x.end);
  return out;
};
const snapshot=(state,at)=>{
  const activities=[...state.activities.values()];
  const activityDurations=Object.fromEntries(activities.map(a=>[a.id,duration(a)]));
  const activityStatus=Object.fromEntries(activities.map(a=>[a.id,a.status]));
  const completedSets=Object.fromEntries(activities.filter(a=>a.completedSets>0).map(a=>[a.id,a.completedSets]));
  const last=latestEnd(activities);
  const anyActive=activities.some(a=>a.status==='active');
  return {
    activityDurations,
    sessionActiveDuration:mergedDuration(activities),
    latestRealActivityEnd:last,
    projectGapAt:at,
    projectGap:anyActive||last==null?0:Math.max(0,at-last),
    sessionStart:state.sessionStart,
    sessionEnd:state.sessionEnd,
    activityStatus,
    completedSets
  };
};
const subsetEqual=(actual,expected,label)=>{
  for(const [k,v] of Object.entries(expected))assert.deepEqual(actual[k],v,`${label}: ${k}`);
};

const fixtureDir=path.join(ROOT,'shared/fixtures');
const files=fs.readdirSync(fixtureDir).filter(f=>f.endsWith('.json')).sort();
if(files.length<4)fail(`expected >=4 fixtures, found ${files.length}`);
for(const file of files){
  const f=readJson(path.join(fixtureDir,file));
  assert.equal(f.schema,'axis.fixture.v1',`${file} fixture schema`);
  assert.equal(f.contract,'axis.domain.v1',`${file} domain contract`);
  if(Array.isArray(f.events)){
    const state={sessionStart:null,sessionEnd:null,activities:new Map(),eventIds:new Set()};
    for(const e of f.events){
      assert.equal(e.schema,'axis.event.v1',`${file}/${e.id} event schema`);
      applyEvent(state,e);
      for(const cp of f.checkpoints||[])if(cp.afterEvent===e.id)subsetEqual(snapshot(state,e.occurredAt),cp.expected,`${file}/${e.id}`);
    }
    const at=Number(f.expected.projectGapAt??state.sessionEnd??f.events.at(-1)?.occurredAt??0);
    subsetEqual(snapshot(state,at),f.expected,file);
  }else if(f.normalizedState){
    const state={sessionStart:f.normalizedState.sessionStart??null,sessionEnd:f.normalizedState.sessionEnd??null,activities:new Map(),eventIds:new Set()};
    for(const raw of f.normalizedState.activities||[])state.activities.set(raw.id,{id:raw.id,kind:raw.kind||'strength',plannedSets:raw.plannedSets||0,completedSets:raw.completedSets||0,status:raw.status||'finished',intervals:(raw.intervals||[]).map(x=>({...x}))});
    const at=Number(f.expected.projectGapAt??state.sessionEnd??0);
    subsetEqual(snapshot(state,at),f.expected,file);
  }else fail(`${file} has neither events nor normalizedState`);
}

console.log(`[AXIS cross-platform foundation] PASS · ${files.length} golden fixtures · ${manifest.domain} · ${manifest.data} · Web/iOS release separation sealed`);
