// Zero-dependency helpers shared by SDD scripts (Node 18+).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Minimal YAML subset reader: nested maps, lists of scalars/maps, scalars, comments.
function parseYaml(text) {
  const lines = text.split(/\r?\n/).map(l => l.replace(/\s+#.*$/, '')).filter(l => l.trim() && !l.trim().startsWith('#'));
  let i = 0;
  const scalar = v => {
    v = v.trim();
    if (/^".*"$|^'.*'$/.test(v)) return v.slice(1, -1);
    if (v === 'true') return true; if (v === 'false') return false;
    if (v === 'null' || v === '~' || v === '') return null;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (/^\[.*\]$/.test(v)) return v.slice(1, -1).split(',').map(s => scalar(s)).filter(s => s !== null);
    return v;
  };
  const indent = l => l.match(/^ */)[0].length;
  function block(ind) {
    if (i >= lines.length) return null;
    if (lines[i].trim().startsWith('- ')) {
      const arr = [];
      while (i < lines.length && indent(lines[i]) === ind && lines[i].trim().startsWith('- ')) {
        const rest = lines[i].trim().slice(2);
        if (/^[\w.-]+:\s/.test(rest) || /^[\w.-]+:$/.test(rest)) {
          lines[i] = ' '.repeat(ind + 2) + rest; arr.push(block(ind + 2));
        } else { arr.push(scalar(rest)); i++; }
      }
      return arr;
    }
    const obj = {};
    while (i < lines.length && indent(lines[i]) === ind && !lines[i].trim().startsWith('- ')) {
      const m = lines[i].trim().match(/^([^:]+):\s*(.*)$/);
      if (!m) { i++; continue; }
      i++;
      if (m[2] !== '') obj[m[1].trim()] = scalar(m[2]);
      else if (i < lines.length && indent(lines[i]) > ind) obj[m[1].trim()] = block(indent(lines[i]));
      else if (i < lines.length && indent(lines[i]) === ind && lines[i].trim().startsWith('- ')) obj[m[1].trim()] = block(ind);
      else obj[m[1].trim()] = null;
    }
    return obj;
  }
  return block(0) || {};
}

function frontMatter(file) {
  const t = fs.readFileSync(file, 'utf8');
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? parseYaml(m[1]) : {};
}

const root = () => process.env.CLAUDE_PROJECT_DIR || process.cwd();
const readYaml = f => fs.existsSync(f) ? parseYaml(fs.readFileSync(f, 'utf8')) : null;
const sha256 = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const norm = p => p.split(path.sep).join('/');

function findSliceDir(sliceId) {
  const base = path.join(root(), 'specs', 'slices');
  if (!fs.existsSync(base)) return null;
  const d = fs.readdirSync(base).find(n => n === sliceId || n.startsWith(sliceId + '-'));
  return d ? path.join(base, d) : null;
}

function activeSlice() {
  const f = path.join(root(), '.sdd', 'active-slice');
  if (!fs.existsSync(f)) return null;
  const id = fs.readFileSync(f, 'utf8').trim();
  const dir = findSliceDir(id);
  return dir ? { id, dir, status: readYaml(path.join(dir, 'status.yaml')) || {} } : null;
}

module.exports = { parseYaml, frontMatter, root, readYaml, sha256, norm, findSliceDir, activeSlice };
