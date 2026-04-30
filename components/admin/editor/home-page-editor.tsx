"use client";

import { useEffect, useState } from "react";
import { defaultHomeEditorContent, HOME_EDITOR_STORAGE_KEY, type HomeEditorContent } from "@/lib/admin/home-content";
import { RichTextEditor } from "@/components/admin/editor/rich-text-editor";
import { HomeEditorPreview } from "@/components/admin/editor/home-editor-preview";

function TextField({
  label,
  value,
  onChange,
  helpText
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-secondary/14 px-4 py-3.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {helpText ? <p className="mt-2 text-sm leading-6 text-gray-500">{helpText}</p> : null}
    </div>
  );
}

const steps = [
  { id: "emergency", label: "Banniere", title: "Banniere d'urgence" },
  { id: "hero", label: "Hero", title: "Hero principal" },
  { id: "trust", label: "Confiance", title: "Bloc de confiance" },
  { id: "mission", label: "Mission", title: "Mission et newsletter" }
] as const;

export function HomePageEditor() {
  const [content, setContent] = useState<HomeEditorContent>(defaultHomeEditorContent);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const raw = window.localStorage.getItem(HOME_EDITOR_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as HomeEditorContent;
      setContent(parsed);
    } catch {
      window.localStorage.removeItem(HOME_EDITOR_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timeout = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  function updateField<Key extends keyof HomeEditorContent>(key: Key, value: HomeEditorContent[Key]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    window.localStorage.setItem(HOME_EDITOR_STORAGE_KEY, JSON.stringify(content));
    setSaved(true);
  }

  function handleReset() {
    window.localStorage.removeItem(HOME_EDITOR_STORAGE_KEY);
    setContent(defaultHomeEditorContent);
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[34px] border border-secondary/12 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Editeur homepage</div>
        <h1 className="mt-3 text-4xl font-bold text-gray-950">Modifier l&apos;accueil pas a pas.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
          Une etape a la fois, avec des champs simples et un apercu direct.
        </p>
      </div>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)] ring-1 ring-secondary/10">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Edition pas a pas</div>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((item, index) => {
            const active = index === step;
            const done = index < step;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-[22px] px-4 py-4 text-left transition ${
                  active
                    ? "bg-primary text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)]"
                    : done
                      ? "bg-secondary/10 text-secondary"
                      : "bg-[#f7fbf4] text-gray-700"
                }`}
              >
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${active ? "bg-white/20 text-white" : "bg-white text-gray-950"}`}>
                  {index + 1}
                </div>
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
                <TextField label="Petit label" value={content.emergencyLabel} onChange={(value) => updateField("emergencyLabel", value)} />
                <RichTextEditor
                  label="Texte de la banniere"
                  value={content.emergencyText ? `<p>${content.emergencyText}</p>` : "<p></p>"}
                  onChange={(value) => updateField("emergencyText", value.replace(/^<p>|<\/p>$/g, ""))}
                  helpText="Message visible tout en haut du site."
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 2</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Hero principal</div>
              <div className="space-y-5">
                <TextField label="Eyebrow" value={content.heroEyebrow} onChange={(value) => updateField("heroEyebrow", value)} />
                <TextField label="Titre principal" value={content.heroTitle} onChange={(value) => updateField("heroTitle", value)} />
                <RichTextEditor
                  label="Description"
                  value={content.heroDescriptionHtml}
                  onChange={(value) => updateField("heroDescriptionHtml", value)}
                  helpText="Tu peux mettre du gras, de l'italique, des listes et des couleurs limitees."
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField label="Bouton principal" value={content.primaryCta} onChange={(value) => updateField("primaryCta", value)} />
                  <TextField label="Bouton secondaire" value={content.secondaryCta} onChange={(value) => updateField("secondaryCta", value)} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField label="Image hero" value={content.heroImage} onChange={(value) => updateField("heroImage", value)} helpText="Chemin d'image local ou URL media plus tard." />
                  <TextField label="Image support" value={content.supportImage} onChange={(value) => updateField("supportImage", value)} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 3</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Bloc de confiance</div>
              <div className="space-y-5">
                <TextField label="Badge du bloc" value={content.featuredLabel} onChange={(value) => updateField("featuredLabel", value)} />
                <TextField label="Titre du bloc" value={content.featuredTitle} onChange={(value) => updateField("featuredTitle", value)} />
                <RichTextEditor label="Description du bloc" value={content.featuredDescriptionHtml} onChange={(value) => updateField("featuredDescriptionHtml", value)} />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Etape 4</div>
              <div className="mb-5 text-2xl font-bold text-gray-950">Mission et newsletter</div>
              <div className="space-y-5">
                <TextField label="Titre mission" value={content.missionTitle} onChange={(value) => updateField("missionTitle", value)} />
                <RichTextEditor label="Texte mission" value={content.missionDescriptionHtml} onChange={(value) => updateField("missionDescriptionHtml", value)} />
                <TextField label="Image mission" value={content.missionImage} onChange={(value) => updateField("missionImage", value)} />
                <TextField label="Titre newsletter" value={content.newsletterTitle} onChange={(value) => updateField("newsletterTitle", value)} />
                <RichTextEditor label="Texte newsletter" value={content.newsletterDescriptionHtml} onChange={(value) => updateField("newsletterDescriptionHtml", value)} />
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-secondary/10 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                {saved ? <span className="font-semibold text-secondary">Modifications enregistrees localement.</span> : "Pense a sauvegarder avant de quitter."}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0}
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6"
                >
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
                  disabled={step === steps.length - 1}
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-secondary/6"
                >
                  Suivant
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary/6"
                >
                  Reinitialiser
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>

        <HomeEditorPreview content={content} />
      </div>
    </section>
  );
}
