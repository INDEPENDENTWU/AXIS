export const AXIS_REPORT_RANGE_SCHEMA='axis.report-range.v1';
export const AXIS_PROFILE_SNAPSHOT_SCHEMA='axis.profile-snapshot.v1';
export const AXIS_GOAL_SNAPSHOT_SCHEMA='axis.goal-snapshot.v1';
export const AXIS_REPORT_SESSION_TIME_SCHEMA='axis.session-time.v1';

const STANDARD_METRIC_KEYS=new Set(['weight','reps','sets','duration','distance','speed','incline','level','resistance','cadence','pace','hold','count','intensity']);
const LEGACY_RECORDED_KEYS=[...STANDARD_METRIC_KEYS];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:null;
const finite=v=>Number.isFinite(Number(v))?Number(v):null;
const clone=v=>{
  if(v===null||v===undefined||typeof v!=='object')return v;
  if(Array.isArray(v))return v.map(clone);
  const out={};for(const [k,x] of Object.entries(v))out[k]=clone(x);return out;
};
const text=v=>{const s=String(v??'').trim();return s||null};
const keyList=v=>{
  if(!Array.isArray(v))return null;
  const seen=new Set(),out=[];
  for(const raw of v){const k=text(raw);if(k&&!seen.has(k)){seen.add(k);out.push(k)}}
  return out;
};

export function axisReportRangeNormalize(range={}){
  const r=object(range)||{},start=own(r,'start')?finite(r.start):null,end=own(r,'end')?finite(r.end):null;
  if(own(r,'start')&&start==null)throw new Error('[AXIS Report Range] start must be finite');
  if(own(r,'end')&&end==null)throw new Error('[AXIS Report Range] end must be finite');
  if(start!=null&&end!=null&&end<=start)throw new Error('[AXIS Report Range] end must be greater than start');
  return{start,end,membership:'session-start-half-open'};
}

const completed=s=>{const start=finite(s?.start),end=finite(s?.end);return start!=null&&end!=null&&end>=start};
const inRange=(s,r)=>{const start=finite(s?.start);return start!=null&&(r.start==null||start>=r.start)&&(r.end==null||start<r.end)};
const canonicalSnapshot=(value,schema)=>object(value)?.schema===schema?clone(value):null;
const canonicalTime=value=>object(value)?.schema===AXIS_REPORT_SESSION_TIME_SCHEMA?clone(value):null;
const sessionId=s=>text(s?.sessionId)??text(s?.id);
const encounterId=e=>text(e?.encounterId)??text(e?.eventId)??text(e?.id);

function legacyFacts(event){
  const out={};
  for(const key of LEGACY_RECORDED_KEYS)if(own(event,key))out[key]=clone(event[key]);
  return out;
}

function metricFacts(event){
  const schema=keyList(event?.schemaSnapshot),metrics=object(event?.metrics),keys=[],seen=new Set();
  for(const k of schema||[]){if(!seen.has(k)){seen.add(k);keys.push(k)}}
  for(const raw of Object.keys(metrics||{})){const k=text(raw);if(k&&!seen.has(k)){seen.add(k);keys.push(k)}}
  return keys.map(key=>{
    const recorded=!!metrics&&own(metrics,key),standard=STANDARD_METRIC_KEYS.has(key);
    return{key,recorded,declaredInSchema:!!schema?.includes(key),value:recorded?clone(metrics[key]):null,definitionRef:standard?`axis.object-capabilities.v1#metric:${key}`:null,definitionStatus:standard?'stable-standard-key':'encounter-key-only',definitionMissing:!standard};
  });
}

function projectEncounter(event,index){
  const e=object(event)||{},schema=keyList(e.schemaSnapshot),metrics=object(e.metrics),facts=metricFacts(e),legacy=legacyFacts(e);
  const identity={};
  for(const key of ['id','encounterId','eventId','objectId','equipmentId','kind','name','title'])if(own(e,key))identity[key]=clone(e[key]);
  return{
    index,
    id:encounterId(e),
    time:finite(e.time),
    identity,
    schemaSnapshot:schema,
    executionModeSnapshot:text(e.executionModeSnapshot),
    metrics:metrics?clone(metrics):null,
    metricFacts:facts,
    legacyRecordedFacts:legacy,
    missing:{schemaSnapshot:schema===null,canonicalMetrics:metrics===null,unknownMetricDefinitions:facts.filter(x=>x.definitionMissing).length},
    provenance:{schemaSnapshot:own(e,'schemaSnapshot'),metrics:own(e,'metrics'),executionModeSnapshot:own(e,'executionModeSnapshot'),legacyRootFacts:Object.keys(legacy).length>0}
  };
}

