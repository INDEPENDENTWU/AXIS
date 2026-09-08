import fs from 'node:fs';

const APP='app.js',HTML='index.html';
const fail=m=>{throw new Error(`[AXIS 8.21 portable backup] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const code=s=>s.replace(/\\([`$])/g,'$1');

function findDeclarationEnd(src,start,label){
 let open=src.indexOf('{',start);if(open<0)fail(`${label} missing body`);
 let depth=0,quote='',line=false,block=false,escape=false;
 for(let i=open;i<src.length;i++){
  const c=src[i],n=src[i+1];
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
function replaceFunctionDeclaration(src,name,to,label){
 const re=new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`,'g'),hits=[...src.matchAll(re)];
 if(hits.length!==1)fail(`${label} expected one function owner, found ${hits.length}`);
 const start=hits[0].index,end=findDeclarationEnd(src,start,label);
 return src.slice(0,start)+to+src.slice(end)
}
function replaceStatementByPrefix(src,prefix,to,label){
 const hits=[];for(let p=src.indexOf(prefix);p>=0;p=src.indexOf(prefix,p+prefix.length))hits.push(p);
 if(hits.length!==1)fail(`${label} expected one owner statement, found ${hits.length}`);
 const start=hits[0],end=src.indexOf(';',start);if(end<0)fail(`${label} missing terminator`);
 return src.slice(0,start)+to+src.slice(end+1)
}
function findElementById(src,id,label){
 const marker=`id="${id}"`,hits=[];for(let p=src.indexOf(marker);p>=0;p=src.indexOf(marker,p+marker.length))hits.push(p);
 if(hits.length!==1)fail(`${label} expected one element, found ${hits.length}`);
 const at=hits[0],start=src.lastIndexOf('<',at),openEnd=src.indexOf('>',at);
 if(start<0||openEnd<0)fail(`${label} opening boundary missing`);
 const match=/^<([A-Za-z][\w:-]*)\b/.exec(src.slice(start,openEnd+1));if(!match)fail(`${label} tag name missing`);
 const tag=match[1],closeToken=`</${tag}>`,close=src.indexOf(closeToken,openEnd);
 if(close<0)fail(`${label} closing boundary missing`);
 return{start,end:close+closeToken.length,tag}
}
function replaceElementById(src,id,to,label){const b=findElementById(src,id,label);return src.slice(0,b.start)+to+src.slice(b.end)}
function insertAfterElementById(src,id,to,label){const b=findElementById(src,id,label);return src.slice(0,b.end)+to+src.slice(b.end)}

let app=fs.readFileSync(APP,'utf8');
let html=fs.readFileSync(HTML,'utf8');

const mediaBridgeNext=String.raw`async function axisBackupMediaEntries(){
 const db=await openDb();return new Promise((res,rej)=>{let tx=null,keys=null,vals=null,settled=false;const bad=e=>{if(settled)return;settled=true;try{db.close()}catch{}rej(tx?.error||e?.target?.error||e||new Error('media-backup-read-failed'))};try{tx=db.transaction('media','readonly');const store=tx.objectStore('media'),kr=store.getAllKeys(),vr=store.getAll();kr.onsuccess=()=>{keys=kr.result;if(vals)done()};vr.onsuccess=()=>{vals=vr.result;if(keys)done()};kr.onerror=vr.onerror=bad;tx.onabort=bad;tx.onerror=()=>{};function done(){if(settled)return;settled=true;try{const out=keys.map((key,i)=>({key:String(key),blob:mediaDecodeValue(vals[i])}));db.close();res(out)}catch(e){bad(e)}}}catch(e){bad(e)}})
}
async function axisBackupMediaReplaceAll(entries){
 const prepared=[];for(const item of entries||[]){if(!item||typeof item.key!=='string'||!(item.blob instanceof Blob))throw new Error('media-backup-entry-invalid');prepared.push({key:item.key,value:await mediaEncodeValue(item.blob)})}
 const db=await openDb();return new Promise((res,rej)=>{let tx=null,settled=false;const bad=e=>{if(settled)return;settled=true;try{db.close()}catch{}rej(tx?.error||e?.target?.error||e||new Error('media-backup-write-failed'))};try{tx=db.transaction('media','readwrite');const store=tx.objectStore('media');store.clear();for(const item of prepared)store.put(item.value,item.key);tx.oncomplete=()=>{if(settled)return;settled=true;db.close();res()};tx.onabort=bad;tx.onerror=()=>{}}catch(e){bad(e)}})
}
window.__AXIS_MEDIA_STORE__={get:getMedia,put:putMedia,del:deleteMedia,format:AXIS_MEDIA_FORMAT,entries:axisBackupMediaEntries,replaceAll:axisBackupMediaReplaceAll};`;
app=replaceStatementByPrefix(app,'window.__AXIS_MEDIA_STORE__=',mediaBridgeNext,'canonical media bridge extension');

const newBackup=code(String.raw`const AXIS_BACKUP_SCHEMA='axis.backup.v1',AXIS_BACKUP_MIME='application/vnd.axis.backup+json',AXIS_BACKUP_PREFIX='axis_';
const axisBackupUtf8Bytes=s=>new TextEncoder().encode(String(s)).byteLength;
function axisBackupCanonical(v){if(Array.isArray(v))return '['+v.map(axisBackupCanonical).join(',')+']';if(v&&typeof v==='object'){return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+axisBackupCanonical(v[k])).join(',')+'}'}return JSON.stringify(v)}
async function axisBackupSha256(v){const b=new TextEncoder().encode(typeof v==='string'?v:axisBackupCanonical(v)),h=await crypto.subtle.digest('SHA-256',b);return Array.from(new Uint8Array(h),x=>x.toString(16).padStart(2,'0')).join('')}
function axisBackupStorageSnapshot(){const out=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith(AXIS_BACKUP_PREFIX))out.push({key,value:localStorage.getItem(key)??''})}return out.sort((a,b)=>a.key.localeCompare(b.key))}
function axisBackupStorageReplace(entries){const next=new Map((entries||[]).map(x=>[String(x.key),String(x.value)]));for(const row of axisBackupStorageSnapshot())if(!next.has(row.key))localStorage.removeItem(row.key);for(const [key,value] of next)localStorage.setItem(key,value)}
function axisBackupB64FromBuffer(buf){const u=new Uint8Array(buf),step=0x8000;let s='';for(let i=0;i<u.length;i+=step)s+=String.fromCharCode(...u.subarray(i,Math.min(i+step,u.length)));return btoa(s)}
function axisBackupBlobFromB64(b64,type){const raw=atob(String(b64||'')),step=0x8000,parts=[];for(let i=0;i<raw.length;i+=step){const end=Math.min(i+step,raw.length),u=new Uint8Array(end-i);for(let j=i;j<end;j++)u[j-i]=raw.charCodeAt(j);parts.push(u)}return new Blob(parts,{type:type||'application/octet-stream'})}
async function axisBackupMediaSnapshot(){const store=window.__AXIS_MEDIA_STORE__;if(!store?.entries)throw new Error('canonical-media-backup-unavailable');const rows=await store.entries(),out=[];for(const row of rows){if(!row||typeof row.key!=='string'||!(row.blob instanceof Blob))throw new Error('canonical-media-entry-invalid');const bytes=await row.blob.arrayBuffer();out.push({key:String(row.key),type:row.blob.type||'application/octet-stream',size:bytes.byteLength,encoding:'base64',data:axisBackupB64FromBuffer(bytes)})}return out.sort((a,b)=>a.key.localeCompare(b.key))}
async function axisBackupMediaDecode(entries){const out=[];for(const row of entries||[]){if(!row||typeof row.key!=='string'||row.encoding!=='base64'||typeof row.data!=='string')throw new Error('backup-media-invalid');const blob=axisBackupBlobFromB64(row.data,row.type);if(Number(row.size)!==blob.size)throw new Error('backup-media-size-mismatch');out.push({key:row.key,blob})}return out}
function axisBackupSummary(storage,media){let sessions=0,events=0;const core=storage.find(x=>x.key==='axis_v60_state');if(core){try{const c=JSON.parse(core.value);sessions=Array.isArray(c.sessions)?c.sessions.length:0;events=(c.sessions||[]).reduce((n,s)=>n+(Array.isArray(s?.events)?s.events.length:0),0)+(Array.isArray(c.active?.events)?c.active.events.length:0)}catch{}}return{storageCount:storage.length,storageBytes:storage.reduce((n,x)=>n+axisBackupUtf8Bytes(x.key)+axisBackupUtf8Bytes(x.value),0),mediaCount:media.length,mediaBytes:media.reduce((n,x)=>n+(Number(x.size)||0),0),sessions,events}}
function axisBackupSource(){return{platform:'web',appVersion:String(window.__AXIS_VERSION__||VERSION||'8.21'),domain:'axis.domain.v1',data:'axis.data.v1',exchange:'axis.exchange.v1',gitSha:String(window.__AXIS_GIT_SHA__||document.documentElement.dataset.axisGitSha||'unknown'),origin:location.origin}}
async function axisBackupCreateBundle(){save();const storage=axisBackupStorageSnapshot(),media=await axisBackupMediaSnapshot(),manifest=axisBackupSummary(storage,media),payload={schema:AXIS_BACKUP_SCHEMA,exportedAt:new Date().toISOString(),source:axisBackupSource(),webOriginSnapshot:{storage,media},manifest};return{...payload,integrity:{algorithm:'SHA-256',value:await axisBackupSha256(payload)}}}
async function axisBackupVerifyBundle(bundle){if(!bundle||bundle.schema!==AXIS_BACKUP_SCHEMA)throw new Error('backup-schema-unsupported');if(bundle.integrity?.algorithm!=='SHA-256'||typeof bundle.integrity?.value!=='string')throw new Error('backup-integrity-missing');const payload={schema:bundle.schema,exportedAt:bundle.exportedAt,source:bundle.source,webOriginSnapshot:bundle.webOriginSnapshot,manifest:bundle.manifest},actual=await axisBackupSha256(payload);if(actual!==bundle.integrity.value)throw new Error('backup-integrity-mismatch');const storage=bundle.webOriginSnapshot?.storage,media=bundle.webOriginSnapshot?.media;if(!Array.isArray(storage)||!Array.isArray(media))throw new Error('backup-snapshot-invalid');const storageKeys=new Set(),mediaKeys=new Set();for(const row of storage){if(!row||typeof row.key!=='string'||!row.key.startsWith(AXIS_BACKUP_PREFIX)||typeof row.value!=='string'||storageKeys.has(row.key))throw new Error('backup-storage-invalid');storageKeys.add(row.key)}for(const row of media){if(!row||typeof row.key!=='string'||typeof row.type!=='string'||row.encoding!=='base64'||typeof row.data!=='string'||!Number.isFinite(Number(row.size))||Number(row.size)<0||mediaKeys.has(row.key))throw new Error('backup-media-invalid');mediaKeys.add(row.key)}const summary=axisBackupSummary(storage,media);for(const k of ['storageCount','storageBytes','mediaCount','mediaBytes'])if(Number(bundle.manifest?.[k])!==Number(summary[k]))throw new Error('backup-manifest-mismatch');return{payload,storage,media,summary}}
async function axisBackupShare(bundle){const text=JSON.stringify(bundle),name=\`AXIS-\${new Date().toISOString().slice(0,10)}.axisbackup\`,file=new File([text],name,{type:AXIS_BACKUP_MIME});if(navigator.canShare?.({files:[file]})&&navigator.share){try{await navigator.share({files:[file],title:'AXIS 完整备份'});return}catch(e){if(e?.name==='AbortError')return}}const url=URL.createObjectURL(file),a=D.createElement('a');a.href=url;a.download=name;D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
async function backupData(){try{toast('正在建立完整备份');const bundle=await axisBackupCreateBundle();await axisBackupShare(bundle);toast(\`完整备份 · \${bundle.manifest.storageCount} 项数据 · \${bundle.manifest.mediaCount} 个媒体\`)}catch(e){console.error('[AXIS backup]',e);toast('备份失败 · 本机数据未改变')}}
function axisBackupRestoreSheet(){return $('#backupRestoreSheet')}
function axisBackupFormatBytes(n){return fmtBytes(Math.max(0,Number(n)||0))}
function axisBackupRenderPreview(bundle,verified){const m=verified.summary,s=bundle.source||{};setText('#backupRestoreSource',\`\${s.appVersion||'AXIS'} · \${s.origin||'未知来源'}\`);setText('#backupRestoreIntegrity','完整性验证通过');setText('#backupRestoreSessions',String(m.sessions));setText('#backupRestoreEvents',String(m.events));setText('#backupRestoreStorage',String(m.storageCount));setText('#backupRestoreMedia',\`\${m.mediaCount} · \${axisBackupFormatBytes(m.mediaBytes)}\`);const btn=$('#backupRestoreConfirm');if(btn){btn.disabled=false;btn.dataset.ready='1'}axisBackupRestoreSheet()?openSheet('backupRestoreSheet'):null}
async function axisBackupPickRestore(){if(state.active)return toast('请先结束当前训练再恢复备份');let input=$('#axisBackupFileInput');if(!input){input=D.createElement('input');input.id='axisBackupFileInput';input.type='file';input.hidden=true;input.accept='.axisbackup,'+AXIS_BACKUP_MIME+',application/json';D.body.appendChild(input);input.addEventListener('change',async()=>{const file=input.files?.[0];input.value='';if(!file)return;try{const bundle=JSON.parse(await file.text()),verified=await axisBackupVerifyBundle(bundle);window.__AXIS_BACKUP_PENDING__={bundle,verified};axisBackupRenderPreview(bundle,verified)}catch(e){console.warn('[AXIS backup import rejected]',e);window.__AXIS_BACKUP_PENDING__=null;toast('无法恢复 · 备份文件未通过完整性验证')}})}input.click()}
async function axisBackupVerifyCurrent(storage,media){const nowStorage=axisBackupStorageSnapshot();if(axisBackupCanonical(nowStorage)!==axisBackupCanonical(storage))throw new Error('restore-storage-verify-failed');const nowMedia=await axisBackupMediaSnapshot();const compact=x=>(x||[]).map(r=>({key:r.key,type:r.type,size:r.size,encoding:r.encoding,data:r.data}));if(axisBackupCanonical(compact(nowMedia))!==axisBackupCanonical(compact(media)))throw new Error('restore-media-verify-failed')}
async function axisBackupRestorePending(){if(state.active)return toast('请先结束当前训练再恢复备份');const pending=window.__AXIS_BACKUP_PENDING__;if(!pending?.bundle)return toast('请重新选择备份文件');const store=window.__AXIS_MEDIA_STORE__;if(!store?.replaceAll)return toast('恢复能力尚未就绪');const {storage,media}=pending.verified,beforeStorage=axisBackupStorageSnapshot(),beforeMedia=await axisBackupMediaSnapshot(),incoming=await axisBackupMediaDecode(media),rollbackMedia=await axisBackupMediaDecode(beforeMedia);const btn=$('#backupRestoreConfirm');if(btn){btn.disabled=true;btn.textContent='正在恢复…'}try{await store.replaceAll(incoming);axisBackupStorageReplace(storage);await axisBackupVerifyCurrent(storage,media);window.__AXIS_BACKUP_PENDING__=null;setText('#backupRestoreIntegrity',\`完整恢复 · \${storage.length}/\${storage.length} 数据 · \${media.length}/\${media.length} 媒体\`);if(btn)btn.textContent='恢复完成';toast('完整恢复已验证');setTimeout(()=>location.reload(),850)}catch(e){console.error('[AXIS restore]',e);let rollbackError=null;try{await store.replaceAll(rollbackMedia);axisBackupStorageReplace(beforeStorage);await axisBackupVerifyCurrent(beforeStorage,beforeMedia)}catch(r){rollbackError=r;console.error('[AXIS restore rollback]',r)}if(btn){btn.disabled=false;btn.textContent='确认恢复'}setText('#backupRestoreIntegrity',rollbackError?'恢复失败 · 回滚校验异常':'恢复失败 · 已完整回滚');toast(rollbackError?'恢复失败 · 请保留当前页面':'恢复失败 · 原数据已恢复')}}
window.__AXIS_PORTABLE_BACKUP__={schema:AXIS_BACKUP_SCHEMA,storagePrefix:AXIS_BACKUP_PREFIX,owner:'transport-only',network:false,create:axisBackupCreateBundle,verify:axisBackupVerifyBundle,restore:async bundle=>{if(state.active)throw new Error('restore-active-session-blocked');const verified=await axisBackupVerifyBundle(bundle);window.__AXIS_BACKUP_PENDING__={bundle,verified};return axisBackupRestorePending()}};`);
app=replaceFunctionDeclaration(app,'backupData',newBackup,'legacy backup owner convergence');

