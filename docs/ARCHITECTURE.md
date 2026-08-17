# Architecture

This document describes the architecture AXIS actually ships today and the direction for removing historical complexity without a rewrite.

## 1. Architectural shape today

AXIS has two different shapes: source shape and production shape.

The source tree contains historical modules, compatibility code and release-specific convergence steps accumulated across the v8 line. Production does not load those releases one after another. `build-release.mjs` compiles them into one canonical browser artifact.

```text
source owners + historical compatibility
                |
                v
       prepare-* convergence
                |
                v
      build / hardening stages
                |
                v
       postbuild-* contracts
                |
                v
        canonical packager
                |
                v
 axis-core.js + axis-style.css + axis-build.json
```

This separation is intentional. It allowed AXIS to retire duplicate runtime owners while preserving user data and useful behavior.

It is also the main source-maintenance debt: the production topology is clean, while the source topology still carries a large amount of historical structure.

## 2. Current layers

### Browser product state

`app.js` remains the base local state owner. The long-lived state key is `axis_v60_state`; workout sessions, active training, profile and preferences are persisted locally. Existing migrations preserve older keys.

High-frequency strength recording is owned by `v61.js`, which uses the base state plus `axis_v8_meta` for set-level metadata. This is a deliberate example of the single-owner rule: new surfaces should call the owner or a narrow bridge instead of scraping DOM text or maintaining a shadow draft.

Media is local-first and uses IndexedDB. Browser limitations are handled as platform limitations rather than hidden server persistence.

### Product capabilities

Historical/current modules supply specialized domains such as active training, custom equipment, catalog/search, watermarking, sound, reports and State Field. Build-time convergence determines which writer survives into the canonical artifact.

The filename is not the authority. The release contract and final artifact are.

### Language Studio

8.12 adds a large local learning corpus and practice system while explicitly remaining outside training ownership. Its release contract forbids a new network dependency, persistent observer owner or autoplay speech owner inside the Language Studio segment.

### Server AI

Browser product code talks to same-origin AXIS endpoints. Provider secrets remain server-side.

The vision route has explicit provider adapters, catalog-bound IDs, response normalization, confidence thresholds, escalation and arbitration. Current providers can include OpenAI, Gemini and Bailian according to server configuration.

AI output is advisory data. It does not become a second workout database.

### Sync foundation

`lib/sync-contract.js` defines provider-neutral sync entities with revision, update time, device ID, tombstones and idempotent request IDs. The cloud model is a mirror/convergence layer, not a tap-by-tap remote database.

This contract is a foundation; it should not be mistaken for a fully deployed cross-device sync product until the corresponding account, persistence and transport layers are production-verified.

### Platform boundary

`window.AXISPlatform` / `window.AXISNative` isolate platform-only abilities such as Photos write, haptics, passkey identity and background upload.

That boundary is useful, but the long-term multi-platform boundary must move deeper than a WebView bridge. Domain decisions should become independent of DOM, browser storage and device APIs.

## 3. Non-negotiable invariants

### Local ownership

Training remains usable without network, account, AI or cloud services.

### Single ownership

No semantic action has two interactive writers. No current training fact has two authoritative stores.

### Deterministic release

The same source candidate must build the same product topology and pass machine-readable contract assertions.

### Transient correctness

A bad intermediate frame is a defect. “It becomes correct after a timeout” is not an acceptable architecture.

### Compatibility

Workout history is user data. Source cleanup may not invalidate existing LocalStorage/IndexedDB state without an explicit, tested migration.

### Cross-engine behavior

Chromium success is insufficient. iPhone-like WebKit remains a release gate for critical paths.

## 4. Current strengths

The current architecture has several properties worth preserving:

- one canonical production runtime rather than staged historical chunks;
- explicit surface ownership and retirement rules;
- local-first workout state;
- exact release manifests and production-SHA verification;
- real-browser regression tests;
- optional/fail-open AI;
- provider-neutral sync and platform contracts;
- small user-facing surface relative to internal capability.

These are stronger foundations than a framework rewrite would provide by itself.

## 5. Current debt

The largest risks are structural, not visual:

