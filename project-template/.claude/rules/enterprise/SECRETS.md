# Secrets handling rules (agents and humans)

## Agents must never
- Read, open, grep, cat or print: `.env*`, `*.pem`, `*.key`, `*.pfx`, `*.p12`, `*.jks`, `id_rsa*`, `credentials*`, `*secret*`, `*.tfvars`, `.npmrc`, `.pypirc`, `settings.xml` (Maven), WebLogic `boot.properties`.
- Write a value that looks like a secret into any file (keys, tokens, passwords, connection strings with passwords).
- Ask a human to paste a secret into the chat.
- Echo environment variables (`env`, `printenv`, `set`) to the terminal.

## Agents must
- Reference secrets by **name** only (e.g. `secretsManager:/app/db/password`, `${DB_PASSWORD}`).
- Use the stack pack's secrets pattern (`stack-security-integration` slot), e.g. AWS Secrets Manager with rotation, Azure Key Vault, HashiCorp Vault.
- Add placeholder values to `*.example` files only.

## Enforcement
- `guard.js` (PreToolUse hook) blocks the file patterns above and secret-like content in writes.
- `gitleaks` runs in pre-commit and CI using the repo `.gitleaks.toml`.
- A suspected leak is an incident: stop, tell the human, do not try to "clean it up" yourself.
