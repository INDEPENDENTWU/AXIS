import fs from 'node:fs';

const APP='app.js',INDEX='index.html',CSS='styles.css';
const fail=m=>{throw new Error(`[AXIS 8.18 field polish] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const count=(s,re)=>(s.match(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))||[]).length;

/* Replace one named function without touching neighbouring historical owners. The
   target functions have no regex-literal bodies; this scanner deliberately respects
   strings, template strings and comments so braces inside them cannot widen scope. */
function replaceFunction(src,signature,replacement,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);
 if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} signature duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} opening brace missing`);
 let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;
  else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${label} closing brace missing`);
 return src.slice(0,start)+replacement+src.slice(end);
}

/* Settings: retire a read-only pseudo-setting while preserving the historical
   #keepClipSwitch node expected by inherited app bindings. */
{
 let html=read(INDEX);
 const re=/<div class="settingPlain v817CaptureInfo">[\s\S]*?<\/div>/;
 const n=count(html,re);if(n!==1)fail(`video pseudo-setting expected once, found ${n}`);
 html=html.replace(re,'<button class="switch on" id="keepClipSwitch" type="button" aria-hidden="true" tabindex="-1" hidden></button>');
 write(INDEX,html);
}

/* Final interaction geometry. Keep the front-camera preview mirrored for the user,
   while the recorder continues to consume the unmirrored video pixels. */
{
 let css=read(CSS);
 if(css.includes('AXIS 8.18 Final Capture Polish'))fail('final capture CSS already installed');
 css+=`\n\n/* AXIS 8.18 Final Capture Polish */\n`+
 '#v817CameraFacing{position:relative;z-index:4}\n'+
 '#v8171CameraFlip{touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;user-select:none;-webkit-user-select:none;transition:opacity .14s ease,transform .14s ease}\n'+
 '#v8171CameraFlip:active:not(:disabled){transform:scale(.96)}\n'+
 '#v8171CameraFlip:disabled{opacity:.48}\n'+
 '#cameraVideo[data-axis-facing="user"]{transform:scaleX(-1)}\n'+
 '#cameraVideo[data-axis-facing="environment"]{transform:none}\n'+
 '#scanSeconds{position:relative;z-index:1;touch-action:manipulation}\n'+
 '#scanSeconds button{pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer}\n'+
 '#scanSeconds button:active{transform:scale(.98)}\n'+
 '#keepClipSwitch[hidden]{display:none!important}\n'+
 '@media(prefers-reduced-motion:reduce){#v8171CameraFlip,#scanSeconds button{transition:none!important}}\n';
 write(CSS,css);
}

{
 let s=read(APP);
 const visualMemorySentinels=['function visualSigFromCanvas(','function localVisualDistance(','function memoryGuess(','function learnMemory('];
 for(const x of visualMemorySentinels)if(!s.includes(x))fail(`inherited visual-memory sentinel missing before field polish: ${x}`);

 /* Camera source helpers are inserted immediately before the existing camera owner;
    only the four named owners below are replaced. This prevents Capture changes from
    consuming 8.8.2 personal visual-memory functions that sit nearby in app.js. */
 const helperAnchor='async function startCamera(){';
 const helperAt=s.indexOf(helperAnchor);if(helperAt<0)fail('camera helper anchor missing');
 const cameraHelpers=`let axis818CameraSource=null,axis818CameraSwitchSeq=0;\n`+
 `function axis818StopCameraStream(stream){if(!stream)return;try{stream.getTracks().forEach(function(t){try{t.stop()}catch(e){}})}catch(e){}}\n`+
 `function axis818CameraConstraints(facing){return{video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:960}},audio:false}}\n`+
 `function axis818CameraRetryable(error){var n=String(error&&error.name||'');return n==='NotReadableError'||n==='AbortError'||n==='InvalidStateError'||n==='TrackStartError'}\n`+
 `function axis818WaitVideo(video,ms){if(!video)return Promise.resolve();if(video.readyState>=2||video.videoWidth>0)return Promise.resolve();return new Promise(function(resolve){var done=false,timer=0;function end(){if(done)return;done=true;clearTimeout(timer);try{video.removeEventListener('loadeddata',end);video.removeEventListener('canplay',end)}catch(e){}resolve()}video.addEventListener('loadeddata',end,{once:true});video.addEventListener('canplay',end,{once:true});timer=setTimeout(end,Math.max(120,Number(ms)||900))})}\n`+
 `async function axis818PrimeCameraStream(stream){var stage=D.createElement('video');stage.muted=true;stage.playsInline=true;stage.autoplay=true;stage.setAttribute('playsinline','');stage.srcObject=stream;try{await stage.play()}catch(e){}await axis818WaitVideo(stage,900);return stage}\n`+
 `async function axis818CommitCameraStream(stream,facing,stage,oldStream){var video=D.querySelector('#cameraVideo');if(!video)throw new Error('camera-video-missing');state.stream=stream;axis818CameraSource=stage||video;video.srcObject=stream;video.dataset.axisFacing=facing;try{await video.play()}catch(e){}await axis818WaitVideo(video,900);axis818CameraSource=video;if(stage)try{stage.srcObject=null}catch(e){}if(oldStream&&oldStream!==stream)axis818StopCameraStream(oldStream);capture8171Facing=facing;capture8171PaintFacing();return true}\n`+
 `async function axis818SwapCameraStream(nextFacing){if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');var oldStream=state.stream||null,oldFacing=capture8171Facing,oldSource=axis818CameraSource||D.querySelector('#cameraVideo'),candidate=null,stage=null,released=false;try{try{candidate=await navigator.mediaDevices.getUserMedia(axis818CameraConstraints(nextFacing));stage=await axis818PrimeCameraStream(candidate)}catch(first){if(!oldStream||!axis818CameraRetryable(first))throw first;axis818CameraSource=oldSource;axis818StopCameraStream(oldStream);if(state.stream===oldStream)state.stream=null;released=true;candidate=await navigator.mediaDevices.getUserMedia(axis818CameraConstraints(nextFacing));stage=await axis818PrimeCameraStream(candidate)}await axis818CommitCameraStream(candidate,nextFacing,stage,released?null:oldStream);return true}catch(error){axis818StopCameraStream(candidate);if(stage)try{stage.srcObject=null}catch(e){}if(released){try{var recovery=await navigator.mediaDevices.getUserMedia(axis818CameraConstraints(oldFacing)),recoveryStage=await axis818PrimeCameraStream(recovery);await axis818CommitCameraStream(recovery,oldFacing,recoveryStage,null)}catch(recoveryError){console.warn('[AXIS camera recovery]',recoveryError)}}else{state.stream=oldStream;axis818CameraSource=oldSource}capture8171Facing=oldFacing;capture8171PaintFacing();throw error}}\n`;
 s=s.slice(0,helperAt)+cameraHelpers+s.slice(helperAt);

 s=replaceFunction(s,'async function startCamera(){',`async function startCamera(){var fallback=D.querySelector('#cameraFallback');fallback?.classList.add('hidden');try{await axis818SwapCameraStream(capture8171Facing);setText('#scanState','就绪');return true}catch(e){console.warn(e);fallback?.classList.remove('hidden');capture8171PaintFacing();setText('#scanState','拍一张');return false}}`,'startCamera');
 s=replaceFunction(s,'function capture8171PaintFacing(){',`function capture8171PaintFacing(){var b=D.querySelector('#v8171CameraFlip'),video=D.querySelector('#cameraVideo');if(video)video.dataset.axisFacing=capture8171Facing;if(!b)return;var current=capture8171Facing==='user'?'前置':'后置',next=capture8171Facing==='user'?'后置':'前置';b.textContent=current;b.dataset.facing=capture8171Facing;b.setAttribute('aria-label','切换至'+next+'镜头，当前'+current);b.setAttribute('aria-busy',capture8171FlipBusy?'true':'false');b.disabled=!!capture8171FlipBusy}`,'camera facing painter');
 s=replaceFunction(s,'async function capture8171FlipCamera(){',`async function capture8171FlipCamera(){if(capture8171FlipBusy)return false;if(capture816Recorder&&capture816Recorder.state==='recording'&&!axis818RecordCanvas){toast('当前浏览器录制时暂不支持切换镜头');return false}capture8171FlipBusy=true;capture8171PaintFacing();var before=capture8171Facing,next=before==='user'?'environment':'user',seq=++axis818CameraSwitchSeq;try{await axis818SwapCameraStream(next);if(seq!==axis818CameraSwitchSeq)return false;capture8171Facing=next;axis818CapturePrefs().captureLastFacing=next;save();capture8171PaintFacing();return true}catch(e){capture8171Facing=before;capture8171PaintFacing();toast('镜头切换失败');return false}finally{capture8171FlipBusy=false;capture8171PaintFacing()}}`,'camera facing flip');

 /* Keep one fixed 30 fps output track for the entire logical recording. Switching
    source cameras never changes MediaRecorder identity or output-track dimensions. */
 const pumpReplacement=`function axis818StartRecordPump(){var preview=D.querySelector('#cameraVideo'),source=axis818CameraSource||preview,track=state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks()[0],settings={};try{settings=track&&track.getSettings?track.getSettings():{}}catch(e){}var w=Number(source&&source.videoWidth)||Number(settings.width)||1280,h=Number(source&&source.videoHeight)||Number(settings.height)||720;if(!(w>0&&h>0)){w=1280;h=720}var cv=D.createElement('canvas');cv.width=Math.max(2,Math.round(w));cv.height=Math.max(2,Math.round(h));var c=cv.getContext('2d',{alpha:false,desynchronized:true});if(!c)return null;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';axis818RecordCanvas=cv;axis818RecordCtx=c;axis818RecordAlive=true;var draw=function(){if(!axis818RecordAlive)return;var live=axis818CameraSource||D.querySelector('#cameraVideo');axis818DrawCameraCover(c,live,cv.width,cv.height);axis818RecordPump=requestAnimationFrame(draw)};draw();if(typeof cv.captureStream!=='function'){axis818RecordCanvas=null;axis818RecordCtx=null;axis818RecordAlive=false;if(axis818RecordPump)cancelAnimationFrame(axis818RecordPump);axis818RecordPump=0;axis818RecordStream=state.stream;return axis818RecordStream}axis818RecordStream=cv.captureStream(30);return axis818RecordStream}`;
 const pumpAt=s.indexOf('function axis818StartRecordPump(){');if(pumpAt<0)fail('record pump missing');
 s=s.slice(0,pumpAt)+`function axis818DrawCameraCover(ctx,source,width,height){var sw=Number(source&&source.videoWidth)||width,sh=Number(source&&source.videoHeight)||height;if(!sw||!sh)return false;var scale=Math.max(width/sw,height/sh),dw=width/scale,dh=height/scale,sx=Math.max(0,(sw-dw)/2),sy=Math.max(0,(sh-dh)/2);try{ctx.drawImage(source,sx,sy,Math.min(sw,dw),Math.min(sh,dh),0,0,width,height);return true}catch(e){return false}}\n`+s.slice(pumpAt);
 s=replaceFunction(s,'function axis818StartRecordPump(){',pumpReplacement,'stable canvas record pump');

 /* Optional release freshness must never become a product/runtime failure. XHR keeps
    the check same-origin and event-driven without creating a rejected fetch promise
    that WebKit/edge layers may surface as a page error. */
 const freshness=/;\(\(\)=>\{'use strict';let last=0,busy=false;async function check\(\)\{[\s\S]*?window\.__AXIS_8103_FRESHNESS__=\{version:'[^']+',eventDriven:true,polling:false\}\}\)\(\);/;
 const freshnessCount=count(s,freshness);if(freshnessCount!==1)fail(`freshness owner expected once, found ${freshnessCount}`);
 const fresh=`;(()=>{'use strict';let last=0,busy=false;function check(){if(/^(?:127\\.|localhost$)/i.test(location.hostname))return;const now=Date.now();if(busy||now-last<10000)return;last=now;busy=true;try{const x=new XMLHttpRequest();x.open('GET','/axis-build.json',true);x.timeout=2500;try{x.setRequestHeader('Cache-Control','no-cache')}catch{};const done=()=>{busy=false};x.onload=()=>{try{if(x.status>=200&&x.status<300){const d=JSON.parse(x.responseText||'{}'),current=String(window.__AXIS_RELEASE__||'8.18');if(String(d.version||'')&&String(d.version)!==current)location.replace('/fresh/?v='+encodeURIComponent(current))}}catch{}finally{done()}};x.onerror=done;x.onabort=done;x.ontimeout=done;x.send()}catch{busy=false}}addEventListener('pageshow',()=>check(),{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()},{passive:true});window.__AXIS_8103_FRESHNESS__={version:'8.18',eventDriven:true,polling:false,transport:'xhr',failOpen:true}})();`;
 s=s.replace(freshness,fresh);

 /* Bind final physical controls after inherited bind() has installed its historical
    handlers. Pointer-up covers iOS sheet gestures; click remains keyboard/mouse fallback. */
 const rootClose=s.lastIndexOf('})();');if(rootClose<0)fail('canonical app IIFE end missing');
 const bindings=`\nfunction axis818ApplyScanSeconds(sec){sec=Number(sec);if(sec!==3&&sec!==5)return false;state.prefs.scanSeconds=sec;save();D.querySelectorAll('#scanSeconds [data-sec]').forEach(function(b){var on=Number(b.dataset.sec)===sec;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});try{D.dispatchEvent(new CustomEvent('axis:recording-pref-changed',{detail:{scanSeconds:sec,source:'axis818-final'}}))}catch(e){}return true}\n`+
 `function axis818BindFieldPolish(){var flip=D.querySelector('#v8171CameraFlip');if(flip&&flip.dataset.axis818Bound!=='1'){flip.dataset.axis818Bound='1';flip.addEventListener('click',function(e){e.preventDefault();capture8171FlipCamera()})}var scan=D.querySelector('#scanSeconds');if(scan&&scan.dataset.axis818Bound!=='1'){scan.dataset.axis818Bound='1';var choose=function(e){if(e.type==='pointerup'&&e.pointerType==='mouse')return;var b=e.target&&e.target.closest?e.target.closest('[data-sec]'):null;if(!b||!scan.contains(b))return;if(e.type==='pointerup')e.preventDefault();axis818ApplyScanSeconds(b.dataset.sec)};scan.addEventListener('pointerup',choose);scan.addEventListener('click',choose);axis818ApplyScanSeconds(state.prefs.scanSeconds)}capture8171PaintFacing()}\n`+
 `axis818BindFieldPolish();\ntry{window.__AXIS_818_FIELD_POLISH__={version:'8.18',cameraFlip:'stable-canvas-source-swap',midRecordFlip:true,exclusiveCameraFallback:'hold-last-frame',scanSeconds:[3,5],scanTouchOwner:'axis818-final',videoPseudoSetting:false,freshness:'xhr-fail-open'}}catch{}\n`;
 s=s.slice(0,rootClose)+bindings+s.slice(rootClose);

 for(const x of visualMemorySentinels)if(!s.includes(x))fail(`inherited visual-memory sentinel lost after field polish: ${x}`);
 for(const needle of ['axis818SwapCameraStream','axis818DrawCameraCover','axis818BindFieldPolish','__AXIS_818_FIELD_POLISH__','XMLHttpRequest'])if(!s.includes(needle))fail(`missing ${needle}`);
 try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
 write(APP,s);
}

console.log('[AXIS 8.18 field polish] PASS · scoped camera owners · inherited visual memory preserved · stable mid-record source switch · iOS scan 3/5 direct owner · video pseudo-setting retired · freshness fail-open');
