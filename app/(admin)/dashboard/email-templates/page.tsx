"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Template = { id: string; name: string; subject: string; content: string; created_at: string };

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Template | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [sendId, setSendId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.getEmailTemplates()
      .then((res) => setTemplates(res.data ?? []))
      .catch((e) => { console.error("EmailTemplates: load", e); setError("Erreur chargement templates"); })
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", subject: "", content: "" });
    setShowForm(true);
  }

  function openEdit(t: Template) {
    setEditing(t);
    setForm({ name: t.name, subject: t.subject, content: t.content });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      if (editing) {
        await api.updateEmailTemplate(editing.id, form);
      } else {
        await api.createEmailTemplate(form);
      }
      const res = await api.getEmailTemplates();
      setTemplates(res.data ?? []);
      setShowForm(false);
    } catch (e: any) {
      console.error("EmailTemplates: save", e);
      setMsg(e.message || "Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce template ?")) return;
    try {
      await api.deleteEmailTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (e: any) {
      console.error("EmailTemplates: delete", e);
      setMsg(e.message || "Erreur suppression");
    }
  }

  async function handleSend(id: string) {
    setSendId(id);
    setSending(true);
    setMsg("");
    try {
      const res = await api.sendEmailTemplate(id);
      setMsg(res.message || "Email envoye avec succes");
    } catch (e: any) {
      console.error("EmailTemplates: send", e);
      setMsg(e.message || "Erreur envoi");
    } finally {
      setSending(false);
      setSendId(null);
    }
  }

  if (loading) return <div className="p-4 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Templates d&apos;email</h2>
          <p className="text-sm text-gray-500">Creez et envoyez des emails a vos abonnes</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-90">
          Nouveau template
        </button>
      </div>

      {msg && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form onSubmit={handleSave} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">{editing ? "Modifier" : "Nouveau"} template</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nom interne</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Sujet</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Contenu HTML</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={12}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-90 disabled:opacity-50">
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Aucun template pour le moment.</p>
          <button onClick={openCreate} className="mt-3 text-sm font-medium text-primary hover:underline">
            Creer le premier template
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((t) => (
            <div key={t.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">Sujet: {t.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleSend(t.id)} disabled={sending && sendId === t.id}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:brightness-90 disabled:opacity-50">
                    {sending && sendId === t.id ? "Envoi..." : "Envoyer"}
                  </button>
                  <button onClick={() => openEdit(t)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
