import fs from 'node:fs';

const file='prepare-821-object-capability-runtime-safety.mjs';
let s=fs.readFileSync(file,'utf8');
const fail=m=>{throw new Error(`[AXIS 8.21 renderer safety convergence] ${m}`)};
const startToken="const controlSignature='function axis821MetricControl(m,prev)';";
const endToken='/* Final lexical seal.';
const start=s.indexOf(startToken),end=s.indexOf(endToken,start);
if(start<0||end<0||end<=start)fail('runtime-safety recorder block boundary missing');
const old=s.slice(start,end);
if(!old.includes('safePaceBranch')||!old.includes('controlText'))fail('historical runtime-safety renderer mutation missing');
const replacement=`const controlSignature='function axis821MetricControl(m,prev)';\nconst control=functionRange(s,controlSignature,'metric-control-system recorder renderer');\nfor(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES',\"if(kind==='pace'){\",'data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!control.text.includes(token))fail('metric-control-system recorder renderer safety contract missing '+token);\nif(control.text.includes('km$/')||control.text.includes('km$'))fail('metric-control-system recorder renderer contains compiler-unsafe pace token');\n\n`;
s=s.slice(0,start)+replacement+s.slice(end);
const final=s.slice(s.indexOf(startToken),s.indexOf(endToken,s.indexOf(startToken)));
if(final.includes('safePaceBranch')||final.includes('controlText=')||final.includes("s=s.slice(0,control.start)"))fail('runtime-safety still mutates recorder renderer');
fs.writeFileSync(file,s);
console.log('[AXIS 8.21 renderer safety convergence] staged · runtime safety validates unified Metric Control renderer without rewriting it');
