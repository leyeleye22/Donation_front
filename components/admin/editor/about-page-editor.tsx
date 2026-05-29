"use client";

import { useEffect, useState } from "react";
import { defaultAboutEditorContent, loadAboutContent, type AboutEditorContent } from "@/lib/admin/about-content";
import { ImagePicker } from "@/components/admin/editor/image-picker";
import { api } from "@/lib/api";

function TextField({ label, value, onChange, helpText, multiline }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <Tag
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        rows={multiline ? 3 : undefined}
        className="w-full rounded-2xl border border-secondary/14 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {helpText ? <p className="mt-2 text-sm leading-6 text-gray-500">{helpText}</p> : null}
    </div>
  );
}

function ArrayField({ label, values, onChange }: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            rows={2}
            className="w-full rounded-2xl border border-secondary/14 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="rounded-2xl bg-red-50 px-3 text-sm text-red-500 hover:bg-red-100"
          >
            X
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...values, ""])}
        className="rounded-button border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/6"
      >
        + Ajouter
      </button>
    </div>
  );
}

type SubItem<T> = { title: string; text: string } & T;

function SubItemsField<T extends Record<string, any>>({ label, items, onChange, extraFields }: {
  label: string;
  items: SubItem<T>[];
  onChange: (items: SubItem<T>[]) => void;
  extraFields?: (item: SubItem<T>, index: number, update: (updated: SubItem<T>) => void) => any;
}) {
  function updateItem(index: number, field: string, value: string) {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-secondary/10 bg-gray-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">#{i + 1}</span>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-xs font-semibold text-red-400 hover:text-red-600"
            >
              Supprimer
            </button>
          </div>
          <div className="space-y-3">
            <input
              placeholder="Titre"
              value={item.title}
              onChange={(e) => updateItem(i, "title", e.target.value)}
              className="w-full rounded-xl border border-secondary/14 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              placeholder="Texte"
              value={item.text}
              onChange={(e) => updateItem(i, "text", e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-secondary/14 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {extraFields?.(item, i, (updated) => {
              const next = items.map((it, j) => (j === i ? updated : it));
              onChange(next);
            })}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { title: "", text: "" } as any])}
        className="rounded-button border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/6"
      >
        + Ajouter
      </button>
    </div>
  );
}

const steps = [
  { id: "hero", label: "Hero", title: "Hero & statistiques" },
  { id: "association", label: "Association", title: "Presentation & portrait" },
  { id: "founder", label: "Fondateur", title: "Fondateur & recit" },
  { id: "content", label: "Contenus", title: "Valeurs, chronologie & actions" },
  { id: "callout", label: "Callout", title: "Appel a action final" }
] as const;

