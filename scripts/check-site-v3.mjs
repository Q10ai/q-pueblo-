/** Release gate that can run in Cloudflare/GitHub Actions on Node 22. */
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
execFileSync('python3',['scripts/check-release.py'],{cwd:root,stdio:'inherit'});
console.log('QP_V3_NODE_VALIDATION_PASS');
