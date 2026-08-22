import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.17.1 source-first media contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),app=read('app.js'),wm=read('v8710-watermark.js'),media=read('v815-media-evidence.js');

if(contract.publicVersion!=='8.17'||contract.stableBaseVersion!=='8.17')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.17'||info.baseVersion!=='8.17')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['interactionConvergence817','captureField816','captureExistingMediaStore816','watermarkSinglePhotoCompositor8151','mediaEvidenceWarmBeforeCommit8151'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);

for(const src of [app,runtime]){
 for(const needle of [
  'sourceFrameRefs:[]',
  "sourceRef='S-'+e.id+'-'+i",
  "sourceClipRef='SV-'+e.id",
  "sourcePolicy:'clean-sidecar-v1'",
  'function source8171EventForRef(ref)',
  'function source8171Ref(ref)',
  'async function source8171Get(ref)',
  '__AXIS_MEDIA_SOURCE__',
  "sourcePolicy:'clean-sidecar-v1'",
  'canonicalFallback:true',
  '__AXIS_8171_SOURCE_MEDIA__'
 ])if(!src.includes(needle))fail(`source media contract missing ${needle}`);
 if(!src.includes("DB='axis_v42_media'"))fail('existing media store owner disappeared');
 if((src.match(/indexedDB\.open\(/g)||[]).length!==1)fail('additional IndexedDB owner introduced');
 for(const forbidden of ['axis_v8171_media','axis_8171_media','F-RAW-','V-RAW-'])if(src.includes(forbidden))fail(`competing source schema survived ${forbidden}`);
}

for(const src of [wm,runtime])for(const needle of [
 "source=e.sourceFrameRefs?.[i]||ref",
 'b=await dbGet(source)||await dbGet(ref)',
 '__AXIS_8171_WATERMARK_SOURCE__',
 "photoSource:'clean-sidecar-first'",
 "canonicalOutput:'frameRefs'",
 'legacyFallback:true',
 'destructive:false'
])if(!src.includes(needle))fail(`watermark source-first contract missing ${needle}`);

for(const src of [media,runtime])for(const needle of [
 'const sourceRead=()=>window.__AXIS_MEDIA_SOURCE__;',
 "source?.readOnly&&typeof source.get==='function'",
 'blob=await source.get(ref)',
 '__AXIS_8171_EVIDENCE_SOURCE__',
 'cleanSourceFirst:true',
 'canonicalFallback:true'
])if(!src.includes(needle))fail(`Evidence source-first contract missing ${needle}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','XMLHttpRequest'])if(media.includes(forbidden))fail(`Media Evidence acquired forbidden owner ${forbidden}`);

info.gates=info.gates||{};
Object.assign(info.gates,{
 captureCleanSourceSidecar8171:true,
 mediaSourceBridge8171:true,
 watermarkSourceFirst8171:true,
 evidenceSourceFirst8171:true,
 mediaCanonicalFallback8171:true,
 mediaEventPointersUnchanged8171:true,
 mediaNoNewPersistence8171:true
});
info.axis8171=info.axis8171||{};
info.axis8171.sourceMedia={
 refinement:true,
 sourceStore:'axis_v42_media',
 sourcePolicy:'clean-sidecar-v1',
 sourceRefs:{photo:'sourceFrameRefs[] / S-*',video:'sourceClipRef / SV-*'},
 canonicalRefs:{photo:'frameRefs[] / F-*',video:'clipRef / V-*'},
 canonicalPointersUnchanged:true,
 sourceReadBridge:'window.__AXIS_MEDIA_SOURCE__',
 watermarkInput:'clean-source-first',
 evidenceInput:'clean-source-first',
 legacyFallback:'canonical-ref',
 newDatabase:false,
 newObjectStore:false,
 newRecorder:false,
 newNetwork:false,
 newAi:false
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.17.1 source-first media contract] PASS · S/SV clean master · F/V canonical derivatives · watermark/Evidence source-first · legacy fallback · no new persistence');
