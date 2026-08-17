import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { adaptAxis812Snapshot } from '../runtime/compat/axis-812-adapter.mjs';
import { AXIS_RUNTIME_SCHEMA, normalizeRuntimeInput, projectWorkout } from '../runtime/axis-runtime.mjs';
import { AXIS_812_FIXTURES } from '../runtime/fixtures/axis-812-fixtures.mjs';

const deepClone = (value) => JSON.parse(JSON.stringify(value));
const signature = (value) => JSON.stringify(value);

function projectionFor(name, overrides = {}) {
  const fixture = deepClone(AXIS_812_FIXTURES[name]);
  Object.assign(fixture, overrides);
  const { input, diagnostics } = adaptAxis812Snapshot(fixture);
  return { fixture, input, diagnostics, projection: projectWorkout(input) };
}

function assertProjectionInvariant(projection) {
  assert.equal(projection.schema, AXIS_RUNTIME_SCHEMA);
  assert.ok(Array.isArray(projection.remaining));
  assert.ok(Array.isArray(projection.alternatives));
  assert.ok(Array.isArray(projection.dropped));
  assert.ok(Array.isArray(projection.reasonCodes));
  assert.ok(Number.isFinite(projection.budget.projectedMinutes));
  assert.ok(projection.budget.projectedMinutes >= 0);
  if (projection.budget.effectiveMinutes != null) {
    assert.ok(projection.budget.effectiveMinutes >= 0);
    assert.ok(projection.budget.projectedMinutes <= projection.budget.effectiveMinutes + 1e-9);
  }
  const ids = projection.remaining.map((item) => item.id);
  assert.equal(ids.length, new Set(ids).size, 'remaining route must not contain duplicate equipment ids');
  for (const item of projection.remaining) {
    assert.ok(item.id);
    assert.ok(Number.isFinite(item.estimatedMinutes));
    assert.ok(item.estimatedMinutes > 0);
  }
}

{
  const fixture = deepClone(AXIS_812_FIXTURES.normalContinue);
  const before = signature(fixture);
  const first = adaptAxis812Snapshot(fixture);
  const projectionA = projectWorkout(first.input);
  const projectionB = projectWorkout(adaptAxis812Snapshot(fixture).input);
  assert.equal(signature(fixture), before, 'adapter/runtime may not mutate AXIS 8.12 snapshot input');
  assert.deepEqual(projectionA, projectionB, 'identical input must produce identical projection');
  assertProjectionInvariant(projectionA);
  assert.equal(first.diagnostics.writes, 0);
  assert.equal(first.diagnostics.owners.workoutState, 'app.js / axis_v60_state');
  assert.equal(first.diagnostics.owners.strengthSets, 'v61.js / axis_v8_meta');
}

{
  const { projection } = projectionFor('occupiedNext');
  assertProjectionInvariant(projection);
  assert.ok(!projection.remaining.some((item) => item.id === 'row'), 'occupied equipment must not remain in the route');
  assert.ok(projection.dropped.some((item) => item.id === 'row' && item.reason === 'occupied'));
  assert.ok(projection.reasonCodes.includes('OCCUPANCY_CONSTRAINT'));
}

{
  const { projection } = projectionFor('eightMinutes');
  assertProjectionInvariant(projection);
  assert.ok(projection.budget.projectedMinutes <= 8);
  assert.ok(projection.remaining.every((item) => item.estimatedMinutes <= 8), 'every retained item must fit the tight budget individually');
}

{
  const { input, projection } = projectionFor('incompleteSets');
  assertProjectionInvariant(projection);
  const row = input.session.events.find((event) => event.id === 'row');
  assert.equal(row.performedSets, 1, '8.12 set metadata must preserve unfinished-set semantics');
  assert.equal(row.completed, true, 'a partially performed exercise remains factual completed work');
  assert.equal(projection.current?.id, 'row', 'explicit current exercise may remain current without fabricating extra completed sets');
}

{
  const { projection } = projectionFor('returnAfterGap');
  assertProjectionInvariant(projection);
  assert.ok(!projection.reasonCodes.some((code) => /RESTART|STREAK|FAIL/.test(code)), 'gaps must not create restart/failure semantics');
  assert.ok(projection.remaining.length > 0, 'history remains usable after a long gap');
}

{
  const { projection } = projectionFor('offlineEarlyFinish');
  assertProjectionInvariant(projection);
  assert.equal(projection.budget.effectiveMinutes, 0);
  assert.equal(projection.remaining.length, 0);
  assert.ok(projection.reasonCodes.includes('NO_ROUTE_FITS'));
}

