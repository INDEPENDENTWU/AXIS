import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 test-flow stability] ${m}`)};
const patch=(file,from,to,label)=>{
  if(!fs.existsSync(file))fail(`missing ${file}`);
  let src=fs.readFileSync(file,'utf8');
  if(src.includes(to))return;
  const count=src.split(from).length-1;
  if(count!==1)fail(`${label} expected once in ${file}, found ${count}`);
  src=src.replace(from,to);
  fs.writeFileSync(file,src);
};
const patchAll=(file,from,to,expected,label)=>{
  if(!fs.existsSync(file))fail(`missing ${file}`);
  let src=fs.readFileSync(file,'utf8');
  if(src.includes(to)&&!src.includes(from))return;
  const count=src.split(from).length-1;
  if(count!==expected)fail(`${label} expected ${expected} in ${file}, found ${count}`);
  src=src.split(from).join(to);
  fs.writeFileSync(file,src);
};

// 8.18 inherited Capture proof must close Settings through the same canonical
// sheet action a user touches. Directly deleting `.show` bypasses the modern
// route/inert/dock reconciliation owner and can leave the real Capture entry
// intentionally non-interactive even though the visual class was removed.
patch(
  'scripts/axis-818-object-focus-smoke.mjs',
  "await page.evaluate(()=>document.querySelector('#settingsSheet')?.classList.remove('show'));",
  "await tap(page.locator('#settingsSheet [data-close=\"settingsSheet\"]'));\n await page.waitForFunction(()=>!document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1500});\n await page.locator('#scanBtn').waitFor({state:'visible',timeout:2500});",
  'canonical Settings close before Capture'
);

// Deep Compatibility calls these lanes “iPhone WebKit”. Give WebKit an actual
// touch-capable mobile context and physically tap the user affordances;
// Chromium keeps its existing mouse click path. Behavioral assertions stay
// identical — only the input modality now matches the gate being claimed.
patch(
  'scripts/axis-891-smoke.mjs',
  "const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});\nconst page=await context.newPage();",
  "const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:ENGINE==='webkit',locale:'zh-CN'});\nconst page=await context.newPage();\nconst activate=async loc=>ENGINE==='webkit'?loc.tap():loc.click();",
  'iPhone WebKit learning touch context'
);
patch(
  'scripts/axis-891-smoke.mjs',
  "await page.locator('#v87Rest').click();",
  "await activate(page.locator('#v87Rest'));",
  'physical Rest learning activation'
);

patch(
  'scripts/axis-812-field-hardening-smoke.mjs',
  "const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});\nconst page=await context.newPage();",
  "const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:ENGINE==='webkit',locale:'zh-CN'});\nconst page=await context.newPage();\nconst activate=async loc=>ENGINE==='webkit'?loc.tap():loc.click();",
  'iPhone WebKit pause touch context'
);
patchAll(
  'scripts/axis-812-field-hardening-smoke.mjs',
  "await page.locator('#v87Toggle').click();",
  "await activate(page.locator('#v87Toggle'));",
  4,
  'physical pause/resume activation'
);

console.log('[AXIS 8.21 test-flow stability] PASS · canonical Settings close · visible Capture handoff · iPhone WebKit touch learning + pause/resume · assertions unchanged');
