#!/usr/bin/env node
// CI for the marketplace repo: manifests parse, every listed plugin exists, packs satisfy the slot contract.
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const root = path.resolve(__dirname, '..'); let bad = 0;
const m = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/marketplace.json'), 'utf8'));
for (const p of m.plugins) {
  const dir = path.join(root, p.source); const man = path.join(dir, '.claude-plugin/plugin.json');
  if (!fs.existsSync(man)) { console.error(`FAIL ${p.name}: plugin.json missing`); bad++; continue; }
  const pj = JSON.parse(fs.readFileSync(man, 'utf8'));
  if (pj.version !== p.version) { console.error(`FAIL ${p.name}: version ${pj.version} != marketplace ${p.version}`); bad++; }
  if (fs.existsSync(path.join(dir, 'PACK.yaml'))) {
    try { execSync(`node "${path.join(root, 'plugins/sdd-core/scripts/check-pack-contract.js')}" --pack "${dir}"`, { stdio: 'inherit' }); } catch { bad++; }
  }
  for (const s of fs.existsSync(path.join(dir, 'skills')) ? fs.readdirSync(path.join(dir, 'skills')) : []) {
    const f = path.join(dir, 'skills', s, 'SKILL.md');
    if (!fs.existsSync(f) || !/^---[\s\S]*?name:[\s\S]*?description:[\s\S]*?---/.test(fs.readFileSync(f, 'utf8'))) { console.error(`FAIL ${p.name}/skills/${s}: SKILL.md missing name/description`); bad++; }
  }
  console.log(`checked ${p.name}@${p.version}`);
}
console.log(bad ? `${bad} problem(s)` : 'PASS marketplace valid'); process.exit(bad ? 1 : 0);
