/* AXIS 8.29 — Recording Friction Collapse.
 * Derived suggestions and in-sheet draft continuity only. app.js remains the
 * sole Encounter writer, recorder and owner of the save transaction.
 */
let axis829SaveInFlight=false,axis829CurrentRecall=null;

function axis829PreviousFor(eq){
  return allEvents().filter(e=>e.equipmentId===eq.id)
    .sort((a,b)=>(Number(b.time)||0)-(Number(a.time)||0))[0]||null;
}
function axis829RecallFor(eq,schema,previous){
  const event=previous||axis829PreviousFor(eq);
  return axis829Core.projectRecordingRecall({
    schema,previous:event,metrics:event?axis818EventMetrics(event):null
  });
}
function axis829PreviousValue(m,previous){
  const eq=eqById(state.selectedEq);
  if(!eq||!previous)return '';
  const recall=axis829RecallFor(eq,[m],previous);
  return recall.values[String(m?.key||m?.id||'')]??'';
}
function axis829RecorderIdentity(eq,schema){
  return JSON.stringify([
    String(eq?.id||''),
    axis821RecordingExecutionMode(eq),
    (Array.isArray(schema)?schema:[]).map(m=>[
      String(m?.key??m?.id??''),String(m?.type||''),String(m?.unit||''),
      m?.min??null,m?.max??null
    ])
  ]);
}
function axis829CaptureDraft(){
  const host=$('#axis818MetricRecorder');
  // The canonical Quick Recorder intentionally clears axis818RenderKey before
  // requesting a new DOM render. Keep our independent, schema-bound identity.
  if(!host?.classList.contains('show')||!host.dataset.axis829DraftIdentity)return null;
  const values={};
  for(const input of host.querySelectorAll('[data-axis818-metric]')){
    const k=String(input.dataset.axis818Metric||'');
    if(k)values[k]=input.value;
  }
  return {identity:host.dataset.axis829DraftIdentity,values};
}
function axis829WriteValues(host,values){
  if(!host||!values)return 0;
  let updated=0;
  for(const input of host.querySelectorAll('[data-axis818-metric]')){
    const key=String(input.dataset.axis818Metric||'');
    if(!Object.prototype.hasOwnProperty.call(values,key))continue;
    input.value=String(values[key]);updated++;
    const section=input.closest('[data-axis821-key]');
    if(!section)continue;
    for(const button of section.querySelectorAll('[data-axis821-rate],[data-axis821-bool],[data-axis821-choice]')){
      if(button.dataset.value!=null)button.classList.toggle('active',String(button.dataset.value)===input.value);
    }
  }
  return updated;
}
function axis829DecorateRecorder(eq,schema,previous,draft){
  const host=$('#axis818MetricRecorder');
  if(!host?.classList.contains('show'))return;
  const recall=axis829RecallFor(eq,schema,previous);
  const identity=axis829RecorderIdentity(eq,schema);
  host.dataset.axis829DraftIdentity=identity;
  axis829CurrentRecall={equipmentId:eq.id,renderKey:host.dataset.axis818RenderKey,recall};
  if(draft?.identity===identity){
    axis829WriteValues(host,draft.values);
  }
  if(!recall.count)return;
  const head=host.querySelector('.axis818MetricHead');
  if(!head)return;
  let bar=host.querySelector('[data-axis829-context]');
  if(!bar){
    bar=D.createElement('div');
    bar.className='axis829RecordContext';
    bar.setAttribute('data-axis829-context','');
    head.insertAdjacentElement('afterend',bar);
  }
  bar.innerHTML='<span>已參考上次確認的記錄 · 本次仍需親自確認</span>'+
    '<button type="button" data-axis829-reuse aria-label="重新帶入上次已確認的數值">沿用上次</button>';
}
D.addEventListener('click',e=>{
  const action=e.target.closest?.('[data-axis829-reuse]');
  if(!action)return;
  const host=action.closest?.('#axis818MetricRecorder'),source=axis829CurrentRecall;
  if(!host||!source||source.equipmentId!==state.selectedEq||source.renderKey!==host.dataset.axis818RenderKey)return;
  e.preventDefault();
  const n=axis829WriteValues(host,source.recall.values);
  if(n)action.textContent='已帶入 · 可調整';
},true);

window.__AXIS_829_RECORDING__={
  version:'8.29',schema:'axis.recording-continuity.v1',
  reuseRequiresExplicitSave:true,source:'confirmed Encounter snapshot',
  previousIsOnlySuggestion:true,
  render:()=>axis818RenderRecorder(),
  saving:()=>axis829SaveInFlight,
  noNewStorage:true,noEncounterWriter:true,noActiveWriter:true,
  noSessionWriter:true,noFlowMutation:true,noNetwork:true,noAi:true
};
