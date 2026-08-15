import fs from 'node:fs';

const PUBLIC='8.7.12';
const STABLE='8.7.11';
const fail=m=>{throw new Error(`AXIS first-paint shell: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
function textOnce(src,from,to,label){const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)}
function regexOnce(src,re,to,label){const m=src.match(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,to)}

/* User-visible shell is final in source HTML, before any JavaScript hydration. */
let html=read('index.html');
html=regexOnce(html,/<button class="iconBtn" id="settingsBtn" aria-label="设置">[\s\S]*?<\/button>/,'<button class="iconBtn v877Control" id="settingsBtn" aria-label="AXIS 控制"><span class="v877ControlGlyph" aria-hidden="true"><i></i><i></i><b></b><b></b></span></button>','static settings control');
html=regexOnce(html,/<div class="captureDock" id="dock">\s*<button class="scanPrimary" id="scanBtn">([\s\S]*?)<span>扫一下<\/span><\/button>\s*<\/div>/,'<div class="captureDock v8-dual" id="dock"><button class="scanPrimary" id="scanBtn">$1<span>拍摄记录</span></button><button id="quickRecordBtn" class="v8QuickBtn" type="button"><span>＋</span><b>快速记录</b></button></div>','static dual recording dock');
html=textOnce(html,'<div class="grabber"></div><div class="sheetHead"><b>扫一下</b><button class="closeBtn" data-close="scanSheet" aria-label="关闭">×</button></div>','<div class="grabber"></div><div class="sheetHead"><b>拍摄记录</b><button class="closeBtn" data-close="scanSheet" aria-label="关闭">×</button></div>','static scan title');
html=textOnce(html,'<div class="versionLine">版本 6.1</div>',`<div class="versionLine">版本 ${PUBLIC}</div>`,'static public version');
write('index.html',html);

/* The pre-rendered quick-record button is wired by v61; v61 no longer creates top-level chrome. */
let v61=read('v61.js');
const quick=`function injectQuick(){
 const d=$('#dock');if(!d)return;d.classList.add('v8-dual');
 if(!$('#quickRecordBtn'))d.insertAdjacentHTML('beforeend','<button id="quickRecordBtn" class="v8QuickBtn" type="button"><span>＋</span><b>快速记录</b></button>');
 if(!$('#quickRecordSheet'))D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="quickRecordSheet"><div class="sheet v8QuickSheet"><div class="grabber"></div><div class="sheetHead"><b>快速记录</b><button class="closeBtn" id="quickClose">×</button></div><div class="v8Block"><span>最近</span><div id="v8Recent"></div></div><button class="v8Other" id="v8Other">其他器械 / 运动 <i>›</i></button><button class="v8New" id="v8New">＋ 新建自定义</button></div></div>');
 const q=$('#quickRecordBtn'),close=$('#quickClose'),recent=$('#v8Recent'),other=$('#v8Other'),fresh=$('#v8New');
 if(q)q.onclick=openQuick;
 if(close)close.onclick=()=>{$('#quickRecordSheet')?.classList.remove('show');syncDock()};
 if(recent)recent.onclick=e=>{const b=e.target.closest('[data-qid]');if(b)chooseQuick(b.dataset.qid)};
 if(other)other.onclick=()=>{quickOther=true;$('#quickRecordSheet')?.classList.remove('show');$('#equipmentRow')?.click()};
 if(fresh)fresh.onclick=()=>{$('#quickRecordSheet')?.classList.remove('show');$('#addCustomEq')?.click()}
}`;
v61=regexOnce(v61,/function injectQuick\(\)\{[\s\S]*?\}\nfunction recentDistinct/,quick+'\nfunction recentDistinct','v61 shell-only quick wiring');
write('v61.js',v61);

/* Public release and stable fallback are separate concepts. */
let build=read('build-hardened.mjs');
build=textOnce(build,"const VERSION='8.7.11';",`const VERSION='${PUBLIC}',STABLE_BASE_VERSION='${STABLE}';`,'public build version');
build=textOnce(build,"const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css'];","const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css','first-paint-shell.css'];",'first-paint stylesheet bundle');
write('build-hardened.mjs',build);

/* Optional feature loading can degrade internally but never rewrites the public release backwards. */
let feature=read('postbuild-features-hardened.mjs');
feature=regexOnce(feature,/const ownVersion=\(\)=>\{\n  window\.__AXIS_VERSION__=PUBLIC;[\s\S]*?\n\};\nconst fallback=/,`const ownVersion=()=>{\n  window.__AXIS_VERSION__=PUBLIC;\n  window.__AXIS_RELEASE__=PUBLIC;\n  setVersionText(PUBLIC);\n  readyRoot.dataset.axisRelease=PUBLIC;\n};\nconst fallback=`,'feature public-version owner');
feature=textOnce(feature,`  window.__AXIS_VERSION__=BASE;\n  window.__AXIS_RELEASE__=BASE;\n  window.__AXIS_8712_READY__=false;\n  setVersionText(BASE);\n  readyRoot.dataset.axisRelease=BASE;`,`  window.__AXIS_VERSION__=PUBLIC;\n  window.__AXIS_RELEASE__=PUBLIC;\n  window.__AXIS_8712_READY__=false;\n  setVersionText(PUBLIC);\n  readyRoot.dataset.axisRelease=PUBLIC;`,'feature fallback public version');
write('postbuild-features-hardened.mjs',feature);

/* Runtime polish may enhance features, but it cannot replace the settings-control DOM after first paint. */
let v877=read('v877-runtime.js');
const oldControl="function installControl(){const b=$('#settingsBtn');if(!b)return;b.classList.add('v877Control');b.innerHTML='<span class=\"v877ControlGlyph\" aria-hidden=\"true\"><i></i><i></i><b></b><b></b></span>';b.setAttribute('aria-label','AXIS 控制')}";
const stableControl="function installControl(){const b=$('#settingsBtn');if(!b)return;b.classList.add('v877Control');b.setAttribute('aria-label','AXIS 控制')}";
v877=textOnce(v877,oldControl,stableControl,'retire runtime settings-icon replacement');
write('v877-runtime.js',v877);

/* One canonical custom-equipment editor implementation is shared by all entry points. */
let app=read('app.js');
app=textOnce(app,'function saveCustomEq(){','window.__AXIS_OPEN_CUSTOM_EQUIPMENT__=openCustomEditor;\nfunction saveCustomEq(){','expose canonical custom editor');
write('app.js',app);

/* Nested sheet order is semantic, not DOM-order based. */
let completion=read('v8712-completion.js');
completion=textOnce(completion,'let parentSnapshot=null,wireTimer=0;','let parentSnapshot=null,wireTimer=0,frontSheet=null;','completion front sheet state');
completion=textOnce(completion,"function topSheet(){const xs=visibleSheets();return xs[xs.length-1]||null}","function topSheet(){const xs=visibleSheets();if(frontSheet&&xs.includes(frontSheet))return frontSheet;return xs[xs.length-1]||null}",'semantic top sheet');
completion=textOnce(completion,"function syncLayers(){\n const xs=visibleSheets();\n D.body.classList.toggle('v879Lock',!!xs.length);\n xs.forEach((x,i)=>{x.classList.toggle('v879Under',i<xs.length-1);x.classList.toggle('v879Front',i===xs.length-1)});\n}","function syncLayers(){\n const xs=visibleSheets();\n D.body.classList.toggle('v879Lock',!!xs.length);\n const front=frontSheet&&xs.includes(frontSheet)?frontSheet:(xs[xs.length-1]||null);\n xs.forEach(x=>{x.classList.toggle('v879Under',!!front&&x!==front);x.classList.toggle('v879Front',x===front)});\n}",'completion semantic layers');
completion=textOnce(completion," sheetParents.set(child,parent);sheetScroll.set(parent,scroll);"," sheetParents.set(child,parent);sheetScroll.set(parent,scroll);frontSheet=child;",'child becomes front');
completion=textOnce(completion,"  const child=topSheet();\n  if(snap?.sheet&&child&&child!==snap.sheet)addBack(child,snap.sheet,snap.scroll);\n  syncLayers();","  const xs=visibleSheets(),child=snap?.sheet?(xs.filter(x=>x!==snap.sheet).at(-1)||null):topSheet();\n  if(snap?.sheet&&child)addBack(child,snap.sheet,snap.scroll);\n  else if(child)frontSheet=child;\n  syncLayers();",'wire newly opened child independent of DOM order');
completion=textOnce(completion,"  if(parent){\n  parent.classList.add('show');","  if(parent){\n  parent.classList.add('show');frontSheet=parent;",'return parent becomes front');
completion=textOnce(completion,"function bind(){\n installBackFlow();patch();\n D.addEventListener('click',e=>{","function bind(){\n installBackFlow();patch();\n D.addEventListener('click',e=>{\n  if(e.target.closest('#newCustomEq')){e.preventDefault();e.stopImmediatePropagation();window.__AXIS_OPEN_CUSTOM_EQUIPMENT__?.();scheduleWire();return}", 'settings canonical custom-editor entry');
write('v8712-completion.js',completion);

/* Browser contracts are generated against the built artifact, not the hidden stable baseline label. */
if(fs.existsSync('scripts/axis-smoke.mjs')){
 let smoke=read('scripts/axis-smoke.mjs');
 smoke=textOnce(smoke,"assert.equal(version,'版本 8.7.11',`failed feature must keep base version, got ${version}`);","assert.equal(version,'版本 8.7.12',`public release must remain 8.7.12 during internal fallback, got ${version}`);",'fallback public-version smoke');
 smoke=textOnce(smoke,"console.log('[AXIS feature fallback] PASS · 8.7.11 remained fully interactive');","console.log('[AXIS feature fallback] PASS · stable baseline remained interactive under public 8.7.12');",'fallback smoke log');
 write('scripts/axis-smoke.mjs',smoke);
}
if(fs.existsSync('scripts/axis-first-paint-smoke.mjs')){
 let fp=read('scripts/axis-first-paint-smoke.mjs');
 fp=textOnce(fp,"assert.equal(typeof await page.locator('#saveCustomEq').evaluate(e=>e.onclick),'object' /* Playwright serializes function as null/object? */);","assert.equal(await page.evaluate(()=>typeof document.querySelector('#saveCustomEq')?.onclick),'function','shared custom save handler missing');",'custom editor save smoke');
 write('scripts/axis-first-paint-smoke.mjs',fp);
}

console.log(`[AXIS] first-paint shell converged · public ${PUBLIC} · stable fallback ${STABLE} hidden from presentation`);
console.log('[AXIS] top-level dock/settings control are static; runtime only wires behavior.');
console.log('[AXIS] custom equipment uses one editor from record and Settings; nested sheet order is semantic.');
