# Runbook

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Operations  
Related Documents:
- Belum ditentukan


## Backend Tidak Sehat

1. Periksa health endpoint.
2. Periksa recent deployment.
3. Periksa database dan Keycloak dependency.
4. Periksa error rate dan logs.
5. Rollback bila regression terkonfirmasi.

## Outbox Backlog Meningkat

1. Periksa worker health.
2. Periksa provider error.
3. Periksa locked rows dan retry storm.
4. Pause provider bila perlu.
5. Jangan hapus event tanpa audit.

## Database Connection Habis

1. Periksa pool metrics.
2. Cari slow query dan transaction panjang.
3. Periksa traffic abnormal.
4. Scale sementara hanya setelah root cause dicatat.

## Object Storage Tidak Tersedia

1. Disable upload bila perlu.
2. Pertahankan metadata consistency.
3. Jangan menganggap upload sukses sebelum storage confirmation.

## Migration Gagal

1. Hentikan rollout.
2. Jangan edit migration released.
3. Restore/rollback sesuai migration plan.
4. Buat migration koreksi.
