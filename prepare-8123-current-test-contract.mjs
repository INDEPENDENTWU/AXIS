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
console.log('[AXIS 8.12.3 current test contract] PASS · inherited browser checks now protect the four-decision current surface');