export function AboutPageEditor() {
  const [content, setContent] = useState<AboutEditorContent>(defaultAboutEditorContent);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => { loadAboutContent().then(setContent).catch(console.error); }, []);

  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 1800); return () => clearTimeout(t); }, [saved]);

  function update<Key extends keyof AboutEditorContent>(key: Key, value: AboutEditorContent[Key]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function handleSave() {
    setSaveError("");
    try {
      await api.updatePage('about', content);
      setSaved(true);
    } catch (e: any) {
      setSaveError(e?.message || "Erreur lors de l'enregistrement.");
      console.error("AboutPageEditor: save failed", e);
    }
  }

  function handleReset() {
    setContent(defaultAboutEditorContent);
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Editeur A propos</div>
        <h1 className="mt-3 text-4xl font-bold text-gray-950">Modifier la page A propos pas a pas.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
          Hero, association, fondateur, valeurs et appel a action.
        </p>
      </div>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Edition pas a pas</div>
        <div className="grid gap-3 md:grid-cols-5">
          {steps.map((item, index) => {
            const active = index === step;
            const done = index < step;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-[22px] px-4 py-4 text-left transition ${active ? "bg-primary text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)]" : done ? "bg-secondary/10 text-secondary" : "bg-[#f7fbf4] text-gray-700"}`}
              >
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
              <div className="mb-5 text-2xl font-bold text-gray-950">Hero & statistiques</div>
              <div className="space-y-5">
                <TextField label="Eyebrow" value={content.heroEyebrow} onChange={(v) => update("heroEyebrow", v)} />
                <TextField label="Titre" value={content.heroTitle} onChange={(v) => update("heroTitle", v)} />
                <TextField label="Description" value={content.heroDescription} onChange={(v) => update("heroDescription", v)} multiline />
                <SubItemsField
                  label="Statistiques cles"
                  items={content.stats.map((s) => ({ title: s.value, text: s.label }))}
                  onChange={(items) => update("stats", items.map((i) => ({ value: i.title, label: i.text })))}
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 2</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Association</div>
              <div className="space-y-5">
                <TextField label="Badge" value={content.associationBadge} onChange={(v) => update("associationBadge", v)} />
                <TextField label="Titre" value={content.associationTitle} onChange={(v) => update("associationTitle", v)} multiline />
                <ArrayField label="Paragraphes" values={content.story} onChange={(v) => update("story", v)} />
                <ImagePicker label="Image portrait / equipe" value={content.portrait} onChange={(v) => update("portrait", v)} />
                <ArrayField label="Recit de l'association" values={content.associationBody} onChange={(v) => update("associationBody", v)} />
                <ImagePicker label="Photo principale" value={content.associationImage} onChange={(v) => update("associationImage", v)} />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 3</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Fondateur</div>
              <div className="space-y-5">
                <TextField label="Badge" value={content.founderBadge} onChange={(v) => update("founderBadge", v)} />
                <TextField label="Titre" value={content.founderTitle} onChange={(v) => update("founderTitle", v)} multiline />
                <TextField label="Sous-titre" value={content.founderSubtitle} onChange={(v) => update("founderSubtitle", v)} multiline />
                <ImagePicker label="Portrait" value={content.founderPortrait} onChange={(v) => update("founderPortrait", v)} />
                <TextField label="Citation" value={content.founderQuote} onChange={(v) => update("founderQuote", v)} multiline />
                <TextField label="Titre du recit" value={content.narrativeTitle} onChange={(v) => update("narrativeTitle", v)} />
                <ArrayField label="Paragraphes du recit" values={content.narrativeParagraphs} onChange={(v) => update("narrativeParagraphs", v)} />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 4</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Valeurs, chronologie & actions</div>
              <div className="space-y-5">
                <SubItemsField
                  label="Valeurs"
                  items={content.values.map((v) => ({ title: v.title, text: v.description }))}
                  onChange={(items) => update("values", items.map((i) => ({ title: i.title, description: i.text })))}
                />
                <SubItemsField
                  label="Chronologie"
                  items={content.timeline.map((t) => ({ title: t.title, text: `${t.year}||${t.text}` }))}
                  onChange={(items) => update("timeline", items.map((i) => {
                    const parts = i.text.split("||");
                    return { year: parts[0] || "", title: i.title, text: parts[1] || "" };
                  }))}
                />
                <SubItemsField
                  label="Actions terrain"
                  items={content.actionStories.map((a) => ({ title: a.title, text: a.text, image: a.image }))}
                  onChange={(items) => update("actionStories", items.map((i) => ({ title: i.title, text: i.text, image: (i as any).image || "" })))}
                  extraFields={(item, _index, update) => (
                    <ImagePicker label="Image" value={(item as any).image || ""} onChange={(v) => update({ ...item, image: v } as any)} />
                  )}
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 5</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Appel a action final</div>
              <div className="space-y-5">
                <TextField label="Titre" value={content.calloutTitle} onChange={(v) => update("calloutTitle", v)} multiline />
                <TextField label="Description" value={content.calloutDescription} onChange={(v) => update("calloutDescription", v)} multiline />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField label="CTA principal" value={content.calloutPrimaryCta} onChange={(v) => update("calloutPrimaryCta", v)} />
                  <TextField label="CTA secondaire" value={content.calloutSecondaryCta} onChange={(v) => update("calloutSecondaryCta", v)} />
                </div>
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-secondary/10 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                {saved ? <span className="font-semibold text-secondary">Modifications enregistrees localement.</span> : "Pense a sauvegarder avant de quitter."}
                {saveError ? <span className="ml-2 font-semibold text-red-500">{saveError}</span> : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep((c) => Math.max(0, c - 1))} disabled={step === 0} className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6">Precedent</button>
                <button type="button" onClick={() => setStep((c) => Math.min(steps.length - 1, c + 1))} disabled={step === steps.length - 1} className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6">Suivant</button>
                <button type="button" onClick={handleReset} className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary/6">Reinitialiser</button>
                <button type="button" onClick={handleSave} className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Apercu rapide</div>
          <div className="space-y-4 text-sm text-gray-600">
            <div><span className="font-semibold text-gray-900">Hero:</span> {content.heroEyebrow} — {content.heroTitle.slice(0, 60)}...</div>
            <div><span className="font-semibold text-gray-900">Association:</span> {content.associationBadge} — {content.story.length} paragraphes</div>
            <div><span className="font-semibold text-gray-900">Fondateur:</span> {content.founderBadge} — {content.narrativeParagraphs.length} paragraphes</div>
            <div><span className="font-semibold text-gray-900">Valeurs:</span> {content.values.length} valeurs</div>
            <div><span className="font-semibold text-gray-900">Timeline:</span> {content.timeline.length} etapes</div>
            <div><span className="font-semibold text-gray-900">Actions:</span> {content.actionStories.length} recits</div>
            <div><span className="font-semibold text-gray-900">Callout:</span> {content.calloutPrimaryCta} / {content.calloutSecondaryCta}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
