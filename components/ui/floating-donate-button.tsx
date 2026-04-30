"use client";

import { useEffect, useState } from "react";

export function FloatingDonateButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className={`floating-donate-button flex items-center gap-3 rounded-full border border-white/60 bg-primary px-4 py-3 text-left text-white shadow-2xl transition-all hover:bg-orange-600 md:px-5 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 text-xs font-bold uppercase tracking-[0.14em]">
            Don
          </span>
          <span className="pr-1">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-100">Donation</span>
            <span className="block text-sm font-semibold md:text-base">Faire une donation</span>
          </span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 md:items-center">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Don</div>
                <h2 className="text-3xl font-bold text-gray-950">Soutenir les actions humanitaires</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Ce module est encore simulé, mais il prépare un vrai parcours de don lié aux projets, aux images et aux mises à jour du terrain.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[10000, 25000, 50000, 100000].map((amount) => (
                <button key={amount} className="donation-amount">
                  <div className="text-lg font-semibold">{amount.toLocaleString("fr-FR")} FCFA</div>
                  <div className="mt-1 text-sm text-gray-500">Affectation humanitaire</div>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <input
                type="number"
                placeholder="Autre montant"
                className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button className="rounded-button bg-gray-950 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary">
                Continuer le don
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-button border border-gray-300 px-6 py-4 text-lg font-semibold text-gray-900 transition-colors hover:border-primary hover:text-primary"
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
