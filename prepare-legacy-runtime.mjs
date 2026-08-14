import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const stableFiles=[
  'v82-runtime.js','v83-reminders.js','v84-runtime.js','v85-runtime.js','v85-canvas-fix.js','v86-runtime.js','v86-gesture.js',
  'v87-runtime.js','v87-fix.js','v871-fix.js','v872-fix.js','v873-exercise-library.js','v873-smart-input.js','v874-professional.js',
  'v874-set-bridge.js','v875-polish.js','v876-runtime.js','v877-runtime.js','v878-stability.js','v879-runtime.js',
  'v8710-live-catalog.js','v8710-sonic-core.js','v8710-sonic-motifs.js','v8710-sound-ui.js','v8710-report.js','v8710-watermark.js','v8711-runtime.js',
  'v8712-runtime.js'
];
const unsafeHelper="$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s))";
const safeHelper="$=(s,r=D)=>r?.querySelector?.(s)||null,$$=(s,r=D)=>r?.querySelectorAll?Array.from(r.querySelectorAll(s)):[]";
let helperFixes=0,watermarkFixes=0,interactionFixes=0,versionOwnerFixes=0;

const interactionRewrites={
  'v876-runtime.js':[
    ["if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();syncCaptureSetting();installVersion()},120);",'']
  ],
  'v877-runtime.js':[
    ["if(e.target.closest('#settingsBtn'))setTimeout(()=>{version();installControl()},70);",'']
  ],
  'v879-runtime.js':[
    ["requestAnimationFrame(()=>{cleanLegacy();version();layer();editEntry()})",'']
  ],
  'v8711-runtime.js':[
    ["if(e.target.closest('#settingsBtn'))setTimeout(()=>{ensureSettings();version()},100);",''],
    ['requestAnimationFrame(queue)','']
  ]
};

const legacy875VersionLock="function versionLock(){const v=$('.versionLine');if(!v)return;const text=`版本 ${VERSION}`;v.textContent=text;v.style.visibility='visible';v.dataset.axisVersion=VERSION;const boot=$('#axisVersionBootStyle');boot?.remove();if(v.dataset.axisVersionLock)return;v.dataset.axisVersionLock='1';const mo=new MutationObserver(()=>{if(v.textContent!==text)v.textContent=text;if(v.style.visibility==='hidden')v.style.visibility='visible'});mo.observe(v,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['style']})}";
const safe875VersionLock="function versionLock(){const v=$('.versionLine');if(!v)return;const current=window.__AXIS_RELEASE__||VERSION,text=`版本 ${current}`;if(v.textContent!==text)v.textContent=text;if(v.style.visibility!=='visible')v.style.visibility='visible';v.dataset.axisVersion=current;$('#axisVersionBootStyle')?.remove()}";
const safe878=`(()=>{'use strict';
const VERSION=window.__AXIS_RELEASE__||'8.7.8',TEXT=()=>\`版本 \${window.__AXIS_RELEASE__||VERSION}\`;
function reveal(){
  const current=window.__AXIS_RELEASE__||VERSION,v=document.querySelector('.versionLine');
  if(v){const text=TEXT();if(v.textContent!==text)v.textContent=text;if(v.dataset.axisVersion!==current)v.dataset.axisVersion=current;if(v.style.visibility!=='visible')v.style.visibility='visible'}
  document.getElementById('axisVersionBootStyle')?.remove();
  document.documentElement.dataset.axisRelease=current;
  window.__AXIS_VERSION__=current;
  window.__AXIS_878_READY__=true;
}
function cleanUrl(){try{const u=new URL(location.href);if((u.pathname==='/'||u.pathname==='/index.html')&&(u.searchParams.has('axisboot')||u.searchParams.has('safe')||u.searchParams.has('fresh')))history.replaceState(history.state,'','/')}catch{}}
window.addEventListener('pageshow',()=>reveal());
requestAnimationFrame(()=>{reveal();setTimeout(reveal,240);setTimeout(reveal,900);setTimeout(cleanUrl,980)});
})();
`;

