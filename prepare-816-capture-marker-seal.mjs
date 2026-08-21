import fs from 'node:fs';

const FILE='app.js',BUILD='build-hardened.mjs',ENTRY='v816-capture-entry-seal.js';
const fail=m=>{throw new Error(`[AXIS 8.16 Capture marker seal] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS'))fail('extended canonical Capture bridge missing');
const anchor='maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS};';
const marker="maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS};window.__AXIS_816_CAPTURE_FIELD__={version:'8.16',owner:'app.js',surface:'v816-capture-field',multiPhoto:true,maxPhotos:12,video:true,maxVideoSeconds:60,audio:false,oneRecorder:true,persistenceOwner:'app.js',mediaStore:'axis_v42_media',newStorage:false};";
const hits=src.split(anchor).length-1;
if(hits!==1)fail(`canonical Capture bridge anchor expected once, found ${hits}`);
src=src.replace(anchor,marker);
try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);

const entry=fs.readFileSync(ENTRY,'utf8');
for(const needle of ['__AXIS_816_CAPTURE_ENTRY__','openCanonicalCamera','axisCaptureEntryOwner'])if(!entry.includes(needle))fail(`final entry module missing ${needle}`);
for(const forbidden of ['getUserMedia','new MediaRecorder','indexedDB','localStorage.setItem','sessionStorage.setItem','fetch(','XMLHttpRequest','setInterval('])if(entry.includes(forbidden))fail(`final entry module acquired forbidden ownership: ${forbidden}`);
try{new Function(entry)}catch(e){fail(`entry syntax ${e.message}`)}
let build=fs.readFileSync(BUILD,'utf8');
const buildAnchor="['v815-media-evidence.js','__AXIS_815_MEDIA_EVIDENCE_READY__']";
const buildNext=buildAnchor+",['v816-capture-entry-seal.js','__AXIS_816_CAPTURE_ENTRY_READY__']";
build=once(build,buildAnchor,buildNext,'final Capture entry product module');
fs.writeFileSync(BUILD,build);
console.log('[AXIS 8.16 Capture marker seal] PASS · diagnostic identity shares canonical Capture bridge · final user entry route compiles last and delegates without camera/recorder/storage ownership');
