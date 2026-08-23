import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9.1 detail] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

{
 const FILE='app.js';let src=read(FILE);
 const stable=`function axis89CommitDetail(txn,title,stage,urls,bind){
 if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
 requestAnimationFrame(()=>{
  if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
  const sheet=$('#detailSheet'),host=$('#detail'),wasOpen=sheet?.classList.contains('show'),old=axis89DetailUrls,oldHeight=wasOpen&&host?host.getBoundingClientRect().height:0;axis89DetailUrls=urls;
  sheet?.classList.remove('axis884Prepaint');if(wasOpen)sheet?.classList.add('axis891DetailSwap');if(oldHeight>1&&host)host.style.minHeight=Math.ceil(oldHeight)+'px';
  setText('#detailTitle',title);if(host)host.replaceChildren(...Array.from(stage.childNodes));bind?.();
  if(!wasOpen)openSheet('detailSheet');
  requestAnimationFrame(()=>{host?.style.removeProperty('min-height');sheet?.classList.remove('axis891DetailSwap');axis89Revoke(old)});
  window.__AXIS_89_DETAIL__={owner:'atomic-handoff',patch:'8.9.1',stableShell:true,mediaDecodeBlocking:false,mediaFetchBlocking:false,txn,committedAt:Date.now(),visible:true}
 })
}`;
 src=regexOnce(src,/function axis89CommitDetail\(txn,title,stage,urls,bind\)\{[\s\S]*?\n\}\nasync function openEvent/,stable+'\nasync function openEvent','stable event detail commit');
 src=once(src,"requestAnimationFrame(()=>setTimeout(()=>detailSheet?.classList.remove('axis884Prepaint'),72));",
                  "requestAnimationFrame(()=>detailSheet?.classList.remove('axis884Prepaint'));",
                  'remove delayed session reveal');
 if(!src.includes("patch:'8.9.1',stableShell:true,mediaDecodeBlocking:false,mediaFetchBlocking:false"))fail('stable non-blocking detail marker missing');
 if(src.includes("setTimeout(()=>detailSheet?.classList.remove('axis884Prepaint'),72)"))fail('72ms history reveal delay survived');
 if(src.includes('axis89Decode(')||src.includes('Promise.allSettled(decode)'))fail('media decode regained ownership of detail commit');
 if(!src.includes('async function axis89HydrateDetailMedia('))fail('media hydration helper was lost before 8.10.2 compile stage');
 const helperAt=src.indexOf('async function axis89HydrateDetailMedia('),commitAt=src.indexOf('function axis89CommitDetail('),eventAt=src.indexOf('async function openEvent(');
 if(!(helperAt>=0&&helperAt<commitAt&&commitAt<eventAt))fail('detail helper/commit/event order no longer protects legacy commit rewrite');
 const eventBody=src.match(/async function openEvent\(id\)\{[\s\S]*?\n\}/)?.[0]||'';
 if(/await\s+axis89MediaUrl\(/.test(eventBody))fail('media-store reads regained ownership of detail visibility');
 if(!eventBody.includes("axis89CommitDetail(txn,e.name,buildStage(''),[],bind)"))fail('fact-first detail commit missing');
 if(!eventBody.includes('void axis89HydrateDetailMedia('))fail('asynchronous media hydration missing');
 syntax(src,FILE);write(FILE,src);
}

{
 const FILE='v88.css';let css=read(FILE);
 if(css.includes('AXIS 8.9.1 stable detail surface'))fail('8.9.1 detail CSS duplicated');
 css+=`

/* AXIS 8.9.1 stable detail surface — content is complete before one composed reveal. */
#detailSheet{display:flex!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;background:rgba(2,3,5,.72)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transition:opacity .14s ease,visibility 0s linear .14s!important}
#detailSheet>.sheet{opacity:.995!important;transform:translate3d(0,10px,0)!important;will-change:transform,opacity!important;transition:transform .17s cubic-bezier(.22,.8,.24,1),opacity .14s ease!important}
#detailSheet.show{visibility:visible!important;opacity:1!important;pointer-events:auto!important;transition:opacity .14s ease,visibility 0s!important}
#detailSheet.show>.sheet{opacity:1!important;transform:translate3d(0,0,0)!important}
#detailSheet.axis884Prepaint{visibility:hidden!important;opacity:0!important;transition:none!important}
#detailSheet.axis891DetailSwap,#detailSheet.axis891DetailSwap>.sheet{transition:none!important}
#detailSheet.axis891DetailSwap #detail{overflow-anchor:none!important}
@media(prefers-reduced-motion:reduce){#detailSheet,#detailSheet>.sheet{transition:none!important;transform:none!important}}
`;
 write(FILE,css);
}

{
 const app=read('app.js'),css=read('v88.css');
 if(!app.includes("stableShell:true,mediaDecodeBlocking:false,mediaFetchBlocking:false"))fail('stable shell non-blocking diagnostic absent');
 if(!app.includes('async function axis89HydrateDetailMedia('))fail('stable shell lost async media hydrator');
 if(!css.includes('#detailSheet{display:flex!important;visibility:hidden!important'))fail('precomposed detail surface missing');
 if(!css.includes('backdrop-filter:none!important'))fail('detail Safari blur flash owner survived');
}
console.log('[AXIS 8.9.1 detail] PASS · stable shell · helper survives legacy commit compiler · fact-first reveal independent of media latency');
