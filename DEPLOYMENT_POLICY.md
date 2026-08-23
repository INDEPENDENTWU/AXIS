# Deployment Policy

This repository must use one canonical production topology:

`INDEPENDENTWU/AXIS` → one Git-connected Vercel Project → `main` → Production.

## Hard rules

- Never create a separate Vercel Project for preview, smoke, schema, release-check, payload, or visual testing.
- Preview deployments must stay inside the canonical AXIS project.
- Direct file/API deployments are diagnostic-only and may not replace production or receive the permanent public alias.
- A release is valid only when the canonical project is linked to this GitHub repo, deployment `source=git`, `target=production`, the intended `main` commit/ref is present, `readyState=READY`, `aliasError=null`, and the public production URL opens anonymously without Vercel Authentication or `404 NOT_FOUND`.
- Any deployment read-back 404 or missing project is a release blocker, not a harmless connector quirk.
- Do not call a release deployed/online until the checks above pass.

The current AXIS Vercel topology already follows this model. Preserve it.