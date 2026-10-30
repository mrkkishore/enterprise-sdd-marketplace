#!/usr/bin/env node
// Deterministic gate validator. Usage:
//   node validate-gates.js --slice SLICE-003 --gate SPEC_READY
//   node validate-gates.js --all        (CI / pre-commit: every slice, every gate it claims to have passed)
//   node validate-gates.js --report     (summary table, never fails)
const fs = require('fs'); const path = require('path');
const { root, readYaml, frontMatter, sha256, findSliceDir } = require('./lib');

const ORDER = ['DISCOVER','DISCOVERY_READY','SPECIFY','SPEC_READY','DESIGN','ARCHITECTURE_READY','TEST_DESIGN',
  'IMPLEMENT','IMPLEMENTATION_READY','VERIFY','RELEASE_READY','HUMAN_APPROVAL','DEPLOY','OBSERVE','CUTOVER','DECOMMISSION','DONE'];
const L = ['lite','standard','regulated'], S = ['standard','regulated'], R = ['regulated'];
// [gate, check id, evidence file or special check, profiles, brownfield only?, artifact reviewed]
const RULES = [
  ['DISCOVERY_READY','discovery-review','evidence/discovery-review.md',L,false,'01-discovery.md'],
  ['DISCOVERY_READY','no-blockers','@blockers',L],
  ['SPEC_READY','spec-review','evidence/spec-review.md',L,false,'02-spec.md'],
  ['SPEC_READY','traceability','@trace',L],
  ['SPEC_READY','change-approvals','@changes',L],
  ['SPEC_READY','no-blockers','@blockers',L],
  ['ARCHITECTURE_READY','architecture-review','evidence/architecture-review.md',S,false,'03-design.md'],
  ['ARCHITECTURE_READY','threat-model','@threat',S],
  ['IMPLEMENTATION_READY','code-review','evidence/code-review.md',L],
  ['IMPLEMENTATION_READY','independent-review','evidence/independent-review.md',R],
  ['IMPLEMENTATION_READY','test-results','evidence/test-results.md',L],
  ['IMPLEMENTATION_READY','security-scan','evidence/security-scan.md',L],
  ['RELEASE_READY','functional-parity','evidence/functional-parity.md',S,true],
  ['RELEASE_READY','data-parity','evidence/data-parity.md',R,true],
  ['RELEASE_READY','performance','evidence/performance.md',S],
  ['RELEASE_READY','deployment-readiness','evidence/deployment-readiness.md',S],
  ['HUMAN_APPROVAL','release-approval','approvals/release-readiness.APPROVED.md',L],
  ['CUTOVER','cutover-approval','approvals/cutover.APPROVED.md',S],
  ['DECOMMISSION','decommission-approval','approvals/decommission.APPROVED.md',S],
];

const args = process.argv.slice(2); const arg = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const cfg = readYaml(path.join(root(), 'sdd.config.yaml'));
if (!cfg) { console.error('FAIL sdd.config.yaml not found'); process.exit(1); }
const profile = (cfg.gates && cfg.gates.profile) || 'standard';
const brownfield = (cfg.project || {}).mode === 'brownfield';
const approvers = cfg.approvers || {};

function blockers(sliceId) {
  const f = path.join(root(), 'docs', 'registers', 'OPEN-QUESTIONS.md');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l.includes('BLOCKER') && l.includes(sliceId) && !/\|\s*(CLOSED|ANSWERED)\s*\|/i.test(l));
}

