# Testing Strategy

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Whole System  
Related Documents:
- Belum ditentukan


## Unit Test

Untuk business rule, state transition, value object, dan calculation.

## Module Integration Test

Untuk satu modul dengan PostgreSQL nyata melalui Testcontainers.

## Architecture Test

ArchUnit dan Spring Modulith memastikan module boundary dan dependency rule.

## API Test

Memastikan endpoint, authorization, error mapping, optimistic locking, dan OpenAPI behavior.

## Security Test

- cross-tenant access;
- role scope;
- expired token;
- public token misuse;
- file permission.

## Migration Test

- database kosong;
- upgrade dari versi sebelumnya;
- constraint;
- seed development.

## Frontend Test

- Vitest untuk logic/component;
- Playwright untuk critical path;
- accessibility pada layar penting.

## Critical E2E

Login → pilih project → buat scene → jadwalkan → publish call sheet → confirm → start shooting → log delay/complete → wrap → generate/lock report → dashboard berubah.

## Rule Traceability

Setiap rule approved SHOULD memiliki test yang merujuk rule ID.
