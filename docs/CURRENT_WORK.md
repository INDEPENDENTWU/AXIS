# Current Work

## Production baseline at start of this work

AXIS **8.22 — Truthful Evolution Replay** is the last fully Production-sealed Web runtime.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified starting `main`: `cbcecfe9f7bfd18c8f05ced2bd760a60a03b15b5`
- last sealed product/runtime release: **AXIS 8.22**
- runtime seal baseline: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- sealed product PR: **#144**
- architecture: `canonical-single-runtime`
- cross-platform foundation: `axis-native-foundation-0` (`INDEPENDENTWU/AXIS-iOS`)
- shared portable domain contracts: `axis.domain.v1`, `axis.data.v1`
- sealed top-level graph: **85 steps**
- Vercel Production gate `34612916951` — success
- Vercel Public Production Alias Gate `34612916591` — success
- EdgeOne deployment `dpp90dvhamrl`, run `34612882892` — success
- `axis.juele.fun` run `34612882890` — success
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

The provider evidence above is the last sealed 8.22 snapshot. AXIS 8.23 must not be described as Production-sealed before exact merged-main certification. Chat history is not authoritative project memory; repository contracts, exact commits, built artifacts and provider certification are authoritative.

## Active change

**AXIS 8.23 — Replay Evidence Continuity**

- governed milestone: `AXIS 8.23 — Replay Evidence Continuity`
- governed active branch: `main`
- governed target branch: `main`
- bounded delivery branch: `product/823-replay-evidence-continuity`
- pull request: **#146**
- exact base: `cbcecfe9f7bfd18c8f05ced2bd760a60a03b15b5`
- intended user-visible behavior change: **yes**
- version decision: **bump**
- sequence: **7**
- base release: **8.22**
- candidate release: **8.23**
- change class: `product-runtime`
- deterministic graph target: **85 → 86**; the only new top-level build step is the explicit 8.23 postbuild contract

### Product behavior

The live 8.22 implementation lets Replay and Media Evidence maintain separate transient selections. That can leave Replay focused on one Encounter while v815 is showing media from another real date. AXIS 8.23 makes an explicit Replay navigation the transient presentation anchor for existing Media Evidence while preserving inherited mount defaults.

- v822 emits `axis:evolution-replay-selection` with exact transient Encounter identity after an explicit Replay rail / previous / next action.
- v815 remains the Evidence owner and resolves that exact identity.
- selected Encounter with media → show that Encounter's evidence.
- selected Encounter with no media, while the Object has media elsewhere → explicit **“这一次没有留下影像证据”** state; no silent fallback to another date.
- wholly no-media Object → preserve existing data-only/no-capture-pressure state.
- manual Evidence rail inspection remains valid and does not rewrite Replay chronology.
- the next explicit Replay navigation re-anchors Evidence.
- inherited Replay and Evidence initial mount choices remain unchanged until such explicit navigation occurs.

### Ownership boundary

AXIS 8.23 is presentation-only coordination between existing read owners. It may not:

- create Session/Encounter/media writers;
- create another Evidence owner;
- add storage namespaces or databases;
- persist Replay/Evidence cursor state;
- call network APIs or AI;
- rewrite history;
- fabricate progress, score, ranking, prediction or advice.

Existing app/v61/v82/v87, Flow, v814 Evolution Object, v815 Media Evidence and v822 Replay ownership remains intact.

## Durable inherited certification ledger

The active work section above describes only the current bounded 8.23 slice. The following entries are retained as immutable provenance for inherited fail-closed contracts; they are not active branches and do not supersede the current 8.23 base or release authority.

### Cross-platform / native foundation provenance

- `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable domain contract: `axis.domain.v1`
- portable data contract: `axis.data.v1`
- Chat history is not authoritative project memory.

### AXIS 8.21 Flow intent provenance

- bounded delivery branch: `feat/821-flow-step-recording-intent`
- exact certified base main SHA: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded delivery branch: `feat/821-flow-step-execution-intent`
- exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`

### AXIS 8.21 Active Home provenance

- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`

### AXIS 8.21 Report provenance

- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- truth schema inherited by Report UI/PDF/Share Card: `axis.report-range.v1`
- bounded delivery branch: `feat/821-report-pdf-export`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`

## Validation for this work

Merge is blocked until one exact PR head proves all of the following without weakening inherited assertions:

1. `node build-release.mjs` emits public/base release **8.23**, `canonical-single-runtime`, one initial JavaScript request and zero dynamic chunks;
2. AXIS Version Authority proves **8.22 → 8.23 / bump / sequence 7 / product-runtime**;
3. the canonical graph is exactly **86** top-level deterministic steps;
4. source/artifact contracts prove v822 emits exact Encounter identity and v815 alone consumes/renders Evidence;
5. a Replay-selected media Encounter displays that same Encounter's real evidence;
6. a Replay-selected no-media Encounter never displays another Encounter's media and instead shows the explicit factual no-evidence state;
7. wholly no-media Objects preserve the inherited no-pressure data-only behavior;
8. manual Evidence inspection remains independent until the next explicit Replay navigation re-anchors it;
9. `axis_v60_state` and `axis_v8_meta` remain byte-for-byte unchanged during the interaction; no API request occurs;
10. Chromium and iPhone-like WebKit both pass mobile geometry and reduced-motion proof on the same exact PR head;
11. all inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, Object/UPO, Flow, Active, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gates remain green;
12. after merge, the exact merged `main` SHA passes fixed Vercel Production, exact-prebuilt EdgeOne Chromium/WebKit, and `axis.juele.fun` Chromium/WebKit 8.23 proof;
13. combined commit statuses and relevant main-push workflows settle with no unresolved failure before 8.23 is called complete.

Failures are fixed at the actual owner. User data, browser assertions and ownership boundaries may not be weakened merely to make the release pass.

## Next planned stage

Do not start another product, architecture, backup/account, Node/toolchain or native/iOS slice until AXIS 8.23 is Production-certified on the exact merged main artifact.

After that, inspect live behavior again and choose the next bounded product improvement from useful Reveal/Evolution quality, Capture friction or real-world runtime adaptation. Existing portable backup compatibility remains protected; broader account/backup work remains deferred.
