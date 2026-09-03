import assert from 'node:assert/strict';
import fs from 'node:fs';
import {AXIS_REPORT_RANGE_SCHEMA,axisReportRangeBuild,axisReportRangeNormalize} from '../lib/axis-report-range-truth.mjs';

assert.equal(AXIS_REPORT_RANGE_SCHEMA,'axis.report-range.v1');
assert.deepEqual(axisReportRangeNormalize({start:100,end:200}),{start:100,end:200,membership:'session-start-half-open'});
assert.throws(()=>axisReportRangeNormalize({start:null,end:200}),/start must be finite/);
assert.throws(()=>axisReportRangeNormalize({start:100,end:''}),/end must be finite/);
assert.throws(()=>axisReportRangeNormalize({start:200,end:200}),/greater than start/);

const profile={schema:'axis.profile-snapshot.v1',version:1,capturedAt:100,measurements:{heightCm:178,weightKg:72.5,bodyFatPct:18,waistCm:82},training:{years:4,weeklyFrequency:3}};
const goal={schema:'axis.goal-snapshot.v1',version:1,capturedAt:100,kind:'muscle',targets:{weightKg:78,bodyFatPct:15,waistCm:78}};
const time={schema:'axis.session-time.v1',version:1,sealedAt:160,start:100,end:160,totalMs:60,activeMs:20,restMs:10,unaccountedMs:30,classifiedMs:30,sources:{},policy:{}};
const sessions=[
  {id:'boundary-before',start:90,end:95,events:[]},
  {id:'canonical',start:100,end:160,profileSnapshot:profile,goalSnapshot:goal,timeSummary:time,events:[
    {id:'enc-1',time:150,equipmentId:'custom-row',executionModeSnapshot:'sets',schemaSnapshot:['weight','reps','tempoX'],metrics:{weight:80,reps:8,tempoX:'3-1-1'},weight:999,reps:999}
  ]},
  {id:'legacy',start:150,end:180,events:[{id:'legacy-enc',time:170,equipmentId:'treadmill',duration:99}]},
  {id:'incomplete-null-end',start:160,end:null,events:[{id:'open'}]},
  {id:'incomplete-empty-end',start:170,end:'',events:[{id:'open-2'}]},
  {id:'boundary-after',start:200,end:220,events:[]}
];
const sourceBefore=structuredClone(sessions);
const report=axisReportRangeBuild(sessions,{start:100,end:200});

assert.equal(report.schema,'axis.report-range.v1');
assert.deepEqual(report.sessions.map(x=>x.id),['canonical','legacy'],'range must be completed-only and start-half-open');
assert.equal(report.summary.sessionCount,2);
assert.equal(report.summary.encounterCount,2);
assert.equal(report.summary.metricObservationCount,3,'only immutable canonical metrics become observations');
assert.deepEqual(report.summary.time,{sessionsWithCanonicalTruth:1,sessionsMissingCanonicalTruth:1,totalMs:60,activeMs:20,restMs:10,unaccountedMs:30},'missing time truth must not be inferred');
assert.deepEqual(report.summary.coverage,{sessionsWithProfileSnapshot:1,sessionsMissingProfileSnapshot:1,sessionsWithGoalSnapshot:1,sessionsMissingGoalSnapshot:1,sessionsWithCanonicalTime:1,sessionsMissingCanonicalTime:1,encountersMissingSchemaSnapshot:1,encountersMissingCanonicalMetrics:1,unknownMetricDefinitions:1});
assert.deepEqual(report.sessions[0].profileSnapshot,profile);
assert.deepEqual(report.sessions[0].goalSnapshot,goal);
assert.deepEqual(report.sessions[0].timeSummary,time);
assert.deepEqual(report.sessions[0].encounters[0].metrics,{weight:80,reps:8,tempoX:'3-1-1'});
assert.deepEqual(report.sessions[0].encounters[0].legacyRecordedFacts,{weight:999,reps:999},'legacy root facts may be preserved but never promoted');
assert.equal(report.metricObservations.find(x=>x.key==='weight')?.value,80,'canonical Encounter metric must win over legacy root field');
const custom=report.metricObservations.find(x=>x.key==='tempoX');
assert.ok(custom);
assert.equal(custom.definitionStatus,'encounter-key-only');
assert.equal(custom.definitionMissing,true);
assert.equal(Object.prototype.hasOwnProperty.call(custom,'definitionRef'),false,'truth layer must not invent a canonical definition URI');
assert.equal(report.metricObservations.find(x=>x.key==='weight')?.definitionStatus,'stable-standard-key');
assert.equal(report.policy.liveProfileRead,false);
assert.equal(report.policy.currentObjectDefinitionRead,false);
assert.equal(report.policy.legacyTimeInference,false);
assert.equal(report.policy.legacyMetricPromotion,false);
assert.equal(report.policy.storageWrite,false);
assert.deepEqual(sessions,sourceBefore,'projection must not mutate archived Sessions');

