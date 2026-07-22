# Observability Guide

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Runtime  
Related Documents:
- Belum ditentukan


## Logs

Structured JSON dengan:

- timestamp
- level
- service
- module
- requestId
- correlationId
- organizationId bila aman
- actorId bila aman
- eventType
- duration
- errorCode

## Metrics

- HTTP latency dan error rate
- DB pool usage
- slow query count
- outbox backlog
- outbox retry
- notification failure
- file upload failure
- report generation duration
- permission denied count
- login failure
- conflict rate

## Tracing

Trace harus menghubungkan HTTP request, transaction, outbox event, dan worker delivery.

## Alert Awal

- backend unavailable;
- database connection exhaustion;
- outbox backlog meningkat;
- backup failure;
- storage unavailable;
- elevated 5xx.
