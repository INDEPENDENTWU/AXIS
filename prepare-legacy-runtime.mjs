import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const stableFiles=[
  'v61.js',
  'v82-runtime.js','v83-reminders.js','v84-runtime.js','v85-runtime.js','v85-canvas-fix.js','v86-runtime.js','v86-gesture.js',
  'v87-runtime.js','v87-fix.js','v871-fix.js','v872-fix.js','v873-exercise-library.js','v873-smart-input.js','v874-professional.js',
  'v874-set-bridge.js','v875-polish.js','v876-runtime.js','v877-runtime.js','v878-stability.js','v879-runtime.js',
  'v8710-live-catalog.js','v8710-sonic-core.js','v8710-sonic-motifs.js','v8710-sound-ui.js','v8710-report.js','v8710-watermark.js','v8711-runtime.js',
  'v8712-runtime.js'
];
const unsafeHelper="$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s))";
const safeHelper="$=(s,r=D)=>r?.querySelector?.(s)||null,$$=(s,r=D)=>r?.querySelectorAll?Array.from(r.querySelectorAll(s)):[]";
let helperFixes=0,watermarkFixes=0,interactionFixes=0,versionOwnerFixes=0,recordingOwnerFixes=0,retiredOwnerFixes=0,setBridgeOwnerFixes=0;

function replaceOnce(src,from,to,label){
  const hits=src.split(from).length-1;
  if(hits!==1)throw new Error(`AXIS legacy sanitizer: ${label} expected once, found ${hits}`);
  return src.replace(from,to);
}

const interactionRewrites={
  'v876-runtime.js':[
    ["if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();syncCaptureSetting();installVersion()},120);",'']
  ],
  'v877-runtime.js':[
    ["if(e.target.closest('#settingsBtn'))setTimeout(()=>{version();installControl()},70);",'']
  ],
  'v879-runtime.js':[
    ["requestAnimationFrame(()=>{cleanLegacy();version();layer();editEntry()})",'']
  ],
  'v8711-runtime.js':[
    ["if(e.target.closest('#settingsBtn'))setTimeout(()=>{ensureSettings();version()},100);",''],
    ['requestAnimationFrame(queue)','']
  ]
};

