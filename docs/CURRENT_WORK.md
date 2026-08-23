# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Production: **AXIS 8.18**.
- Exact baseline: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`.
- Source Convergence has **zero intended user-visible behavior change**; this Production artifact remains the equivalence/rollback reference.

## Active change

**AXIS Source Convergence — 8.19 Foundation** · branch `engineering/source-convergence-819` · PR **#79**.

Current phase: **Phase 2 — CI convergence + executable reachability**.

### Completed · durable governance

GitHub owns current project/release context, owners, retirements and CI evidence. Future presentation foundation remains exactly `zh-Hans` **简体中文**, `zh-Hant` **繁體中文**, `en` **English**, themes `system / light / dark`.

### Completed · stale PR head convergence

`AXIS PR Run Convergence` is verified. Cross-head run `32626975731` cancelled obsolete older-SHA work without touching the newest PR head or `push/main` Production runs.

### Completed · Current Release convergence (8.14→8.18)

Seven automatic release-era workflow families were replaced by `AXIS Current Release Gate` + `axis-current-release-contract.mjs`.

- replacement run `32630099680` on `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59`: Chromium + WebKit **success**;
- retirement head `709d801e268e6d06248c21f517aa1a17e565764b`;
- post-retirement Repository/guard `32630367007`: **success**;
- post-retirement Current Release `32630367047`: Chromium + WebKit **success**.

### Completed · Runtime Foundation convergence (8.13)

Four automatic Runtime Core / Shadow Runtime / Live Route / Settings workflow families were replaced by `AXIS Runtime Foundation Gate` + `axis-runtime-foundation-contract.mjs`.

- replacement run `32630563608` on `4e1d19581a0a4fd91d25823303aa8a6dc25657fa`: pure-runtime-parity + Chromium + WebKit **success**;
- retirement head `b4cd93e091ac7368dc2b6e5b57aa96236bbaa70d`;
- post-retirement Repository/11-workflow resurrection guard `32630723051`: **success**;
- post-retirement Runtime Foundation `32630723007`: pure-runtime-parity + Chromium + WebKit **success**;
- automatic workflow families observed after retirement: **17**.

### Active · Deep Compatibility replacement candidate

The remaining historical automatic gates have now been mapped to nine workflow families:

- 8.12 Field Hardening;
- 8.12.x Field Hotfix;
- 8.12.2 Settings;
- 8.12.3 Field Polish;
- 8.12.3 Learning Simplify;
- 8.10.3 (`axis-89-gate.yml`, containing the inherited 8.9→8.10.3 chain);
- 8.8 Reminder Layout;
- Home Transition;
- Inherited Web Release (`axis-8124-flow-gate.yml`).

They are **not** being deleted because they are old. Their distinct current compatibility promises have been collected into a replacement candidate:

- `.github/workflows/axis-deep-compatibility-gate.yml`;
- `scripts/axis-deep-compatibility-contract.mjs`.

The replacement preserves:

- storage identities `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`;
- reminder repaint/bottom-stack geometry;
- Home active hierarchy, inter-item transition, completed Home and canonical Quick camera;
- 8.9→8.10.3 detail, learning, timer, local recording, home/sound and multilingual voice behavior;
- 8.12 field hardening, real Group Plan and Settings behavior;
- Personal Equipment library/photos/history, gallery/picker lifecycle and geometry;
- simplified local-only Learning/no-upload/no-training-owner boundaries;
- 8.12.4 training timing/completion/catalog and 8.12.5 smart-create;
- static syntax of the inherited server/compiler/postbuild chain.

Test preparation order is explicit and safe:

`build-release → prepare-release-test-contract → prepare-8123-ci-stability → Deep Compatibility contract → browser smokes`.

Both preparers modify inherited tests only; they do not rewrite the built Product artifact.

The nine old workflow families remain automatic on the first replacement candidate. **Retirement is not authorized until the new static, Chromium and WebKit jobs all pass on the same SHA.**

## Validation for this work

Preserve exact 8.18 behavior, one canonical runtime, historical storage/data readability, custom object identity, current camera/media/sound/completion ownership, Chromium/WebKit coverage and exact-SHA Production proof. Do not gain green CI through timeout inflation that hides failures, weaker assertions, duplicate owners/stores, or destructive migration.

## Next planned stage

Run `AXIS Deep Compatibility Gate` beside all nine existing historical workflow families. If static + Chromium + WebKit are all green, compare exact responsibilities, atomically retire the nine workflow files, extend `axis-ci-convergence-contract.mjs` to prohibit their return, and prove the post-retirement exact head before any path-scoping or provider workflow changes.
