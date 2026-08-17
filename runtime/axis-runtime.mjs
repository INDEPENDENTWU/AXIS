export const AXIS_RUNTIME_SCHEMA = 1;

const DEFAULT_MINUTES = Object.freeze({ strength: 7, cardio: 12, other: 6 });
const INTENSITY = Object.freeze({ normal: 1, less: 0.65, minimum: 0.35 });

const finite = (value) => value == null || value === '' ? null : (Number.isFinite(Number(value)) ? Number(value) : null);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const unique = (values) => [...new Set(values.filter(Boolean))];
const byId = (a, b) => String(a.id).localeCompare(String(b.id));

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeExercise(exercise, fallbackId = null) {
  if (!exercise && !fallbackId) return null;
  const id = String(exercise?.id ?? exercise?.equipmentId ?? fallbackId ?? '').trim();
  if (!id) return null;
  const kind = ['strength', 'cardio'].includes(exercise?.kind) ? exercise.kind : 'other';
  const estimatedMinutes = finite(exercise?.estimatedMinutes);
  return {
    id,
    name: String(exercise?.name ?? id),
    kind,
    pattern: exercise?.pattern ? String(exercise.pattern) : null,
    muscles: unique(Array.isArray(exercise?.muscles) ? exercise.muscles.map(String) : []),
    estimatedMinutes: estimatedMinutes == null ? null : clamp(estimatedMinutes, 1, 180),
  };
}

function normalizeEvent(event) {
  const exercise = normalizeExercise(event);
  if (!exercise) return null;
  const performedSets = finite(event?.performedSets);
  const completed = event?.completed !== false && (
    event?.kind === 'cardio'
      ? (finite(event?.duration) ?? 0) > 0
      : performedSets == null || performedSets > 0
  );
  return {
    ...exercise,
    eventId: event?.eventId ?? event?.id ?? null,
    time: finite(event?.time) ?? 0,
    completed,
    performedSets: performedSets == null ? null : Math.max(0, Math.round(performedSets)),
    duration: finite(event?.duration),
  };
}

function normalizeSession(session) {
  if (!session) return null;
  return {
    id: String(session.id ?? 'session'),
    start: finite(session.start) ?? 0,
    end: finite(session.end),
    events: (Array.isArray(session.events) ? session.events : []).map(normalizeEvent).filter(Boolean),
  };
}

function normalizeHistory(history) {
  return (Array.isArray(history) ? history : [])
    .map(normalizeSession)
    .filter(Boolean)
    .sort((a, b) => (b.start - a.start) || String(a.id).localeCompare(String(b.id)));
}

function normalizeConstraints(constraints = {}) {
  const occupied = unique(Array.isArray(constraints.occupied) ? constraints.occupied.map(String) : []);
  const excluded = unique(Array.isArray(constraints.excluded) ? constraints.excluded.map(String) : []);
  const intensity = ['normal', 'less', 'minimum'].includes(constraints.intensity) ? constraints.intensity : 'normal';
  const maxItemsRaw = finite(constraints.maxItems);
  return {
    occupied,
    excluded,
    intensity,
    maxItems: maxItemsRaw == null ? null : clamp(Math.round(maxItemsRaw), 0, 20),
  };
}

export function normalizeRuntimeInput(input = {}) {
  const now = finite(input.now) ?? 0;
  const leaveAt = finite(input.leaveAt);
  const remainingMinutes = finite(input.remainingMinutes ?? input.budgetMinutes);
  const budgetFromLeave = leaveAt == null ? null : Math.max(0, (leaveAt - now) / 60000);
  const budget = remainingMinutes == null ? budgetFromLeave : Math.max(0, remainingMinutes);
  return {
    schema: AXIS_RUNTIME_SCHEMA,
    now,
    session: normalizeSession(input.session),
    history: normalizeHistory(input.history),
    goal: input.goal == null ? null : String(input.goal),
    currentExercise: normalizeExercise(input.currentExercise),
    constraints: normalizeConstraints(input.constraints),
    budgetMinutes: budget == null ? null : clamp(budget, 0, 24 * 60),
  };
}

function collectEvidence(input) {
  const evidence = new Map();
  const touch = (exercise, weight = 1, when = 0, adjacency = 0) => {
    if (!exercise?.id) return;
    const row = evidence.get(exercise.id) ?? {
      ...exercise,
      frequency: 0,
      lastSeen: 0,
      adjacency: 0,
      durationSamples: [],
    };
    row.frequency += weight;
    row.lastSeen = Math.max(row.lastSeen, when || 0);
    row.adjacency += adjacency;
    if (finite(exercise.estimatedMinutes) != null) row.durationSamples.push(Number(exercise.estimatedMinutes));
    if (exercise.kind === 'cardio' && finite(exercise.duration) != null) row.durationSamples.push(Number(exercise.duration));
    evidence.set(exercise.id, row);
  };

  const currentEvents = input.session?.events ?? [];
  const lastCurrentId = input.currentExercise?.id ?? currentEvents.at(-1)?.id ?? null;
  for (const event of currentEvents) touch(event, 0.4, event.time);

  input.history.forEach((session, sessionIndex) => {
    const recencyWeight = 1 / (1 + sessionIndex * 0.18);
    session.events.forEach((event, index) => {
      const previousId = session.events[index - 1]?.id ?? null;
      touch(event, recencyWeight, event.time || session.start, previousId === lastCurrentId ? recencyWeight * 1.5 : 0);
    });
  });

  if (input.currentExercise) touch(input.currentExercise, 2.5, input.now, 3);
  return evidence;
}

