"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";

import { useAuthentication } from "@/components/auth/auth-provider";

type ApplicationShellProps = Readonly<{
  children: ReactNode;
}>;

function readErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Logout tidak dapat diselesaikan.";
}

export function ApplicationShell({
  children,
}: ApplicationShellProps) {
  const { user, logout } = useAuthentication();
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(
    null,
  );

  const displayName =
    user?.username ?? user?.email ?? "Pengguna PHCC";

  async function signOut(): Promise<void> {
    setLogoutPending(true);
    setLogoutError(null);

    try {
      await logout();
    } catch (error) {
      setLogoutError(readErrorMessage(error));
      setLogoutPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03070d] text-white">
      <a
        href="#workspace-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Lewati ke konten utama
      </a>

      <header className="border-b border-white/10 bg-[#07111d]/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
          <Link
            href="/workspace"
            className="mr-auto flex items-baseline gap-3"
          >
            <span className="text-sm font-bold tracking-[0.24em] text-cyan-300">
              PHCC
            </span>

            <span className="text-sm font-semibold text-slate-100">
              Workspace
            </span>
          </Link>

          <nav aria-label="Navigasi utama">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            >
              Beranda publik
            </Link>
          </nav>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">Akun aktif</p>
              <p className="max-w-48 truncate text-sm font-semibold text-slate-100">
                {displayName}
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={logoutPending}
              onClick={() => void signOut()}
            >
              {logoutPending ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </div>

        {logoutError ? (
          <div className="mx-auto max-w-7xl px-6 pb-4">
            <p
              className="rounded-lg border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {logoutError}
            </p>
          </div>
        ) : null}
      </header>

      <main
        id="workspace-content"
        className="mx-auto w-full max-w-7xl px-6 py-10"
      >
        {children}
      </main>
    </div>
  );
}
