# Backend Guide

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Spring Boot Backend  
Related Documents:
- Belum ditentukan


## Package by Module

```text
com.phcc
  organization
  project
  scriptscene
  scheduling
  callsheet
  onset
  reporting
```

Di dalam modul:

```text
api/
application/
domain/
infrastructure/
```

## Layer Rules

- api: HTTP contract dan mapping.
- application: use case dan transaction boundary.
- domain: entity, value object, rule, state transition.
- infrastructure: JPA, storage adapter, provider adapter.

## DTO

- Request dan response terpisah.
- Entity tidak keluar dari module.
- Mapping eksplisit lebih disukai daripada magic mapper untuk domain kritis.

## Transaction

- `@Transactional` pada application service.
- Read-only query menggunakan `readOnly=true`.
- External call dilakukan setelah commit melalui outbox.

## Error

Domain error dipetakan ke error catalog. Jangan melempar generic RuntimeException untuk business conflict.
