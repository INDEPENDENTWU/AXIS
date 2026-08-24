# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Formal public Production is **AXIS 8.19**.
- AXIS 8.19 product capability PR **#80** merged as `d97b483f5b297e4bc9483a7484da5587cc4f17d8`.
- AXIS 8.19 release-seal PR **#81** merged to `main` as `430c919e1609589a26864868692ae20cf6ce9617`.
- Vercel Production for that release is `dpl_EeYsLsqASULnptS6XuVdDEkRUbn7`, serving the exact SHA above at `https://axis-five-puce.vercel.app`.
- EdgeOne Production Mirror run `32723084406` completed successfully for the same 8.19 artifact, including exact artifact parity plus real Chromium and iPhone-like WebKit flows, at `https://axisfitness-mirror-9x91gveo.edgeone.cool`.
- Public version stays **8.19** for the current correctness hotfix; this work does not introduce a new product milestone.

## Active change

**AXIS 8.19 Capture default-entry correctness hotfix** · branch `fix/819-capture-default-entry` · PR **#82**.

The governed product milestone remains **AXIS 8.19 — Universal Practice Objects**. Its original implementation branch `product/819-universal-practice-objects` is already merged through PR #80; PR #82 is a Production correctness continuation, not a competing product milestone.

The native/cross-platform handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`, with shared portable contracts `axis.domain.v1` and `axis.data.v1`. This Web hotfix must not alter native-domain semantics or durable exchange contracts.

Real-device testing found a production defect in the inherited Capture entry path: changing **默认拍摄入口** in Settings to 照片 / 扫描 / 视频 persisted correctly, but opening Capture through the visible `#scanBtn` still always entered Scan.

Root cause is an ownership mix-up between two different preferences:

- `__AXIS_CAPTURE_PREF__` is the legacy compatibility bridge for **scan sampling duration only** (`3` / `5` seconds);
- 8.18 introduced the real camera-entry preference in `state.prefs.captureDefaultMode` (`last` / `photo` / `scan` / `video`), resolved by the canonical app camera owner;
- inherited `v816-capture-entry-seal.js` still read the 3/5-second bridge and passed `3` or `5` as the opening mode;
- the 8.18 canonical opener only resolves `captureDefaultMode` when the default-entry sentinel is `photo`, so `3` / `5` bypassed the new preference and forced Scan.

The fix keeps one owner instead of adding another:

- the visible default Capture entry delegates with the canonical `photo` default-resolution sentinel;
- `app.js` remains the only owner that resolves `captureDefaultMode` / `captureLastMode`;
- scan sampling remains an independent 3/5-second preference and is not reused as camera mode;
- no storage, recorder, camera, network, event, or preference writer is added;
- the inherited 8.18 dual-engine smoke now physically changes the default mode in Settings and then opens through the real visible Capture button, closing the previous CI gap.

8.19 product truth remains unchanged:

`Object → Metric Schema → Recording Surface → authoritative metric facts → immutable Encounter schema snapshot → History / Evolution`

Authoritative stores and owners remain unchanged: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`; `app.js` owns base session/Encounter persistence and canonical camera/media; `v61.js` owns classic high-frequency strength set facts.

**Chat history is not authoritative project memory.** GitHub governance, contracts, tests and deployment truth remain authoritative.

## Validation for this work

PR #82 may merge only when the exact head passes the normal AXIS release/compatibility matrix without weakening inherited assertions.

Required proof:

- source contract: `v816-capture-entry-seal.js` no longer resolves camera mode from `__AXIS_CAPTURE_PREF__`;
- physical Settings interaction persists `captureDefaultMode`;
- the real visible `#scanBtn` opens the mode selected in Settings rather than Scan sampling mode;
- the regression runs in both Chromium and iPhone-like WebKit through the inherited `scripts/axis-818-object-focus-smoke.mjs` path;
- Current Release, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity and affected specialist gates pass;
- cross-platform/native foundation contracts remain unchanged and sealed;
- no destructive user-data migration and no second persistence/camera/recorder owner is introduced;
- after merge, Vercel Production must serve the exact merged-main SHA with public version/baseVersion `8.19`;
- EdgeOne must deploy the same prebuilt artifact and pass parity, live Chromium and live iPhone-like WebKit Production verification.

## Next planned stage

1. Finish PR #82 with all triggered gates green; fix any real contract failure rather than weakening assertions.
2. Merge only the exact tested PR head.
3. Confirm the unchanged Vercel Production URL serves `axis-build.json` with `version = 8.19`, `baseVersion = 8.19`, and the exact new merged-main `sourceCommit`.
4. Require EdgeOne Production Mirror to publish the exact same artifact and complete Chromium + iPhone-like WebKit live verification.
5. Treat AXIS 8.19 plus this hotfix as the new tested rollback/reference baseline before unrelated product work continues.

**Conversation history is supplemental only. GitHub handoff/contracts/tests are authoritative for this work.**
