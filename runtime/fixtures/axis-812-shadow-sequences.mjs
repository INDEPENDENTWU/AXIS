const MINUTE = 60 * 1000;
const NOW = Date.UTC(2026, 7, 18, 18, 0, 0);

const profile = { goal: '保持规律' };

function strength(id, equipmentId, name, time, sets = 3, weight = 40, reps = 10, pattern = 'push', muscles = []) {
  return { id, equipmentId, name, kind: 'strength', time, sets, weight, reps, pattern, muscles };
}

function cardio(id, equipmentId, name, time, duration = 20, intensity = 5) {
  return { id, equipmentId, name, kind: 'cardio', time, duration, intensity, pattern: 'cardio', muscles: ['心肺'] };
}

const historical = {
  id: 'hist-shadow',
  start: NOW - 3 * 24 * 60 * MINUTE,
  end: NOW - 3 * 24 * 60 * MINUTE + 48 * MINUTE,
  events: [
    strength('hist-chest', 'chest', '胸推', NOW - 3 * 24 * 60 * MINUTE + 5 * MINUTE, 3, 40, 10, 'push', ['胸肌']),
    strength('hist-row', 'row', '坐姿划船', NOW - 3 * 24 * 60 * MINUTE + 18 * MINUTE, 3, 42.5, 10, 'pull', ['背部']),
    strength('hist-shoulder', 'shoulder', '肩推', NOW - 3 * 24 * 60 * MINUTE + 31 * MINUTE, 3, 25, 10, 'push', ['肩部']),
  ],
};

const chest = strength('live-chest', 'chest', '胸推', NOW - 12 * MINUTE, 3, 40, 10, 'push', ['胸肌']);
const row = strength('live-row', 'row', '坐姿划船', NOW - 2 * MINUTE, 3, 42.5, 10, 'pull', ['背部']);

function coreWith(events) {
  return {
    version: 60,
    profile,
    active: { id: 'live-session', start: NOW - 20 * MINUTE, events },
    sessions: [historical],
  };
}

function chestMeta({ completedSets = 0, status = 'active', restStartedAt = null, restAccumulatedMs = 0, now = NOW } = {}) {
  const sets = [
    { weight: 40, reps: 10, state: completedSets >= 1 ? 'done' : 'assumed', doneAt: completedSets >= 1 ? now - 30_000 : null },
    { weight: 40, reps: 10, state: 'assumed', doneAt: null },
    { weight: 40, reps: 10, state: 'assumed', doneAt: null },
  ];
  return {
    activity: {
      status,
      startedAt: NOW - 12 * MINUTE,
      lastResumedAt: status === 'active' ? now - 60_000 : NOW - 12 * MINUTE,
      pausedAt: status === 'paused' ? now - 5_000 : null,
      finishedAt: null,
      estimateMs: 7 * MINUTE,
      completedSets,
      intervals: [{ start: NOW - 12 * MINUTE, end: status === 'paused' ? now - 5_000 : null }],
      restStartedAt,
      restAccumulatedMs,
    },
    sets,
  };
}

export const AXIS_812_SHADOW_SEQUENCES = {
  strengthLifecycle: [
    {
      boundary: 'active-before-first-set',
      snapshot: {
        now: NOW - 90_000,
        remainingMinutes: 30,
        currentEventId: 'live-chest',
        core: coreWith([chest]),
        meta: { events: { 'live-chest': chestMeta({ completedSets: 0, now: NOW - 90_000 }) } },
      },
    },
    {
      boundary: 'after-first-set',
      snapshot: {
        now: NOW - 60_000,
        remainingMinutes: 29,
        currentEventId: 'live-chest',
        core: coreWith([chest]),
        meta: { events: { 'live-chest': chestMeta({ completedSets: 1, now: NOW - 60_000 }) } },
      },
    },
    {
      boundary: 'explicit-pause',
      snapshot: {
        now: NOW - 40_000,
        remainingMinutes: 28,
        currentEventId: 'live-chest',
        core: coreWith([chest]),
        meta: { events: { 'live-chest': chestMeta({ completedSets: 1, status: 'paused', restStartedAt: NOW - 45_000, now: NOW - 40_000 }) } },
      },
    },
    {
      boundary: 'resume-with-rest-accumulated',
      snapshot: {
        now: NOW - 30_000,
        remainingMinutes: 27,
        currentEventId: 'live-chest',
        core: coreWith([chest]),
        meta: { events: { 'live-chest': chestMeta({ completedSets: 1, status: 'active', restStartedAt: null, restAccumulatedMs: 15_000, now: NOW - 30_000 }) } },
      },
    },
    {
      boundary: 'current-event-changed-to-row',
      snapshot: {
        now: NOW,
        remainingMinutes: 24,
        currentEventId: 'live-row',
        core: coreWith([chest, row]),
        meta: {
          events: {
            'live-chest': chestMeta({ completedSets: 1, status: 'paused', restStartedAt: NOW - 1_000, restAccumulatedMs: 15_000, now: NOW }),
            'live-row': {
              activity: {
                status: 'active', startedAt: NOW - 2 * MINUTE, lastResumedAt: NOW - 2 * MINUTE,
                pausedAt: null, finishedAt: null, estimateMs: 7 * MINUTE, completedSets: 0,
                intervals: [{ start: NOW - 2 * MINUTE, end: null }], restStartedAt: null, restAccumulatedMs: 0,
              },
              sets: [
                { weight: 42.5, reps: 10, state: 'assumed', doneAt: null },
                { weight: 42.5, reps: 10, state: 'assumed', doneAt: null },
                { weight: 42.5, reps: 10, state: 'assumed', doneAt: null },
              ],
            },
          },
        },
      },
    },
  ],

  activeCardioPlan: {
    now: NOW,
    remainingMinutes: 30,
    currentEventId: 'live-cardio',
    core: {
      version: 60,
      profile,
      active: { id: 'cardio-session', start: NOW - 5 * MINUTE, events: [cardio('live-cardio', 'treadmill', '跑步机', NOW - 5 * MINUTE, 20, 5)] },
      sessions: [historical],
    },
    meta: {
      events: {
        'live-cardio': {
          activity: {
            status: 'active', startedAt: NOW - 5 * MINUTE, lastResumedAt: NOW - 5 * MINUTE,
            pausedAt: null, finishedAt: null, estimateMs: 20 * MINUTE, completedSets: 0,
            intervals: [{ start: NOW - 5 * MINUTE, end: null }], restStartedAt: null, restAccumulatedMs: 0,
          },
          sets: [],
        },
      },
    },
  },

  assumedWithoutActivity: {
    now: NOW,
    remainingMinutes: 20,
    currentEventId: 'assumed-only',
    core: {
      version: 60,
      profile,
      active: { id: 'assumed-session', start: NOW - 4 * MINUTE, events: [strength('assumed-only', 'pec', '夹胸', NOW - 4 * MINUTE, 3, 30, 12)] },
      sessions: [historical],
    },
    meta: {
      events: {
        'assumed-only': {
          sets: [
            { weight: 30, reps: 12, state: 'assumed', doneAt: null },
            { weight: 30, reps: 12, state: 'assumed', doneAt: null },
            { weight: 30, reps: 12, state: 'assumed', doneAt: null },
          ],
        },
      },
    },
  },
};

export const AXIS_812_SHADOW_NOW = NOW;
