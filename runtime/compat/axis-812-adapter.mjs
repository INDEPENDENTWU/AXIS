const finite = (value) => value == null || value === '' ? null : (Number.isFinite(Number(value)) ? Number(value) : null);
const unique = (values) => [...new Set(values.filter(Boolean))];

function normalizeSets(event, metaEvents) {
  const saved = metaEvents?.[event?.id]?.sets;
  if (Array.isArray(saved) && saved.length) {
    return saved.map((set) => ({
      state: set?.state || (set?.doneAt ? 'done' : 'done'),
      weight: finite(set?.weight),
      reps: finite(set?.reps),
      doneAt: finite(set?.doneAt),
      inferred: Boolean(set?.inferred),
    }));
  }
  const count = Math.max(1, Math.round(finite(event?.sets) ?? 1));
  return Array.from({ length: count }, () => ({
    state: 'done',
    weight: finite(event?.weight),
    reps: finite(event?.reps),
    doneAt: null,
    inferred: true,
  }));
}

function exerciseShape(event) {
  return {
    id: String(event?.equipmentId ?? event?.id ?? '').trim(),
    name: String(event?.name ?? event?.equipmentId ?? event?.id ?? '未命名'),
    kind: event?.kind === 'cardio' ? 'cardio' : event?.kind === 'strength' ? 'strength' : 'other',
    pattern: event?.pattern ? String(event.pattern) : null,
    muscles: unique(Array.isArray(event?.muscles) ? event.muscles.map(String) : []),
  };
}

function normalizeEvent(event, metaEvents) {
  const base = exerciseShape(event);
  if (!base.id) return null;
  if (base.kind === 'cardio') {
    const duration = Math.max(0, finite(event?.duration) ?? 0);
    return {
      ...base,
      eventId: event?.id ?? null,
      time: finite(event?.time) ?? 0,
      duration,
      estimatedMinutes: duration > 0 ? duration : null,
      performedSets: null,
      completed: duration > 0,
    };
  }
  const sets = normalizeSets(event, metaEvents);
  const performedSets = sets.filter((set) => set.state !== 'unfinished').length;
  return {
    ...base,
    eventId: event?.id ?? null,
    time: finite(event?.time) ?? 0,
    estimatedMinutes: null,
    performedSets,
    completed: performedSets > 0,
  };
}

function normalizeSession(session, metaEvents) {
  if (!session) return null;
  return {
    id: String(session.id ?? 'session'),
    start: finite(session.start) ?? 0,
    end: finite(session.end),
    events: (Array.isArray(session.events) ? session.events : [])
      .map((event) => normalizeEvent(event, metaEvents))
      .filter(Boolean),
  };
}

function normalizeCurrentExercise(currentExercise) {
  if (!currentExercise) return null;
  const base = exerciseShape(currentExercise);
  if (!base.id) return null;
  return {
    ...base,
    estimatedMinutes: finite(currentExercise.estimatedMinutes),
  };
}

export function adaptAxis812Snapshot(snapshot = {}) {
  const core = snapshot.core && typeof snapshot.core === 'object' ? snapshot.core : {};
  const meta = snapshot.meta && typeof snapshot.meta === 'object' ? snapshot.meta : {};
  const metaEvents = meta.events && typeof meta.events === 'object' ? meta.events : {};
  const history = (Array.isArray(core.sessions) ? core.sessions : [])
    .map((session) => normalizeSession(session, metaEvents))
    .filter(Boolean);

  const input = {
    now: finite(snapshot.now) ?? 0,
    session: normalizeSession(core.active, metaEvents),
    history,
    goal: core.profile?.goal ?? snapshot.goal ?? null,
    currentExercise: normalizeCurrentExercise(snapshot.currentExercise),
    leaveAt: finite(snapshot.leaveAt),
    remainingMinutes: finite(snapshot.remainingMinutes),
    constraints: snapshot.constraints ?? {},
  };

  return {
    input,
    diagnostics: {
      source: 'axis-8.12',
      coreVersion: finite(core.version),
      activeSessionPresent: Boolean(core.active),
      sessionCount: history.length,
      metaEventCount: Object.keys(metaEvents).length,
      owners: {
        workoutState: 'app.js / axis_v60_state',
        strengthSets: 'v61.js / axis_v8_meta',
      },
      writes: 0,
    },
  };
}