{
  const normalized = normalizeRuntimeInput({
    now: 1000,
    leaveAt: 1000 - 5000,
    remainingMinutes: -20,
    session: { id: 'x', events: [] },
    constraints: { intensity: 'minimum', maxItems: -3 },
  });
  assert.equal(normalized.budgetMinutes, 0);
  assert.equal(normalized.constraints.maxItems, 0);
  const projection = projectWorkout(normalized);
  assertProjectionInvariant(projection);
}

{
  const normal = projectionFor('normalContinue').projection;
  const less = projectionFor('normalContinue', { constraints: { intensity: 'less' } }).projection;
  const minimum = projectionFor('normalContinue', { constraints: { intensity: 'minimum' } }).projection;
  assertProjectionInvariant(less);
  assertProjectionInvariant(minimum);
  assert.ok(less.budget.effectiveMinutes < normal.budget.effectiveMinutes, 'less must physically shrink the usable budget');
  assert.ok(less.budget.projectedMinutes <= normal.budget.projectedMinutes, 'less may not expand the remaining route');
  assert.ok(minimum.remaining.length <= 1, 'minimum is the explicit one-item fallback');
  assert.ok(minimum.reasonCodes.includes('INTENSITY_MINIMUM'));
}

{
  const occupied = projectionFor('occupiedNext').projection;
  const available = projectionFor('occupiedNext', { constraints: {} }).projection;
  assert.ok(!occupied.remaining.some((item) => item.id === 'row'));
  assert.ok(available.remaining.some((item) => item.id === 'row'), 'removing occupancy must allow the route to reinsert equipment naturally');
}

{
  const fixture = deepClone(AXIS_812_FIXTURES.normalContinue);
  delete fixture.remainingMinutes;
  fixture.leaveAt = fixture.now + 18 * 60000;
  const { input } = adaptAxis812Snapshot(fixture);
  const projection = projectWorkout(input);
  assertProjectionInvariant(projection);
  assert.equal(projection.budget.requestedMinutes, 18, 'leave time must normalize into a deterministic minute budget');
  assert.ok(projection.budget.projectedMinutes <= 18);
}

{
  const first = projectionFor('normalContinue').projection;
  const reopened = projectionFor('normalContinue').projection;
  assert.deepEqual(reopened, first, 'refresh/reopen from the same authoritative snapshot must restore the same projection');
}

// Seeded property sweep: randomized real-world constraints may change the route,
// but never produce duplicate, occupied, excluded, negative-time or non-deterministic projections.
{
  let seed = 0x8132026;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const ids = ['row', 'shoulder', 'arms', 'pec', 'walk'];
  for (let i = 0; i < 600; i += 1) {
    const fixture = deepClone(AXIS_812_FIXTURES.normalContinue);
    fixture.remainingMinutes = Math.floor(random() * 61);
    fixture.constraints = {
      occupied: ids.filter(() => random() < 0.16),
      excluded: ids.filter(() => random() < 0.10),
      intensity: ['normal', 'less', 'minimum'][Math.floor(random() * 3)],
      maxItems: random() < 0.25 ? Math.floor(random() * 5) : null,
    };
    const { input } = adaptAxis812Snapshot(fixture);
    const a = projectWorkout(input);
    const b = projectWorkout(input);
    assert.deepEqual(a, b, `projection must stay deterministic at randomized case ${i}`);
    assertProjectionInvariant(a);
    const blocked = new Set([...(fixture.constraints.occupied || []), ...(fixture.constraints.excluded || [])]);
    assert.ok(!a.remaining.some((item) => blocked.has(item.id)), `blocked equipment leaked into route at case ${i}`);
  }
}

// Architectural purity gate: the domain core and compatibility adapter may not gain browser/network/storage ownership.
{
  const root = process.cwd();
  const files = [
    path.join(root, 'runtime/axis-runtime.mjs'),
    path.join(root, 'runtime/compat/axis-812-adapter.mjs'),
  ];
  const forbidden = /\b(window|document|localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|navigator)\b/;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    assert.ok(!forbidden.test(source), `${path.relative(root, file)} must remain UI/storage/network independent`);
  }
  const build = fs.readFileSync(path.join(root, 'build-release.mjs'), 'utf8');
  assert.ok(!build.includes('runtime/axis-runtime.mjs'), 'Stage 1 runtime must not be injected into the 8.12 production bundle');
  assert.ok(!build.includes('axis-812-adapter.mjs'), 'Stage 1 adapter must not be injected into the 8.12 production bundle');
}

console.log('AXIS 8.13 Runtime Core · Stage 0/1 PASS');
console.log('deterministic fixtures · incomplete sets · occupancy · time budget · long-gap continue · early finish · 600 randomized cases');
