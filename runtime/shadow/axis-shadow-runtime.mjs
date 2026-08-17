import { adaptAxis812Snapshot } from '../compat/axis-812-adapter.mjs';
import { projectWorkout } from '../axis-runtime.mjs';

export const AXIS_SHADOW_SCHEMA = 1;

const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));

function canonical(value, seen = new Set()) {
  if (value === null) return 'null';
  const type = typeof value;
  if (type === 'number') return Number.isFinite(value) ? JSON.stringify(value) : 'null';
  if (type === 'boolean' || type === 'string') return JSON.stringify(value);
  if (type === 'undefined') return 'null';
  if (type !== 'object') return JSON.stringify(String(value));
  if (seen.has(value)) throw new TypeError('cyclic shadow input');
  seen.add(value);
  try {
    if (Array.isArray(value)) return `[${value.map((item) => canonical(item, seen)).join(',')}]`;
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key], seen)}`).join(',')}}`;
  } finally {
    seen.delete(value);
  }
}

function fingerprint(value) {
  const source = canonical(value);
  let hash = 14695981039346656037n;
  const prime = 1099511628211n;
  const mask = (1n << 64n) - 1n;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= BigInt(source.charCodeAt(index));
    hash = (hash * prime) & mask;
  }
  return hash.toString(16).padStart(16, '0');
}

function failureObservation(error) {
  return {
    schema: AXIS_SHADOW_SCHEMA,
    fingerprint: null,
    input: null,
    facts: null,
    projection: null,
    diagnostics: {
      source: 'axis-8.12-shadow',
      state: 'error',
      errorCode: 'SHADOW_OBSERVATION_FAILED',
      errorName: String(error?.name || 'Error'),
      writes: 0,
      storageWrites: 0,
      uiWrites: 0,
      networkRequests: 0,
    },
  };
}

export function observeAxis812Shadow(snapshot = {}) {
  try {
    const adapted = adaptAxis812Snapshot(snapshot);
    const projection = projectWorkout(adapted.input);
    const stableInput = { input: adapted.input, facts: adapted.facts };
    return {
      schema: AXIS_SHADOW_SCHEMA,
      fingerprint: fingerprint(stableInput),
      input: clone(adapted.input),
      facts: clone(adapted.facts),
      projection: clone(projection),
      diagnostics: {
        source: 'axis-8.12-shadow',
        state: 'ok',
        adapter: clone(adapted.diagnostics),
        writes: 0,
        storageWrites: 0,
        uiWrites: 0,
        networkRequests: 0,
      },
    };
  } catch (error) {
    return failureObservation(error);
  }
}

function factMap(observation) {
  return new Map((observation?.facts?.activeEvents ?? []).map((event) => [String(event.eventId ?? ''), event]));
}

function eventForCurrent(observation) {
  const currentId = observation?.facts?.currentEventId;
  if (!currentId) return null;
  return (observation?.facts?.activeEvents ?? []).find((event) => String(event.eventId) === String(currentId)) ?? null;
}

function findObservedTransition(previous, current) {
  const previousMap = factMap(previous);
  const currentMap = factMap(current);
  const previousCurrent = eventForCurrent(previous);
  const currentCurrent = eventForCurrent(current);

  if (currentCurrent && String(currentCurrent.eventId) !== String(previousCurrent?.eventId ?? '')) {
    return {
      type: 'current-event-changed',
      eventId: currentCurrent.eventId,
      equipmentId: currentCurrent.equipmentId,
    };
  }

  for (const event of currentMap.values()) {
    if (!previousMap.has(String(event.eventId))) {
      return { type: 'event-added', eventId: event.eventId, equipmentId: event.equipmentId };
    }
  }

  for (const event of currentMap.values()) {
    const before = previousMap.get(String(event.eventId));
    if (!before) continue;
    const beforeSets = Number(before.performedSets ?? 0);
    const afterSets = Number(event.performedSets ?? 0);
    if (afterSets > beforeSets) {
      return {
        type: 'current-progress',
        eventId: event.eventId,
        equipmentId: event.equipmentId,
        performedSetsBefore: beforeSets,
        performedSetsAfter: afterSets,
      };
    }
    if (!before.completed && event.completed) {
      return { type: 'event-completed', eventId: event.eventId, equipmentId: event.equipmentId };
    }
  }

  return null;
}

