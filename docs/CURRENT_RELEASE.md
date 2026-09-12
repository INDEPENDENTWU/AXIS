# Current Release — AXIS 8.24.1

**Status: Release candidate — Production seal pending**

AXIS **8.24.1 — Dock Occlusion Hotfix** is the current Web release candidate. It is not Production-sealed until the exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

## Exact candidate identity

- release: **AXIS 8.24.1 — Dock Occlusion Hotfix**
- release PR: **#149**
- exact certified starting `main`: `321647b9aaca783b7f6ba99ec66616941208c698`
- delivery branch: `hotfix/8241-dock-occlusion`
- version decision: **8.24 → 8.24.1 / bump / sequence 10 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate build graph: **87 deterministic top-level steps**
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.24 — Active Stage Tactile Convergence** is the last fully Production-sealed runtime until 8.24.1 is certified.

- release PR: **#148**
- runtime seal baseline SHA: `321647b9aaca783b7f6ba99ec66616941208c698`
- Vercel Production gate `34700744685` — success
- Vercel Public Production Alias Gate `34700744673` — success
- EdgeOne deployment `dp7e6rlpyczu`, verification run `34700727554` — success
- EdgeOne verification artifact `10300048249`, SHA-256 `3dfed99f2e91b59b73f39bdeb29fee72d1b169f34305bd247cbd3faec49c488a`
- `axis.juele.fun` verification run `34700727551` — success

That 8.24 SHA is the durable **runtime seal baseline**, **not a self-referential requirement** that the 8.24.1 candidate use the same SHA. Provider evidence is replaced only after exact 8.24.1 merged-main certification.

## What 8.24.1 changes

The still-visible thin dark line is treated as a real dock-compositing defect, not as a reason to remove valid content separators. The 8.24 dock underlay used a negative top overscan while the dock had `contain: paint`, so the overscan could be clipped; the underlay also began transparent, allowing a one-pixel separator to show through.

8.24.1 corrects that boundary by:

- removing paint containment from the fixed dock while retaining layout/style containment;
- giving the dock an explicit opaque `var(--bg)` background;
- using an opaque overscan curtain extending 16 CSS px above and 6 CSS px below the dock edge;
- removing the translucent gradient from the occlusion curtain;
- keeping Capture / Quick Record controls above the curtain in the same v87 action boundary;
- adding computed-style browser proof in Chromium and iPhone-like WebKit so the original false-positive cannot recur.

## Ownership boundary

AXIS 8.24.1 adds no factual owner:

- no Session writer;
- no Encounter writer;
- no media writer;
- no new storage namespace or database;
- no recorder or Active lifecycle owner;
- no network or AI owner;
- no historical rewrite.

AXIS 8.24 tactile behavior remains Production-sealed and inherited. Existing app/v61/v82/v87 owners remain authoritative.

## Release-blocking proof

The exact PR #149 head must prove inherited behavior plus the 8.24.1 dock-occlusion contract without weakening browser, storage or ownership assertions. The new smoke must prove actual computed opacity, overscan geometry, no paint containment, no translucent curtain, controls above the occlusion plane and no viewport overflow in both engines.

After merge, the exact merged SHA must prove fixed Vercel Production parity and Chromium current-release flow including 8.24.1, exact-prebuilt EdgeOne Chromium/WebKit current-release flow including 8.24.1, and `axis.juele.fun` Chromium/WebKit 8.24.1 proof. Final combined Vercel + EdgeOne Production status and all relevant main-push workflows must settle without unresolved failure.

Existing real user stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected. Backup/account expansion remains deferred.
