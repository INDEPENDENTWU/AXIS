# AXIS Engineering Handoff

Governed milestone: `AXIS 8.26.5 — Recording Review Geometry Stability`.

## Current release state

AXIS **8.26.5 — Recording Review Geometry Stability** is Production-sealed.

Exact product/runtime authority:

```text
5bf575730c5c8de542c603d40b0f8b780204a342
```

Release PR: **#158**.

Exact Production evidence:

- Vercel deployment `dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn` — READY / Production
- Current Release Gate `37187139856` — success
- Deep Compatibility Gate `37187139889` — success
- Vercel Production Deployment Gate `37187159342` — success
- Vercel Public Production Alias Gate `37187159392` — success
- EdgeOne Production run `37187139894` — exact-prebuilt parity + Chromium/WebKit success
- EdgeOne deployment `dp7q7u41l4c8`
- `axis.juele.fun` Production run `37187139864` — exact parity + Chromium/WebKit success

All 28 post-merge/deployment workflow runs associated with the exact merged SHA completed successfully.

`latestDeploymentIsAuthority` remains false. Governance-only commits after the seal do not replace the product/runtime SHA above.

## Product model to preserve

Reality is authoritative.

- **Object** — reusable practice semantics.
- **Flow** — intended continuity only.
- **Execution** — what is currently happening.
- **Encounter** — immutable actual fact.
- **Evidence** — material anchored to real Encounters.
- **Evolution** — derived reveal over accumulated real history.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

No future runtime work may introduce a second Session, Encounter, Active, recorder or persistence owner merely to make orchestration easier.

## Sealed 8.26.5 behavior

8.26.5 removed the Review-composition race exposed after merged 8.26.4.

The canonical Review shell owns a structural `#v82Estimate` slot before Review becomes interactive. v82 remains the only estimate presentation/action owner and binds to that slot instead of inserting it after the first metric interaction.

Required physical behavior is now sealed:

- estimate row exists before recording controls become interactive;
- first metric edit writes the factual value exactly once;
- `#axisSetControls` keeps DOM identity;
- `#v82Estimate` keeps DOM identity;
- x/y/width/height deltas for both remain within **0.5px**;
- inherited Active Rest behavior remains green;
- no new factual or lifecycle authority was introduced.

AXIS 8.26.2, 8.26.3 and 8.26.4 remain merged-but-unsealed provenance. Their valid behavior may be inherited by 8.26.5, but they are not independent Production seals.

## Governance closeout

The repository must treat the following as one immutable seal snapshot:

- release: **8.26.5**
- exact product/runtime SHA: `5bf575730c5c8de542c603d40b0f8b780204a342`
- release PR: **#158**
- Vercel / Current Release / Deep Compatibility / EdgeOne / custom-domain evidence listed above

The closeout version decision is **8.26.5 → 8.26.5 / confirm / sequence 22 / governance**.

This closeout changes no browser runtime behavior. Its commit SHA is governance provenance only, not a replacement product-runtime authority.

## Next engineering stage — AXIS 8.27 Reality Route

Do not continue the 8.26.x corrective pattern after this closeout.

The next product stage is the first bounded Domain Runtime slice under:

```text
Intent → Execution → Evidence → Evolution
```

### Product problem

Flow already expresses intended order and Encounters already express reality. AXIS still needs a deterministic layer that can answer:

> Given what the user intended, what actually happened, and a temporary real-world constraint, what should the current continuation route be now?

The first supported constraint is **defer the current unavailable item**.

Example:

```text
Intent:
Chest Press → Lat Pulldown → Row → Shoulder Press

Reality:
Chest Press completed
Lat Pulldown unavailable

Projection:
current      Row
next         Shoulder Press
deferred     Lat Pulldown
```

The reusable Flow definition is not reordered or rewritten. Historical Encounters are untouched. The current execution projection changes.

### 8.27 architecture boundary

Introduce a pure platform-neutral continuation module. It must not know about DOM, localStorage, WebKit, Vercel, Swift, network or AI.

Conceptually:

```text
flow intent
+ encounter/execution facts
+ temporary constraints
        ↓
continuation projection
        ↓
current / next / remaining / deferred / reasonCodes
```

The runtime projection is derived state, not a second factual store.

### First user-visible interaction

Expose one restrained action in the established Active/Flow boundary:

```text
稍後
```

That action records only the temporary execution constraint needed to derive the remainder of the current Flow run. It must not mutate the Flow definition or rewrite history.

### Release requirements

8.27 must:

- make a fresh product version decision;
- preserve one factual owner for Session / Encounter / Active / recorder;
- reuse established `axis_v60_state.flowRun` ownership if temporary run state must persist;
- add no `axis_route_*` / new IndexedDB / shadow draft store;
- be deterministic and testable without a browser;
- prove manual deviation and deferral cannot fabricate Encounters;
- preserve ordinary standalone recording;
- pass Chromium + iPhone-like WebKit physical proof;
- merge only on one exact green PR head;
- Production-certify the exact merged SHA through Vercel, EdgeOne and `axis.juele.fun`.

This is the next active product direction.
