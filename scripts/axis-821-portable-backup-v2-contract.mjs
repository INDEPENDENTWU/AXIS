import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=f=>fs.readFileSync(f,'utf8');
const owner=read('prepare-821-portable-backup.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');

for(const token of [
  "AXIS_BACKUP_V2_SCHEMA='axis.backup.v2'",
  "AXIS_BACKUP_V2_MAGIC='AXISB2\\n'",
  'axisBackupV2BuildFile',
  'axisBackupV2VerifyFile',
  'axisBackupMediaKeys',
  'axisBackupV2BlobSha',
  "btn.textContent='保存完整备份'",
  "toast('备份已准备好 · 再点一次保存')",
  'createFile:axisBackupV2BuildFile',
  'verifyFile:axisBackupV2VerifyFile',
  'restoreFile:async file=>',
  "format:'v2'",
  'await txRun(store=>store.clear())',
  'for(const item of rows){const value=await mediaEncodeValue(item.blob);await txRun(store=>store.put(value,item.key))}',
  'function replaceObjectAssignment(src,prefix,to,label)',
  'bodyEnd=findDeclarationEnd(src,start,label)',
  "if(src[end]!==';')fail(`${label} missing object-assignment terminator`)"
]) assert.ok(owner.includes(token),`missing canonical v2 owner token: ${token}`);

for(const forbidden of ['prepared=[]','fetch(', 'XMLHttpRequest','WebSocket','sendBeacon(']){
  assert.ok(!owner.includes(forbidden),`portable backup source owner must not use ${forbidden}`);
}

const mediaEntriesStart=owner.indexOf('async function axisBackupMediaEntries()');
const mediaEntriesEnd=owner.indexOf('async function axisBackupMediaReplaceAll',mediaEntriesStart);
assert.ok(mediaEntriesStart>=0&&mediaEntriesEnd>mediaEntriesStart,'media entry transport boundary missing');
const mediaEntries=owner.slice(mediaEntriesStart,mediaEntriesEnd);
assert.ok(mediaEntries.includes('for(const key of keys)'), 'media entries must read sequentially');
assert.ok(!mediaEntries.includes('.getAll('),'media entries must not bulk-load the media store');

const userStart=owner.indexOf('async function backupData()');
const userEnd=owner.indexOf('function axisBackupRestoreSheet',userStart);
assert.ok(userStart>=0&&userEnd>userStart,'user export boundary missing');
const userExport=owner.slice(userStart,userEnd);
assert.ok(userExport.includes('axisBackupV2BuildFile()'),'visible backup action must use v2');
assert.ok(!userExport.includes('axisBackupCreateBundle()'),'visible backup action must not invoke v1 base64 export');
assert.ok(!userExport.includes('axisBackupMediaSnapshot()'),'visible backup action must not invoke whole-media v1 snapshot');

assert.ok(owner.includes("AXIS_BACKUP_SCHEMA='axis.backup.v1'"),'v1 import compatibility must remain');
assert.ok(owner.includes('axisBackupVerifyBundle'),'v1 verifier must remain');
assert.ok(owner.includes('axisBackupMediaDecode'),'v1 media import decoder must remain');

const primary="await import('./prepare-821-portable-backup.mjs');";
const retired="prepare-821-portable-backup-ios-memory.mjs";
assert.equal(lifecycle.split(primary).length-1,1,'portable backup source owner must be imported exactly once');
assert.ok(!lifecycle.includes(retired),'retired late iOS-memory transform must not remain build-reachable');

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
  const rs=runtime.indexOf('async function backupData()'),re=runtime.indexOf('function axisBackupRestoreSheet',rs),servedUser=runtime.slice(rs,re);
  assert.ok(servedUser.includes('axisBackupV2BuildFile()')&&!servedUser.includes('axisBackupCreateBundle()'),'served visible export must stay v2-only');
}

console.log(`[AXIS 8.21 portable backup v2 contract] PASS · v2 emitted by canonical backup source owner · sequential media transport · fresh-gesture save · v1 import/API compatibility · late hardening layer unreachable · no new network${process.env.AXIS_BUILT==='1'?' + served runtime':''}`);