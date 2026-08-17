# Repository structure

AXIS has a clean production runtime and a deliberately transitional source tree. Those two facts are compatible.

The browser receives one canonical runtime, but the source repository still contains historical implementation owners and exact build-time convergence steps because they encode compatibility that has not yet been safely retired.

## Top-level layout

```text
.github/             contribution templates and CI/release workflows
api/                 same-origin server endpoints
cloud-functions/     alternate serverless adapter surface
compiler/            explicit build-time source fragments
data/                 curated local data
lib/                  reusable current libraries and contracts
scripts/              diagnostics, smoke tests and release verification
docs/                 product, architecture, delivery and release documentation
fresh/                isolated freshness/bootstrap entry surface

app.js, v*.js         current/historical browser source owners
*.css                 source styles consumed by convergence/build
prepare-*.mjs         exact build-time migrations and owner convergence
postbuild-*.mjs       canonical packaging, inherited assertions and release contracts
build-release.mjs     only release build entry point
vercel.json           Vercel hosting contract
edgeone.json          EdgeOne hosting contract
```

## Production output

`node build-release.mjs` converges the source tree into generated artifacts. The canonical browser contract is:

```text
index.html
axis-core.js
axis-style.css
axis-build.json
```

`axis-core.js`, `axis-style.css` and `axis-build.json` are generated and are intentionally not source-controlled. Production identity is verified from the generated manifest and exact source commit.

## Why version-like source files remain at the root

Files such as `v61.js`, `v8710-watermark.js` or `v8712-runtime.js` are not separate product releases loaded one after another in Production. They are source/compiler inputs that still own or preserve particular behavior.

Moving them into a prettier directory would require changing build references and compatibility assumptions. That is a code migration, not repository housekeeping, so it is only done when the relevant owner has been extracted or retired and the complete release gates prove equivalence.

The same rule applies to `prepare-*` and `postbuild-*`: a filename looking old is not evidence that the file is dead.

## Current source classes

### Product state and high-frequency recording

`app.js` and `v61.js` remain important compatibility owners for local training state and strength recording.

### Historical browser capability owners

The `v8x` / `v87xx` files retain behavior that the canonical packager converges into the single production runtime. Current ownership is documented in `CURRENT_RELEASE.md`; do not infer it by sorting filenames.

### Compatibility compiler

`prepare-*.mjs` rewrites known historical source shapes into the current ownership model. A valid compatibility rewrite must match an exact source signature, fail on ambiguity and be covered by a final-artifact invariant.

### Postbuild contracts

`postbuild-*.mjs` packages the final runtime and asserts inherited/current release behavior. Version-specific contracts remain while the behaviors they protect still need regression coverage.

### Current libraries

`lib/` is the preferred home for isolated reusable contracts and new UI-independent logic. New Runtime work should move in this direction rather than adding more browser-global historical layers.

## Generated versus tracked

Generated build artifacts must not be committed as source. Local tool state, credentials and provider directories are ignored by `.gitignore`.

Tracked hosting files, source contracts and release scripts are not generated cache; they are part of the release system and must be reviewed like code.

## Historical operational records

One-off deployment/recovery markers live under `docs/history/`. They are retained for provenance only and may not be used as current release identity.

Git history remains the authoritative long-form operational record. New one-off root marker files should not be added.

## Retirement procedure

A historical source or compiler step can be removed only when all of the following are true:

1. its current behavior and data compatibility role are known;
2. a replacement owner exists or the behavior is intentionally gone;
3. no build/test/runtime reference still requires the file;
4. relevant existing user data remains readable;
5. Chromium and WebKit gates pass on the exact candidate;
6. final and transient-state regressions still cover the original failure class.

Prefer deleting proven-dead history over moving it into another executable directory. Prefer documentation history only for small operational records that remain useful to humans.
