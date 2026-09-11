# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.22** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. It records real practice without requiring reality to obey a rigid plan. Objects describe what can be practiced, executable schemas describe what is recorded, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution remains a factual read-only projection.

## Release truth

AXIS **8.22 — Truthful Evolution Replay** is the current release candidate. It is **not yet declared Production-sealed**.

The last fully sealed product/runtime remains AXIS **8.21**:

- sealed release PR: **#108**
- sealed runtime baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- Vercel seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX` — **READY**
- Vercel Production gate: `33278987731` — **success**
- Vercel: <https://axis-five-puce.vercel.app>
- EdgeOne seal deployment: `dpysj966i0hh`
- EdgeOne verification run: `33278965885` — **success**
- EdgeOne: <https://axisfitness-mirror-9x91gveo.edgeone.cool>
- architecture: `canonical-single-runtime`
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

Those provider IDs are the **8.21 runtime seal evidence snapshot**. They are deliberately not relabeled as 8.22 evidence. AXIS 8.22 becomes the new sealed runtime baseline only after the exact merged `main` SHA passes fixed Vercel Production, exact-prebuilt EdgeOne Production, and `axis.juele.fun` certification.

See [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md) for the exact candidate/seal distinction.

## What 8.22 adds

- **Truthful Evolution Replay** projects one Object's real Encounters in deterministic `time → sessionStart → eventId` order.
- Replay is **derived and read-only**. It creates no Session, Encounter, media, database, storage namespace, network, AI or scoring owner.
- A one-Encounter Object explicitly says there is only one real record and **does not fabricate before/after change**.
- Multi-Encounter Objects can move through the actual chronology with factual time, saved summary and Evidence count.
- Replay stays inside the existing Evolution Object surface. Selection is transient and never persisted as historical truth.
- Existing 8.14 Evolution Object and 8.15 Media Evidence ownership remain intact.
- Chromium and iPhone-like WebKit are both release-blocking; the same Replay proof is also required on EdgeOne and `axis.juele.fun` after merge.

## Inherited 8.21 foundation

- **Universal + Executable Practice Objects** with explicit `metricSchema`, independent execution semantics and immutable Encounter schema/execution snapshots.
- **Whole-item Flow**: one complete Object is the Flow completion unit; set-level Flow completion authority is retired.
- **Direct Flow execution** through the existing v82/v87 Active lifecycle; detours remain canonical Quick Record and do not consume the current Flow item.
- **One-shot compatibility**: ordinary `single/complete` Objects remain one-shot outside Flow.
- **Metric-control convergence** with strict applicable optical-center error of **≤ 0.5 CSS px**.
- Existing user truth remains in `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Current engineering state

Active milestone: **AXIS 8.22 — Truthful Evolution Replay**

Governed target branch: `main`

Bounded delivery branch: `product/822-truthful-evolution-replay` · PR **#144**.

The release decision is **8.21 → 8.22 / bump / sequence 5 / product-runtime**. This is a real user-visible product stage, not another source-convergence slice disguised as 8.21.

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
7. governance distinguishes a release candidate from the last sealed provider evidence instead of pretending a candidate is already Production.

Quick governance checks:

```bash
node scripts/axis-repository-contract.mjs
node scripts/axis-production-governance-contract.mjs
```

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the product sequence.
