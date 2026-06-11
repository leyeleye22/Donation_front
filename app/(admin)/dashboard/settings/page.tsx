"use client";

import { useEffect, useState } from "react";
import { loadGlobalSettings, saveGlobalSettings, type GlobalSettings, defaultGlobalSettings } from "@/lib/admin/global-settings";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { AdminTabs } from "@/components/admin/ui/admin-tabs";
import { PageHeader } from "@/components/admin/ui/page-header";

const allRoutes = ["/", "/about", "/projects", "/journal", "/gallery", "/contact"];
const routeLabels: Record<string, string> = {
  "/": "Accueil",
  "/about": "A propos",
  "/projects": "Projets",
  "/journal": "Actualites",
  "/gallery": "Galerie",
  "/contact": "Contact",
};

const sectionLabels: Record<string, string> = {
  emergencyBanner: "Banniere d'urgence",
  hero: "Hero",
  trustBar: "Barre de confiance",
  entryPoints: "Points d'entree",
  projects: "Projets",
  mission: "Mission",
  journal: "Journal",
  transparency: "Transparence",
  gallery: "Galerie",
  donationCta: "CTA Don",
  newsletter: "Newsletter",
  footer: "Footer",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultGlobalSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

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
          [section]: !current,
        },
      },
    };
    setSettings(updated);
    saveGlobalSettings(updated);
    setSaved(true);
  }

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Parametres globaux"
        description="Controlez le nom du site, les CTA, la visibilite des sections et le bouton flottant de don."
        meta={saved ? <span className="admin-badge-success">Enregistre</span> : null}
      />

      <AdminTabs
        tabs={[
          { id: "general", label: "General" },
          { id: "pages", label: "Visibilite pages" },
          { id: "floating", label: "Bouton flottant" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "general" ? (
        <AdminCard padding="lg">
          <h2 className="text-base font-bold text-slate-900">Informations generales</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="admin-label">Nom du site</label>
              <input value={settings.siteName} onChange={(e) => update({ siteName: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Texte du bouton Don</label>
              <input value={settings.donationCtaText} onChange={(e) => update({ donationCtaText: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Copyright footer</label>
              <input value={settings.footerCopyright} onChange={(e) => update({ footerCopyright: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Intro footer</label>
              <textarea value={settings.footerIntro} onChange={(e) => update({ footerIntro: e.target.value })} rows={2} className="admin-textarea" />
            </div>
          </div>
        </AdminCard>
      ) : null}

      {activeTab === "pages" ? (
        <div className="space-y-4">
          {allRoutes.map((route) => (
            <AdminCard key={route} padding="lg">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-900">{routeLabels[route]}</span>
                <span className="admin-badge-neutral">{route}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(sectionLabels).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.pageVisibility[route]?.[key as keyof typeof settings.pageVisibility[string]] ?? true}
                      onChange={() => togglePageVisibility(route, key)}
                      className="h-4 w-4 rounded border-slate-300 text-primary accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </AdminCard>
          ))}
        </div>
      ) : null}

      {activeTab === "floating" ? (
        <AdminCard padding="lg">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Bouton flottant « Faire un don »</div>
              <div className="text-xs text-slate-500">Afficher ou masquer le bouton flottant sur le site public</div>
            </div>
            <button
              type="button"
              onClick={() => update({ showFloatingButton: !settings.showFloatingButton })}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${settings.showFloatingButton ? "bg-primary" : "bg-slate-200"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${settings.showFloatingButton ? "translate-x-[22px]" : "translate-x-0.5"} mt-0.5`} />
            </button>
          </label>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="admin-label mb-3">Pages d&apos;affichage</div>
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
                    className="h-4 w-4 rounded border-slate-300 text-primary accent-primary"
                  />
                  <span className="text-sm text-slate-900">{routeLabels[route]}</span>
                  <span className="text-xs text-slate-400">{route}</span>
                </label>
              ))}
            </div>
          </div>
        </AdminCard>
      ) : null}
    </AdminPage>
  );
}
