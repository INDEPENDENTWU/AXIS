import fs from 'node:fs';

const APP='app.js',WM='v8710-watermark.js',MEDIA='v815-media-evidence.js';
const fail=m=>{throw new Error(`[AXIS 8.17 media master] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

/*
 * AXIS 8.17 Media Master refinement
 *
 * Keep the canonical watermarked asset exactly where every inherited reader expects
 * it, but retain the untouched camera/recorder blob beside it in the existing
 * axis_v42_media store under a deterministic companion key:
 *
 *   F-<event>-<n>  -> F-RAW-<event>-<n>
 *   V-<event>      -> V-RAW-<event>
 *
 * This is intentionally additive: no new IndexedDB database, object store, event
 * media pointer schema, recorder, network owner or account dependency is created.
 * If retaining the master fails (for example quota pressure), canonical save remains
 * authoritative and is not failed by the refinement.
 */
{
 let app=read(APP);
 if(!app.includes("DB='axis_v42_media'"))fail('canonical media database owner drift');
 if(!app.includes('if(state.clip?.blob)'))fail('8.17 explicit video retention must converge first');

 const helper=`function masterMediaRef(ref){const s=String(ref||'');if(s.startsWith('F-'))return 'F-RAW-'+s.slice(2);if(s.startsWith('V-'))return 'V-RAW-'+s.slice(2);return 'RAW-'+s}\nasync function putMasterMedia(ref,blob){if(!ref||!blob)return false;try{await putMedia(masterMediaRef(ref),blob);return true}catch(e){console.warn('[AXIS] clean media master retention skipped',e);return false}}\nasync function getMasterMedia(ref){if(!ref)return null;try{return await getMedia(masterMediaRef(ref))||await getMedia(ref)}catch{return getMedia(ref).catch(()=>null)}}\ntry{window.__AXIS_MEDIA_MASTER__={version:'8.17',owner:'app.js',database:'axis_v42_media',sameStore:true,newSchema:false,newRecorder:false,nonDestructive:true,keyFor:masterMediaRef,get:getMasterMedia,has:async ref=>!!(await getMedia(masterMediaRef(ref)).catch(()=>null))}}catch{}\n`;
 app=regexOnce(app,/(async function mediaUrl\(k\)\{)/,helper+'$1','media master helper bridge');

 const photoOld="for(let i=0;i<state.frames.length;i++){const blob=await finalizeFrame(state.frames[i],e,eq),ref=`F-${e.id}-${i}`;await putMedia(ref,blob);e.frameRefs.push(ref);e.photoBytes+=blob.size}";
 const photoNew="for(let i=0;i<state.frames.length;i++){const source=state.frames[i].blob,blob=await finalizeFrame(state.frames[i],e,eq),ref=`F-${e.id}-${i}`;if((state.prefs.watermark.photoMode||'wm')==='wm')await putMasterMedia(ref,source);await putMedia(ref,blob);e.frameRefs.push(ref);e.photoBytes+=blob.size}";
 app=once(app,photoOld,photoNew,'photo clean-master retention');

 const videoOld="if(state.clip?.blob){let vb=state.clip.blob;if((state.prefs.watermark.videoMode||'wm')==='wm')vb=await watermarkVideoBlob(vb,e,eq);e.clipRef=`V-${e.id}`;e.clipType=vb.type;e.videoBytes=vb.size;e.videoWatermarked=(state.prefs.watermark.videoMode||'wm')==='wm';await putMedia(e.clipRef,vb)}";
 const videoNew="if(state.clip?.blob){let vb=state.clip.blob;e.clipRef=`V-${e.id}`;if((state.prefs.watermark.videoMode||'wm')==='wm'){await putMasterMedia(e.clipRef,vb);vb=await watermarkVideoBlob(vb,e,eq)}e.clipType=vb.type;e.videoBytes=vb.size;e.videoWatermarked=(state.prefs.watermark.videoMode||'wm')==='wm';await putMedia(e.clipRef,vb)}";
 app=once(app,videoOld,videoNew,'video clean-master retention');

 app=once(app,"for(const r of e.frameRefs||[])await deleteMedia(r);if(e.clipRef)await deleteMedia(e.clipRef)","for(const r of e.frameRefs||[]){await deleteMedia(r);await deleteMedia(masterMediaRef(r))}if(e.clipRef){await deleteMedia(e.clipRef);await deleteMedia(masterMediaRef(e.clipRef))}",'session delete master parity');
 app=once(app,"if(e.clipRef){await deleteMedia(e.clipRef);delete e.clipRef;delete e.clipType;e.videoBytes=0}","if(e.clipRef){await deleteMedia(e.clipRef);await deleteMedia(masterMediaRef(e.clipRef));delete e.clipRef;delete e.clipType;e.videoBytes=0}",'clear-video master parity');

 if((app.match(/indexedDB\.open\(/g)||[]).length!==1)fail('media master introduced a second IndexedDB owner');
 for(const forbidden of ['axis_v817_media','axis_817_media','axis_media_master'])if(app.includes(forbidden))fail(`new media database/schema marker survived: ${forbidden}`);
 try{new Function(app)}catch(e){fail(`app syntax ${e.message}`)};
 write(APP,app);
}

/* Final photo watermark always composes from the clean master when one exists.
   This keeps the visible/canonical AXIS copy stable while preventing repeated
   rasterization from baking a previous watermark into the source of truth. */
{
 let wm=read(WM);
 const helper="function masterRef(ref){const s=String(ref||'');return s.startsWith('F-')?'F-RAW-'+s.slice(2):s.startsWith('V-')?'V-RAW-'+s.slice(2):'RAW-'+s}\n";
 wm=regexOnce(wm,/(function eventData\(e,L\)\{)/,helper+'$1','watermark master-key resolver');
 wm=once(wm,"const b=await dbGet(ref);if(!b)continue;const out=await stamp(b,e);if(out)await dbPut(ref,out)","const b=await dbGet(ref);if(!b)continue;const clean=await dbGet(masterRef(ref))||b;const out=await stamp(clean,e);if(out)await dbPut(ref,out)",'watermark composes from clean master');
 const end=wm.lastIndexOf('})();');if(end<0)fail('watermark IIFE end missing');
 const marker="\ntry{window.__AXIS_817_MEDIA_MASTER_WATERMARK__={version:'8.17',nonDestructive:true,source:'clean-master-first',canonicalDerivative:true,sameStore:true}}catch{}\n";
 wm=wm.slice(0,end)+marker+wm.slice(end);
 try{new Function(wm)}catch(e){fail(`watermark syntax ${e.message}`)};
 write(WM,wm);
}

/* Comparative Evidence is factual analysis, so it should prefer the untouched
   master while still falling back to the canonical watermarked asset for all old
   records and quota-constrained saves. It stays read-only and network-free. */
{
 let media=read(MEDIA);
 const helper="const masterRef=ref=>{const s=String(ref||'');return s.startsWith('F-')?'F-RAW-'+s.slice(2):s.startsWith('V-')?'V-RAW-'+s.slice(2):'RAW-'+s};\n";
 media=once(media,"const mediaType=ref=>String(ref||'').startsWith('V-')?'video':'photo';\n","const mediaType=ref=>String(ref||'').startsWith('V-')?'video':'photo';\n"+helper,'evidence clean-master resolver');
 media=once(media,"try{const blob=await bridge.get(ref);if(!blob)return null;const url=URL.createObjectURL(blob);","try{const blob=await bridge.get(masterRef(ref))||await bridge.get(ref);if(!blob)return null;const url=URL.createObjectURL(blob);",'evidence master-first read');
 const end=media.lastIndexOf('})();');if(end<0)fail('Media Evidence IIFE end missing');
 const marker="\ntry{window.__AXIS_817_MEDIA_MASTER_EVIDENCE__={version:'8.17',readOnly:true,masterFirst:true,fallbackCanonical:true,persistence:false,network:false}}catch{}\n";
 media=media.slice(0,end)+marker+media.slice(end);
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','XMLHttpRequest'])if(media.includes(forbidden))fail(`Media Evidence acquired forbidden owner: ${forbidden}`);
 try{new Function(media)}catch(e){fail(`media syntax ${e.message}`)};
 write(MEDIA,media);
}

console.log('[AXIS 8.17 media master] PASS · clean photo/video masters retained in existing store · watermark derivative preserved · Evidence master-first · deletion parity');
