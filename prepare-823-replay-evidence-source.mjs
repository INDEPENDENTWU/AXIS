import fs from 'node:fs';

const REPLAY='v822-evolution-replay.js',EVIDENCE='v815-media-evidence.js';
const fail=m=>{throw new Error(`[AXIS 8.23 Replay Evidence source] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,replacer,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,replacer)};

/*
 * This stage intentionally runs only after the entire inherited 8.15.1 -> 8.17.1
 * Evidence convergence and the sealed 8.22 Replay release. Historical source
 * inputs therefore remain untouched for their fail-closed transforms.
 */
{
 let s=read(REPLAY);
 if(!s.includes("window.__AXIS_822_EVOLUTION_REPLAY__={version:'8.22'")||!s.includes("ordering:'time-session-event'"))fail('sealed 8.22 Replay source did not converge first');
 if(s.includes('axis:evolution-replay-selection'))fail('Replay continuity already installed before 8.23 late owner');
 const emit="function emitSelection(bundle,x){const detail={key:bundle.id,index:x.index,eventId:x.eventId||null,sessionId:x.sessionId||null,time:Number(x.time)||0,sessionStart:Number(x.sessionStart)||Number(x.time)||0,mediaCount:Number(x.mediaCount)||0};queueMicrotask(()=>window.dispatchEvent(new CustomEvent('axis:evolution-replay-selection',{detail})))}\n";
 s=once(s,"function installStyle(){if($('#v822EvolutionReplayStyle'))return;",emit+"function installStyle(){if($('#v822EvolutionReplayStyle'))return;",'Replay selection emitter');
 s=once(s,"const evidence=$('#v815Evidence',root);root.insertBefore(section,evidence||null);return bundle;","const evidence=$('#v815Evidence',root);root.insertBefore(section,evidence||null);emitSelection(bundle,x);return bundle;",'Replay render handoff');
 s=once(s,"ordering:'time-session-event',persistence:false","ordering:'time-session-event',selectionEvent:'axis:evolution-replay-selection',persistence:false",'Replay handoff metadata');
 for(const token of ['axis:evolution-replay-selection',"selectionEvent:'axis:evolution-replay-selection'",'eventId:x.eventId','sessionId:x.sessionId','emitSelection(bundle,x)'])if(!s.includes(token))fail(`Replay handoff missing ${token}`);
 try{new Function(s)}catch(e){fail(`Replay syntax ${e.message}`)};write(REPLAY,s);
}

{
 let s=read(EVIDENCE);
 if(!s.includes('__AXIS_817_INTERACTION__')||!s.includes('__AXIS_8171_EVIDENCE_SOURCE__')||!s.includes('retainPreviousUntilReady:true')||!s.includes('warmBeforeCommit:true'))fail('inherited stable/source-first Evidence convergence did not finish before 8.23');
 if(s.includes('replaySelectionConsumer:true')||s.includes('selectReplayEncounter'))fail('Evidence continuity already installed before 8.23 late owner');

 /* Add only transient selection state. Preserve every inherited compare field. */
 s=regexOnce(s,/let currentKey='',renderEpoch=0,compareMode=false,selectedEncounter=-1,selectedRef='',([^\n;]*?)objectUrls=new Set\(\);/,(m,middle)=>`let currentKey='',renderEpoch=0,compareMode=false,selectedEncounter=-1,selectedRef='',${middle}linkedSelection=null,objectUrls=new Set();`,'transient linked selection state');

 const linked="function linkedEncounter(bundle){if(!linkedSelection||!bundle)return null;const eid=String(linkedSelection.eventId||'');if(eid){const byEvent=bundle.encounters.find(x=>String(x.eventId||'')===eid);if(byEvent)return byEvent}const sid=String(linkedSelection.sessionId||''),time=Number(linkedSelection.time)||0;if(sid||time){const bySessionTime=bundle.encounters.find(x=>(!sid||String(x.sessionId||'')===sid)&&(!time||Number(x.time)===time));if(bySessionTime)return bySessionTime}return null}\n";
 s=once(s,"function pickEncounter(bundle){if(!bundle.visualEncounters.length)return null;const exact=bundle.visualEncounters.find(x=>x.index===selectedEncounter);return exact||bundle.latestVisual||bundle.visualEncounters[0]}",linked+"function pickEncounter(bundle){const linked=linkedEncounter(bundle);if(linked)return linked;if(!bundle.visualEncounters.length)return null;const exact=bundle.visualEncounters.find(x=>x.index===selectedEncounter);return exact||bundle.latestVisual||bundle.visualEncounters[0]}",'exact Encounter picker');

 /* Preserve stable-swap warm/revoke semantics for media; no-media is an explicit
    factual stage, never a silent fallback to another Encounter. */
 const visual=`async function renderVisual(section,bundle,enc,ref,epoch){
 const stage=$('.v815Stage',section),compareBar=$('.v817CompareBar',section);if(compareBar){compareBar.hidden=true;compareBar.innerHTML=''}if(!stage||epoch!==renderEpoch)return;
 section.dataset.loading='1';
 if(!enc){section.dataset.evidenceState='none';stage.innerHTML='<div class="v815Missing">当前没有可显示的影像证据</div>';revokeExcept([]);section.dataset.loading='0';return}
 if(!ref||!enc.media.length){section.dataset.evidenceState='selected-without-media';stage.innerHTML=\`<div class="v815Missing"><div><b>\${esc(fmtDate(enc.time))} · 第\${enc.index}/\${bundle.encounterCount}次</b><span>这一次没有留下影像证据</span></div></div>\`;revokeExcept([]);section.dataset.loading='0';return}
 section.dataset.evidenceState='selected-with-media';
 const media=await objectUrl(ref);if(epoch!==renderEpoch){dropObjectUrl(media);return}
 if(!media){stage.innerHTML='<div class="v815Missing">这份影像在当前设备不可用</div>';revokeExcept([]);section.dataset.loading='0';return}
 await warmMedia(media,ref);if(epoch!==renderEpoch){dropObjectUrl(media);return}
 const type=mediaType(ref),visual=type==='video'?\`<video src="\${media.url}" controls playsinline muted preload="metadata" aria-label="\${esc(bundle.name)} \${esc(fmtDate(enc.time))} 视频证据"></video>\`:\`<img src="\${media.url}" alt="\${esc(bundle.name)} \${esc(fmtDate(enc.time))} 现场证据">\`;
 const next=\`<div class="v815Visual">\${visual}<div class="v815Overlay"><span>\${esc(enc.summary||bundle.name)}</span><small>\${esc(fmtDate(enc.time))} · 第\${enc.index}/\${bundle.encounterCount}次</small></div></div><div class="v815Assets" role="tablist" aria-label="这次留下的影像">\${enc.media.map((r,i)=>\`<button type="button" role="tab" data-v815-ref="\${esc(r)}" aria-selected="\${r===ref?'true':'false'}">\${mediaType(r)==='video'?'视频':\`照片 \${enc.photos.indexOf(r)+1||i+1}\`}</button>\`).join('')}</div>\`;
 stage.innerHTML=next;revokeExcept([media.url]);section.dataset.loading='0'
}`;
 s=regexOnce(s,/async function renderVisual\(section,bundle,enc,ref,epoch\)\{[\s\S]*?\}\nasync function renderCompare/,visual+'\nasync function renderCompare','Replay-aware stable visual');

 const evidence=`async function renderEvidence(key){
 const root=$('#v814Object');if(!root||root.hidden)return null;
 const bundle=resolveBundle(key),priorKey=currentKey,existing=$('#v815Evidence',root);currentKey=key;renderEpoch++;const epoch=renderEpoch,exactLinked=linkedEncounter(bundle);
 if(!bundle||(!bundle.visualEncounters.length&&!exactLinked)){revokeUrls();existing?.remove();return bundle}
 const signature=bundle.visualEncounters.map(x=>\`\${x.index}:\${x.media.join(',')}\`).join('|')+\`|\${bundle.compareAvailable?'1':'0'}|\${evidenceMeta(bundle)}\`;
 const reuse=!!(existing&&priorKey===key)&&existing.dataset.v815Signature===signature;
 const compareButton=bundle.compareAvailable?\`<button type="button" class="v815CompareToggle" data-v815-compare="1" aria-pressed="\${compareMode?'true':'false'}">对照</button>\`:'';
 const picked=pickEncounter(bundle),rail=\`\${bundle.visualEncounters.map(x=>\`<button type="button" role="tab" data-v815-encounter="\${x.index}" aria-selected="\${picked?.media?.length&&x.index===picked.index?'true':'false'}"><b>\${esc(fmtDate(x.time))}</b><small>第\${x.index}次 · \${x.videos.length?'照片/视频':'照片'}</small></button>\`).join('')}\`;
 let section=existing;
 if(!reuse){revokeUrls();existing?.remove();section=D.createElement('section');section.id='v815Evidence';section.className='v815Evidence';section.dataset.axisMediaEvidenceOwner='v815-media-evidence';section.dataset.v815Signature=signature;section.innerHTML=\`<div class="v815EvidenceHead"><div><b>时间证据</b><span>\${esc(evidenceMeta(bundle))}</span></div>\${compareButton}</div><div class="v817CompareBar" hidden></div><div class="v815Stage"></div><div class="v815Rail" role="tablist" aria-label="有影像的真实相遇">\${rail}</div>\`;root.appendChild(section)}
 else{const compare=$('[data-v815-compare]',section);if(compare)compare.setAttribute('aria-pressed',compareMode?'true':'false');const selected=pickEncounter(bundle);$$('.v815Rail [data-v815-encounter]',section).forEach(b=>b.setAttribute('aria-selected',!!selected?.media?.length&&Number(b.dataset.v815Encounter)===selected.index?'true':'false'))}
 if(exactLinked)section.dataset.axisReplayEvidenceLinked='1';else delete section.dataset.axisReplayEvidenceLinked;
 if(compareMode&&bundle.compareAvailable)await renderCompare(section,bundle,epoch);else{compareMode=false;const enc=pickEncounter(bundle);selectedEncounter=enc?.index||-1;selectedRef=pickRef(enc);await renderVisual(section,bundle,enc,selectedRef,epoch)}return bundle
}`;
 s=regexOnce(s,/async function renderEvidence\(key\)\{[\s\S]*?\}\nfunction sync/,evidence+'\nfunction sync','Replay-aware stable Evidence section');

 const select="function selectReplayEncounter(detail){const key=String(detail?.key||'').trim();if(!key)return null;const live=String(evolution()?.current?.()?.id||'');if(live&&live!==key)return null;linkedSelection={eventId:detail?.eventId||null,sessionId:detail?.sessionId||null,time:Number(detail?.time)||0,index:Number(detail?.index)||0};selectedEncounter=-1;selectedRef='';compareMode=false;compareSide='';return renderEvidence(key)}\n";
 s=once(s,"function sync(){const root=$('#v814Object');",select+"function sync(){const root=$('#v814Object');",'Replay selection consumer');
 s=once(s,"if(key!==currentKey){compareMode=false;selectedEncounter=-1;selectedRef=''}renderEvidence(key)","if(key!==currentKey){compareMode=false;selectedEncounter=-1;selectedRef='';linkedSelection=null}renderEvidence(key)",'selection reset on Object change');
 s=regexOnce(s,/function closeEvidence\(\)\{renderEpoch\+\+;currentKey='';compareMode=false;selectedEncounter=-1;selectedRef='';([^}]*?)revokeUrls\(\);/, (m,middle)=>`function closeEvidence(){renderEpoch++;currentKey='';compareMode=false;selectedEncounter=-1;selectedRef='';${middle}linkedSelection=null;revokeUrls();`,'selection reset on close');

 /* Direct Evidence navigation takes explicit control away from Replay linkage. */
 s=once(s,"if(encBtn){const idx=Number(encBtn.dataset.v815Encounter)||-1;selectedEncounter=idx;","if(encBtn){linkedSelection=null;const idx=Number(encBtn.dataset.v815Encounter)||-1;selectedEncounter=idx;",'manual Evidence rail ownership');
 s=once(s,"if(compare){compareMode=!compareMode;","if(compare){linkedSelection=null;compareMode=!compareMode;",'manual compare ownership');
 s=once(s,"window.addEventListener('axis:state-changed',()=>queueMicrotask(sync),{passive:true});","window.addEventListener('axis:evolution-replay-selection',e=>selectReplayEncounter(e.detail),{passive:true});window.addEventListener('axis:state-changed',()=>queueMicrotask(sync),{passive:true});",'Replay selection listener');
 s=once(s,"readOnly:true,resolve:resolveBundle,refresh:sync,close:closeEvidence","readOnly:true,resolve:resolveBundle,selectEncounter:selectReplayEncounter,refresh:sync,close:closeEvidence",'Evidence public transient selector');
 s=once(s,"readOnly:true,encounterBound:true,mediaStore:'axis_v42_media'","readOnly:true,encounterBound:true,replaySelectionConsumer:true,selectionPersistence:false,mediaStore:'axis_v42_media'",'Evidence handoff metadata');

 /* Small factual empty-state typography; no new layout owner. */
 s=once(s,'.v815Missing{display:grid;place-items:center;min-height:172px;color:#646c78;font-size:11px}', '.v815Missing{display:grid;place-items:center;min-height:172px;padding:22px;color:#646c78;font-size:11px;text-align:center}.v815Missing b{display:block;color:#9299a5;font-size:10px;font-weight:620}.v815Missing span{display:block;margin-top:7px;line-height:1.45}', 'truthful no-evidence state styling');

 for(const token of ['axis:evolution-replay-selection','selectReplayEncounter','selectEncounter:selectReplayEncounter','replaySelectionConsumer:true','selectionPersistence:false','linkedEncounter','selected-without-media','这一次没有留下影像证据','__AXIS_8171_EVIDENCE_SOURCE__'])if(!s.includes(token))fail(`Evidence continuity missing ${token}`);
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(s.includes(forbidden))fail(`Evidence continuity acquired forbidden authority ${forbidden}`);
 try{new Function(s)}catch(e){fail(`Evidence syntax ${e.message}`)};write(EVIDENCE,s);
}

console.log('[AXIS 8.23 Replay Evidence source] PASS · inherited transforms completed first · exact transient Encounter handoff · truthful selected no-media stage · stable/source-first Evidence preserved · no new writer');