1. **Source history is still executable build input.** Many `prepare-*` scripts mutate exact historical signatures. This is safe only while heavily tested and becomes harder to reason about as the chain grows.
2. **Release truth is distributed.** Checked-in compatibility inputs, generated release identity, stale documentation and historical filenames make the repository harder to understand than the final product.
3. **Domain logic is still browser-shaped.** Important decisions live near DOM/localStorage concerns, which limits clean native reuse.
4. **Server surfaces are duplicated.** `api/` and `cloud-functions/api/` need a single source implementation plus thin deployment adapters to prevent drift.
5. **Developer reproducibility is implicit.** The repository has strong CI but no conventional package manifest/lockfile at the root; tool versions are partly embedded in workflows.
6. **Some operational controls are baseline, not final.** For example, per-instance in-memory API rate limiting is not a distributed abuse-control system.

None of these require a big-bang rewrite.

## 6. Target architecture

The end state is a platform-neutral core surrounded by adapters.

```text
                    +------------------+
                    |  product shells  |
                    | web / iOS / ...  |
                    +---------+--------+
                              |
                              v
+-------------------------------------------------------+
|                  AXIS domain runtime                  |
|                                                       |
| events -> reducer -> state -> projection -> decisions |
|          deterministic / UI independent              |
+-------------------+-------------------+---------------+
                    |                   |
          +---------+------+   +--------+---------+
          | storage / sync |   | AI / media / OS  |
          |     ports      |   |      ports       |
          +---------+------+   +--------+---------+
                    |                   |
             browser/native       server/adapters
```

The pure core should not know about DOM, WebKit, localStorage, Vercel, model providers or Swift.

A minimal runtime interface can eventually look like:

```js
nextState = reduce(state, event)
projection = project(nextState, context)
```

The projection may expose:

```js
{
  current,
  next,
  alternatives,
  remaining,
  dropped,
  constraints,
  reasonCodes
}
```

`reasonCodes` are primarily for tests, diagnostics and reproducibility. They are not a requirement to explain every decision in the UI.

## 7. Migration strategy

Do not replace the current product state in one release.

### Phase A — extract

Create a pure runtime module with deterministic fixtures. It reads normalized current state and produces projections but writes nothing.

### Phase B — shadow

Run the new runtime beside the current production owner in tests and, where safe, locally in the product. Compare outputs without changing workout data.

### Phase C — narrow ownership

Move only continuation and remaining-route decisions first. Recording, media and history keep their existing owners.

### Phase D — event journal

Introduce an append-only domain event journal for new runtime actions and adapters that can reconstruct equivalent state. Keep compatibility snapshots until replay is proven.

### Phase E — retire compatibility transforms

Once a historical owner no longer contributes runtime behavior and migrations are proven, delete the source and remove the corresponding compiler rewrite. The build chain should get shorter over time.

The direction is therefore **strangler migration**, not rewrite.

## 8. Multi-platform rule

Future platforms should reuse domain contracts, not copy UI code and not fork product truth.

Recommended boundaries:

- **Web/PWA:** DOM rendering, browser media, IndexedDB/localStorage adapter.
- **iOS:** native camera/Photos/haptics/background tasks as adapters; domain runtime shared or called through a narrow bridge.
- **Android:** equivalent platform adapters; same event/state contracts.
- **Desktop:** only if a real use case exists; reuse the same data/runtime contracts.
- **Server:** account, sync, AI and durable remote storage. Never the live workout owner.

The first cross-platform milestone is not “build four apps.” It is making the core testable without a browser.

## 9. Security boundaries

- Provider API keys and admin credentials stay server-side.
- User media is private by default and should never require a public object bucket.
- AI inputs are capability-scoped; unrelated workout history should not be sent simply because it exists.
- Sync writes are bounded and idempotent; delete semantics use tombstones.
- Production deployments must be bound to an exact source SHA and verified artifact.
- Distributed endpoints should eventually use durable rate/abuse controls rather than process-local memory alone.

## 10. Definition of architectural improvement

A future release is structurally better when at least one of these moves in the right direction without regressing user behavior:

- fewer authoritative owners;
- fewer build-time historical rewrites;
- shorter path from source truth to final artifact;
- more pure domain logic covered without a browser;
- fewer user interactions for the same recorded workout;
- stronger deterministic replay/restore;
- cleaner portability through explicit ports;
- smaller blast radius when AI, cloud or a provider is unavailable.

Framework novelty is not an architectural metric.
