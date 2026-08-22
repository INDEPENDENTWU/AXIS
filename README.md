# AXIS

Local-first training software built around what actually happened.

**Current release: 8.17** · [Open AXIS](https://axis-five-puce.vercel.app) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md) · [Current release](docs/CURRENT_RELEASE.md) · [Documentation](docs/README.md)

AXIS records a workout without requiring the workout to behave like a project plan. Training state, sets, equipment memory, media and history remain useful locally; network and AI capabilities are optional additions rather than prerequisites.

The product grew through many releases, but Production is deliberately flattened into one canonical browser runtime. Historical `v8xx` modules remain source and compatibility inputs; they are not separate product layers downloaded at runtime.

## What is in 8.17

- Strength and cardio recording with set-level weight/repetition state, direct editing and previous-value reuse.
- Active training state with pause/resume, countdowns, reminders and concise completion behavior.
- Equipment and exercise memory, custom equipment, search and local visual recognition.
- One canonical Capture Field for deliberate evidence: repeated photo capture/import up to 12 photos per Encounter, real-photo cover reorder, 3/5-second Scan sampling and one explicit silent video capped at 60 seconds.
- Quick Record exposes one supplemental `补拍照片 / 视频` action and delegates to that same Capture Field instead of presenting legacy duration choices before capture.
- Explicitly recorded video is retained through the existing `clipRef` / `axis_v42_media` owner; 8.17 adds no second recorder, database, upload path or media schema.
- Evolution Objects and in-place Media Evidence built from sealed real Encounters rather than synthetic progress scores.
- Comparative Evidence uses named `起点 / 对照` slots: `对照` is active by default, a timeline tap directly replaces the active point, and factual `首尾 / 最近 / 相邻` shortcuts remain available.
- Evidence controls stay mounted while new local media is warmed, preserving the 8.15.1 stable no-flash swap contract.
- `资料与收纳` organizes growing sealed history by month: newest month open, older months collapsed, with existing selection/deletion semantics and no new persistence structure.
- History, reports and State Field signals derived from recorded behavior rather than a synthetic fitness score.
- Optional owner-managed AI services for recognition and insight. Provider secrets stay server-side and model failure never blocks recording.
- Optional cloud/sync foundation based on local ownership, revisioned entities, idempotent requests and deterministic conflict handling.
- Language Studio as an isolated rest/learning channel: 25,716 available units across English, Japanese, Korean and Chinese, with 4/8/12-turn dialogue and no training ownership.
- Chromium and iPhone-like WebKit regression gates, plus exact-production-SHA verification across the Vercel and EdgeOne release path.

## Product rules

**Reality is authoritative.** A real workout is valid even when it changes, ends early or differs from a suggestion.

**Local first.** Core training must work without an account, network or model call.

**One surface, one owner.** A visible action or piece of authoritative state has one writer. Replacing an owner includes retiring the previous writer.

**Evidence before interpretation.** AXIS may make recorded reality easier to inspect and compare, but it does not turn factual changes into a score or progress verdict.

**Fail open.** Vision, AI, cloud and other optional services degrade to local/manual behavior instead of blocking the workout.

**Quiet interfaces.** The product should spend less attention as it learns more about repeated behavior.

See [docs/PRODUCT.md](docs/PRODUCT.md) for the product contract.

## Production architecture

```text
historical + compatibility source
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

The release build entry point is:

```bash
node build-release.mjs
```

Vercel builds `main` with that deterministic command and emits `axis-build.json`. EdgeOne does not independently reinterpret source: its Production mirror waits for the exact-SHA Vercel golden artifact, verifies the prebuilt package, deploys that same artifact and runs live Chromium + iPhone WebKit parity checks.

The CI baseline is Node 20.18.0. Browser release gates exercise both Chromium and iPhone-like WebKit.

## Repository map

```text
api/                 same-origin server endpoints
cloud-functions/     alternate serverless adapter surface
compiler/            explicit build-time source fragments
lib/                 reusable contracts and current libraries
data/                 curated local data
scripts/              diagnostics, smoke and release verification
docs/                 product, architecture, delivery and release contracts
.github/workflows/    CI and Production gates

app.js, v*.js         current/historical source owners used by convergence
prepare-*.mjs         exact build-time migrations and ownership convergence
postbuild-*.mjs       canonical packaging and release assertions
build-release.mjs     only release build entry point
```

The broad root remains intentional at the inherited 8.12 compatibility foundation: moving versioned source without retiring its build/data role would be a behavior-changing refactor. See [Repository structure](docs/REPOSITORY_STRUCTURE.md) and the [Compatibility ledger](docs/COMPATIBILITY_LEDGER.md) before changing historical source layout.

Do not infer product ownership from version-like filenames. Start with [Current release](docs/CURRENT_RELEASE.md), [Current work](docs/CURRENT_WORK.md), [Architecture](docs/ARCHITECTURE.md) and the [documentation index](docs/README.md).

## Development discipline

A change is complete when the intended owner is clear, competing behavior is retired, the final artifact is deterministic, and the affected real user path is covered by a regression test.

Quick repository check:

```bash
node scripts/axis-repository-contract.mjs
```

Release build:

```bash
node build-release.mjs
```

The normal release path is:

1. branch from the last verified `main`;
2. make one coherent product or engineering change;
3. run the repository contract, deterministic build and relevant local checks;
4. pass Chromium and WebKit gates on the same candidate;
5. merge only the verified head;
6. verify that Vercel and EdgeOne Production serve the exact merged source SHA.

See [CONTRIBUTING.md](CONTRIBUTING.md), [Engineering playbook](docs/ENGINEERING_PLAYBOOK.md) and [CI and release gates](docs/CI_AND_RELEASE.md).

## Next

8.18 is planned as **Evolution Library / Personal Object Shelf**: repeated real Encounters should settle into stable personal Evolution Objects that remain browsable as history grows, without turning AXIS into a folder manager or category-tab product. Truthful Evolution Replay stays downstream of reliable object identity and real Encounter-bound evidence.

See [docs/ROADMAP.md](docs/ROADMAP.md), [docs/AXIS_817_818_DIRECTION.md](docs/AXIS_817_818_DIRECTION.md) and [docs/AXIS_EVOLUTION_VISION.md](docs/AXIS_EVOLUTION_VISION.md).

## Project status

AXIS is under active development. The repository is public, but no software license has been selected yet; public visibility should not be interpreted as a grant of reuse rights.
