"use client";

import { useEffect, useState } from "react";
import { defaultHomeEditorContent, loadHomeContent, type HomeEditorContent, type HeroStat, type EntryPoint, type Pillar, type ProofItem } from "@/lib/admin/home-content";
import { api } from "@/lib/api";

function TextField({ label, value, onChange, helpText, multiline }: {
  label: string; value: string; onChange: (value: string) => void; helpText?: string; multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <Tag value={value} onChange={(e: any) => onChange(e.target.value)} rows={multiline ? 3 : undefined}
        className="w-full rounded-2xl border border-secondary/14 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
      {helpText ? <p className="mt-2 text-sm leading-6 text-gray-500">{helpText}</p> : null}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex gap-3">
        {value ? <img src={value} alt="" className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" /> : null}
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-2xl border border-secondary/14 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
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
        <div key={i} className="rounded-2xl border border-secondary/10 bg-gray-50/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400">#{i + 1}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-xs font-semibold text-red-400">Supprimer</button>
          </div>
          <div className="space-y-2">
            {fields.map((f) => (
              f.type === "textarea"
                ? <textarea key={f.key} placeholder={f.label} value={(item as any)[f.key] || ""} onChange={(e) => set(i, f.key, e.target.value)} rows={2}
                    className="w-full rounded-xl border border-secondary/14 px-4 py-3 text-base outline-none focus:border-primary" />
                : <input key={f.key} placeholder={f.label} value={(item as any)[f.key] || ""} onChange={(e) => set(i, f.key, e.target.value)}
                    className="w-full rounded-xl border border-secondary/14 px-4 py-3 text-base outline-none focus:border-primary" />
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => {
        const empty = {} as T;
        fields.forEach((f) => (empty as any)[f.key] = "");
        onChange([...items, empty]);
      }} className="rounded-button border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/6">+ Ajouter</button>
    </div>
  );
}

const steps = [
  { id: "emergency", label: "Banniere", title: "Banniere d'urgence" },
  { id: "hero", label: "Hero", title: "Hero & stats" },
  { id: "trust", label: "Confiance", title: "Barre & points" },
  { id: "entries", label: "Contenus", title: "Entrees & piliers" },
  { id: "end", label: "Final", title: "Transparence, galerie, CTA" },
] as const;

export function HomePageEditor() {
  const [content, setContent] = useState<HomeEditorContent>(defaultHomeEditorContent);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => { loadHomeContent().then(setContent); }, []);

  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 1800); return () => clearTimeout(t); }, [saved]);

  function update<Key extends keyof HomeEditorContent>(key: Key, value: HomeEditorContent[Key]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function handleSave() {
    try {
      await api.updatePage('home', content);
      setSaved(true);
    } catch {}
  }

  function handleReset() {
    setContent(defaultHomeEditorContent);
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Editeur Accueil</div>
        <h1 className="mt-3 text-4xl font-bold text-gray-950">Tous les elements de l&apos;accueil.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
          Banniere, hero, confiance, points d&apos;entree, piliers, transparence, galerie et CTA don.
        </p>
      </div>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Edition pas a pas</div>
        <div className="grid gap-3 md:grid-cols-5">
          {steps.map((item, index) => {
            const active = index === step; const done = index < step;
            return (
              <button key={item.id} type="button" onClick={() => setStep(index)}
                className={`rounded-[22px] px-4 py-4 text-left transition ${active ? "bg-primary text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)]" : done ? "bg-secondary/10 text-secondary" : "bg-[#f7fbf4] text-gray-700"}`}>
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${active ? "bg-white/20 text-white" : "bg-white text-gray-950"}`}>{index + 1}</div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className={`mt-1 text-xs ${active ? "text-white/80" : "text-gray-500"}`}>{item.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          {step === 0 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 1</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Banniere d&apos;urgence</div>
              <div className="space-y-5">
                <TextField label="Label" value={content.emergencyLabel} onChange={(v) => update("emergencyLabel", v)} />
                <TextField label="Texte" value={content.emergencyText} onChange={(v) => update("emergencyText", v)} multiline />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 2</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Hero principal</div>
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
            </div>
          ) : null}

          {step === 2 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 3</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Barre de confiance</div>
              <div className="space-y-5">
                <ItemsList items={content.proofStrip} onChange={(v) => update("proofStrip", v)} fields={[{ key: "value", label: "Valeur" }, { key: "label", label: "Label" }]} />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 4</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Points d&apos;entree & Piliers</div>
              <div className="space-y-6">
                <div>
                  <div className="mb-3 text-sm font-semibold text-gray-700">Points d&apos;entree</div>
                  <ItemsList items={content.entryPoints} onChange={(v) => update("entryPoints", v)}
                    fields={[{ key: "title", label: "Titre" }, { key: "description", label: "Description", type: "textarea" }, { key: "image", label: "Image (chemin)" }, { key: "cta", label: "CTA" }]} />
                </div>
                <div>
                  <div className="mb-3 text-sm font-semibold text-gray-700">Piliers</div>
                  <ItemsList items={content.pillars} onChange={(v) => update("pillars", v)}
                    fields={[{ key: "title", label: "Titre" }, { key: "description", label: "Description", type: "textarea" }]} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6">
              <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 5</div>
                <div className="mb-5 text-2xl font-bold text-gray-950">Transparence & Galerie</div>
                <div className="space-y-5">
                  <TextField label="Titre transparence" value={content.transparencyTitle} onChange={(v) => update("transparencyTitle", v)} />
                  <TextField label="Description transparence" value={content.transparencyDescription} onChange={(v) => update("transparencyDescription", v)} multiline />
                  <ItemsList items={content.transparencyItems} onChange={(v) => update("transparencyItems", v)} fields={[{ key: "value", label: "Valeur" }, { key: "label", label: "Label" }]} />
                  <hr className="border-secondary/10" />
                  <TextField label="Titre galerie" value={content.galleryTitle} onChange={(v) => update("galleryTitle", v)} />
                  <TextField label="Description galerie" value={content.galleryDescription} onChange={(v) => update("galleryDescription", v)} multiline />
                </div>
              </div>
              <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                <div className="mb-5 text-2xl font-bold text-gray-950">CTA Don & Newsletter</div>
                <div className="space-y-5">
                  <TextField label="Titre CTA don" value={content.donationTitle} onChange={(v) => update("donationTitle", v)} multiline />
                  <TextField label="Description CTA don" value={content.donationDescription} onChange={(v) => update("donationDescription", v)} multiline />
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField label="Bouton don" value={content.donationPrimaryCta} onChange={(v) => update("donationPrimaryCta", v)} />
                    <TextField label="Bouton secondaire" value={content.donationSecondaryCta} onChange={(v) => update("donationSecondaryCta", v)} />
                  </div>
                  <hr className="border-secondary/10" />
                  <TextField label="Titre newsletter" value={content.newsletterTitle} onChange={(v) => update("newsletterTitle", v)} />
                  <TextField label="Description newsletter" value={content.newsletterDescription} onChange={(v) => update("newsletterDescription", v)} multiline />
                </div>
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-secondary/10 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                {saved ? <span className="font-semibold text-secondary">Modifications enregistrees.</span> : "Pense a sauvegarder."}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep((c) => Math.max(0, c - 1))} disabled={step === 0}
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6">Precedent</button>
                <button type="button" onClick={() => setStep((c) => Math.min(steps.length - 1, c + 1))} disabled={step === steps.length - 1}
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6">Suivant</button>
                <button type="button" onClick={handleReset}
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary/6">Reinitialiser</button>
                <button type="button" onClick={handleSave}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Apercu rapide</div>
          <div className="space-y-3 text-sm text-gray-600">
            <div><span className="font-semibold text-gray-900">Banniere:</span> {content.emergencyLabel}</div>
            <div><span className="font-semibold text-gray-900">Hero:</span> {content.heroEyebrow} — {content.heroStats.length} stats</div>
            <div><span className="font-semibold text-gray-900">Confiance:</span> {content.proofStrip.length} elements</div>
            <div><span className="font-semibold text-gray-900">Entrees:</span> {content.entryPoints.length} points</div>
            <div><span className="font-semibold text-gray-900">Piliers:</span> {content.pillars.length} piliers</div>
            <div><span className="font-semibold text-gray-900">Transparence:</span> {content.transparencyItems.length} items</div>
          </div>
        </div>
      </div>
    </section>
  );
}
