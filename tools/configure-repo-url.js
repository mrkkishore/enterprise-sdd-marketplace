#!/usr/bin/env node
// Replace the placeholder marketplace URL with your real git URL in every file that references it.
// Usage (Command Prompt):  node tools\configure-repo-url.js https://github.com/<org>/enterprise-sdd-marketplace.git
const fs = require('fs'); const path = require('path');
const NEW = process.argv[2]; const OLD = 'https://git.example.com/ai-coe/enterprise-sdd-marketplace.git';
if (!NEW || !/^https?:\/\/|^git@/.test(NEW)) { console.error('usage: node tools\\configure-repo-url.js <git-url>'); process.exit(1); }
let n = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(json|ya?ml|md|js)$/.test(e.name) && e.name !== 'configure-repo-url.js') {
      const t = fs.readFileSync(p, 'utf8'); if (t.includes(OLD)) { fs.writeFileSync(p, t.split(OLD).join(NEW)); console.log('updated', path.relative(process.cwd(), p)); n++; }
    }
  }
})(path.resolve(__dirname, '..'));
console.log(`${n} file(s) updated`);
