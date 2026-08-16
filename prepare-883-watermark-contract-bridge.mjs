import fs from 'node:fs';

const FILE='v8710-watermark.js';
const fail=m=>{throw new Error(`[AXIS 8.8.3 watermark bridge] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const swap=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);src=src.replace(from,to)};

/* Keep the established four-switch source contract while retaining the 8.8.3 richer row geometry. */
swap("const body=[];if(p.name)body.push", "const rows=[];if(p.name)rows.push", 'name row contract');
swap("if(p.data&&data)body.push", "if(p.data&&data)rows.push", 'data row contract');
swap("if(p.location&&p.place)body.push", "if(p.location&&p.place)rows.push", 'location row contract');
swap("if(p.time)body.push", "if(p.time)rows.push", 'time row contract');
swap("for(const row of body)", "for(const row of rows)", 'row geometry iterator');

for(const re of [/if\(p\.name\)rows\.push/,/if\(p\.data&&data\)rows\.push/,/if\(p\.location&&p\.place\)rows\.push/,/if\(p\.time\)rows\.push/])if(!re.test(src))fail(`four-switch marker missing · ${re}`);
try{new Function(src)}catch(e){fail(`syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8.3 watermark bridge] PASS · four persisted switches preserved inside refined final-photo layout');
