import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

function functionRange(src,signature){
 const start=src.indexOf(signature);if(start<0)fail(`${signature} missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${signature} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${signature} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${signature} closing brace missing`);return{start,end}
}

/* bindDynamic has exactly two canonical DOM0 binding responsibilities: event detail
   and session detail. Historical contract strings elsewhere are irrelevant. Once
   detail facts are synchronous/fact-first, a visible sheet must not re-enter the
   prepaint-hidden state during an item-to-item swap; atomic commit owns that swap. */
const eventPlainDouble="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const eventPlainSingle="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const eventGuardDouble="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const eventGuardSingle="$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const sessionDouble="$$('[data-session]').forEach(b=>b.onclick=()=>openSession(b.dataset.session))";
const sessionSingle="$('[data-session]').forEach(b=>b.onclick=()=>openSession(b.dataset.session))";
const canonical=[
 `function bindDynamic(){${eventPlainDouble}${sessionDouble}}`,
 `function bindDynamic(){${eventPlainSingle}${sessionDouble}}`,
 `function bindDynamic(){${eventGuardDouble}${sessionDouble}}`,
 `function bindDynamic(){${eventGuardSingle}${sessionDouble}}`,
 `function bindDynamic(){${eventPlainDouble}${sessionSingle}}`,
 `function bindDynamic(){${eventPlainSingle}${sessionSingle}}`,
 `function bindDynamic(){${eventGuardDouble}${sessionSingle}}`,
 `function bindDynamic(){${eventGuardSingle}${sessionSingle}}`
];
const target=`function bindDynamic(){${eventPlainDouble}${sessionDouble}}`;
const bindRange=functionRange(s,'function bindDynamic()');
const bind=s.slice(bindRange.start,bindRange.end),shape=canonical.indexOf(bind);
if(shape<0)fail(`unexpected bindDynamic compiler shape: ${bind.replace(/\s+/g,' ')}`);
s=s.slice(0,bindRange.start)+target+s.slice(bindRange.end);

/* 8.18 Foundation is the final feature owner of event detail because it adds Object
   Truth rows plus export/delete actions. Harden THAT final owner rather than relying
   on pre-8.18 openEvent implementations. Facts and actions commit immediately; local
   media is an additive asynchronous hydration under the same transaction owner. */
