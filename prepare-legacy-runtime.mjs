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
let helperFixes=0,watermarkFixes=0,interactionFixes=0;

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
console.log(`[AXIS] legacy sanitizer passed · ${helperFixes} null-safe helper fixes · ${watermarkFixes} recursion fix · ${interactionFixes} shell interaction fixes · stable shell geometry locked`);
