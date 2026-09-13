import fs from 'node:fs';

const FROM='8.25',VERSION='8.25.1';
const fail=m=>{throw new Error(`[AXIS 8.25.1 Inline Set Morph] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const morphCss=read('styles/axis-8251-inline-set-morph.css').trim();

/* 8.25.1 deliberately retires the full-screen completion overlay. Completion
   remains post-fact and v87-owned; only the presentation consequence changes to
   an in-stage morph that occupies the existing fact row and never covers the
   timer, controls, dock or navigation. */
{
 const f='v87-runtime.js';let s=read(f);
 for(const marker of ['axis8251InlineLand','axis8251RailLock','axis8251SetMoment','prefers-reduced-motion:reduce','#axis825SetLock{display:none!important}'])if(!morphCss.includes(marker))fail(`Inline Set Morph CSS marker missing ${marker}`);
 if(s.includes('function axis8251SetMorph(')||s.includes('function axis8251InlineSetMorphStyle('))fail('8.25.1 runtime duplicated');
 const marker='function ensureUI()';if(!s.includes(marker))fail('v87 ensureUI anchor missing');
 const runtime=`function axis8251InlineSetMorphStyle(){if($('#axis8251InlineSetMorphStyle'))return;const st=D.createElement('style');st.id='axis8251InlineSetMorphStyle';st.textContent=${JSON.stringify(morphCss)};(D.head||D.documentElement).appendChild(st)}\nfunction axis8251SetMorph(done,total,final,host){axis8251InlineSetMorphStyle();const fact=host?.querySelector('.axis821StageFact');if(!fact)return;let moment=fact.querySelector('.axis8251SetMoment');if(!moment){moment=D.createElement('div');moment.className='axis8251SetMoment';moment.setAttribute('role','status');moment.setAttribute('aria-live','polite');moment.setAttribute('aria-atomic','true');moment.innerHTML='<i class="axis8251SetMomentMark" aria-hidden="true"></i><b></b><small></small>';fact.appendChild(moment)}clearTimeout(fact._axis8251Timer);const value=moment.querySelector('b'),label=moment.querySelector('small');value.textContent=String(Math.max(0,done)).padStart(2,'0')+' / '+String(Math.max(1,total)).padStart(2,'0');label.textContent=final?'本動作完成':'已完成';fact.classList.remove('axis8251-locking','axis8251-final');host.classList.remove('axis8251-inline-feedback');void fact.offsetWidth;fact.classList.add('axis8251-locking');if(final)fact.classList.add('axis8251-final');host.classList.add('axis8251-inline-feedback');fact._axis8251Timer=setTimeout(()=>{fact.classList.remove('axis8251-locking','axis8251-final');host?.classList.remove('axis8251-inline-feedback')},final?820:660)}\n`;
 s=s.replace(marker,runtime+marker);
 s=once(s,'ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();axis8241DockOcclusionStyle();axis825SetLockStyle();if(hold&&!force)return;','ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();axis8241DockOcclusionStyle();axis8251InlineSetMorphStyle();if(hold&&!force)return;','replace full-screen Set Lock style mount');
 s=once(s,'if(done>prevDone){axis825SetLock(done,total,planDone,host);host.classList.remove(\'axis821-set-bump\');','if(done>prevDone){axis8251SetMorph(done,total,planDone,host);host.classList.remove(\'axis821-set-bump\');','replace full-screen Set Lock trigger');
 try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
 write(f,s);
}

/* Advance only current public/build identity. Historical capability identities
   remain immutable, including the sealed 8.25 overlay implementation. */
{
 const f='release-contract.json',x=JSON.parse(read(f));if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='build-hardened.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version');write(f,s);
}
{
 const f='postbuild-features-hardened.mjs';let s=read(f);s=once(s,`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version');write(f,s);
}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical version');s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset');s=once(s,`data-axis-runtime=\"canonical-${FROM}\"`,`data-axis-runtime=\"canonical-${VERSION}\"`,'canonical HTML marker');write(f,s);
}

