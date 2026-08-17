# AXIS

Local-first training software built around what actually happened.

**Current release: 8.12** · [Open AXIS](https://axis-five-puce.vercel.app) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md) · [Current release](docs/CURRENT_RELEASE.md) · [Roadmap](docs/ROADMAP.md)

AXIS records a workout without requiring the workout to behave like a project plan. Training state, sets, equipment memory, media and history remain useful locally; network and AI capabilities are optional additions rather than prerequisites.

The current product grew through many releases, but production is deliberately flattened into one canonical browser runtime. Historical `v8xx` modules remain source and compatibility inputs; they are not separate product layers downloaded at runtime.

## What is in 8.12

- Strength and cardio recording with set-level weight/repetition state, direct editing and previous-value reuse.
- Active training state with pause/resume, countdowns, reminders and concise completion behavior.
- Equipment and exercise memory, custom equipment, search and local visual recognition.
- Photo/video capture, timestamp sealing, configurable watermarking and local media storage.
- History, reports and State Field signals derived from recorded behavior rather than a synthetic fitness score.
- Optional owner-managed AI services for recognition and insight. Provider secrets stay server-side and model failure never blocks recording.
- Optional cloud/sync foundation based on local ownership, revisioned entities, idempotent requests and deterministic conflict handling.
- Language Studio as an isolated rest/learning channel: 25,716 available units across English, Japanese, Korean and Chinese, with 4/8/12-turn dialogue and no training ownership.
- Chromium and iPhone-like WebKit regression gates, plus exact-production-SHA verification.

## Product rules

AXIS is intentionally strict about a few things:

**Reality is authoritative.** A real workout is valid even when it changes, ends early or differs from a suggestion.

**Local first.** Core training must work without an account, network or model call.

**One surface, one owner.** A visible action or piece of authoritative state has one writer. Replacing an owner includes retiring the previous writer.

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

The release entry point is:

```bash
node build-release.mjs
```

Provider configuration does not duplicate the build sequence. The build emits `axis-build.json`, which is used by CI and production verification to assert release identity, runtime topology and feature contracts.

The CI baseline is Node 20. Browser release gates exercise both Chromium and WebKit.

## Repository map

```text
api/                 same-origin server endpoints
cloud-functions/     alternate serverless adapter surface
compiler/            build-time source fragments
lib/                 reusable contracts and current libraries
data/                 curated local data
scripts/              smoke, browser and contract verification
docs/                 product, architecture and release contracts
.github/workflows/    CI and production gates

app.js, v*.js         historical/current source owners used by convergence
prepare-*.mjs         exact build-time migrations and ownership convergence
postbuild-*.mjs       canonical packaging and release assertions
build-release.mjs     only release build entry point
```

Do not infer product ownership from version-like filenames. Start with [docs/CURRENT_RELEASE.md](docs/CURRENT_RELEASE.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Development discipline

A change is complete when the intended owner is clear, competing behavior is retired, the final artifact is deterministic, and the affected real user path is covered by a regression test.

The normal release path is:

1. branch from the last verified `main`;
2. make one coherent product or engineering change;
3. run the deterministic build and relevant local checks;
4. pass Chromium and WebKit gates on the same candidate;
5. merge only the verified head;
6. verify that Production serves the exact merged source SHA.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ENGINEERING_PLAYBOOK.md](docs/ENGINEERING_PLAYBOOK.md).

## Next

8.13 is planned as **Runtime**, not as another feature expansion. The work starts with a deterministic, UI-independent training runtime in shadow mode, then migrates ownership gradually. The first targets are continuation, live route changes, reality actions, time budget and lower interaction cost over repeated use.

The migration is intentionally incremental; 8.12 remains the compatibility baseline while new runtime ownership proves itself through tests.

See [docs/ROADMAP.md](docs/ROADMAP.md).

## Project status

AXIS is under active development. The repository is public, but no software license has been selected yet; public visibility should not be interpreted as a grant of reuse rights.
