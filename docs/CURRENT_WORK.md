# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- Product main at the start of this maintenance work: `d447a0df4f16fb1dc308ff9783f3bd460b6eaf00`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- AXIS 8.12.3 Learning Settings simplification and `听原声 / 录音 / 听我的` practice surface are sealed and inherited.
- AXIS 8.12 Language Studio corpus, AXIS 8.12.1 Safari Group Plan native-button fix, AXIS 8.12.2 Settings ownership, canonical local visual memory/media ownership, and AXIS 8.13 Stage 3 read-only Live Route are inherited and must remain intact.
- Existing workout history in `axis_v60_state`, training metadata in `axis_v8_meta`, and canonical IndexedDB media remain authoritative. This maintenance work does not create a second training or media store.

## Active change

**AXIS 8.12.3 maintenance — personal equipment memory, Group Plan interaction stability, and final Settings row geometry.**

The scope is deliberately additive and compatibility-first:

- make `我的器械` a personal-use library derived from actual recorded equipment / movements plus existing custom definitions, while keeping native catalog IDs and custom definition IDs authoritative;
- reuse existing `profile.memories` as the visual-recognition memory and reuse existing event `frameRefs` through the canonical media store instead of duplicating or uploading photos;
- show a representative local photo when available together with compact usage / recent-use information;
- preserve all historical workout records when an item is removed from `我的器械`; removal only archives the personal-library relationship, removes custom selectable definitions when applicable, and clears that item's personal visual memory;
- allow a native item to return naturally to `我的器械` after it is used again later;
- support unobtrusive left-swipe single removal and explicit `选择` multi-select removal without permanent checkbox clutter;
- converge Group Plan to one stable delegated launcher synchronized explicitly after the canonical v61 set editor renders, rather than relying on a stale DOM node surviving count / weight / reps repaints;
- preserve the existing Group Plan calculation surface and preserve `window.__AXIS_RECORDING__.applyPlan(...)` as the atomic recording transaction owner;
- correct top-level `学习安排` and `云端与AI` row geometry so their labels and right chevrons use the same horizontal inset as native Settings rows at the real iPhone-width layout shown in Production;
- preserve the existing Settings typography, row height, spacing, colors and overall engineering visual language.

Explicitly unchanged: native catalog semantics, event `equipmentId` history relationships, trend aggregation, muscle relationships, camera capture, watermark ownership, Cloud/AI store, learning store, active-session timers, State Field, Reality Runtime, Live Route ownership, public version and deployment topology.

## Validation for this work

The dedicated `AXIS 8.12.3 Field Polish Gate` runs in Chromium and iPhone-like WebKit and must prove:

- public identity remains `8.12.3 / 8.12.3` with canonical single runtime and the inherited release contracts intact;
- a native catalog item with historical use and a custom item both appear in `我的器械` without duplicating their underlying definitions;
- an existing event photo reference is surfaced as the personal equipment representative image through the canonical media reference path;
- `选择` mode can select multiple items and exposes one batch-removal action; single-row removal ownership also remains present for swipe interaction;
- personal-library removal is modeled separately from historical workout deletion;
- Group Plan exposes exactly one current launcher after set-count changes, weight changes, reps changes, close/reopen cycles and atomic plan application;
- each Group Plan open resolves current rows and current first-set values instead of a captured stale DOM reference;
- the existing inherited Group Plan regression remains green;
- at a 417 CSS px iPhone-like viewport, both the left edge of `学习安排 / 云端与AI` labels and the right edge of their chevrons align to native Settings rows within a tight geometry tolerance;
- browser execution produces no page errors and the repository continuity contract remains green.

The maintenance compiler also emits explicit manifest gates for personal-equipment library/photo/visual-memory ownership, swipe/batch removal, history preservation, render-owned Group Plan synchronization, and final Settings-row alignment.

## Next planned stage

First merge and Production-verify this 8.12.3 maintenance patch. Do not begin broader AXIS 8.13 product migration until the real mobile Production surface confirms:

- Settings alignment is corrected;
- `我的器械` behaves as a coherent personal library without breaking native/custom/history relationships;
- Group Plan remains clickable through repeated real recording edits and reopen cycles.

After that verification boundary, controlled AXIS 8.13 work may continue. Historical workout facts and current recording/media ownership remain authoritative.
