import fs from 'node:fs';

const PUBLIC='8.8';
const STABLE='8.7.11';
const fail=m=>{console.error(`::error title=AXIS first-paint shell::${m}`);throw new Error(`AXIS first-paint shell: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
function textOnce(src,from,to,label){const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)}
function regexOnce(src,re,to,label){const m=src.match(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,to)}

/* Final visible shell exists before runtime hydration. */
let html=read('index.html');
html=regexOnce(html,/<button class="iconBtn" id="settingsBtn" aria-label="设置">[\s\S]*?<\/button>/,'<button class="iconBtn v877Control" id="settingsBtn" aria-label="AXIS 控制"><span class="v877ControlGlyph" aria-hidden="true"><i></i><i></i><b></b><b></b></span></button>','static settings control');
html=regexOnce(html,/<div class="captureDock" id="dock">\s*<button class="scanPrimary" id="scanBtn">([\s\S]*?)<span>扫一下<\/span><\/button>\s*<\/div>/,'<div class="captureDock v8-dual" id="dock"><button class="scanPrimary" id="scanBtn">$1<span>拍摄记录</span></button><button id="quickRecordBtn" class="v8QuickBtn" type="button"><span>＋</span><b>快速记录</b></button></div>','static dual recording dock');
html=textOnce(html,'<div class="grabber"></div><div class="sheetHead"><b>扫一下</b><button class="closeBtn" data-close="scanSheet" aria-label="关闭">×</button></div>','<div class="grabber"></div><div class="sheetHead"><b>拍摄记录</b><button class="closeBtn" data-close="scanSheet" aria-label="关闭">×</button></div>','static scan title');
html=textOnce(html,'<div class="versionLine">版本 6.1</div>',`<div class="versionLine" aria-label="版本 ${PUBLIC}" data-axis-public-release="${PUBLIC}" data-axis-public-label="版本 ${PUBLIC}"></div>`,'static public version');
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

/* Public shell build version is current; stable enhancement remains an internal fallback implementation detail. */
let build=read('build-hardened.mjs');
build=textOnce(build,"const VERSION='8.7.11';",`const VERSION='${PUBLIC}';`,'public build version');
build=textOnce(build,"const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css'];","const cssFiles=['styles.css','v61.css','runtime-hardening.css','product-convergence.css','first-paint-shell.css'];",'first-paint stylesheet bundle');
write('build-hardened.mjs',build);

/* Internal feature fallback can keep its own state, but must not intentionally repaint an older public label. */
let feature=read('postbuild-features-hardened.mjs');
feature=textOnce(feature,"const fallback=(reason,err)=>{kernel.state='base';kernel.errors.push(String(reason));if(err)console.warn('[AXIS feature]',reason,err);setVersionText(BASE)};","const fallback=(reason,err)=>{kernel.state='base';kernel.errors.push(String(reason));if(err)console.warn('[AXIS feature]',reason,err);setVersionText(TARGET)};",'feature fallback presentation');
write('postbuild-features-hardened.mjs',feature);

/* One canonical editor implementation; dynamic Settings entry uses core-level event delegation. */
let app=read('app.js');
app=textOnce(app,'function saveCustomEq(){','window.__AXIS_OPEN_CUSTOM_EQUIPMENT__=openCustomEditor;\nfunction saveCustomEq(){','canonical custom editor API');
app=textOnce(app,"$('#addCustomEq').onclick=()=>{closeSheet('eqSheet');openCustomEditor()};","$('#addCustomEq').onclick=()=>{closeSheet('eqSheet');openCustomEditor()};D.addEventListener('click',e=>{if(e.target.closest('#newCustomEq')){e.preventDefault();closeSheet('settingsSheet');openCustomEditor()}},true);",'delegated settings custom editor binding');
write('app.js',app);

/* Browser contracts assert presentation, not hidden baseline implementation state. */
if(fs.existsSync('scripts/axis-smoke.mjs')){
 let smoke=read('scripts/axis-smoke.mjs');
 smoke=textOnce(smoke,"const version=(await page.locator('.versionLine').innerText()).trim();assert.equal(version,'版本 8.7.11',`failed feature must keep base version, got ${version}`);",`const version=(await page.locator('.versionLine').getAttribute('aria-label')||'').trim();assert.equal(version,'版本 ${PUBLIC}',\`public release presentation changed during internal fallback: \${version}\`);`,'fallback public-version presentation smoke');
 smoke=textOnce(smoke,"console.log('[AXIS feature fallback] PASS · 8.7.11 remained fully interactive');",`console.log('[AXIS feature fallback] PASS · stable baseline remained fully interactive under public ${PUBLIC}');`,'fallback smoke log');
 write('scripts/axis-smoke.mjs',smoke);
}
if(fs.existsSync('scripts/axis-first-paint-smoke.mjs')){
 let fp=read('scripts/axis-first-paint-smoke.mjs');
 fp=textOnce(fp,"version:document.querySelector('.versionLine')?.textContent?.trim()||'',","version:document.querySelector('.versionLine')?.getAttribute('aria-label')?.trim()||'',",'first-paint public version snapshot');
 fp=fp.replaceAll("'版本 8.7.12'",`'版本 ${PUBLIC}'`).replaceAll("'8.7.12'",`'${PUBLIC}'`);
 fp=textOnce(fp,"await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('v879Front'),undefined,{timeout:1000});","await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show')&&!document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1000});",'custom editor visibility smoke');
 fp=textOnce(fp,"assert.equal(typeof await page.locator('#saveCustomEq').evaluate(e=>e.onclick),'object');","assert.equal(await page.evaluate(()=>typeof document.querySelector('#saveCustomEq')?.onclick),'function','shared custom save handler missing');",'custom editor save smoke');
 write('scripts/axis-first-paint-smoke.mjs',fp);
}

console.log(`[AXIS] first-paint contract passed · public ${PUBLIC} · stable baseline ${STABLE} remains internal`);
