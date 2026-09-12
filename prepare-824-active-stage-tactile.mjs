import fs from 'node:fs';

const FROM='8.23',VERSION='8.24';
const fail=m=>{throw new Error(`[AXIS 8.24 Active Stage Tactile] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const hits=[...src.matchAll(re)].length;if(hits!==1)fail(`${label} expected once, found ${hits}`);return src.replace(re,to)};

/*
 * 8.24 is a bounded product/UI release. It does not acquire any training,
 * persistence, Encounter or Active ownership. Existing v87 actions remain the
 * only action boundary; this layer converges presentation truth and tactile
 * feedback around those actions.
 */
{
 const f='v87-runtime.js';let s=read(f);const css=read('styles/axis-824-active-stage-tactile.css').trim();
 if(!css.includes('axis824ActiveBreath')||!css.includes('.captureDock.show:before')||!css.includes('@media(prefers-reduced-motion:reduce)'))fail('8.24 tactile CSS contract drift');
 if(s.includes('function axis824ActiveStageTactileStyle()'))fail('8.24 tactile style duplicated');
 const marker='function ensureUI()';
 if(!s.includes(marker))fail('v87 ensureUI anchor missing');
 const style=`function axis824ActiveStageTactileStyle(){if($('#axis824ActiveStageTactileStyle'))return;const st=D.createElement('style');st.id='axis824ActiveStageTactileStyle';st.textContent=${JSON.stringify(css)};(D.head||D.documentElement).appendChild(st)}\n`;
 s=s.replace(marker,style+marker);
 s=once(s,'ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();if(hold&&!force)return;','ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();if(hold&&!force)return;','tactile style mount');
 /* Later 8.21/8.23 source convergence may alter the exact RHS while retaining
    these unique presentation sinks. Converge by sink, not by historical RHS. */
 s=regexOnce(s,/\$\('#v87Meta'\)\.textContent=[^;]+;/g,"$('#v87Meta').textContent=(actual<est?'剩余 '+clock(Math.max(0,est-actual))+' · ':'')+'预计 '+clock(est);",'single time-meta truth');
 s=regexOnce(s,/\$\('#axis821StageProgressText'\)\.textContent=[^;]+;/g,"$('#axis821StageProgressText').textContent=e.kind==='strength'?(planDone?('已完成 '+Math.min(done,total)+' / '+total+' 组'):('第 '+Math.min(done+1,total)+' / '+total+' 组')):('预计进度 '+Math.round(pct)+'%');",'single set-progress truth');
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta('])if(style.includes(forbidden))fail(`presentation style introduced forbidden owner token ${forbidden}`);
 try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
 write(f,s);
}

/* Public release identity advances because visible interaction and presentation
   behavior changes. Historical capability versions stay intact; only current
   public/build assertions are advanced. */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='build-hardened.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version');write(f,s);
}
{
 const f='postbuild-features-hardened.mjs';let s=read(f);s=once(s,`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version');write(f,s);
}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset');
 s=once(s,`data-axis-runtime=\"canonical-${FROM}\"`,`data-axis-runtime=\"canonical-${VERSION}\"`,'canonical HTML marker');
 write(f,s);
}

/* The pre-8.22 inherited gates carry their current-public allowance as raw
   single-quoted release literals. 8.23 advanced those gates from 8.22; 8.24
   must advance the same bounded set, not historical 8.23 capability markers. */
const inheritedCurrentIdentityFiles=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs',
 'scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs',
 'scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs',
 'scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedIdentityTouches=0;
for(const f of inheritedCurrentIdentityFiles){
 let s=read(f),n=(s.match(/'8\.23'/g)||[]).length;
 if(!n)continue;
 inheritedIdentityTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s);
}

const identityPairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],
 [`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],
 [`window.__AXIS_RELEASE__),\"${FROM}\"`,`window.__AXIS_RELEASE__),\"${VERSION}\"`],
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
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>f!=='scripts/axis-repository-contract.mjs');
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(inheritedIdentityTouches+identityTouches<12)fail(`public identity convergence suspiciously small: inherited ${inheritedIdentityTouches} + explicit ${identityTouches}`);

{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);
 if(!s.includes(`'${VERSION}'`))s=once(s,"'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23'];","'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24'];",'runtime parity release family');
 write(f,s);
}

