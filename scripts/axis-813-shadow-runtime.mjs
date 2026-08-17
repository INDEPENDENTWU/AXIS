import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { adaptAxis812Snapshot, AXIS_812_ADAPTER_SCHEMA } from '../runtime/compat/axis-812-adapter.mjs';
import {
  AXIS_SHADOW_DIAGNOSTICS,
  AXIS_SHADOW_SCHEMA,
  compareShadowObservations,
  observeAxis812Shadow,
  runAxis812ShadowSequence,
} from '../runtime/shadow/axis-shadow-runtime.mjs';
import { AXIS_812_SHADOW_SEQUENCES } from '../runtime/fixtures/axis-812-shadow-sequences.mjs';

const clone = (value) => JSON.parse(JSON.stringify(value));
const signature = (value) => JSON.stringify(value);

function fact(observation, eventId) {
  return observation.facts?.activeEvents?.find((event) => event.eventId === eventId) ?? null;
}

function assertObservation(observation) {
  assert.equal(observation.schema, AXIS_SHADOW_SCHEMA);
  assert.equal(observation.diagnostics?.writes, 0);
  assert.equal(observation.diagnostics?.storageWrites, 0);
  assert.equal(observation.diagnostics?.uiWrites, 0);
  assert.equal(observation.diagnostics?.networkRequests, 0);
  if (observation.diagnostics?.state === 'ok') {
    assert.match(observation.fingerprint, /^[a-f0-9]{16}$/);
    assert.ok(observation.input);
    assert.ok(observation.facts);
    assert.ok(observation.projection);
  }
}

console.log('AXIS 8.13 Stage 2 · authoritative 8.12 adapter semantics');
{
  const snapshot = clone(AXIS_812_SHADOW_SEQUENCES.assumedWithoutActivity);
  const before = signature(snapshot);
  const adapted = adaptAxis812Snapshot(snapshot);
  assert.equal(signature(snapshot), before, '8.12 adapter mutated the authoritative snapshot');
  assert.equal(adapted.diagnostics.adapterSchema, AXIS_812_ADAPTER_SCHEMA);
  assert.equal(adapted.diagnostics.writes, 0);
  const event = adapted.input.session.events.find((item) => item.eventId === 'assumed-only');
  assert.equal(event.performedSets, 0, 'real 8.12 assumed sets became phantom performed sets');
  assert.equal(event.completed, false, 'planned strength work became phantom completed work');
  const liveFact = adapted.facts.activeEvents.find((item) => item.eventId === 'assumed-only');
  assert.deepEqual(liveFact.setStates, ['unfinished', 'unfinished', 'unfinished']);
  assert.equal(liveFact.completed, false);
  const archived = adapted.input.history[0].events.find((item) => item.id === 'chest');
  assert.equal(archived.performedSets, 3, 'archived history without live set metadata lost factual completion');
  assert.equal(archived.completed, true);
}

{
  const observation = observeAxis812Shadow(clone(AXIS_812_SHADOW_SEQUENCES.activeCardioPlan));
  assertObservation(observation);
  const cardio = fact(observation, 'live-cardio');
  assert.equal(cardio.status, 'active');
  assert.equal(cardio.completed, false, 'active cardio plan duration became phantom completion');
  assert.equal(observation.input.session.events.find((item) => item.eventId === 'live-cardio').completed, false);
}

console.log('AXIS 8.13 Stage 2 · strength lifecycle shadow sequence');
{
  const frames = clone(AXIS_812_SHADOW_SEQUENCES.strengthLifecycle);
  const before = signature(frames);
  const sequence = runAxis812ShadowSequence(frames);
  assert.equal(signature(frames), before, 'Shadow Runtime mutated source frames');
  assert.equal(sequence.summary.errors, 0);
  assert.equal(sequence.observations.length, 5);
  sequence.observations.forEach(assertObservation);

  const [start, afterSet, paused, resumed, row] = sequence.observations;
  assert.equal(fact(start, 'live-chest').performedSets, 0);
  assert.equal(fact(start, 'live-chest').completed, false);
  assert.equal(fact(afterSet, 'live-chest').performedSets, 1);
  assert.equal(fact(afterSet, 'live-chest').completed, true);
  assert.equal(fact(afterSet, 'live-chest').restStartedAt, null, 'set completion incorrectly started rest in Shadow facts');

  const setTransition = sequence.transitions[0];
  assert.equal(setTransition.alignment, 'same-item-progress');
  assert.equal(setTransition.observed.type, 'current-progress');
  assert.equal(setTransition.observed.performedSetsBefore, 0);
  assert.equal(setTransition.observed.performedSetsAfter, 1);

  const pausedFact = fact(paused, 'live-chest');
  assert.equal(pausedFact.status, 'paused');
  assert.ok(Number(pausedFact.restStartedAt) > 0);
  assert.equal(pausedFact.performedSets, 1, 'pause fabricated another completed set');
  assert.equal(sequence.transitions[1].alignment, 'no-observed-route-change', 'pause should be observed without pretending the route changed');

  const resumedFact = fact(resumed, 'live-chest');
  assert.equal(resumedFact.status, 'active');
  assert.equal(resumedFact.restStartedAt, null);
  assert.equal(resumedFact.restAccumulatedMs, 15_000);
  assert.equal(resumedFact.performedSets, 1, 'resume fabricated work');
  assert.equal(sequence.transitions[2].alignment, 'no-observed-route-change');

  const rowTransition = sequence.transitions[3];
  assert.equal(fact(row, 'live-row').performedSets, 0, 'switching current equipment fabricated its first set');
  assert.equal(rowTransition.observed.type, 'current-event-changed');
  assert.equal(rowTransition.observed.equipmentId, 'row');
  assert.ok(['projected-next', 'projected-route', 'projected-alternative'].includes(rowTransition.alignment), `real continuation was not represented by the prior shadow projection: ${rowTransition.alignment}`);
}

