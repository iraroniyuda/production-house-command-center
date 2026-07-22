# Use Browser Authorization Code with PKCE

Status: Approved
Owner: Roni / Product & Engineering
Last Reviewed: 2026-07-22
Applies To: Architecture
Related Documents:
- `ADR-0003-use-keycloak.md`
- `docs/06-security/SECURITY_BIBLE.md`
- `docs/06-security/THREAT_MODEL.md`
- `docs/03-architecture/ARCHITECTURE_BLUEPRINT.md`
- `docs/12-current-state/CURRENT_IMPLEMENTATION.md`


## Status

Accepted

## Context

PHCC membutuhkan autentikasi browser untuk aplikasi Next.js yang mengakses
Spring Boot API.

Keycloak telah dipilih sebagai identity provider. Client `phcc-web` telah
dikonfigurasi sebagai public OpenID Connect client dengan Authorization Code
flow dan PKCE S256. Spring Boot telah dikonfigurasi sebagai resource server
`phcc-api` yang memvalidasi signature, issuer, expiry, audience, dan realm
roles.

Keputusan tambahan diperlukan untuk menentukan:

- bagaimana browser memulai login dan logout;
- bagaimana authorization code ditukar menjadi token;
- tempat access token dan refresh token disimpan;
- bagaimana token diperbarui;
- bagaimana request terautentikasi dikirim ke Spring Boot;
- apakah Next.js harus bertindak sebagai Backend for Frontend;
- batas tanggung jawab antara Keycloak, frontend, dan backend.

## Decision

Gunakan adapter resmi `keycloak-js` pada aplikasi browser Next.js.

Authentication menggunakan OpenID Connect Authorization Code flow dengan PKCE
S256 melalui public client `phcc-web`.

Token lifecycle mengikuti aturan berikut:

- access token dan refresh token hanya disimpan di memory oleh `keycloak-js`;
- token tidak boleh disimpan di `localStorage`;
- token tidak boleh disimpan di `sessionStorage`;
- token tidak boleh dimasukkan ke cookie yang dibuat aplikasi PHCC;
- client secret tidak boleh dimasukkan ke aplikasi browser;
- token tidak boleh ditulis ke log, telemetry, error report, atau analytics;
- sebelum request terautentikasi, frontend meminta pembaruan token melalui
  `keycloak.updateToken`;
- kegagalan memperbarui token mengakhiri authenticated state dan mengharuskan
  pengguna melakukan login kembali;
- logout dilakukan melalui endpoint logout Keycloak menggunakan adapter;
- access token dikirim langsung ke Spring Boot melalui header
  `Authorization: Bearer`;
- Spring Boot tetap menjadi pihak yang menentukan apakah request diizinkan;
- frontend boleh menyembunyikan fitur berdasarkan role untuk kebutuhan UX,
  tetapi tidak boleh dianggap sebagai authorization boundary.

Inisialisasi browser menggunakan pemeriksaan session tanpa memaksa login
langsung. Pengguna yang belum login dapat melihat public application shell,
kemudian memulai login secara eksplisit ketika mengakses fitur yang
membutuhkan autentikasi.

Implementasi awal tidak menggunakan session authentication buatan Next.js dan
tidak menjadikan Next.js sebagai token-mediating Backend for Frontend.

## Responsibility Boundaries

### Keycloak

Keycloak bertanggung jawab atas:

- login dan logout;
- user authentication;
- authorization code issuance;
- token issuance dan refresh;
- password policy;
- future MFA capability;
- identity-provider session.

### Next.js Browser Application

Frontend bertanggung jawab atas:

- menginisialisasi `keycloak-js`;
- memulai login dan logout;
- menyimpan authentication state hanya selama runtime browser;
- memperbarui token sebelum request;
- mengirim bearer token ke API;
- membersihkan local authentication state ketika session berakhir;
- menampilkan authenticated dan unauthenticated user experience.

### Spring Boot API

Backend bertanggung jawab atas:

- memvalidasi token signature;
- memvalidasi issuer;
- memvalidasi token expiry;
- memvalidasi audience `phcc-api`;
- menerjemahkan PHCC realm roles yang diizinkan;
- menjalankan contextual authorization;
- menolak token yang tidak valid atau tidak ditujukan kepada API;
- tidak mempercayai authorization decision dari frontend.

## Security Requirements

Implementasi wajib memenuhi ketentuan berikut:

