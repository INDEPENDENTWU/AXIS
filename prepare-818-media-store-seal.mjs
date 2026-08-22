import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 media-store seal] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

let s=read(FILE);
const FORMAT="const AXIS_MEDIA_FORMAT='axis-media-arraybuffer-v1';";
if(!s.includes(FORMAT)){
 const anchor='async function openDb(){';
 const helpers=`const AXIS_MEDIA_FORMAT='axis-media-arraybuffer-v1';
async function mediaEncodeValue(b){if(!(b instanceof Blob))return b;return{__axisMedia:AXIS_MEDIA_FORMAT,type:b.type||'application/octet-stream',bytes:await b.arrayBuffer()}}
function mediaDecodeValue(v){if(v instanceof Blob)return v;if(v&&v.__axisMedia===AXIS_MEDIA_FORMAT&&v.bytes)return new Blob([v.bytes],{type:v.type||'application/octet-stream'});return v||null}
`;
 s=once(s,anchor,helpers+anchor,'restore WebKit-safe media codec');
}
for(const needle of [
 FORMAT,
 'async function mediaEncodeValue(b)',
 'function mediaDecodeValue(v)',
 "new Blob([v.bytes],{type:v.type||'application/octet-stream'})",
 'window.__AXIS_MEDIA_STORE__={get:getMedia,put:putMedia,del:deleteMedia,format:AXIS_MEDIA_FORMAT}'
])if(!s.includes(needle))fail(`canonical WebKit-safe media layer missing ${needle}`);
if((s.match(/indexedDB\.open\(DB,1\)/g)||[]).length!==1)fail('app media IndexedDB owner count drift');
if(s.includes('cv.captureStream(15)'))fail('historical 15fps video compositor returned');
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
write(FILE,s);
console.log('[AXIS 8.18 media-store seal] PASS · ArrayBuffer structured-clone codec restored · app.js sole IndexedDB owner · 30fps video compositor retained');
