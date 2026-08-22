import fs from 'node:fs';

const APP='app.js',HTML='index.html',CSS='styles.css',ACTIVE='v879-runtime.js',AUDIO='v876-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.17.1 Active Truth + Capture Polish] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

/* Capture: preserve the existing branded media refs for backwards compatibility,
   but persist a clean source sidecar in the same axis_v42_media store. The source is
   captured before any AXIS compositor. No second DB/recorder is introduced. */
{
 let s=read(APP);
 s=once(s,
  "let timer=null,toastTimer=null,finishRaf=null,finishStart=0,captureMode='3',editCustomId=null,reportRange='last',selectedSessions=new Set();",
  "let timer=null,toastTimer=null,finishRaf=null,finishStart=0,captureMode='3',editCustomId=null,reportRange='last',selectedSessions=new Set();\nlet capture8171Facing='environment',capture8171FlipBusy=false;",
  'Capture facing transient state');
 s=once(s,
  "async function startCamera(){stopCamera();$('#cameraFallback').classList.add('hidden');try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:960}},audio:false});$('#cameraVideo').srcObject=state.stream;await $('#cameraVideo').play();setText('#scanState','就绪')}catch(e){console.warn(e);$('#cameraFallback').classList.remove('hidden');setText('#scanState','拍一张')}}",
  "async function startCamera(){stopCamera();$('#cameraFallback').classList.add('hidden');try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:capture8171Facing},width:{ideal:1280},height:{ideal:960}},audio:false});$('#cameraVideo').srcObject=state.stream;await $('#cameraVideo').play();capture8171PaintFacing();setText('#scanState','就绪')}catch(e){console.warn(e);$('#cameraFallback').classList.remove('hidden');capture8171PaintFacing();setText('#scanState','拍一张')}}\nfunction capture8171PaintFacing(){const b=$('#v8171CameraFlip');if(!b)return;b.textContent=capture8171Facing==='user'?'前置':'后置';b.setAttribute('aria-label','切换摄像头，当前'+b.textContent);b.disabled=!!capture8171FlipBusy||!!(capture816Recorder&&capture816Recorder.state==='recording')}\nasync function capture8171FlipCamera(){if(capture8171FlipBusy)return false;if(capture816Recorder&&capture816Recorder.state==='recording'){toast('录制结束后可切换镜头');capture8171PaintFacing();return false}capture8171FlipBusy=true;capture8171PaintFacing();const before=capture8171Facing;capture8171Facing=before==='user'?'environment':'user';try{await startCamera();return true}catch(e){capture8171Facing=before;await startCamera();return false}finally{capture8171FlipBusy=false;capture8171PaintFacing()}}",
  'camera facing owner');
 s=regexOnce(s,/async function frameFromVideo\(\)\{[\s\S]*?return\{blob,url:URL\.createObjectURL\(blob\),ts,fp\}\}/,
  "async function frameFromVideo(){const v=$('#cameraVideo');if(!v.videoWidth)throw new Error('camera');const max=960,scale=Math.min(1,max/v.videoWidth),cv=D.createElement('canvas');cv.width=Math.round(v.videoWidth*scale);cv.height=Math.round(v.videoHeight*scale);cv.getContext('2d',{alpha:false}).drawImage(v,0,0,cv.width,cv.height);const fp=fpFromCanvas(cv),ts=Date.now(),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.88));return{blob,url:URL.createObjectURL(blob),ts,fp,sourceClean:true}}",
  'clean camera source');
 s=regexOnce(s,/async function frameFromFile\(file\)\{[\s\S]*?return\{blob,url:URL\.createObjectURL\(blob\),ts,fp\}\}/,
  "async function frameFromFile(file){const u=URL.createObjectURL(file),img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=u});const max=960,scale=Math.min(1,max/img.naturalWidth),cv=D.createElement('canvas');cv.width=Math.round(img.naturalWidth*scale);cv.height=Math.round(img.naturalHeight*scale);cv.getContext('2d',{alpha:false}).drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(u);const fp=fpFromCanvas(cv),ts=Date.now(),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.88));return{blob,url:URL.createObjectURL(blob),ts,fp,sourceClean:true}}",
  'clean imported source');
 const oldSave=/async function saveScan\(\)\{[\s\S]*?toast\('已记下'\)\}/;
 const newSave=`async function saveScan(){if(!state.active)return toast('请先开始训练');const eq=eqById(state.selectedEq);if(!eq){renderEqList();openSheet('eqSheet');return}const wm=clone(state.prefs.watermark||{}),e={id:uid('E'),equipmentId:eq.id,name:eq.name,pattern:eq.pattern,kind:eq.type,muscles:eq.muscles||[],effect:eq.effect||'',time:Date.now(),frameRefs:[],sourceFrameRefs:[],photoBytes:0,sourcePhotoBytes:0,videoBytes:0,sourceVideoBytes:0,fingerprints:state.frames.map(f=>f.fp).filter(Boolean),ai:state.ai?{confidence:state.ai.confidence,model:state.ai.model}:null,presentation:{watermark:{photoMode:wm.photoMode||'wm',videoMode:wm.videoMode||'wm',config:wm,capturedAt:Date.now()},sourcePolicy:'clean-sidecar-v1'}};if(eq.type==='strength'){e.weight=nval('weight',0,1000,0);e.reps=choiceVal('reps',10);e.sets=choiceVal('sets',3)}else{e.duration=nval('duration',1,600,15);e.intensity=choiceVal('intensity',5)}try{for(let i=0;i<state.frames.length;i++){const frame=state.frames[i],sourceRef='S-'+e.id+'-'+i,sourceBlob=frame.blob;await putMedia(sourceRef,sourceBlob);e.sourceFrameRefs.push(sourceRef);e.sourcePhotoBytes+=sourceBlob.size;const blob=await finalizeFrame(frame,e,eq),ref='F-'+e.id+'-'+i;await putMedia(ref,blob);e.frameRefs.push(ref);e.photoBytes+=blob.size}if(state.clip?.blob){const sourceClipRef='SV-'+e.id,raw=state.clip.blob;await putMedia(sourceClipRef,raw);e.sourceClipRef=sourceClipRef;e.sourceClipType=raw.type;e.sourceVideoBytes=raw.size;let vb=raw;if((state.prefs.watermark.videoMode||'wm')==='wm')vb=await watermarkVideoBlob(vb,e,eq);e.clipRef='V-'+e.id;e.clipType=vb.type;e.videoBytes=vb.size;e.videoWatermarked=(state.prefs.watermark.videoMode||'wm')==='wm';await putMedia(e.clipRef,vb)}}catch(err){console.error(err);for(const r of [...(e.sourceFrameRefs||[]),...(e.frameRefs||[]),e.sourceClipRef,e.clipRef].filter(Boolean))try{await deleteMedia(r)}catch{}return toast('保存失败')}learnMemory(eq.id);state.active.events.push(e);save();closeSheet('scanSheet');resetScan();render();toast('已记下')}`;
 s=regexOnce(s,oldSave,newSave,'clean source persistence');
 s=once(s,
  "data.keys.forEach((k,i)=>{const z=data.vals[i]?.size||0;if(String(k).startsWith('V-'))videos+=z;else photos+=z})",
  "data.keys.forEach((k,i)=>{const z=data.vals[i]?.size||0;if(/^V-|^SV-/.test(String(k)))videos+=z;else photos+=z})",
  'source storage classification');
 s=once(s,
  "for(const e of ev(s)){for(const r of e.frameRefs||[])await deleteMedia(r);if(e.clipRef)await deleteMedia(e.clipRef)}",
  "for(const e of ev(s)){for(const r of [...(e.frameRefs||[]),...(e.sourceFrameRefs||[])])await deleteMedia(r);if(e.clipRef)await deleteMedia(e.clipRef);if(e.sourceClipRef)await deleteMedia(e.sourceClipRef)}",
  'source delete with session');
 s=once(s,
  "if(e.clipRef){await deleteMedia(e.clipRef);delete e.clipRef;delete e.clipType;e.videoBytes=0}",
  "if(e.clipRef||e.sourceClipRef){if(e.clipRef)await deleteMedia(e.clipRef);if(e.sourceClipRef)await deleteMedia(e.sourceClipRef);delete e.clipRef;delete e.clipType;delete e.sourceClipRef;delete e.sourceClipType;e.videoBytes=0;e.sourceVideoBytes=0}",
  'source video cleanup');

 /* Final Settings DOM can be replaced by convergence layers. Delegation stays on
    document and writes the existing core preference exactly once per user action. */
 const bindAnchor="$('#keepClipSwitch').onclick=()=>{state.prefs.keepClip=!state.prefs.keepClip;save();renderSettings()};$$('#scanSeconds button').forEach(b=>b.onclick=()=>{state.prefs.scanSeconds=Number(b.dataset.sec);save();renderSettings()});";
 const bindCurrent="$('#keepClipSwitch').onclick=()=>{state.prefs.keepClip=!state.prefs.keepClip;save();renderSettings()};$$('#scanSeconds button').forEach(b=>b.onclick=()=>{state.prefs.scanSeconds=Number(b.dataset.sec);save();renderSettings()});if(!D.documentElement.dataset.axis8171ScanPref){D.documentElement.dataset.axis8171ScanPref='1';D.addEventListener('click',e=>{const b=e.target.closest('#scanSeconds [data-sec]');if(!b)return;const n=Number(b.dataset.sec);if(![3,5].includes(n))return;state.prefs.scanSeconds=n;save();$$('#scanSeconds [data-sec]').forEach(x=>x.classList.toggle('active',Number(x.dataset.sec)===n));try{D.dispatchEvent(new CustomEvent('axis:recording-pref-changed',{detail:{scanSeconds:n}}))}catch{}},true)}";
 s=once(s,bindAnchor,bindCurrent,'stable Scan preference delegation');

 /* Time-first archive keeps one Set; make Select All a derived toggle and keep its
    label synchronized when individual rows change. */
 s=once(s,
  "$$('[data-delete-session]').forEach(b=>b.onclick=()=>{const id=b.dataset.deleteSession;if(selectedSessions.has(id)){selectedSessions.delete(id);b.classList.remove('selected')}else{selectedSessions.add(id);b.classList.add('selected')}})",
  "$$('[data-delete-session]').forEach(b=>b.onclick=()=>{const id=b.dataset.deleteSession;if(selectedSessions.has(id)){selectedSessions.delete(id);b.classList.remove('selected')}else{selectedSessions.add(id);b.classList.add('selected')}sync8171SelectAll()});sync8171SelectAll()",
  'archive row selection sync');
 s=once(s,
  "$('#storageBtn').onclick=async()=>{openSheet('storageSheet');await renderStorage()};$('#clearVideos').onclick=clearVideos;$('#backupBtn').onclick=backupData;$('#selectAllSessions').onclick=()=>{$$('[data-delete-session]').forEach(b=>{selectedSessions.add(b.dataset.deleteSession);b.classList.add('selected')})};",
  "$('#storageBtn').onclick=async()=>{openSheet('storageSheet');await renderStorage()};$('#clearVideos').onclick=clearVideos;$('#backupBtn').onclick=backupData;function sync8171SelectAll(){const rows=$$('[data-delete-session]'),all=!!rows.length&&rows.every(b=>selectedSessions.has(b.dataset.deleteSession));const b=$('#selectAllSessions');if(b){b.textContent=all?'取消全选':'全选';b.setAttribute('aria-pressed',String(all))}}$('#selectAllSessions').onclick=()=>{const rows=$$('[data-delete-session]'),all=!!rows.length&&rows.every(b=>selectedSessions.has(b.dataset.deleteSession));rows.forEach(b=>{if(all){selectedSessions.delete(b.dataset.deleteSession);b.classList.remove('selected')}else{selectedSessions.add(b.dataset.deleteSession);b.classList.add('selected')}});sync8171SelectAll()};",
  'Select All toggle');

 s=s.replace("removeVideo:capture816RemoveVideo,maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS};","removeVideo:capture816RemoveVideo,flipCamera:capture8171FlipCamera,facing:function(){return capture8171Facing},maxPhotos:CAPTURE816_PHOTO_MAX,maxVideoMs:CAPTURE816_VIDEO_MAX_MS};");
 const end=s.lastIndexOf('})();');if(end<0)fail('app IIFE end missing');
 s=s.slice(0,end)+"\ntry{window.__AXIS_8171_CAPTURE_POLISH__={version:'8.17.1',cleanSource:true,sourceStore:'axis_v42_media',brandedCompatibilityRefs:true,cameraFacing:['environment','user'],midRecordFlip:false,scanPreferenceOwner:'app-delegated',archiveSelectToggle:true}}catch{}\n"+s.slice(end);
 try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};write(APP,s);
}

