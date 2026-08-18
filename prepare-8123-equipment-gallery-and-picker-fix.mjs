import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment gallery/picker] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const onceRe=(src,re,to,label)=>{const m=src.match(re)||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

{
 const FILE='app.js';let src=read(FILE);
 if(src.includes("slice(0,1)||'·'"))fail('final equipment text hotfix must run first');
 if(src.includes('__AXIS_8123_EQUIPMENT_GALLERY__'))fail('equipment gallery already installed');

 const libraryBlock=String.raw`function equipmentPhotoStore(){const p=state.profile||(state.profile={}),x=p.equipmentPhotos;return p.equipmentPhotos=x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function equipmentPhotoEntries(id){const s=equipmentPhotoStore(),a=Array.isArray(s[id])?s[id]:[],clean=a.filter(x=>x&&typeof x.ref==='string'&&x.ref);if(clean.length!==a.length)s[id]=clean;return clean}
function equipmentPhotoCover(id){return equipmentPhotoEntries(id)[0]?.ref||null}
function personalEqLibrary(){
 const custom=new Map((state.profile.customEq||[]).map(x=>[x.id,x])),archived=personalEqArchive(),map=new Map(),events=allEvents().slice().sort((a,b)=>(b.time||0)-(a.time||0)),photos=equipmentPhotoStore();
 for(const e of events){const id=e.equipmentId;if(!id)continue;let x=map.get(id);const def=eqById(id)||custom.get(id)||null,dedicated=equipmentPhotoCover(id);if(!x){x={id,name:def?.name||e.name||'未命名',custom:custom.has(id),uses:0,last:0,photoRef:dedicated||null,photoSource:dedicated?'library':null,type:def?.type||e.kind||'strength'};map.set(id,x)}x.uses++;x.last=Math.max(x.last,Number(e.time)||0);if(!x.photoRef&&e.frameRefs?.[0]){x.photoRef=e.frameRefs[0];x.photoSource='history'}}
 for(const e of custom.values())if(!map.has(e.id)){const dedicated=equipmentPhotoCover(e.id);map.set(e.id,{id:e.id,name:e.name,custom:true,uses:0,last:0,photoRef:dedicated||null,photoSource:dedicated?'library':null,type:e.type||'strength'})}
 for(const id of Object.keys(photos)){if(map.has(id)||!equipmentPhotoEntries(id).length)continue;const def=eqById(id);if(def)map.set(id,{id,name:def.name,custom:custom.has(id),uses:0,last:0,photoRef:equipmentPhotoCover(id),photoSource:'library',type:def.type||'strength'})}
 return [...map.values()].filter(x=>!Number(archived[x.id])||x.last>Number(archived[x.id])||equipmentPhotoEntries(x.id).length).sort((a,b)=>(b.last-a.last)||Number(b.custom)-Number(a.custom)||String(a.name).localeCompare(String(b.name),'zh-CN'))
}
function personalEqCount()`;
 src=onceRe(src,/function personalEqLibrary\(\)\{[\s\S]*?\n\}\nfunction personalEqCount/,libraryBlock,'personal equipment gallery-backed library');

 const removeFn=String.raw`function removePersonalEq(ids){const set=new Set(ids.filter(Boolean));if(!set.size)return;const now=Date.now(),p=state.profile||(state.profile={}),archive=personalEqArchive(),photos=equipmentPhotoStore(),refs=[];p.customEq=(p.customEq||[]).filter(x=>!set.has(x.id));p.memories=(p.memories||[]).filter(x=>!set.has(x.equipmentId));for(const id of set){for(const x of Array.isArray(photos[id])?photos[id]:[])if(x?.ref)refs.push(x.ref);delete photos[id];archive[id]=now}manageEqSelected.clear();manageEqSelectMode=false;save();renderManageEq();render();toast(set.size>1?'已移除 '+set.size+' 项':'已移除');if(refs.length)Promise.allSettled(refs.map(deleteMedia)).then(()=>updateStorageBrief?.()).catch(()=>{})}`;
 src=onceRe(src,/function removePersonalEq\(ids\)\{[^\n]*\}/,removeFn,'personal equipment removal cleans dedicated media');

 const hydrateFn=String.raw`async function hydrateManageEqPhotos(){const root=$('#manageEqList');if(!root)return;for(const el of Array.from(root.querySelectorAll('[data-my-eq-photo]'))){if(el.dataset.loaded)continue;el.dataset.loaded='1';const row=el.closest('.v8123EqRow'),u=await mediaUrl(el.dataset.myEqPhoto);if(u){el.innerHTML='<img src="'+u+'" alt="器械照片">';row?.classList.add('v8123HasPhoto')}else{el.dataset.photoMissing='1';el.style.setProperty('display','none','important');row?.classList.remove('v8123HasPhoto')}}}`;
 src=onceRe(src,/async function hydrateManageEqPhotos\(\)\{[^\n]*\}/,hydrateFn,'personal equipment photo hydration');

 const manageFn=String.raw`function renderManageEq(){
 ensureManageEqChrome();ensureEquipmentGalleryUI();const items=personalEqLibrary(),host=$('#manageEqList');if(!host)return;host.classList.toggle('selecting',manageEqSelectMode);
 host.innerHTML=items.length?items.map(x=>{const meta=x.uses?x.uses+'次 · 最近 '+personalEqDate(x.last):(x.custom?'自定义 · 尚未记录':'尚未记录'),photo=x.photoRef?'<span class="v8123EqThumb" data-my-eq-photo="'+esc(x.photoRef)+'"></span>':'';return'<div class="v8123EqWrap" data-my-eq-wrap="'+esc(x.id)+'"><button type="button" class="v8123EqRemove" data-my-eq-remove="'+esc(x.id)+'">移除</button><button type="button" class="manageEq v8123EqRow" data-my-eq-id="'+esc(x.id)+'" data-my-eq-custom="'+(x.custom?'1':'0')+'"><i class="v8123EqDot '+(manageEqSelected.has(x.id)?'on':'')+'"></i>'+photo+'<span class="v8123EqText"><b>'+esc(x.name)+'</b><small>'+esc(meta)+'</small></span><i class="v8123EqChevron">'+(manageEqSelectMode?'':'›')+'</i></button></div>'}).join(''):'<div class="empty">暂无器械 / 运动</div>';
 const pick=$('#myEqSelect');if(pick)pick.style.visibility=items.length?'visible':'hidden';const bar=$('#v8123EqBatch'),batch=bar?.querySelector('[data-my-eq-batch]');if(batch){batch.disabled=!manageEqSelected.size;batch.textContent='移除 '+manageEqSelected.size+' 项'}
 Array.from(host.querySelectorAll('[data-my-eq-remove]')).forEach(b=>b.onclick=e=>{e.stopPropagation();removePersonalEq([b.dataset.myEqRemove])});
 Array.from(host.querySelectorAll('[data-my-eq-id]')).forEach(row=>{const wrap=row.closest('.v8123EqWrap');row.onclick=()=>{if(wrap?.dataset.swiped==='1'){wrap.dataset.swiped='0';return}const id=row.dataset.myEqId;if(manageEqSelectMode){manageEqSelected.has(id)?manageEqSelected.delete(id):manageEqSelected.add(id);row.querySelector('.v8123EqDot')?.classList.toggle('on',manageEqSelected.has(id));const batch=$('#v8123EqBatch [data-my-eq-batch]');if(batch){batch.disabled=!manageEqSelected.size;batch.textContent='移除 '+manageEqSelected.size+' 项'}return}if(wrap?.classList.contains('open')){wrap.classList.remove('open');return}openEquipmentDetail(id)};row.onpointerdown=e=>{if(manageEqSelectMode)return;manageEqGesture.set(row,{x:e.clientX,y:e.clientY})};row.onpointerup=e=>{if(manageEqSelectMode)return;const p=manageEqGesture.get(row);if(!p)return;manageEqGesture.delete(row);const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)<38||Math.abs(dx)<Math.abs(dy)*1.25)return;wrap.dataset.swiped='1';setTimeout(()=>{if(wrap)wrap.dataset.swiped='0'},360);if(dx<0){closeManageEqSwipes(wrap);wrap.classList.add('open')}else wrap.classList.remove('open')}});hydrateManageEqPhotos();setText('#customCount',items.length)
}`;
 src=onceRe(src,/function renderManageEq\(\)\{[\s\S]*?\n\}/,manageFn,'personal equipment row -> detail route');

 const gallery=String.raw`
let equipmentDetailId='',equipmentPreviewRef='';
function ensureEquipmentGalleryUI(){
 if(!$('#v8123EqGalleryStyle')){const s=D.createElement('style');s.id='v8123EqGalleryStyle';s.textContent=
 '#manageEqList .manageEq.v8123EqRow.v8123HasPhoto{min-height:72px!important;padding:10px 0!important;grid-template-columns:50px minmax(0,1fr) 18px!important;column-gap:12px!important}'+
 '#v8123EqDetailSheet .sheet,#v8123EqPhotoAddSheet .sheet,#v8123EqPhotoPreviewSheet .sheet{padding-bottom:calc(22px + env(safe-area-inset-bottom))}'+
 '.v8123EqDetailMeta{display:flex;align-items:center;min-height:42px;color:var(--dim);font-size:11px;line-height:1.45}'+
 '.v8123EqGalleryHead{height:38px;display:flex;align-items:center;justify-content:space-between}.v8123EqGalleryHead span{color:var(--muted);font-size:12px}.v8123EqGalleryHead b{color:var(--dim);font-size:10px;font-weight:560}'+
 '.v8123EqGallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v8123EqPhoto,.v8123EqPhotoAdd{position:relative;aspect-ratio:1;border-radius:14px;overflow:hidden;background:#12151a}.v8123EqPhoto img{width:100%;height:100%;object-fit:cover;display:block}.v8123EqPhoto i{position:absolute;left:7px;bottom:7px;padding:4px 6px;border-radius:7px;background:rgba(7,8,10,.62);color:#f2f1ed;font-size:8px;font-style:normal;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}.v8123EqPhotoAdd{display:grid;place-items:center;color:var(--accent2);font-size:23px}.v8123EqPhotoAdd small{display:block;margin-top:-18px;padding-top:24px;color:var(--dim);font-size:9px}'+
 '.v8123EqInfoEdit{display:none;width:100%;height:48px;margin-top:16px;border-radius:14px;background:var(--s2);color:var(--muted);font-size:12px}.v8123EqInfoEdit.show{display:block}'+
 '.v8123EqPhotoChoices{display:grid;gap:8px;margin-top:6px}.v8123EqPhotoChoices button{height:58px;border-radius:15px;background:var(--s2);display:flex;align-items:center;justify-content:space-between;padding:0 16px;color:var(--text);font-size:13px}.v8123EqPhotoChoices button i{font-style:normal;color:var(--dim);font-size:18px}'+
 '.v8123EqPreview{width:100%;max-height:62vh;object-fit:contain;border-radius:18px;background:#08090b;display:block}.v8123EqPreviewActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.v8123EqPreviewActions button{height:48px;border-radius:14px;background:var(--s2);color:var(--muted);font-size:12px}.v8123EqPreviewActions .danger{background:rgba(227,130,123,.12);color:#e3a09a}'+
 '@media(max-width:380px){#manageEqList .manageEq.v8123EqRow.v8123HasPhoto{grid-template-columns:46px minmax(0,1fr) 16px!important;column-gap:10px!important}.v8123EqGallery{gap:7px}}';D.head.appendChild(s)}
 if(!$('#v8123EqDetailSheet'))D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="v8123EqDetailSheet"><div class="sheet"><div class="grabber"></div><div class="sheetHead"><b id="v8123EqDetailTitle">器械 / 运动</b><button class="closeBtn" type="button" data-v8123-eq-detail-close>×</button></div><div class="v8123EqDetailMeta" id="v8123EqDetailMeta"></div><div class="v8123EqGalleryHead"><span>照片</span><b id="v8123EqPhotoCount">0 / 10</b></div><div class="v8123EqGallery" id="v8123EqGallery"></div><button class="v8123EqInfoEdit" id="v8123EqInfoEdit" type="button">编辑信息</button></div></div><div class="sheetWrap" id="v8123EqPhotoAddSheet"><div class="sheet"><div class="grabber"></div><div class="sheetHead"><b>添加照片</b><button class="closeBtn" type="button" data-v8123-eq-photo-add-close>×</button></div><div class="v8123EqPhotoChoices"><button type="button" id="v8123EqCamera">拍照<i>›</i></button><button type="button" id="v8123EqLibrary">从相册选择<i>›</i></button></div></div></div><div class="sheetWrap" id="v8123EqPhotoPreviewSheet"><div class="sheet"><div class="grabber"></div><div class="sheetHead"><b>照片</b><button class="closeBtn" type="button" data-v8123-eq-photo-preview-close>×</button></div><img class="v8123EqPreview" id="v8123EqPreview" alt="器械照片"><div class="v8123EqPreviewActions"><button type="button" id="v8123EqCover">设为封面</button><button type="button" class="danger" id="v8123EqPhotoDelete">删除</button></div></div></div><input class="hiddenInput" id="v8123EqCameraInput" type="file" accept="image/*" capture="environment"><input class="hiddenInput" id="v8123EqLibraryInput" type="file" accept="image/*" multiple>');
 const close=(id)=>$('#'+id)?.classList.remove('show');
 $('#v8123EqDetailSheet [data-v8123-eq-detail-close]').onclick=()=>close('v8123EqDetailSheet');$('#v8123EqPhotoAddSheet [data-v8123-eq-photo-add-close]').onclick=()=>close('v8123EqPhotoAddSheet');$('#v8123EqPhotoPreviewSheet [data-v8123-eq-photo-preview-close]').onclick=()=>close('v8123EqPhotoPreviewSheet');
 $('#v8123EqCamera').onclick=()=>$('#v8123EqCameraInput')?.click();$('#v8123EqLibrary').onclick=()=>$('#v8123EqLibraryInput')?.click();
 $('#v8123EqCameraInput').onchange=async e=>{const files=e.target.files;if(files?.length)await addEquipmentPhotoFiles(files,'camera');e.target.value=''};$('#v8123EqLibraryInput').onchange=async e=>{const files=e.target.files;if(files?.length)await addEquipmentPhotoFiles(files,'library');e.target.value=''};
 $('#v8123EqCover').onclick=()=>setEquipmentPhotoCover(equipmentDetailId,equipmentPreviewRef);$('#v8123EqPhotoDelete').onclick=()=>deleteEquipmentPhoto(equipmentDetailId,equipmentPreviewRef);
 $('#v8123EqInfoEdit').onclick=()=>{const id=equipmentDetailId;if(!id)return;close('v8123EqDetailSheet');openCustomEditor(id)};
 }
async function equipmentPhotoFromFile(file){const u=URL.createObjectURL(file),img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=u});const max=1440,scale=Math.min(1,max/Math.max(1,img.naturalWidth,img.naturalHeight)),cv=D.createElement('canvas');cv.width=Math.max(2,Math.round(img.naturalWidth*scale));cv.height=Math.max(2,Math.round(img.naturalHeight*scale));const c=cv.getContext('2d',{alpha:false});c.fillStyle='#08090b';c.fillRect(0,0,cv.width,cv.height);c.drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(u);const fp=fpFromCanvas(cv),blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.86));if(!blob)throw new Error('photo encode');return{blob,fp}}
function equipmentDetailDef(id){const def=eqById(id);if(def)return def;const e=allEvents().find(x=>x.equipmentId===id);return e?{id,name:e.name,type:e.kind,muscles:e.muscles||[],effect:e.effect||''}:null}
async function hydrateEquipmentDetailPhotos(){const host=$('#v8123EqGallery');if(!host)return;for(const b of Array.from(host.querySelectorAll('[data-v8123-eq-photo]'))){const ref=b.dataset.v8123EqPhoto;if(b.dataset.loaded)continue;b.dataset.loaded='1';const u=await mediaUrl(ref);if(!u){b.remove();continue}b.insertAdjacentHTML('afterbegin','<img src="'+u+'" alt="器械照片">')}}
function renderEquipmentDetail(){ensureEquipmentGalleryUI();const id=equipmentDetailId,def=equipmentDetailDef(id);if(!id||!def)return;const photos=equipmentPhotoEntries(id),u=usage(id),meta=[def.type==='cardio'?'有氧':'力量',...(def.muscles||[]).slice(0,3)];if(u.n)meta.push(u.n+'次记录');setText('#v8123EqDetailTitle',def.name||'器械 / 运动');setText('#v8123EqDetailMeta',meta.filter(Boolean).join(' · '));setText('#v8123EqPhotoCount',photos.length+' / 10');const host=$('#v8123EqGallery');host.innerHTML=photos.map((x,i)=>'<button type="button" class="v8123EqPhoto" data-v8123-eq-photo="'+esc(x.ref)+'">'+(i===0?'<i>封面</i>':'')+'</button>').join('')+(photos.length<10?'<button type="button" class="v8123EqPhotoAdd" data-v8123-eq-add>＋<small>添加</small></button>':'');Array.from(host.querySelectorAll('[data-v8123-eq-photo]')).forEach(b=>b.onclick=()=>openEquipmentPhotoPreview(id,b.dataset.v8123EqPhoto));host.querySelector('[data-v8123-eq-add]')?.addEventListener('click',()=>$('#v8123EqPhotoAddSheet')?.classList.add('show'));const edit=$('#v8123EqInfoEdit'),isCustom=!!(state.profile.customEq||[]).some(x=>x.id===id);if(edit){edit.classList.toggle('show',isCustom);if(isCustom)edit.dataset.editEq=id;else delete edit.dataset.editEq}hydrateEquipmentDetailPhotos()}
function openEquipmentDetail(id){if(!equipmentDetailDef(id))return;equipmentDetailId=id;equipmentPreviewRef='';ensureEquipmentGalleryUI();renderEquipmentDetail();$('#v8123EqDetailSheet')?.classList.add('show')}
async function addEquipmentPhotoFiles(files,source){const id=equipmentDetailId;if(!id)return;const list=[...equipmentPhotoEntries(id)],room=Math.max(0,10-list.length),picked=Array.from(files||[]).slice(0,room);if(!picked.length){toast(room?'没有可用照片':'最多保存 10 张');return}const memories=state.profile.memories||(state.profile.memories=[]);try{for(const file of picked){const {blob,fp}=await equipmentPhotoFromFile(file),ref='EQP-'+String(id).replace(/[^a-zA-Z0-9_-]/g,'_')+'-'+uid('P').replace(/[^a-zA-Z0-9_-]/g,'');await putMedia(ref,blob);const t=Date.now();list.push({ref,fp,t,source});if(fp)memories.push({equipmentId:id,fp,t,sourceRef:ref,source:'equipment-photo'})}equipmentPhotoStore()[id]=list;const own=memories.filter(m=>m.equipmentId===id&&m.sourceRef),other=memories.filter(m=>m.equipmentId!==id||!m.sourceRef);state.profile.memories=other.concat(own.slice(-10));save();$('#v8123EqPhotoAddSheet')?.classList.remove('show');renderEquipmentDetail();renderManageEq();updateStorageBrief?.();toast(picked.length+' 张照片已加入')}catch(e){console.error(e);toast('照片保存失败')}}
async function openEquipmentPhotoPreview(id,ref){equipmentDetailId=id;equipmentPreviewRef=ref;const u=await mediaUrl(ref);if(!u)return toast('照片不可用');ensureEquipmentGalleryUI();const img=$('#v8123EqPreview');if(img)img.src=u;const first=equipmentPhotoEntries(id)[0]?.ref===ref,set=$('#v8123EqCover');if(set){set.disabled=first;set.textContent=first?'当前封面':'设为封面'}$('#v8123EqPhotoPreviewSheet')?.classList.add('show')}
function setEquipmentPhotoCover(id,ref){const a=[...equipmentPhotoEntries(id)],i=a.findIndex(x=>x.ref===ref);if(i<=0)return;const [x]=a.splice(i,1);a.unshift(x);equipmentPhotoStore()[id]=a;save();$('#v8123EqPhotoPreviewSheet')?.classList.remove('show');renderEquipmentDetail();renderManageEq();toast('已设为封面')}
async function deleteEquipmentPhoto(id,ref){if(!id||!ref)return;const a=equipmentPhotoEntries(id).filter(x=>x.ref!==ref);equipmentPhotoStore()[id]=a;state.profile.memories=(state.profile.memories||[]).filter(m=>!(m.equipmentId===id&&m.sourceRef===ref));save();try{await deleteMedia(ref)}catch{}$('#v8123EqPhotoPreviewSheet')?.classList.remove('show');equipmentPreviewRef='';renderEquipmentDetail();renderManageEq();updateStorageBrief?.();toast('照片已删除')}
`;
 const anchor='function axis8123InstallFieldPolish()';
 if(!src.includes(anchor))fail('field polish anchor missing');
 src=src.replace(anchor,gallery+'\n'+anchor);

 const deleteCustom=String.raw`function deleteCustomEq(){if(!editCustomId)return;const used=allEvents().some(e=>e.equipmentId===editCustomId);if(used&&!confirm('历史记录会保留名称，但此自定义项将从选择列表移除。继续？'))return;const refs=equipmentPhotoEntries(editCustomId).map(x=>x.ref).filter(Boolean);delete equipmentPhotoStore()[editCustomId];state.profile.customEq=state.profile.customEq.filter(e=>e.id!==editCustomId);state.profile.memories=(state.profile.memories||[]).filter(m=>m.equipmentId!==editCustomId);save();closeSheet('customEqSheet');renderManageEq();render();if(refs.length)Promise.allSettled(refs.map(deleteMedia)).then(()=>updateStorageBrief?.()).catch(()=>{});toast('已删除')}`;
 src=onceRe(src,/function deleteCustomEq\(\)\{[^\n]*\}/,deleteCustom,'custom equipment deletion cleans dedicated media');

 const learned=String.raw`function learnMemory(id){if(!id)return;const arr=state.profile.memories||(state.profile.memories=[]);state.frames.slice(0,3).forEach(f=>f.fp&&arr.push({equipmentId:id,fp:f.fp,t:Date.now(),source:'record'}));const by={};for(const m of arr){if(!m?.equipmentId||!m.fp)continue;(by[m.equipmentId]||(by[m.equipmentId]=[])).push(m)}state.profile.memories=Object.values(by).flatMap(xs=>{const dedicated=xs.filter(x=>x.sourceRef).sort((a,b)=>(b.t||0)-(a.t||0)).slice(0,10),recent=xs.filter(x=>!x.sourceRef).sort((a,b)=>(b.t||0)-(a.t||0)).slice(0,10);return dedicated.concat(recent)});save()}`;
 src=onceRe(src,/function learnMemory\(id\)\{[^\n]*\}/,learned,'visual memory keeps confirmed equipment photos');

 const renderEqFrom="$$('[data-eq]',$('#eqSheet')).forEach(b=>b.onclick=()=>{selectEq(b.dataset.eq,true);closeSheet('eqSheet')})";
 const renderEqTo="$$('[data-eq]',$('#eqSheet')).forEach(b=>b.onclick=()=>{if(!window.__AXIS_PICK_EQUIPMENT__?.(b.dataset.eq,true)){selectEq(b.dataset.eq,true);closeSheet('eqSheet')}})";
 src=once(src,renderEqFrom,renderEqTo,'native catalog picker owner');

 const canonicalMarker="try{window.__AXIS_8123_CANONICAL_SELECTION__={version:'8.12.3',owner:'app-selectEq',libraryFirstClass:true,recordingIdentity:true,customFallback:false}}catch{}";
 const pickerBlock=canonicalMarker+String.raw`
function axis8123EquipmentPickerContext(next){if(next)window.__AXIS_EQUIPMENT_PICK_CONTEXT__=next;return window.__AXIS_EQUIPMENT_PICK_CONTEXT__||'recording'}
window.__AXIS_OPEN_EQUIPMENT_PICKER__=(context='recording')=>{axis8123EquipmentPickerContext(context);renderEqList();openSheet('eqSheet');return true};
window.__AXIS_PICK_EQUIPMENT__=(id,manual=true)=>{const eq=eqById(id);if(!eq)return false;const context=axis8123EquipmentPickerContext();selectEq(id,manual);closeSheet('eqSheet');if(context==='quick'){window.__AXIS_EQUIPMENT_PICK_CONTEXT__='';window.__AXIS_QUICK_SELECTION_COMMIT__?.(id)}else{const scan=$('#scanSheet');if(scan){scan.classList.add('show');scan.classList.remove('v8-quick');$('#captureStage')?.classList.add('hidden');$('#reviewStage')?.classList.remove('hidden')}window.__AXIS_EQUIPMENT_PICK_CONTEXT__='recording'}try{window.dispatchEvent(new CustomEvent('axis:equipment-selected',{detail:{id,context}}))}catch{}return true};
D.addEventListener('click',e=>{if(e.target?.closest?.('#eqSheet [data-close="eqSheet"]')||e.target===$('#eqSheet'))window.__AXIS_EQUIPMENT_PICK_CONTEXT__=''},true);
try{window.__AXIS_8123_PICKER_ROUTER__={version:'8.12.3',owner:'app-canonical-picker',recordingReturnStable:true,quickReturnStable:true,reentryStable:true}}catch{}`;
 src=once(src,canonicalMarker,pickerBlock,'canonical picker router exposure');

 const eqRowBind="$('#equipmentRow').onclick=()=>{renderEqList();openSheet('eqSheet')};";
 const eqRowNext="$('#equipmentRow').onclick=()=>{const current=window.__AXIS_EQUIPMENT_PICK_CONTEXT__;window.__AXIS_OPEN_EQUIPMENT_PICKER__?.(current==='quick'?'quick':'recording')};";
 src=once(src,eqRowBind,eqRowNext,'recording picker entry');

 const galleryMarker="try{window.__AXIS_8123_EQUIPMENT_GALLERY__={version:'8.12.3',owner:'axis_v42_media',refs:'profile.equipmentPhotos',maxPerEquipment:10,multiPhoto:true,camera:true,library:true,cover:true,visualMemory:true,trainingHistoryOwner:false}}catch{}\n";
 const memoryMarker='try{window.__AXIS_8123_EQUIPMENT_MEMORY__=';
 const mi=src.indexOf(memoryMarker);if(mi<0)fail('equipment memory marker missing');const mle=src.indexOf('\n',mi);if(mle<0)fail('equipment memory marker line end missing');src=src.slice(0,mle+1)+galleryMarker+src.slice(mle+1);

 syntax(src,FILE);write(FILE,src)
}

{
 const FILE='v61.js';let src=read(FILE);
 if(src.includes('__AXIS_8123_QUICK_PICKER_FIX__'))fail('quick picker fix already installed');
 const quickButtons="$('#v8Other').onclick=()=>{quickOther=true;$('#quickRecordSheet').classList.remove('show');$('#equipmentRow')?.click()};$('#v8New').onclick=()=>{$('#quickRecordSheet').classList.remove('show');$('#addCustomEq')?.click()}";
 const quickButtonsNext="$('#v8Other').onclick=()=>{quickOther=true;$('#quickRecordSheet').classList.remove('show');window.__AXIS_EQUIPMENT_PICK_CONTEXT__='quick';if(!window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick'))$('#equipmentRow')?.click()};$('#v8New').onclick=()=>{quickOther=true;$('#quickRecordSheet').classList.remove('show');window.__AXIS_EQUIPMENT_PICK_CONTEXT__='quick';$('#addCustomEq')?.click()}";
 src=once(src,quickButtons,quickButtonsNext,'Quick Record picker entries');

 const choose=String.raw`function chooseQuick(id){$('#quickRecordSheet')?.classList.remove('show');quickOther=true;window.__AXIS_EQUIPMENT_PICK_CONTEXT__='quick';if(window.__AXIS_PICK_EQUIPMENT__?.(id,true))return;if(window.__AXIS_SELECT_EQUIPMENT__?.(id,true)){quickOther=false;window.__AXIS_EQUIPMENT_PICK_CONTEXT__='';setTimeout(()=>showQuickEditor(id),0);return}$('#equipmentRow')?.click();let mountTries=0;const resolve=()=>{const direct=$$('#eqSheet [data-eq]').find(x=>x.dataset.eq===id),lib=$$('#eqSheet [data-v877-lib]').find(x=>x.dataset.v877Lib===id),b=direct||lib;if(!b){if(mountTries++<40)setTimeout(resolve,25);return}b.click()};setTimeout(resolve,0)}`;
 src=onceRe(src,/function chooseQuick\(id\)\{[^\n]*\}/,choose,'Quick Record direct canonical picker');

 const showRe=/function showQuickEditor\(id\)\{[^\n]*\}/;
 const show=(src.match(showRe)||[])[0];if(!show)fail('showQuickEditor missing');
 const showPlus=show+"\nwindow.__AXIS_QUICK_SELECTION_COMMIT__=(id)=>{quickOther=false;window.__AXIS_EQUIPMENT_PICK_CONTEXT__='';setTimeout(()=>showQuickEditor(id),0)};try{window.__AXIS_8123_QUICK_PICKER_FIX__={version:'8.12.3',owner:'quick-selection-commit',otherCatalog:true,reentry:true}}catch{}";
 src=onceRe(src,showRe,showPlus,'Quick Record selection commit callback');

 const legacy="else if(b.matches('#eqSheet [data-eq]')&&quickOther){quickOther=false;setTimeout(()=>showQuickEditor(b.dataset.eq),0)}";
 src=once(src,legacy,"else if(b.matches('#eqSheet [data-eq]')&&quickOther){/* app canonical picker commits Quick Record */}",'retire legacy Quick Record data-eq click owner');
 syntax(src,FILE);write(FILE,src)
}

{
 const FILE='v877-runtime.js';let src=read(FILE);
 const choose=String.raw`async function chooseLib(id){const item=LIB.find(x=>x.id===id);if(!item)return;const eqSheet=$('#eqSheet');if(eqSheet)eqSheet.classList.add('v877Preparing');try{const target=item.baseId||item.id;if(window.__AXIS_PICK_EQUIPMENT__?.(target,true))return;if(window.__AXIS_SELECT_EQUIPMENT__?.(target,true)){eqSheet?.classList.remove('show');return}const existing=$$('#eqSheet [data-eq]').find(b=>b.dataset.eq===target||b.textContent.trim().includes(item.name));if(existing){existing.click();return}$('#addCustomEq')?.click();await new Promise(r=>setTimeout(r,65));const input=$('#customName');if(!input)return;input.value=item.name;input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,130));$('#saveCustomEq')?.click()}finally{setTimeout(()=>eqSheet?.classList.remove('v877Preparing'),260)}}`;
 src=onceRe(src,/async function chooseLib\(id\)\{[^\n]*\}/,choose,'expanded library canonical picker');
 syntax(src,FILE);write(FILE,src)
}

{
 const FILE='v87-runtime.js';let src=read(FILE);
 if(src.includes('__AXIS_8123_SETTINGS_SURFACE__'))fail('Settings surface already installed');
 const end=src.lastIndexOf('})();');if(end<0)fail('v87 runtime end missing');
 const block=String.raw`
/* AXIS 8.12.3 — separator cleanup + distinct compact Training Report entry. */
(function axis8123InstallSettingsSurface(){
 if(!D.querySelector('#v8123SettingsSurfaceStyle')){const s=D.createElement('style');s.id='v8123SettingsSurfaceStyle';s.textContent=
 '#settingsSheet .v8123NoDivider{border-bottom:0!important}'+
 '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{border-bottom:0!important}'+
 '#settingsSheet #reportBtn.v8123ReportEntry{box-sizing:border-box;width:100%;height:64px;margin:12px 0 4px;padding:0 16px;border:0!important;border-radius:16px;background:linear-gradient(100deg,rgba(115,124,255,.11),rgba(255,255,255,.035));display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;box-shadow:none}'+
 '#settingsSheet #reportBtn.v8123ReportEntry:active{transform:scale(.992);background:linear-gradient(100deg,rgba(115,124,255,.15),rgba(255,255,255,.05))}'+
 '#settingsSheet #reportBtn.v8123ReportEntry>.v8123ReportTitle{display:flex;align-items:center;gap:10px;color:var(--text);font-size:14px;font-weight:650}'+
 '#settingsSheet #reportBtn.v8123ReportEntry>.v8123ReportTitle:before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent2);box-shadow:0 0 0 5px rgba(115,124,255,.10)}'+
 '#settingsSheet #reportBtn.v8123ReportEntry>.v8123ReportGo{display:flex;align-items:center;gap:5px;color:var(--muted);font-size:11px;font-weight:580}#settingsSheet #reportBtn.v8123ReportEntry>.v8123ReportGo i{font-style:normal;color:var(--dim);font-size:19px;line-height:1}';D.head.appendChild(s)}
 let queued=false;const polish=()=>{queued=false;for(const row of [$('#v810ConfigEntry'),$('#v811ServiceEntry')])row?.classList.add('v8123NoDivider');for(const el of Array.from(D.querySelectorAll('#settingsSheet button,#settingsSheet .settingLink'))){const text=(el.querySelector(':scope>span')?.textContent||el.textContent||'').replace(/\s+/g,'').trim();if(text.startsWith('提醒与声音'))el.classList.add('v8123NoDivider')}const report=$('#reportBtn');if(report){report.classList.add('v8123ReportEntry','v8123NoDivider');if(report.dataset.v8123Report!=='1'){report.dataset.v8123Report='1';report.innerHTML='<span class="v8123ReportTitle">训练报告</span><span class="v8123ReportGo">查看<i>›</i></span>'}}};
 const schedule=()=>{if(queued)return;queued=true;queueMicrotask(polish)};polish();const sheet=$('#settingsSheet');if(sheet)new MutationObserver(schedule).observe(sheet,{childList:true,subtree:true});D.addEventListener('click',e=>{if(e.target?.closest?.('#settingsBtn'))setTimeout(polish,40)},true);window.addEventListener('pageshow',()=>setTimeout(polish,40),{passive:true});
})();
try{window.__AXIS_8123_SETTINGS_SURFACE__={version:'8.12.3',dividerFree:['学习安排','云端与AI','提醒与声音','训练报告'],reportEntry:'distinct-compact-card',reportFunctionUnchanged:true,trainingOwner:false}}catch{}
`;
 src=src.slice(0,end)+block+'\n'+src.slice(end);syntax(src,FILE);write(FILE,src)
}

console.log('[AXIS 8.12.3 equipment gallery/picker] PASS · multi-photo personal equipment memory · single picker owner · Quick/recording re-entry stable · Settings separators/report surface refined');
