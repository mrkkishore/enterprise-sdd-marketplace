---
name: deployment-sam-cdk
description: Packaging and deploying Lambda services with SAM or CDK through the enterprise pipeline (environments, approvals, rollback, single-region). Load when designing deployment or preparing deployment-readiness evidence.
---
# Deployment
- IaC only (SAM or CDK); no console changes.
- Pipeline promotes the same artifact dev → test → prod; prod requires the human release approval.
- Gradual deployment (canary 10% / 10 min) with automatic rollback on alarm.
- Deployment-readiness evidence: runbook, rollback steps tested, alarms wired, dashboards linked.