const backupBinding="$('#backupBtn').onclick=backupData;";
app=replaceStatementByPrefix(app,"$('#backupBtn').onclick=",backupBinding+"$('#restoreBackupBtn').onclick=axisBackupPickRestore;$('#backupRestoreConfirm').onclick=axisBackupRestorePending;",'backup/restore bindings');

const backupActions='<button id="backupBtn">建立完整 AXIS 备份</button><button id="restoreBackupBtn">从 AXIS 备份恢复</button>';
html=replaceElementById(html,'backupBtn',backupActions,'storage backup actions');
html=insertAfterElementById(html,'restoreBackupBtn','<div class="axisBackupNote">备份包含 AXIS 本机数据与媒体，可用于迁移到另一 AXIS 网域。</div>','storage backup note');

const restoreSheet=String.raw`<div class="sheetWrap" id="backupRestoreSheet"><div class="sheet axisBackupRestoreSheet">
  <div class="grabber"></div><div class="sheetHead"><b>恢复 AXIS 备份</b><button class="closeBtn" data-close="backupRestoreSheet">×</button></div>
  <div class="axisBackupVerify"><span id="backupRestoreIntegrity">等待验证</span><b id="backupRestoreSource">—</b></div>
  <div class="axisBackupStats"><div><span>训练</span><b id="backupRestoreSessions">0</b></div><div><span>记录</span><b id="backupRestoreEvents">0</b></div><div><span>数据项</span><b id="backupRestoreStorage">0</b></div><div><span>媒体</span><b id="backupRestoreMedia">0</b></div></div>
  <p class="axisBackupWarning">恢复会用这份备份替换此 AXIS 网域的本机数据。开始前会先建立本机回滚快照；只有数据与媒体逐项验证一致后才会完成。</p>
  <button class="primary" id="backupRestoreConfirm" disabled>确认恢复</button>
</div></div>`;
html=once(html,'</body>',restoreSheet+'\n</body>','restore sheet');

