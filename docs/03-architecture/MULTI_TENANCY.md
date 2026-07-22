# Multi-Tenancy

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Data, Security, API  
Related Documents:
- Belum ditentukan


## Model Awal

Shared database, shared schema, dengan `organization_id` pada aggregate utama.

## Invariant

1. Setiap request authenticated MUST memiliki organization context.
2. Setiap query resource bisnis MUST tenant-aware.
3. Resource dari tenant lain MUST diperlakukan sebagai tidak ditemukan atau ditolak sesuai policy.
4. Cross-tenant foreign reference MUST dicegah.
5. File storage key MUST memiliki tenant prefix.
6. Outbox dan audit MUST membawa organizationId.
7. Test MUST mencakup cross-tenant access denial.

## Query Pattern

Tidak aman:

```java
repository.findById(id);
```

Lebih aman:

```java
repository.findByIdAndOrganizationId(id, organizationId);
```

## Future Options

- PostgreSQL Row-Level Security sebagai defense in depth.
- Dedicated database per enterprise tenant bila kebutuhan kontrak atau compliance muncul.
