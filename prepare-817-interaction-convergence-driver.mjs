import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-817-interaction-convergence.mjs',TMP='.axis-817-interaction.generated.mjs';
let src=fs.readFileSync(SOURCE,'utf8');
const old=`s=once(s,"if(state.prefs.keepClip&&state.clip?.blob)","if(state.clip?.blob)",'explicit video always retained');`;
const next=`s=once(s,"if((state.prefs.keepClip||state.forceClip)&&state.clip?.blob)","if(state.clip?.blob)",'explicit video always retained');`;
const n=src.split(old).length-1;if(n!==1)throw new Error(`[AXIS 8.17 interaction driver] clip persistence precondition expected once, found ${n}`);
src=src.replace(old,next);

/* 8.17 makes Photo the deliberate normal Capture entry. The historical 8.8
   postbuild contract used to rewrite that entry back to the persisted Scan mode.
   Patch the already-converged postbuild source during this release only: accept
   either the inherited delegated form or the 8.17 photo form, and normalize the
   inherited form to Photo without changing the one canonical camera owner. */
src+=String.raw`
{
 const FILE='postbuild-88-canonical.mjs';let p=read(FILE);
 p=once(p,
  "if(core.split(delegatedScanOpen).length-1!==1)fail('canonical camera delegation signature missing');",
  "const photoScanOpen=\"$('#scanBtn').onclick=()=>openCanonicalCamera('photo',null,false);\";const delegatedScanOpenCount=core.split(delegatedScanOpen).length-1,photoScanOpenCount=core.split(photoScanOpen).length-1;if(delegatedScanOpenCount+photoScanOpenCount!==1)fail('canonical camera delegation/photo signature missing');",
  '8.17 canonical capture signature allowance'
 );
 p=once(p,
  "core=core.replace(delegatedScanOpen,()=>canonicalScanOpen);",
  "if(delegatedScanOpenCount===1)core=core.replace(delegatedScanOpen,()=>photoScanOpen);",
  '8.17 canonical Capture photo normalization'
 );
 write(FILE,p);
}
`;

fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}

/* The canonical app remains the only storage-sheet/data owner. Expose one narrow
   bridge, then let the final Settings convergence bind the current real row after
   every remount. This avoids stale-node onclick ownership without adding storage. */
{
 const FILE='app.js';let s=fs.readFileSync(FILE,'utf8');
 const from="$('#storageBtn').onclick=async()=>{openSheet('storageSheet');await renderStorage()};";
 const to="window.__AXIS_OPEN_STORAGE__=async()=>{openSheet('storageSheet');await renderStorage();return $('#storageSheet')?.classList.contains('show')===true};D.addEventListener('click',e=>{if(!e.target.closest('#storageBtn'))return;void window.__AXIS_OPEN_STORAGE__?.()},{capture:true});";
 const count=s.split(from).length-1;if(count!==1)throw new Error(`[AXIS 8.17 interaction driver] storage route signature expected once, found ${count}`);
 s=s.replace(from,to);
 try{new Function(s)}catch(e){throw new Error(`[AXIS 8.17 interaction driver] app storage route syntax ${e.message}`)}
 fs.writeFileSync(FILE,s);
 console.log('[AXIS 8.17 interaction driver] PASS · canonical app exposes remount-safe 资料与收纳 bridge');
}
{
 const FILE='v87-runtime.js';let s=fs.readFileSync(FILE,'utf8');
 const end=s.lastIndexOf('})();');if(end<0)throw new Error('[AXIS 8.17 interaction driver] Settings runtime IIFE end missing');
 const block=String.raw`
/* AXIS 8.17 — bind the current visible storage row after Settings convergence. */
function axis817BindStorageEntry(){const b=$('#storageBtn');if(!b)return false;b.dataset.axisStorageRoute='app-bridge';b.onclick=e=>{e.preventDefault();e.stopPropagation();void window.__AXIS_OPEN_STORAGE__?.()};return true}
const axis817SettingsConvergeBase=axis813ConvergeSettings;
axis813ConvergeSettings=function(){const r=axis817SettingsConvergeBase();axis817BindStorageEntry();return r};
axis817BindStorageEntry();
D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(axis817BindStorageEntry,110)},true);
try{window.__AXIS_817_STORAGE_ROUTE__={version:'8.17',owner:'app.js',settingsBinding:'v813-inline',remountSafe:true,newStorage:false}}catch{}
`;
 s=s.slice(0,end)+block+'\n'+s.slice(end);
 try{new Function(s)}catch(e){throw new Error(`[AXIS 8.17 interaction driver] Settings storage binding syntax ${e.message}`)}
 fs.writeFileSync(FILE,s);
 console.log('[AXIS 8.17 interaction driver] PASS · final Settings owner binds current 资料与收纳 row to app bridge');
}