const recordingHelpers=`function recordingSnapshot(){const e=selected(),s=draft[sel]||null;return{equipmentId:e?.id||null,index:sel,count:draft.length,weight:s?.weight==null?null:Number(s.weight),reps:s?.reps==null?null:Number(s.reps)}}
function emitRecording(type){try{D.dispatchEvent(new CustomEvent(type,{detail:recordingSnapshot()}))}catch{}}
function recordingWeightStep(w){w=Number(w)||0;if(w<10)return.5;if(w<30)return 1;if(w<120)return 2.5;if(w<220)return 5;return 10}
function syncRecordingControls(){const box=$('#axisSetControls'),s=draft[sel];if(!box||!s)return;const h=$('#v8Sets');box.classList.toggle('hidden',!h||h.classList.contains('hidden'));const w=$('[data-axis-input="weight"]',box),r=$('[data-axis-input="reps"]',box);if(w&&D.activeElement!==w)w.value=s.weight==null?'':fmt(s.weight);if(r&&D.activeElement!==r)r.value=s.reps==null?'':fmt(s.reps)}
function ensureRecordingControls(){const h=$('#v8Sets');if(!h)return;let box=$('#axisSetControls');if(!box){box=D.createElement('div');box.id='axisSetControls';box.className='axisSetControls';box.innerHTML='<section class="axisSetField"><span class="axisSetLabel">重量</span><div class="axisSetStepper"><button type="button" data-axis-step="weight" data-dir="-1" aria-label="减少重量">−</button><label class="axisSetValue"><input data-axis-input="weight" inputmode="decimal" aria-label="重量"><small>kg</small></label><button type="button" data-axis-step="weight" data-dir="1" aria-label="增加重量">＋</button></div></section><section class="axisSetField"><span class="axisSetLabel">次数</span><div class="axisSetStepper"><button type="button" data-axis-step="reps" data-dir="-1" aria-label="减少次数">−</button><label class="axisSetValue"><input data-axis-input="reps" inputmode="numeric" aria-label="次数"><small>次</small></label><button type="button" data-axis-step="reps" data-dir="1" aria-label="增加次数">＋</button></div></section>';box.addEventListener('click',e=>{const b=e.target.closest('[data-axis-step]');if(!b)return;e.preventDefault();adjustRecordingValue(b.dataset.axisStep,Number(b.dataset.dir)||0)});box.addEventListener('change',e=>{const i=e.target.closest('[data-axis-input]');if(!i)return;const raw=i.value.trim();patchActiveSetValue(i.dataset.axisInput,raw===''?null:Number(raw))});box.addEventListener('focusin',e=>{const i=e.target.closest('[data-axis-input]');if(i)setTimeout(()=>i.select?.(),0)});box.addEventListener('keydown',e=>{const i=e.target.closest('[data-axis-input]');if(i&&e.key==='Enter'){e.preventDefault();i.blur()}})}if(box.previousElementSibling!==h)h.insertAdjacentElement('afterend',box);box.classList.remove('hidden');syncRecordingControls()}
function patchActiveSetValue(kind,val){if(!draft.length)return;const s=draft[sel];if(kind==='weight')s.weight=val==null?null:Math.max(0,Math.min(1000,Math.round(Number(val||0)*100)/100));else s.reps=val==null?null:Math.max(1,Math.min(300,Math.round(Number(val)||1)));const row=$$('#v8Sets .v8SetRow')[sel];if(row){const bs=$$('span>b',row);if(bs[0])bs[0].textContent=fmt(s.weight);if(bs[1])bs[1].textContent=fmt(s.reps);const eq=selected(),prevEvent=eq?last(eq.id,editingId):null,prev=prevEvent?setsOf(prevEvent):[],em=$('em',row);if(em)em.textContent=deltaText(s,sel,prev)}syncHidden(draft);syncRecordingControls();emitRecording('axis:recording-change')}
function adjustRecordingValue(kind,dir){const s=draft[sel];if(!s)return;const base=kind==='weight'?(Number(s.weight)||0):(Number(s.reps)||1),step=kind==='weight'?recordingWeightStep(base):1;patchActiveSetValue(kind,base+Number(dir||0)*step)}
function selectRecordingSet(i){if(!draft.length)return;sel=Math.max(0,Math.min(draft.length-1,Number(i)||0));$$('#v8Sets .v8SetRow').forEach((row,n)=>row.classList.toggle('active',n===sel));syncRecordingControls();emitRecording('axis:recording-change')}
window.__AXIS_RECORDING__={snapshot:recordingSnapshot,adjust:adjustRecordingValue,set:patchActiveSetValue,select:selectRecordingSet};`;

