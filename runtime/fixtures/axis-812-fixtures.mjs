const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.UTC(2026, 7, 18, 10, 0, 0);

function strength(id, equipmentId, name, time, sets = 3, weight = 30, reps = 10, pattern = 'push', muscles = []) {
  return { id, equipmentId, name, kind: 'strength', time, sets, weight, reps, pattern, muscles };
}

function cardio(id, equipmentId, name, time, duration = 15, intensity = 5) {
  return { id, equipmentId, name, kind: 'cardio', time, duration, intensity, pattern: 'cardio', muscles: ['心肺'] };
}

const history = [
  {
    id: 'hist-1', start: NOW - 3 * DAY, end: NOW - 3 * DAY + 52 * 60000,
    events: [
      strength('h1-a', 'chest', '胸推', NOW - 3 * DAY + 5 * 60000, 3, 40, 10, 'push', ['胸肌', '肱三头肌']),
      strength('h1-b', 'row', '坐姿 / 胸托划船', NOW - 3 * DAY + 17 * 60000, 3, 42.5, 10, 'pull', ['背部', '肱二头肌']),
      strength('h1-c', 'shoulder', '肩推', NOW - 3 * DAY + 29 * 60000, 3, 25, 10, 'push', ['肩部', '肱三头肌']),
      strength('h1-d', 'arms', '手臂', NOW - 3 * DAY + 40 * 60000, 3, 20, 12, 'pull', ['肱二头肌', '肱三头肌']),
    ],
  },
  {
    id: 'hist-2', start: NOW - 8 * DAY, end: NOW - 8 * DAY + 47 * 60000,
    events: [
      strength('h2-a', 'chest', '胸推', NOW - 8 * DAY + 4 * 60000, 3, 37.5, 10, 'push', ['胸肌', '肱三头肌']),
      strength('h2-b', 'row', '坐姿 / 胸托划船', NOW - 8 * DAY + 16 * 60000, 3, 40, 10, 'pull', ['背部', '肱二头肌']),
      strength('h2-c', 'pec', '飞鸟 / 后三角', NOW - 8 * DAY + 28 * 60000, 3, 25, 12, 'push', ['胸肌', '肩部']),
      cardio('h2-d', 'walk', '步行', NOW - 8 * DAY + 36 * 60000, 10, 4),
    ],
  },
];

const meta = {
  events: {
    'today-chest': {
      sets: [
        { weight: 40, reps: 10, state: 'done', doneAt: NOW - 18 * 60000 },
        { weight: 40, reps: 9, state: 'done', doneAt: NOW - 15 * 60000 },
        { weight: 40, reps: 8, state: 'done', doneAt: NOW - 12 * 60000 },
      ],
    },
    'today-row-partial': {
      sets: [
        { weight: 42.5, reps: 10, state: 'done', doneAt: NOW - 9 * 60000 },
        { weight: 42.5, reps: 10, state: 'unfinished' },
        { weight: 42.5, reps: 10, state: 'unfinished' },
      ],
    },
  },
};

export const AXIS_812_FIXTURES = Object.freeze({
  normalContinue: {
    now: NOW,
    remainingMinutes: 25,
    core: {
      version: 60,
      profile: { goal: '保持规律' },
      active: {
        id: 'today', start: NOW - 22 * 60000,
        events: [strength('today-chest', 'chest', '胸推', NOW - 12 * 60000, 3, 40, 9, 'push', ['胸肌', '肱三头肌'])],
      },
      sessions: history,
    },
    meta,
  },
  occupiedNext: {
    now: NOW,
    remainingMinutes: 25,
    constraints: { occupied: ['row'] },
    core: {
      version: 60,
      active: {
        id: 'today', start: NOW - 22 * 60000,
        events: [strength('today-chest', 'chest', '胸推', NOW - 12 * 60000, 3, 40, 9, 'push', ['胸肌', '肱三头肌'])],
      },
      sessions: history,
    },
    meta,
  },
  eightMinutes: {
    now: NOW,
    remainingMinutes: 8,
    core: {
      version: 60,
      active: {
        id: 'today', start: NOW - 32 * 60000,
        events: [strength('today-chest', 'chest', '胸推', NOW - 12 * 60000, 3, 40, 9, 'push', ['胸肌', '肱三头肌'])],
      },
      sessions: history,
    },
    meta,
  },
  incompleteSets: {
    now: NOW,
    remainingMinutes: 18,
    currentExercise: { id: 'row', name: '坐姿 / 胸托划船', kind: 'strength', pattern: 'pull', muscles: ['背部', '肱二头肌'] },
    core: {
      version: 60,
      active: {
        id: 'today', start: NOW - 25 * 60000,
        events: [
          strength('today-chest', 'chest', '胸推', NOW - 15 * 60000, 3, 40, 9, 'push', ['胸肌', '肱三头肌']),
          strength('today-row-partial', 'row', '坐姿 / 胸托划船', NOW - 9 * 60000, 3, 42.5, 10, 'pull', ['背部', '肱二头肌']),
        ],
      },
      sessions: history,
    },
    meta,
  },
  returnAfterGap: {
    now: NOW,
    remainingMinutes: 20,
    core: {
      version: 60,
      active: { id: 'return', start: NOW - 2 * 60000, events: [] },
      sessions: history.map((session) => ({
        ...session,
        start: session.start - 10 * DAY,
        end: session.end - 10 * DAY,
        events: session.events.map((event) => ({ ...event, time: event.time - 10 * DAY })),
      })),
    },
    meta: { events: {} },
  },
  offlineEarlyFinish: {
    now: NOW,
    remainingMinutes: 0,
    core: {
      version: 60,
      active: {
        id: 'today', start: NOW - 18 * 60000,
        events: [strength('today-chest', 'chest', '胸推', NOW - 10 * 60000, 2, 40, 10, 'push', ['胸肌', '肱三头肌'])],
      },
      sessions: history,
    },
    meta,
  },
});
