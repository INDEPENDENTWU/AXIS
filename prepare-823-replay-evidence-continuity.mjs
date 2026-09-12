import fs from 'node:fs';

const FROM='8.22',VERSION='8.23',BUILD='build-hardened.mjs';
const fail=m=>{throw new Error(`[AXIS 8.23 Replay Evidence Continuity] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/* 8.23 is a presentation handoff between two established read-only lenses.
   Replay emits exact Encounter identity; Media Evidence alone resolves and renders
   that Encounter. No factual, storage, media-write, network or AI owner is added. */
{
 const replay=read('v822-evolution-replay.js'),evidence=read('v815-media-evidence.js');
 try{new Function(replay);new Function(evidence)}catch(e){fail(`source syntax ${e.message}`)}
 for(const needle of ['axis:evolution-replay-selection','selectionEvent:\'axis:evolution-replay-selection\'','eventId:x.eventId','sessionId:x.sessionId'])if(!replay.includes(needle))fail(`Replay handoff missing ${needle}`);
 for(const needle of ['axis:evolution-replay-selection','selectEncounter:selectReplayEncounter','replaySelectionConsumer:true','selected-without-media','这一次没有留下影像证据','eventId','sessionId'])if(!evidence.includes(needle))fail(`Evidence continuity missing ${needle}`);
 for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(replay.includes(forbidden)||evidence.includes(forbidden))fail(`read-only continuity acquired forbidden authority ${forbidden}`);
}

/* Public identity advances because this stage changes visible Reveal behavior. */
{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!==FROM||String(x.stableBaseVersion)!==FROM)fail(`expected sealed ${FROM} input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion=VERSION;x.stableBaseVersion=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f=BUILD;let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'hardened build version');write(f,s);
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

/* These files predate 8.22. After the inherited 8.22 release pass, any single-
   quoted 8.22 identity in them is current-public identity and must advance. */
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
 let s=read(f),n=(s.match(/'8\.22'/g)||[]).length;
 if(!n)continue;
 inheritedIdentityTouches+=n;s=s.replaceAll(`'${FROM}'`,`'${VERSION}'`);write(f,s);
}

/* Keep historical 8.10.3 freshness provenance fixed while advancing only current
   public/manifest assertions that the 8.22 pass already moved to 8.22. */
{
 const f='postbuild-8103-contract.mjs';let s=read(f);
 const freshnessLiteral="window.__AXIS_8103_FRESHNESS__={version:'8.18',eventDriven:true,polling:false";
 const releaseMarker="releaseMarker:freshnessCurrent?'8.18':'8.10.3'";
 if(!s.includes(freshnessLiteral)||!s.includes(releaseMarker))fail('8.10.3 freshness provenance drift');
 let touched=0;
 s=s.split('\n').map(line=>{
  if(!line.includes('contract.publicVersion')&&!line.includes('info.version'))return line;
  return line.replace(/8\.22/g,()=>{touched++;return VERSION});
 }).join('\n');
 if(touched<2)fail(`8.10.3 current ${FROM} identity assertions incomplete · ${touched}`);
 if(!s.includes(freshnessLiteral)||!s.includes(releaseMarker))fail('8.10.3 freshness provenance was relabeled');
 inheritedIdentityTouches+=touched;write(f,s);
}

/* 8.21/8.22-era source may contain historical capability versions, so only
   explicit current-public/build assertions advance here. */
const identityPairs=[
 ["window.__AXIS_RELEASE__==='8.22'","window.__AXIS_RELEASE__==='8.23'"],
 ["window.__AXIS_RELEASE__),'8.22'","window.__AXIS_RELEASE__),'8.23'"],
 ["window.__AXIS_RELEASE__),\"8.22\"","window.__AXIS_RELEASE__),\"8.23\""],
 ["manifest.version,'8.22'","manifest.version,'8.23'"],
 ["manifest.baseVersion,'8.22'","manifest.baseVersion,'8.23'"],
 ["info.version!=='8.22'","info.version!=='8.23'"],
 ["info.baseVersion!=='8.22'","info.baseVersion!=='8.23'"],
 ["contract.publicVersion!=='8.22'","contract.publicVersion!=='8.23'"],
 ["contract.stableBaseVersion!=='8.22'","contract.stableBaseVersion!=='8.23'"],
 ["boot.release,'8.22'","boot.release,'8.23'"],
 ["candidate.version,'8.22'","candidate.version,'8.23'"],
 ["candidate.baseVersion,'8.22'","candidate.baseVersion,'8.23'"]
];
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>f!=='scripts/axis-repository-contract.mjs');
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(inheritedIdentityTouches+identityTouches<12)fail(`public identity convergence suspiciously small: inherited ${inheritedIdentityTouches} + explicit ${identityTouches}`);

/* Runtime parity accepts the new public artifact while preserving historical
   capability versions. */
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);
 if(!s.includes("'8.23'")){s=once(s,"'8.18','8.19','8.20','8.20.1','8.21','8.22'];","'8.18','8.19','8.20','8.20.1','8.21','8.22','8.23'];",'runtime parity release family');write(f,s)}
}

/* Repository contract is also executed after build in several converged gates.
   At that point the inherited passes have already added 8.21 and 8.22 built
   identities; append 8.23 without changing the historical source shape. */
{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const marker="const built822Identity=post818.includes(\"contract.publicVersion!=='8.22'\")&&post818.includes(\"contract.stableBaseVersion!=='8.22'\")&&post818.includes(\"info.version!=='8.22'\")&&post818.includes(\"info.baseVersion!=='8.22'\");";
 const next="const built823Identity=post818.includes(\"contract.publicVersion!=='8.23'\")&&post818.includes(\"contract.stableBaseVersion!=='8.23'\")&&post818.includes(\"info.version!=='8.23'\")&&post818.includes(\"info.baseVersion!=='8.23'\");";
 if(!s.includes(marker))fail('repository 8.22 built identity anchor missing after inherited release pass');
 if(!s.includes(next))s=s.replace(marker,marker+'\n'+next);
 s=once(s,"!built821Identity&&!built822Identity)","!built821Identity&&!built822Identity&&!built823Identity)",'repository supported built identity gate');
 write(f,s);
}

/* One Encounter append owner and the four protected stores remain unchanged. */
{
 const app=read('app.js');if((app.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('authoritative Encounter append ownership drift');
 for(const forbidden of ['axis_replay_state','axis_evolution_replay','axis_replay_evidence',"localStorage.setItem('axis_replay",'localStorage.setItem("axis_replay'])if(app.includes(forbidden))fail(`forbidden Replay/Evidence persistence owner returned ${forbidden}`);
}

console.log(`[AXIS 8.23 Replay Evidence Continuity] PASS · ${FROM} → ${VERSION} · exact Encounter identity handoff · explicit selected no-evidence state · no new truth/storage/network/AI/media owner · ${inheritedIdentityTouches} inherited + ${identityTouches} explicit public identity assertion(s) advanced`);