const legacy875VersionLock="function versionLock(){const v=$('.versionLine');if(!v)return;const text=`版本 ${VERSION}`;v.textContent=text;v.style.visibility='visible';v.dataset.axisVersion=VERSION;const boot=$('#axisVersionBootStyle');boot?.remove();if(v.dataset.axisVersionLock)return;v.dataset.axisVersionLock='1';const mo=new MutationObserver(()=>{if(v.textContent!==text)v.textContent=text;if(v.style.visibility==='hidden')v.style.visibility='visible'});mo.observe(v,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['style']})}";
const safe875VersionLock="function versionLock(){const v=$('.versionLine');if(!v)return;const current=window.__AXIS_RELEASE__||VERSION,text=`版本 ${current}`;if(v.textContent!==text)v.textContent=text;if(v.style.visibility!=='visible')v.style.visibility='visible';v.dataset.axisVersion=current;$('#axisVersionBootStyle')?.remove()}";
const safe878=`(()=>{'use strict';
const VERSION=window.__AXIS_RELEASE__||'8.7.8',TEXT=()=>\`版本 \${window.__AXIS_RELEASE__||VERSION}\`;
function reveal(){
  const current=window.__AXIS_RELEASE__||VERSION,v=document.querySelector('.versionLine');
  if(v){const text=TEXT();if(v.textContent!==text)v.textContent=text;if(v.dataset.axisVersion!==current)v.dataset.axisVersion=current;if(v.style.visibility!=='visible')v.style.visibility='visible'}
  document.getElementById('axisVersionBootStyle')?.remove();
  document.documentElement.dataset.axisRelease=current;
  window.__AXIS_VERSION__=current;
  window.__AXIS_878_READY__=true;
}
function cleanUrl(){try{const u=new URL(location.href);if((u.pathname==='/'||u.pathname==='/index.html')&&(u.searchParams.has('axisboot')||u.searchParams.has('safe')||u.searchParams.has('fresh')))history.replaceState(history.state,'','/')}catch{}}
window.addEventListener('pageshow',()=>reveal());
requestAnimationFrame(()=>{reveal();setTimeout(reveal,240);setTimeout(reveal,900);setTimeout(cleanUrl,980)});
})();
`;

