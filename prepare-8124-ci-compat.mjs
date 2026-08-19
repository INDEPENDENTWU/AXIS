import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 CI compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
  const f='scripts/prepare-release-test-contract.mjs';let s=read(f);
  s=once(s,"if(version==='8.12.3'){","if(['8.12.3','8.12.4'].includes(version)){",'current CI stability patch family');
  s=s.replace('AXIS 8.12.3 CI stability contract is missing','AXIS 8.12.3+ CI stability contract is missing');
  write(f,s);
}
{
  const f='prepare-8123-ci-stability.mjs';let s=read(f);
  s=once(s,"assert.ok(['8.12','8.12.1','8.12.2','8.12.3'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);","assert.ok(['8.12','8.12.1','8.12.2','8.12.3','8.12.4'].includes(EXPECTED), `unexpected public patch ${EXPECTED}`);",'Shadow public patch family');
  write(f,s);
}
{
  const f='scripts/axis-8123-equipment-gallery-picker-smoke.mjs';let s=read(f);
  s=once(s,"assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');",'8.12.3 equipment gallery/picker inherited identity');
  write(f,s);
}

console.log('[AXIS 8.12.4 CI compat] PASS · current pause-owned/learning test contract + Shadow patch family + inherited gallery/picker identity extended without relaxing behavior');