const backupStyle=String.raw`<style id="axis821PortableBackupStyle">
#storageSheet .storageActions{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#storageSheet #backupBtn,#storageSheet #restoreBackupBtn,#storageSheet #clearVideos{grid-column:1/-1;min-height:46px}#storageSheet #backupBtn{grid-column:1/-1;background:var(--accent);color:#fff}#storageSheet #restoreBackupBtn{grid-column:1/-1;background:#151820}.axisBackupNote{margin:9px 2px 2px;color:var(--dim);font-size:10px;line-height:1.55}.axisBackupRestoreSheet{padding-bottom:calc(22px + env(safe-area-inset-bottom))}.axisBackupVerify{padding:14px 0;border-bottom:1px solid var(--line2)}.axisBackupVerify span{display:block;color:#aeb3ff;font-size:11px;font-weight:650}.axisBackupVerify b{display:block;margin-top:5px;color:var(--muted);font-size:10px;font-weight:550;overflow-wrap:anywhere}.axisBackupStats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin:14px 0;background:var(--line2)}.axisBackupStats div{min-height:70px;padding:12px;background:var(--bg2);display:flex;flex-direction:column;justify-content:space-between}.axisBackupStats span{color:var(--dim);font-size:10px}.axisBackupStats b{font-size:15px;font-variant-numeric:tabular-nums}.axisBackupWarning{margin:0 0 14px;color:var(--muted);font-size:10.5px;line-height:1.65}.axisBackupRestoreSheet #backupRestoreConfirm{width:100%;min-height:52px;border-radius:14px}.axisBackupRestoreSheet #backupRestoreConfirm:disabled{opacity:.45}
@media(max-width:390px){.axisBackupStats div{min-height:66px}.axisBackupRestoreSheet #backupRestoreConfirm{min-height:50px}}
</style>`;
html=once(html,'</head>',backupStyle+'\n</head>','backup style');

try{new Function(app)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(APP,app);fs.writeFileSync(HTML,html);
console.log('[AXIS 8.21 portable backup] PASS · structural owner convergence · exact axis_* localStorage + canonical media bytes · SHA-256 integrity · staged restore · active-session block · verified rollback · Safari file share/download · no network owner');