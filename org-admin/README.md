# Org admin: enterprise enforcement

Deploy `managed-settings.json` to developer machines through endpoint management (Intune / SCCM / Jamf). Managed settings take precedence over user and project settings, so teams cannot remove the enterprise marketplace, disable `sdd-core`, or allow secret reads.

Windows location: `C:\Program Files\ClaudeCode\managed-settings.json`
macOS: `/Library/Application Support/ClaudeCode/managed-settings.json` · Linux/WSL: `/etc/claude-code/managed-settings.json`

Before rollout, confirm key names and locations against the current Claude Code settings documentation (https://code.claude.com/docs/en/settings); the product evolves quickly.