/* Capture UI: one compact facing control. It is deliberately disabled while the
   single MediaRecorder is active; live mid-record switching belongs to Evidence
   Sequence rather than a fragile track swap. */
{
 let h=read(HTML);
 h=once(h,'<div class="v816CaptureMeta"><span id="v816CaptureContext">现场证据</span><b id="v816CaptureMeta">照片 0/12</b></div>','<div class="v816CaptureMeta"><span id="v816CaptureContext">现场证据</span><div class="v8171CaptureMetaRight"><button type="button" id="v8171CameraFlip" aria-label="切换摄像头，当前后置">后置</button><b id="v816CaptureMeta">照片 0/12</b></div></div>','Capture facing control');
 write(HTML,h);
}
{
 let c=read(CSS);if(c.includes('AXIS 8.17.1 Capture Polish'))fail('8.17.1 CSS already installed');
 c+='\n\n/* AXIS 8.17.1 Capture Polish */\n.v8171CaptureMetaRight{display:flex;align-items:center;gap:9px;min-width:0}.v8171CaptureMetaRight #v8171CameraFlip{appearance:none;border:0;height:26px;padding:0 9px;border-radius:9px;background:#151a22;color:#aeb5c0;font:650 9px/1 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}.v8171CaptureMetaRight #v8171CameraFlip:disabled{opacity:.38}.v8171CaptureMetaRight #v816CaptureMeta{white-space:nowrap}\n';write(CSS,c);
}