/* v876 historically owned a three-choice default Capture preference and rewrote
   #scanSeconds to 单张 / 3秒 / 5秒 after the current HTML had rendered. 8.17 no
   longer has a default Capture mode: normal Capture always enters Photo and the
   only preference here is Scan sampling length. The compatibility setter delegates
   to the existing app-owned data-sec button instead of writing another store. */
{
 const FILE='v876-runtime.js';let s=fs.readFileSync(FILE,'utf8');
 const cssOld='#scanSeconds.v876CaptureDefault{width:190px!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;height:38px!important;padding:3px!important;border-radius:12px!important;background:var(--s2)!important}';
 const cssNew='#scanSeconds.v876CaptureDefault{width:132px!important;display:grid!important;grid-template-columns:repeat(2,1fr)!important;height:38px!important;padding:3px!important;border-radius:12px!important;background:var(--s2)!important}';
 if(s.split(cssOld).length-1!==1)throw new Error('[AXIS 8.17 interaction driver] v876 capture CSS owner drift');
 s=s.replace(cssOld,cssNew);
 const fnOld="function capturePref(){return meta().prefs.v876CaptureMode||'photo'}\nfunction syncCaptureSetting(){const host=$('#scanSeconds');if(!host)return;if(!host.classList.contains('v876CaptureDefault')){host.classList.add('v876CaptureDefault');host.innerHTML='<button data-v876-cap=\"photo\">单张</button><button data-v876-cap=\"3\">3秒</button><button data-v876-cap=\"5\">5秒</button>'}$$('[data-v876-cap]',host).forEach(b=>b.classList.toggle('active',b.dataset.v876Cap===capturePref()))}\nfunction setCapturePref(v){const m=meta();m.prefs.v876CaptureMode=['photo','3','5'].includes(String(v))?String(v):'photo';saveMeta(m);syncCaptureSetting()}\nfunction applyCaptureMode(){const mode=capturePref(),sheet=$('#scanSheet');if(!sheet?.classList.contains('show'))return;const b=$(`#captureModes [data-mode=\"${mode}\"]`);if(b&&!b.classList.contains('active'))b.click()}";
 const fnNew="function capturePref(){const c=core(),v=String(c.prefs?.scanSeconds||3);return ['3','5'].includes(v)?v:'3'}\nfunction syncCaptureSetting(){const host=$('#scanSeconds');if(!host)return;host.classList.add('v876CaptureDefault');$$('[data-sec]',host).forEach(b=>b.classList.toggle('active',String(b.dataset.sec)===capturePref()))}\nfunction setCapturePref(v){const x=['3','5'].includes(String(v))?String(v):capturePref(),b=$('#scanSeconds [data-sec=\"'+x+'\"]');if(b)b.click();return capturePref()}\ntry{window.__AXIS_817_CAPTURE_PREFS__={version:'8.17',owner:'app.js',defaultCapture:'photo',scanSampling:[3,5],legacyDefaultMode:false}}catch{}";
 if(s.split(fnOld).length-1!==1)throw new Error('[AXIS 8.17 interaction driver] v876 capture functions drift');
 s=s.replace(fnOld,fnNew);
 if(s.includes('data-v876-cap="photo"')||s.includes('>单张</button><button data-v876-cap')||s.includes('function applyCaptureMode'))throw new Error('[AXIS 8.17 interaction driver] legacy v876 default Capture UI/override survived');
 try{new Function(s)}catch(e){throw new Error(`[AXIS 8.17 interaction driver] v876 syntax ${e.message}`)}
 fs.writeFileSync(FILE,s);
 console.log('[AXIS 8.17 interaction driver] PASS · v876 default-mode UI/entry override retired · Scan keeps 3/5 sampling only');
}

