import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// AXIS 8.30 — read-only Object identity inventory.
// Run: node scripts/axis-830-object-identity-audit.mjs [--json] [--enforce]
// The inventory never writes application state, migrates historical Encounters,
// modifies build output, or treats a baseId/alias as a canonical fact ID.

const read=path=>fs.readFileSync(path,'utf8');
const librarySource=read('v873-exercise-library.js');
const ctx={window:Object.create(null)};
vm.runInNewContext(librarySource,ctx,{timeout:1500,filename:'v873-exercise-library.js'});
const catalog=Array.from(ctx.window.__AXIS_873_LIBRARY__||[]);
assert.ok(catalog.length>=80,'incomplete builtin catalog');
const identityOf=x=>String(x?.id||'').trim();
const normalized=x=>String(x||'').normalize('NFKC').toLocaleLowerCase('en').replace(/\s+/g,' ').trim();
const byId=new Map(),byName=new Map(),byBase=new Map(),aliases=new Map();
for(const item of catalog){
  assert.match(identityOf(item),/^[a-z][a-z0-9-]*$/,'invalid canonical builtin ID');
  assert.ok(String(item.name||'').trim(),'missing visible Object name');
  assert.ok(!byId.has(item.id),'duplicate canonical builtin ID '+item.id);
  byId.set(item.id,item);
  const name=normalized(item.name);
  const labels=byName.get(name)||[];labels.push(item.id);byName.set(name,labels);
  if(item.baseId){const base=byBase.get(item.baseId)||[];base.push(item.id);byBase.set(item.baseId,base)}
  for(const word of [item.name,...(Array.isArray(item.aliases)?item.aliases:[])]){
    const w=normalized(word);if(!w)continue;const ids=aliases.get(w)||new Set();ids.add(item.id);aliases.set(w,ids);
  }
}
const examples=[['run','treadmill'],['seated-row','chest-row'],['leg-curl','seated-curl'],['leg-curl','lying-curl']];
for(const [a,b]of examples)assert.ok(byId.has(a)&&byId.has(b)&&a!==b,'missing distinct Object identity '+a+' / '+b);
const probes=[
  {id:'legacy-quick-selected-historical-name',file:'prepare-8123-canonical-library-selection.mjs',pattern:/return null;const hist=allEvents\(\)\.find\(x=>x\.name===n\)/},
  {id:'classic-selected-uses-base-id',file:'prepare-8123-canonical-library-selection.mjs',pattern:/lib\.baseId\s*\|\|\s*lib\.id/},
  {id:'library-pick-uses-base-id',file:'prepare-8123-canonical-library-selection.mjs',pattern:/item\.baseId\s*\|\|\s*item\.id/},
  {id:'smart-search-pick-uses-base-id',file:'prepare-8124-settings-catalog-polish.mjs',pattern:/pickId\s*:\s*x\.baseId\s*\|\|\s*x\.id/},
  {id:'resolver-uses-first-base-id-match',file:'prepare-8124-settings-catalog-polish.mjs',pattern:/lib\.find\(e=>e\.baseId===id\)/},
  {id:'legacy-smart-search-uses-base-id',file:'v873-smart-input.js',pattern:/item\.baseId&&search/}
];
const routes=probes.map(x=>({id:x.id,file:x.file,unsafe:x.pattern.test(read(x.file))}));
const duplicateNames=[...byName].filter(([,ids])=>ids.length>1).map(([name,ids])=>({name,ids}));
const sharedBaseIds=[...byBase].filter(([,ids])=>ids.length>1).map(([baseId,ids])=>({baseId,ids}));
const ambiguousAliases=[...aliases].filter(([,ids])=>ids.size>1).map(([alias,ids])=>({alias,ids:[...ids]}));
const result={
  schema:'axis.object-identity-audit.v1',stage:'8.30',mode:process.argv.includes('--enforce')?'enforce':'inventory',
  canonicalObjectCount:catalog.length,baseIdReferences:[...byBase].reduce((n,[,ids])=>n+ids.length,0),
  duplicateCanonicalIdCount:0,duplicateNames,sharedBaseIds,ambiguousAliases,
  unsafeRoutes:routes.filter(x=>x.unsafe),
  nonDestructiveLegacyPolicy:'preserve all historical Encounter equipmentId/name/schemaSnapshot; do not retroactively split ambiguous facts'
};
if(process.argv.includes('--json'))console.log(JSON.stringify(result,null,2));
else {
  console.log('[AXIS 8.30 Object Identity Audit] '+catalog.length+' builtin IDs · '+sharedBaseIds.length+' shared-base families · '+ambiguousAliases.length+' ambiguous search aliases · '+result.unsafeRoutes.length+' unsafe legacy routes');
  for(const x of result.unsafeRoutes)console.log('  RISK '+x.id+' · '+x.file);
  for(const x of sharedBaseIds)console.log('  BASE '+x.baseId+' => '+x.ids.join(', '));
}
if(process.argv.includes('--enforce')){
  assert.equal(duplicateNames.length,0,'distinct native Object names collapsed');
  assert.equal(result.unsafeRoutes.length,0,'unsafe Object identity routes must be removed before release');
  console.log('[AXIS 8.30 Object Identity Contract] PASS · unique canonical identity through selection routes');
}