/* Active Truth: preserve the immutable start plan once, then make the adjusted
   event fields the effective/final truth consumed by Timeline, History, Trends and
   Evolution. The richer per-set truth remains in axis_v8_meta. */
{
 let s=read(ACTIVE);
 const from="function applyEdit(){const c=core(),m=meta(),e=eventById(editId,c),r=m.events?.[editId];if(!e||!r||r.v879EditAt)return;if(editDraft.kind==='s'){let ss=Array.isArray(r.sets)?r.sets.map(x=>({...x})):[];while(ss.length<editDraft.sets)ss.push({weight:editDraft.w,reps:editDraft.r,state:'assumed',doneAt:null,inferred:true});ss=ss.slice(0,editDraft.sets);for(let i=editDraft.done;i<ss.length;i++){ss[i].weight=editDraft.w;ss[i].reps=editDraft.r}r.sets=ss;e.sets=ss.length;e.weight=Math.max(...ss.map(x=>+x.weight||0));e.reps=+ss[0]?.reps||editDraft.r}else{e.duration=editDraft.min;e.intensity=editDraft.int;r.activity.estimateMs=editDraft.min*60000}r.v879EditAt=Date.now();save(C,c);save(M,m);$('#v879Edit').classList.remove('show');$('#v879EditBtn')?.remove();layer()}";
 const to="function applyEdit(){const c=core(),m=meta(),e=eventById(editId,c),r=m.events?.[editId];if(!e||!r||r.v879EditAt)return;if(!r.initialTruth)r.initialTruth=e.kind==='strength'?{kind:'strength',weight:Number(e.weight)||0,reps:Number(e.reps)||0,sets:Number(e.sets)||0}:{kind:'cardio',duration:Number(e.duration)||0,intensity:Number(e.intensity)||0};if(editDraft.kind==='s'){let ss=Array.isArray(r.sets)?r.sets.map(x=>({...x})):[];while(ss.length<editDraft.sets)ss.push({weight:editDraft.w,reps:editDraft.r,state:'assumed',doneAt:null,inferred:true});ss=ss.slice(0,editDraft.sets);for(let i=editDraft.done;i<ss.length;i++){ss[i].weight=editDraft.w;ss[i].reps=editDraft.r}r.sets=ss;e.sets=ss.length;e.weight=Number(editDraft.w)||0;e.reps=Number(editDraft.r)||1;r.effectiveTruth={kind:'strength',weight:e.weight,reps:e.reps,sets:e.sets}}else{e.duration=editDraft.min;e.intensity=editDraft.int;r.activity.estimateMs=editDraft.min*60000;r.effectiveTruth={kind:'cardio',duration:e.duration,intensity:e.intensity}}r.v879EditAt=Date.now();r.adjustedAt=r.v879EditAt;save(C,c);save(M,m);const row=$('#eventList [data-event=\"'+editId+'\"]');if(row){const small=row.querySelector('small');if(small)small.textContent=e.kind==='strength'?fmt(e.weight)+'kg · '+e.reps+'次 · '+e.sets+'组':e.duration+'分钟 · 强度'+e.intensity}try{D.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{reason:'effective-truth',eventId:editId}}))}catch{}$('#v879Edit').classList.remove('show');$('#v879EditBtn')?.remove();layer();timeline()}";
 s=once(s,from,to,'active effective truth');
 const end=s.lastIndexOf('})();');s=s.slice(0,end)+"\ntry{window.__AXIS_8171_ACTIVE_TRUTH__={version:'8.17.1',model:'initial-effective-final',initialOwner:'axis_v8_meta.events[eventId].initialTruth',effectiveOwner:'axis_v60_state event fields',analyticsReadsEffective:true}}catch{}\n"+s.slice(end);
 try{new Function(s)}catch(e){fail(`active runtime syntax ${e.message}`)};write(ACTIVE,s);
}

