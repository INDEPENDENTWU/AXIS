import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.12.2 inherited test compat] ${m}`)};
const f='scripts/axis-8121-hotfix-smoke.mjs';
let s=fs.readFileSync(f,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};
once("assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.1');","assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),VERSION);",'field release identity');
once("assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),'版本 8.12.1');","assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),`版本 ${VERSION}`);",'field visible release identity');
once("const cloudHead=await page.locator('#v811ServicePanel .v813ServiceHead span').first().evaluate(el=>getComputedStyle(el).fontSize);","const cloudHead=await page.locator('#v811ServicePanel .axis8122Head span').first().evaluate(el=>getComputedStyle(el).fontSize);",'service heading owner');
once(" const capabilityDetails=page.locator('#v811ServicePanel .v813ServiceDetails').first();\n if(!(await capabilityDetails.evaluate(el=>el.open)))await tap(capabilityDetails.locator('summary'));\n const factLocator=page.locator('#v811ServicePanel .v811ServiceFact').first();\n await factLocator.waitFor({state:'visible'});\n const fact=await factLocator.evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));\n assert.ok(fact.h>=44);assert.ok(px(fact.f)>=12.5);"," const factLocator=page.locator('#v811ServicePanel .axis8122Fact').first();\n await factLocator.waitFor({state:'visible'});\n const fact=await factLocator.evaluate(el=>({h:el.getBoundingClientRect().height,f:getComputedStyle(el).fontSize}));\n assert.ok(fact.h>=60);assert.ok(px(fact.f)>=11.5);",'capability tile guard');
try{new Function(s)}catch(e){fail(`smoke syntax ${e.message}`)}
fs.writeFileSync(f,s);
console.log('[AXIS 8.12.2 inherited test compat] PASS · field guard follows refined Settings while preserving real Group Plan path');
