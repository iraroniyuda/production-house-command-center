# Deployment Guide

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Staging & Production  
Related Documents:
- Belum ditentukan


## Principles

- image immutable;
- versioned artifact;
- migration terkontrol;
- secret manager;
- health check;
- rollback-aware;
- backup sebelum migration berisiko.

## Initial Topology

- reverse proxy/load balancer
- Next.js container
- Spring Boot container
- managed PostgreSQL atau hardened PostgreSQL
- Keycloak
- S3-compatible storage
- centralized logs and metrics

## Deployment Order

1. Pre-deploy checks.
2. Backup verification.
3. Migration compatibility check.
4. Deploy backend.
5. Deploy frontend.
6. Smoke test.
7. Observe error rate dan outbox.
