/*
 * AXIS PLAY THIS — strength execution UI, same app closure as canonical
 * axis821CommitEncounter. No second Encounter writer or mandatory Recorder.
 */
const AXIS_STRENGTH_KEY='axis_play_strength_draft_v1';
let axisStrengthTimer=null,axisStrengthSaving=false;
function axisStrengthRead(){
 try{const value=localStorage.getItem(AXIS_STRENGTH_KEY);return value?axisStrengthValidate(JSON.parse(value)):null}
 catch(e){console.warn('[AXIS PLAY strength] unreadable draft',e);return null}
}
function axisStrengthWrite(p){
 try{localStorage.setItem(AXIS_STRENGTH_KEY,JSON.stringify(axisStrengthValidate(p)));
  return axisStrengthRead()?.revision===p.revision}
 catch{return false}
}
function axisStrengthLang(){
 const l=(D.documentElement.lang||'zh-Hans').toLowerCase();
 return l.startsWith('en')?2:l.startsWith('zh-hant')||l.startsWith('zh-tw')?1:0;
}
function axisStrengthLabel(k){
 const d={
 title:['PLAY THIS · 力量訓練','PLAY THIS · 力量訓練','PLAY THIS · Strength'],
 active:['正在執行','正在執行','In progress'],
 rest:['組間休息','組間休息','Rest between sets'],
 paused:['已暫停','已暫停','Paused'],
 review:['檢查實際成果','確認實際成果','Review actual results'],
 elapsed:['本次經過時間','本次經過時間','Elapsed time'],
 set:['目前組數','目前組數','Current set'],
 goal:['計畫組數（可調整）','計畫組數（可調整）','Planned sets (editable)'],
 restTime:['組間休息','組間休息','Rest time'],
 actualW:['實際重量 (kg)','實際重量 (kg)','Actual weight (kg)'],
 actualR:['實際次數','實際次數','Actual reps'],
 confirm:['完成本組','完成本組','Confirm completed set'],
 next:['開始下一組','開始下一組','Start next set'],
 pause:['暫停練習','暫停練習','Pause'],
 resume:['繼續練習','繼續練習','Resume'],
 finish:['結束並檢查成果','結束並確認成果','Finish & review'],
 back:['返回練習','返回練習','Back to practice'],
 save:['完成並儲存','完成並儲存','Finish & save'],
 discard:['放棄本次練習','放棄本次練習','Discard this practice'],
 ask:['放棄尚未儲存的練習？','放棄尚未儲存的練習？','Discard unsaved practice?'],
 hide:['收起','收起','Hide'],
 resumeCard:['返回正在進行的 PLAY THIS','返回正在進行的 PLAY THIS','Resume your PLAY THIS'],
 empty:['還沒有確認完成任何一組。','尚未確認完成任何一組。','No sets confirmed yet.'],
 note:['只有你確認的組數會成為訓練紀錄；不需要再點「記下」。','只有你確認的組數會成為訓練紀錄；不必再按「記下」。','Only confirmed sets become a workout record. No second recorder required.'],
 conflict:['已有其他訓練正在進行，請先處理目前練習','已有其他訓練正在進行，請先處理目前練習','Another practice is active. Continue or finish it first.'],
 invalid:['請填寫實際重量及次數，重量可為 0','請填寫實際重量及次數，重量可為 0','Enter actual weight and reps; weight may be zero'],
 failure:['儲存未確認成功；本次練習已保留，可重試','儲存未確認成功；練習仍保留，可重試','Save unverified. Practice retained for retry'],
 success:['本次訓練已儲存','本次訓練已儲存','Practice saved'],
 saved:['已完成的組數','已完成的組數','Confirmed sets'],
 edit:['更新','更新','Update'],
 restSkip:['跳過休息','跳過休息','Skip rest'],
 seconds:['秒','秒','sec'],
 last:['最後一組','最後一組','Last set'],
 none:['未有可保存的實際成果','尚無可儲存的實際成果','No performed sets to save']
 };
 return (d[k]||[k,k,k])[axisStrengthLang()];
}
function axisStrengthFormat(ms){
 const sec=Math.floor(Math.max(0,ms)/1000),m=Math.floor(sec/60)%60,h=Math.floor(sec/3600);
 return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
}
function axisStrengthButton(id,label,kind=''){
 return '<button type="button" data-strength="'+id+'" class="'+kind+'">'+label+'</button>';
}
function axisStrengthRecorded(attempt){
 return allEvents().find(e=>e.playThis?.attemptId===attempt)||null;
}
function axisStrengthHost(){
 if(!$('#axisStrengthSheet')){
  const el=D.createElement('div');el.id='axisStrengthSheet';el.className='sheetWrap';
  el.innerHTML='<section class="sheet axisStrengthSheet" role="dialog" aria-modal="true" aria-labelledby="axisStrengthName">'+
   '<div class="grabber"></div><div class="axisStrengthTop"><span id="axisStrengthKicker"></span>'+
   '<button type="button" class="axisStrengthClose" data-strength="hide" aria-label="Close">×</button></div>'+
   '<h2 id="axisStrengthName"></h2><div id="axisStrengthPhase"></div>'+
   '<div class="axisStrengthClock"><small id="axisStrengthTimeLabel"></small><strong id="axisStrengthClockValue"></strong></div>'+
   '<div id="axisStrengthContent" aria-live="polite"></div><div id="axisStrengthMessage" role="status" aria-live="polite"></div></section>';
  D.body.appendChild(el);
 }
 if(!$('#axisStrengthResume')){
  const head=$('#todayView .pageHead');
  if(head){const b=D.createElement('button');b.id='axisStrengthResume';b.type='button';
   b.dataset.strength='open';b.className='axisStrengthResume';b.hidden=true;
   head.insertAdjacentElement('afterend',b)}
 }
 if(!axisStrengthTimer)axisStrengthTimer=setInterval(()=>{
  const p=axisStrengthRead();if(!p)return;
  if(p.phase==='rest'&&axisStrengthRestLeft(p,Date.now())===0){
   const next=axisStrengthUpdate(p,'rest-done',Date.now());
   if(axisStrengthWrite(next)){axisStrengthRender();return}
  }
  const count=$('#axisStrengthClockValue');
  if(count&&$('#axisStrengthSheet')?.classList.contains('show'))
   count.textContent=axisStrengthFormat(axisStrengthElapsed(p,Date.now()));
  const rest=$('#axisStrengthRestClock');if(rest&&p.phase==='rest')rest.textContent=axisStrengthRestLeft(p,Date.now())+'s';
 },1000);
}
function axisStrengthRender(){
 axisStrengthHost();
 const p=axisStrengthRead(),button=$('#axisStrengthResume');
 if(button){button.hidden=!p;
  if(p)button.textContent=axisStrengthLabel('resumeCard')+' · '+(axis831ExactFlowEq(p.objectId)?.name||p.objectId)}
 if(!p){$('#axisStrengthSheet')?.classList.remove('show');return}
 const eq=axis831ExactFlowEq(p.objectId);
 if(!eq){$('#axisStrengthSheet')?.classList.remove('show');return}
 setText('#axisStrengthKicker',axisStrengthLabel('title'));
 setText('#axisStrengthName',eq.name);
 setText('#axisStrengthPhase',axisStrengthLabel(p.phase==='running'?'active':p.phase));
 setText('#axisStrengthTimeLabel',axisStrengthLabel('elapsed'));
 setText('#axisStrengthClockValue',axisStrengthFormat(axisStrengthElapsed(p,Date.now())));
 const n=p.sets.length,rest=p.phase==='rest';
 const actuals=p.sets.map(s=>'<div class="axisStrengthSetRow"><b>'+s.index+'</b><span>'+s.weight+' kg × '+s.reps+'</span></div>').join('');
 let markup='';
 if(p.phase==='review'){
  markup='<div class="axisStrengthSectionTitle">'+axisStrengthLabel('saved')+' · '+n+'</div>'+
   (n?'<div class="axisStrengthReview">'+p.sets.map(s=>
    '<div class="axisStrengthReviewRow" data-review-index="'+s.index+'"><b>'+s.index+'</b>'+
    '<label>'+axisStrengthLabel('actualW')+'<input type="number" inputmode="decimal" min="0" max="1000" step=".5" data-field="weight" value="'+s.weight+'"></label>'+
    '<label>'+axisStrengthLabel('actualR')+'<input type="number" inputmode="numeric" min="1" max="500" step="1" data-field="reps" value="'+s.reps+'"></label>'+
    axisStrengthButton('edit-set',axisStrengthLabel('edit'))+'</div>').join('')+'</div>':
    '<p>'+axisStrengthLabel('empty')+'</p>')+
   '<p class="axisStrengthNote">'+axisStrengthLabel('note')+'</p>'+
   axisStrengthButton('save',axisStrengthLabel('save'),'axisStrengthPrimary')+
   axisStrengthButton('back',axisStrengthLabel('back'))+
   axisStrengthButton('abandon',axisStrengthLabel('discard'),'axisStrengthQuiet');
 }else if(rest){
  markup='<div class="axisStrengthRest"><small>'+axisStrengthLabel('rest')+'</small>'+
   '<strong id="axisStrengthRestClock">'+axisStrengthRestLeft(p,Date.now())+'s</strong></div>'+
   '<div class="axisStrengthConfirmed">'+actuals+'</div>'+
   axisStrengthButton('rest-done',axisStrengthLabel('next'),'axisStrengthPrimary')+
   axisStrengthButton('finish',axisStrengthLabel('finish'))+
   axisStrengthButton('abandon',axisStrengthLabel('discard'),'axisStrengthQuiet');
 }else if(p.phase==='paused'){
  markup='<div class="axisStrengthConfirmed">'+actuals+'</div>'+
   axisStrengthButton('resume',axisStrengthLabel('resume'),'axisStrengthPrimary')+
   axisStrengthButton('finish',axisStrengthLabel('finish'))+
   axisStrengthButton('abandon',axisStrengthLabel('discard'),'axisStrengthQuiet');
 }else{
  const last=p.sets.at(-1)||lastEvent(p.objectId);
  const w=Number.isFinite(last?.weight)?String(last.weight):'';
  const r=Number.isFinite(last?.reps)?String(last.reps):'';
  markup='<div class="axisStrengthCount"><small>'+axisStrengthLabel('set')+'</small><strong>'+(n+1)+' / '+p.targetSets+'</strong></div>'+
   (!n?'<div class="axisStrengthPlan"><label>'+axisStrengthLabel('goal')+
    '<input type="number" id="axisStrengthTarget" min="1" max="20" step="1" value="'+p.targetSets+'"></label>'+
    '<label>'+axisStrengthLabel('restTime')+
    '<select id="axisStrengthRestSelect">'+[0,60,90,120,180].map(v=>'<option value="'+v+'" '+(v===p.restSeconds?'selected':'')+'>'+v+' '+axisStrengthLabel('seconds')+'</option>').join('')+'</select></label></div>':'')+
   '<div class="axisStrengthMetrics"><label>'+axisStrengthLabel('actualW')+
   '<input id="axisStrengthActualWeight" type="number" inputmode="decimal" min="0" max="1000" step=".5" placeholder="kg" value="'+w+'"></label>'+
   '<label>'+axisStrengthLabel('actualR')+
   '<input id="axisStrengthActualReps" type="number" inputmode="numeric" min="1" max="500" step="1" placeholder="次" value="'+r+'"></label></div>'+
   axisStrengthButton('confirm-set',axisStrengthLabel('confirm'),'axisStrengthPrimary')+
   (n?'<div class="axisStrengthConfirmed"><div class="axisStrengthSectionTitle">'+axisStrengthLabel('saved')+'</div>'+actuals+'</div>':'')+
   axisStrengthButton('pause',axisStrengthLabel('pause'))+
   axisStrengthButton('finish',axisStrengthLabel('finish'))+
   axisStrengthButton('abandon',axisStrengthLabel('discard'),'axisStrengthQuiet');
 }
 $('#axisStrengthContent').innerHTML=markup;
 const setButton=$('#axisStrengthContent [data-strength="confirm-set"]');
 if(setButton)setButton.dataset.expectedIndex=String(n+1);
}
function axisStrengthOpen(){
 axisStrengthRender();
 if(!axisStrengthRead())return false;
 $('#axisStrengthSheet').classList.add('show');
 $('#axisStrengthSheet [data-strength="hide"]')?.focus({preventScroll:true});
 return true;
}
function axisLiveStrengthStart(id){
 if(axis832Pending||axisStrengthSaving)return false;
 axis832Pending=true;
 try{
  const old=axisStrengthRead();
  if(old){axisStrengthOpen();if(old.objectId!==id)toast(axisStrengthLabel('conflict'));return old.objectId===id}
  if(axisPreplayRead()||axis832Conflict()){toast(axisStrengthLabel('conflict'));return false}
  const eq=axis831ExactFlowEq(id);
  if(!eq||eq.type!=='strength'){toast(axis832Copy('unavailable'));return false}
  const spec=axis832Compile('object',id);
  if(!spec?.steps?.length||spec.steps[0].objectRef!==id)return false;
  const last=lastEvent(id);
  const sets=Number.isInteger(last?.sets)&&last.sets>=1&&last.sets<=20?last.sets:3;
  const p=axisStrengthCreate({attemptId:crypto.randomUUID(),objectId:id,at:Date.now(),targetSets:sets,restSeconds:90});
  if(!axisStrengthWrite(p)){toast(axisStrengthLabel('failure'));return false}
  selectEq(id,true);
  closeSheet('eqSheet');$('#quickRecordSheet')?.classList.remove('show');
  return axisStrengthOpen();
 }catch(e){console.warn('[AXIS strength start]',e);toast(axisStrengthLabel('failure'));return false}
 finally{axis832Pending=false}
}
function axisStrengthCommit(){
 if(axisStrengthSaving)return false;
 const p=axisStrengthRead();
 if(!p||p.phase!=='review'||!p.sets.length)return false;
 const eq=axis831ExactFlowEq(p.objectId);
 if(!eq||eq.type!=='strength'||axis832Conflict()){toast(axisStrengthLabel('conflict'));return false}
 const oldEvent=axisStrengthRecorded(p.attemptId);
 if(oldEvent){localStorage.removeItem(AXIS_STRENGTH_KEY);axisStrengthRender();return true}
 const before=localStorage.getItem(AXIS_STRENGTH_KEY);
 if(!before||JSON.parse(before).revision!==p.revision)return false;
 axisStrengthSaving=true;
 try{
  const now=Date.now(),outcome=axisStrengthOutcome(p,now);
  const existingActive=state.active;
  if(!state.active)state.active={id:uid('S'),start:p.startedAt,events:[]};
  const e={id:uid('E'),equipmentId:eq.id,name:eq.name,pattern:eq.pattern,kind:'strength',
   muscles:eq.muscles||[],effect:eq.effect||'',time:now,weight:outcome.summary.weight,
   reps:outcome.summary.reps,sets:outcome.summary.sets,
   frameRefs:[],photoBytes:0,videoBytes:0,fingerprints:[],ai:null,
   playThis:{schema:outcome.schema,attemptId:outcome.attemptId,actualSets:outcome.actualSets,
    elapsedMs:outcome.elapsedMs,startedAt:outcome.startedAt,finishedAt:outcome.finishedAt}};
  // Do NOT use old saveScan or introduce another Encounter writer.
  const committed=axis821CommitEncounter(e,eq);
  const persisted=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');
  const match=[...(persisted.active?.events||[]),...(persisted.sessions||[]).flatMap(s=>s.events||[])]
   .find(x=>x.playThis?.attemptId===p.attemptId&&x.id===e.id);
  if(!committed||!match){
   const pos=state.active?.events?.findIndex(x=>x.id===e.id)??-1;
   if(pos>=0)state.active.events.splice(pos,1);
   if(!existingActive&&!state.active?.events?.length)state.active=null;
   toast(axisStrengthLabel('failure'));return false;
  }
  // On reload, the persisted attempt ID is also checked before any second save.
  localStorage.removeItem(AXIS_STRENGTH_KEY);
  axisStrengthRender();render();toast(axisStrengthLabel('success'));
  return true;
 }catch(e){console.error('[AXIS strength persist]',e);toast(axisStrengthLabel('failure'));return false}
 finally{axisStrengthSaving=false}
}
function axisStrengthHandle(action,button){
 const p=axisStrengthRead();
 if(action==='hide'){$('#axisStrengthSheet')?.classList.remove('show');return}
 if(action==='open'){axisStrengthOpen();return}
 if(!p||axisStrengthSaving)return;
 if(action==='abandon'){
  if(!confirm(axisStrengthLabel('ask')))return;
  localStorage.removeItem(AXIS_STRENGTH_KEY);axisStrengthRender();return;
 }
 if(action==='save'){axisStrengthCommit();return}
 try{
  let next;
  if(action==='confirm-set'){
   const w=$('#axisStrengthActualWeight')?.value?.trim(),r=$('#axisStrengthActualReps')?.value?.trim();
   if(!w||!r){toast(axisStrengthLabel('invalid'));return}
   next=axisStrengthUpdate(p,action,Date.now(),{weight:Number(w),reps:Number(r),expectedIndex:Number(button.dataset.expectedIndex)});
  }else if(action==='edit-set'){
   const row=button.closest('[data-review-index]'),index=Number(row?.dataset.reviewIndex);
   const w=row.querySelector('[data-field="weight"]').value.trim(),r=row.querySelector('[data-field="reps"]').value.trim();
   if(!w||!r){toast(axisStrengthLabel('invalid'));return}
   next=axisStrengthUpdate(p,action,Date.now(),{index,weight:Number(w),reps:Number(r)});
  }else next=axisStrengthUpdate(p,action,Date.now());
  if(!axisStrengthWrite(next))throw Error('save draft failed');
  axisStrengthRender();
 }catch(e){console.warn('[AXIS strength action]',e);toast(axisStrengthLabel('failure'))}
}
D.addEventListener('click',function axisStrengthClicks(event){
 const b=event.target.closest?.('[data-strength]');if(!b)return;
 event.preventDefault();event.stopPropagation();
 axisStrengthHandle(b.dataset.strength,b);
},true);
D.addEventListener('change',function axisStrengthPlanChange(e){
 if(!e.target.matches('#axisStrengthTarget,#axisStrengthRestSelect'))return;
 const p=axisStrengthRead();if(!p||p.sets.length||p.phase!=='running')return;
 const targetSets=Number($('#axisStrengthTarget')?.value),restSeconds=Number($('#axisStrengthRestSelect')?.value);
 try{const next=axisStrengthUpdate(p,'plan',Date.now(),{targetSets,restSeconds});if(!axisStrengthWrite(next))throw Error('write failed');axisStrengthRender()}
 catch(err){console.warn('[AXIS strength plan]',err);toast(axisStrengthLabel('failure'))}
},true);
window.addEventListener('storage',e=>{if(e.key===AXIS_STRENGTH_KEY)axisStrengthRender()});
window.__AXIS_LIVE_STRENGTH__=Object.freeze({version:'strength-p2',read:axisStrengthRead,
 start:axisLiveStrengthStart,commit:axisStrengthCommit,canonicalWriter:'axis821CommitEncounter'});
D.addEventListener('DOMContentLoaded',axisStrengthRender,{once:true});
