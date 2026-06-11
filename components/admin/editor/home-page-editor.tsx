"use client";

import { useEffect, useState } from "react";
import { defaultHomeEditorContent, loadHomeContent, type HomeEditorContent } from "@/lib/admin/home-content";
import { api } from "@/lib/api";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { AdminTabs } from "@/components/admin/ui/admin-tabs";
import { PageHeader } from "@/components/admin/ui/page-header";

function TextField({ label, value, onChange, helpText, multiline }: {
  label: string; value: string; onChange: (value: string) => void; helpText?: string; multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="admin-label">{label}</label>
      <Tag value={value} onChange={(e: any) => onChange(e.target.value)} rows={multiline ? 3 : undefined}
        className={multiline ? "admin-textarea" : "admin-input"} />
      {helpText ? <p className="mt-2 text-sm leading-6 text-slate-500">{helpText}</p> : null}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="flex gap-3">
        {value ? <img src={value} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" /> : null}
        <input value={value} onChange={(e) => onChange(e.target.value)} className="admin-input flex-1" />
      </div>
    </div>
  );
}

function ItemsList<T extends { title?: string; text?: string; value?: string; label?: string }>({ items, onChange, fields }: {
  items: T[]; onChange: (items: T[]) => void; fields: { key: string; label: string; type?: "text" | "textarea" }[];
}) {
  function set(i: number, key: string, val: string) {
    const next = items.map((item, j) => (j === i ? { ...item, [key]: val } : item));
    onChange(next);
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="admin-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">#{i + 1}</span>
            <AdminButton variant="danger" className="px-2 py-1 text-xs" onClick={() => onChange(items.filter((_, j) => j !== i))}>Supprimer</AdminButton>
          </div>
          <div className="space-y-2">
            {fields.map((f) => (
              f.type === "textarea"
                ? <textarea key={f.key} placeholder={f.label} value={(item as any)[f.key] || ""} onChange={(e) => set(i, f.key, e.target.value)} rows={2}
                    className="admin-textarea" />
                : <input key={f.key} placeholder={f.label} value={(item as any)[f.key] || ""} onChange={(e) => set(i, f.key, e.target.value)}
                    className="admin-input" />
            ))}
          </div>
        </div>
      ))}
      <AdminButton variant="secondary" onClick={() => {
        const empty = {} as T;
        fields.forEach((f) => (empty as any)[f.key] = "");
        onChange([...items, empty]);
      }}>+ Ajouter</AdminButton>
    </div>
  );
}

const steps = [
  { id: "emergency", label: "Banniere", title: "Banniere d'urgence" },
  { id: "hero", label: "Hero", title: "Hero & stats" },
  { id: "trust", label: "Confiance", title: "Barre & points" },
  { id: "entries", label: "Contenus", title: "Entrees & piliers" },
  { id: "testimonials", label: "Temoignages", title: "Temoignages terrain" },
  { id: "end", label: "Final", title: "Transparence, galerie, CTA" },
] as const;

