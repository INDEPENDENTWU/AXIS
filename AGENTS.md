# AGENTS.md — AXIS development rules

The repository is authoritative. Conversation memory is not.

Before deployment work, read `DEPLOYMENT_POLICY.md`.

## Version decision is a hard invariant

- Every future version-sensitive AXIS iteration must explicitly update `governance/version-decision.json`.
- A product-behavior change must use `decision: "bump"` and advance the dotted numeric public release. Governance, source-owner, compatibility, infrastructure, documentation or test-only work may use `decision: "confirm"` only when the built public release truly stays unchanged.
- `governance/version-decision.json` is audit/governance evidence only. It must never become a competing runtime version authority; the exact canonical build artifact remains authoritative.
- The decision sequence must advance exactly once per version-sensitive iteration. Reusing a stale confirmation is forbidden.
- `AXIS Version Authority` must be green before a version-sensitive PR may be merged. If the built artifact, project-state release, current-release document and explicit decision disagree, stop and fix the release identity instead of bypassing the gate.

## Deployment is a hard invariant

- One product = one GitHub repo = one canonical Git-connected Vercel Project.
- AXIS must stay on its existing Git-connected Vercel project and `main` production chain.
- Never create a new Vercel Project for preview, smoke, schema, release-check, payload, base64, or visual tests.
- Preview deployments belong inside the canonical AXIS Project.
- Direct file/API deployments are diagnostic-only and may not become production or receive the permanent alias.
- Do not call a release deployed/online until the canonical project verifies the intended `main` commit/ref, `source=git`, `target=production`, `readyState=READY`, `aliasError=null`, and anonymous public reachability.
- A deployment read-back 404, missing project, Vercel Authentication page on the public production URL, or `404_NOT_FOUND` is a release blocker.

Preserve the existing healthy Git deployment topology; do not replace it with ad-hoc projects during iteration.
