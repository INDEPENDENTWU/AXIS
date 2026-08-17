# Historical operational markers

This directory contains small one-off release/deployment markers retained only for provenance.

They are not current product truth, are not consumed by `build-release.mjs`, and must not be used to infer the current AXIS version or runtime architecture.

Current release identity lives in:

- `../CURRENT_RELEASE.md`
- `../RUNTIME_CONTRACT.md`
- the generated `axis-build.json` for a built/deployed candidate

Git history is the preferred record for future operational events. Do not add new deployment-trigger or recovery marker files to the repository root.
