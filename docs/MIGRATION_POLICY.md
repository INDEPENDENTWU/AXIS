# AXIS Migration Policy

## Rule

User workout history is durable product data. No release may assume it was written by the current code version.

## When a migration is required

A tested migration is required when a change alters any persisted semantic meaning, required field, stable identity rule, event format, snapshot format or portable exchange format.

Purely additive optional metadata may remain backward compatible without a major schema version only when older readers safely ignore it.

## Required migration evidence

Every migration must include:

1. representative old-data fixture;
2. migration implementation;
3. expected new-data fixture;
4. idempotency proof (running again produces no additional semantic change);
5. failure behavior (no partial silent corruption);
6. rollback/recovery note;
7. compatibility note for export/import and participating shells.

## Preservation rules

- Stable session/event/equipment IDs are preserved unless a documented remap is unavoidable.
- Historical records are not deleted because a current catalog item disappears.
- Missing optional media must not invalidate workout facts.
- AI-derived metadata may be discarded/recomputed; user-recorded workout facts may not.
- Tombstones are preferred to ambiguous destructive deletion in sync-capable entities.
- A migration may materialize new derived fields but may not fabricate historical facts.

## Cross-platform ordering

If Web and iOS support the same data version, a schema rollout must specify whether:

- both can read old + new before either writes new;
- one shell must ship a compatibility reader first;
- export/import must temporarily remain on the previous exchange version.

Never let one shell begin writing a format the other supported shell cannot safely read unless the incompatibility is explicit and the transfer path is disabled/version-gated.

## Failure atomicity

Migration should be transactional or staged where practical:

`validate old → transform copy/staged state → validate new → commit → mark version`

If validation fails, keep the old readable state and surface recovery diagnostics.

## Test matrix

At minimum cover:

- empty/fresh install;
- earliest retained supported data;
- latest previous-version data;
- active workout recovery data;
- history-only equipment identity;
- missing/corrupt optional media reference;
- duplicate import/event;
- migration run twice.
