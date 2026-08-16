import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8.2 media store: ${m}`)};
const read=f=>fs.readFileSync(f,'utf8');
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
  const FILE='app.js';let src=read(FILE);
  const old=`async function openDb(){return new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('media'))q.result.createObjectStore('media')};q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function putMedia(k,b){const db=await openDb();return new Promise((res,rej)=>{const tx=db.transaction('media','readwrite');tx.objectStore('media').put(b,k);tx.oncomplete=()=>{db.close();res()};tx.onerror=()=>{db.close();rej(tx.error)}})}
async function getMedia(k){const db=await openDb();return new Promise((res,rej)=>{const tx=db.transaction('media','readonly'),q=tx.objectStore('media').get(k);q.onsuccess=()=>{db.close();res(q.result||null)};q.onerror=()=>{db.close();rej(q.error)}})}`;
  const next=`const AXIS_MEDIA_FORMAT='axis-media-arraybuffer-v1';
async function mediaEncodeValue(b){if(!(b instanceof Blob))return b;return{__axisMedia:AXIS_MEDIA_FORMAT,type:b.type||'application/octet-stream',bytes:await b.arrayBuffer()}}
function mediaDecodeValue(v){if(v instanceof Blob)return v;if(v&&v.__axisMedia===AXIS_MEDIA_FORMAT&&v.bytes)return new Blob([v.bytes],{type:v.type||'application/octet-stream'});return v||null}
async function openDb(){return new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('media'))q.result.createObjectStore('media')};q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error||new Error('media-db-open-failed'))})}
async function putMedia(k,b){const db=await openDb(),value=await mediaEncodeValue(b);return new Promise((res,rej)=>{let tx=null,q=null,settled=false;const bad=e=>{if(settled)return;settled=true;const raw=q?.error||tx?.error||e?.target?.error||e;try{db.close()}catch{}rej(raw instanceof Error||raw instanceof DOMException?raw:new Error('media-write-failed'))};try{tx=db.transaction('media','readwrite');q=tx.objectStore('media').put(value,k)}catch(e){bad(e);return}q.onerror=bad;tx.onabort=bad;tx.onerror=()=>{};tx.oncomplete=()=>{if(settled)return;settled=true;db.close();res()}})}
async function getMedia(k){const db=await openDb();return new Promise((res,rej)=>{let tx=null,q=null,settled=false;const bad=e=>{if(settled)return;settled=true;const raw=q?.error||tx?.error||e?.target?.error||e;try{db.close()}catch{}rej(raw instanceof Error||raw instanceof DOMException?raw:new Error('media-read-failed'))};try{tx=db.transaction('media','readonly');q=tx.objectStore('media').get(k)}catch(e){bad(e);return}q.onsuccess=()=>{if(settled)return;settled=true;db.close();res(mediaDecodeValue(q.result))};q.onerror=bad;tx.onabort=bad;tx.onerror=()=>{}})}
window.__AXIS_MEDIA_STORE__={get:getMedia,put:putMedia,del:deleteMedia,format:AXIS_MEDIA_FORMAT};`;
  src=once(src,old,next,'canonical app media store');
  write(FILE,src);
}

{
  const FILE='v61.js';let src=read(FILE);
  const old=`async function deleteMediaKey(key){if(!key||!indexedDB)return;try{const db=await new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});await new Promise((res,rej)=>{const tx=db.transaction('media','readwrite');tx.objectStore('media').delete(key);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});db.close()}catch{}}`;
  const next=`async function deleteMediaKey(key){if(!key)return;try{const s=window.__AXIS_MEDIA_STORE__;if(!s?.del)throw new Error('canonical-media-store-unavailable');await s.del(key)}catch{}}`;
  src=once(src,old,next,'v61 delegates media deletion');
  write(FILE,src);
}

{
  const FILE='v877-runtime.js';let src=read(FILE);
  const old=`async function dbGet(k){return new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>{const db=q.result,tx=db.transaction('media','readonly'),r=tx.objectStore('media').get(k);r.onsuccess=()=>{db.close();res(r.result||null)};r.onerror=()=>{db.close();rej(r.error)}};q.onerror=()=>rej(q.error)})}
async function dbPut(k,b){return new Promise((res,rej)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>{const db=q.result,tx=db.transaction('media','readwrite');tx.objectStore('media').put(b,k);tx.oncomplete=()=>{db.close();res()};tx.onerror=()=>{db.close();rej(tx.error)}};q.onerror=()=>rej(q.error)})}`;
  const next=`async function dbGet(k){const s=window.__AXIS_MEDIA_STORE__;if(!s?.get)throw new Error('canonical-media-store-unavailable');return s.get(k)}
async function dbPut(k,b){const s=window.__AXIS_MEDIA_STORE__;if(!s?.put)throw new Error('canonical-media-store-unavailable');return s.put(k,b)}`;
  src=once(src,old,next,'v877 delegates media persistence');
  write(FILE,src);
}

{
  const FILE='v8710-watermark.js';let src=read(FILE);
  const old=`function dbGet(k){return new Promise((ok,no)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>{const db=q.result,tx=db.transaction('media','readonly'),r=tx.objectStore('media').get(k);r.onsuccess=()=>{db.close();ok(r.result||null)};r.onerror=()=>{db.close();no(r.error)}};q.onerror=()=>no(q.error)})}
function dbPut(k,b){return new Promise((ok,no)=>{const q=indexedDB.open(DB,1);q.onsuccess=()=>{const db=q.result,tx=db.transaction('media','readwrite');tx.objectStore('media').put(b,k);tx.oncomplete=()=>{db.close();ok()};tx.onerror=()=>{db.close();no(tx.error)}};q.onerror=()=>no(q.error)})}`;
  const next=`function dbGet(k){const s=window.__AXIS_MEDIA_STORE__;return s?.get?s.get(k):Promise.reject(new Error('canonical-media-store-unavailable'))}
function dbPut(k,b){const s=window.__AXIS_MEDIA_STORE__;return s?.put?s.put(k,b):Promise.reject(new Error('canonical-media-store-unavailable'))}`;
  src=once(src,old,next,'v8710 watermark delegates media persistence');
  write(FILE,src);
}

const directOwners=[];
for(const ent of fs.readdirSync('.',{withFileTypes:true})){
  if(!ent.isFile()||!ent.name.endsWith('.js'))continue;
  const src=read(ent.name),hits=(src.match(/indexedDB\.open\(DB,1\)/g)||[]).length;
  if(hits)directOwners.push({file:ent.name,hits,declaresMediaDb:/axis_v42_media/.test(src)});
}
console.log('[AXIS 8.8.2 media direct DB owners]',JSON.stringify(directOwners));
const foreign=directOwners.filter(x=>x.file!=='app.js');
if(foreign.length)fail(`parallel direct media DB owner(s) remain · ${foreign.map(x=>`${x.file}:${x.hits}`).join(', ')}`);
if(directOwners.length!==1||directOwners[0].hits!==1)fail(`canonical app media DB open count unexpected · ${JSON.stringify(directOwners)}`);

const app=read('app.js');
if(!app.includes("AXIS_MEDIA_FORMAT='axis-media-arraybuffer-v1'"))fail('arraybuffer media format missing');
if(!app.includes('window.__AXIS_MEDIA_STORE__={get:getMedia,put:putMedia,del:deleteMedia'))fail('canonical media store bridge missing');
console.log('[AXIS 8.8.2 media store] PASS · app.js sole IndexedDB media owner · Blob compatibility read · ArrayBuffer structured-clone write · v61/v877/watermark delegate');
