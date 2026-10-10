# AXIS Current Work

**Governed milestone:** AXIS 8.30 — Object Identity Integrity.
governed target branch: `main`.
Bounded delivery branch: `feature/830-object-identity-integrity` · PR **#167**.
Version decision: **8.29 → 8.30 / bump / sequence 29 / product-runtime**.
**Status:** unreleased product-runtime candidate, last Production-sealed release **8.29**.

## Production baseline at start of this work

Certified product/runtime SHA `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`; product PR #164, governance PR #165. Governance closeout merged at `6713b47576e902c2015c63b7bb82b23691ec7a3c`: exact main push 26/27 successful plus one cancelled hygiene, 0 failed. Vercel and EdgeOne statuses success; custom domain run `37900945013` eventually success at attempt 3. The earlier WebKit transient assertion failures are retained in #165 post-merge comments.

## Active change

Stable native ID on selection, search and classic quick recording. Audit native and expanded libraries, custom and historical fallback before accepting a final identity claim. Preserve same-name historical source as a historical fact only, not a new Object selection override.

No new data writer; `baseId` is not a canonical Object ID. Old ambiguous Encounters remain immutable.

## Validation for this work

Full source audit `scripts/axis-830-object-identity-audit.mjs --enforce`, build/release contract, actual Chromium and WebKit selection→save→reload proof, and historical provenance checks must all pass on exact PR head. **No product merge until all successful**.

## Next planned stage

After full 8.30 merged-main Production certification and independent governance seal, **AXIS 8.31 — Playable Runtime Foundation**, then PLAY THIS, AIR, TAKE and FORK.

Cross-platform foundation remains `axis-native-foundation-0` from `INDEPENDENTWU/AXIS-iOS`. Conversation history is supplemental only; repository state and verified evidence are authoritative.

## Durable source and native compatibility

repository governance remains authoritative. Chat history is not authoritative project memory. Portable inherited contracts: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`. The native foundation remains `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`; platform-specific camera and haptic capabilities stay separately declared. The local-first Web app and established factual owners remain authoritative for this candidate.

## 2026-10-10 verification checkpoint — PR #167

- The **8.30 product candidate remains unreleased**. No product merge, Production certification or Governance Seal has occurred. AXIS 8.29 remains the authoritative release.
- Browser evidence from run [38010491087](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38010491087): the final assembled catalog had previously replaced canonical ID indexing with name-keyed deduplication. The corrected final build now reports `nativeMissing: []`, and exposes distinct `chest-row` and `custom-identity-proof` entries with the same visible label. This is a **search/index proof only**, not an Encounter save or release seal.
- Build repair: `postbuild-830-runtime-convergence.mjs` explicitly retires the later name-based override and reconciles the final native catalog by canonical ID. `postbuild-830-object-identity-contract.mjs` rejects builds that omit final native precedence. The full ID inventory is asserted by `scripts/axis-830-object-identity-smoke.mjs`.
- Next blocker: after search succeeded, Chromium run 38010491087 reached `Quick Record did not accept exact chest-row`. The 8.20 `beginQuickRecorder` bridge is intentionally restricted to explicit metric-schema Objects and is not the native Quick Record route. The current smoke was corrected to exercise the visible Quick Record/picker/save route; the replacement remains **unverified pending fresh Chromium/WebKit execution**.
- Independent compatibility blocker: the inherited 8.8.2 Active view still fails to become visible after the legacy recording flow in Chromium and WebKit. Diagnose state and canonical presentation ownership without weakening the inherited assertion.
- Mandatory closeout: exact PR head **all required workflows green**; protected merge; exact merged-main Vercel, EdgeOne and custom-domain Production evidence; a **separate** governance-only seal. Do not begin 8.31 early.
