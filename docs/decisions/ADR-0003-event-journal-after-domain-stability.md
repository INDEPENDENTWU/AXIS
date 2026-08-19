# ADR-0003 — Event journal follows domain stabilization

- Status: Accepted
- Date: 2026-08-19

## Decision

Use an append-only domain event journal as the long-term native durability/replay model, but introduce it only after domain actions and replay fixtures are stable.

Existing Web snapshots/history remain supported through explicit compatibility adapters/migrations.

## Why

An event journal improves crash recovery, idempotency, undo/replay, sync and multi-device projection. Introducing it before domain semantics are stable would simply persist ambiguity permanently.

## Consequences

- first extract/characterize domain behavior;
- then implement native journal for new actions;
- keep compatibility snapshots until replay equivalence is proven;
- never delete old history merely to simplify the new event model;
- event IDs are stable/idempotent and UI gestures are not journal facts.
