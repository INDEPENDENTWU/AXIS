# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.
- Verified `main` at the start of this work: `fcd89e97f091fe103886cddab919844f1ef602ee`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production is `READY` for exact source commit `fcd89e97…`.
- Fixed Production manifest: release hash `0c50e5bead25`, core `4d490912e0f3`, CSS `af439553319b`, one initial JavaScript request, zero dynamic JavaScript, zero chunks.
- AXIS 8.13 Stage 3 Continue + Live Route is Production-verified and remains read-only presentation; AXIS 8.12 recording/storage owners remain authoritative.
- Final Stage 3 seal has zero failed, queued or in-progress workflows on `fcd89e97…`.

## Active change

**AXIS 8.13 Settings convergence — inline Learning Schedule + Cloud/AI.**

This is a narrow user-experience correction requested from real iPhone Safari use. It does not begin Stage 4 and does not change Runtime planning semantics.

### Problem

Two Settings rows still used historical nested sheet ownership:

- `学习安排` opened `v810ConfigPanel` as a second fixed bottom sheet;
- `云端与 AI` opened `v811ServicePanel` as another fixed bottom sheet.

That behavior is inconsistent with the converged Settings pattern already used by `记录偏好` and `提醒与声音`, creates unnecessary navigation/scroll layers on iPhone, and makes both configuration surfaces visually too large.

### Controlled correction

`prepare-813-settings-convergence.mjs` is a final source-convergence step after the existing Stage 3 prepare step and before `build-hardened.mjs`.

It must preserve all existing learning and service behavior while changing only presentation ownership:

- `学习安排` becomes one `v8711SettingGate`-style inline fold inside the canonical Settings sheet;
- `云端与 AI` becomes one matching inline fold inside the same Settings sheet;
- neither may create or show a second fixed settings sheet;
- both row heights converge to the existing compact Settings scale;
- learning core decisions remain available: purpose, method, intensity, level and dialogue depth;
- learning fine tuning remains progressive disclosure and preserves novelty, track, cadence, daily target and opportunity;
- Cloud/AI keeps cloud mode, AI mode, capability status and privacy/send-range controls;
- capability and privacy detail are progressively disclosed instead of permanently occupying vertical space;
- expanding Cloud/AI may perform the same existing explicit user-invoked status reads; no automatic background network owner is introduced.

### Ownership that must not change

- Learning store: `axis_v89_speak`.
- Cloud/AI preference store: `axis_v811_services`.
- Factual training state: `app.js` / `axis_v60_state`.
- Strength/activity metadata: `v61.js` / `axis_v8_meta`.
- Stage 3 Live Route: presentation only.
- No new IndexedDB owner, timer owner, training-control owner, media owner, AI training owner or dynamic JavaScript chunk.

## Validation for this work

Dedicated `AXIS 8.13 Settings Convergence` Chromium + iPhone-like WebKit regression must prove on the exact PR head:

- opening Settings produces exactly one visible Settings sheet;
- Learning Schedule expands/collapses in place;
- Cloud/AI expands/collapses in place;
- legacy fixed nested learning/service panels are absent;
- compact row and option geometry is maintained on a 390×844 viewport;
- 8.12 learning purpose/method controls remain functional and persist to `axis_v89_speak`;
- Cloud/AI status network does not run before explicit row expansion;
- explicit expansion performs only the existing status reads;
- cloud/AI preferences persist to `axis_v811_services`;
- neither learning nor service configuration writes `axis_v60_state` or `axis_v8_meta`;
- Settings close/reopen keeps a single owner and persisted values;
- page errors remain empty;
- public topology remains AXIS 8.12 / canonical single runtime / one initial JS / zero dynamic JS / zero chunks;
- all inherited Runtime, Field Hardening, Language Studio, Stage 3, repository and continuity gates remain green.

## Next planned stage

Only after this Settings convergence is merged and Production-verified may work proceed to **AXIS 8.13 Stage 4 — Reality Actions**.

Stage 4 may add temporary Runtime constraints such as `这个器械有人`, `我只剩 20 分钟`, and `今天到这里`. Historical workout facts remain authoritative and immutable.
