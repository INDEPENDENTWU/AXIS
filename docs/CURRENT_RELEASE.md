# Current Release — AXIS 8.29

**Status: Production-certified · Recording Friction Collapse**

Product PR **#164** was merged to `main` at the exact product/runtime SHA:

```text
4a9c73b2ea5330b9cffad3f9e322eb6970dfe171
```

The verified PR head was `8dc4d80f17c061b81a294963c4723f1d6d7e826e`: **33 / 33 successful PR workflows**. On that exact merged-main product commit, **28 push workflow runs** concluded as **27 success, 1 cancelled (Branch hygiene), 0 failure**. Inherited Flow, Replay, Practice Loop, and cross-platform contract gates remain subject to their existing validations.

## Production provider certificate

| Provider | Exact 8.29 evidence |
| --- | --- |
| Vercel | Git production deployment `dpl_BJz2iaThLqFnPbTDJ4RTQdDPKNY1`; READY, source `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`, no alias error; Current Release Gate `37831475540`, Deep Compatibility Gate `37831475524` |
| EdgeOne | Exact prebuilt mirror deployment `dpfctvvd321b`; run `37831475199`, including Chromium/WebKit live checks |
| Custom domain | `https://axis.juele.fun`; run `37831475553`, attempt **2**, exact parity plus Chromium/WebKit success |

The canonical Vercel deployment has a verified successful GitHub commit status. There is no independently confirmed exact-main `AXIS Production Gate` run number in this certificate; that field is `null`, rather than pointing to a different workflow. EdgeOne Production commit status is success.

Auditable snapshot: `governance/production-certifications/8.29.json`. These are **product-runtime SHA** observations, not assertions that every future redeployment is the same build.

**Later governance-only commits do not replace the certified product/runtime SHA.** `product.productionRuntimeSha` remains `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`, regardless of the governance merge commit identity.

## Previous release and inheritance

AXIS **8.28 — Practice Loop Convergence** was previously Production-sealed at `df67fc0a20c0c34a79341315c8c85b5461acfe44` (product PR **#162**, governance PR **#163**). Its evidence stays historical; its behavior is inherited in AXIS 8.29.

AXIS 8.29 preserves existing Object, Flow, Active, Session, Encounter, media and storage ownership. Confirmed prior values are only compatible suggestions. Unsaved draft values survive same-recorder rerenders; in-flight repeated saves are suppressed. No prior fact is mutated.

## Release governance

Decision: **8.29 → 8.29 / confirm / sequence 28 / governance**.

This closeout changes only governance, verification compatibility and documentation. No new recorder, session owner, storage namespace or Encounter writer is allowed.

## Next planned bounded stage

**AXIS 8.30 — Object Identity Integrity**, followed by the Playable Practice line: PLAY THIS → AIR → TAKE → FORK. Object catalog identity is a precondition for reliable record provenance and safely shareable challenges. These future capabilities are **planned, not part of AXIS 8.29**.
