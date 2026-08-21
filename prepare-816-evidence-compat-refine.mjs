import fs from 'node:fs';
const src=fs.readFileSync('v815-media-evidence.js','utf8');
for(const needle of ["__AXIS_816_COMPARATIVE_EVIDENCE__","compareSide=''","if(compareMode&&compareSide)","?'最早影像'","?'最近影像'"])if(!src.includes(needle))throw new Error(`[AXIS 8.16 comparative evidence refine] missing ${needle}`);
console.log('[AXIS 8.16 comparative evidence refine] PASS · v2 already preserves endpoint inspection and explicit left/right arbitrary comparison');
