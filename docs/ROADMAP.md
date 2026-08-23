# Roadmap

This is a product and architecture roadmap, not a feature backlog.

## Current Production baseline — AXIS 8.18

AXIS 8.18 is the current behavior baseline. It seals Object Truth, Route Truth, schema-aware Focus, current Capture preferences/camera switching, source-first media, stable 30fps video composition, fact-first detail behavior and the derived Evolution Library while preserving inherited local-first training/data contracts.

Exact current Production baseline is recorded in `governance/project-state.json` and `docs/CURRENT_RELEASE.md`.

## Now — Source Convergence · 8.19 Foundation

Before adding another product layer, make the repository easier and faster to evolve without weakening compatibility.

### Stage A — Handoff Truth

- one machine-readable current project state;
- one human/agent handoff entry;
- explicit current owners;
- explicit retired authority;
- current docs no longer describe old releases as current.

Exit: a new developer/agent can recover the real Production baseline, active work, ownership and next action from GitHub alone.

### Stage B — executable reachability inventory

Classify every historical build transform, browser owner and workflow as:

- `current`;
- `compatibility-required`;
- `superseded`;
- `historical-only`.

Exit: no cleanup decision depends on filename age or memory.

### Stage C — CI convergence

Move from a permanent workflow-per-release shape toward:

1. fast repository/current PR gate;
2. current product matrix;
3. explicit deep compatibility/data gate;
4. exact-SHA Production seal.

Exit: equivalent or stronger proof with materially less duplicate runner work and stale implementation-shape diagnosis.

### Stage D — source quarantine and direct ownership

- remove proven-dead helpers;
- keep compatibility adapters explicit and narrow;
- migrate current behavior from exact historical rewrites into current source owners one surface at a time;
- shorten the deterministic build chain without changing the canonical runtime contract.

Exit: the source tree increasingly resembles the product that actually ships.

## Presentation foundation

After source governance is stable, establish presentation architecture before broadening the product.

### Professional localization

Initial UI locales are exactly:

- `zh-Hans` — **简体中文**;
- `zh-Hant` — **繁體中文**;
- `en` — **English**.

Requirements:

- semantic translation keys;
- professional, context-aware translations;
- real Simplified Chinese under `zh-Hans`;
- professionally localized Traditional Chinese under `zh-Hant`, not mechanical conversion;
- natural product English;
- locale-key parity and missing-key CI failure;
- locale-aware date/number formatting;
- layout expansion tests.

### Semantic themes

Initial preference:

- `system`;
- `light`;
- `dark`.

Use semantic tokens, first-paint-safe theme resolution, accessible contrast and separate media/watermark contrast semantics. Switching theme must not leave fixed-color logos/icons/symbols or partially converted surfaces.

## AXIS 8.19 — Universal Practice Objects

8.18 proves the underlying primitive:

```text
Object
  ↓
metric schema
  ↓
Encounter
  ↓
Evidence
  ↓
time
  ↓
Evolution
```

8.19 should generalize that primitive to more repeated real-world practice without turning AXIS into a category-heavy or setup-heavy product.

Possible domains include strength/cardio, climbing, swimming, rehabilitation practice, yoga, dance, racket/ball practice, striking, instruments, pronunciation and other repeated skills — only where the same factual model fits naturally.

### Metric schema v2 direction

The domain layer may support richer field semantics such as:

- number/count;
- duration;
- distance;
- pace;
- percentage;
- rating;
- boolean;
- choice.

The interface should expose only the fields a given object actually needs. More expressive schema must not mean more visible complexity.

### 8.19 success criteria

- broader object/domain expressiveness without mode proliferation;
- old Encounters remain readable;
- no second training database or parallel product truth;
- low-friction creation/recording;
- Evolution remains factual rather than score-driven;
- same domain contracts can travel toward native shells.

## After 8.19 — Evidence and Evolution intelligence

Potential later work:

- stronger evidence chronology and object timelines;
- reliable evidence sequence/time anchors;
- richer factual comparison and recurrence projections;
- local-first insights that state evidence/uncertainty explicitly;
- optional AI assistance that never becomes authoritative training truth.

## Truthful Replay — downstream

Replay remains downstream of trustworthy object identity, Encounter chronology, media source truth and sequence semantics.

Do not build a decorative editor/replay workflow merely because media exists. Replay should reconstruct real evolution without fabricating intermediate facts.

## Multi-platform

Platform expansion follows stable domain contracts rather than UI-code duplication:

1. browser-independent domain/runtime tests;
2. stable storage/media/platform ports;
3. native shells consuming the same domain semantics;
4. platform-specific camera/Photos/haptics/background capabilities behind adapters;
5. Android/desktop only when a concrete use case justifies another shell.

The success metric is shared product/data truth, not the number of platforms shipped.

## Deliberately not on the roadmap

- streak/XP/punishment systems;
- mandatory account before core training;
- generic AI chat as the primary AXIS interface;
- synthetic fitness/progress scores presented as fact;
- medical/recovery claims from weak evidence;
- separate product modes for every activity;
- a big-bang framework rewrite;
- permanent new version-specific patch layers without a retirement condition.
