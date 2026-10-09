# AXIS Current Work

**Governed milestone:** AXIS 8.30 — Object Identity Integrity.
**Governed target branch:** `main`.
**Bounded delivery branch:** `feature/830-object-identity-integrity` · PR **#167** (product candidate, pending certification).
**Version decision:** sequence 29 · **8.29 → 8.30 / bump / product-runtime**.
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
