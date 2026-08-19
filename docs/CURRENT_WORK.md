# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- `main` baseline for this release work: `8f6c8bf86a7b515768adec991893768bc92e690c`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Existing workout history in `axis_v60_state`, training metadata in `axis_v8_meta`, native/custom equipment IDs and the canonical `axis_v42_media` IndexedDB store remain authoritative.
- Group Plan, active-session ownership, camera/watermark ownership, Learning and Cloud/AI ownership are inherited and are not replaced by this work.

## Active change

**AXIS 8.12.3 equipment photo memory + picker lifecycle + Settings surface maintenance.**

This release is intentionally additive and narrow:

- personal equipment / movement items can keep multiple real local photos while the existing IndexedDB media owner remains the only blob store;
- dedicated equipment photos keep refs/fingerprints and Local Vision v2 multi-signal signatures, so adding the gallery does not downgrade existing personal visual recognition;
- photo-record equipment selection uses one explicit picker context so first pick, back/reopen, full recording re-entry and repeated selection return to the recording review instead of Home;
- Quick Record `其他器械 / 运动` uses the same canonical picker contract and returns to the Quick editor after selection;
- native catalog IDs, custom IDs and event `equipmentId` remain unchanged, and historical workout `frameRefs` are not rewritten;
- `学习安排`, `云端与AI`, `提醒与声音` and `训练报告` top-level dividers are removed without changing their underlying owners;
- `训练报告` becomes a distinct compact whole-row action while still invoking the existing report generator;
- personal equipment detail remains the route for photo management and custom-item `编辑信息`.

Explicitly unchanged: public version, workout/training stores, Group Plan calculation and transaction owner, camera lifecycle, watermark data, Learning store, Cloud/AI store, Runtime/Live Route ownership and deployment topology.

## Validation for this work

The release must pass both inherited and new contracts before merge:

- dedicated Chromium + iPhone WebKit regression for repeated recording picker open/back/reopen/re-entry and repeated Quick `其他器械 / 运动` selection;
- multi-photo add, canonical IndexedDB persistence, cover change, deletion, personal visual-memory persistence and no uncaught page errors;
- Local Vision v2 inherited regression proving confirmed record memories still retain `full / center / zones` multi-signal signatures, with dedicated equipment photos using the same signature path;
- Settings separator checks for the four requested entries and click-through to the existing Training Report;
- 8.13 Settings convergence against the current AXIS 8.12.3 64px top-level Learning / Cloud-AI row contract;
- inherited Group Plan, catalog, watermark, recording, Home, Runtime, Learning and repository gates remain green.

No failed or cancelled required gate is treated as deployable evidence.

## Next planned stage

When the exact PR head is green, squash-merge PR #50 into `main`. Then verify that Vercel deploys the exact merge SHA to the existing AXIS project and fixed Production endpoint.

Production verification must confirm:

- deployment state is READY for the merge SHA;
- `https://axis-five-puce.vercel.app` returns HTTP 200 and presents AXIS 8.12.3;
- runtime/feature kernels initialize without new errors;
- the repeated equipment picker path, multi-photo equipment memory, divider-free Settings rows and Training Report entry are present on the deployed artifact.

Broader equipment-memory/product expansion resumes only after this maintenance release is verified in Production.
