"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

export function FloatingDonateButton() {
  const pathname = usePathname();
  const settings = useSettings();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const visible = useMemo(() =>
    settings.showFloatingButton && settings.floatingButtonPages.includes(pathname),
  [settings, pathname]);

  const ctaText = settings.donationCtaText;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    setMounted(true);
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className={`floating-donate-button rounded-full border border-white/60 bg-primary px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all hover:brightness-90 md:text-base ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {ctaText}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-primary/70 p-4 md:items-center">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-950 md:text-3xl">Chaque don sauve des vies</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Votre générosité permet de nourrir des familles, soigner des enfants et construire un avenir.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Choisissez un montant</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { amount: 5000, impact: "Un repas pour 10 familles" },
                { amount: 10000, impact: "Kits scolaires pour 5 enfants" },
                { amount: 25000, impact: "Soins médicaux d'urgence" },
                { amount: 50000, impact: "Parrainage d'un projet entier" }
              ].map(({ amount, impact }) => (
                <button
                  key={amount}
                  className="rounded-xl border-2 border-gray-100 px-4 py-4 text-left transition-all hover:border-primary hover:bg-orange-50"
                >
                  <div className="text-lg font-bold text-gray-900">{amount.toLocaleString("fr-FR")} FCFA</div>
                  <div className="mt-1 text-xs leading-tight text-gray-500">{impact}</div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <input
                type="number"
                placeholder="Montant personnalisé"
                className="w-full rounded-xl border-2 border-gray-100 px-4 py-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-secondary/10 px-4 py-3">
              <input type="checkbox" id="monthly" className="h-4 w-4 accent-secondary" />
              <label htmlFor="monthly" className="text-sm font-medium text-gray-700">
                Mensualiser mon don
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button className="rounded-button bg-primary px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:brightness-90">
                Soutenir maintenant
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-button border-2 border-gray-200 px-6 py-4 text-lg font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-800"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
