# Compatibility ledger

AXIS 8.12 is the compatibility baseline for future source convergence.

The production artifact is already a canonical single runtime. The debt tracked here is source-side: historical browser owners and build-time transforms still have to be understood before they can be physically removed.

This ledger exists so compatibility work is reduced deliberately instead of being rediscovered from filenames.

## Current eras

| Era | What remains | Why it still exists | Exit condition |
|---|---|---|---|
| pre-8.8 / legacy | base runtime and historical enhancement source | local data and long-lived product behavior originated here | replacement owners read existing data and inherited gates pass without the old source |
| 8.8 canonicalization | ownership convergence, first paint, watermark, catalog, canonical packager | established one-runtime production and retired competing writers | behavior moves into direct current owners; exact compiler rewrites become unnecessary |
| 8.8.x | home state, media, quick record, lifecycle, field refinements | protects important interaction and WebKit regressions | equivalent current modules + product matrix make version-specific rewrites redundant |
| 8.9 / 8.9.1 | detail handoff, local vision, Rest Speak foundation | still contributes current product behavior and inherited regression expectations | current modules own these surfaces directly |
| 8.10.x | learning engine, settings, timing, sound and interaction stability | evolved the learning surface while preserving training ownership | Language Runtime is extracted and old DOM patch layers retire |
| 8.11 | multilingual atlas, State Field, cloud/AI foundation | current data/contracts are inherited by 8.12 | current libraries become source truth and 8.11-only transformation is no longer required |
| 8.12 | Language Studio content/settings and current release contract | current release behavior | becomes inherited baseline when the next release is proven |

## Non-negotiable compatibility

The following are user/product contracts, not disposable legacy:

- existing `axis_v60_state` training history;
- existing `axis_v8_meta` set/timer/preferences metadata;
- existing `axis_v89_speak` learning state;
- IndexedDB media that the product intentionally persisted;
- current custom equipment identity and aliases;
- release behavior covered by canonical manifest gates;
- current browser behavior covered by Chromium and iPhone-like WebKit tests.

A cleanup that loses any of these is not convergence.

## Compiler rule from 8.13 onward

The default is **not** to add another permanent historical patch layer for each new feature.

New architecture work should prefer:

```text
pure domain contract
      ↓
shadow comparison against 8.12 behavior
      ↓
explicit owner handoff
      ↓
old owner retirement
      ↓
compiler step deletion
```

A new `prepare-*` compatibility transform is justified only when a real compatibility boundary cannot be migrated safely in the same change. If one is added, the pull request must document its deletion condition.

## Retirement queue

Retirement order should follow dependency risk, not filename age.

1. **One-off operational markers** — keep under `docs/history/`; never executable.
2. **Unreferenced build helpers** — prove with repository references plus full release gates, then delete.
3. **Duplicate workflow coverage** — consolidate only after required checks and browser coverage remain equivalent.
4. **Version-only release compatibility transforms** — collapse once source release identity is current without staged mutation.
5. **Historical DOM/source owners** — retire one surface at a time after a current owner exists.
6. **Canonical compiler rewrites** — remove as direct source ownership replaces exact historical rewriting.

## Evidence required before deletion

For every executable retirement, record:

- file/step being removed;
- behavior it used to preserve;
- new canonical owner;
- data migration impact, if any;
- tests that prove final state;
- tests that prove transient state where relevant;
- Chromium result;
- WebKit result;
- production artifact topology result.

The objective is measurable: the executing product stays stable while the number of historical source owners and deterministic build steps trends downward over time.
