import assert from 'node:assert/strict';
import fs from 'node:fs';
const prep=fs.readFileSync('scripts/prepare-831-playable-integration.mjs','utf8'),core=fs.readFileSync('lib/axis-playable-execution.mjs','utf8');
for(const token of ['window.__AXIS_831_PLAYABLE__','window.__AXIS_FLOW_RUNTIME__','flow.advance()','flow.launch(command.sourceRef)','selectEq(command.objectRef,true)','event.flowProvenance?.objectRef!==command.objectRef','axis831ExistingOwner'])assert.ok(prep.includes(token),'owner integration missing '+token);
for(const token of ['localStorage.setItem(','indexedDB.open(','fetch(','state.active.events.push(','state.sessions.push(','save();','axis_v60_state'])assert.equal(prep.includes(token),false,'second fact/storage writer '+token);
for(const token of ['localStorage','indexedDB','window.','document.','fetch(','Date.now','setTimeout','setInterval'])assert.equal(core.includes(token),false,'pure core impure '+token);
assert.ok(prep.includes("code.split(anchor).length!==2"),'bridge must use single exact anchor');
assert.ok(core.includes("'accepted':'not-confirmed'"),'cannot claim owner acknowledgement without true');
console.log('[AXIS 8.31b bridge contract] PASS · app-owned Flow + Encounter identity handoff, explicit command only, no new storage or fact writer');
