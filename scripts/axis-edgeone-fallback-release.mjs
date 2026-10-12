import fs from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';

const fail=(message)=>{throw new Error('[AXIS EdgeOne fallback] '+message)};
const json=(file)=>JSON.parse(fs.readFileSync(file,'utf8'));
const cli=(command,args)=>execFileSync(command,args,{encoding:'utf8',timeout:20000}).trim();
const exact=String(process.env.AXIS_RELEASE_SHA||'').trim();
const confirm=String(process.env.AXIS_EDGEONE_CONFIRM_SHA||'').trim();
const action=process.argv[2]||'--check';
if(!['--check','--publish'].includes(action))fail('Use --check or --publish');
if(!/^[0-9a-f]{40}$/i.test(exact))fail('AXIS_RELEASE_SHA must be exact 40-character main SHA');
const head=cli('git',['rev-parse','HEAD']);
if(head!==exact)fail('local source HEAD differs from release SHA');
const localBranch=cli('git',['branch','--show-current']);
if(localBranch!=='main'&&!(process.env.GITHUB_REF==='refs/heads/main'&&process.env.GITHUB_SHA===exact))fail('release is not checked out on the main branch');
const remote=cli('git',['ls-remote','origin','refs/heads/main']).split(/\s+/)[0];
if(remote!==exact)fail('remote main is not the exact candidate; merge and re-certify first');

const decision=json('governance/version-decision.json'),version=String(decision.release||'');
if(!/^\d+\.\d+(?:\.\d+)?$/.test(version))fail('invalid Version Authority');
const admissionPath=String(process.env.AXIS_EDGEONE_ADMISSION_FILE||'').trim();
if(!admissionPath)fail('AXIS_EDGEONE_ADMISSION_FILE is required: signed-off exact merged-main acceptance evidence must be provided outside the git tree');
if(!fs.existsSync(admissionPath))fail('no independent release admission for '+version+'; retain previous Production');
const admission=json(admissionPath);
if(admission.schema!=='axis.release-admission.v1'||admission.version!==version||admission.sourceCommit!==exact||admission.approved!==true)fail('release admission does not certify this exact SHA');
for(const key of ['exactHeadGate','chromium','pinnedWebKit','visual','accessibility','offlineEncounter','performance','mainMerged']){
 if(admission.gates?.[key]!==true)fail('admission gate not certified: '+key);
}
for(let i=1;i<=20;i++){
 const caseId='P'+String(i).padStart(2,'0');
 if(admission.acceptance?.[caseId]!=='pass')fail('P01–P20 acceptance not sealed: '+caseId);
}
const manifest=json('axis-build.json');
if(manifest.version!==version||manifest.baseVersion!==version||manifest.sourceCommit!==exact)fail('prebuilt release manifest is not stamped with the exact accepted version and commit');
const prebuilt=spawnSync(process.execPath,['scripts/edgeone-prebuilt-verify.mjs'],{encoding:'utf8',env:{...process.env,AXIS_RELEASE_SHA:exact,GITHUB_SHA:exact}});
if(prebuilt.status!==0)fail('EdgeOne prebuilt contract failed: '+(prebuilt.stderr||'').slice(0,600));
console.log('[AXIS EdgeOne fallback] ACCEPTED · exact remote main '+exact+' · '+version+' · P01–P20 · pinned WebKit · approved admission · '+action);
if(action==='--check')process.exit(0);
if(confirm!==exact)fail('AXIS_EDGEONE_CONFIRM_SHA must explicitly match admitted commit');
const token=String(process.env.EDGEONE_API_TOKEN||'');
if(!token)fail('EDGEONE_API_TOKEN unavailable in executing environment; do not paste it into chat or source');
const project='axisfitness-mirror';
const deployment=spawnSync('edgeone',['pages','deploy','.','-n',project,'-e','production','-t',token],{encoding:'utf8',timeout:900000,env:process.env,maxBuffer:8*1024*1024});
const scrub=(s)=>String(s||'').split(token).join('[REDACTED]').replace(/eo_token=[^\s\u001b]+/g,'eo_token=[REDACTED]');
const stderr=scrub(deployment.stderr);
const rawLog='/tmp/axis-edgeone-deploy.log';
const rawText=String(deployment.stdout||'')+'\n'+String(deployment.stderr||'');
fs.writeFileSync(rawLog,rawText,{mode:0o600});
process.on('exit',()=>{
 try{fs.writeFileSync('/tmp/axis-edgeone-deploy-redacted.log',scrub(fs.readFileSync(rawLog,'utf8')),{mode:0o600});fs.unlinkSync(rawLog)}catch{}
});
if(deployment.status!==0)fail('EdgeOne CLI Production deployment rejected: '+stderr.slice(0,700));
const env={...process.env,AXIS_EDGEONE_STANDALONE:'1',AXIS_RELEASE_SHA:exact};
const verify=spawnSync(process.execPath,['scripts/edgeone-live-verify.mjs'],{encoding:'utf8',env,timeout:420000,maxBuffer:8*1024*1024});
if(verify.status!==0)fail('EdgeOne deployment exists but independent runtime and API verification failed: '+String(verify.stderr).slice(0,1000));
console.log(verify.stdout.trim());
const custom=spawnSync(process.execPath,['scripts/edgeone-custom-domain-verify.mjs'],{encoding:'utf8',env:{...env,EDGEONE_CUSTOM_DOMAIN_URL:process.env.AXIS_OFFICIAL_DOMAIN_URL||'https://axis.juele.fun'},timeout:360000,maxBuffer:8*1024*1024});
if(custom.status!==0)fail('EdgeOne mirror deployed but official domain NOT certified; complete alias/DNS verification: '+String(custom.stderr).slice(0,1000));
console.log(custom.stdout.trim());
console.log('[AXIS EdgeOne fallback] COMPLETE · exact main '+exact+' · EdgeOne runtime/API and official domain independently certified');