function projectSession(session){
  const s=object(session)||{},events=Array.isArray(s.events)?s.events:[],profile=canonicalSnapshot(s.profileSnapshot,AXIS_PROFILE_SNAPSHOT_SCHEMA),goal=canonicalSnapshot(s.goalSnapshot,AXIS_GOAL_SNAPSHOT_SCHEMA),time=canonicalTime(s.timeSummary),encounters=events.map(projectEncounter);
  const unsupportedProfile=object(s.profileSnapshot)&&!profile,unsupportedGoal=object(s.goalSnapshot)&&!goal,unsupportedTime=object(s.timeSummary)&&!time;
  return{
    id:sessionId(s),
    start:finite(s.start),
    end:finite(s.end),
    profileSnapshot:profile,
    goalSnapshot:goal,
    timeSummary:time,
    encounters,
    missing:{profileSnapshot:!profile,goalSnapshot:!goal,timeSummary:!time,encounterSchemaSnapshots:encounters.filter(x=>x.missing.schemaSnapshot).length,encounterCanonicalMetrics:encounters.filter(x=>x.missing.canonicalMetrics).length,unknownMetricDefinitions:encounters.reduce((n,x)=>n+x.missing.unknownMetricDefinitions,0)},
    unsupported:{profileSnapshotSchema:!!unsupportedProfile,goalSnapshotSchema:!!unsupportedGoal,timeSummarySchema:!!unsupportedTime}
  };
}

export function axisReportRangeBuild(sessions=[],range={}){
  const normalized=axisReportRangeNormalize(range),input=Array.isArray(sessions)?sessions:[];
  const selected=input.filter(s=>completed(s)&&inRange(s,normalized)).map(projectSession).sort((a,b)=>a.start-b.start||a.end-b.end||String(a.id??'').localeCompare(String(b.id??'')));
  const metricObservations=[];
  for(const [sessionIndex,session] of selected.entries())for(const encounter of session.encounters)for(const fact of encounter.metricFacts)if(fact.recorded)metricObservations.push({sessionIndex,sessionId:session.id,sessionStart:session.start,encounterIndex:encounter.index,encounterId:encounter.id,time:encounter.time,key:fact.key,value:clone(fact.value),definitionRef:fact.definitionRef,definitionStatus:fact.definitionStatus,definitionMissing:fact.definitionMissing,declaredInSchema:fact.declaredInSchema});
  const canonicalTimes=selected.map(x=>x.timeSummary).filter(Boolean),timeTotals=canonicalTimes.reduce((a,t)=>{for(const k of ['totalMs','activeMs','restMs','unaccountedMs'])a[k]+=Math.max(0,finite(t[k])??0);return a},{totalMs:0,activeMs:0,restMs:0,unaccountedMs:0});
  const encounterCount=selected.reduce((n,s)=>n+s.encounters.length,0);
  const coverage={sessionsWithProfileSnapshot:selected.filter(x=>!!x.profileSnapshot).length,sessionsMissingProfileSnapshot:selected.filter(x=>x.missing.profileSnapshot).length,sessionsWithGoalSnapshot:selected.filter(x=>!!x.goalSnapshot).length,sessionsMissingGoalSnapshot:selected.filter(x=>x.missing.goalSnapshot).length,sessionsWithCanonicalTime:selected.filter(x=>!!x.timeSummary).length,sessionsMissingCanonicalTime:selected.filter(x=>x.missing.timeSummary).length,encountersMissingSchemaSnapshot:selected.reduce((n,x)=>n+x.missing.encounterSchemaSnapshots,0),encountersMissingCanonicalMetrics:selected.reduce((n,x)=>n+x.missing.encounterCanonicalMetrics,0),unknownMetricDefinitions:selected.reduce((n,x)=>n+x.missing.unknownMetricDefinitions,0)};
  return{
    schema:AXIS_REPORT_RANGE_SCHEMA,
    version:1,
    range:normalized,
    policy:{completedSessionsOnly:true,rangeMembership:'session-start-half-open',chronology:'ascending',canonicalTimeOnly:true,profileSource:'immutable-session-snapshot-only',goalSource:'immutable-session-snapshot-only',metricSource:'immutable-encounter-facts-only',liveProfileRead:false,currentObjectDefinitionRead:false,legacyTimeInference:false,legacyMetricPromotion:false,storageWrite:false},
    summary:{sessionCount:selected.length,encounterCount,metricObservationCount:metricObservations.length,time:{sessionsWithCanonicalTruth:coverage.sessionsWithCanonicalTime,sessionsMissingCanonicalTruth:coverage.sessionsMissingCanonicalTime,...timeTotals},coverage},
    sessions:selected,
    metricObservations
  };
}
