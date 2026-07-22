# Project Constitution

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Whole System  
Related Documents:
- SOURCE_OF_TRUTH.md
- ../03-architecture/ARCHITECTURE_BLUEPRINT.md


## 1. Tujuan

Production House Command Center dibangun sebagai sistem kerja terpadu untuk production house agar banyak proyek, kru, scene, jadwal, call sheet, laporan, aset, biaya, dokumen, post-production, dan delivery dapat dikelola dalam satu pusat kendali.

## 2. Prinsip yang Tidak Boleh Dilanggar

1. Sistem MUST multi-tenant sejak fondasi.
2. Setiap data bisnis MUST memiliki ownership tenant yang jelas.
3. Backend MUST dibangun sebagai modular monolith sampai kebutuhan operasional membuktikan perlunya pemisahan service.
4. Modul MUST NOT mengakses repository atau entity internal modul lain.
5. Business rule MUST berada di backend dan MUST NOT hanya bergantung pada frontend.
6. Operasi bisnis penting MUST memiliki audit trail.
7. Status lifecycle kompleks MUST dikelola melalui state transition yang eksplisit.
8. API MUST mewakili use case bisnis, bukan sekadar CRUD tabel.
9. Database MUST menjadi pelindung terakhir integritas data melalui constraint, transaction, dan migration.
10. Teknologi baru MUST memiliki alasan bisnis atau operasional yang terdokumentasi.
11. Test MUST mencakup rule dan workflow kritis, bukan hanya mengejar coverage angka.
12. Perubahan perilaku sistem belum dianggap selesai sebelum dokumentasi terkait diperbarui.

## 3. Arsitektur yang Dikunci untuk Fondasi

- Frontend: Next.js + TypeScript.
- Backend: Java + Spring Boot.
- Modul: Spring Modulith.
- Database: PostgreSQL.
- Migration: Flyway.
- Identity: Keycloak melalui OpenID Connect.
- Authorization: permission kontekstual di aplikasi.
- API: REST + OpenAPI.
- File: S3-compatible object storage.
- Integrasi async: internal events + transactional outbox.
- Local environment: Docker Compose.
- Observability: structured log, metrics, tracing, health check.
- Testing: JUnit, Testcontainers, ArchUnit, Vitest, Playwright.

## 4. Prinsip Evolusi

- Sistem SHOULD dimulai sederhana secara deployment.
- Sistem MUST tetap tegas secara batas domain.
- Kafka, Kubernetes, Elasticsearch, microservices, CQRS luas, event sourcing penuh, dan service mesh MAY ditambahkan hanya setelah ada kebutuhan terukur.
- Keputusan arsitektur penting MUST dicatat sebagai ADR.

## 5. Definisi Kualitas

Kualitas berarti:

- data konsisten;
- akses aman;
- perubahan dapat ditelusuri;
- kegagalan dapat didiagnosis;
- migration dapat dijalankan berulang;
- developer baru dapat memahami struktur;
- sistem dapat diuji;
- perilaku bisnis sesuai spesifikasi;
- dokumentasi dan implementasi tidak saling bertentangan.

## 6. Sikap terhadap Technical Debt

Technical debt MAY diterima bila:

- disengaja;
- dicatat;
- memiliki dampak dan risiko yang jelas;
- memiliki kondisi kapan harus dibayar;
- tidak melanggar tenant isolation, integritas data, atau keamanan dasar.
