import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PROFILE_SNAPSHOT_SCHEMA,
  GOAL_SNAPSHOT_SCHEMA,
  createProfileSnapshot,
  createGoalSnapshot,
  createSessionTruthSnapshots,
  attachSessionTruth,
  readSessionTruth
} from '../lib/axis-profile-session-truth.mjs';

const profile={
  name:'Ray',height:'178',weight:'72.5',bodyFat:'18',years:'4',freq:'3',goal:'muscle',
  measurements:{waistCm:'82'},
  targets:{weightKg:'78',bodyFatPct:'15',waistCm:'78'},
  customEq:[{id:'private'}],memories:[{fp:'x'}],objectMetricOverrides:{treadmill:{metrics:['duration']}}
};
const startedAt=1788318000000;
const p=createProfileSnapshot(profile,startedAt),g=createGoalSnapshot(profile,startedAt);
assert.equal(p.schema,PROFILE_SNAPSHOT_SCHEMA);assert.equal(g.schema,GOAL_SNAPSHOT_SCHEMA);
assert.equal(p.capturedAt,startedAt);assert.equal(g.capturedAt,startedAt);
assert.deepEqual(p.measurements,{heightCm:178,weightKg:72.5,bodyFatPct:18,waistCm:82});
assert.deepEqual(p.training,{years:4,weeklyFrequency:3});
assert.equal(g.kind,'muscle');assert.deepEqual(g.targets,{weightKg:78,bodyFatPct:15,waistCm:78});
for(const key of ['name','customEq','memories','objectMetricOverrides']){assert.equal(Object.prototype.hasOwnProperty.call(p,key),false);assert.equal(Object.prototype.hasOwnProperty.call(g,key),false)}

const pair=createSessionTruthSnapshots(profile,startedAt);assert.deepEqual(pair,{profileSnapshot:p,goalSnapshot:g});
const base={id:'S1',start:startedAt,events:[]},attached=attachSessionTruth(base,profile);
assert.equal(Object.prototype.hasOwnProperty.call(base,'profileSnapshot'),false,'pure attach mutated source Session');
assert.deepEqual(readSessionTruth(attached),pair);
profile.weight='90';profile.goal='strength';profile.targets.weightKg='95';
assert.equal(attached.profileSnapshot.measurements.weightKg,72.5,'later Profile edit rewrote historical Session snapshot');
assert.equal(attached.goalSnapshot.kind,'muscle','later Goal edit rewrote historical Session snapshot');
assert.equal(attached.goalSnapshot.targets.weightKg,78,'later target edit rewrote historical Session snapshot');
assert.deepEqual(attachSessionTruth(attached,profile),attached,'existing Session truth must never be recaptured');

const next=attachSessionTruth({id:'S2',start:startedAt+1000,events:[]},profile);
assert.equal(next.profileSnapshot.measurements.weightKg,90);assert.equal(next.goalSnapshot.kind,'strength');assert.equal(next.goalSnapshot.targets.weightKg,95);
const legacy={id:'legacy',start:startedAt-1000,events:[]};assert.deepEqual(readSessionTruth(legacy),{profileSnapshot:null,goalSnapshot:null},'legacy absence must remain explicit');
const empty=createSessionTruthSnapshots({},0);assert.deepEqual(empty.profileSnapshot.measurements,{heightCm:null,weightKg:null,bodyFatPct:null,waistCm:null});assert.deepEqual(empty.goalSnapshot.targets,{weightKg:null,bodyFatPct:null,waistCm:null});assert.equal(empty.goalSnapshot.kind,null);
const invalid=createSessionTruthSnapshots({weight:'not-a-number',bodyFat:'0',measurements:{waistCm:'9999'},targets:{weightKg:'-2'}},123);assert.equal(invalid.profileSnapshot.measurements.weightKg,null);assert.equal(invalid.profileSnapshot.measurements.bodyFatPct,null);assert.equal(invalid.profileSnapshot.measurements.waistCm,null);assert.equal(invalid.goalSnapshot.targets.weightKg,null);

const profileSchema=JSON.parse(fs.readFileSync('shared/contracts/axis-profile-snapshot-v1.schema.json','utf8'));
const goalSchema=JSON.parse(fs.readFileSync('shared/contracts/axis-goal-snapshot-v1.schema.json','utf8'));
assert.equal(profileSchema.$id,PROFILE_SNAPSHOT_SCHEMA);assert.equal(goalSchema.$id,GOAL_SNAPSHOT_SCHEMA);
const prepare=fs.readFileSync('prepare-821-profile-session-truth.mjs','utf8'),driver=fs.readFileSync('prepare-819-postcommit-lifecycle.mjs','utf8');
assert.match(prepare,/new Session boundaries expected 2/);assert.match(prepare,/legacyBackfill:false/);assert.match(prepare,/newPersistence:false/);assert.match(prepare,/newEncounterOwner:false/);assert.ok(driver.includes("await import('./prepare-821-profile-session-truth.mjs');"),'release graph missing Profile Session truth projection');
console.log('[AXIS 8.21 Profile / Goal Session truth contract] PASS · structured optional body/targets · exact session-start capture · immutable later edits · legacy absence · privacy exclusions · no parallel ownership');
