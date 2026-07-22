# Git Workflow

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Repository  
Related Documents:
- Belum ditentukan


## Branch

- `main`: selalu releasable.
- feature branch: `feat/<scope>-<name>`.
- fix branch: `fix/<scope>-<name>`.
- docs branch MAY digunakan untuk perubahan dokumentasi besar.

## Commit

Gunakan Conventional Commits:

- feat:
- fix:
- docs:
- refactor:
- test:
- build:
- chore:

## Pull Request

PR harus menyebut:

- tujuan;
- dokumen referensi;
- affected modules;
- rule IDs;
- data/API impact;
- security impact;
- test;
- documentation update;
- migration;
- rollback consideration.
