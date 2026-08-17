export const AXIS_812_ADAPTER_SCHEMA = 2;

const finite = (value) => value == null || value === '' ? null : (Number.isFinite(Number(value)) ? Number(value) : null);
const unique = (values) => [...new Set(values.filter(Boolean))];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function activityFor(event, metaEvents) {
  const activity = metaEvents?.[event?.id]?.activity;
  return activity && typeof activity === 'object' ? activity : null;
}

function completedSetCount(activity, count) {
  const value = finite(activity?.completedSets);
  return value == null ? 0 : clamp(Math.round(value), 0, Math.max(0, count));
}

function isPerformedSet(set, index, completedSets) {
  const state = String(set?.state ?? '').trim().toLowerCase();
  const doneAt = finite(set?.doneAt);
  return doneAt != null || ['done', 'finished', 'completed'].includes(state) || index < completedSets;
}

function normalizeSets(event, metaEvents, { archived = false } = {}) {
  const activity = activityFor(event, metaEvents);
  const saved = metaEvents?.[event?.id]?.sets;
  if (Array.isArray(saved) && saved.length) {
    const completedSets = completedSetCount(activity, saved.length);
    return saved.map((set, index) => {
      const done = isPerformedSet(set, index, completedSets);
      return {
        state: done ? 'done' : 'unfinished',
        sourceState: set?.state == null ? null : String(set.state),
        weight: finite(set?.weight),
        reps: finite(set?.reps),
        doneAt: finite(set?.doneAt),
        inferred: Boolean(set?.inferred),
      };
    });
  }

  const count = Math.max(1, Math.round(finite(event?.sets) ?? 1));
  const completedSets = archived ? count : completedSetCount(activity, count);
  return Array.from({ length: count }, (_, index) => ({
    state: index < completedSets ? 'done' : 'unfinished',
    sourceState: null,
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

function activityStatus(event, metaEvents, archived) {
  if (archived) return 'finished';
  const status = String(activityFor(event, metaEvents)?.status ?? '').trim().toLowerCase();
  return ['active', 'paused', 'finished'].includes(status) ? status : 'unknown';
}

function normalizeEvent(event, metaEvents, { archived = false } = {}) {
  const base = exerciseShape(event);
  if (!base.id) return null;
  const activity = activityFor(event, metaEvents);
  const status = activityStatus(event, metaEvents, archived);

  if (base.kind === 'cardio') {
    const plannedMinutes = Math.max(0, finite(event?.duration) ?? 0);
    const actualMinutes = Math.max(0, (finite(activity?.actualMs) ?? 0) / 60000);
    const completed = archived || status === 'finished' || finite(activity?.finishedAt) != null;
    return {
      ...base,
      eventId: event?.id ?? null,
      time: finite(event?.time) ?? 0,
      duration: completed && actualMinutes > 0 ? actualMinutes : plannedMinutes,
      estimatedMinutes: plannedMinutes > 0 ? plannedMinutes : null,
      performedSets: null,
      completed,
      activityStatus: status,
    };
  }

  const sets = normalizeSets(event, metaEvents, { archived });
  const performedSets = sets.filter((set) => set.state === 'done').length;
  return {
    ...base,
    eventId: event?.id ?? null,
    time: finite(event?.time) ?? 0,
    estimatedMinutes: null,
    performedSets,
    completed: performedSets > 0,
    activityStatus: status,
  };
}

function normalizeSession(session, metaEvents, { archived = false } = {}) {
  if (!session) return null;
  return {
    id: String(session.id ?? 'session'),
    start: finite(session.start) ?? 0,
    end: finite(session.end),
    events: (Array.isArray(session.events) ? session.events : [])
      .map((event) => normalizeEvent(event, metaEvents, { archived }))
      .filter(Boolean),
  };
}

function eventTransitionTime(event, metaEvents) {
  const activity = activityFor(event, metaEvents);
  return Math.max(
    finite(activity?.lastResumedAt) ?? 0,
    finite(activity?.pausedAt) ?? 0,
    finite(activity?.startedAt) ?? 0,
    finite(event?.time) ?? 0,
  );
}

function resolveCurrentEvent(snapshot, core, metaEvents) {
  const events = Array.isArray(core.active?.events) ? core.active.events : [];
  if (!events.length) return null;

  const explicitId = String(snapshot.currentEventId ?? '').trim();
  if (explicitId) {
    const explicit = events.find((event) => String(event?.id ?? '') === explicitId);
    if (explicit) return explicit;
  }

  const ranked = events
    .map((event, index) => {
      const status = activityStatus(event, metaEvents, false);
      const rank = status === 'active' ? 3 : status === 'paused' ? 2 : status === 'unknown' ? 1 : 0;
      return { event, index, rank, at: eventTransitionTime(event, metaEvents) };
    })
    .filter((row) => row.rank > 0)
    .sort((a, b) => (b.rank - a.rank) || (b.at - a.at) || (b.index - a.index));

  return ranked[0]?.event ?? null;
}

function normalizeCurrentExercise(currentExercise) {
  if (!currentExercise) return null;
  const base = exerciseShape(currentExercise);
  if (!base.id) return null;
  return {
    ...base,
    estimatedMinutes: finite(currentExercise.estimatedMinutes ?? currentExercise.duration),
  };
}

function activeFacts(core, metaEvents, currentEventId) {
  const events = Array.isArray(core.active?.events) ? core.active.events : [];
  return events.map((event) => {
    const normalized = normalizeEvent(event, metaEvents, { archived: false });
    const activity = activityFor(event, metaEvents);
    const sets = event?.kind === 'strength' ? normalizeSets(event, metaEvents, { archived: false }) : [];
    return {
      eventId: event?.id == null ? null : String(event.id),
      equipmentId: normalized?.id ?? String(event?.equipmentId ?? ''),
      kind: normalized?.kind ?? 'other',
      status: normalized?.activityStatus ?? 'unknown',
      current: event?.id != null && String(event.id) === String(currentEventId ?? ''),
      completed: Boolean(normalized?.completed),
      performedSets: normalized?.performedSets ?? null,
      plannedSets: event?.kind === 'strength' ? Math.max(1, Math.round(finite(event?.sets) ?? sets.length ?? 1)) : null,
      setStates: sets.map((set) => set.state),
      restStartedAt: finite(activity?.restStartedAt),
      restAccumulatedMs: Math.max(0, finite(activity?.restAccumulatedMs) ?? 0),
      pausedAt: finite(activity?.pausedAt),
      finishedAt: finite(activity?.finishedAt),
    };
  });
}

export function adaptAxis812Snapshot(snapshot = {}) {
  const core = snapshot.core && typeof snapshot.core === 'object' ? snapshot.core : {};
  const meta = snapshot.meta && typeof snapshot.meta === 'object' ? snapshot.meta : {};
  const metaEvents = meta.events && typeof meta.events === 'object' ? meta.events : {};
  const history = (Array.isArray(core.sessions) ? core.sessions : [])
    .map((session) => normalizeSession(session, metaEvents, { archived: true }))
    .filter(Boolean);

  const currentEvent = resolveCurrentEvent(snapshot, core, metaEvents);
  const explicitCurrent = normalizeCurrentExercise(snapshot.currentExercise);
  const inferredCurrent = currentEvent ? normalizeCurrentExercise(currentEvent) : null;
  const currentExercise = explicitCurrent ?? inferredCurrent;
  const currentEventId = String(snapshot.currentEventId ?? currentEvent?.id ?? '').trim() || null;

  const input = {
    now: finite(snapshot.now) ?? 0,
    session: normalizeSession(core.active, metaEvents, { archived: false }),
    history,
    goal: core.profile?.goal ?? snapshot.goal ?? null,
    currentExercise,
    leaveAt: finite(snapshot.leaveAt),
    remainingMinutes: finite(snapshot.remainingMinutes),
    constraints: snapshot.constraints ?? {},
  };

  const facts = {
    source: 'axis-8.12',
    activeSessionId: core.active?.id == null ? null : String(core.active.id),
    currentEventId,
    activeEvents: activeFacts(core, metaEvents, currentEventId),
  };

  return {
    input,
    facts,
    diagnostics: {
      source: 'axis-8.12',
      adapterSchema: AXIS_812_ADAPTER_SCHEMA,
      coreVersion: finite(core.version),
      activeSessionPresent: Boolean(core.active),
      sessionCount: history.length,
      metaEventCount: Object.keys(metaEvents).length,
      activeEventCount: facts.activeEvents.length,
      currentEventId,
      owners: {
        workoutState: 'app.js / axis_v60_state',
        strengthSets: 'v61.js / axis_v8_meta',
      },
      writes: 0,
    },
  };
}
