import {chromium} from 'playwright-core';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'}),page=await context.newPage();
for(const [pat,body] of [['**/api/ai-status**','{"ok":true,"enabled":false}'],['**/api/owner-config**','{"ok":true}'],['**/api/analyze**','{"ok":false,"disabled":true}'],['**/api/insight**','{"ok":false,"disabled":true}']])await page.route(pat,r=>r.fulfill({status:200,contentType:'application/json',body}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')console.error('[diag console]',m.text())});
await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:12000});
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelectorAll('#v8Recent [data-qid]').length>0,{timeout:1200});
const q=page.locator('#v8Recent [data-qid]:visible').first();
const chosen=await q.evaluate(el=>({qid:el.dataset.qid,text:el.innerText}));
await q.click();
await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#axisSetControls'),{timeout:2500});
await page.evaluate(()=>{
 window.__AXIS_WRITE_TRACE__=[];
 const keep=(kind,node,value)=>{try{const row=node?.nodeType===1?(node.matches?.('.v8SetRow')?node:node.closest?.('.v8SetRow')):node?.parentElement?.closest?.('.v8SetRow');const host=node?.nodeType===1?(node.matches?.('#v8Sets')?node:node.closest?.('#v8Sets')):node?.parentElement?.closest?.('#v8Sets');if(!row&&!host)return;window.__AXIS_WRITE_TRACE__.push({kind,tag:node?.nodeName||'',cls:node?.className||'',value:String(value).slice(0,180),rowText:row?.innerText||'',stack:new Error().stack})}catch{}};
 const td=Object.getOwnPropertyDescriptor(Node.prototype,'textContent');if(td?.set&&!window.__AXIS_TEXT_PATCHED__){window.__AXIS_TEXT_PATCHED__=true;Object.defineProperty(Node.prototype,'textContent',{configurable:true,enumerable:td.enumerable,get:td.get,set(v){keep('textContent',this,v);return td.set.call(this,v)}})}
 const hd=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');if(hd?.set&&!window.__AXIS_HTML_PATCHED__){window.__AXIS_HTML_PATCHED__=true;Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,enumerable:hd.enumerable,get:hd.get,set(v){keep('innerHTML',this,v);return hd.set.call(this,v)}})}
 window.__AXIS_VISIBLE_ROW__=document.querySelector('#v8Sets .v8SetRow.active')||document.querySelector('#v8Sets .v8SetRow');
});
const before=await page.evaluate(()=>({snapshot:window.__AXIS_RECORDING__?.snapshot?.(),hosts:[...document.querySelectorAll('#v8Sets')].map((h,i)=>({i,visible:getComputedStyle(h).display!=='none',rect:h.getBoundingClientRect().toJSON(),html:h.innerHTML.slice(0,600),rows:[...h.querySelectorAll('.v8SetRow')].map((r,j)=>({j,active:r.classList.contains('active'),text:r.innerText,visible:getComputedStyle(r).display!=='none'}))}))}));
await page.locator('#axisSetControls [data-axis-step="weight"][data-dir="1"]').click();
await page.waitForTimeout(160);
const after=await page.evaluate(()=>({snapshot:window.__AXIS_RECORDING__?.snapshot?.(),sameRow:window.__AXIS_VISIBLE_ROW__===(document.querySelector('#v8Sets .v8SetRow.active')||document.querySelector('#v8Sets .v8SetRow')),hosts:[...document.querySelectorAll('#v8Sets')].map((h,i)=>({i,visible:getComputedStyle(h).display!=='none',rect:h.getBoundingClientRect().toJSON(),rows:[...h.querySelectorAll('.v8SetRow')].map((r,j)=>({j,active:r.classList.contains('active'),text:r.innerText,visible:getComputedStyle(r).display!=='none'}))})),trace:window.__AXIS_WRITE_TRACE__}));
const state=await page.evaluate(()=>({equipmentName:document.querySelector('#equipmentName')?.textContent,quick:document.querySelector('#quickRecordSheet')?.className,eq:document.querySelector('#eqSheet')?.className,scan:document.querySelector('#scanSheet')?.className,capture:document.querySelector('#captureStage')?.className,review:document.querySelector('#reviewStage')?.className,setHosts:document.querySelectorAll('#v8Sets').length,rows:document.querySelectorAll('#v8Sets .v8SetRow').length,controls:document.querySelectorAll('#axisSetControls').length,recording:window.__AXIS_RECORDING__?.snapshot?.(),diag:window.__AXIS_ENHANCE_DIAG__}));
console.error('[AXIS recording-writer diagnostic]',JSON.stringify({chosen,state,before,after,errors},null,2));
await context.close();await browser.close();