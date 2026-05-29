"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/admin-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@entraide-humanitaire.org");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Renseigne l'email et le mot de passe pour continuer.");
      return;
    }

    setSubmitting(true);

    try {
      const ok = await adminLogin(email.trim(), password);
      if (ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Identifiants invalides. Verifie tes acces.");
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(239,146,33,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_bottom,rgba(65,182,75,0.10)_0%,transparent_50%),linear-gradient(180deg,#ffffff_0%,#f7fbf4_100%)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="http://localhost:8001/assets/logo.png" alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Entr&apos;aide pour servir l&apos;humanité</h1>
          <p className="mt-1 text-sm text-gray-500">Espace d&apos;administration</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="admin-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="admin@entraide.org"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="admin-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Mot de passe"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Application de gestion &mdash; Association Entraide Humanitaire
        </p>
      </div>
    </section>
  );
}
