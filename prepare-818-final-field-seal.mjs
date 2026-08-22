import fs from 'node:fs';

const APP='app.js',AUDIO='v876-runtime.js',CANON='postbuild-88-canonical.mjs',SMOKE817='scripts/axis-817-interaction-smoke.mjs';
const fail=m=>{throw new Error(`[AXIS 8.18 final field seal] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(s,from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
let selectorForEachRepairs=0;
function replaceFunction(src,signature,replacement,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){const ch=src[i],next=src[i+1]||'';if(line){if(ch==='\n')line=false;continue}if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}if(ch==='/'&&next==='/'){line=true;i++;continue}if(ch==='/'&&next==='*'){block=true;i++;continue}if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}}
 if(end<0)fail(`${label} closing brace missing`);return src.slice(0,start)+replacement+src.slice(end)
}
function matchingParen(src,open){
 let depth=0,quote='',esc=false,line=false,block=false;
 for(let i=open;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch==='(')depth++;
  else if(ch===')'){depth--;if(depth===0)return i}
 }
 return -1;
}
function dollarForEachPositions(src){
 const hits=[];let quote='',esc=false,line=false,block=false;
 for(let i=0;i<src.length-1;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch!=='$'||next!=='('||src[i-1]==='$')continue;
  const prev=src[i-1]||'';if(/[\w$]/.test(prev))continue;
  const close=matchingParen(src,i+1);if(close<0)continue;
  let j=close+1;while(/\s/.test(src[j]||''))j++;
  if(src.startsWith('.forEach',j)){let k=j+'.forEach'.length;while(/\s/.test(src[k]||''))k++;if(src[k]==='(')hits.push(i)}
 }
 return hits;
}
function repairDollarForEach(src){
 const hits=dollarForEachPositions(src);
 let out=src;for(let i=hits.length-1;i>=0;i--)out=out.slice(0,hits[i])+'$'+out.slice(hits[i]);
 return{src:out,count:hits.length};
}

/* Final camera readiness: opening Capture is asynchronous, but an immediate Record
   tap must wait for that exact camera acquisition instead of returning false. */
{
 let s=read(APP);
 s=once(s,'let axis818CameraSource=null,axis818CameraSwitchSeq=0;','let axis818CameraSource=null,axis818CameraSwitchSeq=0,axis818CameraReadyPromise=Promise.resolve(false);','camera readiness owner');
 s=replaceFunction(s,'async function startCamera(){',`async function startCamera(){var fallback=D.querySelector('#cameraFallback');fallback?.classList.add('hidden');axis818CameraReadyPromise=axis818SwapCameraStream(capture8171Facing);try{await axis818CameraReadyPromise;setText('#scanState','就绪');return true}catch(e){console.warn(e);fallback?.classList.remove('hidden');capture8171PaintFacing();setText('#scanState','拍一张');return false}}`,'startCamera readiness');
 const startPrefix="async function capture816StartVideo(){if(capture816Recorder&&capture816Recorder.state==='recording')return true;if(!state.stream||!window.MediaRecorder){";
 const startReady="async function capture816StartVideo(){if(capture816Recorder&&capture816Recorder.state==='recording')return true;if(!state.stream&&axis818CameraReadyPromise)try{await axis818CameraReadyPromise}catch(e){}if(!state.stream||!window.MediaRecorder){";
 s=once(s,startPrefix,startReady,'immediate Record waits for camera');

 /* Final scan preference is written directly by the canonical app state owner.
    No click-to-set recursion is allowed. Pointer-up covers iOS sheet gestures and
    click remains keyboard/mouse fallback. */
 s=replaceFunction(s,'function axis818ApplyScanSeconds(sec){',`function axis818ApplyScanSeconds(sec){sec=Number(sec);if(sec!==3&&sec!==5)return false;state.prefs.scanSeconds=sec;save();try{renderSettings()}catch(e){}D.querySelectorAll('#scanSeconds [data-sec],.v817CapturePref [data-sec]').forEach(function(b){var on=Number(b.dataset.sec)===sec;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});return true}`,'direct scan preference writer');
 const applyEnd="function axis818ApplyScanSeconds(sec){sec=Number(sec);if(sec!==3&&sec!==5)return false;state.prefs.scanSeconds=sec;save();try{renderSettings()}catch(e){}D.querySelectorAll('#scanSeconds [data-sec],.v817CapturePref [data-sec]').forEach(function(b){var on=Number(b.dataset.sec)===sec;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});return true}";
 s=once(s,applyEnd,applyEnd+"\nwindow.__AXIS_818_SCAN_SECONDS__={version:'8.18',owner:'app.js',get:function(){return Number(state.prefs.scanSeconds)||3},set:axis818ApplyScanSeconds};",'scan bridge');
 s=replaceFunction(s,'function axis818BindFieldPolish(){',`function axis818BindFieldPolish(){var flip=D.querySelector('#v8171CameraFlip');if(flip&&flip.dataset.axis818Bound!=='1'){flip.dataset.axis818Bound='1';flip.addEventListener('click',function(e){e.preventDefault();capture8171FlipCamera()})}if(D.documentElement.dataset.axis818ScanBound!=='1'){D.documentElement.dataset.axis818ScanBound='1';var lastPointer=0;var choose=function(e){var b=e.target&&e.target.closest?e.target.closest('#scanSeconds [data-sec],.v817CapturePref [data-sec]'):null;if(!b)return;var now=Date.now();if(e.type==='click'&&now-lastPointer<550)return;if(e.type==='pointerup'){lastPointer=now;e.preventDefault()}axis818ApplyScanSeconds(b.dataset.sec)};D.addEventListener('pointerup',choose,true);D.addEventListener('click',choose,true)}axis818ApplyScanSeconds(state.prefs.scanSeconds);capture8171PaintFacing()}`,'final scan physical binding');
 const legacyScanClick="$$('#scanSeconds button').forEach(b=>b.onclick=()=>{state.prefs.scanSeconds=Number(b.dataset.sec);save();renderSettings()});";
 s=once(s,legacyScanClick,'','retire legacy scan click writer');
 s=s.replace("scanTouchOwner:'axis818-final'","scanTouchOwner:'app-direct-pointer'");
 if(s.includes("window.__AXIS_CAPTURE_PREF__?.set?.(String(sec))"))fail('recursive compatibility scan setter survived');
 if(s.includes('state.prefs.scanSeconds=Number(b.dataset.sec)'))fail('legacy scan preference writer survived retirement');
 if(!s.includes('__AXIS_818_SCAN_SECONDS__'))fail('canonical scan bridge missing');

 /* `$` is AXIS querySelector and `$$` is querySelectorAll. A final `$().forEach`
    is structurally invalid. Use a balanced-parenthesis, string/comment-aware source
    scan so nested selector arguments are repaired without broad regex rewriting. */
 const repaired=repairDollarForEach(s);s=repaired.src;selectorForEachRepairs+=repaired.count;
 const survivors=dollarForEachPositions(s);if(survivors.length)fail(`single-element selector still used as collection at ${survivors.join(',')}`);
 try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};write(APP,s);
}

/* v876 is compatibility-only. Its public setter delegates to the app-owned direct
   bridge rather than clicking the same control and recursively re-entering handlers. */
const setter817="function setCapturePref(v){const x=['3','5'].includes(String(v))?String(v):capturePref(),b=$('#scanSeconds [data-sec=\"'+x+'\"]');if(b)b.click();return capturePref()}";
const setter818="function setCapturePref(v){const x=['3','5'].includes(String(v))?String(v):capturePref(),bridge=window.__AXIS_818_SCAN_SECONDS__;if(bridge?.set)bridge.set(Number(x));else{const b=$('#scanSeconds [data-sec=\"'+x+'\"]');if(b)b.click()}return capturePref()}";
{
 let s=read(AUDIO);
 s=once(s,setter817,setter818,'v876 scan compatibility delegation');
 try{new Function(s)}catch(e){fail(`v876 syntax ${e.message}`)};write(AUDIO,s);
}

/* The 8.17 canonicalizer is inherited audit infrastructure. Teach it the stronger
   8.18 compatibility shape rather than requiring the retired recursive click setter. */
{
 let p=read(CANON);
 const from=`  const setterNow="${setter817.replaceAll('\\','\\\\').replaceAll('"','\\"')}";\n  if(src.split(setterNow).length-1!==1)fail('8.17 scan-sampling compatibility setter missing');\n  src=src.replace(setterNow,setterNow+"\\nwindow.__AXIS_CAPTURE_PREF__={get:capturePref,set:setCapturePref};");`;
 const to=`  const setter817=${JSON.stringify(setter817)},setter818=${JSON.stringify(setter818)};\n  const setter817Count=src.split(setter817).length-1,setter818Count=src.split(setter818).length-1;\n  if(setter817Count+setter818Count!==1)fail('8.17/8.18 scan-sampling compatibility setter missing or duplicated');\n  const setterNow=setter818Count===1?setter818:setter817;\n  src=src.replace(setterNow,setterNow+"\\nwindow.__AXIS_CAPTURE_PREF__={get:capturePref,set:setCapturePref};");`;
 p=once(p,from,to,'canonical scan compatibility acceptance');
 write(CANON,p);
}

/* 8.17's historical runtime smoke still protects its real behavior inside 8.18,
   but the read-only video pseudo-setting is intentionally retired by 8.18. */
{
 let s=read(SMOKE817);
 s=once(s,",videoRow=page.locator('#keepClipSwitch').locator('xpath=ancestor::*[contains(@class,\"settingPlain\")][1]')",'', 'retired video row locator');
 s=once(s,",videoText=(await videoRow.innerText()).trim()",'', 'retired video row text');
 s=once(s,"assert.ok(videoText.includes('拍摄视频')&&videoText.includes('最长60秒 · 自动保存'),'current video capability copy missing');assert.ok(!videoText.includes('保留现场视频'),'obsolete video preference copy returned');","assert.equal(await page.locator('#settingsSheet .v817CaptureInfo').count(),0,'8.18 retired video pseudo-setting returned');",'8.17 inherited pseudo-setting expectation');
 write(SMOKE817,s);
}

console.log(`[AXIS 8.18 final field seal] PASS · immediate Record waits for camera · one app-owned 3/5 pointer owner · legacy scan click writer retired · v876 recursion retired · canonicalizer accepts direct 8.18 bridge · selector collection repairs ${selectorForEachRepairs} · inherited 8.17 smoke aligned to intentional 8.18 pseudo-setting retirement`);
