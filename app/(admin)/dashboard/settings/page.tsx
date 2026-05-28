"use client";

import { useEffect, useState } from "react";
import { loadGlobalSettings, saveGlobalSettings, type GlobalSettings, defaultGlobalSettings } from "@/lib/admin/global-settings";

const SETTINGS_STORAGE_KEY = "entraide-admin-nav-items";

const allRoutes = ["/", "/about", "/projects", "/journal", "/gallery", "/contact"];
const routeLabels: Record<string, string> = {
  "/": "Accueil",
  "/about": "À propos",
  "/projects": "Projets",
  "/journal": "Actualités",
  "/gallery": "Galerie",
  "/contact": "Contact"
};

const sectionLabels: Record<string, string> = {
  emergencyBanner: "Bannière d'urgence",
  hero: "Hero",
  trustBar: "Barre de confiance",
  entryPoints: "Points d'entrée",
  projects: "Projets",
  mission: "Mission",
  journal: "Journal",
  transparency: "Transparence",
  gallery: "Galerie",
  donationCta: "CTA Don",
  newsletter: "Newsletter",
  footer: "Footer"
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultGlobalSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "pages" | "floating">("general");

  useEffect(() => {
    loadGlobalSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  function update(partial: Partial<GlobalSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveGlobalSettings(next);
    setSaved(true);
  }

  function togglePageVisibility(page: string, section: string) {
    const current = settings.pageVisibility[page]?.[section as keyof typeof settings.pageVisibility[string]];
    const updated = {
      ...settings,
      pageVisibility: {
        ...settings.pageVisibility,
        [page]: {
          ...settings.pageVisibility[page],
          [section]: !current
        }
      }
    };
    setSettings(updated);
    saveGlobalSettings(updated);
    setSaved(true);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Paramètres</h1>
          <p className="text-xs text-gray-500">Contrôle global du site, pages, visibilité et CTA</p>
        </div>
        {saved ? <span className="text-xs font-semibold text-secondary">Enregistré</span> : null}
      </div>

      <div className="flex gap-2 border-b border-gray-100 pb-px">
        {([["general", "Général"], ["pages", "Pages"], ["floating", "Bouton flottant"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "general" ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Nom du site</label>
                <input
                  value={settings.siteName}
                  onChange={(e) => update({ siteName: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Texte du bouton Don</label>
                <input
                  value={settings.donationCtaText}
                  onChange={(e) => update({ donationCtaText: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Copyright footer</label>
                <input
                  value={settings.footerCopyright}
                  onChange={(e) => update({ footerCopyright: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Texte d&apos;intro footer</label>
                <textarea
                  value={settings.footerIntro}
                  onChange={(e) => update({ footerIntro: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "pages" ? (
        <div className="space-y-4">
          {allRoutes.map((route) => (
            <div key={route} className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 px-5 py-3">
                <span className="text-sm font-semibold text-gray-900">{routeLabels[route]}</span>
                <span className="ml-2 text-xs text-gray-400">{route}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(sectionLabels).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.pageVisibility[route]?.[key as keyof typeof settings.pageVisibility[string]] ?? true}
                      onChange={() => togglePageVisibility(route, key)}
                      className="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "floating" ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">Bouton flottant &quot;Faire un don&quot;</div>
                <div className="text-xs text-gray-500">Afficher ou masquer le bouton flottant sur le site</div>
              </div>
              <button
                onClick={() => update({ showFloatingButton: !settings.showFloatingButton })}
                className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors ${settings.showFloatingButton ? "bg-primary" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${settings.showFloatingButton ? "translate-x-[18px]" : "translate-x-[2px]"} mt-0.5`} />
              </button>
            </label>

            <div className="border-t border-gray-100 pt-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Pages d&apos;affichage</div>
              <div className="space-y-2">
                {allRoutes.map((route) => (
                  <label key={route} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.floatingButtonPages.includes(route)}
                      onChange={() => {
                        const updated = settings.floatingButtonPages.includes(route)
                          ? settings.floatingButtonPages.filter((r) => r !== route)
                          : [...settings.floatingButtonPages, route];
                        update({ floatingButtonPages: updated });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                    />
                    <div>
                      <span className="text-sm text-gray-900">{routeLabels[route]}</span>
                      <span className="ml-2 text-xs text-gray-400">{route}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
