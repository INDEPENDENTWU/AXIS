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

Established:

- machine-readable current project state;
- current owner and retirement registries;
- `docs/HANDOFF.md` as first human/agent entry;
- real AXIS 8.18 Production truth in current docs;
- Repository Contract driven by governance rather than hard-coded 8.17;
- presentation contract exactly:
  - `zh-Hans` — **简体中文**;
  - `zh-Hant` — **繁體中文**;
  - `en` — **English**;
  - `system / light / dark` themes.

Proof:

- Repository Contract run `32626662160` — **success**;
- Work Continuity run `32626662162` — **success**.

No app/runtime/Capture/media source was changed by Phase 1.

### Phase 2 — Reachability and CI inventory · active

A governance/docs-oriented PR head was observed to trigger **25 workflows**, spanning 8.8 through 8.18 plus current runtime/cross-platform/provider gates.

- machine evidence: [`../governance/ci-inventory.json`](../governance/ci-inventory.json);
- human audit: [`CI_CONVERGENCE.md`](CI_CONVERGENCE.md).

Old workflow names do not imply safe deletion. Pending historical gates remain `compatibility-required-pending-equivalence-audit` until semantic, browser, data and branch-protection coverage is mapped.

#### First Phase 2 optimization — stale PR head cancellation · verified

`.github/workflows/axis-pr-run-convergence.yml` uses official `actions/github-script@v9` and cancels only obsolete still-active runs from previous heads of the same PR.

Proof:

- first run `32626897002` — **success**, latest-head exclusion/API/permission path proven;
- cross-head run `32626975731` — **success**;
- stale active runs found: **10**;
- cancellation requests accepted: **8**;
- **2** finished before cancellation and were left untouched;
- stale SHA: `df1b2507923083e49bde3602425194bccbc22f70`;
- current SHA during proof: `1c30a3006fe1627838eac98ee133a3303a6cf509`;
- latest head touched: **false**.

This optimization changes runner scheduling only. It removes obsolete candidate work while preserving every existing test/assertion for the newest PR head. It does not target `push`, `main`, Production, another PR, or the current convergence run.

### Next Phase 2 audit slices

1. record path/trigger scope for each observed workflow;
2. map each assertion to a current product semantic contract;
3. identify unique Chromium/WebKit coverage;
4. identify old-data/compatibility-only coverage;
5. inspect branch-protection required check-name implications;
6. measure duplicate `node build-release.mjs` work;
7. move only proven-equivalent coverage toward Current Product Matrix / Deep Compatibility Gate.

### Later phases

- converge CI into four understandable layers;
- safely quarantine/delete executable history only after reachability proof;
- replace exact historical rewrites with direct current ownership one surface at a time;
- implement professional three-locale i18n foundation;
- implement semantic System/Light/Dark theme foundation;
- then begin AXIS 8.19 Universal Practice Objects.

## Validation for this work

Source Convergence must continue to preserve:

- Repository Contract and Work Continuity;
- exact 8.18 behavior-equivalence baseline;
- latest-head test coverage;
- `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`;
- custom object identity/aliases and historical Encounter readability;
- one canonical runtime and current camera/media/sound/completion ownership;
- Chromium + iPhone-like WebKit proof for critical behavior;
- no timeout inflation, assertion weakening, duplicate store/recorder/sound ownership or destructive user-data migration.

No workflow may be removed merely because stale-head cancellation now exists. Workflow consolidation requires its own equivalence proof.

## Next planned stage

Continue the workflow-by-workflow equivalence inventory from the verified 25-run snapshot. First prioritize duplicate canonical builds and broad unscoped PR triggers, while preserving current latest-head coverage and exact-SHA Production seal behavior.