console.log('AXIS 8.13 Stage 2 · deterministic reopen + comparison');
{
  const snapshot = clone(AXIS_812_SHADOW_SEQUENCES.strengthLifecycle[2].snapshot);
  const first = observeAxis812Shadow(snapshot);
  const reopened = observeAxis812Shadow(clone(snapshot));
  assertObservation(first);
  assert.deepEqual(reopened, first, 'same authoritative snapshot must restore identical Shadow observation');
  assert.equal(reopened.fingerprint, first.fingerprint);
  const comparison = compareShadowObservations(first, reopened);
  assert.equal(comparison.alignment, 'no-observed-route-change');
}

console.log('AXIS 8.13 Stage 2 · fail-open observation boundary');
{
  const hostile = {};
  Object.defineProperty(hostile, 'core', { get() { throw new TypeError('synthetic read failure'); } });
  const result = observeAxis812Shadow(hostile);
  assert.equal(result.projection, null);
  assert.equal(result.diagnostics.state, 'error');
  assert.equal(result.diagnostics.errorCode, 'SHADOW_OBSERVATION_FAILED');
  assert.equal(result.diagnostics.errorName, 'TypeError');
  assert.equal(result.diagnostics.writes, 0);
}

console.log('AXIS 8.13 Stage 2 · seeded randomized snapshot/constraint stability');
{
  let seed = 0x8135a2;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const ids = ['row', 'shoulder', 'pec', 'treadmill'];
  for (let index = 0; index < 500; index += 1) {
    const snapshot = clone(AXIS_812_SHADOW_SEQUENCES.strengthLifecycle[index % 4].snapshot);
    snapshot.remainingMinutes = Math.floor(random() * 61);
    snapshot.constraints = {
      occupied: ids.filter(() => random() < 0.18),
      excluded: ids.filter(() => random() < 0.10),
      intensity: ['normal', 'less', 'minimum'][Math.floor(random() * 3)],
      maxItems: random() < 0.25 ? Math.floor(random() * 5) : null,
    };
    const before = signature(snapshot);
    const a = observeAxis812Shadow(snapshot);
    const b = observeAxis812Shadow(snapshot);
    assert.equal(signature(snapshot), before, `randomized snapshot ${index} mutated`);
    assert.deepEqual(a, b, `randomized Shadow observation ${index} was non-deterministic`);
    assertObservation(a);
    const blocked = new Set([...(snapshot.constraints.occupied || []), ...(snapshot.constraints.excluded || [])]);
    assert.ok(!a.projection.remaining.some((item) => blocked.has(item.id)), `blocked equipment leaked at randomized case ${index}`);
    const routeIds = a.projection.remaining.map((item) => item.id);
    assert.equal(routeIds.length, new Set(routeIds).size, `duplicate route ids at randomized case ${index}`);
    assert.ok(a.projection.budget.projectedMinutes >= 0);
    if (a.projection.budget.effectiveMinutes != null) assert.ok(a.projection.budget.projectedMinutes <= a.projection.budget.effectiveMinutes + 1e-9);
  }
}

console.log('AXIS 8.13 Stage 2 · ownership and Production isolation');
{
  assert.deepEqual(AXIS_SHADOW_DIAGNOSTICS, {
    schema: AXIS_SHADOW_SCHEMA,
    authoritative: false,
    renders: 0,
    writes: 0,
    storageWrites: 0,
    networkRequests: 0,
  });
  const root = process.cwd();
  const files = [
    'runtime/axis-runtime.mjs',
    'runtime/compat/axis-812-adapter.mjs',
    'runtime/shadow/axis-shadow-runtime.mjs',
  ];
  const forbidden = /\b(window|document|localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|navigator|MutationObserver)\b/;
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(!forbidden.test(source), `${file} gained browser/storage/network ownership`);
  }
  const build = fs.readFileSync(path.join(root, 'build-release.mjs'), 'utf8');
  for (const marker of ['runtime/axis-runtime.mjs', 'axis-812-adapter.mjs', 'axis-shadow-runtime.mjs']) {
    assert.ok(!build.includes(marker), `8.12 Production build unexpectedly references ${marker}`);
  }
}

console.log('AXIS 8.13 Shadow Runtime · Stage 2 PASS');
console.log('real assumed sets · active cardio plan · pause/rest/resume · route comparison · fail-open · 500 randomized observations · zero ownership');
