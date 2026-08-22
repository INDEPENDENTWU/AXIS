import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-817-interaction-convergence.mjs',TMP='.axis-817-interaction.generated.mjs';
let src=fs.readFileSync(SOURCE,'utf8');
const old=`s=once(s,"if(state.prefs.keepClip&&state.clip?.blob)","if(state.clip?.blob)",'explicit video always retained');`;
const next=`s=once(s,"if((state.prefs.keepClip||state.forceClip)&&state.clip?.blob)","if(state.clip?.blob)",'explicit video always retained');`;
const n=src.split(old).length-1;if(n!==1)throw new Error(`[AXIS 8.17 interaction driver] clip persistence precondition expected once, found ${n}`);
src=src.replace(old,next);
fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}
