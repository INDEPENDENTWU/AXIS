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

/* v876's automatic reminder poller is deliberately retired by the established
 * 8.8.2 owner seal; v8710 is the sole automatic sound owner. The new 8.17.1
 * preparer attempted to add a near-target cue back into that retired v876 path,
 * which can never match the final runtime and would reintroduce split ownership.
 * Keep the owner seal rather than reviving a historical audio loop. */
{
 const a=src.indexOf('/* Sonic grammar:');
 const b=src.indexOf("console.log('[AXIS 8.17.1]",a);
 if(a<0||b<0)fail(`Sonic compatibility block missing ${a}/${b}`);
 src=src.slice(0,a)+"/* AXIS 8.17.1: adaptive cue deferred; v8710 remains the sole automatic sound owner. */\n"+src.slice(b);
 src=src.replace(' · adaptive target cue\');',' · v8710 sound owner preserved\');');
}

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

/* 8.17 made Scan sampling app-owned again and 8.17.1 adds a delegated writer so
 * Settings DOM replacement cannot detach the 3/5-second preference. The historical
 * 8.8 postbuild expected the old direct onclick writer to exist exactly once before
 * retiring it. At the final 8.17.1 boundary that direct writer may already be absent;
 * what must be exact is the delegated app-owned writer. Patch the release-local
 * canonical check accordingly: reject duplicate legacy writers, retire one if still
 * present, and require one current delegated persistence event marker. */
{
 const FILE='postbuild-88-canonical.mjs';let p=fs.readFileSync(FILE,'utf8');
 const old=`const legacyScanClick=";$$('#scanSeconds button').forEach(b=>b.onclick=()=>{state.prefs.scanSeconds=Number(b.dataset.sec);save();renderSettings()})";\nif(core.split(legacyScanClick).length-1!==1)fail('legacy scan preference click writer expected once');\ncore=core.replace(legacyScanClick,'');`;
 const next=`const legacyScanClick=";$$('#scanSeconds button').forEach(b=>b.onclick=()=>{state.prefs.scanSeconds=Number(b.dataset.sec);save();renderSettings()})";\nconst legacyScanClickCount=core.split(legacyScanClick).length-1;if(legacyScanClickCount>1)fail(\`legacy scan preference click writer duplicated ${'${legacyScanClickCount}'} times\`);if(legacyScanClickCount===1)core=core.replace(legacyScanClick,'');\nconst delegatedScanWriter='axis:recording-pref-changed',delegatedScanWriterCount=core.split(delegatedScanWriter).length-1;if(delegatedScanWriterCount!==1)fail(\`8.17.1 delegated scan preference writer expected once, found ${'${delegatedScanWriterCount}'}\`);`;
 const n=p.split(old).length-1;if(n!==1)fail(`postbuild legacy Scan writer block expected once, found ${n}`);
 p=p.replace(old,next);fs.writeFileSync(FILE,p);
}

console.log('[AXIS 8.17.1 active-truth driver] PASS · final 8.16 frame producers accepted · S/SV persistence authoritative · delegated Scan preference owner sealed · v8710 sound ownership preserved');
