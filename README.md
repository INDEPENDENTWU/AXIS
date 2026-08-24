# AXIS

Local-first training software built around what actually happened.

**Current release: 8.18** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md) · [Documentation](docs/README.md)

AXIS records real training/practice without requiring reality to behave like a project plan. Training state, sets, object memory, media and history remain useful locally; network and AI capabilities are optional additions rather than prerequisites.

The product grew through many releases, but Production is deliberately flattened into one canonical browser runtime. Historical `v8xx` modules and release transforms remain source/compatibility inputs only where they are still proven necessary; they are not separate product layers downloaded at runtime.

## What is in 8.18

- Strength/cardio recording with factual set-level state, direct adjustment and historical continuity.
- **Object Truth**: custom equipment/sport/movement objects track only the metrics declared by their actual schema; new Encounters snapshot that truth without destructively rewriting old records.
- **Evolution Library / Personal Object Shelf** derived read-only from repeated real Encounters, without a second persistence model or synthetic progress score.
- **Route Truth**: foreground/PWA recovery converges to one physically active main route; inactive routes cannot leak controls into the current surface.
- **Focus** as a presentation layer that respects object metrics and delegates completion to the established owner.
- One canonical **Capture** system with Photo / Scan / Video, persisted default mode/facing preferences and front/rear camera switching.
- Scan sampling remains exactly **3秒 / 5秒**; these are sampling durations, not historical capture/video mode choices.
- One logical MediaRecorder over the sealed **30fps canvas compositor**; historical low-fps/forced-720p downgrade paths are retired.
- Source-first media: clean `S-* / SV-*` sidecars and canonical `F-* / V-*` derivatives in the existing `axis_v42_media` store.
- Stable Comparative Evidence, time-first archive organization, batch media export and Encounter deletion on the existing data model.
- Fact-first History/Encounter details with asynchronous media hydration and stable in-place item swaps.
- Optional owner-managed AI/cloud capabilities that fail open and do not become training truth.
- Chromium and iPhone-like WebKit regression gates, plus exact-production-SHA release verification.

## Product rules

**Reality is authoritative.** A real workout/practice is valid even when it changes, ends early or differs from a suggestion.

**Local first.** Core training remains usable without an account, network or model call.

**One surface, one owner.** A visible semantic action or authoritative fact has one writer. Replacing an owner includes retiring the previous writer.

**Evidence before interpretation.** AXIS may make recorded reality easier to inspect and compare, but does not turn factual change into a synthetic progress verdict.

**Fail open.** Vision, AI, cloud and other optional services degrade to local/manual behavior instead of blocking recording.

**Quiet interfaces.** The product should require less attention as it learns more about repeated behavior.

See [docs/PRODUCT.md](docs/PRODUCT.md) for the product contract.

## Current engineering state

Production remains **AXIS 8.18** while the repository executes **AXIS Source Convergence — 8.19 Foundation** on branch `engineering/source-convergence-819`.

The convergence milestone has **zero intended product behavior change**. It centralizes current project truth, makes ownership/retirement explicit, reduces historical build/CI debt safely, and prepares the presentation foundation before 8.19 feature development.

Any developer or agent joining the project should read:

1. [`governance/project-state.json`](governance/project-state.json)
2. [`docs/HANDOFF.md`](docs/HANDOFF.md)
3. [`docs/CURRENT_WORK.md`](docs/CURRENT_WORK.md)

Chat history is supplementary context, not authoritative project memory.

## Production architecture

```text
current + required compatibility source
                 |
                 v
       deterministic convergence
                 |
                 v
          contract assertions
                 |
                 v
     axis-core.js + axis-style.css
                 |
                 v
         one production runtime
```

Release build entry point:

```bash
node build-release.mjs
```

Vercel builds `main` through the deterministic release path. EdgeOne is the verified-prebuilt Production mirror path rather than an independent reinterpretation of source.

CI baseline: Node 20.18.0. Critical browser release gates cover Chromium and iPhone-like WebKit.

## Repository map

```text
governance/           machine-readable current project/owner/retirement truth
docs/                 product, architecture, handoff, delivery and history
runtime/              extracted runtime/domain foundation and browser adapters
shared/contracts/     durable cross-platform contracts and schemas
api/                  same-origin server endpoints
cloud-functions/      alternate serverless adapter surface
compiler/             explicit build-time source fragments
lib/                  reusable contracts and current libraries
data/                 curated local data
scripts/              diagnostics, smoke and release verification
.github/workflows/    CI and Production gates

app.js, v*.js         current/historical source owners still used by convergence
prepare-*.mjs         build-time migrations/ownership convergence
postbuild-*.mjs       canonical packaging and release assertions
build-release.mjs     sole release build entry point
```

The broad inherited source tree is being converged deliberately rather than rearranged cosmetically. A historical filename is not proof that a file is safe to delete; reachability, ownership, data compatibility and browser behavior must be proven first.

## Localization and theme foundation

The next presentation foundation is explicitly:

- `zh-Hans` — **简体中文**
- `zh-Hant` — **繁體中文**
- `en` — **English**

and theme preferences:

- `system`
- `light`
- `dark`

Translations must be professional and semantic: Simplified Chinese must actually be Simplified Chinese, Traditional Chinese is not a blind script conversion, and English must read naturally while preserving AXIS product meaning. Themes will use semantic tokens and must not create wrong-color logos/icons, partial conversions or wrong-theme first-paint flashes.

See [Localization and theme](docs/LOCALIZATION_AND_THEME.md) and the [three-language glossary](docs/GLOSSARY.md).

## Development discipline

A change is complete when the intended owner is clear, competing behavior is retired, the final artifact is deterministic, and the affected real user path is covered by the correct current-product contract.

Quick repository check:

```bash
node scripts/axis-repository-contract.mjs
```

Release build:

```bash
node build-release.mjs
```

Normal release path:

1. branch from the last verified Production `main`;
2. make one coherent product or engineering change;
3. run repository/current contracts and deterministic build;
4. pass required Chromium/WebKit gates on the same candidate;
5. merge only the exact verified head;
6. verify Production against the exact merged source/artifact before declaring a release sealed.

See [CONTRIBUTING.md](CONTRIBUTING.md), [Engineering playbook](docs/ENGINEERING_PLAYBOOK.md) and [CI and release gates](docs/CI_AND_RELEASE.md).

## Next

First: finish **Source Convergence — 8.19 Foundation** without changing 8.18 product behavior.

Then AXIS 8.19 can generalize the sealed `Object → metric schema → Encounter → Evidence → Evolution` model toward **Universal Practice Objects** for a broader range of repeated real-world practice, while keeping the interface low-friction and factual-first.

See [docs/CURRENT_WORK.md](docs/CURRENT_WORK.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Project status

AXIS is under active development. The repository is public, but no software license has been selected yet; public visibility should not be interpreted as a grant of reuse rights.
