(function(){'use strict';
function b64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]||'');r.onerror=rej;r.readAsDataURL(blob)})}
const native=()=>window.AXISNative||null;
window.AXISPlatform={
  kind:native()?'native':'web',
  capabilities(){const n=native();return{native:!!n,photosWrite:!!n?.saveToPhotos,haptics:!!n?.haptic,secureIdentity:!!n?.passkey,backgroundUpload:!!n?.backgroundUpload}},
  async saveToPhotos(blob,name){const n=native();if(!n?.saveToPhotos)return{ok:false,reason:'web_requires_system_share'};try{return await n.saveToPhotos({name,type:blob.type,data:await b64(blob)})}catch(e){return{ok:false,reason:'native_error'}}},
  haptic(kind='light'){try{native()?.haptic?.(kind)}catch{}},
  async share(blob,name){try{const f=new File([blob],name,{type:blob.type||'application/octet-stream'});if(navigator.canShare?.({files:[f]})&&navigator.share){await navigator.share({files:[f]});return{ok:true}}}catch(e){if(e?.name==='AbortError')return{ok:false,reason:'cancelled'}}return{ok:false,reason:'unsupported'}},
  async installIdentity(){const n=native();if(!n?.passkey)return{ok:false,reason:'not_native'};return n.passkey()},
  version:'axis-platform-v1'
};
})();
