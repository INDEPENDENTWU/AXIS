import fs from 'node:fs';

const FILE='v815-media-evidence.js';
const fail=m=>{throw new Error(`[AXIS 8.15.1 Media Evidence swap] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

let src=read(FILE);

/* Never dim the whole stage during an evidence switch. The previous 0.72 opacity
   made every tap visibly pulse even when the next local asset resolved immediately. */
src=once(src,'.v815Evidence[data-loading="1"] .v815Stage{opacity:.72}', '.v815Evidence[data-loading="1"] .v815Stage{opacity:1}', 'loading opacity blink retirement');

src=once(
  src,
  "function revokeUrls(){for(const u of objectUrls){try{URL.revokeObjectURL(u)}catch{}}objectUrls.clear()}",
  "function revokeUrls(){for(const u of objectUrls){try{URL.revokeObjectURL(u)}catch{}}objectUrls.clear()}\nfunction dropObjectUrl(media){const u=media?.url;if(!u||!objectUrls.has(u))return;try{URL.revokeObjectURL(u)}catch{}objectUrls.delete(u)}\nfunction revokeExcept(keep=[]){const live=new Set(keep.filter(Boolean));for(const u of Array.from(objectUrls)){if(live.has(u))continue;try{URL.revokeObjectURL(u)}catch{}objectUrls.delete(u)}}\nasync function warmMedia(media,ref){if(!media?.url)return;const done=(el,event)=>new Promise(resolve=>{let settled=false;const finish=()=>{if(settled)return;settled=true;clearTimeout(timer);el.removeEventListener(event,finish);el.removeEventListener('error',finish);resolve()};const timer=setTimeout(finish,700);el.addEventListener(event,finish,{once:true});el.addEventListener('error',finish,{once:true})});if(mediaType(ref)==='video'){const v=D.createElement('video');v.preload='metadata';v.muted=true;v.playsInline=true;const ready=done(v,'loadedmetadata');v.src=media.url;try{v.load()}catch{}await ready;return}const img=new Image(),ready=done(img,'load');img.src=media.url;await ready;if(typeof img.decode==='function'){try{await img.decode()}catch{}}}",
  'stable object URL lifecycle'
);

const visual=`async function renderVisual(section,bundle,enc,ref,epoch){
 const stage=$('.v815Stage',section);if(!stage||epoch!==renderEpoch)return;
 section.dataset.loading='1';
 const media=await objectUrl(ref);if(epoch!==renderEpoch){dropObjectUrl(media);return}
 if(!media){stage.innerHTML='<div class="v815Missing">这份影像在当前设备不可用</div>';revokeExcept([]);section.dataset.loading='0';return}
 await warmMedia(media,ref);if(epoch!==renderEpoch){dropObjectUrl(media);return}
 const type=mediaType(ref),visual=type==='video'?\`<video src="\${media.url}" controls playsinline muted preload="metadata" aria-label="\${esc(bundle.name)} \${esc(fmtDate(enc.time))} 视频证据"></video>\`:\`<img src="\${media.url}" alt="\${esc(bundle.name)} \${esc(fmtDate(enc.time))} 现场证据">\`;
 const next=\`<div class="v815Visual">\${visual}<div class="v815Overlay"><span>\${esc(enc.summary||bundle.name)}</span><small>\${esc(fmtDate(enc.time))} · 第\${enc.index}/\${bundle.encounterCount}次</small></div></div><div class="v815Assets" role="tablist" aria-label="这次留下的影像">\${enc.media.map((r,i)=>\`<button type="button" role="tab" data-v815-ref="\${esc(r)}" aria-selected="\${r===ref?'true':'false'}">\${mediaType(r)==='video'?'视频':\`照片 \${enc.photos.indexOf(r)+1||i+1}\`}</button>\`).join('')}</div>\`;
 stage.innerHTML=next;revokeExcept([media.url]);section.dataset.loading='0'
}`;

src=regexOnce(src,/async function renderVisual\(section,bundle,enc,ref,epoch\)\{[\s\S]*?\}\nasync function renderCompare/,visual+'\nasync function renderCompare','stable visual swap');

const compare=`async function renderCompare(section,bundle,epoch){
 const stage=$('.v815Stage',section),a=bundle.earliestVisual,b=bundle.latestVisual;if(!stage||!a||!b||!bundle.compareAvailable)return;
 section.dataset.loading='1';
 const [ua,ub]=await Promise.all([objectUrl(a.photos[0]),objectUrl(b.photos[0])]);if(epoch!==renderEpoch){dropObjectUrl(ua);dropObjectUrl(ub);return}
 if(!ua||!ub){dropObjectUrl(ua);dropObjectUrl(ub);compareMode=false;const enc=pickEncounter(bundle),ref=pickRef(enc);return renderVisual(section,bundle,enc,ref,epoch)}
 await Promise.all([warmMedia(ua,a.photos[0]),warmMedia(ub,b.photos[0])]);if(epoch!==renderEpoch){dropObjectUrl(ua);dropObjectUrl(ub);return}
 const next=\`<div class="v815Compare"><figure><img src="\${ua.url}" alt="最早影像"><figcaption>最早影像<span>\${esc(fmtDate(a.time))} · \${esc(a.summary||'')}</span></figcaption></figure><figure><img src="\${ub.url}" alt="最近影像"><figcaption>最近影像<span>\${esc(fmtDate(b.time))} · \${esc(b.summary||'')}</span></figcaption></figure></div>\`;
 stage.innerHTML=next;revokeExcept([ua.url,ub.url]);section.dataset.loading='0'
}`;
src=regexOnce(src,/async function renderCompare\(section,bundle,epoch\)\{[\s\S]*?\}\nasync function renderEvidence/,compare+'\nasync function renderEvidence','stable compare swap');

const evidence=`async function renderEvidence(key){
 const root=$('#v814Object');if(!root||root.hidden)return null;
 const bundle=resolveBundle(key),priorKey=currentKey,existing=$('#v815Evidence',root),reuse=!!(existing&&priorKey===key);currentKey=key;renderEpoch++;const epoch=renderEpoch;
 if(!bundle||!bundle.visualEncounters.length){revokeUrls();existing?.remove();return bundle}
 const compareButton=bundle.compareAvailable?\`<button type="button" class="v815CompareToggle" data-v815-compare="1" aria-pressed="\${compareMode?'true':'false'}">首尾对照</button>\`:'';
 const rail=\`\${bundle.visualEncounters.map(x=>\`<button type="button" role="tab" data-v815-encounter="\${x.index}" aria-selected="\${x.index===(pickEncounter(bundle)?.index)?'true':'false'}"><b>\${esc(fmtDate(x.time))}</b><small>第\${x.index}次 · \${x.videos.length?'照片/视频':'照片'}</small></button>\`).join('')}\`;
 let section=existing;
 if(!reuse){revokeUrls();existing?.remove();section=D.createElement('section');section.id='v815Evidence';section.className='v815Evidence';section.dataset.axisMediaEvidenceOwner='v815-media-evidence';section.innerHTML=\`<div class="v815EvidenceHead"><div><b>时间证据</b><span>\${esc(evidenceMeta(bundle))}</span></div>\${compareButton}</div><div class="v815Stage"></div><div class="v815Rail" role="tablist" aria-label="有影像的真实相遇">\${rail}</div>\`;root.appendChild(section)}
 else{const head=$('.v815EvidenceHead',section),track=$('.v815Rail',section);if(head)head.innerHTML=\`<div><b>时间证据</b><span>\${esc(evidenceMeta(bundle))}</span></div>\${compareButton}\`;if(track)track.innerHTML=rail}
 if(compareMode&&bundle.compareAvailable)await renderCompare(section,bundle,epoch);else{compareMode=false;const enc=pickEncounter(bundle);selectedEncounter=enc.index;selectedRef=pickRef(enc);await renderVisual(section,bundle,enc,selectedRef,epoch)}return bundle
}`;
src=regexOnce(src,/async function renderEvidence\(key\)\{[\s\S]*?\}\nfunction sync/,evidence+'\nfunction sync','stable evidence section reuse');

src=once(
  src,
  "window.__AXIS_815_MEDIA_EVIDENCE_READY__=true}",
  "window.__AXIS_8151_MEDIA_SWAP__={version:'8.15.1',owner:'v815-media-evidence',stableSection:true,retainPreviousUntilReady:true,warmBeforeCommit:true,loadingOpacityBlink:false};window.__AXIS_815_MEDIA_EVIDENCE_READY__=true}",
  'stable swap runtime marker'
);

for(const forbidden of ["$('#v815Evidence',root)?.remove();if(!bundle",'.v815Evidence[data-loading="1"] .v815Stage{opacity:.72}'])if(src.includes(forbidden))fail(`unstable evidence behavior survived: ${forbidden}`);
for(const required of ['retainPreviousUntilReady:true','warmBeforeCommit:true','revokeExcept([media.url])','reuse=!!(existing&&priorKey===key)'])if(!src.includes(required))fail(`stable swap marker missing: ${required}`);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.15.1 Media Evidence swap] PASS · section/stage stay mounted · previous evidence retained until local asset ready · no opacity pulse · object URLs retired after commit');
