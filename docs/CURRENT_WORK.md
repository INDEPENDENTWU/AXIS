# Current Work

## Production baseline at start of this work

AXIS **8.22 — Truthful Evolution Replay** is Production-certified. This bounded governance reconciliation starts only from the exact merged and fully certified product/runtime seal:

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified starting `main`: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- current Production-sealed product/runtime release: **AXIS 8.22**
- governed durable product/runtime seal baseline: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- last sealed runtime SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- sealed release PR: **#144**
- architecture: `canonical-single-runtime`
- deterministic top-level graph: **85 steps**
- fixed Vercel Production: `https://axis-five-puce.vercel.app`
- exact-prebuilt EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- authoritative stores preserved: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`
- existing Session/Encounter writer: canonical app owner
- existing Active owner: v82/v87 lifecycle; no new Active owner is permitted
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`, `axis.backup.v1`; user-facing backup transport may emit `axis.backup.v2` while retaining v1 import/API compatibility

Exact Production evidence for `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631` is already complete: Vercel Production gate `34612916951`, Public Production Alias Gate `34612916591`, EdgeOne deployment `dpp90dvhamrl` / verification run `34612882892`, and `axis.juele.fun` verification run `34612882890` all succeeded. Final combined commit status is Vercel success + EdgeOne Production success.

This work is deliberately narrow: reconcile durable governance records to that already-certified runtime. It must not change application behavior, build output, storage ownership, user data or deployment topology.

### Inherited continuity references

These entries are historical provenance and compatibility references, not competing Production baselines or active branches. Existing release contracts intentionally use several of these exact identities to prove that later work has not erased earlier certified ownership, browser evidence or source handoffs.

- historical AXIS 8.21 product/runtime seal: `8f1f1331e751a7868d390f986d77d5779732ad51`
- historical contract continuity — governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- bounded delivery branch: `feat/821-flow-step-recording-intent`
- exact certified historical Flow recording base: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded delivery branch: `feat/821-flow-step-execution-intent`
- exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`
- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- completed Active Home visual convergence branch: `feat/821-active-home-visual-convergence`
- Active Home visual convergence certified main: `9eaf90d0f94023218feb452b085da48c9f027276`
- completed portable backup/origin migration branch: `feat/821-portable-backup-origin-migration`
- portable backup/origin migration historical base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- portable backup/origin migration continuity: `b349c8b87a0e9b30916ba9959297897260de3882`
- completed Active Home source-convergence branch: `arch/821-active-home-source-convergence`
- completed Active Home source-convergence PR: **#131**
- Active Home source-convergence certified main: `3877d91`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- completed Flow Active boot source-convergence branch: `arch/821-flow-active-boot-source-convergence`
- completed Flow Active boot source-convergence PR: **#134**
- Flow Active boot source-convergence certified main: `1ed1b53`
- portable-backup/cold-start certified main after PR #136: `72503cd9b3f49cdbeb797ec14343791a5a482815`
- Learning Budget source-convergence PR #137: `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`
- Learning Settings Entry source-convergence PR #138: `f1a5dbfb593429859a83fee783610f29396762e9`
- Explicit Version Decision Contract PR #139: `bb28d8b8419a6e05c7eb087fe41ac1246272260f`
- Watermark Brand source-convergence PR #141: `3972850bd0fc27779e1f2da223e8c463b1541ea0`
- Watermark Four-Switch source-convergence PR #142: `76e6720118f04fb10c11649692d70d862f58246b`
- 8.8.4 Runtime Follow-up source-convergence PR #143 exact certified main: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`
- AXIS 8.22 Truthful Evolution Replay PR #144 exact Production runtime seal: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`

The inherited release gates, browser evidence, portable-backup transport, source-owner retirements and factual ownership boundaries remain release-blocking continuity. Historical branch names above are retained only so fail-closed contracts can verify provenance; they do not become current delivery branches or runtime owners.

