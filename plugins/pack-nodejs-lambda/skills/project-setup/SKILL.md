---
name: project-setup
description: Scaffolding a new Node.js 20 TypeScript Lambda service (folders, tsconfig, package.json scripts, .nvmrc, lint, test). Load when creating a new service.
---
# Service setup
- `.nvmrc` = `20`; `package.json` scripts: `build`, `lint`, `test`, `test:parity`, `package`.
- Pinned dependency versions; lockfile committed; `npm ci` in CI.
- `tsconfig` target ES2022, module NodeNext, outDir `dist/`.
- Each service in `src/services/<name>/` with its own `template.yaml` (SAM) or CDK construct.
