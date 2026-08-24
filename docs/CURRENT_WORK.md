# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Production: **AXIS 8.18**.
- Exact baseline: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`.
- Source Convergence has **zero intended user-visible behavior change**; this Production artifact remains the equivalence/rollback reference.

## Active change

**AXIS Source Convergence — 8.19 Foundation** · branch `engineering/source-convergence-819` · PR **#79**.

Current phase: **CI convergence sealed before merge; exact merged-main Production verification next**.

### Completed · durable governance

GitHub owns current project/release context, owners, retirements and CI evidence. Future presentation foundation remains exactly `zh-Hans` **简体中文**, `zh-Hant` **繁體中文**, `en` **English**, themes `system / light / dark`.

### Preserved · native / cross-platform foundation

The native handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`. Shared portable contracts remain `axis.domain.v1` for domain semantics and `axis.data.v1` for durable exchange. Web/iOS capability differences stay isolated behind platform contracts rather than leaking into product truth.

**Chat history is not authoritative project memory.** Durable handoff, ADRs, shared contracts, fixtures and GitHub state are authoritative for future agents and native work.

### Completed · CI convergence

- Original broad PR fanout observed: **25 workflow families**.
- Historical automatic workflow files physically retired: **20**.
- Broad PR/main topology after convergence: **9 baseline responsibility families**.
- Path-scoped specialist intentionally preserved: **AXIS 8.12 Browser Gate**.
- Resurrection guard: retired workflow files may not return.
- Stale-head cancellation: verified; never cancels current-head or push/main Production work.

Current Release replacement evidence:
- `32630099680` — Chromium + WebKit **success**;
- post-retirement `32630367047` — Chromium + WebKit **success**.

Runtime Foundation replacement evidence:
- `32630563608` — pure-runtime-parity + Chromium + WebKit **success**;
- post-retirement `32630723007` — all three jobs **success**.

Deep Compatibility replacement evidence:
- `32631072695` — static + Chromium + WebKit **success**;
- preserves legacy storage, reminder/Home, 8.9→8.10.3 learning/detail/home/voice, 8.12 field/Group Plan/Settings, Personal Equipment, simplified Learning, 8.12.4/8.12.5 behavior.

### Final behavior proof before handoff seal

Exact candidate: `88d9ee826dcfab14a465c38837a33c6ecd4727e0`.

Every workflow actually triggered on this candidate finished **SUCCESS**:

- Repository Contract `32657115841`;
- Work Continuity `32657115855`;
- Runtime Gate `32657115895`;
- Current Release `32657115881`;
- Runtime Foundation `32657115832`;
- Deep Compatibility `32657115849` — static + Chromium + iPhone WebKit all success;
- Cross-Platform Foundation `32657115829`;
- PR Run Convergence `32657115935`;
- EdgeOne PR package contract `32657115860`;
- path-scoped AXIS 8.12 Browser Gate `32657115897` — Chromium + iPhone WebKit success.

Two final test-quality corrections were made without changing product behavior:

1. cumulative-rest regression now synchronizes to persisted `paused`/`active` state instead of fixed wall-clock sleeps; the same `>400ms` accumulated-rest acceptance requirement remains;
2. 8.12 Browser Gate now recognizes the inherited simplified Learning surface via `__AXIS_8123_LEARNING__` semantic markers instead of an exact public-release string; corpus/group/retirement/overflow/page-error assertions remain strict.

## Validation for this work

Preserve exact 8.18 behavior, one canonical runtime, historical storage/data readability, custom object identity, current camera/media/sound/completion ownership, Chromium/WebKit coverage and exact-SHA Production proof. Do not gain green CI through timeout inflation, weaker assertions, duplicate owners/stores, or destructive migration.

## Next planned stage

1. Let this **docs/governance-only handoff-seal head** pass the 9 baseline responsibility gates.
2. Update PR #79 description/evidence without changing the tested head SHA.
3. Merge PR #79 with expected-head protection.
4. Verify the exact merged-main SHA on Vercel Production.
5. Require EdgeOne exact-prebuilt artifact parity and real Chromium + iPhone WebKit Production flows.
6. Only then call the Source Convergence CI/handoff phase sealed.
7. Start **Phase 3 — Source Quarantine / Direct Ownership** on a new engineering branch: shorten the current long `build-release.mjs` historical transform chain one proven owner at a time. Do not rewrite AXIS.

CI/handoff convergence is nearly complete. **Source/build convergence is explicitly not complete yet.**
