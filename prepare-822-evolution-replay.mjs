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
 const f='postbuild-88-canonical.mjs';let s=read(f);s=once(s,`const VERSION='${FROM}';`,`const VERSION='${VERSION}';`,'canonical postbuild version');s=once(s,`document.documentElement.dataset.axisCanonical='${FROM}';`,`document.documentElement.dataset.axisCanonical='${VERSION}';`,'canonical dataset version');s=s.replaceAll(`canonical-${FROM}\\">`,`canonical-${VERSION}\\">`);write(f,s);
}

/* Historical capability versions stay historical. Only explicit public/build identity
   assertions advance. This includes inherited tests that are executed against the
   current artifact by later gates. */
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
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)];
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of identityPairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}
if(identityTouches<12)fail(`public identity convergence suspiciously small: ${identityTouches}`);

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

console.log(`[AXIS 8.22 Evolution Replay] PASS · ${FROM} → ${VERSION} · first-class derived Replay · deterministic factual chronology · no new truth/storage/network/AI owner · ${identityTouches} public identity assertion(s) advanced`);
