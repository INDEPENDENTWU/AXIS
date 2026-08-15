import fs from 'node:fs';

const PUBLIC='8.7.12';
const STABLE='8.7.11';
const fail=m=>{throw new Error(`AXIS first-paint shell: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
function textOnce(src,from,to,label){const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)}
function regexOnce(src,re,to,label){const m=src.match(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,to)}

/* Final visible shell exists before runtime hydration. */
let html=read('index.html');
html=regexOnce(html,/<button class="iconBtn" id="settingsBtn" aria-label="设置">[\s\S]*?<\/button>/,'<button class="iconBtn v877Control" id="settingsBtn" aria-label="AXIS 控制"><span class="v877ControlGlyph" aria-hidden="true"><i></i><i></i><b></b><b></b></span></button>','static settings control');
html=regexOnce(html,/<div class="captureDock" id="dock">\s*<button class="scanPrimary" id="scanBtn">([\s\S]*?)<span>扫一下<\/span><\/button>\s*<\/div>/,'<div class="captureDock v8-dual" id="dock"><button class="scanPrimary" id="scanBtn">$1<span>拍摄记录</span></button><button id="quickRecordBtn" class="v8QuickBtn" type="button"><span>＋</span><b>快速记录</b></button></div>','static dual recording dock');
html=textOnce(html,'<div class="grabber"></div><div class="sheetHead"><b>扫一下</b><button class="closeBtn" data-close="scanSheet" aria-label="关闭">×</button></div>','<div class="grabber"></div><div class="sheetHead"><b>拍摄记录</b><button class="closeBtn" data-close="scanSheet" aria-label="关闭">×</button></div>','static scan title');
html=textOnce(html,'<div class="versionLine">版本 6.1</div>',`<div class="versionLine">版本 ${PUBLIC}</div>`,'static public version');
write('index.html',html);

/* v61 wires the static dock; it no longer owns visible dock creation. */
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
v61=regexOnce(v61,/function injectQuick\(\)\{[\s\S]*?\}\nfunction recentDistinct/,quick+'\nfunction recentDistinct','v61 static quick wiring');
write('v61.js',v61);

/* Public release identity is independent from the hidden stable fallback baseline. */
let build=read('build-hardened.mjs');
build=textOnce(build,"const VERSION='8.7.11';",`const VERSION='${PUBLIC}';`,'public build version');
build=textOnce(build,"const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css'];","const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css','first-paint-shell.css'];",'first-paint stylesheet bundle');
write('build-hardened.mjs',build);

let feature=read('postbuild-features-hardened.mjs');
for(const [from,to,label] of [
 ['window.__AXIS_VERSION__=BASE;','window.__AXIS_VERSION__=PUBLIC;','fallback public AXIS_VERSION'],
 ['window.__AXIS_RELEASE__=BASE;','window.__AXIS_RELEASE__=PUBLIC;','fallback public AXIS_RELEASE'],
 ['setVersionText(BASE);','setVersionText(PUBLIC);','fallback visible version'],
 ['readyRoot.dataset.axisRelease=BASE;','readyRoot.dataset.axisRelease=PUBLIC;','fallback public dataset']
])feature=textOnce(feature,from,to,label);
write('postbuild-features-hardened.mjs',feature);

/* One editor implementation is exposed to every custom-equipment entry point. */
let app=read('app.js');
app=textOnce(app,'function saveCustomEq(){','window.__AXIS_OPEN_CUSTOM_EQUIPMENT__=openCustomEditor;\nfunction saveCustomEq(){','canonical custom editor API');
write('app.js',app);

/* Settings adapter only routes to the canonical editor and places that existing sheet above Settings. */
let completion=read('v8712-completion.js');
const customAdapter=`\n(()=>{\n const D=document,$=s=>D.querySelector(s);\n const restore=()=>{const p=$('#settingsSheet'),c=$('#customEqSheet');if(p?.classList.contains('show')){p.classList.remove('v879Under');p.classList.add('v879Front')}c?.classList.remove('v879Front')};\n D.addEventListener('click',e=>{\n  if(e.target.closest('#newCustomEq')){\n   e.preventDefault();e.stopImmediatePropagation();\n   window.__AXIS_OPEN_CUSTOM_EQUIPMENT__?.();\n   requestAnimationFrame(()=>{const p=$('#settingsSheet'),c=$('#customEqSheet');if(!c?.classList.contains('show'))return;p?.classList.remove('v879Front');p?.classList.add('v879Under');c.classList.remove('v879Under');c.classList.add('v879Front')});\n   return;\n  }\n  if(e.target.closest('#saveCustomEq,#deleteCustomEq,#customEqSheet .closeBtn'))setTimeout(restore,0);\n },true);\n})();\n`;
if(completion.includes('__AXIS_SETTINGS_CUSTOM_ADAPTER__'))fail('custom adapter duplicated');
completion+=`\nwindow.__AXIS_SETTINGS_CUSTOM_ADAPTER__=true;${customAdapter}`;
write('v8712-completion.js',completion);

/* Built-artifact tests intentionally keep the public release at 8.7.12 during internal feature fallback. */
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

console.log(`[AXIS] first-paint contract passed · public ${PUBLIC} · stable baseline ${STABLE} remains internal`);
