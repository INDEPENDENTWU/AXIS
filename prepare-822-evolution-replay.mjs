import fs from 'node:fs';

const FROM='8.21',VERSION='8.22',BUILD='build-hardened.mjs';
const fail=m=>{throw new Error(`[AXIS 8.22 Evolution Replay] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/* Replay is a derived read-only lens over the already-sealed Evolution Object.
   It does not create a Session, Encounter, media, persistence, network or AI owner. */
{
 const source=read('v822-evolution-replay.js');
 try{new Function(source)}catch(e){fail(`Replay source syntax ${e.message}`)}
 for(const needle of ['__AXIS_EVOLUTION_OBJECTS__','__AXIS_EVOLUTION_REPLAY__','__AXIS_822_EVOLUTION_REPLAY__','resolveReplay','time-session-event','factualOnly:true','readOnly:true','persistence:false','network:false','ai:false','trainingOwner:false','mediaOwner:false','过程回看','只有一次真实记录 · 暂无前后对照'])if(!source.includes(needle))fail(`Replay source missing ${needle}`);
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(source.includes(forbidden))fail(`Replay source acquired forbidden authority ${forbidden}`);
 const objects=read('v814-evolution-objects.js');
 if(!objects.includes('media:x.media.slice()'))fail('8.15 encounter-bound projection must converge before Replay');
 const evidence=read('v815-media-evidence.js');
 if(!evidence.includes("replay:false")||!evidence.includes("owner:'v815-media-evidence'"))fail('8.15 Evidence provenance/replay boundary drifted');
}

/* Make Replay a first-class compiled runtime module after factual Object + Evidence. */
{
 let s=read(BUILD);
 const anchor="['v815-media-evidence.js','__AXIS_815_MEDIA_EVIDENCE_READY__']";
 s=once(s,anchor,anchor+",['v822-evolution-replay.js','__AXIS_822_EVOLUTION_REPLAY_READY__']",'first-class Replay module');
 write(BUILD,s);
}

/* Public identity advances because this stage changes user-visible product behavior. */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
{
 let s=read(BUILD);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version');write(BUILD,s);
}
{
 const f='postbuild-features-hardened.mjs';let s=read(f);s=once(s,`const TARGET_VERSION='${FROM}';`,`const TARGET_VERSION='${VERSION}';`,'feature manifest version');write(f,s);
}
{
 const f='postbuild-88-canonical.mjs';let s=read(f);
 s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical postbuild version');
 s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset version');
 s=once(s,`data-axis-runtime="canonical-${FROM}"`,`data-axis-runtime="canonical-${VERSION}"`,'canonical HTML marker version');
 write(f,s);
}

/* Files in this list predate 8.21. Any single-quoted 8.21 literal present after
   the inherited 8.21 release pass is therefore current-public identity, not a
   native 8.21 capability marker. Advance those literals wholesale, mirroring
   the established 8.20.1 -> 8.21 release-owner contract. This matters for
   inherited semantic switches such as the duration-reminder allowance: they
   must follow the current release instead of silently falling back to an older
   behavior contract. */
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
 let s=read(f),n=(s.match(/'8\.21'/g)||[]).length;
 if(!n)continue;
 inheritedIdentityTouches+=n;
 s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);
 write(f,s);
}

/* 8.10.3 freshness provenance remains 8.18. Its contract has a String(...)
   public-version assertion that is intentionally outside the generic identity
   matcher, so advance only the current public/manifest assertions and prove the
   historical freshness markers survived unchanged. */
{
 const f='postbuild-8103-contract.mjs';let s=read(f);
 const freshnessLiteral="window.__AXIS_8103_FRESHNESS__={version:'8.18',eventDriven:true,polling:false";
 const releaseMarker="releaseMarker:freshnessCurrent?'8.18':'8.10.3'";
 if(!s.includes(freshnessLiteral)||!s.includes(releaseMarker))fail('8.10.3 freshness provenance drift');
 let touched=0;
 s=s.split('\n').map(line=>{
  if(!line.includes('contract.publicVersion')&&!line.includes('info.version'))return line;
  const next=line.replace(/8\.21/g,()=>{touched++;return VERSION});return next;
 }).join('\n');
 if(touched<2)fail(`8.10.3 current ${FROM} identity assertions incomplete · ${touched}`);
 if(!s.includes(freshnessLiteral)||!s.includes(releaseMarker))fail('8.10.3 freshness provenance was relabeled');
 inheritedIdentityTouches+=touched;
 write(f,s);
}

/* 8.21-era files can legitimately contain historical 8.21 capability markers,
   so only explicit public/build assertions advance there. Repository identity-
   provenance is excluded because its transition chain has dedicated logic below. */
const identityPairs=[
 ["window.__AXIS_RELEASE__==='8.21'","window.__AXIS_RELEASE__==='8.22'"],
 ["window.__AXIS_RELEASE__),'8.21'","window.__AXIS_RELEASE__),'8.22'"],
 ["window.__AXIS_RELEASE__),\"8.21\"","window.__AXIS_RELEASE__),\"8.22\""],
 ["manifest.version,'8.21'","manifest.version,'8.22'"],
 ["manifest.baseVersion,'8.21'","manifest.baseVersion,'8.22'"],
 ["info.version!=='8.21'","info.version!=='8.22'"],
 ["info.baseVersion!=='8.21'","info.baseVersion!=='8.22'"],
 ["contract.publicVersion!=='8.21'","contract.publicVersion!=='8.22'"],
 ["contract.stableBaseVersion!=='8.21'","contract.stableBaseVersion!=='8.22'"],
 ["boot.release,'8.21'","boot.release,'8.22'"],
 ["candidate.version,'8.21'","candidate.version,'8.22'"],
 ["candidate.baseVersion,'8.21'","candidate.baseVersion,'8.22'"]
];
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>f!=='scripts/axis-repository-contract.mjs');
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
const totalIdentityTouches=inheritedIdentityTouches+identityTouches;
if(totalIdentityTouches<12)fail(`public identity convergence suspiciously small: inherited ${inheritedIdentityTouches} + explicit ${identityTouches}`);

/* Runtime parity supports the new public artifact while preserving the sealed patch family. */
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);
 if(s.includes("'8.22'")){}else{s=once(s,"'8.18','8.19','8.20','8.20.1','8.21'];","'8.18','8.19','8.20','8.20.1','8.21','8.22'];",'runtime parity release family');write(f,s)}
}

/* Repository contract accepts 8.22 as a built identity without relabeling 8.18 provenance. */
{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const marker="const built821Identity=post818.includes(\"contract.publicVersion!=='8.21'\")&&post818.includes(\"contract.stableBaseVersion!=='8.21'\")&&post818.includes(\"info.version!=='8.21'\")&&post818.includes(\"info.baseVersion!=='8.21'\");";
 const next="const built822Identity=post818.includes(\"contract.publicVersion!=='8.22'\")&&post818.includes(\"contract.stableBaseVersion!=='8.22'\")&&post818.includes(\"info.version!=='8.22'\")&&post818.includes(\"info.baseVersion!=='8.22'\");";
 if(!s.includes(marker))fail('repository 8.21 built identity anchor missing');
 if(!s.includes(next))s=s.replace(marker,marker+'\n'+next);
 s=once(s,"!built8201Identity&&!built821Identity)","!built8201Identity&&!built821Identity&&!built822Identity)",'repository supported built identity gate');
 write(f,s);
}

/* Final authority proof stays bounded: one Encounter append owner, no new store. */
{
 const app=read('app.js');if((app.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('authoritative Encounter append ownership drift');
 for(const forbidden of ['axis_replay_state','axis_evolution_replay',"localStorage.setItem('axis_replay",'localStorage.setItem("axis_replay'])if(app.includes(forbidden))fail(`forbidden Replay persistence owner returned ${forbidden}`);
}

console.log(`[AXIS 8.22 Evolution Replay] PASS · ${FROM} → ${VERSION} · first-class derived Replay · deterministic factual chronology · no new truth/storage/network/AI owner · ${inheritedIdentityTouches} inherited + ${identityTouches} explicit public identity assertion(s) advanced`);
