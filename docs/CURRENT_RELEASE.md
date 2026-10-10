# Current Release — AXIS 8.30

**Status: Production-certified — Object Identity Integrity.** Product PR #167 · governance-only confirmation sequence 30.

## Certified product/runtime SHA

```text
eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f
```

This is the exact merged-main **product/runtime SHA**, not a governance merge SHA or subsequent deployment commit. Later governance-only commits and new provider redeployments must not replace this identifier.

## Evidence

- Exact product PR #167 head `31fdcaf5b78ef15968c3540821e5d32cf3806dd3`: 34/34 PR workflows succeeded.
- Exact product merged-main SHA `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`: 30/30 push workflows succeeded on latest completed attempts, none outstanding or failed.
- Vercel Git Production `dpl_ASBJRgKpMJonNnNBtd1XeumdZ36T`: READY, `main`, source SHA exact.
- EdgeOne Production mirror `dpb4uzrph6wm`: [run #38013000237](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38013000237), **attempt 2** success; deploy, API parity, Chromium and iPhone WebKit. Attempt 1 failed a post-reload Practice Loop presentation assertion and is retained as a historical test failure.
- [Custom domain run #38013000220](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38013000220): `axis.juele.fun` exact parity and Chromium/WebKit success.
- Provider commit statuses Vercel and EdgeOne: `success`.

Machine-readable evidence: [governance/production-certifications/8.30.json](../governance/production-certifications/8.30.json).

## Invariants

Canonical `id` is authoritative for newly confirmed native/custom Object facts. `baseId` is family metadata only. Same-label sources remain distinct. Old ambiguous Encounters are immutable and are not retroactively given an invented movement identity. The established app-owned Encounter/Session writer and v61 classic set writer remain unchanged.

## Previous seal

AXIS **8.29** product/runtime SHA `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` · product PR #164 · governance PR #165. Its certificate remains preserved at `governance/production-certifications/8.29.json`.

## Next bounded release

AXIS **8.31 — Playable Runtime Foundation**. It remains planned, not implemented by this seal.