for(const file of stableFiles){
  const p=path.join(ROOT,file);
  if(!fs.existsSync(p))throw new Error(`AXIS legacy sanitizer: missing ${file}`);
  let src=fs.readFileSync(p,'utf8');
  const before=src.split(unsafeHelper).length-1;
  if(before){src=src.split(unsafeHelper).join(safeHelper);helperFixes+=before}

  if(file==='v61.js'){
    src=replaceOnce(src,';syncHidden(draft)}\nfunction hideSets',';syncHidden(draft);ensureRecordingControls();syncRecordingControls();emitRecording(\'axis:recording-render\')}\n'+recordingHelpers+'\nfunction hideSets','v61 recording render owner');recordingOwnerFixes++;
    src=replaceOnce(src,"function hideSets(){$('#v8Sets')?.classList.add('hidden');$('#strengthFields')?.classList.remove('v8-hidden-core')}","function hideSets(){$('#v8Sets')?.classList.add('hidden');$('#axisSetControls')?.classList.add('hidden');$('#strengthFields')?.classList.remove('v8-hidden-core')}",'v61 recording controls lifecycle');recordingOwnerFixes++;
    src=replaceOnce(src,"if(b.dataset.si!=null){sel=Number(b.dataset.si);renderSets()}else if(b.dataset.cnt)changeCount(Number(b.dataset.cnt));else if(b.dataset.w){draft[sel].weight=b.dataset.w==='unknown'?null:Number(b.dataset.w);renderSets()}else if(b.dataset.r){draft[sel].reps=b.dataset.r==='unknown'?null:Number(b.dataset.r);renderSets()}","if(b.dataset.si!=null){selectRecordingSet(Number(b.dataset.si))}else if(b.dataset.cnt)changeCount(Number(b.dataset.cnt));else if(b.dataset.w){patchActiveSetValue('weight',b.dataset.w==='unknown'?null:Number(b.dataset.w))}else if(b.dataset.r){patchActiveSetValue('reps',b.dataset.r==='unknown'?null:Number(b.dataset.r))}",'v61 in-place recording mutations');recordingOwnerFixes++;
    src=replaceOnce(src,"const b=e.target.closest('button,[data-edit-eq]');if(!b)return;","const b=e.target.closest('button,[data-edit-eq]');if(!b)return;if(b.dataset.axisStep)return;",'v61 high-frequency direct routing');recordingOwnerFixes++;
  }

  if(file==='v874-set-bridge.js'){
    src=replaceOnce(src,"function patch(){const h=host();if(!h||h.classList.contains('hidden'))return;patchHeader();patchAdjust();if(!seedDone)seedOne()}","function patch(){const h=host();if(!h||h.classList.contains('hidden'))return;patchHeader();if(!seedDone)seedOne()}",'retire set-bridge recording painter');setBridgeOwnerFixes++;
    src=replaceOnce(src,"const review=$('#reviewStage');if(review)new MutationObserver(()=>patch()).observe(review,{childList:true,subtree:true});","D.addEventListener('axis:recording-render',()=>patch());",'replace set-bridge subtree observer');setBridgeOwnerFixes++;
  }

  if(file==='v8710-watermark.js'){
    const from='function render(){ensure();sync();';
    const hits=src.split(from).length-1;
    if(hits!==1)throw new Error(`AXIS legacy sanitizer: watermark render recursion signature expected once, found ${hits}`);
    src=src.replace(from,'function render(){sync();');
    watermarkFixes++;
  }
  if(file==='v875-polish.js'){
    const hits=src.split(legacy875VersionLock).length-1;
    if(hits!==1)throw new Error(`AXIS legacy sanitizer: v875 version observer signature expected once, found ${hits}`);
    src=src.replace(legacy875VersionLock,safe875VersionLock);versionOwnerFixes++;
  }
  if(file==='v878-stability.js'){
    src=safe878;versionOwnerFixes++;
  }
  if(file==='v879-runtime.js'){
    src=replaceOnce(src,"function cleanLegacy(){for(const b of $$('[data-v875-step]')){b.removeAttribute('data-v875-step');b.removeAttribute('data-dir')}patchAdjust()}","function cleanLegacy(){for(const b of Array.from(document.querySelectorAll('[data-v875-step]'))){b.removeAttribute('data-v875-step');b.removeAttribute('data-dir')}}",'retire v879 recording painter');retiredOwnerFixes++;
    src=replaceOnce(src,'css();ensureNum();ensureEdit();cleanLegacy();version();layer();finishCue();timeline();editEntry();','css();ensureNum();ensureEdit();cleanLegacy();version();layer();finishCue();timeline();','retire v879 duplicate active adjustment');retiredOwnerFixes++;
    src=replaceOnce(src,"const sets=$('#v8Sets');if(sets){const MO=window.__AXIS_NATIVE_MUTATION_OBSERVER__||MutationObserver;new MO(queuePatch).observe(sets,{childList:true,subtree:true,characterData:true})}",'','retire v879 recording observer');retiredOwnerFixes++;
    src=replaceOnce(src,"new MO(()=>{finishCue();timeline();editEntry()}).observe(evl,{childList:true,subtree:true,characterData:true})","new MO(()=>{finishCue();timeline()}).observe(evl,{childList:true,subtree:true,characterData:true})",'retire v879 edit reinsertion');retiredOwnerFixes++;
  }
  for(const [from,to] of interactionRewrites[file]||[]){
    const hits=src.split(from).length-1;
    if(hits!==1)throw new Error(`AXIS legacy sanitizer: interaction signature ${file} expected once, found ${hits}: ${from.slice(0,70)}`);
    src=src.replace(from,to);interactionFixes++;
  }
  fs.writeFileSync(p,src);
}

