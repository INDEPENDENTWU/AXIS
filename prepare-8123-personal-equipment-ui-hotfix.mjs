import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 personal equipment UI hotfix] ${m}`)};
const replaceOne=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const FILE='app.js';let src=fs.readFileSync(FILE,'utf8');
 if(!src.includes('__AXIS_8123_EQUIPMENT_MEMORY__'))fail('equipment memory must be installed first');
 if(src.includes('__AXIS_8123_PERSONAL_EQUIPMENT_UI_HOTFIX__'))fail('personal equipment UI hotfix already installed');

 const fallback="photo=x.photoRef?'<span class=\"v8123EqThumb\" data-my-eq-photo=\"'+esc(x.photoRef)+'\"></span>':'<span class=\"v8123EqThumb\">'+esc(String(x.name||'').slice(0,1)||'·')+'</span>',edit=x.custom?' data-edit-eq=\"'+esc(x.id)+'\"':''";
 const photoOnly="photo=x.photoRef?'<span class=\"v8123EqThumb\" data-my-eq-photo=\"'+esc(x.photoRef)+'\"></span>':'',photoClass=x.photoRef?' hasPhoto':'',edit=x.custom?' data-edit-eq=\"'+esc(x.id)+'\"':''";
 src=replaceOne(src,fallback,photoOnly,'single-character photo fallback');
 src=replaceOne(src,'class=\"manageEq v8123EqRow\" data-my-eq-id=','class=\"manageEq v8123EqRow\'+photoClass+\'\" data-my-eq-id=','personal row photo class');

 const hydrate="async function hydrateManageEqPhotos(){const root=$('#manageEqList');if(!root)return;for(const el of Array.from(root.querySelectorAll('[data-my-eq-photo]'))){if(el.dataset.loaded)continue;el.dataset.loaded='1';const u=await mediaUrl(el.dataset.myEqPhoto);if(u)el.innerHTML='<img src=\"'+u+'\" alt=\"器械照片\">'}}";
 const hydrateSafe="async function hydrateManageEqPhotos(){const root=$('#manageEqList');if(!root)return;for(const el of Array.from(root.querySelectorAll('[data-my-eq-photo]'))){if(el.dataset.loaded)continue;el.dataset.loaded='1';const u=await mediaUrl(el.dataset.myEqPhoto);if(u){el.innerHTML='<img src=\"'+u+'\" alt=\"器械照片\">';continue}const row=el.closest('.v8123EqRow');el.remove();row?.classList.remove('hasPhoto')}}";
 src=replaceOne(src,hydrate,hydrateSafe,'missing-photo fallback');

 const end=src.lastIndexOf('})();');if(end<0)fail('app runtime IIFE end missing');
 const block=String.raw`
(function axis8123PersonalEquipmentUiHotfix(){
 if(D.querySelector('#v8123PersonalEquipmentUiHotfixStyle'))return;
 const s=D.createElement('style');s.id='v8123PersonalEquipmentUiHotfixStyle';s.textContent=
  '#manageEqList .manageEq.v8123EqRow{grid-template-columns:minmax(0,1fr) 18px!important;gap:12px!important;min-height:64px!important;padding:11px 0!important;align-items:center!important}'+
  '#manageEqList .manageEq.v8123EqRow.hasPhoto{grid-template-columns:50px minmax(0,1fr) 18px!important;min-height:74px!important;padding:10px 0!important}'+
  '#manageEqList .manageEq.v8123EqRow>.v8123EqThumb{display:grid!important;width:46px!important;height:46px!important;margin:0!important;border-radius:13px!important;overflow:hidden!important;background:var(--s2)!important;place-items:center!important}'+
  '#manageEqList .manageEq.v8123EqRow>.v8123EqText{display:block!important;min-width:0!important;margin:0!important;color:inherit!important;font-size:inherit!important;line-height:normal!important}'+
  '#manageEqList .manageEq.v8123EqRow>.v8123EqText>b{display:block!important;margin:0!important;color:var(--text)!important;font-size:14px!important;font-weight:650!important;line-height:1.25!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'+
  '#manageEqList .manageEq.v8123EqRow>.v8123EqText>small{display:block!important;margin:5px 0 0!important;color:var(--muted)!important;font-size:11px!important;font-weight:400!important;line-height:1.25!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'+
  '#manageEqList .manageEq.v8123EqRow>.v8123EqChevron{margin:0!important;align-self:center!important}'+
  '#manageEqList.selecting .manageEq.v8123EqRow{padding-left:30px!important}'+
  '@media(max-width:380px){#manageEqList .manageEq.v8123EqRow{grid-template-columns:minmax(0,1fr) 16px!important}#manageEqList .manageEq.v8123EqRow.hasPhoto{grid-template-columns:46px minmax(0,1fr) 16px!important}#manageEqList .manageEq.v8123EqRow>.v8123EqThumb{width:43px!important;height:43px!important}}';
 D.head.appendChild(s)
})();
try{window.__AXIS_8123_PERSONAL_EQUIPMENT_UI_HOTFIX__={version:'8.12.3',regularTextWithoutPhoto:true,photoOnlyThumbnail:true,singleCharacterFallback:false,missingMediaFallsBackToText:true,trainingOwner:false}}catch{}
`;
 src=src.slice(0,end)+block+'\n'+src.slice(end);
 for(const needle of ['__AXIS_8123_PERSONAL_EQUIPMENT_UI_HOTFIX__','regularTextWithoutPhoto:true','singleCharacterFallback:false','missingMediaFallsBackToText:true'])if(!src.includes(needle))fail(`app marker missing ${needle}`);
 try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

{
 const FILE='v87-runtime.js';let src=fs.readFileSync(FILE,'utf8');
 if(!src.includes('__AXIS_8123_SETTINGS_ALIGNMENT_FIX__'))fail('previous settings alignment must be installed first');
 if(src.includes('__AXIS_8123_SETTINGS_NATIVE_COLUMNS__'))fail('native settings column sync already installed');
 const end=src.lastIndexOf('})();');if(end<0)fail('v87 runtime IIFE end missing');
 const block=String.raw`
