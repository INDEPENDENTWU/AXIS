# AXIS

Local-first training software built around what actually happened.

**Current release: 8.16** · [Open AXIS](https://axis-five-puce.vercel.app) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md) · [Current release](docs/CURRENT_RELEASE.md) · [Documentation](docs/README.md)

AXIS records a workout without requiring the workout to behave like a project plan. Training state, sets, equipment memory, media and history remain useful locally; network and AI capabilities are optional additions rather than prerequisites.

The product grew through many releases, but Production is deliberately flattened into one canonical browser runtime. Historical `v8xx` modules remain source and compatibility inputs; they are not separate product layers downloaded at runtime.

## What is in 8.16

- Strength and cardio recording with set-level weight/repetition state, direct editing and previous-value reuse.
- Active training state with pause/resume, countdowns, reminders and concise completion behavior.
- Equipment and exercise memory, custom equipment, search and local visual recognition.
- One canonical Capture Field for deliberate evidence: repeated photo capture/import up to 12 photos per Encounter, real-photo cover reorder, short scan sampling and one explicit silent video capped at 60 seconds.
- Existing local media ownership remains authoritative through `axis_v42_media`, `frameRefs[]` and `clipRef`; 8.16 adds no second recorder, database or upload requirement.
- Evolution Objects and in-place Media Evidence built from sealed real Encounters rather than synthetic progress scores.
- Comparative Evidence for any two real photo-bearing Encounters, with factual endpoint/recent/adjacent presets and no autoplay, score or AI verdict.
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

## Development

```bash
node build-release.mjs
```

The deterministic build compiles the historical source graph into the canonical release artifact and runs the current/inherited release contracts. Generated runtime artifacts such as `axis-core.js`, `axis-style.css` and `axis-build.json` are build outputs and are intentionally not committed.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/ENGINEERING_PLAYBOOK.md](docs/ENGINEERING_PLAYBOOK.md) before changing a runtime owner or release contract.
