import fs from 'node:fs';

const VERSION='8.8.2';
const fail=m=>{throw new Error(`AXIS 8.8.2 version convergence: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

{
  const f='prepare-first-paint-shell.mjs';let s=read(f);
  s=once(s,"const PUBLIC='8.8';",`const PUBLIC='${VERSION}';`,'first-paint public version');
  write(f,s);
}
{
  const f='prepare-88-convergence.mjs';let s=read(f);
  s=once(s,"const PUBLIC='8.8';",`const PUBLIC='${VERSION}';`,'8.8 convergence public version');
  write(f,s);
}
{
  const f='postbuild-88-canonical.mjs';let s=read(f);
  s=once(s,"const VERSION='8.8';",`const VERSION='${VERSION}';`,'canonical public version');
  s=once(s,"document.documentElement.dataset.axisCanonical='8.8';","document.documentElement.dataset.axisCanonical='${VERSION}';",'canonical dataset version');
  s=s.replace('canonical-8.8">',`canonical-${VERSION}">`);
  write(f,s);
}

for(const f of ['scripts/axis-smoke.mjs','scripts/axis-88-smoke.mjs','scripts/axis-first-paint-smoke.mjs','scripts/axis-webkit-smoke.mjs','scripts/axis-completion-smoke.mjs']){
  let s=read(f);
  s=s.replaceAll('版本 8.8',`版本 ${VERSION}`).replaceAll("'8.8'",`'${VERSION}'`).replaceAll('canonical-8.8',`canonical-${VERSION}`);
  write(f,s);
}

console.log(`[AXIS 8.8.2] release identity converged · ${VERSION}`);