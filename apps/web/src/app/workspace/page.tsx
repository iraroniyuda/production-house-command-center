export default function WorkspacePage() {
  return (
    <section
      className="grid gap-8"
      aria-labelledby="workspace-heading"
    >
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Authenticated application shell
        </p>

        <h1
          id="workspace-heading"
          className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Workspace Production House
        </h1>

        <p className="mt-5 text-base leading-7 text-slate-300">
          Area ini hanya dirender setelah sesi Keycloak berhasil
          diverifikasi oleh browser authentication boundary.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-300/20 bg-emerald-950/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Access state
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            Sesi terautentikasi
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Identitas akun dan logout tersedia melalui shell, sementara
            keputusan authorization tetap menjadi tanggung jawab API.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Current scope
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            Fondasi sebelum workflow domain
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Belum ada data operasional, metrik, atau modul produksi
            simulasi. Area domain akan ditambahkan setelah fondasi
            authorization kontekstual tersedia.
          </p>
        </article>
      </div>

      <section className="rounded-2xl border border-cyan-300/20 bg-cyan-950/20 p-6">
        <h2 className="text-xl font-semibold text-white">
          Lapisan implementasi berikutnya
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Application-user provisioning, contextual authorization,
          kemudian fondasi organization, membership, dan project akan
          mengisi workspace ini dengan data operasional nyata.
        </p>
      </section>
    </section>
  );
}
