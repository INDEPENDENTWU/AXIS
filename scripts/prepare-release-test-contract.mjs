import fs from 'node:fs';

const contract=JSON.parse(fs.readFileSync('release-contract.json','utf8'));
const version=String(contract.publicVersion||'').trim();
if(!/^\d+(?:\.\d+)+$/.test(version))throw new Error(`invalid publicVersion: ${version}`);

const files=[
  'scripts/axis-smoke.mjs',
  'scripts/axis-completion-smoke.mjs',
  'scripts/axis-88-smoke.mjs',
  'scripts/axis-first-paint-smoke.mjs',
  'scripts/axis-webkit-smoke.mjs',
  'scripts/axis-881-smoke.mjs'
];

for(const file of files){
  if(!fs.existsSync(file))continue;
  let src=fs.readFileSync(file,'utf8');
  const before=src;
  src=src.replace(/canonical-\d+(?:\.\d+)+/g,`canonical-${version}`);
  src=src.replace(/版本 \d+(?:\.\d+)+/g,`版本 ${version}`);
  src=src.replace(/(canonical\?\.version\s*,\s*)['"]\d+(?:\.\d+)+['"]/g,`$1'${version}'`);
  if(src!==before)fs.writeFileSync(file,src);
}

console.log(`[AXIS test contract] browser assertions aligned to ${version}`);
