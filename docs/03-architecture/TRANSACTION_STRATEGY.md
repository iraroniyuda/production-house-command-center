# Transaction Strategy

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Backend  
Related Documents:
- Belum ditentukan


## Prinsip

- Application service menjadi boundary utama transaction.
- External provider tidak boleh dipanggil di dalam transaction.
- Event yang memicu efek eksternal ditulis ke outbox dalam transaction yang sama.
- Long-running process harus dipecah menjadi stateful workflow.
- Idempotency diperlukan untuk command publik atau retryable.
- Optimistic locking digunakan pada aggregate yang sering diedit.

## Contoh Publish Call Sheet

Dalam satu transaction:

1. Validasi permission dan state.
2. Bentuk immutable revision.
3. Buat recipient.
4. Buat hashed confirmation token.
5. Tulis audit record.
6. Tulis outbox event.
7. Commit.

Setelah commit:

8. Worker mengirim notifikasi.
9. Failure dicatat dan di-retry.
