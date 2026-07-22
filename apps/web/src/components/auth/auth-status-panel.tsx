"use client";

import { useState } from "react";

import { useAuthentication } from "@/components/auth/auth-provider";

export function AuthStatusPanel() {
  const {
    status,
    user,
    errorMessage,
    login,
    logout,
    fetchApi,
  } = useAuthentication();

  const [identity, setIdentity] = useState<unknown>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [loadingIdentity, setLoadingIdentity] = useState(false);

  async function loadIdentity(): Promise<void> {
    setLoadingIdentity(true);
    setRequestError(null);

    try {
      const response = await fetchApi("/api/v1/me");

      if (!response.ok) {
        throw new Error(
          `The PHCC API returned HTTP ${response.status}.`,
        );
      }

      setIdentity(await response.json());
    } catch (error) {
      setIdentity(null);
      setRequestError(
        error instanceof Error
          ? error.message
          : "The PHCC API request failed.",
      );
    } finally {
      setLoadingIdentity(false);
    }
  }

  if (status === "initializing") {
    return (
      <section
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
        aria-live="polite"
      >
        <p className="text-sm text-slate-300">
          Memeriksa sesi Keycloak…
        </p>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section
        className="rounded-2xl border border-red-400/30 bg-red-950/30 p-6"
        aria-live="assertive"
      >
        <h2 className="text-lg font-semibold text-red-100">
          Authentication tidak dapat diinisialisasi
        </h2>

        <p className="mt-2 text-sm text-red-200">
          {errorMessage}
        </p>

        <button
          type="button"
          className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950"
          onClick={() => window.location.reload()}
        >
          Coba kembali
        </button>
      </section>
    );
  }

  if (status === "unauthenticated") {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Public application shell
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Belum terautentikasi
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
          Masuk melalui Keycloak untuk membuka fitur Production House
          Command Center.
        </p>

        <button
          type="button"
          className="mt-6 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
          onClick={() => void login()}
        >
          Masuk
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-300/20 bg-emerald-950/20 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Authenticated
      </p>

      <h2 className="mt-3 text-2xl font-semibold text-white">
        {user?.username ?? "Pengguna PHCC"}
      </h2>

      <dl className="mt-5 grid gap-3 text-sm">
        <div>
          <dt className="text-slate-400">Subject</dt>
          <dd className="break-all text-slate-100">
            {user?.subject ?? "Tidak tersedia"}
          </dd>
        </div>

        <div>
          <dt className="text-slate-400">Email</dt>
          <dd className="text-slate-100">
            {user?.email ?? "Tidak tersedia"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          disabled={loadingIdentity}
          onClick={() => void loadIdentity()}
        >
          {loadingIdentity
            ? "Memuat identitas…"
            : "Panggil /api/v1/me"}
        </button>

        <button
          type="button"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => void logout()}
        >
          Keluar
        </button>
      </div>

      {requestError ? (
        <p className="mt-5 text-sm text-red-300" role="alert">
          {requestError}
        </p>
      ) : null}

      {identity ? (
        <pre className="mt-5 overflow-x-auto rounded-xl bg-black/30 p-4 text-xs leading-6 text-slate-200">
          {JSON.stringify(identity, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