## Active change

**AXIS 8.22 — Production Evidence Reconciliation**

- governed milestone: `AXIS 8.22 — Production Evidence Reconciliation`
- governed active branch: `main`
- governed target branch: `main`
- bounded delivery branch: `gov/822-production-evidence-reconciliation`
- pull request: **#145**
- exact base: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- intended user-visible behavior change: **no**
- version decision: **confirm**
- version decision sequence: **6**
- base release: **8.22**
- release: **8.22**
- change class: `governance`
- deterministic top-level graph: **85 → 85**

### Scope

This stage replaces stale candidate-era governance bookkeeping with the exact Production seal already proven for AXIS 8.22.

It records:

- sealed runtime SHA `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631` and PR #144;
- Vercel fixed Production proof from runs `34612916951` and `34612916591`;
- EdgeOne exact-prebuilt deployment `dpp90dvhamrl`, run `34612882892`, verification artifact `10269466752` and its recorded SHA-256;
- custom-domain exact parity / Chromium / iPhone WebKit proof from run `34612882890`;
- final combined commit statuses: Vercel success + EdgeOne Production success;
- Replay owner state as derived read-only and Production-sealed.

The Vercel provider deployment ID is deliberately not fabricated. The repository records the exact retained certification target URL, source SHA, fixed Production URL and successful Production gates instead.

### Non-scope

This stage may not:

- modify `app.js`, runtime feature code, Replay behavior, Flow, Active, recording, Reports, Capture or media behavior;
- add/remove a storage namespace or migrate/delete/copy real user data;
- alter `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak` or `axis_v42_media` ownership;
- change the public release away from 8.22;
- change the 85-step deterministic build graph;
- mix the Node/toolchain migration, native/iOS work, broader backup/account design or another source-convergence slice.

## Validation for this work

Merge is blocked until one exact PR head proves all of the following without weakening inherited assertions:

1. `node build-release.mjs` still emits public/base release **8.22**, architecture `canonical-single-runtime`, the same 85-step graph, one initial JavaScript request and zero dynamic JavaScript chunks;
2. AXIS Version Authority proves `8.22 → 8.22`, `decision=confirm`, `sequence=6`, `change_class=governance`;
3. repository and Production-governance contracts distinguish the already-certified 8.22 runtime seal from this later governance-only commit;
4. exact provider evidence in governance matches the certified runtime SHA and successful Vercel / EdgeOne / custom-domain runs;
5. Replay remains derived read-only with no storage/network/AI/Session/Encounter/media authority;
6. every inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, UPO/Object, Flow, Active Home, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gate remains green;
7. Chromium and iPhone-like WebKit continue to pass the unchanged 8.22 current-release product proof;
8. no real user data is migrated, cleared, copied or rewritten;
9. after merge, the exact governance merged `main` SHA passes the normal Vercel → exact-prebuilt EdgeOne → `axis.juele.fun` deployment/certification chain without changing the governed product/runtime seal identity;
10. final combined statuses and main-push workflows settle without unresolved failure before this reconciliation is closed.

Failures are fixed at the actual contract/source owner. Product assertions, data-safety boundaries and deployment identity checks may not be weakened merely to make the governance stage pass.

## Next planned stage

After this single governance reconciliation is Production-certified, stop governance cleanup and return to a real bounded product evolution stage.

The next product slice should be selected from the existing durable backlog by inspecting current source/runtime behavior first. Priority remains useful Reveal/Evolution quality, Capture friction and real-world runtime adaptation. A likely direction is an evidence-backed Reveal refinement that makes accumulated factual change more useful without inventing scores or advice, but the exact 8.23 scope must be chosen from the live implementation rather than from a stale design document.

Backup/account expansion remains intentionally deferred. Existing portable backup compatibility remains protected.

Chat history is not authoritative project memory. It is supplementary context only. Repository governance, exact source, deterministic build output and exact Production evidence are authoritative.
