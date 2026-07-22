# Source of Truth

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Whole System  
Related Documents:
- Belum ditentukan


## Hierarki

| Pertanyaan | Sumber Kebenaran |
|---|---|
| Mengapa produk ada? | Product Bible |
| Apa arti istilah? | Domain Glossary |
| Apa aturan bisnisnya? | Domain Rules |
| Modul mana memiliki data? | Bounded Context Map |
| Transisi status apa yang sah? | State Machine Catalog |
| Siapa boleh melakukan apa? | Authorization Matrix |
| Mengapa keputusan teknis diambil? | ADR |
| Apa kontrak API? | OpenAPI |
| Apa schema database aktual? | Flyway migrations |
| Apa yang benar-benar sudah dibuat? | Code + Current Implementation |
| Apa yang belum diputuskan? | Open Questions |
| Apa yang diketahui belum sempurna? | Known Gaps |

## Aturan Konflik

Jika dua sumber bertentangan:

1. MUST NOT memilih sendiri secara diam-diam.
2. Hentikan implementasi pada area yang ambigu.
3. Catat konflik di `OPEN_QUESTIONS.md`.
4. Minta keputusan dari owner yang relevan.
5. Perbarui sumber kebenaran sebelum implementasi dilanjutkan.

## Prioritas Implementasi

Code yang berjalan tidak otomatis menjadi keputusan desain yang benar. Bila code bertentangan dengan spesifikasi approved, hal tersebut harus diperlakukan sebagai bug atau gap sampai diputuskan sebaliknya.
