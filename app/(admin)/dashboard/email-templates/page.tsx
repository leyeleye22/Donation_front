"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <AdminPage className="space-y-6">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Relations & confiance"
        eyebrowAlt
        title="Templates d'email"
        description="Creez et envoyez des emails a vos abonnes newsletter."
        actions={<AdminButton onClick={openCreate}>Nouveau template</AdminButton>}
        meta={<span className="admin-badge-neutral">{templates.length} template(s)</span>}
      />

      {msg ? <AdminAlert tone={msg.includes("Erreur") || msg.includes("erreur") ? "error" : "success"}>{msg}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form onSubmit={handleSave} className="admin-form-panel w-full max-w-2xl shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">{editing ? "Modifier le template" : "Nouveau template"}</h3>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Nom interne</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Sujet</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Contenu HTML</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={12} className="admin-textarea font-mono" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <AdminButton variant="ghost" type="button" onClick={() => setShowForm(false)}>Annuler</AdminButton>
              <AdminButton type="submit" disabled={saving}>{saving ? "Sauvegarde..." : "Sauvegarder"}</AdminButton>
            </div>
          </form>
        </div>
      ) : null}

      {templates.length === 0 ? (
        <AdminEmptyState
          title="Aucun template pour le moment"
          description="Creez votre premier modele d'email pour communiquer avec vos abonnes."
          action={<AdminButton onClick={openCreate}>Creer le premier template</AdminButton>}
        />
      ) : (
        <div className="space-y-4">
          {templates.map((t) => (
            <div key={t.id} className="admin-surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900">{t.name}</h4>
                  <p className="mt-1 text-sm text-slate-500">Sujet : {t.subject}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminButton className="px-3 py-1.5 text-xs" onClick={() => handleSend(t.id)} disabled={sending && sendId === t.id}>
                    {sending && sendId === t.id ? "Envoi..." : "Envoyer"}
                  </AdminButton>
                  <AdminButton variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => openEdit(t)}>Modifier</AdminButton>
                  <AdminButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => handleDelete(t.id)}>Supprimer</AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