(function axis8123InstallNativeSettingsColumns(){
 if(D.querySelector('#v8123NativeSettingsColumnsStyle'))return;
 const s=D.createElement('style');s.id='v8123NativeSettingsColumnsStyle';s.textContent=
  '#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{width:100%!important;margin:0!important;padding:0!important;border-top:0!important;transform:none!important}'+
  '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{box-sizing:border-box!important;width:100%!important;height:60px!important;min-height:60px!important;margin:0!important;grid-template-columns:1fr auto 15px!important;gap:0!important;align-items:center!important;border-bottom:1px solid var(--line2)!important;transform:none!important}'+
  '#settingsSheet #v813LearningGate>.settingLink>span,#settingsSheet #v813ServiceGate>.settingLink>span{font-size:13px!important;font-weight:400!important;line-height:normal!important;margin:0!important;color:var(--muted)!important}'+
  '#settingsSheet #v813LearningGate>.settingLink>b,#settingsSheet #v813ServiceGate>.settingLink>b{font-size:12px!important;font-weight:620!important;line-height:normal!important;margin:0!important;color:var(--text)!important}'+
  '#settingsSheet #v813LearningGate>.settingLink>i,#settingsSheet #v813ServiceGate>.settingLink>i{font-size:20px!important;line-height:normal!important;margin:0!important;color:var(--dim)!important}';
 D.head.appendChild(s);
 const sync=()=>{
  const ref=$('#profileBtn'),label=ref?.querySelector(':scope>span'),arrow=ref?.querySelector(':scope>i');if(!ref||!label||!arrow)return false;
  const lr=label.getBoundingClientRect(),ar=arrow.getBoundingClientRect();
  for(const row of [$('#v810ConfigEntry'),$('#v811ServiceEntry')]){
   if(!row)continue;const tr=row.getBoundingClientRect();
   const lp=Math.max(0,lr.left-tr.left),baseRp=Math.max(0,tr.right-ar.right);
   row.style.setProperty('padding-left',lp+'px','important');row.style.setProperty('padding-right',baseRp+'px','important');
   const ownArrow=row.querySelector(':scope>i'),ownRect=ownArrow?.getBoundingClientRect();
   if(ownRect){const drift=ownRect.right-ar.right;if(Math.abs(drift)>.1)row.style.setProperty('padding-right',Math.max(0,baseRp+drift)+'px','important')}
  }
  return true
 };
 window.__AXIS_SYNC_SETTINGS_COLUMNS__=sync;
 const settle=()=>{sync();setTimeout(sync,80);setTimeout(sync,220)};
 D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(settle,0)},true);
 window.addEventListener('pageshow',()=>setTimeout(settle,0),{passive:true});
 setTimeout(settle,0)
})();
try{window.__AXIS_8123_SETTINGS_NATIVE_COLUMNS__={version:'8.12.3',reference:'#profileBtn',dynamicReferenceGeometry:true,twoPassChevronCorrection:true,nativeTypography:true,nativeRowHeight:60,hardcodedColumnInset:false,trainingOwner:false}}catch{}
`;
 src=src.slice(0,end)+block+'\n'+src.slice(end);
 for(const needle of ['__AXIS_8123_SETTINGS_NATIVE_COLUMNS__',"reference:'#profileBtn'",'dynamicReferenceGeometry:true','twoPassChevronCorrection:true','hardcodedColumnInset:false'])if(!src.includes(needle))fail(`settings marker missing ${needle}`);
 try{new Function(src)}catch(e){fail(`v87-runtime.js syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

console.log('[AXIS 8.12.3 personal equipment UI hotfix] PASS · no letter tiles · photo-only thumbnails · normal text rows · Settings columns reference native row geometry');
