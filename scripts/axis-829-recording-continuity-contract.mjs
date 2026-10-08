import assert from 'node:assert/strict';
import fs from 'node:fs';
import {projectRecordingRecall,RECORDING_CONTINUITY_SCHEMA} from '../lib/axis-recording-continuity.mjs';

const schema=[{key:'weight',type:'number',unit:'kg',min:0,max:1000},{key:'reps',type:'count',unit:'次',min:0,max:100},{key:'completed',type:'boolean',unit:''},{key:'pace',type:'pace',unit:'min/km'}];
const previous={id:'E-1',time:12345,metricSchemaSnapshot:schema.map(x=>({...x}))};
const metrics={weight:80,reps:8,completed:false,pace:'5:30',ghost:40};
const before=JSON.stringify({schema,previous,metrics});
let p=projectRecordingRecall({schema,previous,metrics});
assert.equal(p.schema,RECORDING_CONTINUITY_SCHEMA);
assert.equal(p.count,4);assert.equal(p.values.weight,'80');assert.equal(p.values.reps,'8');assert.equal(p.values.completed,'0');assert.equal(p.values.pace,'5:30');assert.equal(p.values.ghost,undefined);
assert.equal(JSON.stringify({schema,previous,metrics}),before,'pure recall mutated historical facts');
assert.ok(p.reasonCodes.includes('explicit-user-confirmation-required'));

p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'lb'}],previous,metrics});
assert.equal(p.count,0,'changed unit must not silently inherit previous facts');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg'}],previous:{id:'legacy'},metrics});
assert.equal(p.count,0,'unsnapshotted legacy data must not masquerade as compatible');
p=projectRecordingRecall({schema,previous,metrics:{weight:Infinity,reps:3.5,completed:null,pace:'banana'}});
assert.equal(p.count,0,'invalid inputs were suggested');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',max:50}],previous,metrics});
assert.equal(p.count,0,'metric bounds must apply to reuse suggestions');
// Historical bounds are part of immutable metric meaning, not merely a
// validation window for the old numeric value.
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',min:0,max:2000}],previous,metrics});
assert.equal(p.count,0,'widened current max must not reuse an old bounded measurement');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',min:5,max:1000}],previous,metrics});
assert.equal(p.count,0,'changed historical minimum must prevent recall');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',max:1000}],previous,metrics});
assert.equal(p.count,0,'omitted historical minimum must not be treated as equivalent');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',min:'0',max:'1000'}],previous,metrics});
assert.equal(p.count,1,'equivalent numeric bound representations must remain compatible');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',min:'invalid',max:1000}],previous,metrics});
assert.equal(p.count,0,'malformed current limits cannot prove metric compatibility');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',min:0,max:1000}],previous:{...previous,metricSchemaSnapshot:[{key:'weight',type:'number',unit:'kg',min:'invalid',max:1000}]},metrics});
assert.equal(p.count,0,'malformed historical limits cannot prove metric compatibility');
p=projectRecordingRecall({schema:[{key:'weight',type:'number',unit:'kg',min:0,max:1000}],previous,metrics:{weight:80}});
assert.equal(p.values.weight,'80','identical historical bounds must retain valid recall');
const source=fs.readFileSync(new URL('../lib/axis-recording-continuity.mjs',import.meta.url),'utf8');
for(const forbidden of ['window.','document.','localStorage','indexedDB','fetch(','XMLHttpRequest','WebSocket','navigator.'])
  assert.ok(!source.includes(forbidden),'pure recall contains '+forbidden);
console.log('[AXIS 8.29 recording continuity] PASS · compatible historical suggestions · unit/type/identical historical bounds validation · explicit confirmation · no fabricated Encounter · pure projection');
