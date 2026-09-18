import fs from 'node:fs';

const FROM='8.26',VERSION='8.26.1';
const fail=m=>{throw new Error(`[AXIS 8.26.1 Active Rest State] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/* The behavior remains owned by v87. This patch is intentionally presentation
   only and must be present in the 8.26 stylesheet already consumed by the
   previous prepare step. */
const css=read('styles/axis-826-active-continuity.css');
for(const token of [
  '.v87-restline{margin-top:12px!important',
  'background:rgba(115,124,255,.07)',
  'axis826RestStateIn',
  '.v87-restline{animation:none!important}'
])if(!css.includes(token))fail(`rest-state CSS contract drift ${token}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket('])if(css.includes(forbidden))fail(`presentation CSS acquired forbidden authority ${forbidden}`);

/* Current identity only. 8.26 remains the historical Active Continuity layer. */
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

/* Advance inherited current-release assertions without rewriting historical
   capability names, prepare layers, or descriptive release evidence. */
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
 'postbuild-825-set-lock-contract.mjs','postbuild-8251-inline-set-morph-contract.mjs','postbuild-826-active-continuity-contract.mjs',
 'scripts/axis-repository-contract.mjs','scripts/axis-production-governance-contract.mjs','scripts/axis-version-authority-contract.mjs',
 'scripts/axis-825-set-lock-smoke.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs'
]);
const candidates=[...fs.readdirSync('.').filter(f=>/^postbuild-.*\.mjs$/.test(f)),...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)].filter(f=>!excluded.has(f));
let identityTouches=0;
for(const f of candidates){let s=read(f),next=s;for(const [a,b] of pairs){const n=next.split(a).length-1;if(n){identityTouches+=n;next=next.replaceAll(a,b)}}if(next!==s)write(f,next)}

/* The 8.26 browser smoke is inherited as the active-continuity regression and
   therefore follows the current release identity during this build. */
{
 const f='scripts/axis-826-active-continuity-smoke.mjs';let s=read(f),n=0;
 for(const [a,b] of [[`window.__AXIS_RELEASE__==='${FROM}'`,`window.__AXIS_RELEASE__==='${VERSION}'`],[`window.__AXIS_RELEASE__),'${FROM}'`,`window.__AXIS_RELEASE__),'${VERSION}'`]]){const c=s.split(a).length-1;if(c){n+=c;s=s.replaceAll(a,b)}}
 if(n<2)fail(`8.26 smoke current identity drift ${n}`);write(f,s);identityTouches+=n;
}
{
 const f='scripts/axis-813-build-parity.mjs';let s=read(f);
 if(!s.includes(`'${VERSION}'`))s=once(s,"'8.24','8.24.1','8.25','8.25.1','8.26'];","'8.24','8.24.1','8.25','8.25.1','8.26','8.26.1'];",'runtime parity release family');
 write(f,s);
}
{
 const f='governance/owners.json',x=JSON.parse(read(f));x.baselineRelease=VERSION;write(f,JSON.stringify(x,null,2)+'\n');
}

/* Extend only the inheritance edges needed for the patch release. */
{
 const f='postbuild-825-set-lock-contract.mjs';let s=read(f);
 s=once(s,"inherited=['8.25.1','8.26'].includes(info.version)&&info.baseVersion===info.version;","inherited=['8.25.1','8.26','8.26.1'].includes(info.version)&&info.baseVersion===info.version;",'8.25 inherited patch family');write(f,s);
}
{
 const f='postbuild-8251-inline-set-morph-contract.mjs';let s=read(f);
 s=once(s,"const current=info.version==='8.25.1'&&info.baseVersion==='8.25.1',inherited=info.version==='8.26'&&info.baseVersion==='8.26';","const current=info.version==='8.25.1'&&info.baseVersion==='8.25.1',inherited=['8.26','8.26.1'].includes(info.version)&&info.baseVersion===info.version;",'8.25.1 inherited patch family');write(f,s);
}
{
 const f='postbuild-826-active-continuity-contract.mjs';let s=read(f);
 s=once(s,"if(info.version!=='8.26'||info.baseVersion!=='8.26')fail(`release identity ${info.version}/${info.baseVersion}`);","const current=info.version==='8.26'&&info.baseVersion==='8.26',inherited=info.version==='8.26.1'&&info.baseVersion==='8.26.1';if(!current&&!inherited)fail(`release identity ${info.version}/${info.baseVersion}`);",'8.26 inherited patch family');
 if(!s.includes("postbuild-8261-active-rest-state-contract.mjs"))s+="\nif(inherited)await import('./postbuild-8261-active-rest-state-contract.mjs');\n";
 write(f,s);
}
if(identityTouches<8)fail(`public identity convergence suspiciously small: ${identityTouches}`);
console.log(`[AXIS 8.26.1 Active Rest State] PASS · ${FROM} → ${VERSION} · presentation-only pause hierarchy · ${identityTouches} current identity assertion(s) advanced`);
