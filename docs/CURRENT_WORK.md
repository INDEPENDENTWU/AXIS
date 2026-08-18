# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product at hotfix start: AXIS 8.12.
- `main` at hotfix start: `4b247914300398531839169faed58693b07440c1`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production at hotfix start: `dpl_4SoNVkrZ2qYjGCn4W3nVG7dJPNx8`, READY on exact `4b247914…`.
- Fixed Production artifact at hotfix start: core `d923ac4eafe2`, CSS `af439553319b`, one initial JavaScript request, zero dynamic JavaScript, zero chunks.
- AXIS 8.13 Stage 3 Continue + Live Route is already shipped inside the public 8.12 artifact and remains read-only presentation.

## Active change

**AXIS 8.12.1 — iPhone Settings rhythm + Group Plan touch hotfix (PR #41).**

This is a field hotfix driven by real iPhone Safari use. It is not AXIS 8.13 Stage 4 and does not change Runtime planning semantics.

### Real field problems

1. `学习安排` and `云端与 AI` are correctly inline after the previous convergence, but their inner UI still uses a separate micro-scale visual language: extra outer divider, 10–10.5 px text in several controls, and 32 px option geometry. On iPhone this looks materially smaller and less coherent than the rest of AXIS Settings.
2. The normal scan/review strength-recording path exposes `组计划`, but its historical launcher is a `<b>` text node retrofitted with `data-v874-plan` and handled by a document capture listener. That interaction surface is not robust enough for real iPhone touch. Existing CI primarily covered Quick Record, so this field path could regress while CI stayed green.

### Controlled correction

`prepare-8121-hotfix.mjs` runs after Stage 3 Settings convergence and before the canonical hardened build.

It must:

- keep Learning and Cloud/AI inside the single canonical Settings sheet;
- remove their extra outer gate divider;
- use native AXIS Settings typography and 40–44 px touch geometry;
- keep strict grid spacing, alignment, progressive disclosure and mobile overflow safety;
- preserve Learning delegated actions and `axis_v89_speak` ownership;
- preserve Cloud/AI `axis_v811_services` ownership and explicit-only status network;
- replace the fragile Group Plan text-node launcher with one real native `button` of at least 44 px;
- retain the legacy value `<b>` inside that button for compatibility with existing rendering/reading code;
- continue delegating Group Plan application to `window.__AXIS_RECORDING__.applyPlan` / `v61.js`;
- introduce no new training, storage, media, timer, sound, network or Runtime owner.

`prepare-8121-release-compat.mjs` promotes only the public patch identity to 8.12.1. AXIS 8.12 Language Studio and AXIS 8.13 Stage 3 internal semantics remain inherited.

## Validation for this work

The dedicated `AXIS 8.12.1 Hotfix Gate` must pass on the exact PR head in Chromium and iPhone-like WebKit.

It reproduces the actual field path rather than substituting Quick Record:

- open Settings and compare Learning typography to native AXIS Settings rows;
- verify Learning/Cloud outer borders are absent;
- verify 13–15 px hierarchy and 40–44 px option touch targets;
- verify one Settings sheet and no horizontal overflow;
- seed an active workout;
- open `拍摄记录`;
- supply a real image through the review input;
- open equipment selection and choose a strength machine;
- perform a real touch/click on the Group Plan native button;
- change to four sets and a progression mode;
- apply through the canonical planner;
- save the record;
- verify factual `axis_v60_state` and set metadata in `axis_v8_meta` contain the four-set result;
- verify the hotfix diagnostic explicitly reports `recordingOwner:false`;
- verify zero page errors.

All inherited Runtime, Field Hardening, Language Studio, Settings convergence, Stage 3, repository and continuity gates remain release-blocking.

A dedicated `AXIS 8.12.1 Production Gate` also verifies the fixed public alias after deployment: exact merged source SHA, 8.12.1 identity, canonical one-JS topology, inherited Language Studio, read-only Live Route, and the real hotfix browser flow.

## Release boundary

Do not call 8.12.1 complete until all of the following are true:

- PR #41 final exact head is green in Chromium and WebKit;
- PR review threads are resolved;
- PR #41 is squash-merged;
- Vercel Production is READY on the exact merged main SHA;
- `axis-five-puce.vercel.app/axis-build.json` reports 8.12.1 / 8.12.1 and the exact merged SHA;
- fixed Production serves one JS, zero dynamic JS and zero chunks;
- the dedicated 8.12.1 Production Gate passes;
- Production runtime error inspection is clean.

## Next planned stage

Only after the 8.12.1 Production seal is clean may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**.

Stage 4 may alter temporary continuation intent such as `这个器械有人`, `我只剩 20 分钟`, or `今天到这里`. Historical workout facts remain authoritative and immutable.
