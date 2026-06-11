"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useDonateModal } from "@/lib/donate-modal-context";
import { useSettings } from "@/lib/settings-context";

export function FloatingDonateButton() {
  const pathname = usePathname();
  const settings = useSettings();
  const { isOpen: open, openDonate, closeDonate } = useDonateModal();
  const [mounted, setMounted] = useState(false);

  const visible = useMemo(() =>
    settings.showFloatingButton && settings.floatingButtonPages.includes(pathname),
  [settings, pathname]);

  const ctaText = settings.donationCtaText;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDonate();
      }
    };

    setMounted(true);
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDonate]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3">
        <button
          type="button"
          onClick={openDonate}
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
                <h2 className="text-2xl font-bold text-gray-950 md:text-3xl">Soutenir l&apos;association</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Le paiement en ligne sera disponible prochainement. En attendant, contactez-nous pour faire un don ou parrainer un projet.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDonate}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-secondary/15 bg-green-50/60 p-5 text-sm leading-7 text-gray-700">
              Chaque contribution finance des actions concretes sur le terrain : eau, sante, education et aide alimentaire.
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link href="/contact" onClick={closeDonate} className="btn-primary btn-lg w-full text-center">
                Nous contacter
              </Link>
              <Link href="/projects" onClick={closeDonate} className="btn-outline btn-lg w-full text-center text-gray-600">
                Voir les projets
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
