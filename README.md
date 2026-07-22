# Production House Command Center — Documentation Bible v0.1

Paket ini adalah fondasi dokumentasi untuk membangun **Production House Command Center** sebagai proyek enterprise jangka panjang.

## Cara mulai

1. Baca `docs/10-ai/AI_START_HERE.md`.
2. Baca `docs/00-governance/PROJECT_CONSTITUTION.md`.
3. Gunakan `docs/00-governance/SOURCE_OF_TRUTH.md` saat ada konflik informasi.
4. Sebelum coding fitur baru, buat folder feature spec di `docs/11-features/`.
5. Saat perilaku sistem berubah, perbarui code, test, API/schema, dan dokumentasi terkait dalam satu pekerjaan yang sama.

## Status paket

- Ini adalah **starter bible**, bukan spesifikasi final.
- Dokumen produk diturunkan dari dokumen konsep Juli 2026.
- Dokumen arsitektur mengikuti keputusan awal: Next.js, Spring Boot, Spring Modulith, PostgreSQL, Flyway, Keycloak, object storage S3-compatible, REST/OpenAPI, transactional outbox, dan modular monolith.
- Bagian yang belum diputuskan ditandai sebagai `OPEN`, `TODO`, atau `PROPOSED`.

## Folder utama

- `00-governance`: aturan tertinggi proyek.
- `01-product`: visi, pengguna, prinsip, dan roadmap.
- `02-domain`: bahasa domain, business rule, state machine, dan event.
- `03-architecture`: blueprint sistem dan ADR.
- `04-data`: model, ownership, dan retensi data.
- `05-api`: kontrak dan standar API.
- `06-security`: autentikasi, otorisasi, tenant isolation, dan audit.
- `07-engineering`: standar implementasi.
- `08-quality`: testing dan definition of done.
- `09-operations`: deployment, observability, recovery, dan runbook.
- `10-ai`: cara menggunakan GPT/AI pada repository.
- `11-features`: spesifikasi per fitur.
- `12-current-state`: kondisi implementasi aktual.
- `13-releases`: changelog dan catatan migrasi.
- `source`: dokumen konsep asli.

## Prinsip utama

> Dokumentasi bukan arsip. Dokumentasi adalah bagian dari sistem.
