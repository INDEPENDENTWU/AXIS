import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.2 quick camera] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};

{
  const FILE='app.js';let src=read(FILE);
  src=regexOnce(src,/function beginQuickMedia\(mode,id\)\{[\s\S]*?\}\nfunction setVal/,
`function openCanonicalCamera(mode,id=null,quickMedia=false){const e=id?eqById(id):null;if(id&&!e)return false;resetScan(!!id);if(e){state.selectedEq=id;selectEq(id,false)}state.forceClip=!!quickMedia&&String(mode)!=='photo';captureMode=String(mode||state.prefs.scanSeconds||3);const s=$('#scanSheet');if(!s)return false;s.classList.add('show');s.classList.remove('v8-quick');s.classList.toggle('v882-quick-media',!!quickMedia);s.dataset.captureOwner='canonical';s.dataset.captureIntent=quickMedia?'quick-media':'record';$('#captureStage')?.classList.remove('hidden');$('#reviewStage')?.classList.add('hidden');const h=s.querySelector('.sheetHead>b');if(h)h.textContent='拍摄记录';setText('#captureNow',captureMode==='photo'?'拍照':\`开始扫描 ${'${captureMode}'} 秒\`);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===captureMode));startCamera();return true}
function beginQuickMedia(mode,id){return openCanonicalCamera(mode,id,true)}
function setVal`,'canonical camera entry');

  src=once(src,
    "if($('#scanSheet')?.classList.contains('v882-quick-media')){const e=eqById(state.selectedEq);if(e){setText('#equipmentName',e.name);renderMuscles(e);setText('#aiStatus',state.clip?'已附加视频':'已附加照片');const last=lastEvent(e.id);$('#lastValue').classList.toggle('hidden',!last);if(last)setText('#lastValue','上次 '+eventMeta(last))}return}",
    "if($('#scanSheet')?.classList.contains('v882-quick-media')){const s=$('#scanSheet');s?.classList.add('v8-quick');const h=s?.querySelector('.sheetHead>b');if(h)h.textContent='快速记录';const e=eqById(state.selectedEq);if(e){setText('#equipmentName',e.name);renderMuscles(e);setText('#aiStatus',state.clip?'已附加视频':'已附加照片');const p=$('#v882QuickMedia [data-v882-media=\"photo\"]');if(p&&state.frames.length)p.textContent='已拍照片';const last=lastEvent(e.id);$('#lastValue').classList.toggle('hidden',!last);if(last)setText('#lastValue','上次 '+eventMeta(last))}return}",
    'quick media returns to Quick Record review');

  src=once(src,
    "window.__AXIS_CAPTURE__={beginQuickMedia,prepareQuick:id=>{const e=eqById(id);if(!e)return false;state.selectedEq=id;selectEq(id,false);return true}};load();buildChoices();bind();render();aiHealth();",
    "window.__AXIS_CAPTURE__={beginQuickMedia,openCanonicalCamera,prepareQuick:id=>{const e=eqById(id);if(!e)return false;state.selectedEq=id;selectEq(id,false);return true},snapshot:()=>({mode:captureMode,selectedEq:state.selectedEq,owner:$('#scanSheet')?.dataset.captureOwner||'',intent:$('#scanSheet')?.dataset.captureIntent||''})};load();buildChoices();bind();render();aiHealth();",
    'capture owner export');

  src=once(src,
    "$('#scanBtn').onclick=()=>{resetScan();captureMode=String(state.prefs.scanSeconds||3);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===captureMode));setText('#captureNow',captureMode==='photo'?'拍照':`开始扫描 ${captureMode} 秒`);openSheet('scanSheet');startCamera()};",
    "$('#scanBtn').onclick=()=>openCanonicalCamera(String(state.prefs.scanSeconds||3),null,false);",
    'normal capture delegates to canonical camera owner');
  fs.writeFileSync(FILE,src);
}

{
  const FILE='v61.js';let src=read(FILE);
  src=once(src,
    "ensureQuickMedia(id||e?.id);if(e?.type==='strength')prepare(id||e.id);syncDock()}",
    "ensureQuickMedia(id||e?.id);const photo=$('#v882QuickMedia [data-v882-media=\"photo\"]');if(photo)photo.textContent='补拍照片';if(e?.type==='strength')prepare(id||e.id);syncDock()}",
    'reset quick photo affordance');
  fs.writeFileSync(FILE,src);
}

/* postbuild-88-canonical previously required the retired inline scan opener. Converge
   that contract so v876 still owns the persisted capture preference while both entry
   points delegate actual camera lifecycle to openCanonicalCamera(). */
{
  const FILE='postbuild-88-canonical.mjs';let src=read(FILE);
  const old=`const legacyScanOpen="$('#scanBtn').onclick=()=>{resetScan();captureMode=String(state.prefs.scanSeconds||3);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===captureMode));setText('#captureNow',captureMode==='photo'?'拍照':\`开始扫描 ${'${captureMode}'} 秒\`);openSheet('scanSheet');startCamera()};";
const canonicalScanOpen="$('#scanBtn').onclick=()=>{resetScan();const preferred=window.__AXIS_CAPTURE_PREF__?.get?.();captureMode=['photo','3','5'].includes(String(preferred))?String(preferred):String(state.prefs.scanSeconds||3);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===captureMode));setText('#captureNow',captureMode==='photo'?'拍照':\`开始扫描 ${'${captureMode}'} 秒\`);openSheet('scanSheet');startCamera()};";
if(core.split(legacyScanOpen).length-1!==1)fail('legacy capture-open preference signature missing');
/* Function-form replacement is required: String.replace replacement strings interpret
   \`$$\` as one literal \`$\`, which would corrupt the canonical \`$$()\` selector helper. */
core=core.replace(legacyScanOpen,()=>canonicalScanOpen);`;
  const next=`const delegatedScanOpen="$('#scanBtn').onclick=()=>openCanonicalCamera(String(state.prefs.scanSeconds||3),null,false);";
const canonicalScanOpen="$('#scanBtn').onclick=()=>{const preferred=window.__AXIS_CAPTURE_PREF__?.get?.(),mode=['photo','3','5'].includes(String(preferred))?String(preferred):String(state.prefs.scanSeconds||3);openCanonicalCamera(mode,null,false)};";
if(core.split(delegatedScanOpen).length-1!==1)fail('canonical camera delegation signature missing');
if((core.match(/function openCanonicalCamera\\(/g)||[]).length!==1)fail('canonical camera owner must exist exactly once');
if((core.match(/function beginQuickMedia\\(mode,id\\)\\{return openCanonicalCamera\\(mode,id,true\\)\\}/g)||[]).length!==1)fail('Quick Record media does not delegate to canonical camera owner');
core=core.replace(delegatedScanOpen,()=>canonicalScanOpen);
if(/#scanBtn'\\]\\.onclick=.*startCamera|#scanBtn'\\)\\.onclick=.*startCamera/.test(core))fail('main capture retained an inline camera lifecycle writer');`;
  src=once(src,old,next,'canonical postbuild capture contract');
  fs.writeFileSync(FILE,src);
}

console.log('[AXIS 8.8.2 quick camera] PASS · one canonical camera lifecycle owner · main capture and Quick Record delegate · persisted preference remains v876-owned');
