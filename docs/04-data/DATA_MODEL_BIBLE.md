# Data Model Bible

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Database & Domain Model  
Related Documents:
- Belum ditentukan


## Prinsip

- Schema aktual berada pada Flyway migration.
- Entity JPA bukan kontrak API.
- Aggregate boundary tidak sama dengan seluruh tabel relasional.
- `organization_id` wajib pada aggregate utama.
- Timestamp global menggunakan UTC.
- Lifecycle kompleks menggunakan status, bukan kombinasi boolean.
- Optimistic locking digunakan pada aggregate yang rawan concurrent edit.

## Aggregate Awal

### Organization
Identity: UUID  
Ownership: root tenant  
Audited: Yes  
Soft Delete: No; gunakan lifecycle status.

### Project
Identity: UUID  
Tenant: organization_id  
Business Key: organization_id + project_code  
Optimistic Lock: Yes  
Archive: Yes

### Scene
Identity: UUID  
Tenant: organization_id  
Project: project_id  
Optimistic Lock: Yes  
Hard Delete: hanya sebelum memiliki reference operasional.

### ShootingDay
Identity: UUID  
Project: project_id  
Optimistic Lock: Yes  
Lifecycle: PLANNED sampai CLOSED.

### CallSheet
Identity: UUID  
Shooting Day: shooting_day_id  
Revision: immutable published versions  
Token: hanya hash disimpan.

### DailyReport
Identity: UUID  
Shooting Day: shooting_day_id  
Revision: immutable setelah lock.

### Equipment
Identity: UUID  
Tenant: organization_id  
Condition lifecycle: required.

### Expense
Identity: UUID  
Tenant + Project required  
Approved records immutable; gunakan adjustment.

## Naming

- Table: snake_case plural atau singular harus diputuskan sebelum migration pertama.
- Column: snake_case.
- Foreign key harus eksplisit.
- Index harus diberi nama.
- Constraint harus diberi nama.
