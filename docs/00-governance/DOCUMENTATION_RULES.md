# Documentation Rules

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: All Documentation  
Related Documents:
- Belum ditentukan


## Format Wajib

Setiap dokumen SHOULD memiliki:

- status;
- owner;
- tanggal review;
- ruang lingkup;
- related documents;
- keputusan eksplisit;
- istilah konsisten;
- TODO atau open question yang jelas.

## Kata Normatif

- MUST: wajib.
- MUST NOT: dilarang.
- SHOULD: sangat disarankan.
- SHOULD NOT: sebaiknya dihindari.
- MAY: opsional.

## Aturan Penulisan

1. Satu dokumen memiliki satu tujuan utama.
2. Gunakan ID stabil untuk rule, event, gap, open question, dan ADR.
3. Diagram SHOULD ditulis dengan Mermaid agar dapat dibaca AI.
4. API konkret MUST tercermin di OpenAPI.
5. Schema aktual MUST tercermin di Flyway migration.
6. Screenshot atau chat MUST NOT menjadi satu-satunya sumber keputusan.
7. Keputusan lisan MUST dipindahkan ke dokumen.
8. Dokumen deprecated MUST menunjuk penggantinya.
9. Dokumen tidak boleh diam-diam mengoreksi dokumen lain; konflik harus dicatat.
10. Perubahan lintas dokumen SHOULD dilakukan dalam satu pull request.

## Review Cadence

- Constitution dan Product Bible: review per milestone besar.
- Current Implementation dan Known Gaps: review setiap milestone.
- Feature Spec: review saat feature berubah.
- Runbook: review setelah incident atau perubahan operasi.
- Authorization Matrix: review setiap perubahan role/permission.
