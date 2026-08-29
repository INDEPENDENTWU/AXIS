# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.21** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. It records real practice without requiring reality to obey a rigid plan. Objects describe what can be practiced, executable schemas describe what is recorded, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution remains a factual read-only projection.

## Production truth

AXIS **8.21** is the current sealed Web product/runtime release.

- release PR: **#108**
- sealed runtime baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- Vercel seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX` — **READY**
- Vercel Production gate: `33278987731` — **success**
- Vercel: <https://axis-five-puce.vercel.app>
- EdgeOne seal deployment: `dpysj966i0hh`
- EdgeOne verification run: `33278965885` — **success**
- EdgeOne: <https://axisfitness-mirror-9x91gveo.edgeone.cool>
- architecture: `canonical-single-runtime`
- deterministic release: **89 top-level build steps**
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**
- Production proof: exact artifact/source parity plus real Chromium and iPhone-like WebKit product/Flow verification
- post-seal Vercel runtime error query: **no runtime errors found**

The SHA and provider IDs above are the **8.21 runtime seal evidence snapshot**. They are not a claim that every later governance-only deployment must preserve the same Git source SHA; provider gates verify current deployment truth independently.

See [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md) for the sealed record.

## What 8.21 seals

- **Universal + Executable Practice Objects** with explicit `metricSchema`, independent execution semantics and immutable Encounter schema/execution snapshots.
- **Whole-item Flow**: one complete Object is the Flow completion unit; set-level Flow completion authority is retired.
- **Direct Flow execution**: `开始此项` starts through the existing v82/v87 Active lifecycle instead of opening Quick Record configuration.
- **Native Active coordination**: Flow pause/resume/hold-finish delegates to the established Active owners; no second Active owner exists.
- **Detour isolation**: explicit temporary/detour records use canonical Quick Record and never consume or advance the current Flow item.
- **One-shot compatibility**: ordinary `single/complete` Objects remain one-shot outside Flow; only a proven immutable Flow whole-item may reuse the existing Active lifecycle.
- **Source-owned localized saved metadata**: user-facing Quick Record saved-item metadata does not expose raw internal `strength/cardio/...` enum IDs.
- **Metric control convergence**: quantity/time/pace/scale/choice controls share the established recorder/value owners.
- **Strict geometry**: applicable value + unit optical-center error remains physically asserted at **≤ 0.5 CSS px**, with symmetric/full-width preset rails.
- **Classic strength compatibility** remains v61-owned only for genuine immutable weight+reps Encounter schemas.
- Existing user truth remains in the established stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`.
- Capture, source-first media, Evidence, Evolution, Learning, sound and historical compatibility remain inherited and release-blocking.

## Current engineering state

Active milestone: **AXIS 8.21 — Post-release Architecture Governance**

Governed active branch: `main`

The public product is sealed at 8.21. Current work is architecture/governance only and must not alter user-visible behavior, factual ownership or persistence semantics.

The next architecture slice audits the **89 deterministic release steps** and moves behavioral `prepare-*` / `postbuild-*` mutation into explicit source owners incrementally. A separate infrastructure-only task will first converge the Node toolchain to a supported Node 20.19+ baseline because current EdgeOne CLI dependencies have moved beyond the repository's historical 20.18.0 pin.

Read [`docs/CURRENT_WORK.md`](docs/CURRENT_WORK.md) before making changes and [`docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md`](docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md) before changing Flow/session semantics.

A separate, non-blocking interaction research track — [`Active Action Lens`](docs/ACTIVE_ACTION_LENS_EXPERIMENT.md) — remains presentation-only, must delegate to existing completion/pause/session owners, and is not allowed to create a second training or persistence owner.

## Product rules

**Reality is authoritative.** A real workout/practice is valid even when it changes, ends early or differs from an intended Flow.

**Local first.** Core practice remains usable without an account, network or model call.

**One action, one writer.** A semantic action or factual training field has one authoritative writer. Delegating presentation is not ownership.

**Intent is not history.** A Flow can suggest sequence; only saved Encounters become historical truth.

**Evidence before interpretation.** AXIS may reveal recorded change, but does not present synthetic progress scores as fact.

**Quiet interfaces.** Better intelligence should remove questions and taps rather than add AI copy or setup burden.

**Fail open.** Optional cloud/AI capabilities degrade to local/manual behavior rather than blocking recording.

## Authoritative project memory

Future developers/agents should read, in order:

1. [`governance/project-state.json`](governance/project-state.json)
2. [`docs/HANDOFF.md`](docs/HANDOFF.md)
3. [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md)
4. [`docs/CURRENT_WORK.md`](docs/CURRENT_WORK.md)
5. current milestone architecture/contract docs
6. [`governance/owners.json`](governance/owners.json) and [`governance/retirements.json`](governance/retirements.json)
7. tests/contracts and exact Production evidence before changing ownership or persistence

**Chat history is supplementary context, not authoritative project memory.** If chat and Git/Production disagree, verify reality and repair GitHub truth.

## Production architecture

```text
current source + required compatibility source
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

Release build:

```bash
node build-release.mjs
```

Vercel builds `main`. EdgeOne publishes the already-verified prebuilt artifact rather than reinterpreting product source. Critical release paths are verified in Chromium and iPhone-like WebKit.

## Repository map

```text
governance/           machine-readable current project/owner/retirement truth
docs/                 product, architecture, handoff, release and milestone contracts
runtime/              extracted runtime/domain foundation and browser adapters
shared/contracts/     durable cross-platform contracts and schemas
api/                  same-origin server endpoints
cloud-functions/      alternate serverless adapter surface
compiler/             explicit build-time source fragments
lib/                  reusable contracts and current libraries
data/                 curated local data
scripts/              diagnostics, smoke and release verification
.github/workflows/    CI and Production gates
```

Historical `v8xx` and release-transform filenames are provenance/compatibility inputs, not proof of current ownership.

## Development discipline

A change is complete only when:

1. the intended semantic owner is explicit;
2. competing ownership is absent or retired;
3. historical data remains readable;
4. the deterministic artifact is valid;
5. affected real user paths pass Chromium and WebKit on the same exact candidate;
6. a Production release is verified against the exact merged SHA before being declared sealed;
7. governance records the durable runtime seal baseline without pretending a repository document can be self-referentially equal to every later provider deployment.

Quick governance checks:

```bash
node scripts/axis-repository-contract.mjs
node scripts/axis-production-governance-contract.mjs
```

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the product sequence.
