import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.17 media master contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),app=read('app.js'),wm=read('v8710-watermark.js'),media=read('v815-media-evidence.js');

if(contract.publicVersion!=='8.17'||contract.stableBaseVersion!=='8.17')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.17'||info.baseVersion!=='8.17')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['interactionConvergence817','captureField816','captureExistingMediaStore816','mediaEvidenceWarmBeforeCommit8151','watermarkSinglePhotoCompositor8151'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);

for(const src of [app,runtime]){
 for(const needle of [
  'function masterMediaRef(ref)',
  "'F-RAW-'",
  "'V-RAW-'",
  'async function putMasterMedia(ref,blob)',
  'async function getMasterMedia(ref)',
  '__AXIS_MEDIA_MASTER__',
  "if((state.prefs.watermark.photoMode||'wm')==='wm')await putMasterMedia(ref,source)",
  "if((state.prefs.watermark.videoMode||'wm')==='wm'){await putMasterMedia(e.clipRef,vb);vb=await watermarkVideoBlob(vb,e,eq)}",
  'await deleteMedia(masterMediaRef(r))',
  'await deleteMedia(masterMediaRef(e.clipRef))'
 ])if(!src.includes(needle))fail(`app media-master contract missing ${needle}`);
 if(!src.includes("DB='axis_v42_media'"))fail('existing media database owner disappeared');
 if((src.match(/indexedDB\.open\(/g)||[]).length!==1)fail('additional IndexedDB owner introduced');
 for(const forbidden of ['axis_v817_media','axis_817_media','axis_media_master'])if(src.includes(forbidden))fail(`new media database/schema survived ${forbidden}`);
}

for(const src of [wm,runtime]){
 for(const needle of ['function masterRef(ref)',"const clean=await dbGet(masterRef(ref))||b",'__AXIS_817_MEDIA_MASTER_WATERMARK__',"source:'clean-master-first'",'canonicalDerivative:true'])if(!src.includes(needle))fail(`watermark master-first contract missing ${needle}`);
}

for(const src of [media,runtime]){
 for(const needle of ['const masterRef=ref=>',"await bridge.get(masterRef(ref))||await bridge.get(ref)",'__AXIS_817_MEDIA_MASTER_EVIDENCE__','masterFirst:true','fallbackCanonical:true'])if(!src.includes(needle))fail(`Evidence clean-master contract missing ${needle}`);
}
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','XMLHttpRequest'])if(media.includes(forbidden))fail(`Media Evidence acquired forbidden owner ${forbidden}`);

if(!app.includes('frameRefs:[]')||!app.includes('e.frameRefs.push(ref)')||!app.includes('e.clipRef=`V-${e.id}`'))fail('canonical event media pointer schema drift');
if((app.match(/DB='axis_v42_media'/g)||[]).length!==1)fail('media database identifier duplicated');

info.gates=info.gates||{};
Object.assign(info.gates,{
 mediaMasterRetained817:true,
 watermarkNonDestructive817:true,
 mediaMasterSameStore817:true,
 mediaMasterNoSchemaChange817:true,
 mediaMasterDeleteParity817:true,
 evidencePrefersCleanMaster817:true,
 canonicalWatermarkDerivative817:true
});
info.axis817=info.axis817||{};
info.axis817.mediaMaster={
 refinement:true,
 owner:'app.js',
 database:'axis_v42_media',
 companionKeys:{photo:'F-RAW-<event>-<index>',video:'V-RAW-<event>'},
 canonicalPointersUnchanged:true,
 canonicalDerivative:'watermarked-when-enabled',
 cleanMaster:'best-effort-local-retention',
 evidenceRead:'clean-master-first-with-canonical-fallback',
 deletionParity:true,
 newDatabase:false,
 newObjectStore:false,
 newEventPointerSchema:false,
 newRecorder:false,
 network:false,
 ai:false
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.17 media master contract] PASS · same-store clean masters · canonical watermarked derivatives · Evidence master-first · deletion parity · no new persistence owner');
