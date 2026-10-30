# EA-ADR-006: Integration style
- Status: Proposed
## Decision
Default integration is synchronous REST through API management plus managed queues for asynchronous work. Event streaming platforms (e.g. Kafka) are used only with an EA-approved use case. State-changing events use a transactional outbox.