function median(values) {
  const list = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!list.length) return null;
  const middle = Math.floor(list.length / 2);
  return list.length % 2 ? list[middle] : (list[middle - 1] + list[middle]) / 2;
}

function estimateMinutes(item) {
  const observed = median(item.durationSamples ?? []);
  if (observed != null) return clamp(Math.round(observed * 2) / 2, 1, 180);
  return DEFAULT_MINUTES[item.kind] ?? DEFAULT_MINUTES.other;
}

function scoreItem(item, rankContext) {
  const ageHours = Math.max(0, (rankContext.now - item.lastSeen) / 36e5);
  const recency = 1 / (1 + ageHours / 168);
  const currentBoost = rankContext.currentId === item.id ? 8 : 0;
  const adjacency = item.adjacency * 2.5;
  return item.frequency * 3 + recency * 2 + adjacency + currentBoost;
}

function completedIds(session) {
  return new Set((session?.events ?? []).filter((event) => event.completed).map((event) => event.id));
}

function projectCandidates(input) {
  const evidence = collectEvidence(input);
  const completed = completedIds(input.session);
  const occupied = new Set(input.constraints.occupied);
  const excluded = new Set(input.constraints.excluded);
  const currentId = input.currentExercise?.id ?? null;
  const eligible = [];
  const dropped = [];

  for (const item of evidence.values()) {
    const projected = {
      id: item.id,
      name: item.name,
      kind: item.kind,
      pattern: item.pattern,
      muscles: item.muscles,
      estimatedMinutes: estimateMinutes(item),
      score: scoreItem(item, { now: input.now, currentId }),
    };
    if (completed.has(item.id) && item.id !== currentId) {
      dropped.push({ ...projected, reason: 'already-completed' });
      continue;
    }
    if (occupied.has(item.id)) {
      dropped.push({ ...projected, reason: 'occupied' });
      continue;
    }
    if (excluded.has(item.id)) {
      dropped.push({ ...projected, reason: 'excluded' });
      continue;
    }
    eligible.push(projected);
  }

  eligible.sort((a, b) => (b.score - a.score) || byId(a, b));
  dropped.sort((a, b) => byId(a, b));
  return { eligible, dropped, completed };
}

function fitRoute(input, candidates) {
  const budget = input.budgetMinutes;
  const intensityScale = INTENSITY[input.constraints.intensity] ?? 1;
  const scaledBudget = budget == null ? null : Math.max(0, budget * intensityScale);
  const hardItemLimit = input.constraints.maxItems ?? (input.constraints.intensity === 'minimum' ? 1 : null);
  const remaining = [];
  const dropped = [];
  let usedMinutes = 0;
  const seenPatterns = new Set();

  for (const candidate of candidates) {
    if (hardItemLimit != null && remaining.length >= hardItemLimit) {
      dropped.push({ ...candidate, reason: 'item-limit' });
      continue;
    }
    const minutes = candidate.estimatedMinutes;
    const fits = scaledBudget == null || usedMinutes + minutes <= scaledBudget + 1e-9;
    const duplicatePattern = candidate.pattern && seenPatterns.has(candidate.pattern) && scaledBudget != null && scaledBudget <= 20;
    if (!fits) {
      dropped.push({ ...candidate, reason: 'time-budget' });
      continue;
    }
    if (duplicatePattern && remaining.length > 0) {
      dropped.push({ ...candidate, reason: 'redundant-under-tight-budget' });
      continue;
    }
    remaining.push(candidate);
    usedMinutes += minutes;
    if (candidate.pattern) seenPatterns.add(candidate.pattern);
  }

  return { remaining, dropped, usedMinutes, scaledBudget };
}

function stripScore(item) {
  if (!item) return null;
  const { score, ...rest } = item;
  return rest;
}

export function projectWorkout(rawInput = {}) {
  const input = normalizeRuntimeInput(rawInput);
  const reasons = [];
  const { eligible, dropped: constraintDropped } = projectCandidates(input);
  const { remaining, dropped: budgetDropped, usedMinutes, scaledBudget } = fitRoute(input, eligible);

  if (!input.session) reasons.push('NO_ACTIVE_SESSION');
  if (!input.history.length) reasons.push('NO_HISTORY');
  if (input.budgetMinutes != null) reasons.push('TIME_BUDGET_ACTIVE');
  if (input.constraints.occupied.length) reasons.push('OCCUPANCY_CONSTRAINT');
  if (input.constraints.excluded.length) reasons.push('EXCLUSION_CONSTRAINT');
  if (input.constraints.intensity !== 'normal') reasons.push(`INTENSITY_${input.constraints.intensity.toUpperCase()}`);
  if (!remaining.length && eligible.length) reasons.push('NO_ROUTE_FITS');
  if (!eligible.length) reasons.push('NO_ELIGIBLE_WORK');

  const routeIds = new Set(remaining.map((item) => item.id));
  const alternatives = eligible.filter((item) => !routeIds.has(item.id)).slice(0, 3).map(stripScore);
  const allDropped = [...constraintDropped, ...budgetDropped]
    .sort((a, b) => String(a.reason).localeCompare(String(b.reason)) || byId(a, b))
    .map(stripScore);

  const current = remaining[0] ?? null;

  return {
    schema: AXIS_RUNTIME_SCHEMA,
    current: stripScore(current),
    next: stripScore(remaining[1] ?? null),
    alternatives,
    remaining: remaining.map(stripScore),
    dropped: allDropped,
    constraints: clone(input.constraints),
    budget: {
      requestedMinutes: input.budgetMinutes,
      effectiveMinutes: scaledBudget,
      projectedMinutes: Math.round(usedMinutes * 10) / 10,
    },
    reasonCodes: unique(reasons).sort(),
  };
}
