# Current Release — AXIS 8.25

**Status: Release candidate — Production seal pending**

AXIS **8.25 — Set Lock Interaction** is the current Web release candidate. It is not Production-sealed until the exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

## Exact candidate identity

- release: **AXIS 8.25 — Set Lock Interaction**
- release PR: **#150**
- exact sealed starting `main`: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- delivery branch: `axis-825-set-lock`
- version decision: **8.24.1 → 8.25 / bump / sequence 11 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate build graph: **87 deterministic top-level steps**; Set Lock is deliberately chained inside the existing late 8.24.1 release step rather than creating a parallel release path
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.24.1 — Dock Occlusion Hotfix** is the last fully Production-sealed runtime until 8.25 is certified.

- release PR: **#149**
- runtime seal baseline SHA: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- canonical Vercel deployment: `dpl_5P7gF35XDzSAkHoLwmpJ3PQJsT2w` — READY / Production / exact main SHA
- Vercel Production gate `34744363573` — success
- Vercel Public Production Alias Gate `34744363564` — success
- EdgeOne deployment `dpp8w54o5vox`, verification run `34744342607` — success
- EdgeOne verification artifact `10313706251`, SHA-256 `935377f26bedd69522c35e2b0886fbc5a6f276348e0f4ab555361540e9c7a8d6`
- `axis.juele.fun` verification run `34744342633` — success
- Chromium and iPhone-like WebKit Production proofs — success

That 8.24.1 SHA is the durable **runtime seal baseline**, not a requirement that the 8.25 candidate share the same SHA. Provider evidence is replaced only after exact 8.25 merged-main certification.

## What 8.25 changes

`完成一组` is promoted from a small confirmation animation into a distinct, short-lived **Set Lock** moment. The change is intentionally tied to the factual completion boundary rather than to the raw pointer event:

- the existing primary control has deeper physical press travel;
- after `completeSet()` has committed the set fact, the existing render boundary observes `done > prevDone` and presents a large two-digit completed-set numeral such as `01 / 04`;
- side clamps converge while a broad pressure halo and subtle Active-stage recoil make the completion feel physically locked in;
- the numeral then collapses toward the canonical set-progress text, turning the completed fact into the next visible progress state rather than disappearing as a generic toast;
- normal and final-set completions use bounded two-beat haptic signatures where vibration is supported;
- repeated triggers reuse one presentation overlay and reset its timers instead of stacking visual layers;
- `prefers-reduced-motion` removes the travel/clamp/pressure motion and uses a short static transition.

The design deliberately excludes confetti, badges, synthetic scores, fullscreen interception and a second completion control.

## Ownership boundary

AXIS 8.25 adds no factual owner. Existing v87 `completeSet()` remains the sole set-completion action/truth boundary and continues to own `completedSets`, set timestamps and rest transition. Set Lock is pointer-inert presentation only, triggered after that fact exists.

There is no new Session writer, Encounter writer, media writer, storage namespace/database, recorder, Active lifecycle owner, network owner, AI owner or historical rewrite. AXIS 8.24 tactile convergence and AXIS 8.24.1 dock occlusion remain Production-sealed and inherited.

## Release-blocking proof

The exact PR #150 head must prove inherited behavior plus Set Lock in Chromium and iPhone-like WebKit. Physical proof must show a single factual completion, large numeral presentation, pressure/clamp/recoil markers, collapse vector toward canonical progress, resulting `第 2 / 4 组` truth, reduced-motion support, pointer-inert overlay and no viewport overflow.

After merge, the exact merged SHA must prove fixed Vercel Production parity/current-release flow, exact-prebuilt EdgeOne Chromium/WebKit current-release flow, and `axis.juele.fun` Chromium/WebKit proof. Final combined Vercel + EdgeOne Production status and all relevant main-push workflows must settle without unresolved failure.

Existing real user stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected. Backup/account expansion remains deferred.
