import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 portable backup iOS memory] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');

function findDeclarationEnd(source,start,label){
 let open=source.indexOf('{',start);if(open<0)fail(`${label} missing body`);
 let depth=0,quote='',line=false,block=false,escape=false;
 for(let i=open;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(line){if(c==='\n')line=false;continue}
  if(block){if(c==='*'&&n==='/'){block=false;i++}continue}
  if(quote){if(escape){escape=false;continue}if(c==='\\'){escape=true;continue}if(c===quote){quote='';continue}continue}
  if(c==='/'&&n==='/'){line=true;i++;continue}
  if(c==='/'&&n==='*'){block=true;i++;continue}
  if(c==='"'||c==="'"||c==='`'){quote=c;continue}
  if(c==='{')depth++;
  else if(c==='}'){depth--;if(depth===0)return i+1}
 }
 fail(`${label} unterminated body`)
}
function replaceFunctionDeclaration(source,name,to,label){
 const re=new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`,'g'),hits=[...source.matchAll(re)];
 if(hits.length!==1)fail(`${label} expected one function owner, found ${hits.length}`);
 const start=hits[0].index,end=findDeclarationEnd(source,start,label);
 return source.slice(0,start)+to+source.slice(end)
}
function replaceObjectAssignment(source,prefix,to,label){
 const hits=[];for(let p=source.indexOf(prefix);p>=0;p=source.indexOf(prefix,p+prefix.length))hits.push(p);
 if(hits.length!==1)fail(`${label} expected one owner statement, found ${hits.length}`);
 const start=hits[0],bodyEnd=findDeclarationEnd(source,start,label);let end=bodyEnd;
 while(end<source.length&&/\s/.test(source[end]))end++;
 if(source[end]!==';')fail(`${label} missing object-assignment terminator`);
 return source.slice(0,start)+to+source.slice(end+1)
}

const mediaReplace=String.raw`async function axisBackupMediaReplaceAll(entries){
 const rows=(entries||[]).map(item=>{if(!item||typeof item.key!=='string'||!(item.blob instanceof Blob))throw new Error('media-backup-entry-invalid');return{key:item.key,blob:item.blob}}),db=await openDb();
 const txRun=fn=>new Promise((res,rej)=>{let tx=null,settled=false;const bad=e=>{if(settled)return;settled=true;rej(tx?.error||e?.target?.error||e||new Error('media-backup-write-failed'))};try{tx=db.transaction('media','readwrite');fn(tx.objectStore('media'));tx.oncomplete=()=>{if(settled)return;settled=true;res()};tx.onabort=bad;tx.onerror=()=>{}}catch(e){bad(e)}});
 try{await txRun(store=>store.clear());for(const item of rows){const value=await mediaEncodeValue(item.blob);await txRun(store=>store.put(value,item.key))}}finally{try{db.close()}catch{}}
}`;
src=replaceFunctionDeclaration(src,'axisBackupMediaReplaceAll',mediaReplace,'sequential media replace');

const v2Runtime=String.raw`const AXIS_BACKUP_V2_SCHEMA='axis.backup.v2',AXIS_BACKUP_V2_MAGIC='AXISB2\n',AXIS_BACKUP_V2_MIME='application/vnd.axis.backup';
function axisBackupV2Hex(buf){return Array.from(new Uint8Array(buf),x=>x.toString(16).padStart(2,'0')).join('')}
async function axisBackupV2BlobSha(blob){return axisBackupV2Hex(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))}
async function axisBackupMediaKeys(){const db=await openDb();return new Promise((res,rej)=>{let tx=null,settled=false;const bad=e=>{if(settled)return;settled=true;try{db.close()}catch{}rej(tx?.error||e?.target?.error||e||new Error('media-backup-keys-failed'))};try{tx=db.transaction('media','readonly');const req=tx.objectStore('media').getAllKeys();req.onsuccess=()=>{if(settled)return;settled=true;const out=(req.result||[]).map(String).sort((a,b)=>a.localeCompare(b));db.close();res(out)};req.onerror=bad;tx.onabort=bad;tx.onerror=()=>{}}catch(e){bad(e)}})}
function axisBackupV2Summary(storage,media){return axisBackupSummary(storage,media)}
async function axisBackupV2BuildFile(){
 save();const storage=axisBackupStorageSnapshot(),store=window.__AXIS_MEDIA_STORE__;if(!store?.keys||!store?.get)throw new Error('canonical-media-v2-unavailable');const keys=await store.keys(),media=[];let offset=0;
 for(const key of keys){const blob=await store.get(key);if(!(blob instanceof Blob))throw new Error('canonical-media-entry-invalid');const size=blob.size,type=blob.type||'application/octet-stream',sha256=await axisBackupV2BlobSha(blob);media.push({key:String(key),type,size,offset,sha256});offset+=size}
 const manifest=axisBackupV2Summary(storage,media),payload={schema:AXIS_BACKUP_V2_SCHEMA,exportedAt:new Date().toISOString(),source:axisBackupSource(),webOriginSnapshot:{storage,media},manifest},header={...payload,integrity:{algorithm:'SHA-256',value:await axisBackupSha256(payload)}},headerBytes=new TextEncoder().encode(JSON.stringify(header)),magicBytes=new TextEncoder().encode(AXIS_BACKUP_V2_MAGIC),lenBytes=new Uint8Array(4);new DataView(lenBytes.buffer).setUint32(0,headerBytes.length,false);
 const parts=[magicBytes,lenBytes,headerBytes];for(const row of media){const blob=await store.get(row.key);if(!(blob instanceof Blob)||blob.size!==row.size||(blob.type||'application/octet-stream')!==row.type)throw new Error('media-changed-during-backup');if(await axisBackupV2BlobSha(blob)!==row.sha256)throw new Error('media-changed-during-backup');parts.push(blob)}
 const file=new File(parts,'AXIS-'+new Date().toISOString().slice(0,10)+'.axisbackup',{type:AXIS_BACKUP_V2_MIME});return{file,header}
}
async function axisBackupV2ReadHeader(file){
 const magicBytes=new TextEncoder().encode(AXIS_BACKUP_V2_MAGIC),prefixSize=magicBytes.length+4;if(!(file instanceof Blob)||file.size<prefixSize)throw new Error('backup-v2-too-small');const prefix=new Uint8Array(await file.slice(0,prefixSize).arrayBuffer());for(let i=0;i<magicBytes.length;i++)if(prefix[i]!==magicBytes[i])throw new Error('backup-v2-magic-mismatch');const headerLength=new DataView(prefix.buffer,prefix.byteOffset+magicBytes.length,4).getUint32(0,false);if(headerLength<2||headerLength>16*1024*1024||prefixSize+headerLength>file.size)throw new Error('backup-v2-header-invalid');const headerText=await file.slice(prefixSize,prefixSize+headerLength).text(),header=JSON.parse(headerText);return{header,mediaStart:prefixSize+headerLength}
}
async function axisBackupV2VerifyFile(file){
 const {header,mediaStart}=await axisBackupV2ReadHeader(file);if(header?.schema!==AXIS_BACKUP_V2_SCHEMA)throw new Error('backup-schema-unsupported');if(header.integrity?.algorithm!=='SHA-256'||typeof header.integrity?.value!=='string')throw new Error('backup-integrity-missing');const payload={schema:header.schema,exportedAt:header.exportedAt,source:header.source,webOriginSnapshot:header.webOriginSnapshot,manifest:header.manifest};if(await axisBackupSha256(payload)!==header.integrity.value)throw new Error('backup-integrity-mismatch');const storage=header.webOriginSnapshot?.storage,media=header.webOriginSnapshot?.media;if(!Array.isArray(storage)||!Array.isArray(media))throw new Error('backup-snapshot-invalid');const storageKeys=new Set(),mediaKeys=new Set();for(const row of storage){if(!row||typeof row.key!=='string'||!row.key.startsWith(AXIS_BACKUP_PREFIX)||typeof row.value!=='string'||storageKeys.has(row.key))throw new Error('backup-storage-invalid');storageKeys.add(row.key)}let offset=0;for(const row of media){if(!row||typeof row.key!=='string'||typeof row.type!=='string'||!Number.isFinite(Number(row.size))||Number(row.size)<0||Number(row.offset)!==offset||typeof row.sha256!=='string'||!/^[0-9a-f]{64}$/.test(row.sha256)||mediaKeys.has(row.key))throw new Error('backup-media-invalid');mediaKeys.add(row.key);offset+=Number(row.size)}if(mediaStart+offset!==file.size)throw new Error('backup-media-size-mismatch');const summary=axisBackupV2Summary(storage,media);for(const k of ['storageCount','storageBytes','mediaCount','mediaBytes'])if(Number(header.manifest?.[k])!==Number(summary[k]))throw new Error('backup-manifest-mismatch');for(const row of media){const blob=file.slice(mediaStart+row.offset,mediaStart+row.offset+row.size,row.type);if(await axisBackupV2BlobSha(blob)!==row.sha256)throw new Error('backup-media-integrity-mismatch')}return{bundle:header,verified:{format:'v2',storage,media,summary,file,mediaStart}}
}
async function axisBackupV2CurrentRaw(){const store=window.__AXIS_MEDIA_STORE__;if(!store?.keys||!store?.get)throw new Error('canonical-media-v2-unavailable');const keys=await store.keys(),out=[];for(const key of keys){const blob=await store.get(key);if(!(blob instanceof Blob))throw new Error('canonical-media-entry-invalid');out.push({key:String(key),blob,type:blob.type||'application/octet-stream',size:blob.size,sha256:await axisBackupV2BlobSha(blob)})}return out}
async function axisBackupV2VerifyCurrent(storage,media){if(axisBackupCanonical(axisBackupStorageSnapshot())!==axisBackupCanonical(storage))throw new Error('restore-storage-verify-failed');const store=window.__AXIS_MEDIA_STORE__,keys=await store.keys();if(keys.length!==media.length)throw new Error('restore-media-verify-failed');for(let i=0;i<media.length;i++){const row=media[i];if(keys[i]!==row.key)throw new Error('restore-media-verify-failed');const blob=await store.get(row.key);if(!(blob instanceof Blob)||blob.size!==Number(row.size)||(blob.type||'application/octet-stream')!==row.type||await axisBackupV2BlobSha(blob)!==row.sha256)throw new Error('restore-media-verify-failed')}}
async function axisBackupV2DeliverReady(){const ready=window.__AXIS_BACKUP_EXPORT_READY__,btn=$('#backupBtn');if(!ready?.file)return false;const file=ready.file;if(navigator.canShare?.({files:[file]})&&navigator.share){try{await navigator.share({files:[file],title:'AXIS 完整备份'});window.__AXIS_BACKUP_EXPORT_READY__=null;if(btn){btn.textContent='建立完整 AXIS 备份';btn.disabled=false}toast('完整备份已保存');return true}catch(e){if(e?.name==='AbortError'){toast('备份仍已准备好 · 可再次保存');return true}console.warn('[AXIS backup share]',e)}}const url=URL.createObjectURL(file),a=D.createElement('a');a.href=url;a.download=file.name||'AXIS.axisbackup';D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);window.__AXIS_BACKUP_EXPORT_READY__=null;if(btn){btn.textContent='建立完整 AXIS 备份';btn.disabled=false}toast('完整备份已保存');return true}
async function backupData(){
 const btn=$('#backupBtn');if(await axisBackupV2DeliverReady())return;if(window.__AXIS_BACKUP_EXPORT_BUSY__)return;window.__AXIS_BACKUP_EXPORT_BUSY__=true;if(btn){btn.disabled=true;btn.textContent='正在准备备份…'}try{toast('正在准备完整备份 · 不会上传');const ready=await axisBackupV2BuildFile();window.__AXIS_BACKUP_EXPORT_READY__=ready;if(btn){btn.disabled=false;btn.textContent='保存完整备份'}toast('备份已准备好 · 再点一次保存')}catch(e){console.error('[AXIS backup v2]',e);window.__AXIS_BACKUP_EXPORT_READY__=null;if(btn){btn.disabled=false;btn.textContent='建立完整 AXIS 备份'}toast('备份失败 · 本机数据未改变')}finally{window.__AXIS_BACKUP_EXPORT_BUSY__=false}
}`;
src=replaceFunctionDeclaration(src,'backupData',v2Runtime,'v2 low-memory export runtime');

const picker=String.raw`async function axisBackupPickRestore(){if(state.active)return toast('请先结束当前训练再恢复备份');let input=$('#axisBackupFileInput');if(!input){input=D.createElement('input');input.id='axisBackupFileInput';input.type='file';input.hidden=true;input.accept='.axisbackup,'+AXIS_BACKUP_MIME+','+AXIS_BACKUP_V2_MIME+',application/json';D.body.appendChild(input);input.addEventListener('change',async()=>{const file=input.files?.[0];input.value='';if(!file)return;try{let bundle,verified;const magic=await file.slice(0,new TextEncoder().encode(AXIS_BACKUP_V2_MAGIC).length).text();if(magic===AXIS_BACKUP_V2_MAGIC){const parsed=await axisBackupV2VerifyFile(file);bundle=parsed.bundle;verified=parsed.verified}else{bundle=JSON.parse(await file.text());verified=await axisBackupVerifyBundle(bundle);verified.format='v1'}window.__AXIS_BACKUP_PENDING__={bundle,verified};axisBackupRenderPreview(bundle,verified)}catch(e){console.warn('[AXIS backup import rejected]',e);window.__AXIS_BACKUP_PENDING__=null;toast('无法恢复 · 备份文件未通过完整性验证')}})}input.click()}`;
src=replaceFunctionDeclaration(src,'axisBackupPickRestore',picker,'v1/v2 restore picker');

const restore=String.raw`async function axisBackupRestorePending(){if(state.active)return toast('请先结束当前训练再恢复备份');const pending=window.__AXIS_BACKUP_PENDING__;if(!pending?.bundle)return toast('请重新选择备份文件');const store=window.__AXIS_MEDIA_STORE__;if(!store?.replaceAll)return toast('恢复能力尚未就绪');const {storage,media}=pending.verified,beforeStorage=axisBackupStorageSnapshot(),beforeMedia=await axisBackupV2CurrentRaw(),btn=$('#backupRestoreConfirm');if(btn){btn.disabled=true;btn.textContent='正在恢复…'}try{const incoming=pending.verified.format==='v2'?media.map(row=>({key:row.key,blob:pending.verified.file.slice(pending.verified.mediaStart+row.offset,pending.verified.mediaStart+row.offset+row.size,row.type)})):await axisBackupMediaDecode(media);await store.replaceAll(incoming);axisBackupStorageReplace(storage);if(pending.verified.format==='v2')await axisBackupV2VerifyCurrent(storage,media);else await axisBackupVerifyCurrent(storage,media);window.__AXIS_BACKUP_PENDING__=null;setText('#backupRestoreIntegrity','完整恢复 · '+storage.length+'/'+storage.length+' 数据 · '+media.length+'/'+media.length+' 媒体');if(btn)btn.textContent='恢复完成';toast('完整恢复已验证');setTimeout(()=>location.reload(),850)}catch(e){console.error('[AXIS restore]',e);let rollbackError=null;try{await store.replaceAll(beforeMedia.map(row=>({key:row.key,blob:row.blob})));axisBackupStorageReplace(beforeStorage);await axisBackupV2VerifyCurrent(beforeStorage,beforeMedia)}catch(r){rollbackError=r;console.error('[AXIS restore rollback]',r)}if(btn){btn.disabled=false;btn.textContent='确认恢复'}setText('#backupRestoreIntegrity',rollbackError?'恢复失败 · 回滚校验异常':'恢复失败 · 已完整回滚');toast(rollbackError?'恢复失败 · 请保留当前页面':'恢复失败 · 原数据已恢复')}}`;
src=replaceFunctionDeclaration(src,'axisBackupRestorePending',restore,'v1/v2 low-memory restore');

src=replaceObjectAssignment(src,'window.__AXIS_MEDIA_STORE__=',"window.__AXIS_MEDIA_STORE__={get:getMedia,put:putMedia,del:deleteMedia,format:AXIS_MEDIA_FORMAT,entries:axisBackupMediaEntries,replaceAll:axisBackupMediaReplaceAll,keys:axisBackupMediaKeys};",'media transport bridge v2 keys');
src=replaceObjectAssignment(src,'window.__AXIS_PORTABLE_BACKUP__=',"window.__AXIS_PORTABLE_BACKUP__={schema:AXIS_BACKUP_SCHEMA,exportSchema:AXIS_BACKUP_V2_SCHEMA,storagePrefix:AXIS_BACKUP_PREFIX,owner:'transport-only',network:false,create:axisBackupCreateBundle,verify:axisBackupVerifyBundle,createFile:axisBackupV2BuildFile,verifyFile:axisBackupV2VerifyFile,restore:async bundle=>{if(state.active)throw new Error('restore-active-session-blocked');const verified=await axisBackupVerifyBundle(bundle);verified.format='v1';window.__AXIS_BACKUP_PENDING__={bundle,verified};return axisBackupRestorePending()},restoreFile:async file=>{if(state.active)throw new Error('restore-active-session-blocked');const parsed=await axisBackupV2VerifyFile(file);window.__AXIS_BACKUP_PENDING__=parsed;return axisBackupRestorePending()}};",'portable backup v2 public transport API');

try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 portable backup iOS memory] PASS · v2 raw-blob file export · no user-path base64/whole-media JSON · sequential media replace · v1 import/API compatibility retained · exact hash verification + rollback preserved');