/* The repository contract itself is build-verified after this late release pass.
   Extend it only for the new governed candidate while preserving all prior
   release-specific fail-closed branches. */
{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const anchor="if(CURRENT==='8.23'){\n  if(STATUS!=='candidate')fail(`8.23 must remain candidate until exact merged-main certification, got ${STATUS}`);";
 if(!s.includes(anchor))fail('repository 8.23 candidate anchor missing');
 const block=`if(CURRENT==='8.24'){\n  if(STATUS!=='candidate')fail(\`8.24 must remain candidate until exact merged-main certification, got \${STATUS}\`);\n  if(SEALED!=='8.23'||PROD_SHA!=='2418103c786f2d0865aece49d738e9ed9161ef55')fail(\`8.24 candidate must preserve exact 8.23 seal, got \${SEALED} @ \${PROD_SHA}\`);\n  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.24 must declare intended product behavior change');\n  if(project?.engineering?.versionDecision?.decision!=='bump'||project?.engineering?.versionDecision?.sequence!==9||project?.engineering?.versionDecision?.changeClass!=='product-ui')fail('8.24 governed version decision must be bump sequence 9 product-ui');\n}\n`;
 s=s.replace(anchor,block+anchor);
 s=s.replace("if(['8.22','8.23'].includes(CURRENT))", "if(['8.22','8.23','8.24'].includes(CURRENT))");
 s=s.replace("if(CURRENT==='8.23'){const handoff=", "if(['8.23','8.24'].includes(CURRENT)){const handoff=");
 s=s.replace("if(['8.22','8.23'].includes(CURRENT)&&!lifecycle.includes", "if(['8.22','8.23','8.24'].includes(CURRENT)&&!lifecycle.includes");
 s=s.replace("if(CURRENT==='8.23'&&!lifecycle.includes(\"await import('./prepare-823-replay-evidence-continuity.mjs')\"))", "if(['8.23','8.24'].includes(CURRENT)&&!lifecycle.includes(\"await import('./prepare-823-replay-evidence-continuity.mjs')\"))");
 s=s.replace("if(['8.22','8.23'].includes(CURRENT)){const release822=", "if(['8.22','8.23','8.24'].includes(CURRENT)){const release822=");
 s=s.replace("if(CURRENT==='8.23'){\n  const release823=", "if(['8.23','8.24'].includes(CURRENT)){\n  const release823=");
 s=s.replace("const expectedSteps=CURRENT==='8.23'?86:85;", "const expectedSteps=['8.23','8.24'].includes(CURRENT)?86:85;");
 const repo824=`\nif(CURRENT==='8.24'){\n  if(!lifecycle.includes(\"await import('./prepare-824-active-stage-tactile.mjs')\"))fail('8.24 Active Stage Tactile is not reachable after 8.23');\n  for(const path of ['prepare-824-active-stage-tactile.mjs','styles/axis-824-active-stage-tactile.css','postbuild-824-active-stage-tactile-contract.mjs','scripts/axis-824-active-stage-tactile-smoke.mjs'])if(!fs.existsSync(path))fail(\`8.24 release surface missing \${path}\`);\n}\n`;
 const convergenceAnchor="const convergenceDriver=read('prepare-8151-regression-seal.mjs');";
 if(!s.includes(convergenceAnchor))fail('repository convergence anchor missing');
 s=s.replace(convergenceAnchor,repo824+'\n'+convergenceAnchor);
 write(f,s);
}

/* Build-time registries follow the candidate public release without changing any
   capability owner. */
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* No factual authority changes. */
{
 const app=read('app.js');if((app.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('authoritative Encounter append ownership drift');
 const v87=read('v87-runtime.js');
 for(const needle of ['function toggle(id)','function completeSet(id,fromShake=false)','function addSet(id)','function beginHold(id,e)'])if(!v87.includes(needle))fail(`v87 action boundary drift ${needle}`);
 if((v87.match(/第 '\+Math\.min\(done\+1,total\)\+' \/ '\+total\+' 组/g)||[]).length!==1)fail('set progress must have exactly one primary x / total presentation');
 if(v87.includes("'计划 '+total+' 组'")||v87.includes("'共 '+total+' 组'"))fail('duplicate set-count presentation returned');
}

console.log(`[AXIS 8.24 Active Stage Tactile] PASS · ${FROM} → ${VERSION} · one set-progress truth · tactile v87 delegation · dock stacking isolated · reduced-motion safe · no new training/storage/Encounter/Active owner · ${inheritedIdentityTouches} inherited + ${identityTouches} explicit public identity assertion(s) advanced`);
