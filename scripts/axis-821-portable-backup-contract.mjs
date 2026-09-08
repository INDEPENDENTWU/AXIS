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
  "if(state.active)return toast('请先结束当前训练再恢复备份')"
]) assert.ok(transform.includes(token),`missing transform contract token: ${token}`);

for(const structuralToken of ['replaceFunctionDeclaration','replaceStatementByPrefix','replaceElementById']){
  assert.ok(transform.includes(structuralToken),`structural owner convergence missing: ${structuralToken}`);
}
assert.ok(!transform.includes('const oldBackup='),'portable backup must not depend on an exact historical backupData body snapshot');
assert.ok(!transform.includes('legacy backup replacement expected once'),'brittle historical-body matcher must remain retired');

for(const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon(', 'indexedDB.open', 'indexedDB.deleteDatabase']){
  assert.ok(!transform.includes(forbidden),`portable backup transport must not introduce ${forbidden}`);
}
assert.ok(!/localStorage\.clear\s*\(/.test(transform),'restore may not clear unrelated origin storage');
assert.ok(transform.includes("key.startsWith(AXIS_BACKUP_PREFIX)"),'AXIS namespace filter missing');
assert.ok(transform.includes("axisBackupCanonical(nowStorage)!==axisBackupCanonical(storage)"),'post-restore raw storage verification missing');
assert.ok(transform.includes("axisBackupCanonical(compact(nowMedia))!==axisBackupCanonical(compact(media))"),'post-restore media byte verification missing');
assert.ok(transform.includes("await store.replaceAll(rollbackMedia);axisBackupStorageReplace(beforeStorage);await axisBackupVerifyCurrent(beforeStorage,beforeMedia)"),'verified rollback missing');

const importLine="await import('./prepare-821-portable-backup.mjs');";
assert.equal(lifecycle.split(importLine).length-1,1,'portable backup transform must be imported exactly once');
assert.ok(lifecycle.indexOf(importLine)>lifecycle.indexOf("await import('./prepare-821-report-share-card.mjs');"),'portable backup must run after current 8.21 presentation transforms');

assert.ok(docs.includes('c434a4a78530669d5a47be9799d40f5049b57a2d'),'bounded base SHA missing from docs');
assert.ok(docs.includes('feat/821-portable-backup-origin-migration'),'bounded branch missing from docs');
assert.ok(docs.includes('lossless for the durable Web stores AXIS owns'),'exact completeness claim missing');
assert.ok(docs.includes('staged mutation plus verified rollback'),'rollback semantics missing');

if(process.env.AXIS_BUILT==='1'){
  const app=read('app.js'),html=read('index.html');
  assert.ok(app.includes("window.__AXIS_PORTABLE_BACKUP__={schema:AXIS_BACKUP_SCHEMA"),'built backup runtime missing');
  assert.ok(app.includes('entries:axisBackupMediaEntries,replaceAll:axisBackupMediaReplaceAll'),'built canonical media transport bridge missing');
  assert.equal((app.match(/async function backupData\s*\(/g)||[]).length,1,'built artifact must have exactly one backupData owner');
  assert.ok(!app.includes('AXIS-备份-'),'legacy partial JSON backup implementation must not survive the built artifact');
  assert.equal((html.match(/id="backupBtn"/g)||[]).length,1,'built settings must expose one backup action');
  assert.equal((html.match(/id="restoreBackupBtn"/g)||[]).length,1,'built settings must expose one restore action');
  assert.ok(html.includes('id="backupRestoreSheet"'),'restore preview sheet missing');
  assert.ok(html.includes('id="axis821PortableBackupStyle"'),'backup UI style missing');
  const owners=[];
  for(const ent of fs.readdirSync('.',{withFileTypes:true})){
    if(!ent.isFile()||!ent.name.endsWith('.js'))continue;
    const src=read(ent.name),hits=(src.match(/indexedDB\.open\(DB,1\)/g)||[]).length;
    if(hits)owners.push({file:ent.name,hits});
  }
  assert.deepEqual(owners,[{file:'app.js',hits:1}],`direct media DB owner drift: ${JSON.stringify(owners)}`);
}

console.log(`[AXIS 8.21 portable backup contract] PASS · structural owner convergence + schema + local-only transport + SHA-256 + exact AXIS namespace/media snapshot + active block + verified rollback${process.env.AXIS_BUILT==='1'?' + built single media/backup owner':''}`);
