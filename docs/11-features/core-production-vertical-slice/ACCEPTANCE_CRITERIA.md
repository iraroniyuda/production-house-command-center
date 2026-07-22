# Core Vertical Slice Acceptance Criteria

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Core Production Vertical Slice  
Related Documents:
- Belum ditentukan


## Project

- Create project dengan code unik dalam Organization.
- User tenant lain tidak dapat melihat project.
- Archived project menolak perubahan operasional baru.

## Scene

- Create scene.
- Add requirement per department.
- Scene dari project A tidak dapat dijadwalkan pada project B.

## Scheduling

- Create shooting day.
- Add, remove, dan reorder scene sebelum locked state.
- Conflict version menghasilkan HTTP 409.

## Call Sheet

- Draft dibentuk dari shooting day.
- Publish membutuhkan recipient.
- Revision published immutable.
- Public token tidak dapat ditebak dan memiliki expiry.
- Confirmation tercatat dengan timestamp.

## On-Set

- Start hanya dari READY.
- Delay dan scene completion dapat dicatat.
- Wrap hanya dari IN_PROGRESS.

## Report

- Generate setelah wrap.
- Locked report immutable.
- Revision membentuk version baru.

## Dashboard

- Menampilkan phase, next shooting day, scene complete, pending confirmation, open issue, dan health summary.
