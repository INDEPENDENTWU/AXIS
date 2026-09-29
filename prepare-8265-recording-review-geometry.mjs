import fs from 'node:fs';

const FROM='8.26.4',VERSION='8.26.5',PR=158,SEALED='8.26.1',SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const fail=m=>{throw new Error(`[AXIS 8.26.5 Recording Review Geometry] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/*
 * Production Chromium exposed a real state-transition defect in 8.26.4:
 * v82Estimate was lazily inserted only after the first metric interaction.
 * Because the review sheet is bottom anchored, adding that 62px row moved
 * already-interactive recording controls upward by 22.75px.
 *
 * 8.26.5 makes the estimate row structural from the first Review frame. v82
 * remains its presentation/action owner; no training fact or persistence owner
 * changes. Geometry must be stable before and after the first metric edit.
 */
{
 const f='index.html';let s=read(f);
 const anchor='    <button class="saveRecord" id="saveScan">记下</button>';
 const slot='    <button type="button" class="v82Estimate" id="v82Estimate" aria-label="预计时长"><span>预计时长</span><b>自动 · 约 3 分</b><i>›</i></button>\n'+anchor;
 if(!s.includes('id="v82Estimate"'))s=once(s,anchor,slot,'static estimate slot');
 write(f,s);
}
{
 const f='styles.css';let s=read(f);
 const marker='/* AXIS 8.26.5 — immutable Review estimate slot */';
 if(!s.includes(marker))s+=`\n${marker}\n#reviewStage>#v82Estimate{width:100%;height:54px;margin-top:8px;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);display:grid;grid-template-columns:1fr auto 16px;align-items:center;text-align:left}\n#reviewStage>#v82Estimate>span{font-size:12.5px;color:var(--muted)}\n#reviewStage>#v82Estimate>b{font-size:13px;font-weight:650}\n#reviewStage>#v82Estimate>i{font-style:normal;color:var(--dim);font-size:19px;text-align:right}\n`;
 write(f,s);
}
{
 const f='v82.js';let s=read(f);
 const old="const save=$('#saveScan');if(!save||!scanEstimateHost())return;let b=$('#v82Estimate');if(!b){b=D.createElement('button');b.id='v82Estimate';b.className='v82Estimate';save.insertAdjacentElement('beforebegin',b);b.onclick=openEstimateSheet}";
 const next="const save=$('#saveScan');if(!save||!scanEstimateHost())return;const b=$('#v82Estimate');if(!b)return;if(!b.dataset.v8265){b.dataset.v8265='1';b.onclick=openEstimateSheet}";
 s=once(s,old,next,'estimate owner must bind structural slot, never insert late');
 write(f,s);
}

{
 const f='scripts/axis-completion-smoke.mjs';let s=read(f);
 const ready="await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#axisSetControls'),{timeout:2200});";
 const proof=`${ready}\nawait page.waitForFunction(()=>{const e=document.querySelector('#v82Estimate');return !!e&&e.getBoundingClientRect().height>=53},{timeout:1200});\nconst estimateBefore=await page.locator('#v82Estimate').evaluate(el=>({node:true,rect:el.getBoundingClientRect().toJSON(),text:(el.textContent||'').trim()}));\nassert.ok(estimateBefore.rect.height>=53&&/预计时长/.test(estimateBefore.text),'estimate row must be structural before recording becomes interactive');`;
 s=once(s,ready,proof,'pre-interaction estimate geometry proof');
 const geom="assert.ok(axisRecordingGeometryStable,'weight step shifted control geometry');";
 const estimateAfter=`${geom}\nconst estimateAfter=await page.locator('#v82Estimate').evaluate(el=>({rect:el.getBoundingClientRect().toJSON(),text:(el.textContent||'').trim()}));\nassert.ok(near(estimateBefore.rect.x,estimateAfter.rect.x,.5)&&near(estimateBefore.rect.y,estimateAfter.rect.y,.5)&&near(estimateBefore.rect.width,estimateAfter.rect.width,.5)&&near(estimateBefore.rect.height,estimateAfter.rect.height,.5),'estimate row shifted after first metric edit');`;
 s=once(s,geom,estimateAfter,'estimate row immutable geometry assertion');
 write(f,s);
}

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
let identityTouches=0;
for(const f of inheritedCurrentIdentityFiles){let s=read(f);const n=(s.match(/'8\.26\.4'/g)||[]).length;if(!n)continue;identityTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}

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
 'postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs','postbuild-8261-active-rest-state-contract.mjs','postbuild-8262-active-rest-selector-contract.mjs','postbuild-8263-active-rest-convergence-contract.mjs','postbuild-8264-active-rest-utility-rail-contract.mjs',
 'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs','scripts/axis-8262-governance-compat.mjs','scripts/axis-8263-governance-compat.mjs','scripts/axis-8264-governance-compat.mjs',
 'scripts/axis-825-set-lock-smoke.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','scripts/axis-826-active-continuity-smoke.mjs','scripts/axis-8262-active-rest-selector-smoke.mjs'
]);
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!excluded.has(f));
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of pairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}