- PKCE method harus `S256`;
- redirect URI dan web origin harus spesifik untuk environment;
- wildcard production redirect URI tidak diperbolehkan;
- access token harus berumur pendek;
- token tidak boleh dimasukkan ke URL aplikasi;
- token tidak boleh dicetak ke browser console;
- authenticated fetch harus melalui satu abstraction yang terkontrol;
- refresh token race harus dicegah dengan satu proses refresh bersama;
- API response HTTP 401 harus mengakhiri atau memulihkan authentication state
  secara terkontrol;
- Content Security Policy harus ditambahkan sebelum production release;
- dependency frontend harus dipantau dan diperbarui secara terkontrol;
- penggunaan `dangerouslySetInnerHTML` harus dihindari atau diaudit secara
  eksplisit.

## Alternatives Considered

### Next.js Backend for Frontend with HttpOnly Session

Dalam alternatif ini, Next.js menggunakan confidential OIDC client, menyimpan
token di server, dan memberikan session cookie HttpOnly kepada browser.

Keuntungan:

- access token dan refresh token tidak terekspos kepada JavaScript browser;
- mendukung authenticated server-side rendering;
- memungkinkan token mediation dan agregasi beberapa backend.

Tidak dipilih untuk milestone ini karena:

- menambah server-side session lifecycle;
- menambah CSRF responsibility;
- membutuhkan refresh-token coordination di server;
- membutuhkan confidential-client configuration tambahan;
- menambah operational state sebelum kebutuhan tersebut terbukti.

Alternatif ini dapat dipertimbangkan kembali apabila authenticated SSR,
service aggregation, atau threat model yang lebih ketat menjadi kebutuhan.

### Auth.js with Keycloak Provider

Auth.js menyediakan integrasi Keycloak dan session abstraction untuk Next.js.

Tidak dipilih karena PHCC saat ini menggunakan public browser client dan
belum membutuhkan server-managed authentication session. Menambah abstraction
session pada tahap ini akan memperluas permukaan implementasi tanpa kebutuhan
produk yang sudah terbukti.

Auth.js tetap dapat dievaluasi kembali bersama opsi BFF.

### Custom OAuth and Session Implementation

Implementasi OAuth flow, token refresh, dan session management buatan sendiri
ditolak.

Security-sensitive protocol handling harus menggunakan adapter atau library
yang terawat dan telah diuji, bukan implementasi application-specific.

### Persist Tokens in Browser Storage

Penyimpanan token di `localStorage` atau `sessionStorage` ditolak karena token
akan tetap tersedia bagi JavaScript yang berjalan pada origin aplikasi dan
dapat bertahan melampaui lifecycle object adapter.

## Consequences

Keuntungan:

- selaras dengan public client `phcc-web` yang sudah tersedia;
- menggunakan adapter resmi Keycloak;
- tidak membutuhkan client secret di browser;
- tidak membutuhkan database session tambahan;
- arsitektur awal lebih sederhana;
- Spring Boot tetap independen sebagai standards-based resource server.

Trade-off:

- token berada dalam memory JavaScript selama authenticated session;
- page reload membutuhkan pemulihan state melalui session Keycloak;
- XSS pada origin frontend dapat mengakses token yang sedang berada di memory;
- authenticated server-side rendering belum tersedia;
- browser berkomunikasi langsung dengan Keycloak dan Spring Boot;
- frontend perlu menangani refresh dan authentication-state transitions
  secara hati-hati.

## Revisit Triggers

Keputusan ini harus dievaluasi kembali apabila salah satu kondisi berikut
terjadi:

- authenticated server-side rendering menjadi kebutuhan;
- browser tidak boleh menerima access token berdasarkan threat model baru;
- PHCC perlu menggabungkan beberapa downstream service;
- token exchange atau delegated access dibutuhkan;
- refresh-token management menjadi sulit dikendalikan di browser;
- compliance mensyaratkan server-managed session;
- risiko XSS tidak dapat diterima untuk deployment target;
- deployment topology membutuhkan Next.js sebagai security boundary.

## References

- Keycloak JavaScript Adapter:
  https://www.keycloak.org/securing-apps/javascript-adapter
- OAuth 2.0 Security Best Current Practice, RFC 9700:
  https://www.rfc-editor.org/rfc/rfc9700
- Auth.js Keycloak Provider:
  https://authjs.dev/getting-started/providers/keycloak
