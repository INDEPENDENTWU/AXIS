# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.22** · **Production-certified** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. It records real practice without requiring reality to obey a rigid plan. Objects describe what can be practiced, executable schemas describe what is recorded, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution remains a factual read-only projection.

## Release truth

AXIS **8.22 — Truthful Evolution Replay** is the current Production-sealed product/runtime release.

- release PR: **#144**
- exact Production runtime seal SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- Vercel Production gate: `34612916951` — **success**
- Vercel Public Production Alias Gate: `34612916591` — **success**
- Vercel: <https://axis-five-puce.vercel.app>
- EdgeOne deployment: `dpp90dvhamrl`
- EdgeOne verification run: `34612882892` — **success**
- EdgeOne: <https://axisfitness-mirror-9x91gveo.edgeone.cool>
- custom-domain verification run: `34612882890` — **success**
- custom domain: <https://axis.juele.fun>
- final commit status: **Vercel success + EdgeOne Production success**
- architecture: `canonical-single-runtime`
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

The current bounded work is governance-only reconciliation of that already-certified evidence. It keeps public release 8.22 and the exact runtime seal above unchanged.

See [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md) for the exact certification record.

## What 8.22 adds

- **Truthful Evolution Replay** projects one Object's real Encounters in deterministic `time → sessionStart → eventId` order.
- Replay is **derived and read-only**. It creates no Session, Encounter, media, database, storage namespace, network, AI or scoring owner.
- A one-Encounter Object explicitly says there is only one real record and **does not fabricate before/after change**.
- Multi-Encounter Objects can move through the actual chronology with factual time, saved summary and Evidence count.
- Replay stays inside the existing Evolution Object surface. Selection is transient and never persisted as historical truth.
- Existing 8.14 Evolution Object and 8.15 Media Evidence ownership remain intact.
- Chromium and iPhone-like WebKit both passed on the exact product release and on the governed Production surfaces.

## Inherited 8.21 foundation

- **Universal + Executable Practice Objects** with explicit `metricSchema`, independent execution semantics and immutable Encounter schema/execution snapshots.
- **Whole-item Flow**: one complete Object is the Flow completion unit; set-level Flow completion authority is retired.
- **Direct Flow execution** through the existing v82/v87 Active lifecycle; detours remain canonical Quick Record and do not consume the current Flow item.
- **One-shot compatibility**: ordinary `single/complete` Objects remain one-shot outside Flow.
- **Metric-control convergence** with strict applicable optical-center error of **≤ 0.5 CSS px**.
- Existing user truth remains in `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Current engineering state

Active milestone: **AXIS 8.22 — Production Evidence Reconciliation**

Governed target branch: `main`

Bounded delivery branch: `gov/822-production-evidence-reconciliation`.

The governance decision is **8.22 → 8.22 / confirm / sequence 6 / governance**. It records the exact 8.22 Production seal without changing runtime behavior, storage, UI, user data or release identity.

Read [`docs/CURRENT_WORK.md`](docs/CURRENT_WORK.md) before making changes and [`docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md`](docs/AXIS_821_FLOW_SESSION_BLUEPRINT.md) before changing inherited Flow/session semantics.

Backup/account expansion remains intentionally deferred until further product/runtime/UI refinement has stabilized the product shape.

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
2. [`governance/version-decision.json`](governance/version-decision.json)
3. [`docs/HANDOFF.md`](docs/HANDOFF.md)
4. [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md)
5. [`docs/CURRENT_WORK.md`](docs/CURRENT_WORK.md)
6. current milestone architecture/contract docs
7. [`governance/owners.json`](governance/owners.json) and [`governance/retirements.json`](governance/retirements.json)
8. tests/contracts and exact Production evidence before changing ownership or persistence

**Chat history is supplementary context, not authoritative project memory.** If chat and Git/Production disagree, verify reality and repair GitHub truth.

## Production architecture

```text
current source + required compatibility source
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
7. governance records distinguish product/runtime authority from deployment evidence and from later governance-only bookkeeping.

Quick governance checks:

```bash
node scripts/axis-repository-contract.mjs
node scripts/axis-production-governance-contract.mjs
```

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the product sequence.
