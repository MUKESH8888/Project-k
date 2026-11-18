import {spawnSync} from 'node:child_process';
console.log('Running the isolated browser/API suite. No demo credentials or live customer data are used.');
const result=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test'],{stdio:'inherit',env:process.env});
process.exit(result.status||0);
