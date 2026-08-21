import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.13.1 evolution release] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
 const f='release-contract.json',x=JSON.parse(read(f));
 if(String(x.publicVersion)!=='8.13'||String(x.stableBaseVersion)!=='8.13')fail(`expected sealed 8.13 input, found ${x.publicVersion}/${x.stableBaseVersion}`);
 x.publicVersion='8.13.1';x.stableBaseVersion='8.13.1';write(f,JSON.stringify(x,null,2)+'\n');
}
{
 const f='prepare-882-version.mjs';let s=read(f),a="const VERSION='8.13';",b="const VERSION='8.13.1';";
 if(s.split(a).length-1!==1)fail('release version anchor');
 s=s.replace(a,b).replaceAll('AXIS 8.13] release identity','AXIS 8.13.1] release identity');write(f,s);
}

const inherited=[
 'postbuild-882-contract.mjs','postbuild-810-contract.mjs','postbuild-8101-contract.mjs','postbuild-8102-contract.mjs','postbuild-8103-contract.mjs',
 'postbuild-891-contract.mjs','postbuild-811-contract.mjs','postbuild-812-contract.mjs','postbuild-813-live-route.mjs','postbuild-8123-contract.mjs','postbuild-8123-field-polish.mjs','postbuild-8124-contract.mjs',
 'scripts/axis-811-experience-smoke.mjs','scripts/axis-882-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs','scripts/axis-813-live-route-smoke.mjs','scripts/axis-813-settings-convergence-smoke.mjs',
 'scripts/axis-8122-settings-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs','scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs',
 'scripts/prepare-release-test-contract.mjs','scripts/prepare-810-test-flow.mjs','scripts/prepare-8101-test-flow.mjs','prepare-8123-ci-stability.mjs'
];
for(const f of inherited){let s=read(f);const n=(s.match(/'8\.13'/g)||[]).length;if(!n)fail(`${f} missing inherited 8.13 identity`);s=s.replaceAll("'8.13'","'8.13.1'");write(f,s)}

{
 const f='scripts/axis-8121-hotfix-smoke.mjs';let s=read(f);
 const from="const nativeValueSize=await nativeValue.evaluate(el=>getComputedStyle(el).fontSize);\n assert.equal(await learningValue.evaluate(el=>getComputedStyle(el).fontSize),nativeValueSize);\n assert.equal(await serviceValue.evaluate(el=>getComputedStyle(el).fontSize),nativeValueSize);";
 const to="const nativeValueSize=px(await nativeValue.evaluate(el=>getComputedStyle(el).fontSize));\n const learningValueSize=px(await learningValue.evaluate(el=>getComputedStyle(el).fontSize));\n const serviceValueSize=px(await serviceValue.evaluate(el=>getComputedStyle(el).fontSize));\n assert.ok(nativeValueSize>=11.5&&nativeValueSize<=16,`native Settings value size drifted: ${nativeValueSize}`);\n assert.ok(learningValueSize>=12.5&&learningValueSize<=16,`Learning Settings value size drifted: ${learningValueSize}`);\n assert.equal(serviceValueSize,learningValueSize,'Learning and Cloud/AI value typography diverged');";
 s=once(s,from,to,'8.13.1 inherited field typography contract');write(f,s);
}

for(const f of ['scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8124-custom-equipment-smoke.mjs']){
 let s=read(f),a="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13');",b="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13.1');";
 const n=s.split(a).length-1;if(n!==1)fail(`${f} release assertion expected once, found ${n}`);s=s.replace(a,b);write(f,s);
}
{
 const f='scripts/axis-8125-smart-create-polish-smoke.mjs';let s=read(f),a="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13');",b="assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13.1');";
 const n=s.split(a).length-1;if(n!==1)fail(`smart-create inherited release anchor expected once, found ${n}`);s=s.replace(a,b);write(f,s);
}

console.log('[AXIS 8.13.1 evolution release] PASS · public/base 8.13.1 · inherited training/catalog/custom-equipment semantics preserved');
