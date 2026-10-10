// AXIS 8.31 — canonical Playable execution admission (no second factual owner).
const FROM='8.30',VERSION='8.31';
await import('./scripts/prepare-831-release-identity.mjs');
await import('./scripts/prepare-831-playable-integration.mjs');
await import('./scripts/prepare-831-governance-state.mjs');
console.log('[AXIS 8.31] bounded execution projection · canonical Flow/Active/Encounter only · no new writer');
