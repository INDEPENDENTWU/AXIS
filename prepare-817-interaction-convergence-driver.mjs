import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-817-interaction-convergence.mjs',TMP='.axis-817-interaction.generated.mjs';
let src=fs.readFileSync(SOURCE,'utf8');
const old=`s=once(s,"if(state.prefs.keepClip&&state.clip?.blob)","if(state.clip?.blob)",'explicit video always retained');`;
const next=`s=once(s,"if((state.prefs.keepClip||state.forceClip)&&state.clip?.blob)","if(state.clip?.blob)",'explicit video always retained');`;
const n=src.split(old).length-1;if(n!==1)throw new Error(`[AXIS 8.17 interaction driver] clip persistence precondition expected once, found ${n}`);
src=src.replace(old,next);

/* 8.17 makes Photo the deliberate normal Capture entry. The historical 8.8
   postbuild contract used to rewrite that entry back to the persisted Scan mode.
   Patch the already-converged postbuild source during this release only: accept
   either the inherited delegated form or the 8.17 photo form, and normalize the
   inherited form to Photo without changing the one canonical camera owner. */
src+=String.raw`
{
 const FILE='postbuild-88-canonical.mjs';let p=read(FILE);
 p=once(p,
  "if(core.split(delegatedScanOpen).length-1!==1)fail('canonical camera delegation signature missing');",
  "const photoScanOpen=\"$('#scanBtn').onclick=()=>openCanonicalCamera('photo',null,false);\";const delegatedScanOpenCount=core.split(delegatedScanOpen).length-1,photoScanOpenCount=core.split(photoScanOpen).length-1;if(delegatedScanOpenCount+photoScanOpenCount!==1)fail('canonical camera delegation/photo signature missing');",
  '8.17 canonical capture signature allowance'
 );
 p=once(p,
  "core=core.replace(delegatedScanOpen,()=>canonicalScanOpen);",
  "if(delegatedScanOpenCount===1)core=core.replace(delegatedScanOpen,()=>photoScanOpen);",
  '8.17 canonical Capture photo normalization'
 );
 write(FILE,p);
}
`;

fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}
