# Review Checklist

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Code Review  
Related Documents:
- Belum ditentukan


## Domain

- Apakah istilah mengikuti glossary?
- Apakah rule ID ditegakkan?
- Apakah state transition sah?
- Apakah invariant dijaga backend dan database?

## Architecture

- Apakah module boundary dilanggar?
- Apakah repository modul lain diakses?
- Apakah dependency baru perlu?
- Apakah transaction boundary benar?

## Security

- Apakah tenant scope divalidasi?
- Apakah permission kontekstual?
- Apakah data sensitif masuk log?
- Apakah public token aman?

## Data

- Apakah migration backward-aware?
- Apakah index dan constraint cukup?
- Apakah delete policy benar?
- Apakah optimistic locking diperlukan?

## Quality

- Apakah test mencakup failure path?
- Apakah error mapping jelas?
- Apakah observability cukup?
- Apakah dokumentasi diperbarui?
