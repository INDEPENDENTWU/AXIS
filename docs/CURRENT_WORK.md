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

This remains an engineering milestone, not a product release. **Zero intended user-visible behavior change** applies to the convergence work currently being performed.

### Phase 1 — Handoff Truth and governance · complete

Established:

- `governance/project-state.json` as machine-readable current truth;
- current owner and retirement registries;
- `docs/HANDOFF.md` as first human/agent entry;
- real AXIS 8.18 Production identity in current docs;
- Repository Contract driven by governance instead of hard-coded historical release identity;
- presentation foundation exactly:
  - `zh-Hans` — **简体中文**;
  - `zh-Hant` — **繁體中文**;
  - `en` — **English**;
  - themes `system / light / dark`.

Proof:

- Repository Contract run `32626662160` — **success**;
- Work Continuity run `32626662162` — **success**.

### Phase 2A — stale PR head cancellation · complete

`.github/workflows/axis-pr-run-convergence.yml` cancels only obsolete still-active workflow runs from previous heads of the same PR.

Verified proof:

- run `32626897002` — success, API/permission/latest-head exclusion proven;
- cross-head run `32626975731` — success;
- 10 stale active runs found;
- 8 cancellation requests accepted;
- 2 finished before cancellation and were left untouched;
- latest head touched: **false**.

This changes runner scheduling only; newest-candidate coverage is unchanged.

### Phase 2B — 8.14 → 8.18 Current Release Gate convergence · complete

The following seven release-era automatic workflow families were proven to be overlapping layers over the same current canonical artifact:

- 8.14 Evolution Objects;
- 8.15 Media Evidence;
- 8.15.1 Regression Seal;
- 8.16 Capture + Comparative Evidence;
- 8.17 Interaction Convergence;
- 8.17.1 Source Media;
- 8.18 Object + Route + Capture + Focus.

Replacement:

- `.github/workflows/axis-current-release-gate.yml`;
- `scripts/axis-current-release-contract.mjs`.

The replacement performs one exact build per engine and keeps the complete inherited semantic/ownership contract plus all original browser smokes:

- Evolution foundation;
- Evolution Objects;
- Media Evidence;
- regression seal;
- stable Evidence swap;
- watermark controls;
- Capture + Comparative Evidence;
- Interaction Convergence;
- source-first media;
- 8.18 Object / Route / Capture / Focus.

Exact replacement proof on candidate `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59`:

- AXIS Current Release Gate run `32630099680`;
- Chromium — **success**;
- iPhone-like WebKit — **success**;
- unified semantic contract — **success** in both jobs;
- Repository Contract — **success** inside Chromium replacement job;
- `main` branch protection — disabled; required status checks: **0**.

Therefore the seven old automatic workflow files are physically retired in the next convergence commit. Their source/runtime compatibility contracts are **not** automatically deleted; only duplicated CI orchestration is retired.

### Phase 2C — next compatibility audit

8.13 remains separate for now because it contains responsibilities not equivalent to the Current Release Gate:

- pure Runtime invariants;
- Shadow Runtime invariants;
- exact base-SHA build parity;
- Chromium/WebKit transition observation;
- Continue + Live Route semantics;
- inline Settings ownership.

The next audit targets:

1. 8.13 workflow decomposition into Runtime Foundation / Deep Compatibility responsibilities;
2. 8.12 and older old-data uniqueness;
3. overlap between Runtime Gate and older interaction/home/watermark gates;
4. provider PR packaging versus `main`-only Production responsibilities;
5. path scoping so governance/docs-only changes do not rebuild every behavioral surface.

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
- no timeout inflation, assertion weakening, duplicate persistence/recorder/sound ownership or destructive data migration.

CI retirement itself must be guarded: `scripts/axis-ci-convergence-contract.mjs` requires the version-neutral replacement surfaces and fails if the seven retired workflow files return.

## Next planned stage

Run the post-retirement exact-head CI. Require the new Repository Contract + CI convergence guard and the Current Release Gate to remain green after the seven workflow files are absent. Then continue with the 8.13 Runtime Foundation / Deep Compatibility audit; do not yet alter product runtime or historical storage semantics.
