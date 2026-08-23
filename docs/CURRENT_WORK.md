# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Production: **AXIS 8.18**.
- Exact merged baseline: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`.
- Production behavior is the equivalence/rollback reference. Source Convergence has **zero intended user-visible behavior change**.

## Active change

**AXIS Source Convergence — 8.19 Foundation** · branch `engineering/source-convergence-819` · PR **#79**.

Current phase: **Phase 2 — CI convergence + executable reachability**.

### Completed · governance foundation

GitHub now carries machine-readable current state, ownership, retirements and CI evidence. Presentation contract is exactly:

- `zh-Hans` — **简体中文**;
- `zh-Hant` — **繁體中文**;
- `en` — **English**;
- themes: `system / light / dark`.

Repository Contract `32626662160` and Work Continuity `32626662162` passed.

### Completed · stale PR head convergence

`axis-pr-run-convergence.yml` is verified. Cross-head run `32626975731` found 10 obsolete active runs, accepted 8 cancellations, left 2 already-finished runs alone, and did not touch the latest head.

### Completed · Current Release convergence (8.14 → 8.18)

Seven duplicated automatic release-era workflow families were replaced by:

- `.github/workflows/axis-current-release-gate.yml`;
- `scripts/axis-current-release-contract.mjs`.

Replacement proof: candidate `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59`, run `32630099680`, Chromium + iPhone-like WebKit **success** with every inherited smoke.

Retirement head `709d801e268e6d06248c21f517aa1a17e565764b` then proved the replacement after the seven old files were physically absent:

- Repository + CI retirement guard `32630367007` — **success**;
- Current Release Gate `32630367047` — Chromium **success**, WebKit **success**;
- old 8.14→8.18 workflow names absent from the automatic run list.

### Completed · Runtime Foundation convergence (8.13)

Four automatic workflow families — Runtime Core, Shadow Runtime, Live Route and Settings Convergence — were audited as one coherent Runtime Foundation responsibility.

Replacement:

- `.github/workflows/axis-runtime-foundation-gate.yml`;
- `scripts/axis-runtime-foundation-contract.mjs`.

Important safety finding: `prepare-8123-ci-stability.mjs` changes inherited **test scripts only**; it does not mutate the built product artifact. Browser tests can therefore share one exact build per engine without changing what is tested.

Replacement proof on candidate `4e1d19581a0a4fd91d25823303aa8a6dc25657fa`, run `32630563608`:

- `pure-runtime-parity` — **success**: Runtime Core, Shadow Runtime, exact artifact parity against PR base SHA;
- `chromium-runtime` — **success**: Shadow transition observation, Continue + Live Route, inline Settings;
- `webkit-runtime` — **success**: same three browser responsibilities on iPhone-like WebKit.

The replacement preserves all unique 8.13 responsibilities while reducing the old family from up to eight canonical builds to three explicit builds/jobs. The four old automatic workflow files are now approved for atomic retirement; `axis-ci-convergence-contract.mjs` guards against their return.

### Next · 8.12 and older Deep Compatibility audit

Initial evidence shows hierarchical duplication but also genuine potentially unique contracts:

- 8.12.2 reruns the 8.12.1 real Group Plan regression;
- 8.12.3 Field Polish reruns Group Plan again but uniquely covers personal equipment library/photos/history, picker lifecycle and geometry;
- 8.12.3 Learning Simplify uniquely protects simplified local-only learning/recording boundaries;
- AXIS 8.10.3 (`axis-89-gate.yml`) runs the 8.9→8.10.3 inherited learning/detail/home/voice chain in both engines;
- Runtime Gate already owns broad current Home/8.8.x/catalog/watermark/full-product coverage.

The next target is a version-neutral **Deep Compatibility Gate**, not deletion by release number. It must explicitly preserve old-data, Personal Equipment, Group Plan, Settings and Language Studio semantics before 8.12/8.10.x workflow retirement.

## Validation for this work

Never trade correctness for CI speed. Preserve:

- exact AXIS 8.18 behavior and one canonical runtime;
- `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`;
- custom object identity/aliases and historical Encounter readability;
- current camera/media/sound/completion ownership;
- Chromium + iPhone-like WebKit for affected behavior;
- exact-SHA provider Production proof;
- no timeout inflation to hide failures, weakened assertions, duplicate stores/recorders/sound owners, or destructive data migrations.

## Next planned stage

Atomically remove the four superseded 8.13 workflow files, verify Runtime Foundation + Repository/retirement guards on the post-retirement exact head, then continue the 8.12/8.10.x Deep Compatibility mapping.
