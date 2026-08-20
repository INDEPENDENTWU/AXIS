import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.12.3 current test contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
{
 const f='scripts/axis-811-browser-smoke.mjs';let s=read(f);
 s=once(s,"assert([3,5].includes(await page.locator('#v811CoreLearning .v811CoreGroup').count()),'learning settings lost inherited core groups');","assert(await page.locator('#v811CoreLearning .v811CoreGroup').count()===4,'8.12.3 learning settings should expose four core groups');",'8.11 inherited group count');
 s=once(s,"assert(coreLabels.includes('目标')&&coreLabels.includes('难度'),'inherited goal/difficulty controls missing');","assert(coreLabels.join('|')==='目标|强度|难度|对话','8.12.3 current learning labels changed');assert(await page.locator('[data-v812-core=\"method\"]').count()===0,'retired method selector returned');",'8.11 inherited current labels');
 write(f,s);
}
{
 const f='scripts/axis-813-settings-convergence-smoke.mjs';let s=read(f);
 s=once(s,"assert.ok(await page.locator('[data-v812-core=\"method\"]').count()>=6,'8.12 learning method controls disappeared');","assert.equal(await page.locator('[data-v812-core=\"method\"]').count(),0,'retired 8.12 method controls returned in 8.12.3');",'Settings convergence retired method contract');
 s=once(s,"assert.ok(learningRowHeight>=58&&learningRowHeight<=62,`learning row lost native Settings rhythm: ${learningRowHeight}`);","assert.equal(learningRowHeight,64,`learning row lost current native Settings rhythm: ${learningRowHeight}`);",'Settings Learning row current geometry');
 s=once(s,"assert.ok(serviceRowHeight>=58&&serviceRowHeight<=62,`service row lost native Settings rhythm: ${serviceRowHeight}`);","assert.equal(serviceRowHeight,64,`service row lost current native Settings rhythm: ${serviceRowHeight}`);",'Settings Cloud/AI row current geometry');
 write(f,s);
}
{
 const f='scripts/axis-product-matrix.mjs';let s=read(f);
 const old=`const customRow=page.locator('#manageEqList [data-edit-eq]').filter({hasText:'矩阵胸推'}).first();
assert.ok(await customRow.count(),'custom row missing from My Equipment');
await customRow.click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.locator('#customName').inputValue(),'矩阵胸推');`;
 const current=`const customRow=page.locator('#manageEqList [data-my-eq-id]').filter({hasText:'矩阵胸推'}).first();
assert.ok(await customRow.count(),'custom row missing from My Equipment');
await customRow.click();
await page.waitForFunction(()=>document.querySelector('#v8123EqDetailSheet')?.classList.contains('show'),undefined,{timeout:1600});
assert.equal((await page.locator('#v8123EqDetailTitle').innerText()).trim(),'矩阵胸推','current equipment detail route lost selected custom item');
assert.ok(await page.locator('#v8123EqInfoEdit').isVisible(),'custom equipment detail lost edit action');
await page.locator('#v8123EqInfoEdit').click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.locator('#customName').inputValue(),'矩阵胸推');`;
 s=once(s,old,current,'product matrix current equipment detail/edit route');
 write(f,s);
}
console.log('[AXIS 8.12.3 current test contract] PASS · inherited browser checks protect the four-decision surface · retired method cannot return · current 64px Settings rhythm + equipment detail route sealed');

await import('./prepare-8124-release-compat.mjs');
await import('./prepare-8124-ci-compat.mjs');
await import('./prepare-8125-release-compat.mjs');
