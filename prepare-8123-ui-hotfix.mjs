import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 UI hotfix] ${m}`)};
const patchOnce=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
  const file='app.js';
  let src=fs.readFileSync(file,'utf8');
  const placeholder=`photo=x.photoRef?'<span class="v8123EqThumb" data-my-eq-photo="'+esc(x.photoRef)+'"></span>':'<span class="v8123EqThumb">'+esc(String(x.name||'').slice(0,1)||'·')+'</span>'`;
  const realPhotoOnly=`photo=x.photoRef?'<span class="v8123EqThumb" data-my-eq-photo="'+esc(x.photoRef)+'"></span>':''`;
  src=patchOnce(src,placeholder,realPhotoOnly,'one-character equipment placeholder');
  src=patchOnce(src,"if(u)el.innerHTML='<img src=\"'+u+'\" alt=\"器械照片\">'","if(u)el.innerHTML='<img src=\"'+u+'\" alt=\"器械照片\">';else{el.dataset.photoMissing='1';el.style.setProperty('display','none','important')}",'missing equipment photo fallback');
  if(src.includes("slice(0,1)||'·'"))fail('synthetic equipment avatar survived');
  fs.writeFileSync(file,src);
}

{
  const file='v87-runtime.js';
  let src=fs.readFileSync(file,'utf8');
  if(!src.includes('__AXIS_8123_SETTINGS_ALIGNMENT_FIX__'))fail('settings alignment owner must run first');
  if(src.includes('__AXIS_8123_UI_HOTFIX__'))fail('UI hotfix already installed');
  const end=src.lastIndexOf('})();');if(end<0)fail('runtime IIFE end missing');
  const block=String.raw`
