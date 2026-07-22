# API Design Guide

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: REST API  
Related Documents:
- Belum ditentukan


## Dasar

- Base path: `/api/v1`.
- Resource URL menggunakan noun plural.
- Use case dengan business meaning menggunakan command endpoint.
- API menggunakan JSON kecuali file transfer.
- Timestamp menggunakan ISO-8601 dengan offset/UTC.
- Contract didefinisikan di OpenAPI.

## Command Endpoint

Gunakan:

- `POST /call-sheets/{id}/publish`
- `POST /shooting-days/{id}/start`
- `POST /shooting-days/{id}/wrap`
- `POST /daily-reports/{id}/lock`

Hindari generic status update.

## Error

Gunakan Problem Details style dengan:

- type
- title
- status
- detail
- ruleId
- traceId
- fieldErrors

## Concurrency

Client mengirim version atau If-Match. Conflict menghasilkan HTTP 409.

## Pagination

Gunakan cursor pagination untuk collection besar. Offset pagination MAY dipakai untuk admin kecil.

## Idempotency

Command publik atau pembayaran/approval yang dapat di-retry SHOULD menerima Idempotency-Key.

## Security

Semua endpoint authenticated kecuali public link yang secara eksplisit didesain dengan token aman.