function check(dir, id, rule) {
  const [gate, name, target, profiles, bfOnly, artifact] = rule;
  if (!profiles.includes(profile) || (bfOnly && !brownfield)) return null;
  const fail = msg => ({ gate, name, ok: false, msg }); const pass = msg => ({ gate, name, ok: true, msg });
  if (target === '@blockers') { const b = blockers(id); return b.length ? fail(`${b.length} open BLOCKER question(s)`) : pass('no open blockers'); }
  if (target === '@trace' || target === '@changes' || target === '@threat') {
    const specF = path.join(dir, '02-spec.md'), desF = path.join(dir, '03-design.md');
    if (target === '@threat') { if (!fs.existsSync(desF)) return fail('03-design.md missing'); return /threat model|STRIDE/i.test(fs.readFileSync(desF,'utf8')) ? pass('threat model present') : fail('no threat model section in 03-design.md'); }
    if (!fs.existsSync(specF)) return fail('02-spec.md missing');
    const spec = fs.readFileSync(specF, 'utf8');
    if (target === '@trace') {
      const reqs = [...new Set(spec.match(/REQ-[A-Z0-9]+-\d{3}/g) || [])];
      if (!reqs.length) return fail('no REQ-<slice>-NNN identifiers in spec');
      const noAc = reqs.filter(r => !new RegExp(`${r}[\\s\\S]{0,4000}?AC-`).test(spec));
      return noAc.length ? fail(`requirements without acceptance criteria: ${noAc.join(', ')}`) : pass(`${reqs.length} requirements traced to acceptance criteria`);
    }
    const changes = (spec.match(/^\s*-\s*Type:\s*CHANGE\s*$/gm) || []).length;
    if (!changes) return pass('no behavior changes declared');
    const ap = path.join(dir, 'approvals', 'behavior-change.APPROVED.md');
    return fs.existsSync(ap) ? pass('behavior change approved') : fail(`${changes} CHANGE item(s) need approvals/behavior-change.APPROVED.md`);
  }
  const f = path.join(dir, target);
  if (!fs.existsSync(f)) return fail(`${target} missing`);
  const fm = frontMatter(f);
  if (target.includes('.APPROVED.')) {
    if (!fm.approver || !fm.date) return fail(`${target} needs approver and date in front matter`);
    const allowed = Object.values(approvers).flat().map(String);
    if (allowed.length && !allowed.some(a => String(fm.approver).includes(a) || a.includes(String(fm.approver)))) return fail(`approver "${fm.approver}" not listed in sdd.config.yaml approvers`);
    return pass(`approved by ${fm.approver}`);
  }
  if (fm.slice && fm.slice !== id) return fail(`${target} belongs to ${fm.slice}, not ${id} (AP-12)`);
  if (String(fm.result).toUpperCase() !== 'PASS') return fail(`${target} result is ${fm.result || 'missing'}`);
  if (fm.produced_by && /writer|implementer|analyst|architect$|designer/.test(fm.produced_by) && !/checker|reviewer|verifier/.test(fm.produced_by))
    return fail(`${target} produced by doer ${fm.produced_by}; evidence must come from a checker (C4)`);
  if (artifact && fm.artifact_sha256) {
    const af = path.join(dir, artifact);
    if (fs.existsSync(af) && sha256(af) !== fm.artifact_sha256) return fail(`${artifact} changed after review; re-run the checker`);
  }
  return pass(`${target} PASS`);
}

function run(id, gate) {
  const dir = findSliceDir(id); if (!dir) return [{ gate, name: 'slice', ok: false, msg: `slice ${id} not found` }];
  return RULES.filter(r => r[0] === gate).map(r => check(dir, id, r)).filter(Boolean);
}

function slices() {
  const base = path.join(root(), 'specs', 'slices'); if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter(n => /^SLICE-\d+/.test(n)).map(n => {
    const st = readYaml(path.join(base, n, 'status.yaml')) || {};
    return { id: n.match(/^SLICE-\d+/)[0], state: st.state || 'DISCOVER' };
  });
}

let failed = 0;
const print = (id, res) => res.forEach(r => { console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${id}  ${r.gate.padEnd(21)} ${r.name.padEnd(22)} ${r.msg}`); if (!r.ok) failed++; });

if (args.includes('--all') || args.includes('--report')) {
  for (const s of slices()) {
    const reached = ORDER.indexOf(s.state);
    const gates = [...new Set(RULES.map(r => r[0]))].filter(g => ORDER.indexOf(g) <= reached);
    gates.forEach(g => print(s.id, run(s.id, g)));
    if (args.includes('--report')) console.log(`----  ${s.id}  state=${s.state}`);
  }
  if (args.includes('--report')) process.exit(0);
} else {
  const id = arg('--slice'), gate = arg('--gate');
  if (!id || !gate) { console.error('usage: --slice <ID> --gate <GATE> | --all | --report'); process.exit(1); }
  print(id, run(id, gate));
}
console.log(failed ? `\n${failed} check(s) failed (profile: ${profile})` : `\nAll checks passed (profile: ${profile})`);
process.exit(failed ? 1 : 0);
