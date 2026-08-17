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
assert.equal(EXPECTED, '8.12');

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
          status: 'active', startedAt: t - 5 * 60000, lastResumedAt: t - 5 * 60000,
          pausedAt: null, finishedAt: null, estimateMs: 7 * 60000, completedSets: 0,
          intervals: [{ start: t - 5 * 60000, end: null }], restStartedAt: null, restAccumulatedMs: 0,
        },
        sets: [
          { weight: 40, reps: 10, state: 'assumed', doneAt: null },
          { weight: 40, reps: 10, state: 'assumed', doneAt: null },
          { weight: 40, reps: 10, state: 'assumed', doneAt: null },
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

const startStore = await page.evaluate(() => [localStorage.getItem('axis_v60_state'), localStorage.getItem('axis_v8_meta')]);
const start = await capture('active-before-set');
assert.equal(activeFact(start.observation, 'SHADOW_STRENGTH').performedSets, 0, 'browser assumed sets became phantom completion');
assert.equal(activeFact(start.observation, 'SHADOW_STRENGTH').completed, false);
assert.deepEqual(await page.evaluate(() => [localStorage.getItem('axis_v60_state'), localStorage.getItem('axis_v8_meta')]), startStore, 'Shadow observation changed browser storage');

await page.waitForFunction(() => document.querySelector('#v87Primary') && !document.querySelector('#v87Primary').disabled);
await page.locator('#v87Primary').click();
await page.waitForFunction(() => JSON.parse(localStorage.getItem('axis_v8_meta') || '{}').events?.SHADOW_STRENGTH?.activity?.completedSets === 1);
const afterSet = await capture('after-first-set', 29);
const setFact = activeFact(afterSet.observation, 'SHADOW_STRENGTH');
assert.equal(setFact.performedSets, 1);
assert.equal(setFact.restStartedAt, null, 'real set completion appeared as rest to Shadow Runtime');
const setComparison = compareShadowObservations(start.observation, afterSet.observation);
assert.equal(setComparison.alignment, 'same-item-progress');

await page.locator('#v87Toggle').click();
await page.waitForFunction(() => {
  const activity = JSON.parse(localStorage.getItem('axis_v8_meta') || '{}').events?.SHADOW_STRENGTH?.activity;
  return activity?.status === 'paused' && Number(activity.restStartedAt) > 0;
});
await page.waitForFunction(() => /^休息\s+00:0\d/.test(document.querySelector('#v87Rest')?.textContent?.trim() || ''), undefined, { timeout: 1500 });
const paused = await capture('explicit-pause', 28);
const pausedFact = activeFact(paused.observation, 'SHADOW_STRENGTH');
assert.equal(pausedFact.status, 'paused');
assert.equal(pausedFact.performedSets, 1, 'pause fabricated a set in browser Shadow observation');
assert.ok(Number(pausedFact.restStartedAt) > 0);
assert.equal(compareShadowObservations(afterSet.observation, paused.observation).alignment, 'no-observed-route-change');

await page.waitForTimeout(250);
await page.locator('#v87Toggle').click();
await page.waitForFunction(() => {
  const activity = JSON.parse(localStorage.getItem('axis_v8_meta') || '{}').events?.SHADOW_STRENGTH?.activity;
  return activity?.status === 'active' && activity.restStartedAt == null && Number(activity.restAccumulatedMs) > 0;
});
const resumed = await capture('resume', 27);
const resumedFact = activeFact(resumed.observation, 'SHADOW_STRENGTH');
assert.equal(resumedFact.status, 'active');
assert.equal(resumedFact.performedSets, 1, 'resume fabricated work in browser Shadow observation');
assert.ok(Number(resumedFact.restAccumulatedMs) > 0);
assert.equal(compareShadowObservations(paused.observation, resumed.observation).alignment, 'no-observed-route-change');

console.log(`[AXIS 8.13 Shadow ${ENGINE}] active cardio planned duration remains unfinished`);
await page.evaluate(() => {
  const t = Date.now();
  const event = { id: 'SHADOW_CARDIO', equipmentId: 'treadmill', name: '跑步机', kind: 'cardio', time: t - 2 * 60000, duration: 20, intensity: 5, pattern: 'cardio', muscles: ['心肺'], frameRefs: [] };
  const core = JSON.parse(localStorage.getItem('axis_v60_state') || '{}');
  core.active = { id: 'SHADOW_CARDIO_SESSION', start: t - 2 * 60000, events: [event] };
  localStorage.setItem('axis_v60_state', JSON.stringify(core));
  localStorage.setItem('axis_v8_meta', JSON.stringify({ prefs: {}, events: { SHADOW_CARDIO: { activity: { status: 'active', startedAt: t - 2 * 60000, lastResumedAt: t - 2 * 60000, pausedAt: null, finishedAt: null, estimateMs: 20 * 60000, completedSets: 0, intervals: [{ start: t - 2 * 60000, end: null }], restStartedAt: null, restAccumulatedMs: 0 }, sets: [] } } }));
});
await page.reload({ waitUntil: 'domcontentloaded' });
await ready();
await page.waitForFunction(() => document.querySelector('#v87Finish')?.dataset.id === 'SHADOW_CARDIO');
const cardio = await capture('active-cardio', 25);
const cardioFact = activeFact(cardio.observation, 'SHADOW_CARDIO');
assert.equal(cardioFact.status, 'active');
assert.equal(cardioFact.completed, false, 'planned cardio duration became completed work in real browser Shadow observation');
assert.equal(cardio.observation.input.session.events.find((event) => event.eventId === 'SHADOW_CARDIO').completed, false);

assert.deepEqual(errors, [], `page errors:\n${errors.join('\n')}`);
await context.close();
await browser.close();
console.log(`[AXIS 8.13 Shadow ${ENGINE}] PASS · authoritative browser snapshots · set/pause/resume/cardio · zero product writes`);
