import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.16 Capture marker seal] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS'))fail('extended canonical Capture bridge missing');
const anchor='maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS};';
const marker="maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS};window.__AXIS_816_CAPTURE_FIELD__={version:'8.16',owner:'app.js',surface:'v816-capture-field',multiPhoto:true,maxPhotos:12,video:true,maxVideoSeconds:60,audio:false,oneRecorder:true,persistenceOwner:'app.js',mediaStore:'axis_v42_media',newStorage:false};";
const hits=src.split(anchor).length-1;
if(hits!==1)fail(`canonical Capture bridge anchor expected once, found ${hits}`);
src=src.replace(anchor,marker);
try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.16 Capture marker seal] PASS · diagnostic identity executes at the same surviving canonical Capture bridge boundary');
