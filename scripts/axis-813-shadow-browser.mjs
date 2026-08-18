import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compareShadowObservations, observeAxis812Shadow } from '../runtime/shadow/axis-shadow-runtime.mjs';

const ENGINE = process.env.AXIS_ENGINE || 'chromium';
const BASE = process.env.AXIS_URL || 'http://127.0.0.1:4173';
const EXPECTED = JSON.parse(fs.readFileSync('release-contract.json', 'utf8')).publicVersion;
const mod = ENGINE === 'webkit' ? await import('playwright') : await import('playwright-core');
const launcher = ENGINE === 'webkit' ? mod.webkit : mod.chromium;
const browser = await launcher.launch(ENGINE === 'chromium'
  ? { headless: true, executablePath: process.env.CHROME_BIN || undefined, args: ['--no-sandbox'] }
  : { headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-CN' });
const page = await context.newPage();

const json = (route, body) => route.fulfill({
  status: 200,
  contentType: 'application/json',
  headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' },
  body: JSON.stringify(body),
});
for (const [pattern, body] of [
  ['**/api/ai-status**', { available: false, vision: false, insight: false, version: 'axis-ai-v4' }],
  ['**/api/owner-config**', { ok: true }],
  ['**/api/analyze**', { available: false, error: 'not_available' }],
  ['**/api/insight**', { available: false, error: 'not_available' }],
  ['**/nominatim.openstreetmap.org/reverse**', { name: '测试健身房', address: { road: '测试路', city: '测试市' } }],
]) await page.route(pattern, (route) => json(route, body));

const errors = [];
page.on('pageerror', (error) => errors.push(String(error?.stack || error)));
const ready = async () => {
  await page.waitForFunction(() => window.__AXIS_CORE_INTERACTIVE__ === true, undefined, { timeout: 6000 });
  await page.waitForFunction(() => window.__AXIS_CANONICAL_88__?.state === 'ready', undefined, { timeout: 9000 });
};

async function capture(boundary, remainingMinutes = 30) {
  const snapshot = await page.evaluate((remaining) => ({
    now: Date.now(),
    remainingMinutes: remaining,
    currentEventId: document.querySelector('#v87Finish')?.dataset.id || null,
    core: JSON.parse(localStorage.getItem('axis_v60_state') || '{}'),
    meta: JSON.parse(localStorage.getItem('axis_v8_meta') || '{}'),
  }), remainingMinutes);
  const observation = observeAxis812Shadow(snapshot);
  assert.equal(observation.diagnostics.state, 'ok', `${boundary}: Shadow observation failed`);
  assert.equal(observation.diagnostics.writes, 0);
  return { boundary, snapshot, observation };
}

function activeFact(observation, eventId) {
  return observation.facts.activeEvents.find((event) => event.eventId === eventId);
}

assert.ok((await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 12000 }))?.ok());
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'domcontentloaded' });
await ready();
assert.equal(await page.evaluate(() => window.__AXIS_RELEASE__), EXPECTED);
assert.ok(['8.12','8.12.1','8.12.2'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);

console.log(`[AXIS 8.13 Shadow ${ENGINE}] observe real strength recording boundaries`);
await page.evaluate(() => {
  const t = Date.now();
  const historical = {
    id: 'SHADOW_HISTORY', start: t - 3 * 86400000, end: t - 3 * 86400000 + 42 * 60000,
    events: [
      { id: 'H_CHEST', equipmentId: 'chest', name: '胸推', kind: 'strength', time: t - 3 * 86400000 + 4 * 60000, weight: 40, reps: 10, sets: 3, pattern: 'push', muscles: ['胸肌'], frameRefs: [] },
      { id: 'H_ROW', equipmentId: 'row', name: '坐姿划船', kind: 'strength', time: t - 3 * 86400000 + 16 * 60000, weight: 42.5, reps: 10, sets: 3, pattern: 'pull', muscles: ['背部'], frameRefs: [] },
      { id: 'H_SHOULDER', equipmentId: 'shoulder', name: '肩推', kind: 'strength', time: t - 3 * 86400000 + 29 * 60000, weight: 25, reps: 10, sets: 3, pattern: 'push', muscles: ['肩部'], frameRefs: [] },
    ],
  };
  const event = { id: 'SHADOW_STRENGTH', equipmentId: 'chest', name: '胸推', kind: 'strength', time: t - 5 * 60000, weight: 40, reps: 10, sets: 3, pattern: 'push', muscles: ['胸肌'], frameRefs: [] };
  const core = {
    version: 60, sessions: [historical], active: { id: 'SHADOW_SESSION', start: t - 8 * 60000, events: [event] },
    selectedEq: null, frames: [], clip: null, stream: null, ai: null,
    profile: { name: '', height: '', weight: '', bodyFat: '', years: '', freq: 3, goal: '保持规律', memories: [], customEq: [] },
    prefs: { keepClip: true, scanSeconds: 3, watermark: { name: true, data: true, time: true, brand: true, pos: 'bl', photoMode: 'wm', videoMode: 'wm' } },
  };
  const meta = {
    prefs: {},
    events: {
      SHADOW_STRENGTH: {
        activity: {
          status: 'active', startedAt: t - 5 * 60000, lastResumedAt: t - 5 * 60000, pausedAt: null, finishedAt: null,
          estimateMs: 240000, completedSets: 0, intervals: [{ start: t - 5 * 60000, end: null }], restStartedAt: null,
        },
        sets: [
          { state: 'assumed', doneAt: null },
          { state: 'assumed', doneAt: null },
          { state: 'assumed', doneAt: null },
        ],
      },
    },
  };
  localStorage.setItem('axis_v60_state', JSON.stringify(core));
  localStorage.setItem('axis_v8_meta', JSON.stringify(meta));
});
await page.reload({ waitUntil: 'domcontentloaded' });
await ready();
await page.waitForFunction(() => document.querySelector('#v87Finish')?.dataset.id === 'SHADOW_STRENGTH');
const initialStorage = await page.evaluate(() => ({
  core: localStorage.getItem('axis_v60_state'),
  meta: localStorage.getItem('axis_v8_meta'),
}));
const boot = await capture('boot');
assert.equal(activeFact(boot.observation, 'SHADOW_STRENGTH')?.performedSets, 0, 'assumed sets became phantom completion');
assert.equal(boot.observation.projection.current?.id, 'chest');
assert.ok(boot.observation.projection.next?.id, 'history evidence did not produce a next route item');

await page.locator('#v87Primary').click();
await page.waitForFunction(() => {
  const meta = JSON.parse(localStorage.getItem('axis_v8_meta') || '{}');
  return Number(meta.events?.SHADOW_STRENGTH?.activity?.completedSets) === 1 && meta.events?.SHADOW_STRENGTH?.sets?.[0]?.state === 'done';
}, undefined, { timeout: 2500 });
const setComplete = await capture('set-complete');
assert.equal(activeFact(setComplete.observation, 'SHADOW_STRENGTH')?.performedSets, 1);
assert.equal(activeFact(setComplete.observation, 'SHADOW_STRENGTH')?.setStates.filter((state) => state === 'assumed').length, 2);
assert.equal(setComplete.observation.facts.activeEvents.find((event) => event.eventId === 'SHADOW_STRENGTH')?.restStartedAt, null, 'set completion invented rest');

await page.locator('#v87Toggle').click();
await page.waitForFunction(() => {
  const activity = JSON.parse(localStorage.getItem('axis_v8_meta') || '{}').events?.SHADOW_STRENGTH?.activity;
  return activity?.status === 'paused' && Number(activity?.restStartedAt) > 0;
}, undefined, { timeout: 2500 });
const paused = await capture('pause');
assert.equal(activeFact(paused.observation, 'SHADOW_STRENGTH')?.activityStatus, 'paused');
assert.ok(Number(activeFact(paused.observation, 'SHADOW_STRENGTH')?.restStartedAt) > 0);
await page.locator('#v87Toggle').click();
await page.waitForFunction(() => {
  const activity = JSON.parse(localStorage.getItem('axis_v8_meta') || '{}').events?.SHADOW_STRENGTH?.activity;
  return activity?.status === 'active' && activity?.restStartedAt == null && Number(activity?.restAccumulatedMs) >= 0;
}, undefined, { timeout: 2500 });
const resumed = await capture('resume');
assert.equal(activeFact(resumed.observation, 'SHADOW_STRENGTH')?.activityStatus, 'active');
assert.equal(activeFact(resumed.observation, 'SHADOW_STRENGTH')?.restStartedAt, null);
assert.ok(Number(activeFact(resumed.observation, 'SHADOW_STRENGTH')?.restAccumulatedMs) >= 0);

const afterStorage = await page.evaluate(() => ({
  core: localStorage.getItem('axis_v60_state'),
  meta: localStorage.getItem('axis_v8_meta'),
}));
assert.notEqual(afterStorage.meta, initialStorage.meta, 'authoritative owner actions did not update their own metadata');
assert.equal(afterStorage.core, initialStorage.core, 'Shadow observation changed core storage during owner-only set/pause/resume actions');
for (const [before, after, label] of [[boot, setComplete, 'set'], [setComplete, paused, 'pause'], [paused, resumed, 'resume']]) {
  const comparison = compareShadowObservations(before.observation, after.observation);
  assert.equal(comparison.diagnostics.toState, 'ok', `${label}: Shadow comparison failed`);
}

console.log(`[AXIS 8.13 Shadow ${ENGINE}] active cardio does not claim planned duration as completed`);
await page.evaluate(() => {
  const t = Date.now();
  const core = JSON.parse(localStorage.getItem('axis_v60_state') || '{}');
  core.active.events = [{ id: 'SHADOW_CARDIO', equipmentId: 'treadmill', name: '跑步机', kind: 'cardio', time: t - 90000, duration: 20, intensity: 3, muscles: [], frameRefs: [] }];
  localStorage.setItem('axis_v60_state', JSON.stringify(core));
  const meta = JSON.parse(localStorage.getItem('axis_v8_meta') || '{}');
  meta.events = {
    SHADOW_CARDIO: {
      activity: {
        status: 'active', startedAt: t - 90000, lastResumedAt: t - 90000, pausedAt: null, finishedAt: null,
        estimateMs: 20 * 60000, completedSets: 0, intervals: [{ start: t - 90000, end: null }], restStartedAt: null,
      },
    },
  };
  localStorage.setItem('axis_v8_meta', JSON.stringify(meta));
});
await page.reload({ waitUntil: 'domcontentloaded' });
await ready();
await page.waitForFunction(() => document.querySelector('#v87Finish')?.dataset.id === 'SHADOW_CARDIO');
const cardio = await capture('active-cardio');
const cardioFact = activeFact(cardio.observation, 'SHADOW_CARDIO');
assert.equal(cardioFact?.plannedDurationMinutes, 20);
assert.equal(cardioFact?.performedDurationMinutes, null, 'active cardio plan became performed duration');
assert.equal(cardio.observation.projection.current?.id, 'treadmill');
assert.deepEqual(errors, [], `product page errors:\n${errors.join('\n')}`);

console.log(`[AXIS 8.13 Shadow ${ENGINE}] PASS · browser owns facts · Shadow reads only · assumed sets stay unfinished · pause owns rest · active cardio remains unperformed`);
await context.close();
await browser.close();
