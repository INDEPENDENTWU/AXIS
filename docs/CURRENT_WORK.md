# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine current state is [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Current Production release: **AXIS 8.18**.
- Exact merged baseline SHA: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`.
- Vercel exact-main Production is verified `READY` on that SHA.
- This baseline is the rollback and behavior-equivalence reference for source convergence.

## Active change

**AXIS Source Convergence — 8.19 Foundation**

Branch: `engineering/source-convergence-819`

PR: **#79**

Current phase: **Phase 2 — Reachability and CI inventory**.

This is an engineering milestone, not a product release. **Zero intended user-visible behavior change** remains the rule for the convergence work being performed now.

### Phase 1 — Handoff Truth and governance · complete

Phase 1 established:

- `governance/project-state.json` as machine-readable current project state;
- owner and retirement registries;
- `docs/HANDOFF.md` as first human/agent entry point;
- real 8.18 Production truth in README/current-release/current-work docs;
- repository contract driven by governance instead of hard-coded 8.17;
- professional presentation contract for exactly:
  - `zh-Hans` — **简体中文**;
  - `zh-Hant` — **繁體中文**;
  - `en` — **English**;
  - themes `system / light / dark`.

Proof:

- AXIS Repository Contract run `32626662160` — **success**;
- AXIS Work Continuity Contract run `32626662162` — **success**.

No app/runtime/Capture/media source was changed by Phase 1.

### Phase 2 — Reachability and CI inventory · active

A single governance/docs-oriented PR head was observed to trigger **25 workflows**, spanning 8.8 through 8.18 plus current runtime/cross-platform/provider gates.

Machine evidence: [`../governance/ci-inventory.json`](../governance/ci-inventory.json).

Human audit: [`CI_CONVERGENCE.md`](CI_CONVERGENCE.md).

No historical workflow is considered dead merely because its name is old. Pending workflows default to `compatibility-required-pending-equivalence-audit` until current semantic, browser, data and branch-protection coverage is mapped.

#### First Phase 2 optimization — stale PR head cancellation

`.github/workflows/axis-pr-run-convergence.yml` was introduced on commit `df1b2507923083e49bde3602425194bccbc22f70` using official `actions/github-script@v9`.

First workflow execution:

- run `32626897002` — **success**;
- API permission/path validation passed;
- latest-head exclusion passed;
- zero stale active runs existed at the instant of that first execution, so real cross-head cancellation remains the next proof step.

The workflow may cancel only still-active `pull_request` runs that:

- belong to the same PR number;
- belong to the same head branch;
- run an older head SHA than the current PR head;
- are queued/in-progress/requested/waiting/pending.

It must never cancel:

- the latest current PR head;
- another PR;
- `push` runs;
- `main` / Production runs;
- itself.

This changes runner scheduling only. It does **not** remove or weaken any current test/assertion on the latest candidate.

### Next Phase 2 audit slices

After real stale-run cancellation is proven:

1. record path/trigger scope for each observed workflow;
2. map each assertion to a current product semantic contract;
3. identify unique Chromium/WebKit coverage;
4. identify old-data/compatibility-only coverage;
5. inspect branch-protection required check-name implications;
6. measure duplicate `node build-release.mjs` work;
7. move only proven-equivalent coverage toward Current Product Matrix / Deep Compatibility Gate.

### Later phases

- CI convergence into four understandable layers;
- safe source quarantine/physical retirement after reachability proof;
- direct current ownership replacing exact historical rewrites one surface at a time;
- professional three-locale i18n foundation;
- semantic System/Light/Dark theme foundation;
- AXIS 8.19 Universal Practice Objects after engineering convergence is trustworthy.

## Validation for this work

Phase 2's first optimization is acceptable only if:

- Repository Contract remains green;
- Work Continuity remains green;
- the cancellation workflow runs successfully on PR #79;
- a later PR head proves it cancels only prior-head runs from PR #79;
- latest-head workflows remain queued/running/completable;
- no `main`/Production run is cancelled;
- current PR diff contains no intended product/runtime behavior change;
- all historical workflows remain present until a separate equivalence audit approves consolidation/retirement.

Non-negotiable compatibility throughout convergence:

- preserve `axis_v60_state`;
- preserve `axis_v8_meta`;
- preserve `axis_v89_speak`;
- preserve `axis_v42_media`;
- preserve custom object identity/aliases and historical Encounter readability;
- preserve one canonical runtime and current camera/media/sound/completion ownership;
- preserve Chromium + iPhone-like WebKit release proof for critical behavior;
- never use timeout inflation, assertion weakening, duplicate database/store/recorder/sound ownership, or destructive user-data migration to obtain green CI.

## Next planned stage

Use this evidence-update head to prove real cross-head stale-run cancellation, then continue the workflow-by-workflow equivalence inventory. Do not delete or merge historical gates until their surviving semantic/data/browser responsibility and replacement check are explicit.
