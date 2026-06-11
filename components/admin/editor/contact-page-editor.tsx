"use client";

import { useEffect, useState } from "react";
import { defaultContactEditorContent, loadContactContent, type ContactEditorContent } from "@/lib/admin/contact-content";
import { api } from "@/lib/api";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";

function TextField({ label, value, onChange, multiline }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <label className="admin-label">{label}</label>
      <Tag value={value} onChange={(e: any) => onChange(e.target.value)} rows={multiline ? 3 : undefined}
        className="admin-input" />
    </div>
  );
}

function StringList({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input value={v} onChange={(e) => { const n = [...values]; n[i] = e.target.value; onChange(n); }}
            className="flex-1 rounded-xl border border-secondary/14 px-4 py-3 text-base outline-none focus:border-primary" />
          <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="rounded-xl bg-red-50 px-3 text-sm text-red-500">X</button>
        </div>
      ))}
      <button onClick={() => onChange([...values, ""])} className="rounded-button border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/6">+ Ajouter</button>
    </div>
  );
}

function ItemsEditor({ items, onChange }: {
  items: { title: string; text: string }[];
  onChange: (items: { title: string; text: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-secondary/10 bg-gray-50/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400">#{i + 1}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-xs font-semibold text-red-400">Supprimer</button>
          </div>
          <div className="space-y-2">
            <input placeholder="Titre" value={item.title} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; onChange(n); }}
              className="w-full rounded-xl border border-secondary/14 px-4 py-3 text-base outline-none focus:border-primary" />
            <textarea placeholder="Texte" value={item.text} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; onChange(n); }} rows={3}
              className="w-full rounded-xl border border-secondary/14 px-4 py-3 text-base outline-none focus:border-primary" />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { title: "", text: "" }])} className="rounded-button border border-secondary/14 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/6">+ Ajouter</button>
    </div>
  );
}

export function ContactPageEditor() {
  const [content, setContent] = useState<ContactEditorContent>(defaultContactEditorContent);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { loadContactContent().then(setContent).catch(console.error); }, []);

  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 1800); return () => clearTimeout(t); }, [saved]);

  function update<Key extends keyof ContactEditorContent>(key: Key, value: ContactEditorContent[Key]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function handleSave() {
    setSaveError("");
    try {
      await api.updatePage('contact', content);
      setSaved(true);
    } catch (e: any) {
      setSaveError(e?.message || "Erreur lors de l'enregistrement.");
      console.error("ContactPageEditor: save failed", e);
    }
  }

  function handleReset() {
    setContent(defaultContactEditorContent);
  }

  return (
    <AdminPage className="space-y-8">
      <PageHeader
        eyebrow="Site public"
        title="Editeur — Contact"
        description="Hero, coordonnees, formulaire, cartes d'information et FAQ."
        meta={saved ? <span className="admin-badge-success">Enregistre</span> : null}
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 text-2xl font-bold text-gray-950">Hero & Coordonnees</div>
            <div className="space-y-5">
              <TextField label="Eyebrow" value={content.heroEyebrow} onChange={(v) => update("heroEyebrow", v)} />
              <TextField label="Titre" value={content.heroTitle} onChange={(v) => update("heroTitle", v)} multiline />
              <TextField label="Description" value={content.heroDescription} onChange={(v) => update("heroDescription", v)} multiline />
              <hr className="border-secondary/10" />
              <TextField label="Titre du bloc contact" value={content.contactHeading} onChange={(v) => update("contactHeading", v)} />
              <TextField label="Adresse" value={content.address} onChange={(v) => update("address", v)} />
              <StringList label="Telephones" values={content.phones} onChange={(v) => update("phones", v)} />
              <StringList label="Emails" values={content.emails} onChange={(v) => update("emails", v)} />
            </div>
          </div>

          <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 text-2xl font-bold text-gray-950">Boites d&apos;info</div>
            <div className="space-y-5">
              <TextField label="Titre Presse/Journal" value={content.presseTitle} onChange={(v) => update("presseTitle", v)} />
              <TextField label="Texte Presse/Journal" value={content.presseText} onChange={(v) => update("presseText", v)} multiline />
              <TextField label="Titre Projets" value={content.projetsTitle} onChange={(v) => update("projetsTitle", v)} />
              <TextField label="Texte Projets" value={content.projetsText} onChange={(v) => update("projetsText", v)} multiline />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 text-2xl font-bold text-gray-950">Formulaire</div>
            <div className="space-y-5">
              <TextField label="Titre du formulaire" value={content.formTitle} onChange={(v) => update("formTitle", v)} />
              <StringList label="Champs (labels)" values={content.formFields.map((f) => f.label)} onChange={(v) => update("formFields", v.map((label) => ({ label, type: "text" })))} />
              <StringList label="Options du sujet" values={content.subjectOptions} onChange={(v) => update("subjectOptions", v)} />
              <TextField label="Texte du bouton" value={content.submitCta} onChange={(v) => update("submitCta", v)} />
              <TextField label="Message de succes" value={content.successMessage} onChange={(v) => update("successMessage", v)} multiline />
            </div>
          </div>

          <div className="rounded-[30px] border border-secondary/10 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 text-2xl font-bold text-gray-950">Cartes & FAQ</div>
            <div className="space-y-6">
              <div>
                <div className="mb-3 text-sm font-semibold text-gray-700">Cartes de contact</div>
                <ItemsEditor items={content.contactCards} onChange={(v) => update("contactCards", v)} />
              </div>
              <div>
                <div className="mb-3 text-sm font-semibold text-gray-700">FAQ</div>
                <ItemsEditor
                  items={content.faq.map((f) => ({ title: f.question, text: f.answer }))}
                  onChange={(v) => update("faq", v.map((i) => ({ question: i.title, answer: i.text })))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 z-20 rounded-[28px] border border-secondary/10 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {saved ? <span className="font-semibold text-secondary">Modifications enregistrees.</span> : null}
            {saveError ? <span className="ml-2 font-semibold text-red-500">{saveError}</span> : null}
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="rounded-button border border-secondary/16 bg-white px-5 py-3 text-sm font-semibold text-secondary hover:bg-secondary/6">Reinitialiser</button>
            <button onClick={handleSave} className="rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,146,33,0.22)] hover:-translate-y-0.5 hover:bg-orange-500">Enregistrer</button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
