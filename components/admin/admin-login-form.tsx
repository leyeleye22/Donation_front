"use client";

import { useState } from "react";
import { adminLogin } from "@/lib/admin-auth";
import { assetUrl } from "@/lib/config";
import { IconHeart } from "@/components/admin/icons";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Renseignez l'email et le mot de passe pour continuer.");
      return;
    }

    setSubmitting(true);
    try {
      const ok = await adminLogin(email.trim(), password);
      if (ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Identifiants invalides. Verifiez vos acces.");
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="admin-shell flex min-h-screen bg-[var(--admin-bg)]">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-secondary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_42%)]" />
        <div className="relative flex items-center gap-3">
          <img src={assetUrl("/assets/logo.png")} alt="Logo" className="h-12 w-12" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">Entr&apos;aide</div>
            <div className="text-lg font-bold text-white">Centre de decision ONG</div>
          </div>
        </div>
        <div className="relative max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            <IconHeart className="h-4 w-4" />
            Gestion humanitaire
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
            Pilotez vos programmes, votre collecte et votre communication depuis un seul espace.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/85">
            Tableau de bord oriente decision : impact terrain, transparence financiere, relation donateurs et contenu public.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Impact", "Finances", "Confiance"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white">{item}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-sm text-white/70">Association Entraide Humanitaire</p>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <img src={assetUrl("/assets/logo.png")} alt="Logo" className="mx-auto h-14 w-14 lg:mx-0" />
            <h2 className="mt-5 text-2xl font-bold text-slate-900">Connexion securisee</h2>
            <p className="mt-2 text-sm text-slate-500">Accedez au centre de pilotage de l&apos;association.</p>
          </div>

          <div className="admin-surface p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="admin-email" className="admin-label">Email</label>
                <input
                  id="admin-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="admin-input"
                  placeholder="admin@entraide-humanitaire.org"
                  type="email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="admin-label">Mot de passe</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="admin-input pr-12"
                    placeholder="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error ? <div className="admin-alert-error">{error}</div> : null}

              <button type="submit" disabled={submitting} className="admin-btn-primary w-full disabled:opacity-60">
                {submitting ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400 lg:text-left">
            Besoin d&apos;aide ? Contactez l&apos;equipe technique de l&apos;association.
          </p>
        </div>
      </div>
    </section>
  );
}
