# AXIS Engineering Handoff

Governed release: `AXIS 8.27 — Reality Route`.

## Current release state

AXIS **8.27** is **Production-sealed**.

Exact Product/runtime authority:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

Release PR: **#160**.

The exact PR head `f79a25f10ac723ac7f6775a8b5c817b8fd884767` was 30 / 30 green before merge. Exact merged-main and deployment certification was 29 / 29 green.

Production evidence:

- Vercel deployment `dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm`
- fixed public alias `https://axis-five-puce.vercel.app`
- Vercel Production Gate `37333475667`
- Public Alias Gate `37333475632`
- EdgeOne Production run `37333415798`, deployment `dpmrug23mtim`
- `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- `axis.juele.fun` Production run `37333415692`

Later governance-only commits do not replace the product/runtime seal above.

## Product model to preserve

Reality is authoritative.

- **Object** — reusable practice semantics.
- **Flow** — intended continuity.
- **Execution** — what is currently happening.
- **Encounter** — immutable actual fact.
- **Evidence** — material anchored to real Encounters.
- **Evolution** — derived reveal over accumulated real history.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

No orchestration feature may create a second Session, Encounter, Active, recorder, or persistence owner.

## Reality Route ownership

Pure owner: `lib/axis-reality-route.mjs`.

Portable projection contract: `axis.reality-route.v1`.

Temporary constraint contract: `axis.execution-constraints.v1`.

Reality Route derives current continuation from Flow intent + actual execution facts + temporary constraints.

The 8.27 user operation is **稍后**. A current item may be deferred only before it has entered the existing Active lifecycle. Deferred items return after the immediate route.

Reality Route may derive `current`, `next`, `remaining`, `deferred`, `dropped`, and `reasonCodes`.

It may not mutate saved Flow definitions, rewrite historical Encounters, create `axis_route_*` storage, become a Session/Encounter writer, become a recorder/Active owner, or require network/AI.

Temporary execution constraints persist only inside `axis_v60_state.flowRun.temporaryConstraints`.

## Debt rules established by 8.27

Release-line compatibility should be capability-based where behavior ownership persists across versions. A historical contract must not depend on a version whitelist when the actual invariant can be detected directly.

Build-time compatibility must not silently relabel an existing owner as new ownership. Existing Media IndexedDB is allowed; Reality Route creating a second persistence namespace is not.

New runtime semantics must be compiled into the established Flow ownership boundary. Do not append a shadow runtime with separate lexical ownership.

Flow-created Sessions must continue through the canonical Session truth constructor so Profile / Goal snapshots remain identical to ordinary Sessions.

## Next work

8.27 is closed. Any new product behavior needs a fresh version decision.

The next bounded Reality Route slice may add richer temporary constraints, but the decision function must stay platform-neutral:

```text
events → reducer → state → projection → decisions
```

Do not start a second owner or rewrite history to make the route look clean.
