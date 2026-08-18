# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- Product main at the start of this hotfix: `64890d6d869cab83aecd73d9b345617a26ca2785`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- The 8.12.3 personal equipment/history memory, canonical Group Plan stability work, Learning simplification and `听原声 / 录音 / 听我的` practice surface are inherited.
- Existing workout history in `axis_v60_state`, training metadata in `axis_v8_meta`, and the canonical IndexedDB media store remain authoritative. This hotfix creates no new training, equipment-definition or media store.

## Active change

**AXIS 8.12.3 narrow mobile UI hotfix — equipment list readability and exact Settings columns.**

This work fixes only two real Production presentation regressions:

- remove the synthetic one-character fallback avatar that was added for personal equipment items without a real photo;
- render a thumbnail only when the existing canonical media reference resolves to an actual local photo blob; a missing or absent photo falls back to the original text-first row rather than an empty or synthetic square;
- restore full-width, left-aligned equipment / movement names and concise usage metadata without allowing inherited `.manageEq` child styles to compress or relocate the text column;
- preserve the representative-photo relationship for items that do have real local media, without copying, uploading or changing the underlying event `frameRefs`;
- make top-level `学习安排` and `云端与AI` entrance rows use the exact native Settings grid columns for the left label and right chevron rather than a separately padded 8.13 gate row;
- preserve their existing inline accordion content and all learning / Cloud & AI ownership;
- preserve personal-equipment swipe removal, multi-select removal, historical workout relationships, Group Plan behavior, recording ownership, camera, watermark, Runtime and deployment topology.

Explicitly unchanged: public version, native catalog IDs, custom definition IDs, event `equipmentId`, trend aggregation, muscle relationships, photo/video ownership, Cloud/AI store, learning store, active-session timers, State Field, Reality Runtime and Live Route.

## Validation for this work

The existing `AXIS 8.12.3 Field Polish Gate` remains the owner and now also runs `scripts/axis-8123-ui-hotfix-smoke.mjs` in Chromium and iPhone-like WebKit at a 417 CSS px viewport. It must prove:

- public runtime remains AXIS 8.12.3 and the final hotfix marker is present;
- `学习安排` and `云端与AI` row edges, label left edge, chevron left/right edges and row height match the native `个人档案` Settings row within sub-pixel tolerance;
- an equipment item with no photo has no one-character thumbnail placeholder and its full name remains visible in a wide text column;
- a stale/missing media reference degrades to the same text-first row instead of leaving an empty thumbnail;
- inherited personal-equipment, Group Plan and repository regressions remain green;
- browser execution produces no uncaught page errors.

## Next planned stage

Merge and Production-verify this hotfix only after Chromium and iPhone WebKit scope gates pass. On the fixed Production endpoint, confirm visually that:

- equipment / movement names are readable again and no one-character placeholders remain;
- real equipment photos appear only when a real local blob exists;
- `学习安排` and `云端与AI` occupy the same label and chevron columns as the rest of Settings.

Do not use this hotfix as a reason to change other AXIS behavior. Broader product work resumes only after this mobile Production surface is verified.
