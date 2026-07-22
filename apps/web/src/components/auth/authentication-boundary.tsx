"use client";

import { type ReactNode, useState } from "react";

import { useAuthentication } from "@/components/auth/auth-provider";

type AuthenticationBoundaryProps = Readonly<{
  children: ReactNode;
}>;

function readErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Login tidak dapat dimulai.";
}

export function AuthenticationBoundary({
  children,
}: AuthenticationBoundaryProps) {
  const { status, errorMessage, login } = useAuthentication();
  const [loginError, setLoginError] = useState<string | null>(
    null,
  );
  const [loginPending, setLoginPending] = useState(false);

  async function beginLogin(): Promise<void> {
    setLoginPending(true);
    setLoginError(null);

    try {
      await login();
    } catch (error) {
      setLoginError(readErrorMessage(error));
      setLoginPending(false);
    }
  }

  if (status === "initializing") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#03070d] px-6 text-white">
        <section
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8"
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            PHCC Workspace
          </p>

          <h1 className="mt-4 text-2xl font-semibold">
            Memeriksa akses workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Menyelaraskan sesi browser dengan Keycloak.
          </p>
        </section>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#03070d] px-6 text-white">
        <section
          className="w-full max-w-lg rounded-2xl border border-red-400/30 bg-red-950/30 p-8"
          aria-live="assertive"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-200">
            PHCC Workspace
          </p>

          <h1 className="mt-4 text-2xl font-semibold text-red-50">
            Workspace tidak dapat memverifikasi sesi
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-100">
            {errorMessage ?? "Terjadi kesalahan autentikasi."}
          </p>

          <button
            type="button"
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950"
            onClick={() => window.location.reload()}
          >
            Coba kembali
          </button>
        </section>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#03070d] px-6 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Protected workspace
          </p>

          <h1 className="mt-4 text-3xl font-semibold">
            Autentikasi diperlukan
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Masuk melalui Keycloak untuk membuka workspace Production
            House Command Center.
          </p>

          <button
            type="button"
            className="mt-6 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loginPending}
            onClick={() => void beginLogin()}
          >
            {loginPending ? "Membuka Keycloak..." : "Masuk ke workspace"}
          </button>

          {loginError ? (
            <p className="mt-4 text-sm text-red-300" role="alert">
              {loginError}
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return children;
}
