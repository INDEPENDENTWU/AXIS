/*
 * Timed cardio uses the existing PLAY THIS sheet and exactly the original
 * Encounter writer. A prospective clock never writes a historical fact.
 */
const AXIS_TIMED_KEY='axis_play_timed_draft_v1';
let axisTimedSaving=false,axisTimedTick=null;
function axisTimedRead(){
 try{const raw=localStorage.getItem(AXIS_TIMED_KEY);
  return raw?axisTimedValidate(JSON.parse(raw)):null}
 catch(e){console.warn('[AXIS timed read]',e);return null}
}
function axisTimedWrite(p){
 try{localStorage.setItem(AXIS_TIMED_KEY,JSON.stringify(axisTimedValidate(p)));return true}
 catch(e){console.warn('[AXIS timed write]',e);return false}
}
function axisTimedRecorded(attempt){
 return allEvents().find(e=>e.playThis?.attemptId===attempt)||null;
}
function axisTimedCopy(key){
 const en=(D.documentElement.lang||'').toLowerCase().startsWith('en');
 const s={
  title:['正在練習','Practice in progress'],elapsed:['已經過','Elapsed'],
  start:['開始計時','Start timer'],pause:['暫停','Pause'],resume:['繼續','Resume'],
  finish:['結束並確認','Finish and review'],save:['確認成果並儲存','Confirm & save'],
  back:['返回練習','Back to practice'],discard:['放棄這次計時','Discard this timer'],
  ask:['放棄未保存的計時內容？已完成的歷史紀錄不會被刪除。','Discard unsaved timer? Historical records are preserved.'],
  review:['確認實際完成的時間','Review actual duration'],
  actual:['實際運動時間（分鐘）','Actual exercise minutes'],
  intensity:['感受強度（1–10）','Effort (1–10)'],pick:['選擇強度','Select effort'],
  note:['計時只是參考，只有你確認後才算實際完成。','The clock is a reference; only a reviewed result becomes history.'],
  missing:['請確認實際運動時間與強度。','Confirm actual time and effort.'],
  fail:['保存未成功，未確認的內容仍然保留。','Save failed; your unsaved result is preserved.'],
  saved:['已保存實際成果','Actual result saved'],conflict:['請先繼續原本的練習。','Continue the current practice first.'],
  resumeCard:['繼續計時練習','Resume timed practice']
 };
 return (s[key]||[key,key])[en?1:0];
}
function axisTimedFormat(ms){
 const seconds=Math.max(0,Math.floor(ms/1000));
 return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
}
function axisTimedHost(){
 axisStrengthHost();
 if(!$('#axisTimedResume')){
  const b=D.createElement('button');b.id='axisTimedResume';b.type='button';
  b.dataset.timed='open';b.className='axisStrengthResume';b.hidden=true;
  $('#axisStrengthResume')?.insertAdjacentElement('afterend',b);
 }
 if(!axisTimedTick)axisTimedTick=setInterval(()=>{
  const p=axisTimedRead(),shown=$('#axisStrengthSheet')?.classList.contains('show');
  if(p?.phase!=='running'||!shown)return;
  const counter=$('#axisStrengthClockValue');
  if(counter)counter.textContent=axisTimedFormat(axisTimedElapsed(p,Date.now()));
 },1000);
}
function axisTimedRender(){
 axisTimedHost();
 const p=axisTimedRead(),resume=$('#axisTimedResume');
 if(resume){resume.hidden=!p;if(p)resume.textContent=axisTimedCopy('resumeCard')+' · '+(axis831ExactFlowEq(p.objectId)?.name||p.objectId)}
 if(!p)return false;
 const eq=axis831ExactFlowEq(p.objectId);
 if(!eq||eq.type!=='cardio'){resume.hidden=true;return false}
 setText('#axisStrengthKicker','PLAY THIS · '+axisTimedCopy('title'));
 setText('#axisStrengthName',eq.name);
 setText('#axisStrengthPhase',p.phase==='review'?axisTimedCopy('review'):
  p.phase==='paused'?axisTimedCopy('pause'):axisTimedCopy('title'));
 setText('#axisStrengthTimeLabel',axisTimedCopy('elapsed'));
 setText('#axisStrengthClockValue',axisTimedFormat(axisTimedElapsed(p,Date.now())));
 const button=(action,label,cls='')=>'<button type="button" data-timed="'+action+'" class="'+cls+'">'+label+'</button>';
 const note='<p class="axisTimedNote">'+axisTimedCopy('note')+'</p>';
 let view='';
 if(p.phase==='review'){
  const suggested=Math.max(.1,Math.min(600,Math.round(p.elapsedMs/6000)/10));
  view='<div class="axisTimedReview">'+
   '<label>'+axisTimedCopy('actual')+'<input id="axisTimedMinutes" type="number" min=".1" max="600" step=".1" inputmode="decimal" value="'+suggested+'"></label>'+
   '<label>'+axisTimedCopy('intensity')+'<select id="axisTimedIntensity">'+
   '<option value="">'+axisTimedCopy('pick')+'</option>'+
   Array.from({length:10},(_,i)=>'<option value="'+(i+1)+'">'+(i+1)+'</option>').join('')+
   '</select></label></div>'+
   note+button('save',axisTimedCopy('save'),'axisStrengthPrimary')+
   button('back',axisTimedCopy('back'))+button('discard',axisTimedCopy('discard'),'axisStrengthQuiet');
 }else{
  view='<div class="axisTimedClock">'+
   '<span>'+axisTimedCopy('elapsed')+'</span><strong>'+axisTimedFormat(axisTimedElapsed(p,Date.now()))+'</strong></div>'+
   note+button(p.phase==='running'?'pause':'resume',axisTimedCopy(p.phase==='running'?'pause':'resume'),'axisStrengthPrimary')+
   button('finish',axisTimedCopy('finish'))+
   button('discard',axisTimedCopy('discard'),'axisStrengthQuiet');
 }
 $('#axisStrengthContent').innerHTML=view;
 if(typeof axisContinuityDecorateTimed==='function')axisContinuityDecorateTimed(p);
 return true;
}
function axisTimedOpen(){
 if(!axisTimedRead())return false;
 axisTimedRender();$('#axisStrengthSheet').classList.add('show');
 $('#axisStrengthSheet [data-strength="hide"]')?.focus({preventScroll:true});
 return true;
}
function axisTimedStart(id){
 if(axisTimedSaving)return false;
 const current=axisTimedRead();
 if(current){axisTimedOpen();if(current.objectId!==id)toast(axisTimedCopy('conflict'));return current.objectId===id}
 if(axisStrengthRead()||axisPreplayRead()||axis832Conflict()){toast(axisTimedCopy('conflict'));return false}
 const eq=axis831ExactFlowEq(id);
 if(!eq||eq.type!=='cardio')return false;
 try{
  const spec=axis832Compile('object',id);
  if(!spec?.steps?.length||spec.steps[0].objectRef!==id)return false;
  const p=axisTimedCreate({attemptId:crypto.randomUUID(),objectId:id,at:Date.now()});
  if(!axisTimedWrite(p))return false;
  closeSheet('eqSheet');$('#quickRecordSheet')?.classList.remove('show');
  return axisTimedOpen();
 }catch(e){console.warn('[AXIS timed start]',e);toast(axisTimedCopy('fail'));return false}
}
function axisTimedSave(){
 if(axisTimedSaving)return false;
 const p=axisTimedRead();
 if(!p||p.phase!=='review')return false;
 const eq=axis831ExactFlowEq(p.objectId);
 if(!eq||eq.type!=='cardio'||axis832Conflict()){toast(axisTimedCopy('conflict'));return false}
 const minutes=$('#axisTimedMinutes')?.value?.trim();
 const effort=$('#axisTimedIntensity')?.value?.trim();
 if(!minutes||!effort){toast(axisTimedCopy('missing'));return false}
 let outcome;
 try{outcome=axisTimedOutcome(p,Date.now(),{minutes:Number(minutes),intensity:Number(effort)})}
 catch(e){toast(axisTimedCopy('missing'));return false}
 if(axisTimedRecorded(p.attemptId)){
  localStorage.removeItem(AXIS_TIMED_KEY);axisStrengthRender();return true;
 }
 const raw=localStorage.getItem(AXIS_TIMED_KEY);
 if(!raw||JSON.parse(raw).revision!==p.revision)return false;
 axisTimedSaving=true;
 try{
  const now=Date.now(),prior=state.active;
  if(!state.active)state.active={id:uid('S'),start:p.startedAt,events:[]};
  const e={id:uid('E'),equipmentId:eq.id,name:eq.name,kind:'cardio',pattern:eq.pattern,
   muscles:eq.muscles||[],effect:eq.effect||'',time:now,
   duration:outcome.actualDurationMinutes,intensity:outcome.intensity,
   frameRefs:[],fingerprints:[],photoBytes:0,videoBytes:0,ai:null,
   playThis:{schema:outcome.schema,attemptId:outcome.attemptId,
    actualDurationMinutes:outcome.actualDurationMinutes,elapsedMs:outcome.elapsedMs,
    startedAt:outcome.startedAt,finishedAt:outcome.finishedAt}};
  axisContinuityTagEvent(e);
  const committed=axis821CommitEncounter(e,eq);
  const persisted=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');
  const exists=[...(persisted.active?.events||[]),...(persisted.sessions||[]).flatMap(s=>s.events||[])]
   .some(x=>x.id===e.id&&x.playThis?.attemptId===p.attemptId&&x.duration===outcome.actualDurationMinutes);
  if(!committed||!exists){
   const i=state.active?.events?.findIndex(x=>x.id===e.id)??-1;
   if(i>=0)state.active.events.splice(i,1);
   if(!prior&&!state.active?.events?.length)state.active=null;
   toast(axisTimedCopy('fail'));return false;
  }
  axisContinuityAfterSaved(e);
  localStorage.removeItem(AXIS_TIMED_KEY);
  axisStrengthRender();render();toast(axisTimedCopy('saved'));return true;
 }catch(e){console.error('[AXIS timed commit]',e);toast(axisTimedCopy('fail'));return false}
 finally{axisTimedSaving=false}
}
function axisTimedHandle(action){
 const p=axisTimedRead();
 if(action==='open'){axisTimedOpen();return}
 if(!p||axisTimedSaving)return;
 if(action==='discard'){
  if(!confirm(axisTimedCopy('ask')))return;
  localStorage.removeItem(AXIS_TIMED_KEY);axisStrengthRender();return;
 }
 if(action==='save'){axisTimedSave();return}
 try{
  const next=axisTimedUpdate(p,action,Date.now());
  if(!axisTimedWrite(next))throw Error('storage unavailable');
  axisTimedRender();
 }catch(e){console.warn('[AXIS timed action]',e);toast(axisTimedCopy('fail'))}
}
D.addEventListener('click',function axisTimedClicks(event){
 const b=event.target.closest?.('[data-timed]');if(!b)return;
 event.preventDefault();event.stopPropagation();
 axisTimedHandle(b.dataset.timed);
},true);
window.addEventListener('storage',e=>{if(e.key===AXIS_TIMED_KEY)axisStrengthRender()});
window.__AXIS_LIVE_TIMED__=Object.freeze({version:'timed-v1',read:axisTimedRead,
 start:axisTimedStart,commit:axisTimedSave,noEncounterWriter:true});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',axisTimedRender,{once:true});
else axisTimedRender();
