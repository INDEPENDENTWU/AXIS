import fs from 'node:fs';
import assert from 'node:assert/strict';

const src=fs.readFileSync('axis-core.js','utf8');
const needles=['scanBtn','scanPrimary'];
const snippets=[];
for(const needle of needles){
  let at=-1;
  while((at=src.indexOf(needle,at+1))>=0){
    const from=Math.max(0,at-420),to=Math.min(src.length,at+760);
    const s=src.slice(from,to);
    if(/onclick\s*=|\.onclick/.test(s))snippets.push({needle,at,text:s.replace(/\s+/g,' ').slice(0,1180)});
  }
}
const unique=[];for(const x of snippets)if(!unique.some(y=>y.text===x.text))unique.push(x);
console.log('[AXIS static owner audit] scan click contexts',JSON.stringify(unique,null,2));
const canonical=unique.filter(x=>x.text.includes('__AXIS_CAPTURE_PREF__')&&x.text.includes("openSheet('scanSheet')"));
assert.equal(canonical.length,1,`expected one canonical scan owner context, got ${canonical.length}`);
const suspicious=unique.filter(x=>/scanBtn[^]{0,300}onclick\s*=|onclick\s*=[^]{0,300}scanBtn/.test(x.text)&&!canonical.includes(x));
assert.equal(suspicious.length,0,`competing scan click owner contexts: ${JSON.stringify(suspicious)}`);
console.log('[AXIS static owner audit] PASS · one canonical capture owner context');
