import { AuthStatusPanel } from "@/components/auth/auth-status-panel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#15314a_0,_#07111d_42%,_#03070d_100%)] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          PHCC
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Production House Command Center
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Fondasi autentikasi browser menggunakan Keycloak Authorization
          Code dengan PKCE S256.
        </p>

        <div className="mt-10">
          <AuthStatusPanel />
        </div>
      </div>
    </main>
  );
}
