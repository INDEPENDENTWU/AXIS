import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9 detail] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

{
 const FILE='app.js';let src=read(FILE);
 const replacement=`let axis89DetailTxn=0,axis89DetailUrls=[];
function axis89Revoke(urls){for(const u of urls||[])try{URL.revokeObjectURL(u)}catch{}}
async function axis89MediaUrl(k,urls){try{const b=await getMedia(k);if(!b)return null;const u=URL.createObjectURL(b);urls.push(u);return u}catch{return null}}
async function axis89HydrateDetailMedia(txn,e,buildStage,bind){
 const urls=[];let media='';
 if(e.clipRef){const v=await axis89MediaUrl(e.clipRef,urls);if(txn!==axis89DetailTxn){axis89Revoke(urls);return}const poster=e.frameRefs?.[0]?await axis89MediaUrl(e.frameRefs[0],urls):'';if(txn!==axis89DetailTxn){axis89Revoke(urls);return}if(v)media+=\`<div class="videoCard"><div class="mediaTop"><b>现场片段</b><span>\${e.videoWatermarked?'带水印':'原片'}</span></div><video class="detailVideo" src="\${v}" \${poster?\`poster="\${poster}"\`:''} controls playsinline muted></video><button class="mediaSave" id="saveDetailVideo">保存视频</button></div>\`}
 if(e.frameRefs?.length){const imgs=[];for(const r of e.frameRefs){const u=await axis89MediaUrl(r,urls);if(txn!==axis89DetailTxn){axis89Revoke(urls);return}if(u)imgs.push(\`<img src="\${u}" alt="现场照片">\`)}if(imgs.length)media+=\`<div class="mediaTop photoTop"><b>现场照片</b><span>\${imgs.length}张 · \${state.prefs.watermark.photoMode==='raw'?'原片':'带水印'}</span></div><div class="detailFilm">\${imgs.join('')}</div>\`}
 if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
 if(media)axis89CommitDetail(txn,e.name,buildStage(media),urls,bind);else axis89Revoke(urls)
}
function axis89CommitDetail(txn,title,stage,urls,bind){
 if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
 requestAnimationFrame(()=>{
  if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
  const sheet=$('#detailSheet'),wasOpen=sheet?.classList.contains('show'),old=axis89DetailUrls;axis89DetailUrls=urls;
  setText('#detailTitle',title);const host=$('#detail');if(host)host.replaceChildren(...Array.from(stage.childNodes));
  bind?.();if(!wasOpen)openSheet('detailSheet');requestAnimationFrame(()=>axis89Revoke(old));
  window.__AXIS_89_DETAIL__={owner:'atomic-handoff',txn,committedAt:Date.now(),visible:true,mediaDecodeBlocking:false,mediaFetchBlocking:false}
 })
}
async function openEvent(id){
 const e=allEvents().find(x=>x.id===id);if(!e)return;const txn=++axis89DetailTxn,eq=eventEq(e);
 const rows=e.kind==='strength'?[['重量',numFmt(e.weight)+' kg'],['次数',e.reps+' 次'],['组数',e.sets+' 组']]:[['时间',e.duration+' 分钟'],['强度',e.intensity+' / 10']];
 rows.unshift(['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—']);rows.push(['记录时间',dlabel(e.time)+' '+tlabel(e.time)]);
 const buildStage=media=>{const stage=D.createElement('div');stage.innerHTML=(media||'')+\`<div class="detailList">\${rows.map(r=>\`<div class="detailRow"><span>\${r[0]}</span><span>\${esc(r[1])}</span></div>\`).join('')}</div>\${e.frameRefs?.[0]?'<div class="detailActions"><button id="saveDetailPhoto">保存图片</button><button id="makeSessionReport">训练报告</button></div>':''}\`;return stage};
 const bind=()=>{if($('#saveDetailPhoto'))$('#saveDetailPhoto').onclick=async()=>{const b=await getMedia(e.frameRefs[0]);if(b)shareBlob(b,\`AXIS-\${e.name}-\${dlabel(e.time)}.jpg\`,'image/jpeg')};if($('#saveDetailVideo'))$('#saveDetailVideo').onclick=async()=>{const b=await getMedia(e.clipRef);if(b)shareBlob(b,\`AXIS-\${e.name}-\${dlabel(e.time)}.\${(b.type||'video/mp4').includes('webm')?'webm':'mp4'}\`,b.type||'video/mp4')};if($('#makeSessionReport'))$('#makeSessionReport').onclick=()=>{const s=(state.active?[state.active]:[]).concat(state.sessions).find(s=>ev(s).some(x=>x.id===e.id));if(s){reportRange='session:'+s.id;renderReport();openSheet('reportSheet')}}};
 axis89CommitDetail(txn,e.name,buildStage(''),[],bind);
 void axis89HydrateDetailMedia(txn,e,buildStage,bind)
}
function openSession`;
 src=regexOnce(src,/async function openEvent\(id\)\{[\s\S]*?\nfunction openSession/,replacement,'atomic event detail');
 src=once(src,"function openSession(id){const s=state.sessions.find(x=>x.id===id);if(!s)return;const detailSheet=$('#detailSheet');detailSheet?.classList.add('axis884Prepaint');","function openSession(id){axis89DetailTxn++;const s=state.sessions.find(x=>x.id===id);if(!s)return;const detailSheet=$('#detailSheet');detailSheet?.classList.add('axis884Prepaint');",'session cancels stale event transaction');
 src=once(src,"function eqById(id){return eqAll().find(e=>e.id===id)}",`function eqById(id){const own=eqAll().find(e=>e.id===id);if(own)return own;const x=(window.__AXIS_873_LIBRARY__||[]).find(e=>e.id===id);return x?{id:x.id,name:x.name,type:x.type||'strength',pattern:x.type==='cardio'?'cardio':'strength',muscles:x.muscles||[],effect:'',aliases:x.aliases||[]}:undefined}`,'expanded catalog resolver');
 const eventBody=src.match(/async function openEvent\(id\)\{[\s\S]*?\n\}/)?.[0]||'';
 if(!eventBody.includes("axis89CommitDetail(txn,e.name,buildStage(''),[],bind)"))fail('event facts are not committed before media hydration');
 if(/await\s+axis89MediaUrl\(/.test(eventBody))fail('event visibility still waits on media-store reads');
 if(!eventBody.includes('void axis89HydrateDetailMedia('))fail('non-blocking media hydration handoff missing');
 if(!src.includes('async function axis89HydrateDetailMedia('))fail('media hydration helper missing');
 if(src.includes('axis89Decode(')||src.includes('Promise.allSettled(decode)'))fail('media decode still blocks event detail commit');
 if(!src.includes('mediaDecodeBlocking:false,mediaFetchBlocking:false'))fail('non-blocking detail diagnostic missing');
 syntax(src,FILE);write(FILE,src);
}
console.log('[AXIS 8.9 detail] PASS · fact-first detail survives legacy commit rewrites · media hydrates asynchronously');
