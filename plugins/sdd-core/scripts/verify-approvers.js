#!/usr/bin/env node
// CI: every *.APPROVED.md must have been added by a git author listed in sdd.config.yaml approvers.
const { execSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const { root, readYaml, frontMatter } = require('./lib');
const cfg = readYaml(path.join(root(), 'sdd.config.yaml')) || {};
const allowed = Object.values(cfg.approvers || {}).flat().map(s => String(s).toLowerCase());
const files = execSync('git ls-files "*.APPROVED.md"', { cwd: root() }).toString().trim().split(/\r?\n/).filter(Boolean);
let bad = 0;
for (const f of files) {
  const author = execSync(`git log --diff-filter=A --format=%ae -- "${f}"`, { cwd: root() }).toString().trim().split(/\r?\n/).pop().toLowerCase();
  const fm = frontMatter(path.join(root(), f));
  if (!allowed.includes(author)) { console.error(`FAIL ${f}: added by ${author}, not a listed approver`); bad++; }
  else if (fm.approver && String(fm.approver).toLowerCase() !== author) { console.error(`FAIL ${f}: front matter approver ${fm.approver} differs from commit author ${author}`); bad++; }
  else console.log(`PASS ${f} (${author})`);
}
console.log(bad ? `${bad} approval problem(s)` : `PASS ${files.length} approval file(s) verified`); process.exit(bad ? 1 : 0);
