# Feature: Core Production Vertical Slice

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Project to Daily Report  
Related Documents:
- Belum ditentukan


## Business Goal

Membuktikan satu alur produksi utuh:

Project → Scene → Shooting Schedule → Call Sheet → Confirmation → Shooting Log → Daily Production Report → Dashboard

## Actors

- Owner
- Producer
- Assistant Director
- Crew
- Talent

## Included

- membuat project;
- membuat scene dan requirement;
- membuat shooting day;
- menempatkan scene ke shooting day;
- membuat dan publish call sheet;
- recipient membuka dan confirm;
- mencatat shooting log;
- wrap shooting day;
- generate dan lock daily report;
- menampilkan ringkasan progress.

## Out of Scope

- WhatsApp provider resmi;
- equipment;
- budget lengkap;
- post-production;
- AI risk radar;
- native app.

## Key Rules

- RULE-PROJ-001 sampai RULE-PROJ-003
- RULE-SCENE-001 sampai RULE-SCENE-004
- RULE-SCHED-001 sampai RULE-SCHED-004
- RULE-CALL-001 sampai RULE-CALL-004
- RULE-ONSET-001 sampai RULE-ONSET-004
- RULE-REPORT-001 sampai RULE-REPORT-004

## Acceptance Criteria

1. Satu Organization dapat memiliki beberapa Project.
2. User hanya melihat Project yang boleh diakses.
3. Project memiliki Scene dan Scene Requirement.
4. Scene dapat dimasukkan ke Shooting Day pada Project yang sama.
5. Shooting Day dapat menghasilkan Call Sheet draft.
6. Published Call Sheet immutable.
7. Recipient dapat confirm melalui token aman.
8. Shooting Log dapat dicatat dari mobile view.
9. Wrap menghasilkan data yang dapat dipakai Daily Report.
10. Daily Report dapat direview dan dikunci.
11. Dashboard berubah berdasarkan data nyata.
12. Semua aksi kritis diaudit.