/* AXIS 8.12.3 — final field UI hotfix: real-photo equipment rows + measured native Settings columns. */
(function axis8123InstallUiHotfix(){
 if(D.querySelector('#v8123UiHotfixStyle'))return;
 const s=D.createElement('style');s.id='v8123UiHotfixStyle';s.textContent=
  '#manageEqList .manageEq.v8123EqRow{box-sizing:border-box!important;width:100%!important;min-height:64px!important;padding:11px 0!important;gap:0!important;grid-template-columns:minmax(0,1fr) 18px!important;align-items:center!important;text-align:left!important}'+
  '#manageEqList .manageEq.v8123EqRow:has(.v8123EqThumb[data-my-eq-photo]:not([data-photo-missing])){min-height:72px!important;padding:10px 0!important;grid-template-columns:50px minmax(0,1fr) 18px!important;column-gap:12px!important}'+
  '#manageEqList .v8123EqThumb{margin:0!important;width:46px!important;height:46px!important;display:block!important;overflow:hidden!important}'+
  '#manageEqList .v8123EqThumb[data-photo-missing]{display:none!important}'+
  '#manageEqList .v8123EqText{display:block!important;min-width:0!important;margin:0!important;color:inherit!important;font-size:inherit!important;justify-self:stretch!important;text-align:left!important}'+
  '#manageEqList .v8123EqText>b{display:block!important;margin:0!important;color:var(--text)!important;font-size:14px!important;font-weight:650!important;line-height:1.35!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}'+
  '#manageEqList .v8123EqText>small{display:block!important;margin:5px 0 0!important;color:var(--muted)!important;font-size:11px!important;line-height:1.3!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}'+
  '#manageEqList .v8123EqChevron{justify-self:end!important;margin:0!important;font-size:20px!important;line-height:1!important}'+
  '#manageEqList.selecting .manageEq.v8123EqRow{padding-left:30px!important}'+
  '#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:0!important;border-top:0!important;transform:none!important}'+
  '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{box-sizing:border-box!important;width:100%!important;height:64px!important;min-height:64px!important;margin:0!important;display:grid!important;grid-template-columns:1fr auto 15px!important;column-gap:0!important;align-items:center!important;text-align:left!important;border-bottom:1px solid var(--line2)!important;transform:none!important}'+
  '#settingsSheet #v813LearningGate>.settingLink>span,#settingsSheet #v813ServiceGate>.settingLink>span{margin:0!important;padding:0!important;color:var(--muted)!important;font-size:13px!important;font-weight:400!important;line-height:normal!important;text-align:left!important}'+
  '#settingsSheet #v813LearningGate>.settingLink>b,#settingsSheet #v813ServiceGate>.settingLink>b{margin:0!important;padding:0!important;max-width:none!important;color:var(--text)!important;font-size:12px!important;font-weight:620!important;line-height:normal!important;text-align:right!important}'+
  '#settingsSheet #v813LearningGate>.settingLink>i,#settingsSheet #v813ServiceGate>.settingLink>i{margin:0!important;padding:0!important;color:var(--dim)!important;font-size:20px!important;line-height:normal!important}'+
  '@media(max-width:380px){#manageEqList .manageEq.v8123EqRow:has(.v8123EqThumb[data-my-eq-photo]:not([data-photo-missing])){grid-template-columns:46px minmax(0,1fr) 16px!important;column-gap:10px!important}}';
 D.head.appendChild(s);
 const sync=()=>{
  const ref=$('#profileBtn'),nativeLabel=ref?.querySelector(':scope>span'),nativeArrow=ref?.querySelector(':scope>i');
  if(!ref||!nativeLabel||!nativeArrow)return false;
  const lr=nativeLabel.getBoundingClientRect(),ar=nativeArrow.getBoundingClientRect();
  for(const row of [$('#v810ConfigEntry'),$('#v811ServiceEntry')]){
   if(!row)continue;
   row.style.setProperty('padding-left','0px','important');row.style.setProperty('padding-right','0px','important');
   let rr=row.getBoundingClientRect();
   const lp=Math.max(0,lr.left-rr.left),baseRp=Math.max(0,rr.right-ar.right);
   row.style.setProperty('padding-left',lp+'px','important');row.style.setProperty('padding-right',baseRp+'px','important');
   const ownArrow=row.querySelector(':scope>i')?.getBoundingClientRect();
   if(ownArrow){const drift=ownArrow.right-ar.right;if(Math.abs(drift)>.1)row.style.setProperty('padding-right',Math.max(0,baseRp+drift)+'px','important')}
   const ownLabel=row.querySelector(':scope>span')?.getBoundingClientRect();
   if(ownLabel){const drift=lr.left-ownLabel.left;if(Math.abs(drift)>.1){const now=parseFloat(row.style.paddingLeft)||0;row.style.setProperty('padding-left',Math.max(0,now+drift)+'px','important')}}
  }
  return true
 };
 window.__AXIS_SYNC_SETTINGS_COLUMNS__=sync;
 const settle=()=>{sync();setTimeout(sync,70);setTimeout(sync,180)};
 D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(settle,0)},true);
 window.addEventListener('pageshow',()=>setTimeout(settle,0),{passive:true});
 setTimeout(settle,0)
})();
try{window.__AXIS_8123_UI_HOTFIX__={version:'8.12.3',equipmentPlaceholder:false,equipmentTextFirst:true,realPhotoOnly:true,missingPhotoFallsBackToText:true,settingsNativeColumns:true,settingsReference:'#profileBtn',twoPassChevronCorrection:true,trainingOwner:false}}catch{}
`;
  src=src.slice(0,end)+block+'\n'+src.slice(end);
  for(const needle of ['__AXIS_8123_UI_HOTFIX__','equipmentPlaceholder:false','settingsNativeColumns:true',"settingsReference:'#profileBtn'",'twoPassChevronCorrection:true'])if(!src.includes(needle))fail(`missing ${needle}`);
  try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
  fs.writeFileSync(file,src);
}

console.log('[AXIS 8.12.3 UI hotfix] PASS · real-photo-only equipment rows · full names · measured native Settings columns');
