import assert from 'node:assert/strict';
import fs from 'node:fs';
import {AXIS_SESSION_TIME_SCHEMA,axisSessionTimeBuild,axisSessionTimeMergeIntervals,axisSessionTimeSubtractIntervals} from '../lib/axis-session-time-truth.mjs';

assert.equal(AXIS_SESSION_TIME_SCHEMA,'axis.session-time.v1');
assert.deepEqual(axisSessionTimeMergeIntervals([[10,20],[15,30],[40,50]]),[[10,30],[40,50]]);
assert.deepEqual(axisSessionTimeSubtractIntervals([[0,30]],[[10,20]]),[[0,10],[20,30]]);

const session={start:0,end:180000,events:[
  {id:'A',time:80000,kind:'strength'},
  {id:'B',time:70000,kind:'strength'},
  {id:'C',time:170000,kind:'cardio',metrics:{duration:1},executionModeSnapshot:'timed'},
  {id:'D',time:175000,kind:'strength',metrics:{weight:80,reps:8,sets:3}}
]};
const meta={events:{
  A:{activity:{status:'finished',intervals:[{start:10000,end:30000},{start:60000,end:80000}],restAccumulatedMs:30000}},
  B:{activity:{status:'finished',intervals:[{start:40000,end:70000}],restAccumulatedMs:0}}
}};
const summary=axisSessionTimeBuild(session,meta,180000);
assert.equal(summary.totalMs,180000);
assert.equal(summary.activeMs,120000,'real intervals + explicit duration must union without double count');
assert.equal(summary.restMs,10000,'pause evidence overlapping another Active Object must not count as global rest');
assert.equal(summary.unaccountedMs,50000);
assert.deepEqual(summary.sources,{activeIntervals:3,explicitDurationEvents:1,explicitPauseIntervals:1,unmeasuredEvents:1,ambiguousSettledRestMs:0});
assert.equal(summary.policy.strengthInference,false);

const ambiguous=axisSessionTimeBuild({start:0,end:100000,events:[{id:'X',time:90000,kind:'strength'}]},{events:{X:{activity:{status:'finished',intervals:[{start:10000,end:20000},{start:50000,end:60000}],restAccumulatedMs:5000}}}},100000);
assert.equal(ambiguous.restMs,0,'ambiguous settled pause must remain unaccounted');
assert.equal(ambiguous.sources.ambiguousSettledRestMs,5000);
assert.equal(ambiguous.activeMs,20000);
assert.equal(ambiguous.unaccountedMs,80000);

const live=axisSessionTimeBuild({start:0,end:60000,events:[{id:'P',time:10000,kind:'strength'}]},{events:{P:{activity:{status:'paused',intervals:[{start:0,end:20000}],restStartedAt:20000,restAccumulatedMs:0}}}},60000);
assert.equal(live.activeMs,20000);assert.equal(live.restMs,40000);assert.equal(live.unaccountedMs,0);

const prepare=fs.readFileSync('prepare-821-session-time-truth.mjs','utf8');
const chain=fs.readFileSync('prepare-819-postcommit-lifecycle.mjs','utf8');
for(const token of ['axis821SealSessionTime(s,t)','axis.session-time.v1','explicit-pause-only-no-active-overlap','strengthInference:false','legacyBackfill:false','newPersistence:false','newEncounterWriter:false','newActiveOwner:false','newFlowOwner:false'])assert.ok(prepare.includes(token),`prepare contract missing ${token}`);
assert.ok(chain.includes("await import('./prepare-821-session-time-truth.mjs');"),'session time prepare is not in canonical release chain');
console.log('[AXIS 8.21 Session Time Truth contract] PASS · total bounds · real Active union · explicit duration fallback · overlap-safe explicit rest · unaccounted honesty · no strength inference');
