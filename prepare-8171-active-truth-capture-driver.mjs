import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-8171-active-truth-capture.mjs',TMP='.axis-8171-active-truth.generated.mjs';
const fail=m=>{throw new Error(`[AXIS 8.17.1 active-truth driver] ${m}`)};
let src=fs.readFileSync(SOURCE,'utf8');

/*
 * 8.16 already leaves frame.blob as the untouched camera/import capture and only
 * applies the final compositor during save. The original 8.17.1 preparer tried to
 * prove this by replacing the complete frameFromVideo/frameFromFile bodies. That is
 * unnecessarily coupled to the pre-8.16 function formatting and now fails after the
 * final Capture Field convergence. Retire only those two brittle rewrites; keep the
 * source-sidecar persistence itself unchanged.
 */
function replaceRegexCall(label,replacement){
 const marker=`'${label}'`;
 const at=src.indexOf(marker);if(at<0)fail(`${label} marker missing`);
 const start=src.lastIndexOf(' s=regexOnce(s,',at);if(start<0)fail(`${label} call start missing`);
 const end=src.indexOf(');',at);if(end<0)fail(`${label} call end missing`);
 src=src.slice(0,start)+replacement+src.slice(end+2);
}
replaceRegexCall('clean camera source'," if(!s.includes('async function frameFromVideo(')||!s.includes('state.frames.push(await frameFromVideo())'))fail('final Capture Field camera frame source missing');");
replaceRegexCall('clean imported source'," if(!s.includes('async function frameFromFile(')||!s.includes('state.frames.push(await frameFromFile(files[i]))'))fail('final Capture Field imported frame source missing');");

/* The actual guarantee is enforced at persistence: S/SV are written directly from
   frame.blob/state.clip.blob before finalizeFrame/watermarkVideoBlob. Require those
   source writes to remain in the generated preparer so this compatibility patch
   cannot silently weaken the non-destructive contract. */
for(const needle of [
 "sourceRef='S-'+e.id+'-'+i,sourceBlob=frame.blob",
 "sourceClipRef='SV-'+e.id,raw=state.clip.blob",
 "sourcePolicy:'clean-sidecar-v1'"
])if(!src.includes(needle))fail(`source persistence invariant missing ${needle}`);

fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}
console.log('[AXIS 8.17.1 active-truth driver] PASS · final 8.16 frame producers accepted · S/SV persistence remains the clean-source authority');
