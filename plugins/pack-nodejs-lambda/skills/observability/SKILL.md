---
name: observability
description: Logging, metrics, tracing and alarms for Lambda services (structured JSON logs, correlation IDs, Powertools, X-Ray/OpenTelemetry, PII masking). Load when designing or implementing observability.
---
# Observability
- AWS Lambda Powertools for TypeScript: Logger (JSON), Metrics (EMF), Tracer.
- Every log line has `correlationId`, `sliceCapability`, `service`; mask PII and account numbers to last 4.
- Alarms per function: error rate, throttles, p95 duration vs NFR, DLQ depth.
