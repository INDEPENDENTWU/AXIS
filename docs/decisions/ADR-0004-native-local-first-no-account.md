# ADR-0004 — Native 1.0 is local-first and account-optional

- Status: Accepted
- Date: 2026-08-19

## Decision

AXIS iOS milestone 1/initial product does not require account, cloud sync, subscription or AI availability to start/record/finish a workout.

## Why

This preserves the strongest current AXIS invariant, minimizes launch cost/complexity, reduces failure surface and keeps user workout truth on-device.

## Consequences

- native persistence and crash recovery are release-critical;
- backup/import precedes mandatory cloud sync;
- AI remains advisory/fail-open;
- HealthKit and server services are adapters/mirrors;
- account/sync can be added later without becoming live-workout ownership.
