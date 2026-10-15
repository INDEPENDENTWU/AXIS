// AXIS 8.32 — local user entry; 8.31 certified runtime remains previous production until separately sealed.
const FROM='8.31',VERSION='8.32';
await import('./scripts/prepare-832-release-identity.mjs');
await import('./scripts/prepare-832-play-this-integration.mjs');
await import('./scripts/prepare-832d13-picker-accessibility.mjs');
await import('./scripts/prepare-832d14-theme.mjs');
await import('./scripts/prepare-832d18-install-origin.mjs');
await import('./scripts/prepare-832-inherited-regressions.mjs');
await import('./scripts/prepare-832-governance-state.mjs');
console.log('[AXIS 8.32] Object/Flow entry delegates to canonical Active/Recorder with no new fact owner');
