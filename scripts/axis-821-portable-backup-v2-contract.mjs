import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=f=>fs.readFileSync(f,'utf8');
const hardening=read('prepare-821-portable-backup-ios-memory.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');

for(const token of [
  "AXIS_BACKUP_V2_SCHEMA='axis.backup.v2'",
  "AXIS_BACKUP_V2_MAGIC='AXISB2\\n'",
  'axisBackupV2BuildFile',
  'axisBackupV2VerifyFile',
  'axisBackupMediaKeys',
  'axisBackupV2BlobSha',
  "parts.push(blob)",
  "btn.textContent='保存完整备份'",
  "toast('备份已准备好 · 再点一次保存')",
  'createFile:axisBackupV2BuildFile',
  'verifyFile:axisBackupV2VerifyFile',
  'restoreFile:async file=>',
  "verified.format='v1'",
  "format:'v2'",
  'await txRun(store=>store.clear())',
  'for(const item of rows){const value=await mediaEncodeValue(item.blob);await txRun(store=>store.put(value,item.key))}'
]) assert.ok(hardening.includes(token),`missing iOS-memory contract token: ${token}`);

for(const forbidden of [
  'axisBackupB64FromBuffer',
  'JSON.stringify(bundle)',
  'prepared=[]',
  'fetch(',
  'XMLHttpRequest',
  'WebSocket',
  'sendBeacon('
]) assert.ok(!hardening.includes(forbidden),`iOS-memory hardening must not use ${forbidden}`);

const v1="await import('./prepare-821-portable-backup.mjs');";
const v2="await import('./prepare-821-portable-backup-ios-memory.mjs');";
assert.equal(lifecycle.split(v1).length-1,1,'v1 portable backup must remain imported exactly once');
assert.equal(lifecycle.split(v2).length-1,1,'iOS-memory hardening must be imported exactly once');
assert.ok(lifecycle.indexOf(v2)>lifecycle.indexOf(v1),'iOS-memory hardening must run immediately after portable backup');

if(process.env.AXIS_BUILT==='1'){
  const runtime=read('axis-core.js');
  for(const token of [
    "AXIS_BACKUP_V2_SCHEMA='axis.backup.v2'",
    'createFile:axisBackupV2BuildFile',
    'verifyFile:axisBackupV2VerifyFile',
    'keys:axisBackupMediaKeys',
    "btn.textContent='保存完整备份'"
  ]) assert.ok(runtime.includes(token),`served runtime missing ${token}`);
  assert.equal((runtime.match(/window\.__AXIS_PORTABLE_BACKUP__=/g)||[]).length,1,'served runtime must expose one portable-backup API owner');
  assert.equal((runtime.match(/async function axisBackupMediaReplaceAll\s*\(/g)||[]).length,1,'served runtime must expose one media replace transport owner');
}

console.log(`[AXIS 8.21 portable backup v2 contract] PASS · raw-blob binary export + sequential media writes + fresh-gesture save + v1 compatibility + no new network${process.env.AXIS_BUILT==='1'?' + served runtime':''}`);