for(const file of stableFiles){
  const src=fs.readFileSync(path.join(ROOT,file),'utf8');
  if(src.includes(unsafeHelper))throw new Error(`AXIS legacy sanitizer: unsafe scoped query remains in ${file}`);
  if(file==='v61.js'){
    if(!src.includes('window.__AXIS_RECORDING__='))throw new Error('AXIS legacy sanitizer: recording API missing');
    if(!src.includes("box.addEventListener('click',e=>{const b=e.target.closest('[data-axis-step]')"))throw new Error('AXIS legacy sanitizer: direct recording control route missing');
    if(/dataset\.w[^\n]{0,160}renderSets\(\)/.test(src)||/dataset\.r[^\n]{0,160}renderSets\(\)/.test(src))throw new Error('AXIS legacy sanitizer: high-frequency recording still rebuilds editor');
  }
  if(file==='v874-set-bridge.js'){
    if(src.includes('patchHeader();patchAdjust()'))throw new Error('AXIS legacy sanitizer: set bridge still paints recording controls');
    if(src.includes("new MutationObserver(()=>patch()).observe(review"))throw new Error('AXIS legacy sanitizer: set bridge still observes recording subtree');
    if(!src.includes("D.addEventListener('axis:recording-render',()=>patch())"))throw new Error('AXIS legacy sanitizer: set bridge structural event missing');
  }
  if(file==='v879-runtime.js'){
    if(src.includes('patchAdjust()}'))throw new Error('AXIS legacy sanitizer: v879 recording painter remains active');
    if(src.includes('new MO(queuePatch).observe(sets'))throw new Error('AXIS legacy sanitizer: v879 recording observer remains');
    if(src.includes('timeline();editEntry()'))throw new Error('AXIS legacy sanitizer: v879 duplicate adjust reinsertion remains');
    if(!src.includes("Array.from(document.querySelectorAll('[data-v875-step]'))"))throw new Error('AXIS legacy sanitizer: v879 retired-owner cleanup must use direct DOM query');
  }
  if(file==='v8710-watermark.js'&&src.includes('function render(){ensure();sync();'))throw new Error('AXIS legacy sanitizer: watermark recursion remains');
  if(file==='v875-polish.js'&&src.includes('new MutationObserver(()=>{if(v.textContent!==text)'))throw new Error('AXIS legacy sanitizer: v875 version observer remains');
  if(file==='v878-stability.js'&&/versionObserver|observe\(v,/.test(src))throw new Error('AXIS legacy sanitizer: v878 version observer remains');
  for(const [from] of interactionRewrites[file]||[])if(src.includes(from))throw new Error(`AXIS legacy sanitizer: redundant interaction work remains in ${file}`);
}

const hardeningPath=path.join(ROOT,'runtime-hardening.css');
const stylesPath=path.join(ROOT,'styles.css');
if(!fs.existsSync(hardeningPath))throw new Error('AXIS legacy sanitizer: missing runtime-hardening.css');
let styles=fs.readFileSync(stylesPath,'utf8');
const hardening=fs.readFileSync(hardeningPath,'utf8');
const marker='/* AXIS stable shell geometry contract */';
if(!styles.includes(marker))styles+=`\n\n${hardening}\n`;
fs.writeFileSync(stylesPath,styles);

if(helperFixes<2)throw new Error(`AXIS legacy sanitizer: expected legacy helper fixes, found ${helperFixes}`);
if(interactionFixes!==5)throw new Error(`AXIS legacy sanitizer: expected 5 interaction-path fixes, found ${interactionFixes}`);
if(versionOwnerFixes!==2)throw new Error(`AXIS legacy sanitizer: expected 2 version-owner fixes, found ${versionOwnerFixes}`);
if(recordingOwnerFixes!==4)throw new Error(`AXIS legacy sanitizer: expected 4 recording-owner fixes, found ${recordingOwnerFixes}`);
if(setBridgeOwnerFixes!==2)throw new Error(`AXIS legacy sanitizer: expected 2 set-bridge owner fixes, found ${setBridgeOwnerFixes}`);
if(retiredOwnerFixes!==4)throw new Error(`AXIS legacy sanitizer: expected 4 retired-owner fixes, found ${retiredOwnerFixes}`);
console.log(`[AXIS] legacy sanitizer passed · ${helperFixes} null-safe helpers · ${watermarkFixes} recursion fix · ${interactionFixes} shell fixes · ${versionOwnerFixes} version-owner fixes`);
console.log(`[AXIS] recording converged · ${recordingOwnerFixes} core owner fixes · ${setBridgeOwnerFixes} set-bridge retirements · ${retiredOwnerFixes} legacy owner retirements`);
console.log('[AXIS] versionLine and high-frequency recording each have one interactive owner.');