const inheritedCurrentIdentityFiles=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs','postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs','postbuild-8131-evolution-contract.mjs','postbuild-814-evolution-contract.mjs','postbuild-815-media-evidence-contract.mjs','postbuild-8151-regression-contract.mjs','postbuild-816-contract.mjs','postbuild-817-contract.mjs','postbuild-8171-source-first-media-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs','scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs','scripts/axis-8131-evolution-smoke.mjs','scripts/axis-814-evolution-object-smoke.mjs','scripts/axis-815-media-evidence-smoke.mjs','scripts/axis-8151-evidence-swap-smoke.mjs','scripts/axis-8151-regression-seal-smoke.mjs','scripts/axis-816-capture-evidence-smoke.mjs','scripts/axis-8171-source-first-media-smoke.mjs','scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs','scripts/edgeone-prebuilt-verify.mjs','scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs'
];
let inheritedIdentityTouches=0;
for(const f of inheritedCurrentIdentityFiles){let s=read(f),n=(s.match(/'8\.25'/g)||[]).length;if(!n)continue;inheritedIdentityTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}
const identityPairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],[`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],[`window.__AXIS_RELEASE__),\"${FROM}\"`,`window.__AXIS_RELEASE__),\"${VERSION}\"`],[`manifest.version,'${FROM}'`,`manifest.version,'${VERSION}'`],[`manifest.baseVersion,'${FROM}'`,`manifest.baseVersion,'${VERSION}'`],[`info.version!=='${FROM}'`,`info.version!=='${VERSION}'`],[`info.baseVersion!=='${FROM}'`,`info.baseVersion!=='${VERSION}'`],[`contract.publicVersion!=='${FROM}'`,`contract.publicVersion!=='${VERSION}'`],[`contract.stableBaseVersion!=='${FROM}'`,`contract.stableBaseVersion!=='${VERSION}'`],[`boot.release,'${FROM}'`,`boot.release,'${VERSION}'`],[`candidate.version,'${FROM}'`,`candidate.version,'${VERSION}'`],[`candidate.baseVersion,'${FROM}'`,`candidate.baseVersion,'${VERSION}'`]
];
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>![
 'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs','scripts/axis-825-set-lock-smoke.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs'
].includes(f));
let identityTouches=0;for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(inheritedIdentityTouches+identityTouches<12)fail(`public identity convergence suspiciously small: inherited ${inheritedIdentityTouches} + explicit ${identityTouches}`);
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=once(s,"'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24','8.24.1','8.25'];","'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24','8.24.1','8.25','8.25.1'];",'runtime parity release family');write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* Presentation-only boundary: no fixed/inset overlay may remain active. */
{
 const v87=read('v87-runtime.js');for(const action of ['function completeSet(id,fromShake=false)','function toggle(id)','function addSet(id)','function beginHold(id,e)'])if(!v87.includes(action))fail(`existing v87 action boundary drift ${action}`);if((v87.match(/function completeSet\(id,fromShake=false\)/g)||[]).length!==1)fail('completeSet owner duplicated');if(!v87.includes('axis8251SetMorph(done,total,planDone,host)'))fail('post-fact Inline Set Morph trigger missing');if(v87.includes('axis825SetLock(done,total,planDone,host)'))fail('full-screen Set Lock trigger still active');
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta(','fetch(','XMLHttpRequest','WebSocket('])if(morphCss.includes(forbidden))fail(`Inline Set Morph acquired forbidden authority ${forbidden}`);
}
await import('./scripts/axis-8251-governance-compat.mjs');
console.log(`[AXIS 8.25.1 Inline Set Morph] PASS · ${FROM} → ${VERSION} · full-screen overlay retired · in-stage fact-row morph · bounded motion · existing v87 truth owner preserved · ${inheritedIdentityTouches} inherited + ${identityTouches} explicit current identity assertion(s) advanced`);
