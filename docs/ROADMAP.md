# Roadmap

This is a product/architecture roadmap, not a feature backlog.

## Current Production baseline — AXIS 8.20.1

AXIS 8.20.1 is the sealed behavior baseline. It proves a complete executable single-Object chain:

```text
Object
  ↓
metric schema + execution semantics
  ↓
Recording
  ↓
Active or one-shot execution
  ↓
immutable Encounter
  ↓
Evidence
  ↓
Evolution
```

The current release is dual-provider and dual-engine Production verified. Exact release/deployment truth is recorded in `governance/project-state.json` and `docs/CURRENT_RELEASE.md`.

## Now — AXIS 8.21 · Flow / Session Blueprint

The next product primitive is **Flow**: a lightweight arrangement of reusable Objects that helps a real practice session continue with less friction without turning intended order into factual history.

Example intent:

```text
A → B → C
```

Valid reality:

```text
A → D → B
```

AXIS accepts the second sequence as reality. There is no “plan violation” model.

### 8.21 goals

- ordered canonical Object references;
- optional temporary step overrides;
- no mutation of Object defaults by Flow overrides;
- start/advance/skip/insert/replace/finish without requiring all Objects to be Active;
- delegate recording and ongoing execution to existing owners;
- additive immutable Flow provenance on Encounter where useful;
- historical Encounters remain valid after Flow edits/deletion;
- domain-neutral use across compatible repeated practice;
- local-first, quiet and low-friction interaction.

### 8.21 architecture rule

```text
Flow = intent/orchestration
Encounter = history/truth
```

Flow may influence what happens next. It may never rewrite what already happened.

### 8.21 deliberate exclusions

- plan completion percentage;
- streaks / XP / punishment;
- deviation warnings;
- rigid calendar programming;
- AI coaching/program generation as the primary experience;
- separate databases or parallel session models;
- category-specific product modes;
- synthetic progress scores.

See `docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md`.

## Parallel research — Active Action Lens

A non-blocking interaction experiment may test a larger one-hand control layer for high-frequency Active actions such as set completion, pause and finish.

It is not a release dependency. It must remain presentation-only, delegate to existing action owners, preserve mobile navigation/scrolling and be removable without data or semantic migration.

See `docs/ACTIVE_ACTION_LENS_EXPERIMENT.md`.

## Next — AXIS 8.22 · Adaptive Defaults / Living Practice

Only after Flow semantics are sealed should AXIS use repeated factual history to remove more setup friction.

Potential adaptive behavior:

- remember typical duration or metric values for an Object;
- learn which execution mode the user actually keeps using;
- surface likely next Objects/Flow transitions from personal history;
- notice repeatedly skipped/reordered Flow steps without judging them;
- prefill likely values while keeping edits immediate and reversible;
- reduce questions rather than add AI text.

The guiding rule:

> Intelligence should make AXIS ask less, not speak more.

Adaptive defaults are suggestions. They never rewrite historical Encounter truth and never silently mutate reusable Object defaults without an explicit product contract.

## Later — Evidence / Evolution depth

Potential downstream work:

- stronger evidence chronology and object timelines;
- reliable sequence/time anchors across repeated practice;
- richer factual comparisons;
- recurrence/continuity projections with explicit evidence and uncertainty;
- optional AI assistance that remains non-authoritative;
- better cross-domain Evolution views without synthetic scoring.

## Truthful Replay — downstream

Replay remains downstream of trustworthy Object identity, Encounter chronology, media source truth, Flow provenance and sequence semantics.

Do not build a decorative media editor merely because footage exists. Replay should reconstruct factual evolution without fabricating intermediate events.

## Presentation foundation

Localization/theme work remains an architectural foundation rather than a marketing feature.

Initial locales:

- `zh-Hans` — 简体中文
- `zh-Hant` — 繁體中文
- `en` — English

Initial themes:

- `system`
- `light`
- `dark`

Internal stable IDs must remain stable while visible product text is professionally localized. Theme/localization systems may not create another business-state owner or first-paint semantic flash.

## Multi-platform

Platform expansion follows stable domain contracts rather than UI-code duplication:

1. stable browser-independent product/data semantics;
2. portable Flow/Object/Encounter contracts;
3. native shells consuming the same domain truth;
4. platform camera/Photos/haptics/background capabilities behind adapters;
5. Android/desktop only when a concrete use case justifies another shell.

Current cross-platform anchors:

- `axis-native-foundation-0`
- `INDEPENDENTWU/AXIS-iOS`
- `axis.domain.v1`
- `axis.data.v1`

## Engineering convergence remains continuous

The source tree still contains historical compatibility transforms. Cleanup continues only when reachability, data compatibility and current dual-engine behavior prove that authority has moved.

Do not perform cosmetic mass deletion or a big-bang framework rewrite.

## Deliberately not on the roadmap

- mandatory account before core practice;
- generic AI chat as the primary AXIS interface;
- streak/XP/punishment systems;
- synthetic fitness/progress scores presented as fact;
- medical/recovery claims from weak evidence;
- separate product modes for every activity;
- a second training truth database;
- a second recorder/Active/Encounter writer;
- permanent new version-specific patch layers without an explicit retirement condition.
