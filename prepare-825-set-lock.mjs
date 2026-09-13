import fs from 'node:fs';

const FROM='8.24.1',VERSION='8.25';
const fail=m=>{throw new Error(`[AXIS 8.25 Set Lock] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const setLockCss=read('styles/axis-825-set-lock.css').trim();

/* Set Lock is presentation after the existing completeSet fact commit. It does
   not create a second tap/action/state owner. The large lock moment is triggered
   by the already-proven render observation done > prevDone. */
{
 const f='v87-runtime.js';let s=read(f);const css=setLockCss;
 for(const marker of ['axis825NumberLand','axis825SetToProgress','prefers-reduced-motion:reduce','.axis825SetLock{'])if(!css.includes(marker))fail(`Set Lock CSS marker missing ${marker}`);
 if(s.includes('function axis825SetLock(')||s.includes('function axis825SetLockStyle('))fail('Set Lock runtime duplicated');
 const marker='function ensureUI()';if(!s.includes(marker))fail('v87 ensureUI anchor missing');
 const runtime=`function axis825SetLockStyle(){if($('#axis825SetLockStyle'))return;const st=D.createElement('style');st.id='axis825SetLockStyle';st.textContent=${JSON.stringify(css)};(D.head||D.documentElement).appendChild(st)}\nfunction axis825SetLock(done,total,final,host){axis825SetLockStyle();let o=$('#axis825SetLock');if(!o){D.body.insertAdjacentHTML('beforeend','<div class="axis825SetLock" id="axis825SetLock" aria-hidden="true"><div class="axis825SetLockHalo"></div><i class="axis825SetLockClamp axis825SetLockClampL"></i><div class="axis825SetLockMeasure"><b class="axis825SetLockNumber"></b><small class="axis825SetLockTotal"></small></div><i class="axis825SetLockClamp axis825SetLockClampR"></i></div>');o=$('#axis825SetLock')}clearTimeout(o._collapseTimer);clearTimeout(o._hideTimer);o.classList.remove('show','collapse','final');const number=$('.axis825SetLockNumber',o),totalEl=$('.axis825SetLockTotal',o);number.textContent=String(Math.max(0,done)).padStart(2,'0');totalEl.textContent='/ '+String(Math.max(1,total)).padStart(2,'0');const target=$('#axis821StageProgressText'),r=target?.getBoundingClientRect();o.style.setProperty('--axis825-dx',((r?r.left+r.width/2:innerWidth/2)-innerWidth/2)+'px');o.style.setProperty('--axis825-dy',((r?r.top+r.height/2:innerHeight/2)-innerHeight/2)+'px');if(final)o.classList.add('final');void o.offsetWidth;o.classList.add('show');if(host){host.classList.remove('axis825-lock-recoil');void host.offsetWidth;host.classList.add('axis825-lock-recoil')}o._collapseTimer=setTimeout(()=>o.classList.add('collapse'),final?600:560);o._hideTimer=setTimeout(()=>{o.classList.remove('show','collapse','final');host?.classList.remove('axis825-lock-recoil')},final?940:890)}\n`;
 s=s.replace(marker,runtime+marker);
 s=once(s,'ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();axis8241DockOcclusionStyle();if(hold&&!force)return;','ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();axis824ActiveStageTactileStyle();axis8241DockOcclusionStyle();axis825SetLockStyle();if(hold&&!force)return;','8.25 style mount after 8.24.1');
 s=once(s,"if(done>prevDone){host.classList.remove('axis821-set-bump');","if(done>prevDone){axis825SetLock(done,total,planDone,host);host.classList.remove('axis821-set-bump');",'post-fact Set Lock trigger');
 s=once(s,'try{navigator.vibrate?.(10)}catch{};renderNow(true);',"try{navigator.vibrate?.(a.completedSets>=total?[10,28,18]:[8,24,14])}catch{};renderNow(true);",'bounded Set Lock haptic');
 try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
 write(f,s);
}

/* Advance only current public/build identity. Historical capability identities
   remain intact; inherited current-public assertions follow the new release. */
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
for(const f of inheritedCurrentIdentityFiles){let s=read(f),n=(s.match(/'8\.24\.1'/g)||[]).length;if(!n)continue;inheritedIdentityTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s)}
const identityPairs=[
 [`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],[`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`],[`window.__AXIS_RELEASE__),\"${FROM}\"`,`window.__AXIS_RELEASE__),\"${VERSION}\"`],[`manifest.version,'${FROM}'`,`manifest.version,'${VERSION}'`],[`manifest.baseVersion,'${FROM}'`,`manifest.baseVersion,'${VERSION}'`],[`info.version!=='${FROM}'`,`info.version!=='${VERSION}'`],[`info.baseVersion!=='${FROM}'`,`info.baseVersion!=='${VERSION}'`],[`contract.publicVersion!=='${FROM}'`,`contract.publicVersion!=='${VERSION}'`],[`contract.stableBaseVersion!=='${FROM}'`,`contract.stableBaseVersion!=='${VERSION}'`],[`boot.release,'${FROM}'`,`boot.release,'${VERSION}'`],[`candidate.version,'${FROM}'`,`candidate.version,'${VERSION}'`],[`candidate.baseVersion,'${FROM}'`,`candidate.baseVersion,'${VERSION}'`]
];
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!['scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs','scripts/axis-825-set-lock-smoke.mjs'].includes(f));
let identityTouches=0;for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(inheritedIdentityTouches+identityTouches<12)fail(`public identity convergence suspiciously small: inherited ${inheritedIdentityTouches} + explicit ${identityTouches}`);
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);if(!s.includes(`'${VERSION}'`))s=once(s,"'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24','8.24.1'];","'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23','8.24','8.24.1','8.25'];",'runtime parity release family');write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* Presentation-only boundary: exactly one existing factual completion owner. */
{
 const v87=read('v87-runtime.js');for(const action of ['function completeSet(id,fromShake=false)','function toggle(id)','function addSet(id)','function beginHold(id,e)'])if(!v87.includes(action))fail(`existing v87 action boundary drift ${action}`);if((v87.match(/function completeSet\(id,fromShake=false\)/g)||[]).length!==1)fail('completeSet owner duplicated');if(!v87.includes('axis825SetLock(done,total,planDone,host)'))fail('post-fact Set Lock trigger missing');for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta(','fetch(','XMLHttpRequest','WebSocket('])if(setLockCss.includes(forbidden))fail(`Set Lock CSS acquired forbidden authority ${forbidden}`);
}
console.log(`[AXIS 8.25 Set Lock] PASS · ${FROM} → ${VERSION} · post-fact large Set Lock · progress collapse · bounded haptic · reduced-motion safe · existing v87 truth owner preserved · ${inheritedIdentityTouches} inherited + ${identityTouches} explicit current identity assertion(s) advanced`);
