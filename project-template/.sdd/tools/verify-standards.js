#!/usr/bin/env node
// Verifies .claude/rules/enterprise/* match CHECKSUMS.sha256 (tamper check). Exit 1 on mismatch.
const fs = require('fs'); const path = require('path');
const { root, sha256 } = require('./lib');
const dir = path.join(root(), '.claude', 'rules', 'enterprise');
const sumFile = path.join(dir, 'CHECKSUMS.sha256');
if (process.argv.includes('--write')) {
  const out = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => `${sha256(path.join(dir, f))}  ${f}`).join('\n') + '\n';
  fs.writeFileSync(sumFile, out); console.log('CHECKSUMS.sha256 written'); process.exit(0);
}
if (!fs.existsSync(sumFile)) { console.error('FAIL enterprise standards checksum file missing'); process.exit(1); }
let bad = 0;
for (const line of fs.readFileSync(sumFile, 'utf8').trim().split(/\r?\n/)) {
  const [h, f] = line.split(/\s+/); const fp = path.join(dir, f);
  if (!fs.existsSync(fp)) { console.error(`FAIL missing ${f}`); bad++; }
  else if (sha256(fp) !== h) { console.error(`FAIL modified ${f}`); bad++; }
}
console.log(bad ? `${bad} enterprise standard file(s) altered` : 'PASS enterprise standards intact'); process.exit(bad ? 1 : 0);
