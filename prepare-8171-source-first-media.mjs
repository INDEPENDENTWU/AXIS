import fs from 'node:fs';

const APP='app.js',WM='v8710-watermark.js',MEDIA='v815-media-evidence.js';
const fail=m=>{throw new Error(`[AXIS 8.17.1 source-first media] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

/*
 * AXIS 8.17.1 clean-source authority
 *
 * 8.17.1 Capture already persists untouched sidecars in the existing axis_v42_media
 * store (`S-*` / `SV-*`) while keeping `F-*` / `V-*` as compatibility/presentation
 * refs. This refinement makes that clean sidecar the preferred source for future
 * processing without creating another storage model or changing event pointers.
 */
{
 let s=read(APP);
 if(!s.includes("sourcePolicy:'clean-sidecar-v1'"))fail('8.17.1 clean-sidecar capture must converge first');
 if(!s.includes('sourceFrameRefs:[]')||!s.includes("sourceClipRef='SV-'+e.id"))fail('8.17.1 source refs missing');
 const anchor="async function getMedia(k){const db=await openDb();return new Promise((res,rej)=>{const tx=db.transaction('media','readonly'),q=tx.objectStore('media').get(k);q.onsuccess=()=>{db.close();res(q.result||null)};q.onerror=()=>{db.close();rej(q.error)}})}";
 const bridge=anchor+"\nfunction source8171EventForRef(ref){for(const e of allEvents()){if((e.frameRefs||[]).includes(ref)||e.clipRef===ref||(e.sourceFrameRefs||[]).includes(ref)||e.sourceClipRef===ref)return e}return null}\nfunction source8171Ref(ref){const key=String(ref||'');if(!key)return key;const e=source8171EventForRef(key);if(!e)return key;const canonicalIndex=(e.frameRefs||[]).indexOf(key);if(canonicalIndex>=0)return e.sourceFrameRefs?.[canonicalIndex]||key;if(e.clipRef===key)return e.sourceClipRef||key;return key}\nasync function source8171Get(ref){const key=String(ref||'');if(!key)return null;const source=source8171Ref(key);try{const clean=await getMedia(source);if(clean)return clean;if(source!==key)return await getMedia(key);return null}catch{try{return source!==key?await getMedia(key):null}catch{return null}}}\ntry{window.__AXIS_MEDIA_SOURCE__={version:'8.17.1',owner:'app.js',readOnly:true,store:'axis_v42_media',sourcePolicy:'clean-sidecar-v1',canonicalFallback:true,resolveRef:source8171Ref,get:source8171Get}}catch{}";
 s=once(s,anchor,bridge,'clean-source read bridge');
 const end=s.lastIndexOf('})();');if(end<0)fail('app IIFE end missing');
 s=s.slice(0,end)+"\ntry{window.__AXIS_8171_SOURCE_MEDIA__={version:'8.17.1',cleanMaster:true,canonicalDerivative:true,sameStore:true,eventPointersUnchanged:true,legacyFallback:true,network:false,newPersistence:false}}catch{}\n"+s.slice(end);
 if((s.match(/indexedDB\.open\(/g)||[]).length!==1)fail('source bridge introduced a second IndexedDB owner');
 for(const forbidden of ['axis_v8171_media','axis_8171_media','F-RAW-','V-RAW-'])if(s.includes(forbidden))fail(`competing source schema survived ${forbidden}`);
 try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};write(APP,s);
}

/* Re-render the canonical watermarked photo from the untouched capture every time.
   Historical records without sourceFrameRefs continue to use the canonical photo. */
{
 let s=read(WM);
 const old="for(const ref of e.frameRefs||[]){const b=await dbGet(ref);if(!b)continue;const out=await stamp(b,e);if(out)await dbPut(ref,out)}";
 const next="for(let i=0;i<(e.frameRefs||[]).length;i++){const ref=e.frameRefs[i],source=e.sourceFrameRefs?.[i]||ref,b=await dbGet(source)||await dbGet(ref);if(!b)continue;const out=await stamp(b,e);if(out)await dbPut(ref,out)}";
 s=once(s,old,next,'photo watermark source-first compositor');
 const end=s.lastIndexOf('})();');if(end<0)fail('watermark IIFE end missing');
 s=s.slice(0,end)+"\ntry{window.__AXIS_8171_WATERMARK_SOURCE__={version:'8.17.1',photoSource:'clean-sidecar-first',canonicalOutput:'frameRefs',legacyFallback:true,destructive:false}}catch{}\n"+s.slice(end);
 try{new Function(s)}catch(e){fail(`watermark syntax ${e.message}`)};write(WM,s);
}

/* Comparative Evidence is analysis, not publishing. Resolve the untouched sidecar
   first; preserve its existing read-only bridge and canonical fallback for old data. */
{
 let s=read(MEDIA);
 if(!s.includes('__AXIS_817_INTERACTION__'))fail('8.17 Evidence interaction must converge first');
 s=once(s,"const mediaRead=()=>window.__AXIS_MEDIA_READ__;","const mediaRead=()=>window.__AXIS_MEDIA_READ__;\nconst sourceRead=()=>window.__AXIS_MEDIA_SOURCE__;",'Evidence source bridge');
 const objectUrl="async function objectUrl(ref){const bridge=mediaRead(),source=sourceRead();if(!bridge?.readOnly||typeof bridge.get!=='function')return null;try{let blob=null;if(source?.readOnly&&typeof source.get==='function')blob=await source.get(ref);if(!blob)blob=await bridge.get(ref);if(!blob)return null;const url=URL.createObjectURL(blob);objectUrls.add(url);return{url,type:blob.type||'',size:Number(blob.size)||0}}catch{return null}}";
 s=regexOnce(s,/async function objectUrl\(ref\)\{[\s\S]*?\}\nfunction normalizeEncounter/,objectUrl+'\nfunction normalizeEncounter','Evidence clean-source-first read');
 const end=s.lastIndexOf('})();');if(end<0)fail('Media Evidence IIFE end missing');
 s=s.slice(0,end)+"\ntry{window.__AXIS_8171_EVIDENCE_SOURCE__={version:'8.17.1',readOnly:true,cleanSourceFirst:true,canonicalFallback:true,persistence:false,network:false,autoplay:false}}catch{}\n"+s.slice(end);
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','XMLHttpRequest'])if(s.includes(forbidden))fail(`Media Evidence acquired forbidden owner ${forbidden}`);
 try{new Function(s)}catch(e){fail(`Evidence syntax ${e.message}`)};write(MEDIA,s);
}

console.log('[AXIS 8.17.1 source-first media] PASS · S/SV clean source authoritative for processing · F/V remain canonical derivatives · old records fall back · no new persistence owner');