if(!s.includes('function axis818EventRows('))fail('Object Truth event rows missing');
if(!s.includes('function axis818ShareFiles(')||!s.includes('function axis818Files(')||!s.includes('async function axis818DeleteEvent('))fail('8.18 detail action owners missing');
if(!s.includes('let axis89DetailTxn=')||!s.includes('function axis89CommitDetail(')||!s.includes('async function axis89MediaUrl('))fail('atomic detail transaction/media helpers missing');
if(s.includes('function axis818DetailStage(')||s.includes('async function axis818HydrateEventMedia('))fail('8.18 final detail seal duplicated');
const originalRange=functionRange(s,'async function openEvent(id)');
const original=s.slice(originalRange.start,originalRange.end);
if(!original.includes('axis818EventRows(e)'))fail('expected 8.18 Object Truth openEvent owner not active');
if(!/await\s+mediaUrl\s*\(/.test(original))fail('expected blocking 8.18 media read shape not found');

const replacement=`function axis818DetailStage(e,eq,media=''){
 const rows=[['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—'],...axis818EventRows(e),['记录时间',dlabel(e.time)+' '+tlabel(e.time)]],buttons=[];
 if(e.frameRefs?.length)buttons.push('<button id="axis818SavePhotos">保存照片</button>');
 if(e.clipRef)buttons.push('<button id="axis818SaveVideo">保存视频</button>');
 if(e.frameRefs?.length&&e.clipRef)buttons.push('<button id="axis818SaveAll">保存全部</button>');
 buttons.push('<button class="axis818DeleteEvent" id="axis818DeleteEvent">删除记录</button>');
 const stage=D.createElement('div');stage.innerHTML=(media||'')+'<div class="detailList">'+rows.map(r=>'<div class="detailRow"><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>').join('')+'</div><div class="detailActions axis818DetailActions">'+buttons.join('')+'<button id="makeSessionReport">训练报告</button></div>';return stage
}
function axis818BindDetailActions(e){
 const share=async kind=>{try{await axis818ShareFiles(await axis818Files(e,kind,false))}catch(x){if(x?.name!=='AbortError'){console.warn(x);toast('保存失败')}}};
 if($('#axis818SavePhotos'))$('#axis818SavePhotos').onclick=()=>share('photo');
 if($('#axis818SaveVideo'))$('#axis818SaveVideo').onclick=()=>share('video');
 if($('#axis818SaveAll'))$('#axis818SaveAll').onclick=()=>share('all');
 if($('#axis818DeleteEvent'))$('#axis818DeleteEvent').onclick=()=>axis818DeleteEvent(e.id);
 if($('#makeSessionReport'))$('#makeSessionReport').onclick=()=>{const ss=(state.active?[state.active]:[]).concat(state.sessions).find(x=>ev(x).some(y=>y.id===e.id));if(ss){reportRange='session:'+ss.id;renderReport();openSheet('reportSheet')}}
}
async function axis818HydrateEventMedia(txn,e,eq){
 const urls=[];let media='';
 if(e.clipRef){const v=await axis89MediaUrl(e.clipRef,urls);if(txn!==axis89DetailTxn){axis89Revoke(urls);return}const poster=e.frameRefs?.[0]?await axis89MediaUrl(e.frameRefs[0],urls):'';if(txn!==axis89DetailTxn){axis89Revoke(urls);return}if(v)media+='<div class="videoCard"><div class="mediaTop"><b>现场视频</b><span>'+(e.videoWatermarked?'带水印':'原片')+'</span></div><video class="detailVideo" src="'+v+'" '+(poster?'poster="'+poster+'"':'')+' controls playsinline muted></video></div>'}
 if(e.frameRefs?.length){const imgs=[];for(const r of e.frameRefs){const u=await axis89MediaUrl(r,urls);if(txn!==axis89DetailTxn){axis89Revoke(urls);return}if(u)imgs.push('<img src="'+u+'" alt="现场照片">')}if(imgs.length)media+='<div class="mediaTop photoTop"><b>现场照片</b><span>'+imgs.length+'张</span></div><div class="detailFilm">'+imgs.join('')+'</div>'}
 if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
 if(media)axis89CommitDetail(txn,e.name,axis818DetailStage(e,eq,media),urls,()=>axis818BindDetailActions(e));else axis89Revoke(urls)
}
async function openEvent(id){
 const e=allEvents().find(x=>x.id===id);if(!e)return;const txn=++axis89DetailTxn,eq=eventEq(e);
 axis89CommitDetail(txn,e.name,axis818DetailStage(e,eq,''),[],()=>axis818BindDetailActions(e));
 void axis818HydrateEventMedia(txn,e,eq)
}`;
s=s.slice(0,originalRange.start)+replacement+s.slice(originalRange.end);

const finalRange=functionRange(s,'async function openEvent(id)'),eventBody=s.slice(finalRange.start,finalRange.end);
const factRe=/axis89CommitDetail\s*\(\s*txn\s*,\s*e\.name\s*,\s*axis818DetailStage\s*\(\s*e\s*,\s*eq\s*,\s*(['"])\1\s*\)\s*,\s*\[\s*\]\s*,/g;
const hydrateRe=/axis818HydrateEventMedia\s*\(\s*txn\s*,\s*e\s*,\s*eq\s*\)/g;
const facts=[...eventBody.matchAll(factRe)],hydrates=[...eventBody.matchAll(hydrateRe)];
if(facts.length!==1||hydrates.length!==1)fail(`final fact/hydrate cardinality invalid · facts ${facts.length} · hydrate ${hydrates.length}`);
const factAt=facts[0].index??-1,hydrateAt=hydrates[0].index??-1;
if(factAt<0||hydrateAt<0||factAt>hydrateAt)fail('8.18 event detail does not commit facts before media hydration');
if(/\bawait\b/.test(eventBody.slice(0,factAt)))fail('8.18 openEvent awaits before factual commit');
if(/await\s+(?:mediaUrl|axis89MediaUrl)\s*\(/.test(eventBody))fail('8.18 openEvent still owns blocking media reads');
const hydrateRange=functionRange(s,'async function axis818HydrateEventMedia('),hydrateBody=s.slice(hydrateRange.start,hydrateRange.end);
if(!hydrateBody.includes('axis89MediaUrl(')||!hydrateBody.includes('txn!==axis89DetailTxn')||!hydrateBody.includes('axis89Revoke(urls)'))fail('async media hydration lost transaction/url safety');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release session prepaint guard');

const sealed=functionRange(s,'function bindDynamic()');
const sealedBody=s.slice(sealed.start,sealed.end);
if(sealedBody!==target)fail('deterministic bindDynamic seal did not hold');
if(sealedBody.includes('axis884Prepaint'))fail('visible event swap can still re-enter prepaint');
const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
if(s.includes('__AXIS_818_DETAIL_ATOMIC__'))fail('detail atomic diagnostic duplicated');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'stable-atomic-swap',commitOwner:'atomic-handoff',objectTruth:true,exportDelete:true,factsFirst:true,visibleReprepaint:false,mediaHydration:'async',mediaFetchBlocking:false,collectionHelper:'$$'}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · final Object Truth detail is fact-first · visible item swaps never re-prepaint · export/delete preserved · async media hydration transaction-safe · collection-safe bindings · input-shape ${shape}`);
