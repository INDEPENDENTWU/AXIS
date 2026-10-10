# AXIS Engineering Handoff

**Current governed release:** AXIS 8.30 — Object Identity Integrity.
**Production status:** certified. **Governed target branch:** `main`.
**Product PR:** #167. **Governance confirmation:** sequence 30, `8.30 → 8.30`, `confirm`, `governance`.

## Exact certified product/runtime

```text
eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f
```

This is the immutable certified **product/runtime SHA**, not the governance PR head, governance merge commit, or any later deployment SHA.

## Release evidence

- PR #167 exact green head: `31fdcaf5b78ef15968c3540821e5d32cf3806dd3`, 34/34 PR workflows success.
- Exact merged-main product `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`: 30/30 successful push workflows, 0 failed, 0 cancelled, 0 pending, after EdgeOne run attempt 2.
- Vercel: project `prj_8JJhe0nj2CryZb4xHoHV1WBffn8f`, deployment `dpl_ASBJRgKpMJonNnNBtd1XeumdZ36T`, READY, Git source `main`, exact SHA, public `https://axis-five-puce.vercel.app`.
- EdgeOne: project `makers-bxiu1vmyd0ba`, deployment `dpb4uzrph6wm`, run `38013000237` attempt **2**, exact release/API parity and Chromium/WebKit production flows successful. Attempt 1 failed the 8.28 WebKit Practice Loop post-reload text assertion after an otherwise successful deploy/API/Chromium run.
- `axis.juele.fun`: run `38013000220`, exact parity, Chromium and WebKit production flows success. Git provider statuses both `success`.
- Machine-readable [Production certificate](../governance/production-certifications/8.30.json). Retain the [8.29 certificate](../governance/production-certifications/8.29.json), the predecessor runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`, product PR #164 and governance PR #165.

## Factual authority and compatibility

- Native and custom Object identities remain independent from `baseId` family metadata. Same-label entries remain distinct across catalog search, quick selection, confirmation and reload.
- No historical generic Encounter `equipmentId` is rewritten, migrated or inferred to a more specific movement.
- `app.js` remains the Session/Encounter fact writer; `v61` remains the classic sets writer. The `axis.object-identity.v1` projection owns no persistence.
- No new storage namespace, Active/Session lifecycle owner, network or AI authority. Existing Flow/Active/Evolution and media contracts remain inherited.
- Canonical local-first Web product and cross-platform `axis-native-foundation-0` remain separate in their platform-specific capabilities.

## Engineering workflow

Future product change: fresh `version-decision.json` bump, bounded branch/PR, exact-head green, SHA-leased merge, merged-main provider/dual-browser certification, independent governance-only seal. Do not confuse deployment/maintenance hashes with certified product/runtime authority.

## Next bounded release

**AXIS 8.31 — Playable Runtime Foundation**; subsequent local PLAY THIS, shareable PLAY THIS, AIR, TAKE and FORK are *planned*. No 8.31 feature was introduced by the 8.30 governance closeout.