/* Sonic grammar: keep target completion truthful (never auto-finish), add one quiet
   adaptive pre-target cue, then retain the existing target-reached alert. */
{
 let s=read(AUDIO);
 s=once(s,"lastRestKey='',lastItemKey='',lastSessionKey=''","lastRestKey='',lastItemNearKey='',lastItemKey='',lastSessionKey=''",'near-target key');
 s=once(s,
  "async function reminderTick(){const c=core(),m=meta(),p=m.prefs;if(!c.active||p.v876SoundEnabled===false||D.visibilityState!=='visible')return;const pair=activePair();if(pair){const {e,a}=pair,el=elapsed(a);if(a.restStartedAt){const key=e.id+':'+a.restStartedAt;if(now()-a.restStartedAt>=restThreshold(p,e)&&key!==lastRestKey){lastRestKey=key;await fireAlert('rest')}}if(p.v876ItemReminder!==false&&a.estimateMs&&el>=a.estimateMs){const key=e.id+':'+a.startedAt;if(key!==lastItemKey){lastItemKey=key;await fireAlert('item')}}}const target=Number(p.v876SessionTarget)||0,key=(c.active?.id||'')+':'+(c.active?.start||'');if(target>0&&now()-c.active.start>=target*60000&&key!==lastSessionKey){lastSessionKey=key;await fireAlert('session')}}",
  "async function reminderTick(){const c=core(),m=meta(),p=m.prefs;if(!c.active||p.v876SoundEnabled===false||D.visibilityState!=='visible')return;const pair=activePair();if(pair){const {e,a}=pair,el=elapsed(a);if(a.restStartedAt){const key=e.id+':'+a.restStartedAt;if(now()-a.restStartedAt>=restThreshold(p,e)&&key!==lastRestKey){lastRestKey=key;await fireAlert('rest')}}if(p.v876ItemReminder!==false&&a.estimateMs){const key=e.id+':'+a.startedAt,near=Math.max(15000,Math.min(60000,a.estimateMs*.1));if(el>=Math.max(0,a.estimateMs-near)&&el<a.estimateMs&&key!==lastItemNearKey){lastItemNearKey=key;if(await unlockAudio()){playMotif(soundPrefs().tone,0);try{navigator.vibrate?.([8])}catch{}}}if(el>=a.estimateMs&&key!==lastItemKey){lastItemKey=key;await fireAlert('item')}}}const target=Number(p.v876SessionTarget)||0,key=(c.active?.id||'')+':'+(c.active?.start||'');if(target>0&&now()-c.active.start>=target*60000&&key!==lastSessionKey){lastSessionKey=key;await fireAlert('session')}}",
  'adaptive target grammar');
 s=s.replace('<span>项目预计提醒</span>','<span>进行中目标提醒</span>');
 s=once(s,"if(a)a.textContent=p.v876ItemReminder===false?'关闭':'开启';","if(a)a.textContent=p.v876ItemReminder===false?'关闭':'接近 + 到达';",'target reminder label');
 const end=s.lastIndexOf('})();');s=s.slice(0,end)+"\ntry{window.__AXIS_8171_SONIC_GRAMMAR__={version:'8.17.1',nearTarget:'adaptive-10pct-15to60s',targetReached:'one-shot-existing-alert',autoComplete:false}}catch{}\n"+s.slice(end);
 try{new Function(s)}catch(e){fail(`audio runtime syntax ${e.message}`)};write(AUDIO,s);
}

console.log('[AXIS 8.17.1] PASS · clean source sidecars · preview camera flip · Scan preference owner · archive select toggle · Active Truth · adaptive target cue');