for(const file of stableFiles){
  const p=path.join(ROOT,file);
  if(!fs.existsSync(p))throw new Error(`AXIS legacy sanitizer: missing ${file}`);
  let src=fs.readFileSync(p,'utf8');
  const before=src.split(unsafeHelper).length-1;
  if(before){src=src.split(unsafeHelper).join(safeHelper);helperFixes+=before}
  if(file==='v8710-watermark.js'){
    const from='function render(){ensure();sync();';
    const hits=src.split(from).length-1;
    if(hits!==1)throw new Error(`AXIS legacy sanitizer: watermark render recursion signature expected once, found ${hits}`);
    src=src.replace(from,'function render(){sync();');
    watermarkFixes++;
  }
  if(file==='v875-polish.js'){
    const hits=src.split(legacy875VersionLock).length-1;
    if(hits!==1)throw new Error(`AXIS legacy sanitizer: v875 version observer signature expected once, found ${hits}`);
    src=src.replace(legacy875VersionLock,safe875VersionLock);versionOwnerFixes++;
  }
  if(file==='v878-stability.js'){
    src=safe878;versionOwnerFixes++;
  }
  for(const [from,to] of interactionRewrites[file]||[]){
    const hits=src.split(from).length-1;
    if(hits!==1)throw new Error(`AXIS legacy sanitizer: interaction signature ${file} expected once, found ${hits}: ${from.slice(0,70)}`);
    src=src.replace(from,to);interactionFixes++;
  }
  fs.writeFileSync(p,src);
}

for(const file of stableFiles){
  const src=fs.readFileSync(path.join(ROOT,file),'utf8');
  if(src.includes(unsafeHelper))throw new Error(`AXIS legacy sanitizer: unsafe scoped query remains in ${file}`);
  if(file==='v8710-watermark.js'&&src.includes('function render(){ensure();sync();'))throw new Error('AXIS legacy sanitizer: watermark recursion remains');
  if(file==='v875-polish.js'&&src.includes('new MutationObserver(()=>{if(v.textContent!==text)'))throw new Error('AXIS legacy sanitizer: v875 version observer remains');
  if(file==='v878-stability.js'&&/versionObserver|observe\(v,/.test(src))throw new Error('AXIS legacy sanitizer: v878 version observer remains');
  for(const [from] of interactionRewrites[file]||[])if(src.includes(from))throw new Error(`AXIS legacy sanitizer: redundant interaction work remains in ${file}`);
}

const hardeningPath=path.join(ROOT,'runtime-hardening.css');
const stylesPath=path.join(ROOT,'styles.css');
if(!fs.existsSync(hardeningPath))throw new Error('AXIS legacy sanitizer: missing runtime-hardening.css');
let styles=fs.readFileSync(stylesPath,'utf8');
const hardening=fs.readFileSync(hardeningPath,'utf8');
const marker='/* AXIS stable shell geometry contract */';
if(!styles.includes(marker))styles+=`\n\n${hardening}\n`;
fs.writeFileSync(stylesPath,styles);

if(helperFixes<2)throw new Error(`AXIS legacy sanitizer: expected legacy helper fixes, found ${helperFixes}`);
if(interactionFixes!==5)throw new Error(`AXIS legacy sanitizer: expected 5 interaction-path fixes, found ${interactionFixes}`);
if(versionOwnerFixes!==2)throw new Error(`AXIS legacy sanitizer: expected 2 version-owner fixes, found ${versionOwnerFixes}`);
console.log(`[AXIS] legacy sanitizer passed · ${helperFixes} null-safe helpers · ${watermarkFixes} recursion fix · ${interactionFixes} shell fixes · ${versionOwnerFixes} version-owner fixes`);
console.log('[AXIS] versionLine is single-owner: historical runtimes may render the current release but may not observe and fight it.');
