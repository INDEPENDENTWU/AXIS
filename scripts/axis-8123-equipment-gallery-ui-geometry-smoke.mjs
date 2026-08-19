import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();

const ready=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});
 await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});
 await page.waitForFunction(()=>window.__AXIS_8123_EQUIPMENT_GALLERY__?.multiPhoto===true,undefined,{timeout:6000});
 await page.waitForFunction(()=>window.__AXIS_8123_EQUIPMENT_GALLERY_UI_GEOMETRY__?.photoAddCentered===true,undefined,{timeout:6000});
};

const rowGeometry=async()=>page.evaluate(()=>{
 const row=document.querySelector('#manageEqList [data-my-eq-id="ui-geometry"]');
 if(!row)throw new Error('UI geometry row missing');
 let thumb=row.querySelector('.v8123EqThumb');
 if(!thumb){thumb=document.createElement('span');thumb.className='v8123EqThumb';thumb.setAttribute('aria-hidden','true');row.insertBefore(thumb,row.querySelector('.v8123EqText'))}
 row.classList.add('v8123HasPhoto');
 const text=row.querySelector('.v8123EqText'),chevron=row.querySelector('.v8123EqChevron');
 const rr=row.getBoundingClientRect(),tr=thumb.getBoundingClientRect(),xr=text.getBoundingClientRect(),cr=chevron.getBoundingClientRect(),cs=getComputedStyle(row);
 return{row:rr.toJSON(),thumb:tr.toJSON(),text:xr.toJSON(),chevron:cr.toJSON(),grid:cs.gridTemplateColumns,name:text.querySelector('b')?.textContent||'',meta:text.querySelector('small')?.textContent||''};
});
const assertRowGeometry=(g,width)=>{
 assert.equal(g.name,'负重登阶 / 踏台机');
 assert.match(g.meta,/自定义|尚未记录/);
 assert.ok(g.text.width>Math.max(150,g.row.width*.5),`${width}px: text column collapsed to ${g.text.width}px`);
 assert.ok(g.thumb.right+6<=g.text.x,`${width}px: thumbnail overlaps text`);
 assert.ok(g.text.right+6<=g.chevron.x,`${width}px: text overlaps chevron`);
 assert.ok(g.chevron.right<=g.row.right+1,`${width}px: chevron escaped row`);
 const cy=r=>r.y+r.height/2;
 assert.ok(Math.abs(cy(g.thumb)-cy(g.text))<=1.5,`${width}px: photo/text vertical centers differ`);
 assert.ok(Math.abs(cy(g.text)-cy(g.chevron))<=1.5,`${width}px: text/chevron vertical centers differ`);
 assert.ok(g.grid.split(' ').filter(Boolean).length>=3,`${width}px: row did not resolve to three columns: ${g.grid}`);
};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,profile:{name:'',customEq:[{id:'ui-geometry',name:'负重登阶 / 踏台机',type:'strength',muscles:['臀部','股四头肌'],pattern:'other',effect:''}],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}))});
 await page.reload({waitUntil:'domcontentloaded'});await ready();

 console.log(`[AXIS 8.12.3 equipment gallery UI ${ENGINE}] photo-backed My Equipment row geometry`);
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 await tap(page.locator('#myEqBtn'));await page.waitForFunction(()=>document.querySelector('#manageEqList [data-my-eq-id="ui-geometry"]'),undefined,{timeout:2500});
 await page.waitForTimeout(40);
 assertRowGeometry(await rowGeometry(),417);
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(40);assertRowGeometry(await rowGeometry(),375);
 await page.setViewportSize({width:417,height:896});await page.waitForTimeout(40);

 console.log(`[AXIS 8.12.3 equipment gallery UI ${ENGINE}] add-photo card optical center`);
 await tap(page.locator('#manageEqList [data-my-eq-id="ui-geometry"]'));await page.waitForFunction(()=>document.querySelector('#v8123EqDetailSheet')?.classList.contains('show'),undefined,{timeout:2500});
 const add=await page.evaluate(()=>{
  const b=document.querySelector('#v8123EqGallery .v8123EqPhotoAdd');if(!b)throw new Error('add-photo card missing');
  const small=b.querySelector('small'),cs=getComputedStyle(b),ss=getComputedStyle(small),br=b.getBoundingClientRect(),sr=small.getBoundingClientRect();
  const textNode=[...b.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());let pr=null;
  if(textNode){const range=document.createRange();range.selectNodeContents(textNode);const r=range.getBoundingClientRect();pr=r.toJSON()}
  else{const first=[...b.children].find(x=>x!==small);if(first)pr=first.getBoundingClientRect().toJSON()}
  return{card:br.toJSON(),plus:pr,small:sr.toJSON(),display:cs.display,direction:cs.flexDirection,align:cs.alignItems,justify:cs.justifyContent,gap:parseFloat(cs.rowGap)||0,smallMarginTop:parseFloat(ss.marginTop)||0,smallPaddingTop:parseFloat(ss.paddingTop)||0};
 });
 assert.equal(add.display,'flex');assert.equal(add.direction,'column');assert.equal(add.align,'center');assert.equal(add.justify,'center');assert.ok(add.gap>=7,'add-photo content gap collapsed');assert.equal(add.smallMarginTop,0);assert.equal(add.smallPaddingTop,0);assert.ok(add.plus,'plus geometry unavailable');
 const center=r=>({x:r.x+r.width/2,y:r.y+r.height/2}),cc=center(add.card),pc=center(add.plus),sc=center(add.small),groupY=(Math.min(add.plus.y,add.small.y)+Math.max(add.plus.y+add.plus.height,add.small.y+add.small.height))/2;
 assert.ok(Math.abs(pc.x-cc.x)<=1.5,`plus is not horizontally centered: ${pc.x} vs ${cc.x}`);assert.ok(Math.abs(sc.x-cc.x)<=1.5,`添加 is not horizontally centered: ${sc.x} vs ${cc.x}`);assert.ok(Math.abs(groupY-cc.y)<=2,`plus/add group is not vertically centered: ${groupY} vs ${cc.y}`);

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.3 equipment gallery UI ${ENGINE}] PASS · photo row text remains flexible · chevron stays in column · add-photo content centered`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
