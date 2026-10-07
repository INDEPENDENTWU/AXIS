# AXIS Current Work

Governed active milestone: `AXIS 8.27 — Reality Route`.
governed target branch: `main`.

Bounded delivery branch: `governance/827-production-seal` · PR **#161**.
Version decision: **8.27 → 8.27 / confirm / sequence 24 / governance**.
repository governance remains authoritative over conversation history.

Chat history is not authoritative project memory. Conversation history is supplemental only. Repository governance, exact commits, built artifacts, and provider certification are authoritative.

## Production baseline at start of this work

AXIS **8.27 — Reality Route** has already completed its product/runtime release and exact Production certification.

The immutable product/runtime authority for this governance closeout is:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

Release PR: **#160**.

The exact product PR head `f79a25f10ac723ac7f6775a8b5c817b8fd884767` completed **30 / 30** workflow runs successfully before merge. The exact merged-main runtime then completed **29 / 29** merged-main/deployment certification workflow runs successfully.

Certification evidence:

- Current Release Gate `37333415838`
- Deep Compatibility Gate `37333415780`
- Vercel Production Gate `37333475667`
- Public Production Alias Gate `37333475632`
- Vercel deployment `dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm`
- EdgeOne Production run `37333415798`, deployment `dpmrug23mtim`
- `axis.juele.fun` Production run `37333415692`

The protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Active change

This bounded branch is a **governance-only Production seal closeout** for AXIS 8.27. It does not change the certified product/runtime artifact above.

The closeout records 8.27 as Production-sealed, binds provider evidence to the exact runtime SHA, promotes the Reality Route owner from release-candidate to Production-sealed, and makes release-line governance contracts understand both the former 8.27 candidate state and the final sealed state.

The product scope being sealed is Reality Route:

```text
Flow intent
+ actual execution / Encounter evidence
+ temporary FlowRun constraints
        ↓
current / next / remaining / deferred / dropped / reasonCodes
```

The first bounded user capability is **稍后**. A not-yet-started current item may be deferred for the current run. This writes only `temporaryConstraints.deferredStepRefs` inside the existing `axis_v60_state.flowRun` owner.

The reusable `axis.flow.v1` definition remains unchanged. Historical Encounter and `axis.flow-provenance.v1` facts remain unchanged. A manual detour cannot fabricate Flow progression. An already-active item is authoritative and cannot be deferred.

Debt governance completed with 8.27 includes capability-based recorder lifecycle certification, explicit inherited release-identity carry-forward, correct distinction between existing Media IndexedDB ownership and forbidden new route storage, canonical Profile / Goal Session truth on Flow launch, and Reality Route integration inside the established Flow ownership boundary rather than a parallel runtime.

## Validation for this work

The governance closeout is complete only when:

- `governance/version-decision.json` is **8.27 → 8.27 / confirm / sequence 24 / governance**;
- project-state records **Production-certified 8.27** while `productionRuntimeSha` remains exactly `d6044f0b30a92c007dd2fbab5792c2aa62dfd485`;
- `latestDeploymentIsAuthority` remains `false`;
- provider evidence remains bound to the already-certified Vercel, EdgeOne, and `axis.juele.fun` runs above;
- deterministic build preserves the sealed governance state rather than reconstructing the old candidate state;
- historical governance compatibility contracts accept sealed 8.27 without weakening their inherited ownership/truth invariants;
- PR #161 reaches one exact green head and is merged exactly;
- merged `main` continues to identify `d6044f0b30a92c007dd2fbab5792c2aa62dfd485` as the 8.27 product/runtime authority.

No governance-only merge SHA or provider redeploy may supersede that product/runtime authority.

## Cross-platform continuity

Foundation remains `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`.

Portable contracts include `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.reality-route.v1`, `axis.execution-constraints.v1`, and `axis.report-range.v1`.

Reality Route stays platform-neutral and free of DOM, localStorage, WebKit, provider, network, and AI dependencies.

## Next planned stage

Do not reopen 8.27 after this governance seal. The next product stage must begin from `main` with a fresh bounded branch and a fresh version decision.

The natural continuation may broaden temporary Reality Route constraints while preserving immutable intent/history, one factual owner per fact, and the same pure **Intent → Execution → Evidence → Evolution** boundary.
