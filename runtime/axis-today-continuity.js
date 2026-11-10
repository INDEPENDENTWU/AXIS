/* AXIS Today → Run → Finish/Continue. 
 * Owns only a prospective sequence. All actual sets are written by the existing
 * axis821CommitEncounter. Session finish uses existing completeFinish owner. */
const AXIS_CONTINUITY_KEY='axis_continuity_run_v1';
let axisContinuityStarterExpanded=false;
const AXIS_CONTINUITY_REST_DAY='axis_continuity_rest_day_v1';
function axisContinuityDate(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function axisContinuityIsRestDay(){try{return localStorage.getItem(AXIS_CONTINUITY_REST_DAY)===axisContinuityDate()}catch{return false}}
function axisContinuityRaw(){
 try{const value=localStorage.getItem(AXIS_CONTINUITY_KEY);
  return value?axisContinuityValidate(JSON.parse(value)):null}
 catch(e){console.warn('[AXIS continuity read]',e);return null}
}
function axisContinuityWrite(value){
 try{localStorage.setItem(AXIS_CONTINUITY_KEY,JSON.stringify(axisContinuityValidate(value)));
  return true}catch(e){console.warn('[AXIS continuity write]',e);return false}
}
function axisContinuityRead(){
 let p=axisContinuityRaw();
 if(!p||p.stage!=='running')return p;
 // A tab can reload after the existing Encounter writer commits but before
 // the run-sequence acknowledgement. Reconstruct ONLY from real saved facts.
 const matching=allEvents().find(e=>e?.playThis?.continuity?.runId===p.id&&
  e.playThis.continuity.stepIndex===p.index&&e.equipmentId===p.steps[p.index]);
 if(matching){try{
  const next=axisContinuityRecorded(p,matching);
  if(axisContinuityWrite(next))p=next;
 }catch(e){console.warn('[AXIS continuity recover]',e)}}
 return p;
}
function axisContinuitySource(){return axisContinuityPlan(state.sessions,id=>axis831ExactFlowEq(id))}
function axisContinuityStarterOptions(){
 const all=axis832Catalog().filter(x=>['strength','cardio'].includes(x.type)&&
  axis831ExactFlowEq(x.id)?.type===x.type);
 const rank=['row','chest-row','lat','treadmill','bike'];
 return all.sort((a,b)=>{
  const x=rank.indexOf(a.id),y=rank.indexOf(b.id);
  return (x<0?999:x)-(y<0?999:y)
 });
}
function axisContinuityStarterDraw(query=''){
 const out=$('#axisContinuityStarterList');if(!out)return;
 const q=query.trim().toLocaleLowerCase(),all=axisContinuityStarterOptions();
 const shown=(axisContinuityStarterExpanded?all:all.slice(0,3)).filter(x=>
  !q||x.name.toLocaleLowerCase().includes(q)||(x.muscles||[]).some(v=>v.includes(q)));
 out.innerHTML=shown.map(x=>'<button type="button" class="axisContinuityStarter" data-continuity="starter" data-object-id="'+esc(x.id)+'">'+
  '<span><b>'+esc(x.name)+'</b><small>'+(x.type==='cardio'?'計時 / 有氧':'力量訓練')+'</small></span><i>開始</i></button>').join('')||
  '<p>沒有找到符合的動作，可以調整搜尋條件。</p>';
}
function axisContinuityName(id){return axis831ExactFlowEq(id)?.name||id}
function axisContinuityConfirmed(p){
 return p.facts.filter(f=>allEvents().some(e=>e.id===f.eventId&&e.equipmentId===f.objectId&&
  e.playThis?.continuity?.runId===p.id));
}
function axisContinuityText(k){
 const zh={
  now:'下一次，已準備好',title:'沿用上次完成的動作',return:'可以從較短的一次重新開始。',
  full:'再做一次',short:'今天比較忙 · 精簡版',rest:'今天休息',restHint:'休息不會形成訓練紀錄，也不需要補回錯過的安排。',
  empty:'從一次真正的練習開始',emptyHint:'選擇一個動作，完成後下次可以直接接續。',
  unrest:'重新選擇練習',stop:'結束本次練習',stopAsk:'要結束這次練習嗎？未保存的動作不會計入成果，已保存的內容會保留。',ended:'已結束，沒有訓練紀錄',
  pick:'選擇動作',continue:'繼續目前練習',next:'進入下一項',finish:'完成本次訓練',
  dismissed:'返回今天',skip:'跳過此項',abandon:'結束這套安排',abandonAsk:'結束本次安排？已保存的訓練紀錄不會刪除。',
  doing:'正在練習',between:'已保存，接下來',done:'本次完成',actual:'已確認完成',
  missed:'略過',noSave:'這次沒有已確認的訓練成果。',conflict:'請先完成目前正在進行的訓練或 Flow。',
  unavailable:'這個動作已無法使用，可以跳過或結束安排。',failed:'未能啟動練習；你的安排仍然保留。',
  useShort:'僅保留前兩個實際做過的動作；不表示與完整訓練具有相同效果。'
 };
 const en={
  now:'Your next practice is ready',title:'Repeat exercises you performed',return:'You can restart with a shorter version.',
  full:'Repeat practice',short:'Short on time · Short version',rest:'Rest today',restHint:'Rest does not create a workout or make-up debt.',
  empty:'Start with a real practice',emptyHint:'Choose an exercise. Your completed work can guide the next session.',
  unrest:'Choose practice again',stop:'End this practice',stopAsk:'End this practice? Unsaved work will not count; saved results stay intact.',ended:'Finished without a workout record',
  pick:'Choose exercise',continue:'Resume practice',next:'Next exercise',finish:'Finish this practice',
  dismissed:'Back to Today',skip:'Skip this exercise',abandon:'End this sequence',abandonAsk:'End this sequence? Saved workouts stay intact.',
  doing:'In progress',between:'Saved · Up next',done:'Practice complete',actual:'Confirmed',missed:'Skipped',
  noSave:'No workout results were confirmed.',conflict:'Finish the ongoing workout or Flow first.',
  unavailable:'This exercise is unavailable. Skip or end the sequence.',failed:'Could not start. Your sequence is retained.',
  useShort:'Only the first two performed exercises are used; this is not equivalent to a full workout.'
 };
 return (D.documentElement.lang||'').toLowerCase().startsWith('en')?(en[k]||k):(zh[k]||k);
}
function axisContinuityTodayHost(){
 let el=$('#axisContinuityToday');
 if(el)return el;
 const head=$('#todayView .pageHead');
 if(!head)return null;
 el=D.createElement('section');
 el.id='axisContinuityToday';el.className='axisContinuityToday';
 el.setAttribute('aria-label','接續練習');
 head.insertAdjacentElement('afterend',el);
 return el;
}
function axisContinuityRenderToday(){
 const host=axisContinuityTodayHost();
 if(!host)return;
 const p=axisContinuityRead();
 // Do not displace an unrelated active workout's canonical Today/Active owner.
 if(!p&&state.active){host.hidden=true;D.body.classList.remove('axisContinuityEnabled');return}
 host.hidden=false;D.body.classList.add('axisContinuityEnabled');
 const btn=(kind,title,style='')=>'<button type="button" data-continuity="'+kind+
  '" class="'+style+'">'+title+'</button>';
 const header='<div class="axisContinuityKicker">TODAY <span>·</span> PLAY THIS</div>';
 if(p){
  const count=axisContinuityConfirmed(p).length,done=count+p.skipped.length;
  const next=p.steps[p.index],running=p.stage==='running',between=p.stage==='between';
  const title=p.stage==='done'?axisContinuityText(p.sessionId?'done':'ended'):
   p.stage==='complete'?axisContinuityText('finish'):
   axisContinuityName(next);
  host.innerHTML=header+'<h2>'+esc(title)+'</h2>'+
   '<p class="axisContinuityMeta">'+axisContinuityText(p.stage==='done'?'done':p.stage==='running'?'doing':p.stage==='between'?'between':'actual')+
   ' · '+count+' / '+p.steps.length+' '+axisContinuityText('actual')+'</p>'+
   '<div class="axisContinuityProgress"><i style="width:'+(100*done/p.steps.length)+'%"></i></div>'+
   btn(p.stage==='done'?'dismiss':running?'resume':between?'next':'finish',
    p.stage==='done'?axisContinuityText('dismissed'):running?axisContinuityText('continue'):between?axisContinuityText('next'):axisContinuityText('finish'),
    'axisContinuityPrimary')+
   (running?btn('skip',axisContinuityText('skip'),'axisContinuityQuiet')+btn('stop',axisContinuityText('stop'),'axisContinuityQuiet'):'');
  return;
 }
 const source=axisContinuitySource();
 if(!source){
  host.innerHTML=header+'<h2>'+axisContinuityText('empty')+'</h2>'+
   '<p>'+axisContinuityText('emptyHint')+'</p>'+
   (axisContinuityStarterExpanded?'<input id="axisContinuitySearch" type="search" placeholder="搜尋運動或器械" aria-label="搜尋運動或器械">':'')+
   '<div id="axisContinuityStarterList" class="axisContinuityStarters"></div>'+
   btn('more',axisContinuityStarterExpanded?'收起其他動作':'檢視更多動作','axisContinuityQuiet');
  axisContinuityStarterDraw();return;
 }
 if(axisContinuityIsRestDay()){
  host.innerHTML=header+'<h2>'+axisContinuityText('rest')+'</h2>'+
   '<p>'+axisContinuityText('restHint')+'</p>'+btn('unrest',axisContinuityText('unrest'),'axisContinuityPrimary');
  return;
 }
 const age=source.sourceAt?Math.max(0,Date.now()-source.sourceAt):0;
 const returning=age>7*86400000;
 host.innerHTML=header+'<h2>'+axisContinuityText('now')+'</h2>'+
  '<p>'+axisContinuityText(returning?'return':'title')+'</p>'+
  '<div class="axisContinuityPlan">'+source.objectIds.map((id,i)=>
   '<div class="axisContinuityPlanRow"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+esc(axisContinuityName(id))+'</b></div>').join('')+'</div>'+
  btn('start-full',axisContinuityText('full'),'axisContinuityPrimary')+
  '<div class="axisContinuityAlternates">'+btn('start-short',axisContinuityText('short'))+
  btn('rest',axisContinuityText('rest'))+'</div>'+
  '';
}
function axisContinuityTagEvent(e){
 const p=axisContinuityRead();
 if(!p||p.stage!=='running'||p.steps[p.index]!==e.equipmentId)return;
 e.playThis.continuity={runId:p.id,stepIndex:p.index};
}
function axisContinuityAfterSaved(e){
 const p=axisContinuityRead();
 if(!p||p.stage!=='running'||e.playThis?.continuity?.runId!==p.id)return;
 // The caller already verified this exact Encounter persisted. Double check
 // independently before changing the prospective sequence.
 if(!allEvents().some(x=>x.id===e.id&&x.playThis?.continuity?.runId===p.id))return;
 try{const next=axisContinuityRecorded(p,e);
  if(axisContinuityWrite(next))axisContinuityRenderToday();
 }catch(err){console.warn('[AXIS continuity after-save]',err)}
}
function axisContinuityLaunch(){
 const p=axisContinuityRead();
 if(!p||p.stage!=='running')return false;
 const id=p.steps[p.index],eq=axis831ExactFlowEq(id);
 const strength=axisStrengthRead(),timed=axisTimedRead();
 if(strength){if(strength.objectId!==id){toast(axisContinuityText('conflict'));return false}return axisStrengthOpen()}
 if(timed){if(timed.objectId!==id){toast(axisContinuityText('conflict'));return false}return axisTimedOpen()}
 if(!eq||!['strength','cardio'].includes(eq.type)){
  toast(axisContinuityText('unavailable'));axisContinuityRenderToday();return false}
 const ok=eq.type==='cardio'?axisTimedStart(id):axisLiveStrengthStart(id);
 if(!ok){toast(axisContinuityText('failed'));axisContinuityRenderToday();return false}
 if(eq.type==='strength'&&p.mode==='short'){
  const draft=axisStrengthRead();
  if(draft&&draft.sets.length===0&&draft.targetSets>2){
   try{const shorter=axisStrengthUpdate(draft,'plan',Date.now(),
    {targetSets:2,restSeconds:draft.restSeconds});
    if(axisStrengthWrite(shorter))axisStrengthRender();
   }catch(e){console.warn('[AXIS continuity short plan]',e)}}
 }
 axisContinuityRenderToday();return true;
}
function axisContinuityBeginFresh(id){
 const eq=axis831ExactFlowEq(id);
 if(!eq||!['strength','cardio'].includes(eq.type)||!axisContinuityStarterOptions().some(x=>x.id===id)||
  axisContinuityRead()||state.active||axisStrengthRead()||axisTimedRead()||axisPreplayRead()||axis832Conflict()){
  toast(axisContinuityText('conflict'));return false}
 try{
  const p=axisContinuityCreate({id:crypto.randomUUID(),objectIds:[id],mode:'full',now:Date.now()});
  if(!axisContinuityWrite(p))return false;
  if(!axisContinuityLaunch()){
   localStorage.removeItem(AXIS_CONTINUITY_KEY);axisContinuityRenderToday();return false}
  return true;
 }catch(e){console.warn('[AXIS continuity first use]',e);return false}
}
function axisContinuityBegin(mode){
 const source=axisContinuitySource();
 if(!source||axisContinuityRead()||state.active||axisStrengthRead()||axisTimedRead()||axisPreplayRead()||
  axis832Conflict()){toast(axisContinuityText('conflict'));return false}
 try{
  const p=axisContinuityCreate({id:crypto.randomUUID(),objectIds:source.objectIds,
   sourceId:source.sourceId,mode,now:Date.now()});
  if(!axisContinuityWrite(p)){toast(axisContinuityText('failed'));return false}
  if(!axisContinuityLaunch()){localStorage.removeItem(AXIS_CONTINUITY_KEY);axisContinuityRenderToday();return false}
  return true;
 }catch(e){console.warn('[AXIS continuity start]',e);return false}
}
function axisContinuityRenderStage(){
 const p=axisContinuityRead();
 if(!p||p.stage==='running')return false;
 axisStrengthHost();
 const evidence=axisContinuityConfirmed(p),count=evidence.length,sets=evidence.reduce((n,f)=>n+f.sets,0);
 const minutes=allEvents().filter(e=>e.playThis?.continuity?.runId===p.id&&e.kind==='cardio')
  .reduce((n,e)=>n+(Number(e.duration)||0),0);
 const next=p.steps[p.index];
 setText('#axisStrengthKicker','PLAY THIS · '+Math.min(p.index+1,p.steps.length)+' / '+p.steps.length);
 setText('#axisStrengthName',p.stage==='between'?axisContinuityName(next):
  axisContinuityText('done'));
 setText('#axisStrengthPhase',p.stage==='between'?axisContinuityText('between'):
  axisContinuityText('actual')+' · '+count+' '+axisContinuityText('done'));
 setText('#axisStrengthTimeLabel',axisContinuityText('actual'));
 setText('#axisStrengthClockValue',String(sets));
 const old=$('#axisStrengthProgress');
 if(old)old.remove();
 const btn=(type,title,cls='')=>'<button type="button" data-continuity="'+type+'" class="'+cls+'">'+title+'</button>';
 let inner='<div class="axisContinuityStageFacts">'+
  '<strong>'+count+' / '+p.steps.length+'</strong><span>'+axisContinuityText('actual')+'</span>'+
  '<small>'+sets+' 組'+(minutes?' · '+Math.round(minutes*10)/10+' 分鐘':'')+' · '+p.skipped.length+' '+axisContinuityText('missed')+'</small></div>';
 if(p.stage==='between')inner+=
  '<p class="axisContinuityTransition">'+axisContinuityText('between')+'</p>'+
  btn('next',axisContinuityText('next'),'axisStrengthPrimary')+
  btn('stop',axisContinuityText('stop'),'axisStrengthQuiet');
 else if(p.stage==='complete')inner+=
  (count===0?'<p>'+axisContinuityText('noSave')+'</p>':'')+
  btn('finish',axisContinuityText('finish'),'axisStrengthPrimary');
 else inner+=btn('dismiss',axisContinuityText('dismissed'),'axisStrengthPrimary');
 $('#axisStrengthContent').innerHTML=inner;
 $('#axisStrengthSheet').classList.add('show');
 axisContinuityRenderToday();
 return true;
}
function axisContinuityDecorateStrength(p){
 const run=axisContinuityRead();
 if(!run||run.stage!=='running'||run.steps[run.index]!==p.objectId)return;
 setText('#axisStrengthKicker','PLAY THIS · '+(run.index+1)+' / '+run.steps.length);
}
function axisContinuityDecorateTimed(p){
 const run=axisContinuityRead();
 if(run?.stage==='running'&&run.steps[run.index]===p.objectId)
  setText('#axisStrengthKicker','PLAY THIS · '+(run.index+1)+' / '+run.steps.length);
}
function axisContinuityOfferStop(draft){
 const p=axisContinuityRead();
 if(p?.stage!=='running'||p.steps[p.index]!==draft?.objectId)return;
 const body=$('#axisStrengthContent');
 if(body&&!body.querySelector('[data-continuity="stop"]'))
  body.insertAdjacentHTML('beforeend','<button type="button" data-continuity="stop" class="axisStrengthQuiet">'+axisContinuityText('stop')+'</button>');
}
function axisContinuityStop(){
 const p=axisContinuityRead();
 if(!p||!['running','between'].includes(p.stage))return false;
 const pending=axisStrengthRead()||axisTimedRead();
 if(pending&&pending.objectId!==p.steps[p.index]){
  toast(axisContinuityText('conflict'));return false}
 if(!confirm(axisContinuityText('stopAsk')))return false;
 // Only the matching unsaved draft may be retired. Never alter Encounter media.
 if(pending){
  if(axisStrengthRead())localStorage.removeItem(AXIS_STRENGTH_KEY);
  if(axisTimedRead())localStorage.removeItem(AXIS_TIMED_KEY);
 }
 let next=p;
 try{
  while(next.stage!=='complete'){
   if(next.stage==='between')next=axisContinuityNext(next);
   else if(next.stage==='running')next=axisContinuitySkip(next);
  }
  if(!axisContinuityWrite(next))throw Error('cannot persist early finish');
  axisContinuityFinish();return true;
 }catch(e){console.warn('[AXIS continuity early stop]',e);toast(axisContinuityText('failed'));return false}
}
function axisContinuityFinish(){
 const p=axisContinuityRead();
 if(!p||p.stage!=='complete')return false;
 const facts=axisContinuityConfirmed(p);
 if(facts.length!==p.facts.length){toast(axisContinuityText('failed'));return false}
 let sessionId=null;
 if(facts.length){
  const active=state.active;
  const own=active&&facts.every(x=>active.events?.some(e=>e.id===x.eventId));
  if(own){
   const id=active.id;
   completeFinish();closeSheet('finishSheet');
   if(!state.sessions.some(s=>s.id===id&&facts.every(x=>s.events?.some(e=>e.id===x.eventId)))){
    toast(axisContinuityText('failed'));return false}
   sessionId=id;
  }else{
   const existing=state.sessions.find(s=>facts.every(x=>s.events?.some(e=>e.id===x.eventId)));
   if(!existing){toast(axisContinuityText('failed'));return false}
   sessionId=existing.id;
  }
 }
 const next=axisContinuityDone(p,sessionId);
 if(!axisContinuityWrite(next))return false;
 axisContinuityRenderStage();render();return true;
}
function axisContinuityAction(action,button){
 const p=axisContinuityRead();
 if(action==='starter'){axisContinuityBeginFresh(button?.dataset.objectId);return}
 if(action==='more'){axisContinuityStarterExpanded=!axisContinuityStarterExpanded;axisContinuityRenderToday();return}
 if(action==='start-full'||action==='start-short'){axisContinuityBegin(action==='start-short'?'short':'full');return}
 if(action==='rest'){try{localStorage.setItem(AXIS_CONTINUITY_REST_DAY,axisContinuityDate())}catch{}axisContinuityRenderToday();return}
 if(action==='unrest'){try{localStorage.removeItem(AXIS_CONTINUITY_REST_DAY)}catch{}axisContinuityRenderToday();return}
 if(!p)return;
 if(action==='resume'){
  if(p.stage==='running')axisContinuityLaunch();
  else axisContinuityRenderStage();
  return;
 }
 if(action==='skip'){
  if(p.stage!=='running'||axisStrengthRead()||axisTimedRead())return;
  try{if(axisContinuityWrite(axisContinuitySkip(p)))axisContinuityRenderStage()}
  catch(e){console.warn('[AXIS continuity skip]',e)}return;
 }
 if(action==='next'){
  if(p.stage!=='between')return;
  try{if(axisContinuityWrite(axisContinuityNext(p)))axisContinuityLaunch()}
  catch(e){console.warn('[AXIS continuity next]',e)}return;
 }
 if(action==='finish'){axisContinuityFinish();return}
 if(action==='stop'){axisContinuityStop();return}
 if(action==='dismiss'&&p.stage==='done'){
  localStorage.removeItem(AXIS_CONTINUITY_KEY);
  $('#axisStrengthSheet')?.classList.remove('show');
  axisContinuityRenderToday();render();return;
 }
 if(action==='abandon'&&p.stage==='between'){
  if(!confirm(axisContinuityText('abandonAsk')))return;
  localStorage.removeItem(AXIS_CONTINUITY_KEY);
  $('#axisStrengthSheet')?.classList.remove('show');
  axisContinuityRenderToday();render();
 }
}
D.addEventListener('click',function axisContinuityClicks(event){
 const button=event.target.closest?.('[data-continuity]');
 if(!button)return;
 event.preventDefault();event.stopPropagation();
 axisContinuityAction(button.dataset.continuity,button);
},true);
D.addEventListener('input',e=>{
 if(e.target?.id==='axisContinuitySearch')axisContinuityStarterDraw(e.target.value);
},true);
window.addEventListener('storage',e=>{
 if(e.key===AXIS_CONTINUITY_KEY)axisContinuityRenderToday();
});
window.__AXIS_CONTINUITY__=Object.freeze({
 version:'today-run-v1',read:axisContinuityRead,plan:axisContinuitySource,
 begin:axisContinuityBegin,finish:axisContinuityFinish,
 noEncounterWriter:true,noSessionWriter:true
});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',axisContinuityRenderToday,{once:true});
else axisContinuityRenderToday();
