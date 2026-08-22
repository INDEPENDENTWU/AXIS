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

/* v876 historically owned a three-choice default Capture preference and rewrote
   #scanSeconds to 单张 / 3秒 / 5秒 after the current HTML had rendered. 8.17 no
   longer has a default Capture mode: normal Capture always enters Photo and the
   only persisted preference here is Scan sampling length. Keep v876's unrelated
   sound/watermark owners, but retire this obsolete UI/entry-mode ownership. */
{
 const FILE='v876-runtime.js';let s=fs.readFileSync(FILE,'utf8');
 const cssOld='#scanSeconds.v876CaptureDefault{width:190px!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;height:38px!important;padding:3px!important;border-radius:12px!important;background:var(--s2)!important}';
 const cssNew='#scanSeconds.v876CaptureDefault{width:132px!important;display:grid!important;grid-template-columns:repeat(2,1fr)!important;height:38px!important;padding:3px!important;border-radius:12px!important;background:var(--s2)!important}';
 if(s.split(cssOld).length-1!==1)throw new Error('[AXIS 8.17 interaction driver] v876 capture CSS owner drift');
 s=s.replace(cssOld,cssNew);
 const fnOld="function capturePref(){return meta().prefs.v876CaptureMode||'photo'}\nfunction syncCaptureSetting(){const host=$('#scanSeconds');if(!host)return;if(!host.classList.contains('v876CaptureDefault')){host.classList.add('v876CaptureDefault');host.innerHTML='<button data-v876-cap=\"photo\">单张</button><button data-v876-cap=\"3\">3秒</button><button data-v876-cap=\"5\">5秒</button>'}$$('[data-v876-cap]',host).forEach(b=>b.classList.toggle('active',b.dataset.v876Cap===capturePref()))}\nfunction setCapturePref(v){const m=meta();m.prefs.v876CaptureMode=['photo','3','5'].includes(String(v))?String(v):'photo';saveMeta(m);syncCaptureSetting()}\nfunction applyCaptureMode(){const mode=capturePref(),sheet=$('#scanSheet');if(!sheet?.classList.contains('show'))return;const b=$(`#captureModes [data-mode=\"${mode}\"]`);if(b&&!b.classList.contains('active'))b.click()}";
 const fnNew="function capturePref(){const c=core(),v=String(c.prefs?.scanSeconds||3);return ['3','5'].includes(v)?v:'3'}\nfunction syncCaptureSetting(){const host=$('#scanSeconds');if(!host)return;host.classList.add('v876CaptureDefault');$$('[data-sec]',host).forEach(b=>b.classList.toggle('active',String(b.dataset.sec)===capturePref()))}\nfunction setCapturePref(v){return ['3','5'].includes(String(v))?String(v):capturePref()}\nfunction applyCaptureMode(){return}\ntry{window.__AXIS_817_CAPTURE_PREFS__={version:'8.17',owner:'app.js',defaultCapture:'photo',scanSampling:[3,5],legacyDefaultMode:false}}catch{}";
 if(s.split(fnOld).length-1!==1)throw new Error('[AXIS 8.17 interaction driver] v876 capture functions drift');
 s=s.replace(fnOld,fnNew);
 if(s.includes('data-v876-cap="photo"')||s.includes('>单张</button><button data-v876-cap'))throw new Error('[AXIS 8.17 interaction driver] legacy v876 default Capture UI survived');
 try{new Function(s)}catch(e){throw new Error(`[AXIS 8.17 interaction driver] v876 syntax ${e.message}`)}
 fs.writeFileSync(FILE,s);
 console.log('[AXIS 8.17 interaction driver] PASS · v876 default-mode UI/entry override retired · Scan keeps 3/5 sampling only');
}
