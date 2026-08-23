# Compatibility ledger

AXIS 8.18 is the current Production behavior baseline. **8.12 remains the long-lived source/data compatibility foundation**, not the current product release.

Production is already a canonical single runtime. The debt tracked here is primarily source/build/CI-side: historical owners and transforms still participate in producing or proving current behavior.

This ledger exists so compatibility is reduced deliberately instead of being inferred from filenames.

## Current eras

| Era | Current role | Why it can still exist | Exit condition |
| --- | --- | --- | --- |
| pre-8.8 / legacy | compatibility source + long-lived data origin | current user history/storage originated here | current owners read/migrate existing data and inherited behavior passes without old executable source |
| 8.8 canonicalization | source/build convergence provenance | established canonical runtime, watermark/catalog/first-paint ownership | direct current source owns the surviving behavior and exact compiler rewrites are unnecessary |
| 8.8.x | compatibility behavior/tests | protects home/media/lifecycle/WebKit regressions | current semantic matrix covers the behavior without historical implementation assertions |
| 8.9 / 8.9.1 | compatibility behavior/tests | detail handoff, vision and learning regressions remain relevant | direct current owners + current tests fully replace version-shaped execution |
| 8.10.x | compatibility behavior/tests | learning/settings/timing/sound evolution | current Language/runtime contracts cover surviving behavior |
| 8.11 | compatibility foundation provenance | multilingual/State Field/cloud contracts feed later product behavior | current libraries/contracts replace 8.11-only transforms |
| 8.12 / 8.12.x | **long-lived compatibility foundation** | many source/data assumptions converge from here | normalized current adapters make version-specific rewrites unnecessary |
| 8.13 / 8.13.1 | inherited current behavior | route/evolution foundation | direct domain/runtime source owns these contracts |
| 8.14 | inherited current behavior | Evolution Objects | current Object/Encounter runtime subsumes the historical transform |
| 8.15 / 8.15.1 | inherited current behavior | Media Evidence + stable swap/watermark seals | current Evidence/media modules own the behavior directly |
| 8.16 | inherited current behavior | unified Capture Field + Comparative Evidence | current Capture/Evidence source no longer depends on exact 8.16 mutation |
| 8.17 / 8.17.1 | inherited current behavior | interaction convergence + source-first media | current owners express the guarantees directly |
| 8.18 | **current Production behavior baseline** | Object/Route/Capture/Focus/Evolution truth | becomes inherited baseline only after a later Production release is sealed |

Version-like filenames are provenance. Current authority is recorded in `governance/project-state.json`, `docs/HANDOFF.md`, owner/retirement registries and current contracts.

## Non-negotiable compatibility

These are user/product contracts, not disposable legacy:

- existing `axis_v60_state` training history;
- existing `axis_v8_meta` set/timer/preferences metadata;
- existing `axis_v89_speak` learning state;
- `axis_v42_media` IndexedDB media intentionally persisted by AXIS;
- current custom equipment/object identity and aliases;
- historical Encounter readability;
- current runtime behavior covered by the canonical product contracts;
- critical Chromium and iPhone-like WebKit behavior.

A cleanup that loses any of these is not convergence.

## Source Convergence — 8.19 Foundation

The active engineering milestone is explicitly **not** a rewrite and carries zero intended user-visible behavior change.

Preferred migration:

```text
current/pure contract
      ↓
shadow or equivalence proof
      ↓
explicit owner handoff
      ↓
old authority retirement
      ↓
compiler/test/workflow deletion
```

A new permanent `prepare-*` version layer is a last resort. If a real compatibility boundary requires one, its deletion condition must be recorded when introduced.

## Classification model

Every executable historical item should be classified before cleanup:

- `current` — directly owns current behavior;
- `compatibility-required` — still required to preserve current data/behavior but not a preferred long-term owner;
- `superseded` — current equivalent exists and deletion evidence is being assembled;
- `historical-only` — provenance only and must not participate in current execution.

Classification must be based on executable reachability and behavior, not age.

## Retirement queue

1. One-off operational markers → `docs/history/`, never executable.
2. Unreferenced build helpers → prove reachability absence, then delete.
3. Duplicate/stale test assertions → replace implementation-shape checks with current semantic contracts.
4. Duplicate version-shaped workflows → consolidate after trigger/assertion/browser coverage equivalence is explicit.
5. Version-only release identity transforms → collapse after checked-in/current source identity no longer needs staged mutation.
6. Historical DOM/source owners → retire one surface at a time after current ownership exists.
7. Canonical compiler rewrites → remove as direct source ownership replaces exact historical rewriting.

## Evidence required before executable deletion

Record:

- file/step being removed;
- behavior/data it used to preserve;
- current replacement owner or proof that no replacement is required;
- LocalStorage/IndexedDB migration impact;
- current semantic tests;
- transient-state tests where relevant;
- Chromium result where user-visible;
- WebKit result where user-visible;
- canonical artifact/topology result.

See `governance/retirements.json` for authority that is already forbidden from returning.

## Success metric

Source convergence is successful when the shipped product stays behaviorally stable while these move downward:

- authoritative source owners;
- historical executable transforms;
- per-version CI duplication;
- source-to-artifact indirection;
- time required to decide whether a failing old assertion is a real regression.
