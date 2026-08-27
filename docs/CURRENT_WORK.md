# Current Work

## Production baseline at start of this work

The exact baseline is merged main `a6354f734b3cdcf041aeecbd0ce9d7c353641401`, the merged result of PR #99.

That exact artifact is already product/Production-sealed before the public version move:

- Vercel fixed Production: `https://axis-five-puce.vercel.app`
- Vercel exact deployment: `dpl_CweMYGbWJSV9KZeMnE6s4U93ZkjM` · READY · source `a6354f734b3cdcf041aeecbd0ce9d7c353641401`
- EdgeOne fixed Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- EdgeOne Production Mirror run: `33025938333` · exact prebuilt artifact · Chromium + iPhone-like WebKit Production lifecycle success

The deployed public release identity at this baseline remains **8.20.1**. The 8.21 Flow/recording product behavior is already present and physically proved; this slice is only the formal identity convergence from **8.20.1 → 8.21**.

The governed active milestone remains **AXIS 8.21 — Flow / Session Blueprint** and the governed parent branch remains `product/821-flow-session-blueprint` until the formal 8.21 release is Production-sealed. This bounded release branch does not replace that governance identity.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Final Release Convergence**

- branch: `release/821-final-convergence`
- base: `a6354f734b3cdcf041aeecbd0ce9d7c353641401`
- intended behavior change: **none**
- intended public identity change: **8.20.1 → 8.21**

The release pass runs only after every existing 8.21 product convergence/proof pass. It therefore preserves the useful boundary that 8.21 product behavior was first assembled and proved while public/base identity was still 8.20.1, then advances only current/public release identity.

This release slice must not add or change:

- Flow behavior or item-completion semantics;
- Object recording-property semantics or controls;
- Object picker ownership;
- Quick Record / Group Plan ownership;
- Session or Encounter writers;
- Active lifecycle ownership;
- persistence namespaces/databases;
- media/evidence ownership;
- request/chunk/runtime topology.

Historical provenance must remain truthful:

- 8.18 Object / Capture / Evidence foundations remain 8.18;
- 8.19 Universal Practice Object remains 8.19;
- 8.20 Executable Practice Objects remains 8.20;
- 8.20.1 Object reliability / Active lifecycle remains 8.20.1;
- 8.21 Flow, canonical recording-property surface, metric-control system and item-unit convergence remain 8.21 product capabilities.

The deterministic release transition is implemented in `prepare-821-release.mjs` and is sequenced as the final import of `prepare-819-postcommit-lifecycle.mjs`, after all existing 8.21 product convergence passes.

## Validation for this work

The exact release PR head is not mergeable until all triggered current gates are green, including Chromium and iPhone-like WebKit where applicable. The candidate must prove:

- generated `publicVersion` and `stableBaseVersion` are exactly `8.21`;
- generated canonical runtime identity is exactly `8.21`;
- architecture remains `canonical-single-runtime`;
- one initial JavaScript request, zero dynamic JavaScript chunks;
- 8.21 Flow item-unit and recording-property capability markers remain present;
- exactly one authoritative `state.active.events.push(` Encounter append remains;
- no `axis_flow_*` persistence namespace appears;
- 8.20.1 reliability regression runs against the 8.21 public artifact while retaining 8.20/8.20.1 capability provenance;
- runtime parity accepts 8.21 as the next controlled public release without relaxing topology equality;
- repository contract accepts the built 8.21 semantic identity without rewriting historical release transitions;
- Flow `A → 完成此项 → B → 完成此项 → C → 完成此项` remains physically green;
- explicit zero-property Objects remain zero-property and Record remains value-only.

## Merge / Production discipline

After exact-head green, merge the release PR. Do not call AXIS 8.21 Production-sealed merely because the PR merged.

The merged main SHA must then satisfy all of the following on the fixed public endpoints:

1. Vercel Production is READY for that exact main SHA and serves `version/baseVersion = 8.21`;
2. EdgeOne mirrors the same exact prebuilt artifact after Vercel/main manifest convergence;
3. Vercel ↔ EdgeOne artifact/manifest parity remains strict;
4. real Chromium Production lifecycle passes;
5. real iPhone-like WebKit Production lifecycle passes.

Only after that exact dual-provider seal should governance/current-release records move from 8.20.1 to the exact 8.21 Production SHA.

## Next planned stage

After 8.21 is formally Production-sealed, first record the exact Production release/governance state. Product expansion after that belongs to a separately governed next milestone; do not smuggle 8.22/adaptive behavior into this release-only change.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
