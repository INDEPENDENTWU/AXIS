import fs from 'node:fs';

const FROM='8.25.1',VERSION='8.26';
const fail=m=>{throw new Error(`[AXIS 8.26 Active Continuity] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function functionRange(src,signature,label){const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;for(let i=brace;i<src.length;i++){const ch=src[i],next=src[i+1]||'';if(line){if(ch==='\n')line=false;continue}if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}if(ch==='/'&&next==='/'){line=true;i++;continue}if(ch==='/'&&next==='*'){block=true;i++;continue}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}}if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)}}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}
function mutateFunction(src,signature,mutate,label){const r=functionRange(src,signature,label),next=mutate(r.text);if(!next||next===r.text)fail(`${label} mutation did not change source`);return src.slice(0,r.start)+next+src.slice(r.end)}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};
const css=read('styles/axis-826-active-continuity.css').trim();
for(const token of ['axis826SetCue','pointer-events:none!important','#v8Pulse{display:none!important}','#activeHome>.liveHead','prefers-reduced-motion:reduce'])if(!css.includes(token))fail(`CSS contract drift ${token}`);

/* Save becomes one visual transaction. The app no longer paints the short-lived
   committed-but-not-yet-Active state; v82 settles the transaction after it has
   either created canonical Active truth or determined that the Encounter is a
   one-shot/record-only item. */
{
 const f='app.js';let s=read(f);
 const marker='async function saveScan()';
 const helper=`let axis826SaveVisualPending=null,axis826SaveVisualTimer=0;\nfunction axis826SaveVisualSettle(id){if(!id||axis826SaveVisualPending!==id)return false;axis826SaveVisualPending=null;clearTimeout(axis826SaveVisualTimer);axis826SaveVisualTimer=0;try{render()}catch{};toast('已记下');return true}\nfunction axis826SaveVisualAwait(id){axis826SaveVisualPending=id;clearTimeout(axis826SaveVisualTimer);axis826SaveVisualTimer=setTimeout(()=>axis826SaveVisualSettle(id),420);return true}\nwindow.addEventListener('axis:record-save-settled',e=>axis826SaveVisualSettle(e?.detail?.id));\n`;
 if(s.includes('function axis826SaveVisualAwait('))fail('save transaction helper duplicated');
 s=s.replace(marker,helper+marker);
 s=mutateFunction(s,marker,fn=>{
   const combined="finally{try{resetScan()}finally{render()}}toast('已记下')";
   if(fn.includes(combined))return fn.replace(combined,"finally{try{resetScan()}finally{axis826SaveVisualAwait(e.id)}}");
   const simple="resetScan();render();toast('已记下')";
   if(fn.includes(simple))return fn.replace(simple,"resetScan();axis826SaveVisualAwait(e.id)");
   fail('saveScan post-commit render boundary drift');
 },'atomic save visual settlement');

 /* Flow ongoing steps always enter the canonical Active owner immediately. A
    one-shot step still uses the canonical recorder because its record itself is
    the completion fact. Existing foreign Active work is switched through the
    established pause/preserve confirmation. */
 s=replaceFunction(s,'function axis821BeginCurrentItem()',`function axis821BeginCurrentItem(){axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw(),ctx=axis821ResolvedCurrent();if(!r||r.status!=='active'||!step||!ctx||ctx.missingObject)return false;if(r.currentEncounterId){const own=axis821FlowActiveApi()?.get?.(r.currentEncounterId);if(own?.status==='paused'){const foreign=axis821FlowActiveApi()?.current?.();if(foreign&&foreign.id!==own.id)return axis821FlowShowSwitch('resume',foreign,{id:own.id,name:own.name});return axis821FlowActiveApi()?.resume?.(own.id)===true}toast?.('当前项目已经在进行中');return false}const eq=axis821FlowObject(step.objectRef);if(!eq)return false;const mode=String(axis821ExecutionForRecording(eq)||'complete');if(!axis821FlowOngoingMode(mode))return axis821FlowOpenRecorder('current',eq);const foreign=axis821FlowActiveApi()?.current?.();if(foreign)return axis821FlowShowSwitch('start',foreign,{id:eq.id,name:eq.name});return axis821FlowStartWholeItem(eq)}`,'Flow current ongoing direct-start');
 syntax(s,f);write(f,s);
}
{
 const f='v82-runtime.js';let s=read(f);
 s=replaceFunction(s,'function watchSavedEvent(attempt=0)',`function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1),recordOnly=axis821SaveRecordOnly||e?.flowDetour?.recordOnly===true,ongoing=!recordOnly&&axis8201Ongoing(e);if(ongoing)startActivity(e,axis8201EstimateForEvent(e,estimateMs));saveArmed=false;axis821SaveRecordOnly=false;estimateAuto=true;estimateMs=null;try{window.dispatchEvent(new CustomEvent('axis:record-save-settled',{detail:{id:e.id,activeStarted:ongoing,recordOnly}}))}catch{};return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else{saveArmed=false;axis821SaveRecordOnly=false}}`,'v82 save visual settlement signal');
 syntax(s,f);write(f,s);
}
{
 const f='v61.js';let s=read(f);
 s=replaceFunction(s,'function pulseSaving()',`function pulseSaving(){const b=$('#saveScan');if(!b)return;if(b.dataset.axis826SaveText==null)b.dataset.axis826SaveText=b.textContent||'记下';b.textContent='正在记下…';b.classList.add('axis826SavePending');clearTimeout(b._axis826SaveTimer);b._axis826SaveTimer=setTimeout(()=>{b.classList.remove('axis826SavePending');if(b.dataset.axis826SaveText!=null){b.textContent=b.dataset.axis826SaveText;delete b.dataset.axis826SaveText}},1500)}`,'button-local save feedback');
 s=replaceFunction(s,'function showUndo(e)',`function showUndo(e){const save=$('#saveScan');if(save){save.classList.remove('axis826SavePending');clearTimeout(save._axis826SaveTimer);if(save.dataset.axis826SaveText!=null){save.textContent=save.dataset.axis826SaveText;delete save.dataset.axis826SaveText}}let bar=$('#v81Undo');if(!bar){bar=D.createElement('div');bar.id='v81Undo';bar.className='v81Undo axis826Undo';bar.innerHTML='<span>已记下</span><button>撤销</button>';D.body.appendChild(bar);bar.querySelector('button').onclick=()=>undoEvent(bar.dataset.event)}bar.classList.add('axis826Undo');bar.dataset.event=e.id;bar.classList.add('show');clearTimeout(undoTimer);undoTimer=setTimeout(()=>bar.classList.remove('show'),3600)}`,'dock-safe save undo feedback');
 syntax(s,f);write(f,s);
}

/* Keep 8.25.1 as the factual set-progress morph and add one small, non-layout,
   non-interactive kinetic numeral at the stage edge. */
{
 const f='v87-runtime.js';let s=read(f);
 s=replaceFunction(s,'function axis8251SetMorph(done,total,final,host)',`function axis8251SetMorph(done,total,final,host){axis8251InlineSetMorphStyle();const fact=host?.querySelector('.axis821StageFact');if(!fact)return;let moment=fact.querySelector('.axis8251SetMoment');if(!moment){moment=D.createElement('div');moment.className='axis8251SetMoment';moment.setAttribute('role','status');moment.setAttribute('aria-live','polite');moment.setAttribute('aria-atomic','true');moment.innerHTML='<i class="axis8251SetMomentMark" aria-hidden="true"></i><b></b><small></small>';fact.appendChild(moment)}clearTimeout(fact._axis8251Timer);const value=moment.querySelector('b'),label=moment.querySelector('small');value.textContent=String(Math.max(0,done)).padStart(2,'0')+' / '+String(Math.max(1,total)).padStart(2,'0');label.textContent=final?'本動作完成':'已完成';fact.classList.remove('axis8251-locking','axis8251-final');host.classList.remove('axis8251-inline-feedback');void fact.offsetWidth;fact.classList.add('axis8251-locking');if(final)fact.classList.add('axis8251-final');host.classList.add('axis8251-inline-feedback');let cue=host.querySelector('.axis826SetCue');if(!cue){cue=D.createElement('div');cue.className='axis826SetCue';cue.setAttribute('aria-hidden','true');cue.innerHTML='<b></b><small></small>';host.appendChild(cue)}clearTimeout(cue._axis826Timer);cue.querySelector('b').textContent=final?String(done):'+1';cue.querySelector('small').textContent=final?'組完成':'組';cue.classList.remove('show','final');void cue.offsetWidth;if(final)cue.classList.add('final');cue.classList.add('show');cue._axis826Timer=setTimeout(()=>cue.classList.remove('show','final'),720);fact._axis8251Timer=setTimeout(()=>{fact.classList.remove('axis8251-locking','axis8251-final');host?.classList.remove('axis8251-inline-feedback')},final?820:660)}`,'kinetic set numeral');
 syntax(s,f);write(f,s);
}
{
 const f='styles.css';let s=read(f);if(s.includes('AXIS 8.26 — Active Continuity'))fail('8.26 styles duplicated');s+='\n'+css+'\n';write(f,s);
}

/* Current identity only. Historical capability markers remain historical. */
{
 const f='release-contract.json',x=JSON.parse(read(f));if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
for(const [f,a,b,label] of [
 ['build-hardened.mjs',`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version'],
 ['postbuild-features-hardened.mjs',`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical version');s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset');s=once(s,`data-axis-runtime=\"canonical-${FROM}\"`,`data-axis-runtime=\"canonical-${VERSION}\"`,'canonical HTML marker');write(f,s);
}
const inheritedCurrentIdentityFiles=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs','postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs','postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs','scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs','scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs','scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs','scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs','scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedTouches=0;for(const f of inheritedCurrentIdentityFiles){let s=read(f),n=(s.match(/'8\.25\.1'/g)||[]).length;if(!n)continue;inheritedTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}
const pairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],[`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],[`manifest.version,'${FROM}'`,`manifest.version,'${VERSION}'`],[`manifest.baseVersion,'${FROM}'`,`manifest.baseVersion,'${VERSION}'`],[`info.version!=='${FROM}'`,`info.version!=='${VERSION}'`],[`info.baseVersion!=='${FROM}'`,`info.baseVersion!=='${VERSION}'`],[`contract.publicVersion!=='${FROM}'`,`contract.publicVersion!=='${VERSION}'`],[`contract.stableBaseVersion!=='${FROM}'`,`contract.stableBaseVersion!=='${VERSION}'`],[`boot.release,'${FROM}'`,`boot.release,'${VERSION}'`],[`candidate.version,'${FROM}'`,`candidate.version,'${VERSION}'`],[`candidate.baseVersion,'${FROM}'`,`candidate.baseVersion,'${VERSION}'`]
];
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>![
 'postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs','scripts/axis-825-set-lock-smoke.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','scripts/axis-826-active-continuity-smoke.mjs'
].includes(f));
let identityTouches=0;for(const f of candidates){let s=read(f),next=s;for(const [a,b] of pairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(inheritedTouches+identityTouches<12)fail(`public identity convergence suspiciously small: ${inheritedTouches}+${identityTouches}`);
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=once(s,"'8.24','8.24.1','8.25','8.25.1'];","'8.24','8.24.1','8.25','8.25.1','8.26'];",'runtime parity release family');write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
/* Historical 8.25/8.25.1 postbuild chain remains required under 8.26. */
{
 const f='postbuild-825-set-lock-contract.mjs';let s=read(f);s=once(s,"const current=info.version==='8.25'&&info.baseVersion==='8.25',inherited=info.version==='8.25.1'&&info.baseVersion==='8.25.1';","const current=info.version==='8.25'&&info.baseVersion==='8.25',inherited=['8.25.1','8.26'].includes(info.version)&&info.baseVersion===info.version;",'8.25 inherited family');write(f,s);
}
{
 const f='postbuild-8251-inline-set-morph-contract.mjs';let s=read(f);s=once(s,"if(info.version!=='8.25.1'||info.baseVersion!=='8.25.1')fail(`release identity ${info.version}/${info.baseVersion}`);","const current=info.version==='8.25.1'&&info.baseVersion==='8.25.1',inherited=info.version==='8.26'&&info.baseVersion==='8.26';if(!current&&!inherited)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.25.1 inherited family');s+='\nif(inherited)await import(\'./postbuild-826-active-continuity-contract.mjs\');\n';write(f,s);
}

for(const [f,tokens] of [
 ['app.js',['axis826SaveVisualAwait','axis:record-save-settled','function axis821BeginCurrentItem()','axis821FlowOngoingMode(mode)','axis821FlowStartWholeItem(eq)']],
 ['v82-runtime.js',['axis:record-save-settled','activeStarted:ongoing']],
 ['v61.js',['axis826SavePending','axis826Undo']],
 ['v87-runtime.js',['axis826SetCue','axis8251SetMorph(done,total,planDone,host)']],
 ['styles.css',['AXIS 8.26 — Active Continuity','#v8Pulse{display:none!important}','#activeHome>.liveHead']]
]){const s=read(f);for(const t of tokens)if(!s.includes(t))fail(`${f} missing ${t}`)}
if((read('app.js').match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');
console.log(`[AXIS 8.26 Active Continuity] PASS · ${FROM} → ${VERSION} · atomic save settlement · ongoing Flow direct-start · dock-safe feedback · kinetic +1 set cue · integrated Home hierarchy · ${inheritedTouches+identityTouches} identity assertion(s) advanced`);
