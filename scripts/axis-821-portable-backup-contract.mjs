import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=f=>fs.readFileSync(f,'utf8');
const transform=read('prepare-821-portable-backup.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
const schema=JSON.parse(read('shared/contracts/axis-backup-v1.schema.json'));
const docs=read('docs/PORTABLE_BACKUP_ORIGIN_MIGRATION.md');

assert.equal(schema.$id,'axis.backup.v1');
assert.equal(schema.properties?.schema?.const,'axis.backup.v1');
assert.equal(schema.properties?.source?.properties?.domain?.const,'axis.domain.v1');
assert.equal(schema.properties?.source?.properties?.data?.const,'axis.data.v1');
assert.equal(schema.properties?.source?.properties?.exchange?.const,'axis.exchange.v1');
assert.equal(schema.properties?.integrity?.properties?.algorithm?.const,'SHA-256');
assert.equal(schema.properties?.webOriginSnapshot?.properties?.storage?.items?.properties?.key?.pattern,'^axis_');
assert.equal(schema.properties?.webOriginSnapshot?.properties?.media?.items?.properties?.encoding?.const,'base64');

for(const token of [
  "AXIS_BACKUP_SCHEMA='axis.backup.v1'",
  "AXIS_BACKUP_PREFIX='axis_'",
  'axisBackupCanonical',
  'axisBackupSha256',
  'axisBackupStorageSnapshot',
  'axisBackupMediaSnapshot',
  'axisBackupVerifyBundle',
  'axisBackupRestorePending',
  'axisBackupVerifyCurrent',
  "owner:'transport-only'",
  'network:false',
  'entries:axisBackupMediaEntries',
  'replaceAll:axisBackupMediaReplaceAll',
  'keys:axisBackupMediaKeys',
  "if(state.active)return toast('请先结束当前训练再恢复备份')"
]) assert.ok(transform.includes(token),`missing transform contract token: ${token}`);

for(const structuralToken of ['replaceFunctionDeclaration','replaceObjectAssignment','findElementById','replaceElementById','insertAfterElementById']){
  assert.ok(transform.includes(structuralToken),`structural owner convergence missing: ${structuralToken}`);
}
assert.ok(!transform.includes('const oldBackup='),'portable backup must not depend on an exact historical backupData body snapshot');
assert.ok(!transform.includes('legacy backup replacement expected once'),'brittle historical-body matcher must remain retired');
assert.ok(!transform.includes('storage backup note fallback'),'Settings integration must not accumulate adjacency fallbacks');
assert.ok(!transform.includes('storageActionsClose'),'Settings note must bind to its element owner rather than parent adjacency');

for(const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon(', 'indexedDB.open', 'indexedDB.deleteDatabase']){
  assert.ok(!transform.includes(forbidden),`portable backup transport must not introduce ${forbidden}`);
}
assert.ok(!/localStorage\.clear\s*\(/.test(transform),'restore may not clear unrelated origin storage');
assert.ok(transform.includes("key.startsWith(AXIS_BACKUP_PREFIX)"),'AXIS namespace filter missing');
assert.ok(transform.includes("axisBackupCanonical(nowStorage)!==axisBackupCanonical(storage)"),'post-restore raw storage verification missing');
assert.ok(transform.includes("axisBackupCanonical(compact(nowMedia))!==axisBackupCanonical(compact(media))"),'legacy v1 post-restore media byte verification missing');
assert.ok(transform.includes('beforeMedia=await axisBackupV2CurrentRaw()'),'rollback must snapshot current canonical media before mutation');
assert.ok(transform.includes('await store.replaceAll(beforeMedia.map(row=>({key:row.key,blob:row.blob})))'),'rollback must restore exact pre-mutation media');
assert.ok(transform.includes('await axisBackupV2VerifyCurrent(beforeStorage,beforeMedia)'),'rollback must verify restored storage/media');

const importLine="await import('./prepare-821-portable-backup.mjs');";
assert.equal(lifecycle.split(importLine).length-1,1,'portable backup transform must be imported exactly once');
assert.ok(lifecycle.indexOf(importLine)>lifecycle.indexOf("await import('./prepare-821-report-share-card.mjs');"),'portable backup must run after current 8.21 presentation transforms');
assert.ok(!lifecycle.includes('prepare-821-portable-backup-ios-memory.mjs'),'late backup correction must stay retired from canonical reachability');

assert.ok(docs.includes('c434a4a78530669d5a47be9799d40f5049b57a2d'),'bounded base SHA missing from docs');
assert.ok(docs.includes('feat/821-portable-backup-origin-migration'),'bounded branch missing from docs');
assert.ok(docs.includes('lossless for the durable Web stores AXIS owns'),'exact completeness claim missing');
assert.ok(docs.includes('staged mutation plus verified rollback'),'rollback semantics missing');

if(process.env.AXIS_BUILT==='1'){
  const compileInput=read('app.js'),runtime=read('axis-core.js'),html=read('index.html');
  assert.ok(compileInput.includes("window.__AXIS_PORTABLE_BACKUP__={schema:AXIS_BACKUP_SCHEMA"),'prepared compile input backup runtime missing');
  assert.ok(runtime.includes("window.__AXIS_PORTABLE_BACKUP__={schema:AXIS_BACKUP_SCHEMA"),'served canonical runtime backup API missing');
  assert.ok(runtime.includes('entries:axisBackupMediaEntries,replaceAll:axisBackupMediaReplaceAll,keys:axisBackupMediaKeys'),'served canonical media transport bridge missing');
  assert.equal((runtime.match(/async function backupData\s*\(/g)||[]).length,1,'served runtime must have exactly one backupData owner');
  assert.equal((runtime.match(/indexedDB\.open\(DB,1\)/g)||[]).length,1,'served runtime must have exactly one direct canonical media DB owner');
  assert.ok(!runtime.includes('AXIS-备份-'),'legacy partial JSON backup implementation must not survive the served runtime');
  assert.equal((html.match(/axis-core\.js(?:\?[^"']*)?/g)||[]).length,1,'final document must request one canonical runtime');
  assert.ok(!/(?:src|href)=["'][^"']*app\.js(?:\?[^"']*)?["']/.test(html),'compile input app.js must never be requested by final document');
  assert.equal((html.match(/id="backupBtn"/g)||[]).length,1,'built settings must expose one backup action');
  assert.equal((html.match(/id="restoreBackupBtn"/g)||[]).length,1,'built settings must expose one restore action');
  assert.equal((html.match(/class="axisBackupNote"/g)||[]).length,1,'built settings must expose one backup migration note');
  assert.ok(html.includes('id="backupRestoreSheet"'),'restore preview sheet missing');
  assert.ok(html.includes('id="axis821PortableBackupStyle"'),'backup UI style missing');
}

console.log(`[AXIS 8.21 portable backup contract] PASS · one source owner + v1 compatibility + local-only v2-preferred transport + SHA-256 + exact AXIS namespace/media + active block + verified rollback${process.env.AXIS_BUILT==='1'?' + served canonical single-runtime/media/backup owner':''}`);