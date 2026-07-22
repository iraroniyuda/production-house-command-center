# API Error Catalog

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: REST API  
Related Documents:
- Belum ditentukan


| Code | HTTP | Meaning |
|---|---:|---|
| ACCESS_DENIED | 403 | User tidak memiliki permission |
| RESOURCE_NOT_FOUND | 404 | Resource tidak ditemukan dalam scope |
| VERSION_CONFLICT | 409 | Optimistic locking conflict |
| INVALID_STATE_TRANSITION | 409 | State transition tidak sah |
| VALIDATION_FAILED | 422 | Input business validation gagal |
| TENANT_SCOPE_VIOLATION | 404/403 | Cross-tenant access |
| CALL_SHEET_ALREADY_PUBLISHED | 409 | Published revision immutable |
| SHOOTING_DAY_NOT_READY | 409 | Tidak dapat memulai atau publish |
| DAILY_REPORT_NOT_WRAPPED | 409 | Report tidak dapat dikunci |
| EQUIPMENT_CONFLICT | 409 | Booking overlap |
| OUTBOX_PROCESSING_FAILED | internal | Async delivery failure |
