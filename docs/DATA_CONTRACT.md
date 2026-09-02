# AXIS Data Contract v1

## Purpose

This contract defines durable, versioned data boundaries shared by current Web AXIS and future native shells. It does not require cross-device cloud sync; it makes future migration/sync possible without changing workout truth.

## Contract identities

- Domain contract: `axis.domain.v1`
- Data schema family: `axis.data.v1`
- Exchange format: `axis.exchange.v1`
- Event envelope: `axis.event.v1`
- Media manifest: `axis.media.v1`
- Normalized golden-state fixture input: `axis.normalized-state-fixture.v1`
- Session Profile snapshot: `axis.profile-snapshot.v1`
- Session Goal snapshot: `axis.goal-snapshot.v1`

Every persisted/exported cross-platform envelope must declare its schema/version. Unversioned cross-platform payloads are forbidden.

## Local-first storage

Each platform owns its local persistence adapter:

- Web: existing LocalStorage + IndexedDB compatibility owners;
- iOS: native persistence (planned SwiftData/event journal + file-backed media);
- future platforms: equivalent adapters.

The adapter stores domain facts; it does not redefine them.

## Durable identity

Persistent records use stable opaque IDs. Display names are mutable metadata and are never primary identity.

Historical equipment/exercise IDs remain resolvable even if the item is removed from the personal library.

## Revisions

Cross-device-capable entities carry:

- `revision` — monotonic logical revision at the entity boundary;
- `updatedAt` — timestamp evidence;
- `deviceId` — writer device identity when sync/export requires it;
- `requestId` — idempotency identity for remote writes when applicable;
- tombstone/deletion metadata instead of destructive ambiguity.

These fields support convergence; they do not make the server authoritative over the live workout.

## Event journal

The future native/event-journal layer is append-only for accepted domain events.

Requirements:

- each event has stable `id`;
- each event declares `schema: axis.event.v1`;
- each event has `type`, `sessionId`, and occurrence time;
- activity-scoped events carry stable `activityId`;
- `equipmentSelected` carries a non-empty stable `payload.equipmentId`;
- reducer-consumed payload fields use the published portable types rather than platform-specific coercion;
- replay is deterministic for the same ordered event set;
- duplicate event IDs must not apply twice;
- events are facts, not UI gestures;
- compatibility snapshots may coexist until replay equivalence is proven.

## Snapshots and normalized fixtures

Snapshots are performance/compatibility materializations of journal/domain state.

A snapshot may be rebuilt from authoritative facts where supported. A snapshot is not a second semantic owner.

Golden fixtures that begin from normalized state use `axis.normalized-state-fixture.v1`. IDs, statuses, set counts, session bounds and interval endpoints are strictly typed and validated before semantic reduction; test harnesses may not rely on JavaScript/string coercion that a native Swift decoder would reject.

### Session-time Profile / Goal snapshots

A newly created WorkoutSession may carry additive immutable context captured at its stored Session start time:

- `profileSnapshot.schema = axis.profile-snapshot.v1`;
- `goalSnapshot.schema = axis.goal-snapshot.v1`.

These snapshots normalize optional current body/training facts and goal targets into portable numeric-or-null fields. `null` means the fact was not supplied at Session start; it is not zero.

Rules:

- capture happens only when a new Session is created through the authoritative Session owner;
- later Profile/Goal edits do not rewrite an active or archived Session snapshot;
- legacy Sessions with no snapshot remain snapshot-absent;
- current Profile values must never be used to backfill historical absence;
- nickname, custom equipment, visual memory, Object-recording preferences and unrelated settings are not Session Profile/Goal snapshot facts;
- Encounter records do not receive duplicate Profile copies;
- Web stores the snapshots inside the existing `axis_v60_state` Session object; this does not create a new persistence adapter;
- future native/export adapters preserve the schema-tagged snapshots as additive Session context.

Published schemas live at:

- `shared/contracts/axis-profile-snapshot-v1.schema.json`;
- `shared/contracts/axis-goal-snapshot-v1.schema.json`.

## Media

Binary media is stored outside workout JSON/state snapshots.

Workout/domain records store media references and metadata only.

Media references must support:

- stable media ID;
- media type;
- local location/reference;
- creation time;
- optional derived/watermarked relation;
- optional content hash;
- deleted/tombstoned state where sync is enabled.

No provider secret or public object URL is part of the data contract.

## Exchange format

`axis.exchange.v1` is the initial portable backup/import boundary.

Top-level shape:

```json
{
  "schema": "axis.exchange.v1",
  "exportedAt": "ISO-8601",
  "source": {"platform":"web|ios", "appVersion":"...", "domain":"axis.domain.v1", "data":"axis.data.v1"},
  "profile": {},
  "equipment": [],
  "sessions": [],
  "events": [],
  "settings": {},
  "media": []
}
```

Rules:

- imports validate schema before mutation;
- durable equipment/session/media records carry stable non-empty IDs so repeated import can deduplicate them;
- unknown additive fields are preserved/ignored safely where possible;
- incompatible major schema versions fail explicitly instead of partial silent import;
- importing the same package twice must not duplicate stable IDs/events;
- media payload transfer may be separate from the JSON manifest.

## Migration policy

No release may assume all user data was written by the current version.

A schema-changing release must provide:

1. input fixture from the old schema;
2. explicit migration;
3. expected output fixture;
4. idempotency test;
5. rollback/recovery strategy for destructive operations;
6. compatibility statement for Web ↔ iOS exchange.

Additive optional Session Profile/Goal snapshots use explicit absence as their backward-compatibility representation; old Sessions are not destructively migrated or backfilled.

## Compatibility matrix

The following paths are first-class compatibility cases:

- old Web → new Web;
- old Web export → new iOS import;
- old iOS → new iOS;
- iOS export → Web import;
- history-only equipment identity;
- missing optional media;
- missing optional Session Profile/Goal snapshots;
- offline workout completed before sync becomes available;
- duplicate/idempotent import or remote write.

## Privacy/security

- AI/provider secrets are never exported with user data;
- account credentials/tokens are never part of backups;
- media remains private by default;
- raw location coordinates stay private data and are not automatically rendered/exported as public copy;
- optional AI requests receive only capability-relevant user data.

## Ownership

- Domain owns meaning.
- Platform data adapter owns local persistence mechanics.
- Sync owns convergence/mirroring.
- Backup/import owns transfer.
- None of these may become an alternate live-workout semantic owner.