function projectedPosition(projection, equipmentId) {
  if (!projection || !equipmentId) return { source: null, rank: null };
  const remaining = projection.remaining ?? [];
  const rank = remaining.findIndex((item) => String(item.id) === String(equipmentId));
  if (rank >= 0) return { source: rank === 0 ? 'current' : rank === 1 ? 'next' : 'remaining', rank };
  const alternativeRank = (projection.alternatives ?? []).findIndex((item) => String(item.id) === String(equipmentId));
  if (alternativeRank >= 0) return { source: 'alternative', rank: alternativeRank };
  return { source: 'unprojected', rank: null };
}

export function compareShadowObservations(previous, current) {
  const reasons = [];
  if (!previous?.projection || !current?.projection) {
    return {
      schema: AXIS_SHADOW_SCHEMA,
      from: previous?.fingerprint ?? null,
      to: current?.fingerprint ?? null,
      observed: null,
      projected: { source: null, rank: null },
      alignment: 'not-comparable',
      reasonCodes: ['SHADOW_OBSERVATION_ERROR'],
    };
  }

  const previousSession = previous?.facts?.activeSessionId ?? null;
  const currentSession = current?.facts?.activeSessionId ?? null;
  const sessionChanged = previousSession !== currentSession;
  if (sessionChanged) reasons.push('ACTIVE_SESSION_CHANGED');

  const observed = findObservedTransition(previous, current);
  if (!observed) {
    return {
      schema: AXIS_SHADOW_SCHEMA,
      from: previous.fingerprint,
      to: current.fingerprint,
      sessionChanged,
      observed: null,
      projected: { source: null, rank: null },
      alignment: 'no-observed-route-change',
      reasonCodes: reasons,
    };
  }

  reasons.push(`OBSERVED_${observed.type.replaceAll('-', '_').toUpperCase()}`);
  if (observed.type === 'current-progress') {
    reasons.push('SHADOW_FACTUAL_PROGRESS');
    return {
      schema: AXIS_SHADOW_SCHEMA,
      from: previous.fingerprint,
      to: current.fingerprint,
      sessionChanged,
      observed,
      projected: projectedPosition(previous.projection, observed.equipmentId),
      alignment: 'same-item-progress',
      reasonCodes: reasons.sort(),
    };
  }

  const projected = projectedPosition(previous.projection, observed.equipmentId);
  const alignment = projected.source === 'current'
    ? 'projected-current'
    : projected.source === 'next'
      ? 'projected-next'
      : projected.source === 'remaining'
        ? 'projected-route'
        : projected.source === 'alternative'
          ? 'projected-alternative'
          : 'unprojected-observation';
  reasons.push(`SHADOW_${alignment.replaceAll('-', '_').toUpperCase()}`);

  return {
    schema: AXIS_SHADOW_SCHEMA,
    from: previous.fingerprint,
    to: current.fingerprint,
    sessionChanged,
    observed,
    projected,
    alignment,
    reasonCodes: reasons.sort(),
  };
}

export function runAxis812ShadowSequence(frames = []) {
  const observations = frames.map((frame, index) => {
    const wrapped = frame && typeof frame === 'object' && Object.hasOwn(frame, 'snapshot');
    const snapshot = wrapped ? frame.snapshot : frame;
    const observation = observeAxis812Shadow(snapshot);
    return {
      index,
      boundary: wrapped && frame.boundary != null ? String(frame.boundary) : `frame-${index}`,
      ...observation,
    };
  });
  const transitions = [];
  for (let index = 1; index < observations.length; index += 1) {
    transitions.push({
      fromBoundary: observations[index - 1].boundary,
      toBoundary: observations[index].boundary,
      ...compareShadowObservations(observations[index - 1], observations[index]),
    });
  }
  return {
    schema: AXIS_SHADOW_SCHEMA,
    observations,
    transitions,
    summary: {
      frames: observations.length,
      comparable: transitions.filter((item) => item.alignment !== 'not-comparable').length,
      errors: observations.filter((item) => item.diagnostics?.state === 'error').length,
      unprojected: transitions.filter((item) => item.alignment === 'unprojected-observation').length,
    },
  };
}

export const AXIS_SHADOW_DIAGNOSTICS = Object.freeze({
  schema: AXIS_SHADOW_SCHEMA,
  authoritative: false,
  renders: 0,
  writes: 0,
  storageWrites: 0,
  networkRequests: 0,
});
