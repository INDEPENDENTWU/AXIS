import fs from 'node:fs';

const FROM='8.26.3',VERSION='8.26.4';
const fail=m=>{throw new Error(`[AXIS 8.26.4 Active Rest Utility Rail] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/*
 * Real-device correction over merged-but-unsealed 8.26.3.
 * Rest remains v87-owned factual presentation. 8.26.4 only gives the existing
 * rest node and existing Adjust action one disciplined secondary utility row.
 */
const utilityCss=`
/* AXIS 8.26.4 — Active Rest Utility Rail. */
html body #v87Now.axis821ActiveStage .axis821StageControls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;grid-template-rows:auto 32px!important;align-items:center!important;column-gap:10px!important;row-gap:7px!important;padding:0 0 10px!important}
html body #v87Now.axis821ActiveStage[data-primary="none"] .axis821StageControls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
html body #v87Now.axis821ActiveStage[data-primary="none"] #v87Toggle{grid-column:1/-1!important}
html body #v87Now.axis821ActiveStage .axis821StageControls>.v87Rest{grid-column:1!important;grid-row:2!important;align-self:center!important;justify-self:start!important;box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;height:32px!important;min-height:32px!important;max-height:32px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;animation:none!important;overflow:hidden!important}
html body #v87Now.axis821ActiveStage #v87AdjustBtn{grid-column:2!important;grid-row:2!important;align-self:center!important;justify-self:end!important;width:auto!important;max-width:none!important;min-width:0!important;height:32px!important;min-height:32px!important;margin:0!important;padding:0 2px 0 12px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:var(--muted)!important;font-size:11.5px!important;font-weight:620!important;line-height:32px!important}
html body #v87Now.axis821ActiveStage #v87AdjustBtn:active{background:transparent!important;color:var(--text)!important}
html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageControls>.v87Rest{display:flex!important;align-items:center!important;justify-content:flex-start!important;color:var(--accent2)!important;font-size:12.5px!important;font-weight:680!important;letter-spacing:.015em!important;line-height:32px!important;text-align:left!important;white-space:nowrap!important;text-overflow:ellipsis!important;pointer-events:none!important}
html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageControls>.v87Rest.v89Speak{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:1px!important;line-height:1.1!important;white-space:normal!important;pointer-events:auto!important;cursor:pointer!important}
html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageControls>.v87Rest.v89Speak>span,html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageControls>.v87Rest.v89Speak>small{display:block!important;width:100%!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageControls>.v87Rest.v810SpeakPrompt{pointer-events:auto!important;cursor:pointer!important}
html body #v87Now.axis821ActiveStage[data-status="active"] .axis821StageControls>.v87Rest,html body #v87Now.axis821ActiveStage[data-status="plan-complete"] .axis821StageControls>.v87Rest{display:none!important;width:0!important;max-width:0!important;min-width:0!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;animation:none!important;overflow:hidden!important}
@media(max-width:420px){html body #v87Now.axis821ActiveStage .axis821StageControls{column-gap:8px!important;row-gap:6px!important;padding-bottom:9px!important}html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageControls>.v87Rest{font-size:12px!important}}
@media(prefers-reduced-motion:reduce){html body #v87Now.axis821ActiveStage .axis821StageControls>.v87Rest,html body #v87Now.axis821ActiveStage #v87AdjustBtn{animation:none!important;transition:none!important}}
`;

/* Move the established v87Rest node into the already-existing action grid.
   It remains the same node/id and keeps the same Rest Speak hooks. */
{
 const f='v87-runtime.js';let s=read(f);
 const oldMarkup='<button class="v87Add" id="v87Add">＋ 一组</button></div><span class="v87Rest" id="v87Rest"></span><div class="v87Paused" id="v87Paused">';
 const newMarkup='<button class="v87Add" id="v87Add">＋ 一组</button><span class="v87Rest" id="v87Rest"></span></div><div class="v87Paused" id="v87Paused">';
 s=once(s,oldMarkup,newMarkup,'v87Rest utility-grid placement');
 const oldRest="$('#v87Rest').textContent=rest?'组间休息中':a.status==='paused'?'暂停期间不累计实际时间':planDone?'可加一组，或按住右上角结束项目':' ';";
 const newRest="$('#v87Rest').textContent=planDone?'':rest?'组间休息中':a.status==='paused'?'暂停期间不累计实际时间':' ';";
 s=once(s,oldRest,newRest,'plan-complete rest residue');
 const renderHead='function renderNow(force=false){ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();';
 const styleFn=`function axis8264ActiveRestUtilityStyle(){if($('#axis8264ActiveRestUtilityStyle'))return;const st=D.createElement('style');st.id='axis8264ActiveRestUtilityStyle';st.textContent=${JSON.stringify(utilityCss)};(D.head||D.documentElement).appendChild(st)}\n`;
 s=once(s,renderHead,styleFn+'function renderNow(force=false){ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis8264ActiveRestUtilityStyle();','8.26.4 final presentation owner');
 if(!s.includes('id="v87Add">＋ 一组</button><span class="v87Rest" id="v87Rest"></span></div><div class="v87Paused"'))fail('v87Rest did not land inside existing controls grid');
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta(','fetch(','XMLHttpRequest','WebSocket('])if(styleFn.includes(forbidden))fail(`presentation style acquired forbidden authority ${forbidden}`);
 write(f,s);
}

/* Advance the current physical proof without changing workflow topology. */
{
 const f='scripts/axis-8262-active-rest-selector-smoke.mjs';let s=read(f);
 s=once(s,"window.__AXIS_RELEASE__==='8.26.3'","window.__AXIS_RELEASE__==='8.26.4'",'rest smoke current release');
 const pausedEnd="assert.ok(paused.overflow<=1);";
 const utilityProof=`\n const utility=await page.evaluate(()=>{const controls=document.querySelector('#v87Now .axis821StageControls'),rest=controls?.querySelector(':scope > #v87Rest'),adjust=controls?.querySelector(':scope > #v87AdjustBtn'),rr=rest?.getBoundingClientRect(),ar=adjust?.getBoundingClientRect(),rs=rest?getComputedStyle(rest):null,as=adjust?getComputedStyle(adjust):null;return{restParent:rest?.parentElement?.className||'',adjustParent:adjust?.parentElement?.className||'',restTop:rr?.top||0,adjustTop:ar?.top||0,restMid:rr?rr.top+rr.height/2:0,adjustMid:ar?ar.top+ar.height/2:0,restRight:rr?.right||0,adjustLeft:ar?.left||0,restFont:parseFloat(rs?.fontSize||'0'),restWeight:Number(rs?.fontWeight)||0,restRadius:parseFloat(rs?.borderRadius||'0'),restShadow:rs?.boxShadow||'',adjustRadius:parseFloat(as?.borderRadius||'0'),adjustBackground:as?.backgroundColor||''}});\n assert.ok(utility.restParent.includes('axis821StageControls')&&utility.adjustParent.includes('axis821StageControls'),'rest and Adjust must share the existing utility grid');assert.ok(Math.abs(utility.restMid-utility.adjustMid)<=1.5,\`rest/Adjust baseline drift ${utility.restMid} vs ${utility.adjustMid}\`);assert.ok(utility.restRight<=utility.adjustLeft+1,'rest must remain left of Adjust');assert.ok(utility.restFont>=12&&utility.restWeight>=600,'rest status lacks deliberate secondary emphasis');assert.ok(utility.restRadius<=1&&utility.adjustRadius<=1,'utility rail must not become pills');assert.equal(utility.restShadow,'none');\n`;
 s=once(s,pausedEnd,pausedEnd+utilityProof,'paused rest/Adjust alignment proof');
 const reducedMarker="await page.emulateMedia({reducedMotion:'no-preference'});";
 const completedProof=`\n\n /* Plan-complete must never leave a rest badge, frame or geometric residue. */\n await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=c.active?.events?.find(x=>x.id==='8263-rest-e1'),a=m.events?.['8263-rest-e1']?.activity;if(!e||!a)throw new Error('8.26.4 plan-complete seed missing');a.status='active';a.completedSets=4;a.planCompletedAt=Date.now();a.restStartedAt=Date.now();a.lastResumedAt=Date.now()-1000;a.intervals=a.intervals||[];if(!a.intervals.at(-1)||a.intervals.at(-1).end)a.intervals.push({start:Date.now()-1000,end:null});localStorage.setItem('axis_v60_state',JSON.stringify(c));localStorage.setItem('axis_v8_meta',JSON.stringify(m))});\n await page.reload({waitUntil:'domcontentloaded'});await waitRelease();await page.waitForFunction(()=>document.querySelector('#v87Now.axis821ActiveStage')?.dataset.status==='plan-complete',undefined,{timeout:5000});\n const completed=await page.evaluate(()=>{const host=document.querySelector('#v87Now.axis821ActiveStage'),rest=host?.querySelector('#v87Rest'),s=rest?getComputedStyle(rest):null,r=rest?.getBoundingClientRect();return{status:host?.dataset.status||'',display:s?.display||'',width:r?.width||0,height:r?.height||0,radius:parseFloat(s?.borderRadius||'0'),background:s?.backgroundColor||'',shadow:s?.boxShadow||''}});\n assert.equal(completed.status,'plan-complete');assert.equal(completed.display,'none');assert.ok(completed.width<=0.5&&completed.height<=0.5,\`plan-complete rest residue ${completed.width}x${completed.height}\`);assert.ok(completed.radius<=1);assert.equal(completed.shadow,'none');\n`;
 s=once(s,reducedMarker,reducedMarker+completedProof,'plan-complete zero-rest proof');
 const sourceEnd="assert.match(source,/height:32px!important/);";
 const finalProof=`\n const utilityStyle=await page.evaluate(()=>document.querySelector('#axis8264ActiveRestUtilityStyle')?.textContent||'');assert.match(utilityStyle,/axis821StageControls>\\.v87Rest\\{grid-column:1!important;grid-row:2!important/);assert.match(utilityStyle,/data-status=\\"plan-complete\\"/);assert.match(utilityStyle,/#v87AdjustBtn\\{grid-column:2!important;grid-row:2!important/);`;
 s=once(s,sourceEnd,sourceEnd+finalProof,'8.26.4 utility style physical proof');
 write(f,s);
}

/* Current release identity. */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
for(const [f,a,b,label] of [
 ['build-hardened.mjs',`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version'],
 ['postbuild-features-hardened.mjs',`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version']
]){let s=read(f);s=once(s,a,b,label);write(f,s)}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset');
 s=once(s,`data-axis-runtime=\"canonical-${FROM}\"`,`data-axis-runtime=\"canonical-${VERSION}\"`,'canonical HTML marker');
 write(f,s);
}

const inheritedCurrentIdentityFiles=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs','postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs','postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs','scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs','scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs','scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs','scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs','scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedTouches=0;
for(const f of inheritedCurrentIdentityFiles){let s=read(f),n=(s.match(/'8\.26\.3'/g)||[]).length;if(!n)continue;inheritedTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}

const pairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],
 [`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],
 [`manifest.version,'${FROM}'`,`manifest.version,'${VERSION}'`],
 [`manifest.baseVersion,'${FROM}'`,`manifest.baseVersion,'${VERSION}'`],
 [`info.version!=='${FROM}'`,`info.version!=='${VERSION}'`],
 [`info.baseVersion!=='${FROM}'`,`info.baseVersion!=='${VERSION}'`],
 [`contract.publicVersion!=='${FROM}'`,`contract.publicVersion!=='${VERSION}'`],
 [`contract.stableBaseVersion!=='${FROM}'`,`contract.stableBaseVersion!=='${VERSION}'`],
 [`boot.release,'${FROM}'`,`boot.release,'${VERSION}'`],
 [`candidate.version,'${FROM}'`,`candidate.version,'${VERSION}'`],
 [`candidate.baseVersion,'${FROM}'`,`candidate.baseVersion,'${VERSION}'`]
];
const excluded=new Set([
 'postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs','postbuild-8261-active-rest-state-contract.mjs','postbuild-8262-active-rest-selector-contract.mjs','postbuild-8263-active-rest-convergence-contract.mjs',
 'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs','scripts/axis-8262-governance-compat.mjs','scripts/axis-8263-governance-compat.mjs',
 'scripts/axis-825-set-lock-smoke.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','scripts/axis-826-active-continuity-smoke.mjs','scripts/axis-8262-active-rest-selector-smoke.mjs'
]);
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!excluded.has(f));
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of pairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}

{
 const f='scripts/axis-826-active-continuity-smoke.mjs';let s=read(f),n=0;
 for(const [a,b] of [[`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],[`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`]]){const c=s.split(a).length-1;if(c){n+=c;s=s.replaceAll(a,b)}}
 if(n<2)fail(`8.26 smoke current identity drift ${n}`);write(f,s);identityTouches+=n;
}
{
 const f='scripts/axis-8251-inline-set-morph-smoke.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.3']","'8.26.3','8.26.4']");write(f,s);
}
{
 const f='scripts/axis-821-item-unit-flow-smoke.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.3'].includes(release)","'8.26.3','8.26.4'].includes(release)");write(f,s);
}
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.2','8.26.3'];","'8.26.2','8.26.3','8.26.4'];");write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* Extend historical presentation inheritance without changing factual owners. */
{
 const f='postbuild-825-set-lock-contract.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.3'].includes(info.version)","'8.26.3','8.26.4'].includes(info.version)");write(f,s);
}
{
 const f='postbuild-8251-inline-set-morph-contract.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.3'].includes(info.version)","'8.26.3','8.26.4'].includes(info.version)");write(f,s);
}
{
 const f='postbuild-826-active-continuity-contract.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.3'].includes(info.version)","'8.26.3','8.26.4'].includes(info.version)");write(f,s);
}
{
 const f='postbuild-8261-active-rest-state-contract.mjs';let s=read(f);
 s=once(s,"const inherited8263=info.version==='8.26.3'&&info.baseVersion==='8.26.3';\nconst inherited=inherited8262||inherited8263;","const inherited8263=info.version==='8.26.3'&&info.baseVersion==='8.26.3';\nconst inherited8264=info.version==='8.26.4'&&info.baseVersion==='8.26.4';\nconst inherited=inherited8262||inherited8263||inherited8264;",'8.26.1 inherited 8.26.4 identity');
 s=once(s,"const mode=inherited8263?'inherited by 8.26.3':inherited8262?'inherited by 8.26.2':'current';","const mode=inherited8264?'inherited by 8.26.4':inherited8263?'inherited by 8.26.3':inherited8262?'inherited by 8.26.2':'current';",'8.26.1 inherited log');write(f,s);
}
{
 const f='postbuild-8262-active-rest-selector-contract.mjs';let s=read(f);
 s=once(s,"const current=info.version==='8.26.2'&&info.baseVersion==='8.26.2',inherited=info.version==='8.26.3'&&info.baseVersion==='8.26.3';if(!current&&!inherited)fail(`release identity ${info.version}/${info.baseVersion}`);","const current=info.version==='8.26.2'&&info.baseVersion==='8.26.2',inherited=['8.26.3','8.26.4'].includes(info.version)&&info.baseVersion===info.version;if(!current&&!inherited)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.26.2 inherited 8.26.4 identity');write(f,s);
}
{
 const f='postbuild-8263-active-rest-convergence-contract.mjs';let s=read(f);
 s=once(s,"if(info.version!=='8.26.3'||info.baseVersion!=='8.26.3')fail(`release identity ${info.version}/${info.baseVersion}`);","const current=info.version==='8.26.3'&&info.baseVersion==='8.26.3',inherited=info.version==='8.26.4'&&info.baseVersion==='8.26.4';if(!current&&!inherited)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.26.3 inherited 8.26.4 identity');
 s=once(s,"await import('./scripts/axis-8263-governance-compat.mjs');","if(current)await import('./scripts/axis-8263-governance-compat.mjs');\nif(inherited)await import('./postbuild-8264-active-rest-utility-rail-contract.mjs');",'8.26.4 postbuild chain');write(f,s);
}

if(inheritedTouches+identityTouches<12)fail(`public identity convergence suspiciously small: ${inheritedTouches}+${identityTouches}`);
console.log(`[AXIS 8.26.4 Active Rest Utility Rail] PASS · ${FROM} → ${VERSION} · paused rest + Adjust one aligned utility row · plan-complete rest residue retired · existing truth/action owners preserved · ${inheritedTouches+identityTouches} current identity assertion(s) advanced`);