export function HomePageEditor() {
  const [content, setContent] = useState<HomeEditorContent>(defaultHomeEditorContent);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => { loadHomeContent().then(setContent).catch(console.error); }, []);

  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 1800); return () => clearTimeout(t); }, [saved]);

  function update<Key extends keyof HomeEditorContent>(key: Key, value: HomeEditorContent[Key]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function handleSave() {
    setSaveError("");
    try {
      await api.updatePage("home", content);
      setSaved(true);
    } catch (e: any) {
      setSaveError(e?.message || "Erreur lors de l'enregistrement.");
      console.error("HomePageEditor: save failed", e);
    }
  }

  function handleReset() {
    setContent(defaultHomeEditorContent);
  }

  const activeStepId = steps[step].id;

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Site public"
        title="Editeur page d'accueil"
        description="Banniere, hero, confiance, points d'entree, piliers, transparence, galerie et CTA don."
        meta={saved ? <span className="admin-badge-success">Modifications enregistrees</span> : <span className="admin-badge-neutral">Edition pas a pas</span>}
      />

      {saveError ? <AdminAlert tone="error">{saveError}</AdminAlert> : null}

      <AdminCard padding="md">
        <div className="admin-eyebrow-alt mb-4">Etapes d&apos;edition</div>
        <AdminTabs
          tabs={steps.map((s) => ({ id: s.id, label: s.label }))}
          active={activeStepId}
          onChange={(id) => setStep(steps.findIndex((s) => s.id === id))}
        />
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          {step === 0 ? (
            <AdminCard padding="lg">
              <div className="admin-eyebrow-alt mb-2">Etape 1</div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">Banniere d&apos;urgence</h2>
              <div className="space-y-5">
                <TextField label="Label" value={content.emergencyLabel} onChange={(v) => update("emergencyLabel", v)} />
                <TextField label="Texte" value={content.emergencyText} onChange={(v) => update("emergencyText", v)} multiline />
              </div>
            </AdminCard>
          ) : null}

          {step === 1 ? (
            <AdminCard padding="lg">
              <div className="admin-eyebrow-alt mb-2">Etape 2</div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">Hero principal</h2>
              <div className="space-y-5">
                <TextField label="Eyebrow" value={content.heroEyebrow} onChange={(v) => update("heroEyebrow", v)} />
                <TextField label="Titre" value={content.heroTitle} onChange={(v) => update("heroTitle", v)} multiline />
                <TextField label="Description" value={content.heroDescription} onChange={(v) => update("heroDescription", v)} multiline />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField label="Bouton principal" value={content.primaryCta} onChange={(v) => update("primaryCta", v)} />
                  <TextField label="Bouton secondaire" value={content.secondaryCta} onChange={(v) => update("secondaryCta", v)} />
                </div>
                <ItemsList items={content.heroStats} onChange={(v) => update("heroStats", v)} fields={[{ key: "value", label: "Valeur" }, { key: "label", label: "Label" }]} />
                <ItemsList items={content.trustPoints.map((t) => ({ text: t }))} onChange={(v) => update("trustPoints", v.map((i) => i.text || ""))} fields={[{ key: "text", label: "Point de confiance", type: "textarea" }]} />
                <TextField label="Label du focus" value={content.featuredLabel} onChange={(v) => update("featuredLabel", v)} />
                <TextField label="Titre du focus" value={content.featuredTitle} onChange={(v) => update("featuredTitle", v)} multiline />
                <TextField label="Description du focus" value={content.featuredDescription} onChange={(v) => update("featuredDescription", v)} multiline />
                <div className="grid gap-5 md:grid-cols-2">
                  <ImageField label="Image hero" value={content.heroImage} onChange={(v) => update("heroImage", v)} />
                  <ImageField label="Image support" value={content.supportImage} onChange={(v) => update("supportImage", v)} />
                </div>
              </div>
            </AdminCard>
          ) : null}

          {step === 2 ? (
            <AdminCard padding="lg">
              <div className="admin-eyebrow-alt mb-2">Etape 3</div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">Barre de confiance</h2>
              <ItemsList items={content.proofStrip} onChange={(v) => update("proofStrip", v)} fields={[{ key: "value", label: "Valeur" }, { key: "label", label: "Label" }]} />
            </AdminCard>
          ) : null}

          {step === 3 ? (
            <AdminCard padding="lg">
              <div className="admin-eyebrow-alt mb-2">Etape 4</div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">Points d&apos;entree & Piliers</h2>
              <div className="space-y-6">
                <div>
                  <div className="admin-label mb-3">Points d&apos;entree</div>
                  <ItemsList items={content.entryPoints} onChange={(v) => update("entryPoints", v)}
                    fields={[{ key: "title", label: "Titre" }, { key: "description", label: "Description", type: "textarea" }, { key: "image", label: "Image (chemin)" }, { key: "cta", label: "CTA" }]} />
                </div>
                <div>
                  <div className="admin-label mb-3">Piliers</div>
                  <ItemsList items={content.pillars} onChange={(v) => update("pillars", v)}
                    fields={[{ key: "title", label: "Titre" }, { key: "description", label: "Description", type: "textarea" }]} />
                </div>
              </div>
            </AdminCard>
          ) : null}

          {step === 4 ? (
            <AdminCard padding="lg">
              <div className="admin-eyebrow-alt mb-2">Etape 5</div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">Temoignages terrain</h2>
              <ItemsList items={content.testimonials} onChange={(v) => update("testimonials", v)}
                fields={[{ key: "name", label: "Nom" }, { key: "location", label: "Localisation" }, { key: "text", label: "Temoignage", type: "textarea" }, { key: "role", label: "Role / Fonction" }]} />
            </AdminCard>
          ) : null}

          {step === 5 ? (
            <div className="space-y-6">
              <AdminCard padding="lg">
                <div className="admin-eyebrow-alt mb-2">Etape 6</div>
                <h2 className="mb-5 text-xl font-bold text-slate-900">Transparence & Galerie</h2>
                <div className="space-y-5">
                  <TextField label="Titre transparence" value={content.transparencyTitle} onChange={(v) => update("transparencyTitle", v)} />
                  <TextField label="Description transparence" value={content.transparencyDescription} onChange={(v) => update("transparencyDescription", v)} multiline />
                  <ItemsList items={content.transparencyItems} onChange={(v) => update("transparencyItems", v)} fields={[{ key: "value", label: "Valeur" }, { key: "label", label: "Label" }]} />
                  <hr className="border-slate-100" />
                  <TextField label="Titre galerie" value={content.galleryTitle} onChange={(v) => update("galleryTitle", v)} />
                  <TextField label="Description galerie" value={content.galleryDescription} onChange={(v) => update("galleryDescription", v)} multiline />
                </div>
              </AdminCard>
              <AdminCard padding="lg">
                <h2 className="mb-5 text-xl font-bold text-slate-900">CTA Don & Newsletter</h2>
                <div className="space-y-5">
                  <TextField label="Titre CTA don" value={content.donationTitle} onChange={(v) => update("donationTitle", v)} multiline />
                  <TextField label="Description CTA don" value={content.donationDescription} onChange={(v) => update("donationDescription", v)} multiline />
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField label="Bouton don" value={content.donationPrimaryCta} onChange={(v) => update("donationPrimaryCta", v)} />
                    <TextField label="Bouton secondaire" value={content.donationSecondaryCta} onChange={(v) => update("donationSecondaryCta", v)} />
                  </div>
                  <hr className="border-slate-100" />
                  <TextField label="Titre newsletter" value={content.newsletterTitle} onChange={(v) => update("newsletterTitle", v)} />
                  <TextField label="Description newsletter" value={content.newsletterDescription} onChange={(v) => update("newsletterDescription", v)} multiline />
                </div>
              </AdminCard>
            </div>
          ) : null}

          <div className="admin-surface sticky bottom-4 z-20 p-4 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {saved ? <span className="font-semibold text-emerald-600">Modifications enregistrees.</span> : "Pense a sauvegarder."}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AdminButton variant="ghost" onClick={() => setStep((c) => Math.max(0, c - 1))} disabled={step === 0}>Precedent</AdminButton>
                <AdminButton variant="ghost" onClick={() => setStep((c) => Math.min(steps.length - 1, c + 1))} disabled={step === steps.length - 1}>Suivant</AdminButton>
                <AdminButton variant="secondary" onClick={handleReset}>Reinitialiser</AdminButton>
                <AdminButton onClick={handleSave}>Enregistrer</AdminButton>
              </div>
            </div>
          </div>
        </div>

        <AdminCard padding="lg" className="h-fit">
          <div className="admin-eyebrow-alt mb-4">Apercu rapide</div>
          <div className="space-y-3 text-sm text-slate-600">
            <div><span className="font-semibold text-slate-900">Banniere:</span> {content.emergencyLabel}</div>
            <div><span className="font-semibold text-slate-900">Hero:</span> {content.heroEyebrow} — {content.heroStats.length} stats</div>
            <div><span className="font-semibold text-slate-900">Confiance:</span> {content.proofStrip.length} elements</div>
            <div><span className="font-semibold text-slate-900">Entrees:</span> {content.entryPoints.length} points</div>
            <div><span className="font-semibold text-slate-900">Piliers:</span> {content.pillars.length} piliers</div>
            <div><span className="font-semibold text-slate-900">Transparence:</span> {content.transparencyItems.length} items</div>
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