sessions[1].profileSnapshot.measurements.weightKg=999;
sessions[1].events[0].metrics.weight=1;
assert.equal(report.sessions[0].profileSnapshot.measurements.weightKg,72.5,'projection must detach immutable output from later source mutation');
assert.equal(report.metricObservations.find(x=>x.key==='weight')?.value,80);
const repeat=axisReportRangeBuild(sourceBefore,{start:100,end:200});
assert.deepEqual(repeat,axisReportRangeBuild(sourceBefore,{start:100,end:200}),'same archived facts must project deterministically');

const unsupported=axisReportRangeBuild([{id:'future',start:120,end:130,profileSnapshot:{schema:'axis.profile-snapshot.v2'},goalSnapshot:{schema:'axis.goal-snapshot.v2'},timeSummary:{schema:'axis.session-time.v2'},events:[]}],{start:100,end:200});
assert.deepEqual(unsupported.sessions[0].unsupported,{profileSnapshotSchema:true,goalSnapshotSchema:true,timeSummarySchema:true});
assert.deepEqual(unsupported.sessions[0].missing,{profileSnapshot:true,goalSnapshot:true,timeSummary:true,encounterSchemaSnapshots:0,encounterCanonicalMetrics:0,unknownMetricDefinitions:0});
assert.deepEqual(unsupported.summary.time,{sessionsWithCanonicalTruth:0,sessionsMissingCanonicalTruth:1,totalMs:0,activeMs:0,restMs:0,unaccountedMs:0});

const pure=fs.readFileSync('lib/axis-report-range-truth.mjs','utf8');
const prepare=fs.readFileSync('prepare-821-report-range-truth.mjs','utf8');
const chain=fs.readFileSync('prepare-819-postcommit-lifecycle.mjs','utf8');
for(const token of ['completedSessionsOnly:true','session-start-half-open','canonicalTimeOnly:true','immutable-session-snapshot-only','immutable-encounter-facts-only','liveProfileRead:false','currentObjectDefinitionRead:false','legacyTimeInference:false','legacyMetricPromotion:false','storageWrite:false'])assert.ok(pure.includes(token),`pure contract missing ${token}`);
assert.ok(!pure.includes('axis.object-capabilities.v1#metric:'),'pure truth must not invent portable metric-definition anchors');
assert.ok(!/Date\.now\s*\(/.test(pure),'pure truth must not read wall-clock now');
const runtimeMatch=prepare.match(/const runtime=`([\s\S]*?)`;\nif\(/);assert.ok(runtimeMatch,'prepare runtime template missing');
for(const forbidden of ['state.profile','localStorage','indexedDB'])assert.ok(!runtimeMatch[1].includes(forbidden),`runtime crossed read-only boundary with ${forbidden}`);
assert.ok(runtimeMatch[1].includes('const axis821ReportRangeBuild=(()=>{'),'pure model must be isolated inside a private runtime scope');
assert.ok(runtimeMatch[1].includes('axis821ReportRangeBuild(state.sessions,range)'),'runtime must read only archived state.sessions');
for(const token of ['reportUIOwner:false','exportOwner:false','build:axis821BuildReportRange'])assert.ok(prepare.includes(token),`prepare contract missing ${token}`);
assert.ok(chain.includes("await import('./prepare-821-session-time-truth.mjs');\nawait import('./prepare-821-report-range-truth.mjs');"),'Report Range Truth must build after Session Time Truth in canonical chain');
console.log('[AXIS 8.21 Report Range Truth contract] PASS · completed-only half-open range · immutable Session/Encounter facts · canonical-time-only totals · legacy/custom honesty · private read-only runtime projection');
