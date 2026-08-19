# AXIS 8.12.3 — Equipment Gallery / Picker Maintenance

This maintenance patch keeps the public release at AXIS 8.12.3 and preserves the canonical single-runtime architecture.

## Scope

- Add a dedicated, local-first multi-photo gallery to every personal equipment / movement item without creating another media database.
- Store photo blobs only in the existing `axis_v42_media` / `media` IndexedDB owner. Persist only small references, timestamps and visual fingerprints under `profile.equipmentPhotos`.
- Feed explicitly confirmed equipment photos into the existing `profile.memories` visual-memory path while preserving recent recording-derived memories.
- Keep training event `frameRefs`, historical records, native catalog IDs and custom definition IDs authoritative and unchanged.
- Unify equipment selection return behavior through one picker context for photo recording and Quick Record, including repeated open/back/reopen cycles and expanded catalog items.
- Remove the requested Settings separators and turn the existing `#reportBtn` into a compact, distinct whole-row Training Report action without changing report generation ownership.

## Non-goals

This patch does not change Group Plan calculations, the v61 recording transaction owner, workout history semantics, camera capture, training watermark behavior, Learning, Cloud/AI stores, active-session timing, Reality Runtime, Live Route or deployment topology.

## Required validation

The AXIS 8.12.3 Field Polish Gate must validate in Chromium and iPhone-like WebKit:

- recording equipment selection works on first use and after picker back/re-entry;
- a new recording flow can reopen and select again without falling to the home surface;
- Quick Record → 其他器械 / 运动 → expanded catalog returns to the Quick editor repeatedly;
- two local equipment photos can be added, stored in the canonical media database, promoted to confirmed visual memories, reordered as cover and deleted without touching training media;
- My Equipment uses the dedicated cover before any historical recording photo;
- Learning, Cloud/AI, Reminder/Sound and Training Report requested bottom dividers are absent;
- the redesigned Training Report entry still opens the existing report surface;
- inherited Group Plan and repository contracts remain green with no uncaught page errors.
