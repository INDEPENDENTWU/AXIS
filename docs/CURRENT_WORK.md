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

### Preserved · native / cross-platform foundation

The native handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`. Shared portable contracts remain `axis.domain.v1` for domain semantics and `axis.data.v1` for durable exchange. Web/iOS capability differences stay isolated behind platform contracts rather than leaking into product truth.

**Chat history is not authoritative project memory.** Durable handoff, ADRs, shared contracts, fixtures and GitHub state are authoritative for future agents and native work.

### Completed · stale PR head convergence

`AXIS PR Run Convergence` is verified. Cross-head run `32626975731` cancelled obsolete older-SHA work without touching the newest PR head or `push/main` Production runs.

### Completed · Current Release convergence (8.14→8.18)

Seven automatic release-era workflow families were replaced by `AXIS Current Release Gate` + `axis-current-release-contract.mjs`.

- replacement run `32630099680`: Chromium + WebKit **success**;
- retirement head `709d801e268e6d06248c21f517aa1a17e565764b`;
- post-retirement Repository/guard `32630367007`: **success**;
- post-retirement Current Release `32630367047`: Chromium + WebKit **success**.

### Completed · Runtime Foundation convergence (8.13)

Four automatic Runtime Core / Shadow Runtime / Live Route / Settings workflow families were replaced by `AXIS Runtime Foundation Gate` + `axis-runtime-foundation-contract.mjs`.

- replacement run `32630563608`: pure-runtime-parity + Chromium + WebKit **success**;
- retirement head `b4cd93e091ac7368dc2b6e5b57aa96236bbaa70d`;
- post-retirement Repository/11-workflow resurrection guard `32630723051`: **success**;
- post-retirement Runtime Foundation `32630723007`: pure-runtime-parity + Chromium + WebKit **success**.

### Completed replacement proof · Deep Compatibility convergence (8.8→8.12.5)

Nine historical automatic compatibility workflow families were mapped into one responsibility-based replacement:

- `.github/workflows/axis-deep-compatibility-gate.yml`;
- `scripts/axis-deep-compatibility-contract.mjs`.

The replacement preserves legacy storage, reminder/Home transitions, 8.9→8.10.3 detail/learning/home/voice, 8.12 field/Group Plan/Settings, Personal Equipment/gallery/picker/history/geometry, local-only simplified Learning, and 8.12.4/8.12.5 flow/catalog/smart-create behavior.

Test preparation order is fixed:

`build-release → prepare-release-test-contract → prepare-8123-ci-stability → Deep Compatibility contract → browser smokes`.

The first candidate run `32630933984` found only a replacement harness dependency mismatch (`playwright-core` vs the full `playwright` package imported by the reminder smoke). Product code, assertions and timeouts were not changed. The harness was corrected.

Exact replacement candidate `a879d30c2cf6e0b3eb2e0fed91a48f3b62262da0`, run `32631072695`:

- static compatibility — **success**;
- Chromium compatibility — **success**;
- iPhone-like WebKit compatibility — **success**;
- every grouped inherited smoke — **success**.

This authorizes atomic retirement of the nine old compatibility workflows. After that retirement, the automatic workflow architecture should contain **9 responsibility-based families instead of the original 25**.

## Validation for this work

Preserve exact 8.18 behavior, one canonical runtime, historical storage/data readability, custom object identity, current camera/media/sound/completion ownership, Chromium/WebKit coverage and exact-SHA Production proof. Do not gain green CI through timeout inflation, weaker assertions, duplicate owners/stores, or destructive migration.

## Exact next action

On the retirement head, prove all of the following with the nine old compatibility workflow files physically absent:

1. `AXIS Repository Contract` + 20-workflow resurrection guard — success;
2. `AXIS Deep Compatibility Gate` static + Chromium + WebKit — success;
3. current automatic workflow family count — 9;
4. no retired workflow name returns;
5. native/cross-platform foundation seal — success.

After that proof, update the final handoff/PR evidence and assess path scoping / remaining build-source convergence before declaring PR #79 merge-ready.
