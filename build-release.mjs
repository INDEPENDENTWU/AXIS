import {execFileSync} from 'node:child_process';

const STEPS=[
  'prepare-legacy-runtime.mjs',
  'prepare-product-convergence.mjs',
  'prepare-first-paint-shell.mjs',
  'prepare-88-convergence.mjs',
  'build-hardened.mjs',
  'postbuild-kernel-priority.mjs',
  'postbuild-features-hardened.mjs',
  'postbuild-8712-completion.mjs'
];

for(const step of STEPS){
  console.log(`[AXIS release] ${step}`);
  execFileSync(process.execPath,[step],{stdio:'inherit'});
}

console.log(`[AXIS release] complete · ${STEPS.length} deterministic steps`);
