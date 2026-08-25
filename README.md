# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.20.1** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. It records real practice without requiring reality to obey a rigid plan. Objects describe what can be practiced, executable schemas describe what is recorded, Encounters freeze what actually happened, Evidence anchors those facts, and Evolution remains a factual read-only projection.

## Production truth

AXIS 8.20.1 is the current sealed Web Production release.

- exact merged-main SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- Vercel deployment: `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD` — **READY**
- Vercel: <https://axis-five-puce.vercel.app>
- EdgeOne deployment: `dpemq8bxjopa`
- EdgeOne verification run: `32812883590` — **success**
- EdgeOne: <https://axisfitness-mirror-9x91gveo.edgeone.cool>
- architecture: `canonical-single-runtime`
- generated runtime: one `axis-core.js` + one `axis-style.css`
- dynamic historical JavaScript requests: `0`
- Production proof: exact artifact/source parity plus real Chromium and iPhone-like WebKit flows on both release gates/providers.

See [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md) for the sealed record.

## What 8.20.1 seals

- **Universal Practice Objects** with explicit `metricSchema` truth and immutable Encounter schema snapshots.
- **Executable Practice Objects**: explicit Object schema drives the actual recorder instead of coarse `strength/cardio` type guesses.
- **Execution semantics** separated from metric semantics: `single / sets / rounds / timed / hold / complete`.
- **Active lifecycle authority** follows `executionMode`; one-shot Objects do not create false ongoing state, while timed/hold/sets/rounds can use the existing Active owners.
- **Classic strength compatibility** remains v61-owned only for genuine immutable weight+reps Encounter schemas.
- **Visible localization** keeps internal enum IDs internal; Chinese product surfaces do not leak `strength/cardio/relative` as user-facing labels.
- Existing user truth remains in the established stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`.
- Capture, source-first media, Evidence, Evolution, Learning, sound and historical compatibility remain inherited and release-blocking.

## Current engineering state

Active milestone: **AXIS 8.21 — Flow / Session Blueprint**

Branch: `product/821-flow-session-blueprint`

8.21 adds lightweight orchestration over existing truth. A Flow may arrange Objects and temporary step overrides, but **Flow is intent, not history**. The user may skip, insert, reorder or stop; Encounter truth remains authoritative and immutable.

Read [`docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md`](docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md) before changing Flow/session semantics.

A separate, non-blocking interaction research track — [`Active Action Lens`](docs/ACTIVE_ACTION_LENS_EXPERIMENT.md) — explores a larger one-hand Active control layer. It is presentation-only, must delegate to existing completion/pause/session owners, and is not allowed to block or contaminate 8.21.

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
7. tests/contracts and the exact Production manifest before changing ownership or persistence

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
6. a Production release is verified against the exact merged SHA before being declared sealed.

Quick governance check:

```bash
node scripts/axis-repository-contract.mjs
```

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the product sequence.
