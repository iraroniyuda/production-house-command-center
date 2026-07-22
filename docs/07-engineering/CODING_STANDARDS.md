# Coding Standards

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: All Source Code  
Related Documents:
- Belum ditentukan


## General

- Code harus jelas lebih dulu daripada ringkas.
- Domain naming mengikuti glossary.
- Dependency baru membutuhkan alasan.
- TODO harus memiliki issue atau reference.
- Dead code tidak boleh dibiarkan.

## Backend Larangan

- Controller tidak boleh mengakses repository.
- JPA entity tidak boleh menjadi response DTO.
- Modul tidak boleh mengakses repository modul lain.
- Business rule tidak boleh hanya berupa annotation validation.
- Generic status update endpoint dilarang.
- Exception tidak boleh ditelan.
- `LocalDateTime` tidak dipakai untuk timestamp global.
- Boolean tidak dipakai untuk lifecycle kompleks.

## Frontend Larangan

- Permission tidak boleh disimpulkan hanya dari menu yang terlihat.
- API shape tidak boleh ditulis manual bila generated client tersedia.
- Business rule kritis tidak boleh hanya di frontend.
- Data server tidak boleh diduplikasi tanpa strategi cache yang jelas.

## Comment

Comment menjelaskan alasan, invariant, atau trade-off; bukan mengulang kode.
