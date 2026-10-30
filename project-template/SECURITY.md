# Security policy

## Reporting a vulnerability
Do not open a public issue. Report to the enterprise security team at security@example.com or the internal security portal, including the repository, affected component, and steps to reproduce.

## Supported versions
Only the `main` branch and the currently deployed release receive security fixes.

## Security practices in this repository
- Enterprise security baseline: `.claude/rules/enterprise/SECURITY-STANDARDS.md`
- Secrets handling: `.claude/rules/enterprise/SECRETS.md` (no secrets in code, config or AI context)
- Automated controls: gitleaks (pre-commit + CI), SAST and SCA in CI, SDD guardrail hooks for AI agents
- Security and identity changes require approval by the security architect (`HUMAN-IN-THE-LOOP.md`)