for(const f of ['postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs']){
 let s=read(f);if(!s.includes(`'${VERSION}'`))s=s.replace("'8.26.3','8.26.4'].includes(info.version)","'8.26.3','8.26.4','8.26.5'].includes(info.version)");write(f,s);
}
{
 const f='postbuild-8261-active-rest-state-contract.mjs';let s=read(f);
 const a="const inherited8264=info.version==='8.26.4'&&info.baseVersion==='8.26.4';\nconst inherited=inherited8262||inherited8263||inherited8264;";
 const b="const inherited8264=info.version==='8.26.4'&&info.baseVersion==='8.26.4';\nconst inherited8265=info.version==='8.26.5'&&info.baseVersion==='8.26.5';\nconst inherited=inherited8262||inherited8263||inherited8264||inherited8265;";
 s=once(s,a,b,'8.26.1 inherited 8.26.5 identity');
 s=once(s,"const mode=inherited8264?'inherited by 8.26.4':inherited8263?'inherited by 8.26.3':inherited8262?'inherited by 8.26.2':'current';","const mode=inherited8265?'inherited by 8.26.5':inherited8264?'inherited by 8.26.4':inherited8263?'inherited by 8.26.3':inherited8262?'inherited by 8.26.2':'current';",'8.26.1 inherited log');write(f,s);
}
{
 const f='postbuild-8262-active-rest-selector-contract.mjs';let s=read(f);
 s=once(s,"inherited=['8.26.3','8.26.4'].includes(info.version)&&info.baseVersion===info.version","inherited=['8.26.3','8.26.4','8.26.5'].includes(info.version)&&info.baseVersion===info.version",'8.26.2 inherited 8.26.5 identity');write(f,s);
}
{
 const f='postbuild-8263-active-rest-convergence-contract.mjs';let s=read(f);
 s=once(s,"inherited=info.version==='8.26.4'&&info.baseVersion==='8.26.4'","inherited=['8.26.4','8.26.5'].includes(info.version)&&info.baseVersion===info.version",'8.26.3 inherited 8.26.5 identity');write(f,s);
}
{
 const f='postbuild-8264-active-rest-utility-rail-contract.mjs';let s=read(f);
 s=once(s,"if(info.version!=='8.26.4'||info.baseVersion!=='8.26.4')fail(`release identity ${info.version}/${info.baseVersion}`);","const current=info.version==='8.26.4'&&info.baseVersion==='8.26.4',inherited=info.version==='8.26.5'&&info.baseVersion==='8.26.5';if(!current&&!inherited)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.26.4 inherited 8.26.5 identity');
 s=once(s,"await import('./scripts/axis-8264-governance-compat.mjs');","if(current)await import('./scripts/axis-8264-governance-compat.mjs');\nif(inherited)await import('./postbuild-8265-recording-review-geometry-contract.mjs');",'8.26.5 postbuild chain');write(f,s);
}
{
 const f='scripts/axis-8262-active-rest-selector-smoke.mjs';let s=read(f);s=s.replaceAll("window.__AXIS_RELEASE__==='8.26.4'","window.__AXIS_RELEASE__==='8.26.5'");
 const chain="await import('./axis-8265-recording-review-geometry-smoke.mjs');";if(!s.includes(chain))s+=`\nif(process.env.AXIS_SKIP_8265_REVIEW_GEOMETRY!=='1')${chain}\n`;write(f,s);
}

{
 const f='governance/project-state.json',x=JSON.parse(read(f));
 x.product.productionRelease=VERSION;x.product.releaseStatus='candidate';x.product.candidatePullRequest=PR;
 x.production.candidateRelease=VERSION;x.production.candidateStatus='pending-exact-head-and-merged-main-certification';
 x.production.evidenceSemantics=`Provider IDs and source SHA below remain the fully sealed AXIS ${SEALED} certification snapshot at ${SEALED_SHA}. AXIS 8.26.4 merged at 61ff52383eb8103cb3aeca985bfb9b1c50b04a23 but failed the fixed Vercel Production Chromium foundation proof because the Review estimate row appeared after first metric interaction and shifted controls by 22.75px. AXIS 8.26.5 is the bounded geometry correction and may replace the seal only after exact merged-main Vercel, EdgeOne and axis.juele.fun certification.`;
 x.engineering.activeMilestone='AXIS 8.26.5 — Recording Review Geometry Stability';
 x.engineering.activePhase='Corrective release candidate — make the existing v82 estimate row structural before Review becomes interactive so first metric edits cannot move recording controls';
 x.engineering.activeBranch='main';x.engineering.deliveryBranch='fix/8265-recording-review-geometry';x.engineering.pullRequest=PR;x.engineering.pullRequestDraft=false;x.engineering.baselineRelease=VERSION;x.engineering.nextProductRelease=VERSION;
 x.engineering.versionDecision={sequence:21,baseRelease:FROM,release:VERSION,decision:'bump',changeClass:'bug-fix'};
 if(x.engineering.activeRestUtilityRail)x.engineering.activeRestUtilityRail.status='8.26.4-merged-unsealed-inherited';
 x.engineering.recordingReviewGeometry={status:'8.26.5-release-candidate',baseRelease:FROM,productionFinding:{gateRunId:36333871883,engine:'chromium',failure:'weight step shifted control geometry',deltaYPx:-22.75,rootCause:'v82Estimate inserted after first metric interaction'},structuralEstimateSlot:true,estimateOwner:'v82',reviewGeometryStableBeforeInteraction:true,metricControlTolerancePx:0.5,newTrainingOwner:false,newStorage:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,productionProofRequired:['Vercel','EdgeOne','axis.juele.fun']};
 x.engineering.nextSlice='Finish AXIS 8.26.5 on exact PR #158 head, preserve the 8.26.4 Active utility-rail behavior, prove immutable Review geometry in Chromium and iPhone-like WebKit, then certify the exact merged-main artifact on Vercel, EdgeOne and axis.juele.fun before beginning the broader AXIS Performance OS roadmap.';
 if(x.presentationFoundation)x.presentationFoundation.status='AXIS 8.26.5 is a bounded corrective candidate over merged-but-unsealed 8.26.4 and last sealed 8.26.1; it makes the existing estimate row structural before Review interaction without changing localization/theme authority.';
 x.notes=Array.isArray(x.notes)?x.notes:[];
 x.notes.push('AXIS 8.26.4 merged at 61ff52383eb8103cb3aeca985bfb9b1c50b04a23 from PR #157 but was not Production-sealed: fixed Vercel Chromium run 36333871883 exposed a 22.75px Review geometry shift when v82Estimate appeared after the first metric edit.');
 x.notes.push('AXIS 8.26.5 makes v82Estimate a structural Review row from first interactive paint; the existing v82 owner only binds/updates it and may not insert it late.');
 write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;
 const rail=x.owners?.find(o=>o.capability==='active-rest-utility-rail-8264');if(rail)rail.status='presentation-only-merged-unsealed-inherited';
 if(!x.owners.some(o=>o.capability==='recording-review-geometry-8265'))x.owners.push({capability:'recording-review-geometry-8265',status:'presentation-only-release-candidate',owner:'canonical Review shell + existing v82 estimate presentation owner',storage:'none',delegatesTo:'existing recording controls and v82 estimate sheet action',notes:'AXIS 8.26.5 reserves the existing estimate row before Review becomes interactive so metric edits cannot move recording geometry. It adds no factual, persistence, recorder, Active, network or AI authority.'});
 x.rules=Array.isArray(x.rules)?x.rules:[];x.rules.push('AXIS 8.26.5 may only stabilize Review geometry by making the existing v82 estimate row structural before interaction; it may not change metric facts, recorder ownership, Session/Encounter/Active truth, persistence, network or AI authority.');
 write(f,JSON.stringify(x,null,2)+'\n');
}

if(identityTouches<12)fail(`public identity convergence suspiciously small: ${identityTouches}`);
console.log(`[AXIS 8.26.5 Recording Review Geometry] PASS · ${FROM} → ${VERSION} · estimate slot structural before interaction · 22.75px late-insertion defect removed · existing v82/recording truth owners preserved · ${identityTouches} current identity assertion(s) advanced`);
