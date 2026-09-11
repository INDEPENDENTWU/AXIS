# Current Work

## Production baseline at start of this work

AXIS **8.22 — Truthful Evolution Replay** is the last fully Production-sealed Web runtime.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified starting `main`: `cbcecfe9f7bfd18c8f05ced2bd760a60a03b15b5`
- last sealed product/runtime release: **AXIS 8.22**
- runtime seal baseline: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- sealed product PR: **#144**
- architecture: `canonical-single-runtime`
- sealed top-level graph: **85 steps**
- Vercel Production gate `34612916951` — success
- Vercel Public Production Alias Gate `34612916591` — success
- EdgeOne deployment `dpp90dvhamrl`, run `34612882892` — success
- `axis.juele.fun` run `34612882890` — success
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

The provider evidence above is the last sealed 8.22 snapshot. AXIS 8.23 must not be described as Production-sealed before exact merged-main certification.

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

The live 8.22 implementation lets Replay and Media Evidence maintain separate transient selections. That can leave Replay focused on one Encounter while v815 is showing media from another real date. AXIS 8.23 makes Replay selection the presentation anchor for existing Media Evidence.

- v822 emits `axis:evolution-replay-selection` with exact transient Encounter identity.
- v815 remains the Evidence owner and resolves that exact identity.
- selected Encounter with media → show that Encounter's evidence.
- selected Encounter with no media, while the Object has media elsewhere → explicit **“这一次没有留下影像证据”** state; no silent fallback to another date.
- wholly no-media Object → preserve existing data-only/no-capture-pressure state.
- manual Evidence rail inspection remains valid and does not rewrite Replay chronology.
- the next Replay selection re-anchors Evidence.

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

## Validation for this work

Merge is blocked until one exact PR head proves all of the following without weakening inherited assertions:

1. `node build-release.mjs` emits public/base release **8.23**, `canonical-single-runtime`, one initial JavaScript request and zero dynamic chunks;
2. AXIS Version Authority proves **8.22 → 8.23 / bump / sequence 7 / product-runtime**;
3. the canonical graph is exactly **86** top-level deterministic steps;
4. source/artifact contracts prove v822 emits exact Encounter identity and v815 alone consumes/renders Evidence;
5. a Replay-selected media Encounter displays that same Encounter's real evidence;
6. a Replay-selected no-media Encounter never displays another Encounter's media and instead shows the explicit factual no-evidence state;
7. wholly no-media Objects preserve the inherited no-pressure data-only behavior;
8. manual Evidence inspection remains independent until the next Replay selection re-anchors it;
9. `axis_v60_state` and `axis_v8_meta` remain byte-for-byte unchanged during the interaction; no API request occurs;
10. Chromium and iPhone-like WebKit both pass mobile geometry and reduced-motion proof on the same exact PR head;
11. all inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, Object/UPO, Flow, Active, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gates remain green;
12. after merge, the exact merged `main` SHA passes fixed Vercel Production, exact-prebuilt EdgeOne Chromium/WebKit, and `axis.juele.fun` Chromium/WebKit 8.23 proof;
13. combined commit statuses and relevant main-push workflows settle with no unresolved failure before 8.23 is called complete.

Failures are fixed at the actual owner. User data, browser assertions and ownership boundaries may not be weakened merely to make the release pass.

## Next planned stage

Do not start another product, architecture, backup/account, Node/toolchain or native/iOS slice until AXIS 8.23 is Production-certified on the exact merged main artifact.

After that, inspect live behavior again and choose the next bounded product improvement from useful Reveal/Evolution quality, Capture friction or real-world runtime adaptation. Existing portable backup compatibility remains protected; broader account/backup work remains deferred.
