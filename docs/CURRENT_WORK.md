# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine current state is [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Current Production release: **AXIS 8.18**.
- Exact merged baseline SHA: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`.
- Vercel exact-main Production is verified `READY` on that SHA.
- This baseline remains the rollback and behavior-equivalence reference for Source Convergence.

## Active change

**AXIS Source Convergence — 8.19 Foundation**

Branch: `engineering/source-convergence-819`

PR: **#79**

Current phase: **Phase 2 — CI convergence + executable reachability**.

This is an engineering milestone, not a product release. **Zero intended user-visible behavior change** applies to the convergence work currently being performed.

### Phase 1 — Handoff Truth and governance · complete

Established machine-readable project/release truth, critical ownership/retirement registries, `docs/HANDOFF.md`, current 8.18 documentation, and the exact presentation foundation:

- `zh-Hans` — **简体中文**;
- `zh-Hant` — **繁體中文**;
- `en` — **English**;
- themes `system / light / dark`.

Proof:

- Repository Contract run `32626662160` — **success**;
- Work Continuity run `32626662162` — **success**.

### Phase 2A — stale PR head cancellation · complete

`.github/workflows/axis-pr-run-convergence.yml` cancels only obsolete still-active workflow runs from previous heads of the same PR.

Proof:

- run `32626897002` — success;
- cross-head run `32626975731` — success;
- stale active runs found: 10;
- cancellation requests accepted: 8;
- latest head touched: **false**.

### Phase 2B — 8.14 → 8.18 Current Release Gate convergence · complete

Seven duplicated release-era automatic workflow families were replaced by:

- `.github/workflows/axis-current-release-gate.yml`;
- `scripts/axis-current-release-contract.mjs`.

Replacement equivalence proof before retirement:

- candidate `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59`;
- run `32630099680`;
- Chromium — **success**;
- iPhone-like WebKit — **success**;
- every inherited Evolution / Media Evidence / regression seal / watermark / Capture / Interaction / source-first / 8.18 smoke — success.

Retirement commit:

- `709d801e268e6d06248c21f517aa1a17e565764b`.

Post-retirement proof on that exact head:

- Repository Contract + CI retirement guard run `32630367007` — **success**;
- Current Release Gate run `32630367047` — Chromium **success**, iPhone-like WebKit **success**;
- automatic workflow families observed: **20**;
- none of the seven retired 8.14→8.18 workflow names returned.

The retirement applies to duplicated CI orchestration only. Historical source/compiler/data compatibility remains until separately proven removable.

### Phase 2C — Runtime Foundation convergence · replacement candidate being introduced

The 8.13 family was audited separately because it carries unique responsibilities that must not be lost:

- pure Runtime invariants;
- Shadow Runtime invariants;
- exact artifact parity against the PR base SHA;
- authoritative Shadow transition observation in Chromium/WebKit;
- Continue + Live Route semantics;
- inline Settings ownership.

`prepare-8123-ci-stability.mjs` was inspected before consolidation. It converges inherited **test scripts only**; it does not mutate `axis-core.js`, `index.html` or `axis-style.css`. Therefore the browser responsibilities can safely share one exact build per engine.

Replacement surfaces now being introduced:

- `.github/workflows/axis-runtime-foundation-gate.yml`;
- `scripts/axis-runtime-foundation-contract.mjs`.

Target jobs:

1. `pure-runtime-parity` — Runtime Core + Shadow Runtime + one build + exact base-SHA parity;
2. `chromium-runtime` — one build + Shadow transitions + Live Route + Settings;
3. `webkit-runtime` — one build + the same browser semantics on iPhone-like WebKit.

The existing four 8.13 workflow families remain automatic for the first replacement candidate so the new gate can be proven on the same current artifact before retirement. No 8.13 workflow is approved for deletion until the replacement gate is fully green and its semantic/engine coverage is recorded.

### Phase 2D — 8.12 and older compatibility audit · queued after 8.13 proof

Initial inspection already shows hierarchical duplication (for example 8.12.2 reruns 8.12.1 Group Plan, and 8.12.3 Field Polish again reruns the same Group Plan path), but these layers also contain potentially unique equipment/history/old-data/UI-geometry coverage. They will move only after those responsibilities are explicitly mapped to a Deep Compatibility Gate.

## Validation for this work

Source Convergence must preserve:

- exact AXIS 8.18 behavior-equivalence baseline;
- Repository Contract and Work Continuity;
- one canonical runtime;
- latest-head Chromium and iPhone-like WebKit coverage;
- `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`;
- custom object identity/aliases and historical Encounter readability;
- current camera/media/sound/completion ownership;
- exact-SHA provider Production proof;
- no timeout inflation to hide failures, assertion weakening, duplicate persistence/recorder/sound ownership or destructive data migration.

Every CI retirement must have its own exact-candidate replacement proof and a guard preventing accidental resurrection.

## Next planned stage

Run the first `AXIS Runtime Foundation Gate` candidate alongside the existing four 8.13 workflows. Require pure-runtime/parity, Chromium and WebKit jobs to pass before classifying the four old 8.13 workflows as superseded. Then perform an atomic retirement with a repository guard, exactly as done for the 8.14→8.18 fanout.
