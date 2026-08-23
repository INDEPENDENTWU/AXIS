import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 camera readiness seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');
function replaceFunction(src,signature,replacement,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){const ch=src[i],next=src[i+1]||'';if(line){if(ch==='\n')line=false;continue}if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}if(ch==='/'&&next==='/'){line=true;i++;continue}if(ch==='/'&&next==='*'){block=true;i++;continue}if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}}
 if(end<0)fail(`${label} close missing`);return src.slice(0,start)+replacement+src.slice(end)
}

/* A stream with no video tracks has no media frame that can ever fire loadeddata or
   canplay. Do not burn two 900ms readiness windows waiting for impossible events.
   Real camera streams keep the full preview-readiness path unchanged. */
s=replaceFunction(s,'function axis818WaitVideo(video,ms){',`function axis818WaitVideo(video,ms){if(!video)return Promise.resolve();try{var stream=video.srcObject;if(stream&&stream.getVideoTracks&&stream.getVideoTracks().length===0)return Promise.resolve()}catch(e){}if(video.readyState>=2||video.videoWidth>0)return Promise.resolve();return new Promise(function(resolve){var done=false,timer=0;function end(){if(done)return;done=true;clearTimeout(timer);try{video.removeEventListener('loadeddata',end);video.removeEventListener('canplay',end)}catch(e){}resolve()}video.addEventListener('loadeddata',end,{once:true});video.addEventListener('canplay',end,{once:true});timer=setTimeout(end,Math.max(120,Number(ms)||900))})}`,'track-aware video readiness');
if(!s.includes("stream.getVideoTracks&&stream.getVideoTracks().length===0"))fail('trackless readiness fast-path missing');
if(!s.includes("if(!state.stream&&axis818CameraReadyPromise)try{await axis818CameraReadyPromise}catch(e){}"))fail('record camera-ready wait missing');
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.18 camera readiness seal] PASS · trackless streams cannot stall preview readiness · real video tracks keep loadeddata/canplay wait · recorder ownership unchanged');
