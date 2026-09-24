# AXIS Engineering Handoff

## Current Production release

AXIS **8.26.2 — Active Rest Selector Binding** is fully Production-sealed.

Exact release identity:

- release PR: **#155**
- completed bounded delivery branch: `fix/8262-active-rest-selector`
- exact product/runtime merge: `7662d857fd5d442e3a7f775a430f0d4d8479bece`
- product version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**
- Production evidence confirmation: **8.26.2 → 8.26.2 / confirm / sequence 19 / governance**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- release graph: **90** top-level steps

Exact Production evidence:

- canonical Vercel deployment `dpl_FM52hUPwo7Nf3CThK2n145QLP3Zq` — READY / Production / exact 8.26.2 product/runtime SHA
- Current Release Gate `35963269939` — Chromium + iPhone-like WebKit success
- Deep Compatibility Gate `35963269792` — Chromium + iPhone-like WebKit + static success
- Vercel Production Deployment Gate `35963296512` — success
- Vercel Public Production Alias Gate `35963296503` — success
- EdgeOne Production run `35963269663` — exact-prebuilt deploy + Vercel parity + Chromium/WebKit success
- governed custom-domain run `35963269856` — exact `axis.juele.fun` parity + Chromium/WebKit success

The product/runtime SHA above remains release authority. Later governance-only commits or provider redeploys are evidence reconciliation only; `latestDeploymentIsAuthority` remains false.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Future work may not migrate, clear, duplicate or rewrite them without an explicit governed migration.

## AXIS 8.26.2 Active Rest Selector Binding

The bounded real-use audit across Active / Flow / Evolution found the concrete defect that defined this release: the 8.26.1 rest-state CSS targeted `.v87-restline`, while the canonical integrated Active Home stage renders the existing v87-owned rest node as `.v87Rest`.

8.26.2 corrects only that binding. During physical proof, the final Active-stage presentation owner was also made to carry the same rest contract so a later equivalent selector cannot override the intended visible state.

### Truth boundary

The existing v87 pause/resume state and timer remain authoritative. Pause starts rest truth; resume clears the active start and accumulates rest time. Set completion does not create a second rest truth.

8.26.2 does not change how sets complete, how Flow advances, how Sessions/Encounters are stored, how recording works, or how media/storage/network/AI are owned.

No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner was introduced.

### Sealed proof

The exact merged runtime passed:

- canonical `.v87Rest` computed presentation in Chromium and iPhone-like WebKit;
- reduced-motion suppression;
- real v87 pause/resume/rest ownership through `axis_v8_meta`;
- no `.v87-restline` DOM dependency;
- Current Release and Deep Compatibility exact-main gates;
- fixed Vercel exact manifest/assets and real Production flow;
- exact-prebuilt EdgeOne parity and Chromium/WebKit Production flow;
- `axis.juele.fun` exact parity and Chromium/WebKit Production flow.

## Inherited behavior

AXIS 8.26.1 remains historical rest-state provenance. AXIS 8.26 remains Production-sealed and authoritative for atomic save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy. AXIS 8.25.1 remains the inherited in-stage set-completion presentation boundary. Replay/Evidence, Flow and Object truth owners remain unchanged.

## Next engineering rule

No 8.27 implementation branch is active. First run one bounded real-use UX audit across **Active, Flow and Evolution** against sealed 8.26.2. Select one concrete high-value user problem, then govern the next product version from that problem.

Do not create a parallel factual owner or architecture branch merely to continue development. Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain outside this completed bounded stage unless separately governed.
