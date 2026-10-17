/*
 * AXIS Live PLAY THIS P1 — prospective Object only.
 * This module is compiled into the existing canonical app.js closure, not a
 * separate app runtime. No synthetic Encounter, Activity or Flow writer.
 */
const AXIS_PREPLAY_KEY='axis_preplay_intent_v1';
let axisPreplayTickHandle=null;
function axisPreplayRead(){
 try{const raw=localStorage.getItem(AXIS_PREPLAY_KEY);return raw?axisPreplayValidate(JSON.parse(raw)):null}
 catch{return null}
}
function axisPreplayWrite(p){
 try{localStorage.setItem(AXIS_PREPLAY_KEY,JSON.stringify(axisPreplayValidate(p)));return true}
 catch{return false}
}
function axisPreplayLocale(){
 const lang=(D.documentElement.lang||'zh-Hans').toLowerCase();
 return lang.startsWith('en')?'en':lang.startsWith('zh-hant')||lang.startsWith('zh-tw')?'hant':'hans';
}
function axisPreplayText(key){
 const dict={
  title:['PLAY THIS · 即时练习','PLAY THIS · 即時練習','PLAY THIS · Live practice'],
  running:['正在练习','正在練習','In progress'],
  paused:['已暂停','已暫停','Paused'],
  review:['检查实际成果','確認實際成果','Review your outcome'],
  timer:['本次练习时间','本次練習時間','Time in this practice'],
  sets:['已完成组数','已完成組數','Sets performed'],
  pause:['暂停','暫停','Pause'],
  resume:['继续','繼續','Resume'],
  doneSet:['完成一组','完成一組','Complete a set'],
  finish:['结束练习','結束練習','Finish practice'],
  back:['返回练习','返回練習','Back to practice'],
  record:['编辑成果并记下','編輯成果並記下','Edit outcome and record'],
  abandon:['放弃本次','放棄本次','Discard this practice'],
  abandonAsk:['放弃这次练习？尚未保存训练记录。','放棄這次練習？尚未保存訓練紀錄。','Discard this practice? No workout has been recorded.'],
  close:['先收起','先收起','Hide for now'],
  resumeCard:['继续正在进行的练习','繼續正在進行的練習','Resume live practice'],
  conflict:['已有其他练习正在进行，请先继续或完成它','已有其他練習正在進行，請先繼續或完成它','Another practice is in progress. Resume or finish it first.'],
  storage:['无法保存练习进度，请检查设备存储','無法保存練習進度，請檢查裝置儲存空間','Cannot save progress. Check device storage.'],
  unavailable:['此练习暂时不可用','此練習暫時不可用','This exercise is unavailable'],
  handoff:['打开实际记录失败，练习进度仍然保留','開啟實際記錄失敗，練習進度仍然保留','The recorder could not open; progress is retained'],
  note:['训练记录将在你确认并记下后保存','訓練紀錄在確認並記下後才會保存','Your workout is saved only after you confirm the outcome']
 };
 const v=dict[key]||dict.unavailable;
 return v[['hans','hant','en'].indexOf(axisPreplayLocale())];
}
function axisPreplayClock(ms){
 const s=Math.floor(Math.max(0,ms)/1000),h=Math.floor(s/3600),m=Math.floor(s/60)%60,sec=s%60;
 return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
}
function axisPreplayEnsure(){
 if(!$('#axisPreplaySheet')){
  const el=D.createElement('div');
  el.id='axisPreplaySheet';el.className='sheetWrap';
  el.innerHTML='<section class="sheet axisPreplaySheet" role="dialog" aria-modal="true" aria-labelledby="axisPreplayName">'+
   '<div class="grabber"></div>'+
   '<div class="axisPreplayHeading"><span id="axisPreplayKicker"></span><button type="button" data-preplay="hide" class="axisPreplayClose" aria-label="Close">×</button></div>'+
   '<h2 id="axisPreplayName"></h2><div id="axisPreplayState" class="axisPreplayState"></div>'+
   '<div class="axisPreplayClock"><small id="axisPreplayTimerLabel"></small><strong id="axisPreplayElapsed">00:00</strong></div>'+
   '<div class="axisPreplayProgress" id="axisPreplayProgress" hidden><span id="axisPreplaySetLabel"></span><strong id="axisPreplaySetValue"></strong></div>'+
   '<p class="axisPreplayNote" id="axisPreplayNote"></p>'+
   '<div class="axisPreplayActions" id="axisPreplayActions"></div>'+
   '</section>';
  D.body.appendChild(el);
 }
 if(!$('#axisPreplayResume')){
  const today=$('#todayView'),heading=today?.querySelector('.pageHead');
  if(heading){
   const resume=D.createElement('button');
   resume.type='button';resume.id='axisPreplayResume';resume.dataset.preplay='open';resume.hidden=true;
   resume.className='axisPreplayResume';
   heading.insertAdjacentElement('afterend',resume);
  }
 }
 if(!axisPreplayTickHandle)axisPreplayTickHandle=setInterval(()=>{
  const p=axisPreplayRead();
  if(!p)return;
  const target=$('#axisPreplayElapsed');
  if(target&&$('#axisPreplaySheet')?.classList.contains('show'))
   target.textContent=axisPreplayClock(axisPreplayElapsed(p,Date.now()));
 },1000);
}
function axisPreplayRender(){
 axisPreplayEnsure();
 const p=axisPreplayRead(), resume=$('#axisPreplayResume');
 if(resume){
  resume.hidden=!p;
  if(p)resume.textContent=axisPreplayText('resumeCard')+' · '+(axis831ExactFlowEq(p.objectId)?.name||p.objectId);
 }
 if(!p){$('#axisPreplaySheet')?.classList.remove('show');return}
 const eq=axis831ExactFlowEq(p.objectId);
 if(!eq){$('#axisPreplaySheet')?.classList.remove('show');return}
 setText('#axisPreplayKicker',axisPreplayText('title'));
 setText('#axisPreplayName',eq.name||p.objectId);
 setText('#axisPreplayState',axisPreplayText(p.status));
 setText('#axisPreplayTimerLabel',axisPreplayText('timer'));
 setText('#axisPreplayElapsed',axisPreplayClock(axisPreplayElapsed(p,Date.now())));
 setText('#axisPreplayNote',axisPreplayText('note'));
 const count=$('#axisPreplayProgress');
 count.hidden=!['sets','rounds'].includes(p.mode);
 setText('#axisPreplaySetLabel',axisPreplayText('sets'));
 setText('#axisPreplaySetValue',p.completedSets+' / '+p.repeat);
 const actions=$('#axisPreplayActions');
 const action=(id,label,cls='')=>'<button type="button" data-preplay="'+id+'" class="'+cls+'">'+label+'</button>';
 const review=p.status==='review';
 actions.innerHTML=review?
   action('record',axisPreplayText('record'),'axisPreplayPrimary')+
   action('back',axisPreplayText('back'))+
   action('abandon',axisPreplayText('abandon'),'axisPreplayQuiet'):
   action(p.status==='running'?'pause':'resume',axisPreplayText(p.status==='running'?'pause':'resume'),'axisPreplaySecondary')+
   (p.status==='running'&&['sets','rounds'].includes(p.mode)&&p.completedSets<p.repeat?action('complete-set',axisPreplayText('doneSet')):'')+
   action('review',axisPreplayText('finish'),'axisPreplayPrimary')+
   action('abandon',axisPreplayText('abandon'),'axisPreplayQuiet');
}
function axisPreplayOpen(){
 const p=axisPreplayRead();
 if(!p){axisPreplayRender();return false}
 axisPreplayRender();
 $('#axisPreplaySheet').classList.add('show');
 $('#axisPreplaySheet [data-preplay="hide"]')?.focus({preventScroll:true});
 return true;
}
function axis832StartObject(id){
 if(axis832Pending)return false;
 axis832Pending=true;
 try{
  const previous=axisPreplayRead();
  if(previous){
   if(previous.objectId===id)return axisPreplayOpen();
   toast(axisPreplayText('conflict'));return false;
  }
  if(axis832Conflict()){toast(axisPreplayText('conflict'));return false}
  const compiled=axis832Compile('object',id),first=compiled?.steps?.[0];
  if(!first||first.objectRef!==id||!axis831ExactFlowEq(id)){toast(axisPreplayText('unavailable'));return false}
  // Object selection is display context only; do not start v82/v87 activity.
  selectEq(id,true);
  const p=axisPreplayCreate({attemptId:crypto.randomUUID(),objectId:id,
   mode:first.executionMode,repeat:first.repeat,now:Date.now()});
  if(!axisPreplayWrite(p)){toast(axisPreplayText('storage'));return false}
  closeSheet('eqSheet');
  $('#quickRecordSheet')?.classList.remove('show');
  return axisPreplayOpen();
 }catch(e){console.warn('[AXIS prospective PLAY THIS]',e);toast(axisPreplayText('unavailable'));return false}
 finally{axis832Pending=false}
}
function axisPreplayHandle(action){
 const p=axisPreplayRead();
 if(action==='hide'){$('#axisPreplaySheet')?.classList.remove('show');return}
 if(action==='open'){axisPreplayOpen();return}
 if(!p)return;
 if(action==='abandon'){
  if(!confirm(axisPreplayText('abandonAsk')))return;
  localStorage.removeItem(AXIS_PREPLAY_KEY);axisPreplayRender();return;
 }
 if(action==='record'){
  if(p.status!=='review')return;
  if(axis832Conflict()){toast(axisPreplayText('conflict'));return}
  // Existing v61 Recorder remains the ONLY Encounter writer.
  // If no workout session is open, use the original owner action; no Encounter
  // is written until the user explicitly presses the original save.
  if(!state.active)$('#startBtn')?.click();
  if(!state.active){toast(axisPreplayText('handoff'));return}
  const open=window.__AXIS_OPEN_EQUIPMENT_PICKER__,pick=window.__AXIS_PICK_EQUIPMENT__;
  const success=open&&pick&&(open('quick')!==false&&pick(p.objectId,true)===true);
  if(!success){toast(axisPreplayText('handoff'));return}
  const next=axisPreplayTransition(p,'handoff',Date.now());
  if(!axisPreplayWrite(next)){toast(axisPreplayText('storage'));return}
  $('#axisPreplaySheet')?.classList.remove('show');
  return;
 }
 try{
  const next=axisPreplayTransition(p,action,Date.now());
  if(!axisPreplayWrite(next)){toast(axisPreplayText('storage'));return}
  axisPreplayRender();
 }catch(e){console.warn('[AXIS PLAY THIS action]',e)}
}
function axisPreplayConfirmRecorded(e){
 const p=axisPreplayRead();
 if(!p||p.status!=='review'||!p.handoff||e?.equipmentId!==p.objectId)return false;
 localStorage.removeItem(AXIS_PREPLAY_KEY);
 axisPreplayRender();
 return true;
}
D.addEventListener('click',function axisPreplayClicks(event){
 const b=event.target.closest?.('[data-preplay]');
 if(!b)return;
 event.preventDefault();
 event.stopPropagation();
 axisPreplayHandle(b.dataset.preplay);
},true);
window.addEventListener('storage',event=>{
 if(event.key===AXIS_PREPLAY_KEY)axisPreplayRender();
});
window.__AXIS_PREPLAY__=Object.freeze({
 version:'p1',storage:AXIS_PREPLAY_KEY,newEncounterWriter:false,newActiveOwner:false,
 current:axisPreplayRead,elapsed:()=>{const p=axisPreplayRead();return p?axisPreplayElapsed(p,Date.now()):null},
 confirmRecorded:axisPreplayConfirmRecorded
});
D.addEventListener('DOMContentLoaded',axisPreplayRender,{once:true});
