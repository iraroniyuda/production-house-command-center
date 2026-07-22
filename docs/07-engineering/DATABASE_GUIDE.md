# Database Guide

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: PostgreSQL & Flyway  
Related Documents:
- Belum ditentukan


## Migration

- Semua schema change melalui Flyway.
- Migration yang sudah dirilis tidak boleh diedit.
- Gunakan migration baru untuk koreksi.
- Constraint dan index diberi nama.
- Migration harus aman pada data existing.
- Data migration besar harus memiliki strategy dan rollback plan.

## Type

- UUID untuk aggregate utama.
- `timestamptz` untuk timestamp global.
- `date` untuk shooting date.
- numeric/decimal untuk uang; floating point dilarang.
- JSONB hanya untuk metadata dinamis.

## Indexing

Index dirancang dari query nyata. Tenant prefix sering menjadi bagian index, misalnya `(organization_id, project_id, status)`.

## Delete

Hard delete hanya untuk data yang belum menjadi record operasional. Published, approved, locked, atau audited record menggunakan lifecycle/archive/revision.
