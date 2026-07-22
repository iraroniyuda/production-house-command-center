# Error Handling

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Backend & Frontend  
Related Documents:
- Belum ditentukan


## Categories

- validation error;
- authorization error;
- not found;
- state conflict;
- version conflict;
- external dependency failure;
- infrastructure failure;
- unexpected internal error.

## Rules

- User-facing message tidak membocorkan stack trace.
- Log internal memiliki traceId.
- Business error menyertakan ruleId bila ada.
- Retry hanya untuk operasi idempotent atau yang memiliki idempotency guard.
- Provider error tidak boleh mengubah transaction bisnis yang sudah valid.
- Frontend harus membedakan field error dan global error.
