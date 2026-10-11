// AXIS 8.32 — local user entry; 8.31 certified runtime remains previous production until separately sealed.
await import('./scripts/prepare-832-release-identity.mjs');
await import('./scripts/prepare-832-play-this-integration.mjs');
await import('./scripts/prepare-832-governance-state.mjs');
console.log('[AXIS 8.32] Object/Flow entry delegates to canonical Active/Recorder with no new fact owner');
