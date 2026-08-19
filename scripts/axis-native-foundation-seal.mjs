import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const exists=f=>assert.equal(fs.existsSync(f),true,`missing ${f}`);

for(const f of [
  'docs/NATIVE_FOUNDATION_CHECKLIST.md',
  'docs/decisions/ADR-0004-native-local-first-no-account.md',
  'shared/contracts/axis-platform-capabilities-v1.json',
  'shared/contracts/axis-product-matrix-v1.json'
])exists(f);

const capability=read('shared/contracts/axis-platform-capabilities-v1.json');
assert.equal(capability.schema,'axis.platform-capabilities.v1');
assert.equal(capability.domain,'axis.domain.v1');
assert.equal(capability.capabilities.web.offlineWorkout,true);
assert.equal(capability.capabilities.ios.offlineWorkout,true);
assert.equal(capability.capabilities.ios.nativeUI,true);
assert.equal(capability.capabilities.ios.avFoundationCamera,true);
assert.equal(capability.capabilities.web.nativeHaptics,false);

const matrix=read('shared/contracts/axis-product-matrix-v1.json');
assert.equal(matrix.schema,'axis.product-matrix.v1');
assert.equal(matrix.domain,'axis.domain.v1');
for(const [key,value] of Object.entries(matrix.required||{}))assert.equal(value,true,`required product invariant ${key}`);

const work=fs.readFileSync('docs/CURRENT_WORK.md','utf8');
for(const needle of [
  'axis-native-foundation-0',
  'INDEPENDENTWU/AXIS-iOS',
  'axis.domain.v1',
  'axis.data.v1',
  'Chat history is not authoritative project memory'
])assert.equal(work.includes(needle),true,`CURRENT_WORK missing ${needle}`);

console.log('[AXIS native foundation seal] PASS · platform capability differences isolated · product invariants sealed · native handoff durable');
