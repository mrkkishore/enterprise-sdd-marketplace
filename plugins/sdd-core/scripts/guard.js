#!/usr/bin/env node
// PreToolUse guardrail hook. Exit 2 = block the tool call; stderr is shown to Claude.
const path = require('path');
const { root, norm, activeSlice } = require('./lib');

const ORDER = ['DISCOVER','DISCOVERY_READY','SPECIFY','SPEC_READY','DESIGN','ARCHITECTURE_READY','TEST_DESIGN',
  'IMPLEMENT','IMPLEMENTATION_READY','VERIFY','RELEASE_READY','HUMAN_APPROVAL','DEPLOY','OBSERVE','CUTOVER','DECOMMISSION','DONE'];

const SECRET_FILES = [/(^|\/)\.env(\.|$)/i, /\.(pem|key|pfx|p12|jks|keystore|tfvars)$/i, /(^|\/)id_(rsa|ed25519|ecdsa)/i,
  /(^|\/)credentials(\.|$)/i, /(^|\/)\.npmrc$/i, /(^|\/)\.pypirc$/i, /(^|\/)boot\.properties$/i, /(^|\/)[^/]*secrets?\.(json|ya?ml|properties|txt|env|xml)$/i];
const SECRET_EXAMPLE_OK = /\.example$|\.sample$|\.template$|SECRETS\.md$|secrets-management|\.gitleaks\.toml$/i;
const SECRET_CONTENT = [/AKIA[0-9A-Z]{16}/, /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, /xox[baprs]-[0-9A-Za-z-]{10,}/,
  /gh[pousr]_[A-Za-z0-9]{36,}/, /(password|passwd|pwd|secret|api[_-]?key|client[_-]?secret)\s*[:=]\s*["'][^"'\s${}<>]{8,}["']/i,
  /jdbc:[^\s"']*password=[^\s"'&;]{4,}/i];
const DENY_BASH = [/\bgit\s+(commit|push|merge|rebase|reset\s+--hard|tag)\b/, /\b(printenv|env)\s*($|\|)/, /\bset\s*$/,
  /rm\s+-rf\s+(\/|~|\.\s*$)/, /curl[^|]*\|\s*(sh|bash)/, /\bcat\s+[^|;]*\.env\b/];

function block(msg) { process.stderr.write(`SDD guardrail blocked this action: ${msg}\nSee .claude/rules/enterprise/ENFORCEMENT-MATRIX.md`); process.exit(2); }

let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', () => {
  let input; try { input = JSON.parse(raw); } catch { process.exit(0); }
  const tool = input.tool_name || '';
  const ti = input.tool_input || {};
  const target = ti.file_path || ti.notebook_path || ti.path || '';
  const rel = target ? norm(path.relative(root(), path.resolve(root(), target))) : '';
  const writes = /^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool);

  if (tool === 'Bash') {
    const cmd = ti.command || '';
    for (const r of DENY_BASH) if (r.test(cmd)) block(`command not allowed for AI agents: "${cmd.slice(0, 80)}". Humans commit, push and manage secrets.`);
    if (SECRET_FILES.slice(0, 7).some(r => r.test(cmd)) && /\b(cat|type|more|less|head|tail|grep|findstr|Get-Content)\b/i.test(cmd))
      block('reading secret files through the shell is not allowed.');
    process.exit(0);
  }

  if (rel && !SECRET_EXAMPLE_OK.test(rel) && SECRET_FILES.some(r => r.test(rel))) block(`"${rel}" matches a secret file pattern.`);
  if (tool === 'Grep' && ti.glob && SECRET_FILES.slice(0, 7).some(r => r.test(ti.glob))) block('searching secret files is not allowed.');
  if (!writes) process.exit(0);

  if (/\.APPROVED\.md$/i.test(rel) || /^docs\/governance\/approvals\/(?!templates\/)/.test(rel))
    block(`"${rel}" is a human approval record. AI may draft a *.REQUEST.md instead.`);
  if (/^\.claude\/rules\/enterprise\//.test(rel)) block('enterprise rules are read-only in projects. Raise a change request with the CoE.');
  if (/^(\.githooks\/|\.github\/workflows\/sdd-gates|\.github\/CODEOWNERS)/.test(rel)) block(`"${rel}" is a protected governance file.`);

  const content = [ti.content, ti.new_string, ...(ti.edits || []).map(e => e.new_string)].filter(Boolean).join('\n');
  if (!SECRET_EXAMPLE_OK.test(rel)) for (const r of SECRET_CONTENT) if (r.test(content)) block('the content looks like a secret. Reference secrets by name from the secret store.');

  const s = activeSlice();
  if (s) {
    const state = s.status.state || 'DISCOVER';
    const cfg = require('./lib').readYaml(path.join(root(), 'sdd.config.yaml')) || {};
    const src = norm((cfg.paths && cfg.paths.src) || 'src/');
    if (rel.startsWith(src) && ORDER.indexOf(state) < ORDER.indexOf('TEST_DESIGN'))
      block(`slice ${s.id} is in ${state}. Production code may be written only after SPEC_READY and ARCHITECTURE_READY (commandment 1).`);
    const scope = (s.status.scope || []).map(norm);
    const always = ['specs/', 'docs/', '.sdd/', 'analysis/'];
    if (scope.length && !always.some(a => rel.startsWith(a)) && !scope.some(p => rel.startsWith(p.replace(/\*+.*$/, ''))))
      block(`"${rel}" is outside slice ${s.id} scope (${scope.join(', ')}). Ask the human to widen scope in status.yaml.`);
  }
  process.exit(0);
});
