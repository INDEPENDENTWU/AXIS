import assert from 'node:assert/strict';
import {
  OBJECT_METRIC_OVERRIDES_ID,
  normalizeMetricIds,
  hasObjectMetricOverride,
  objectMetricOverride,
  resolveObjectMetricIds,
  setObjectMetricOverride,
  clearObjectMetricOverride
} from '../lib/axis-object-metric-overrides.mjs';

const ALLOWED=['weight','reps','sets','duration','hold','distance','pace','intensity','resistance','level','speed','incline','rating','completed'];
const baseProfile={name:'AXIS',customEq:[{id:'custom-a',custom:true,recording:{metrics:['weight','reps']}}]};

assert.deepEqual(normalizeMetricIds(['duration','duration','bogus','intensity'],{allowedIds:ALLOWED}),['duration','intensity']);
assert.equal(hasObjectMetricOverride(baseProfile,'treadmill'),false);
assert.deepEqual(resolveObjectMetricIds({profile:baseProfile,objectId:'treadmill',defaultMetricIds:['duration','intensity'],allowedIds:ALLOWED}),{source:'object',metricIds:['duration','intensity'],overridden:false});

const durationOnly=setObjectMetricOverride(baseProfile,'treadmill',['duration'],{allowedIds:ALLOWED,updatedAt:123});
assert.equal(hasObjectMetricOverride(durationOnly,'treadmill'),true);
assert.deepEqual(objectMetricOverride(durationOnly,'treadmill',{allowedIds:ALLOWED}),{schema:OBJECT_METRIC_OVERRIDES_ID,objectId:'treadmill',version:1,metrics:['duration'],updatedAt:123});
assert.deepEqual(resolveObjectMetricIds({profile:durationOnly,objectId:'treadmill',defaultMetricIds:['duration','intensity'],allowedIds:ALLOWED}),{source:'profile-override',metricIds:['duration'],overridden:true});
assert.equal(baseProfile.objectMetricOverrides,undefined,'built-in override mutation leaked into source profile');

const explicitEmpty=setObjectMetricOverride(durationOnly,'bench',[],{allowedIds:ALLOWED,updatedAt:124});
assert.equal(hasObjectMetricOverride(explicitEmpty,'bench'),true,'explicit empty override lost presence');
assert.deepEqual(resolveObjectMetricIds({profile:explicitEmpty,objectId:'bench',defaultMetricIds:['weight','reps'],allowedIds:ALLOWED}),{source:'profile-override',metricIds:[],overridden:true});

assert.deepEqual(resolveObjectMetricIds({profile:explicitEmpty,objectId:'custom-a',defaultMetricIds:['weight','reps'],allowedIds:ALLOWED,custom:true}),{source:'object',metricIds:['weight','reps'],overridden:false},'custom Object schema must remain Object-owned');

const reset=clearObjectMetricOverride(explicitEmpty,'treadmill');
assert.equal(hasObjectMetricOverride(reset,'treadmill'),false);
assert.deepEqual(resolveObjectMetricIds({profile:reset,objectId:'treadmill',defaultMetricIds:['duration','intensity'],allowedIds:ALLOWED}),{source:'object',metricIds:['duration','intensity'],overridden:false});
assert.equal(hasObjectMetricOverride(reset,'bench'),true,'clearing one Object override removed another');

console.log('[AXIS 8.21 Object metric overrides contract] PASS · stable Object identity · absent/default distinction · duration-only · explicit empty · reset · custom Object non-mutation');