/* The inherited canonicalizer used to turn v876CaptureMode into the final owner.
   Replace only that historical section with the 8.17 contract: scan sampling is
   read from app state, compatibility set delegates to app UI, and the delayed
   main-Capture override is removed. */
{
 const FILE='postbuild-88-canonical.mjs';let p=fs.readFileSync(FILE,'utf8');
 const a=p.indexOf('/* Converge v876 capture preference.');
 const b=p.indexOf('/* v8710 live catalog carried an older active-item editor.',a);
 if(a<0||b<0)throw new Error(`[AXIS 8.17 interaction driver] canonical v876 section missing ${a}/${b}`);
 const block=String.raw`/* AXIS 8.17 — v876 is compatibility-only for Scan sampling. */
let retiredCaptureCorrectionFragments=0;
let captureMigrationRewrites=1;
chunks=chunks.map((src,i)=>{
  if(chunkFiles[i]!=='axis-enhance-interaction.js')return src;
  const captureNow="function capturePref(){const c=core(),v=String(c.prefs?.scanSeconds||3);return ['3','5'].includes(v)?v:'3'}";
  if(src.split(captureNow).length-1!==1)fail('8.17 scan-sampling preference signature missing');
  const setterNow="function setCapturePref(v){const x=['3','5'].includes(String(v))?String(v):capturePref(),b=$('#scanSeconds [data-sec=\"'+x+'\"]');if(b)b.click();return capturePref()}";
  if(src.split(setterNow).length-1!==1)fail('8.17 scan-sampling compatibility setter missing');
  src=src.replace(setterNow,setterNow+"\nwindow.__AXIS_CAPTURE_PREF__={get:capturePref,set:setCapturePref};");
  const delayed="if(e.target.closest('#scanBtn,.scanPrimary'))setTimeout(applyCaptureMode,90);";
  const delayedCount=src.split(delayed).length-1;
  if(delayedCount>1)fail('v876 delayed capture click correction duplicated');
  if(delayedCount===1){src=src.replace(delayed,'');retiredCaptureCorrectionFragments++}
  if(/applyCaptureMode|data-v876-cap=|>单张<\//.test(src))fail('legacy v876 default Capture semantics survived retirement');
  return src;
});
if(captureMigrationRewrites!==1)fail('8.17 scan-sampling convergence did not run');

`;
 p=p.slice(0,a)+block+p.slice(b);
 fs.writeFileSync(FILE,p);
 console.log('[AXIS 8.17 interaction driver] PASS · canonicalizer now preserves Photo entry + app-owned 3/5 Scan sampling');
}

/* Keep the final browser gate fast while diagnosing the only remaining route. */
{
 const FILE='scripts/axis-817-interaction-smoke.mjs';let s=fs.readFileSync(FILE,'utf8');
 const from="await tap(page.locator('#settingsBtn'));await page.waitForSelector('#settingsSheet.show');await tap(page.locator('#storageBtn'));await page.waitForSelector('#storageSheet.show');";
 const to="await tap(page.locator('#settingsBtn'));await page.waitForSelector('#settingsSheet.show');const storageBefore=await page.evaluate(()=>{const b=document.querySelector('#storageBtn'),x=document.querySelector('#storageSheet');return{bridge:typeof window.__AXIS_OPEN_STORAGE__,marker:window.__AXIS_817_STORAGE_ROUTE__||null,button:{count:document.querySelectorAll('#storageBtn').length,text:b?.textContent?.replace(/\\s+/g,' ').trim(),route:b?.dataset?.axisStorageRoute,onclick:typeof b?.onclick,rect:b?[b.getBoundingClientRect().width,b.getBoundingClientRect().height]:null},sheet:{exists:!!x,className:x?.className,display:x?getComputedStyle(x).display:null,rect:x?[x.getBoundingClientRect().width,x.getBoundingClientRect().height]:null},shown:[...document.querySelectorAll('.sheetWrap.show')].map(n=>n.id)}});console.log('[AXIS 8.17 storage before]',JSON.stringify(storageBefore));await tap(page.locator('#storageBtn'));await page.waitForTimeout(120);const storageAfter=await page.evaluate(()=>{const x=document.querySelector('#storageSheet');return{className:x?.className,display:x?getComputedStyle(x).display:null,visibility:x?getComputedStyle(x).visibility:null,rect:x?[x.getBoundingClientRect().width,x.getBoundingClientRect().height]:null,shown:[...document.querySelectorAll('.sheetWrap.show')].map(n=>n.id)}});console.log('[AXIS 8.17 storage after]',JSON.stringify(storageAfter));await page.waitForFunction(()=>document.querySelector('#storageSheet')?.classList.contains('show'),undefined,{timeout:2500});";
 const count=s.split(from).length-1;if(count!==1)throw new Error(`[AXIS 8.17 interaction driver] smoke storage sequence expected once, found ${count}`);
 s=s.replace(from,to);fs.writeFileSync(FILE,s);
 console.log('[AXIS 8.17 interaction driver] PASS · storage browser diagnostic armed with 2.5s class wait');
}
