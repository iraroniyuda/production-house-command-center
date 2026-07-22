# Domain Rules

Status: Draft  
Owner: Product + Domain Owners  
Last Reviewed: 2026-07-22  
Applies To: Whole Domain  
Related Documents:
- Belum ditentukan


## Project

- RULE-PROJ-001: Project MUST dimiliki tepat oleh satu Organization.
- RULE-PROJ-002: Project code MUST unik dalam satu Organization.
- RULE-PROJ-003: Project archived MUST NOT menerima transaksi operasional baru.

## Scene

- RULE-SCENE-001: Scene MUST dimiliki oleh satu Project.
- RULE-SCENE-002: Scene requirement MUST berada pada Project yang sama.
- RULE-SCENE-003: Scene yang telah direferensikan published schedule MUST NOT dihapus keras.
- RULE-SCENE-004: Perubahan material pada scene SHOULD menghasilkan revision record.

## Scheduling

- RULE-SCHED-001: Scene hanya dapat dijadwalkan pada Shooting Day milik Project yang sama.
- RULE-SCHED-002: Sequence order MUST unik dalam satu Shooting Day.
- RULE-SCHED-003: Shooting Day CLOSED MUST NOT menerima perubahan schedule.
- RULE-SCHED-004: Setiap perubahan schedule published MUST dicatat dalam audit.

## Call Sheet

- RULE-CALL-001: Call Sheet hanya dapat dibuat dari Shooting Day yang valid.
- RULE-CALL-002: Published Call Sheet MUST immutable; perubahan dibuat sebagai revision baru.
- RULE-CALL-003: Publish membutuhkan minimal satu recipient.
- RULE-CALL-004: Confirmation token MUST unik, aman, memiliki expiry, dan tidak disimpan dalam bentuk plaintext.
- RULE-CALL-005: Revisi call sheet dapat membutuhkan reconfirmation; kebijakan final masih OPEN.

## On-Set

- RULE-ONSET-001: Shooting Day hanya dapat dimulai dari READY.
- RULE-ONSET-002: Scene completion MUST dicatat dengan actor dan timestamp.
- RULE-ONSET-003: Delay MUST memiliki kategori atau penjelasan.
- RULE-ONSET-004: Wrap hanya dapat dilakukan saat Shooting Day IN_PROGRESS.

## Reporting

- RULE-REPORT-001: Daily Report hanya dapat dikunci setelah Shooting Day WRAPPED.
- RULE-REPORT-002: Locked Daily Report MUST immutable.
- RULE-REPORT-003: Revisi report MUST membentuk version baru.
- RULE-REPORT-004: Daily Report SHOULD diturunkan dari data harian, bukan input ulang penuh.

## Equipment

- RULE-EQUIP-001: Equipment LOST atau UNDER_REPAIR MUST NOT dapat di-booking.
- RULE-EQUIP-002: Booking overlap MUST dideteksi.
- RULE-EQUIP-003: Check-out MUST mencatat siapa membawa, project, waktu, dan kondisi.
- RULE-EQUIP-004: Damage report MUST meninggalkan audit trail.

## Finance

- RULE-FIN-001: Expense MUST terkait Organization dan Project yang sama dengan budget context.
- RULE-FIN-002: Approved expense MUST NOT diubah langsung.
- RULE-FIN-003: Perubahan approved expense MUST melalui adjustment atau revision.
