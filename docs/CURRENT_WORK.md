# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of this work

- Public release candidate: **AXIS 8.16 — Capture Field + Comparative Evidence**.
- PR #68 merged to `main` at exact SHA `f2de9a27336fff3ab0ac3e578ce8cef5a2ccb0fb`.
- Vercel Production is READY for that exact SHA and `https://axis-five-puce.vercel.app/axis-build.json` reports `8.16 / 8.16`, `canonical-single-runtime`, exact `sourceCommit`, and all 8.16 gates.
- EdgeOne deployed the exact same canonical artifact as deployment `dpm1zd8vccv8` at `https://axisfitness-mirror-9x91gveo.edgeone.cool`; authenticated live verification and Vercel/API parity passed.
- Real EdgeOne Chromium passed the inherited release flows plus the full 8.16 Capture + Comparative Evidence flow.
- EdgeOne Production is **not sealed yet** because real iPhone WebKit emitted an access-control page error when the optional 8.10.3 freshness self-check requested `/axis-build.json?fresh=...`.
- The same EdgeOne `/axis-build.json` without the provider-sensitive query is anonymously available, exact-SHA verified and matches Vercel Production.

## Product direction

AXIS remains a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

This hotfix changes no Capture, Encounter, Evolution, media persistence, scoring or Replay semantics. It only seals cross-provider freshness behavior before 8.16 can be called Production-complete.

## Active change — AXIS 8.16 EdgeOne WebKit Production seal

- Branch: `hotfix/816-edgeone-webkit-freshness`.
- Base: exact merged 8.16 main SHA `f2de9a27336fff3ab0ac3e578ce8cef5a2ccb0fb`.
- Public/base product version remains **8.16**; this is a release-platform compatibility seal, not a new product capability version.
- Runtime ownership remains unchanged.

The stale-shell freshness check is event-driven only (`pageshow` / foreground visibility), has no polling, and is optional to the product. It previously combined `cache:'no-store'` with a `?fresh=<timestamp>` asset query. On EdgeOne Production, Chromium accepted that route but WebKit reported a browser-level access-control error even though the async check itself already had fail-open `catch{}` handling.

The production seal therefore keeps the same event-driven version comparison and one-time reload behavior, but reads the canonical same-origin manifest from `/axis-build.json` with `cache:'no-store'`. The timestamp remains available for the reload URL only. No custom request header, polling, persistence owner or new network owner is introduced.

`postbuild-8103-contract.mjs` now fails closed unless the canonical runtime contains the provider-neutral same-origin manifest fetch and contains no `/axis-build.json?fresh=` request.

## Validation for this work

The hotfix must prove:

1. the deterministic 86-step release build remains `8.16 / 8.16`, `canonical-single-runtime`;
2. `releaseFreshnessEventDriven` remains true and the new provider-neutral freshness contract is present;
3. `/axis-build.json?fresh=` is absent from the compiled canonical runtime;
4. `/axis-build.json` with `cache:'no-store'` remains the sole freshness manifest request;
5. all 8.16 Capture + Comparative Evidence gates remain unchanged and green;
6. inherited 8.15.1, 8.15, 8.14, 8.13.1 and training/runtime contracts remain green;
7. after merge, Vercel Production serves the exact new main SHA;
8. EdgeOne deploys that exact Vercel-parity artifact;
9. real EdgeOne Chromium passes the full inherited + 8.16 flow;
10. real EdgeOne iPhone WebKit passes the same flow with no freshness access-control page error;
11. GitHub combined status reports `EdgeOne Production: success` for the exact same main SHA.

## Deployment after merge

Do not call 8.16 production-sealed until Vercel and EdgeOne both serve the exact merged hotfix SHA and both real EdgeOne Chromium and iPhone WebKit release flows succeed. Exact SHA remains authoritative over deployment timing or labels.

## Next planned stage

Only after this 8.16 Production seal is green should the next product iteration resume. Replay remains deferred until real Encounter-bound evidence is trustworthy enough to support it without fabricated continuity.
