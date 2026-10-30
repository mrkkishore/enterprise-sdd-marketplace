#!/usr/bin/env node
// SessionStart hook: stdout is added to Claude's context.
const fs = require('fs'); const path = require('path');
const { root, readYaml, activeSlice } = require('./lib');
const cfg = readYaml(path.join(root(), 'sdd.config.yaml'));
if (!cfg) { console.log('SDD: no sdd.config.yaml found. Run /sdd-core:sdd-init to set up this repository.'); process.exit(0); }
const p = cfg.project || {};
const s = activeSlice();
console.log(`SDD project ${p.id || '?'} | mode ${p.mode || '?'} | gate profile ${(cfg.gates || {}).profile || 'standard'}`);
console.log(s ? `Active slice ${s.id} | state ${s.status.state} | scope ${(s.status.scope || []).join(', ') || 'not set'}`
              : 'No active slice. Use /sdd-core:sdd-new-slice or write the slice ID to .sdd/active-slice.');
console.log('Rules: enterprise rules in .claude/rules/enterprise are binding. AI never commits, approves, or reads secrets.');
