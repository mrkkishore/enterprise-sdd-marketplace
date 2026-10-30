# EA-ADR-004: Managed secrets with rotation
- Status: Proposed
## Decision
Secrets live only in the platform's managed secrets store (AWS Secrets Manager, Azure Key Vault or HashiCorp Vault) with automated rotation. Applications read secrets at runtime by name; never from code, config files or pipelines variables in plain text.
