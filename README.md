# AXIS

Local-first software for capturing what actually happened and turning repeated real-world activity into durable personal evolution.

**Current release: 8.13.1** · [Open AXIS](https://axis-five-puce.vercel.app) · [Product](docs/PRODUCT.md) · [Current release](docs/CURRENT_RELEASE.md) · [Evolution vision](docs/AXIS_EVOLUTION_VISION.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS currently starts from training because training provides strong repeated, measurable real-world evidence. Recording remains authoritative and useful offline. The product direction is broader than a fitness dashboard: Capture → Encounter → Evolution → Replay, with photos/video/location/wearable evidence added only when it reduces friction or makes the accumulated result more valuable.

Production is deliberately flattened into one canonical browser runtime. Historical `v8xx` modules remain source and compatibility inputs; they are not separate product layers downloaded at runtime.

## What is in 8.13.1

- Strength and cardio recording with direct Quick Record, set-level state and truthful session completion.
- Interval-based activity/session timing and local-first history.
- Equipment/exercise memory, custom equipment, search and local visual recognition.
- Photo/video capture, timestamp sealing, watermarking and local media storage.
- Read-only Live Route suggestions that never become workout truth until the user records something.
- A live Trends time field that re-reads sealed sessions, keeps same-day sessions distinct, supports horizontal scrub/tap expansion and uses canonical activity metadata for fingerprints.
- A read-only Evolution foundation that derives first/latest encounter, encounter count, time span and media-evidence availability without introducing a second history database.
- Direct factual product copy: no tutorial text such as “左右滑动查看” or “留下几次训练后…”.
- Language Studio remains isolated from training ownership.
- Chromium and iPhone-like WebKit release gates plus exact-production-SHA verification.

## Product rules

**Reality is authoritative.** A real workout is valid even when it changes, ends early or differs from a suggestion.

**Local first.** Core recording must work without an account, network or model call.

**One surface, one owner.** A visible action or authoritative state has one writer.

**Fail open.** Vision, AI, cloud and other optional services degrade to local/manual behavior instead of blocking recording.

**Quiet interfaces.** Repeated use should require less attention, not more.

**Evidence, not creator work.** Photos, video and future Live Photo/Watch evidence are raw material for a personal result; AXIS should not require performance, editing or social-content production.

**Direct language.** Show the fact instead of explaining the interface or speaking like an AI assistant.

See [docs/PRODUCT.md](docs/PRODUCT.md), [docs/AXIS_EVOLUTION_VISION.md](docs/AXIS_EVOLUTION_VISION.md) and [docs/8.13.1_EVOLUTION_FOUNDATION.md](docs/8.13.1_EVOLUTION_FOUNDATION.md).

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

The only release entry point is:

```bash
node build-release.mjs
```

Vercel and EdgeOne build/verify the same canonical artifact. `axis-build.json` records release identity, runtime topology, source SHA, immutable hashes and feature gates.

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
prepare-*.mjs         deterministic build-time migrations/convergence
postbuild-*.mjs       canonical packaging and release assertions
build-release.mjs     only release build entry point
```

Do not infer current product ownership from version-like filenames. Start with [Current release](docs/CURRENT_RELEASE.md), [Architecture](docs/ARCHITECTURE.md) and the [documentation index](docs/README.md).

## Development discipline

A change is complete when the owner is clear, competing behavior is retired, the artifact is deterministic, and the real user path has a regression test.

```bash
node scripts/axis-repository-contract.mjs
node build-release.mjs
```

Normal release flow:

1. branch from the last verified `main`;
2. make one coherent product/engineering change;
3. pass deterministic build and relevant contracts;
4. pass Chromium and iPhone WebKit gates on the same candidate;
5. merge only the verified head;
6. verify Vercel serves the exact merged SHA;
7. mirror and verify the same artifact on EdgeOne.

## Next

8.13.1 deliberately stops at the read-only Evolution foundation. The next product work can make repeated equipment/exercise/activity histories become a distinctive personal Evolution object, then add optional photo/video evidence and Replay without turning AXIS into a dashboard, social feed or creator tool.

## Project status

AXIS is under active development. The repository is public, but no software license has been selected yet; public visibility should not be interpreted as a grant of reuse rights.
