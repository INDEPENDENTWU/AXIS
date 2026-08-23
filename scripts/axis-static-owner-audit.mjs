import fs from 'node:fs';
import assert from 'node:assert/strict';

const src=fs.readFileSync('axis-core.js','utf8');
const needles=['scanBtn','scanPrimary'];
const snippets=[];
for(const needle of needles){
  let at=-1;
  while((at=src.indexOf(needle,at+1))>=0){
    const from=Math.max(0,at-420),to=Math.min(src.length,at+900);
    const s=src.slice(from,to);
    if(/onclick\s*=|\.onclick/.test(s))snippets.push({needle,at,text:s.replace(/\s+/g,' ').slice(0,1320)});
  }
}
const unique=[];for(const x of snippets)if(!unique.some(y=>y.text===x.text))unique.push(x);
console.log('[AXIS static owner audit] scan click contexts',JSON.stringify(unique,null,2));

const ownerCount=(src.match(/function openCanonicalCamera\(/g)||[]).length;
assert.equal(ownerCount,1,`expected exactly one openCanonicalCamera lifecycle owner, got ${ownerCount}`);
assert.equal((src.match(/function beginQuickMedia\(mode,id\)\{return openCanonicalCamera\(mode,id,true\)\}/g)||[]).length,1,'Quick Record media is not delegated to the canonical camera owner');

/* app.js retains the baseline DOM0 handoff, then the compiled 8.16 presentation
   entry deterministically supersedes that one property with the current preferred
   Capture mode. Both delegate to the same lifecycle owner; neither owns camera,
   recorder, persistence or network work. */
const baseline=unique.filter(x=>x.text.includes("$('#scanBtn').onclick=()=>openCanonicalCamera('photo',null,false)"));
assert.equal(baseline.length,1,`expected one baseline app Capture delegation, got ${baseline.length}`);
const finalEntry=unique.filter(x=>x.text.includes("dataset.axisCaptureEntryOwner='v816-capture-entry-seal'")&&x.text.includes('openCanonicalCamera(preferred(),null,false)'));
assert.equal(finalEntry.length,1,`expected one final v816 Capture entry delegation, got ${finalEntry.length}`);
assert.equal((src.match(/axisCaptureEntryOwner='v816-capture-entry-seal'/g)||[]).length,1,'final Capture entry owner marker is not singular');
assert.equal((src.match(/function open\(\)\{const c=window\.__AXIS_CAPTURE__/g)||[]).length,1,'final Capture entry wrapper is not singular');

assert.equal((src.match(/startCamera\(\)/g)||[]).length>=1,true,'camera lifecycle implementation missing');
for(const x of unique){
  if(x.text.includes('scanBtn')||x.text.includes('scanPrimary'))assert.equal(/startCamera\(\)/.test(x.text),false,`Capture entry owns camera lifecycle inline: ${x.text}`);
}
assert.equal(/scanBtn[^]{0,420}startCamera\(\)/.test(src),false,'main Capture entry still owns camera lifecycle inline');
console.log('[AXIS static owner audit] PASS · one camera lifecycle owner · baseline + final presentation entry delegate deterministically · Quick Record delegates · no entry owns camera lifecycle');
