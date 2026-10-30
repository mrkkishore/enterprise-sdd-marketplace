#!/usr/bin/env node
// Checks that every slot required by the project mode is mapped in sdd.config.yaml,
// or (with --pack <dir>) that a pack provides a SKILL.md for each slot it declares.
const fs = require('fs'); const path = require('path');
const { root, readYaml } = require('./lib');
const REQUIRED = {
  target: ['stack-coding-standards','stack-project-setup','stack-api-patterns','stack-data-access','stack-testing',
           'stack-security-integration','stack-observability','stack-deployment'],
  source: ['legacy-analysis','legacy-to-target-mapping','semantic-parity'],
  domain: ['domain-knowledge']
};
const i = process.argv.indexOf('--pack');
if (i > 0) {
  const dir = path.resolve(process.argv[i + 1]); const pack = readYaml(path.join(dir, 'PACK.yaml'));
  if (!pack) { console.error('FAIL PACK.yaml missing'); process.exit(1); }
  const slots = Object.keys(pack.provides || {}); let bad = 0;
  for (const s of REQUIRED[pack.type] || []) if (!slots.includes(s)) { console.error(`FAIL ${pack.type} pack must provide slot ${s}`); bad++; }
  for (const [slot, skill] of Object.entries(pack.provides || {}))
    if (!fs.existsSync(path.join(dir, 'skills', skill, 'SKILL.md'))) { console.error(`FAIL slot ${slot}: skills/${skill}/SKILL.md missing`); bad++; }
  console.log(bad ? `${bad} contract problem(s)` : `PASS pack ${pack.name} (${pack.type}) satisfies the slot contract`); process.exit(bad ? 1 : 0);
}
const cfg = readYaml(path.join(root(), 'sdd.config.yaml'));
if (!cfg) { console.error('FAIL sdd.config.yaml missing'); process.exit(1); }
const need = [...REQUIRED.target, ...(cfg.project && cfg.project.mode === 'brownfield' ? REQUIRED.source : [])];
const slots = cfg.slots || {}; const missing = need.filter(s => !slots[s]);
missing.forEach(s => console.error(`MISSING slot ${s} (map it in sdd.config.yaml > slots, or install a pack that provides it)`));
console.log(missing.length ? `${missing.length} slot(s) unmapped` : 'PASS all required slots mapped'); process.exit(missing.length ? 1 : 0);
