"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_SESSION_KEY, type MockAdminSession } from "@/lib/admin-auth";
import { mockAdminCredentials } from "@/lib/mock-data/admin";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(mockAdminCredentials.email);
  const [password, setPassword] = useState<string>(mockAdminCredentials.password);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const helperText = useMemo(() => {
    return `Demo front only: ${mockAdminCredentials.email} / ${mockAdminCredentials.password}`;
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Renseigne l'email et le mot de passe pour continuer.");
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));

    const validEmail = email.trim().toLowerCase() === mockAdminCredentials.email.toLowerCase();
    const validPassword = password === mockAdminCredentials.password;

    if (!validEmail || !validPassword) {
      setSubmitting(false);
      setError("Identifiants invalides. Utilise les acces de demonstration affiches sous le formulaire.");
      return;
    }

    const session: MockAdminSession = {
      email: mockAdminCredentials.email,
      loggedInAt: new Date().toISOString()
    };

    window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(239,146,33,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(65,182,75,0.18),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f7fbf4_54%,_#fff7ed_100%)] py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="rounded-[36px] border border-white/60 bg-white/88 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur lg:p-10">
          <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Espace admin
          </div>
          <h1 className="text-4xl font-bold leading-tight text-gray-950">Connexion admin pour piloter le contenu du site.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
            Pour cette phase, on simule une connexion propre afin de valider l&apos;experience du back-office avant le branchement Laravel.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-primary/6 p-5">
              <div className="text-2xl font-bold text-gray-950">1</div>
              <div className="mt-1 text-sm text-gray-600">admin unique</div>
            </div>
            <div className="rounded-[24px] bg-secondary/6 p-5">
              <div className="text-2xl font-bold text-gray-950">Mock</div>
              <div className="mt-1 text-sm text-gray-600">session locale</div>
            </div>
            <div className="rounded-[24px] bg-[#fff3df] p-5">
              <div className="text-2xl font-bold text-gray-950">Next</div>
              <div className="mt-1 text-sm text-gray-600">Laravel a brancher</div>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-secondary/10 bg-[#f7fbf4] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Ce que l&apos;admin gerera</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
              <li>Projets, statuts, progressions et details.</li>
              <li>Journal, galeries et images de terrain.</li>
              <li>Textes homepage, About, CTA et contenus globaux.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[36px] border border-secondary/12 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Authentification</div>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Se connecter</h2>
            </div>
            <div className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Demo
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-gray-700">
                Email admin
              </label>
              <input
                id="admin-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-secondary/14 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="admin@association.org"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <input
                id="admin-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-secondary/14 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Mot de passe"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <div className="rounded-[24px] border border-primary/12 bg-primary/6 p-4 text-sm leading-6 text-gray-700">
              <div className="font-semibold text-gray-950">Acces de demonstration</div>
              <div className="mt-1">{helperText}</div>
            </div>

            {error ? (
              <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-button bg-primary px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(239,146,33,0.24)] transition hover:-translate-y-0.5 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Connexion..." : "Acceder au dashboard"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
