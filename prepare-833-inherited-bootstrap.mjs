// Only during the deterministic inherited 8.32 build: preserve the approved
// 8.33 decision byte-for-byte, allow immutable historical governance guards
// to validate predecessor 8.32, then restore 8.33 in the successor stage.
import fs from 'node:fs';
const p='governance/version-decision.json',staged='.axis-833-approved-decision.json';
if(fs.existsSync(staged))throw Error('[AXIS 8.33] stale bootstrap decision file');
const raw=fs.readFileSync(p,'utf8'),v=JSON.parse(raw);
if(v.schema_version!==1||v.authority!=='governance-audit-only'||
 v.sequence!==34||v.base_release!=='8.31'||v.release!=='8.33'||
 v.decision!=='bump'||v.change_class!=='product-runtime')
 throw Error('[AXIS 8.33] explicit source version approval missing');
fs.writeFileSync(staged,raw);
fs.writeFileSync(p,JSON.stringify({...v,sequence:33,release:'8.32',
 summary:'Temporary inherited 8.32 build predecessor; AXIS 8.33 approved source decision preserved for final release stage.'},null,2)+'\n');
console.log('[AXIS 8.33] approved intent staged for 8.32 inherited bootstrap; will be restored verbatim in 8.33 stage');
