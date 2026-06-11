"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";

type Theme = {
  id: string;
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  type: string;
};

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ slug: string; name: Record<string, string>; description: Record<string, string>; type: string }>({ slug: "", name: { fr: "" }, description: { fr: "" }, type: "project" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getCategories("type=project").then((res: any) => {
      if (res?.data) setThemes(res.data);
    }).catch((e) => { console.error("AdminThemes: failed to load", e); setMsg("Erreur de chargement des themes."); });
  }, []);

  const showMsg = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  }, []);

  function resetForm() { setDraft({ slug: "", name: { fr: "" }, description: { fr: "" }, type: "project" }); }

  function startCreate() {
    resetForm();
    setCreating(true);
    setEditId(null);
  }

  function startEdit(t: Theme) {
    setDraft({ slug: t.slug, name: t.name, description: t.description ?? { fr: "" }, type: t.type });
    setEditId(t.id);
    setCreating(false);
  }

  function cancelForm() { setCreating(false); setEditId(null); resetForm(); }

  async function save() {
    try {
      if (editId) {
        await api.updateCategory(editId, draft);
        setThemes(themes.map((t) => (t.id === editId ? { ...t, ...draft } : t)));
        showMsg("Theme mis a jour");
      } else {
        const res = await api.createCategory(draft);
        setThemes([res, ...themes]);
        showMsg("Theme cree");
      }
      cancelForm();
    } catch (e) { console.error("AdminThemes: save failed", e); showMsg("Erreur lors de la sauvegarde"); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce theme ?")) return;
    try {
      await api.deleteCategory(id);
      setThemes(themes.filter((t) => t.id !== id));
      showMsg("Theme supprime");
    } catch (e) { console.error("AdminThemes: delete failed", e); showMsg("Erreur lors de la suppression"); }
  }

  function generateSlug(val: string) {
    setDraft((prev) => ({ ...prev, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), name: { ...prev.name, fr: val } }));
  }

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Themes de projets"
        description="Categories thematiques utilisees pour organiser les campagnes et la galerie."
        actions={<AdminButton onClick={startCreate}>+ Ajouter un theme</AdminButton>}
        meta={<span className="admin-badge-neutral">{themes.length} theme(s)</span>}
      />

      {msg ? <AdminAlert tone={msg.includes("Erreur") ? "error" : "success"}>{msg}</AdminAlert> : null}

      {creating || editId ? (
        <div className="admin-form-panel">
          <h3 className="text-base font-bold text-slate-900">{editId ? "Modifier le theme" : "Nouveau theme"}</h3>
          <div>
            <label className="admin-label">Nom (fr)</label>
            <input value={draft.name.fr} onChange={(e) => generateSlug(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Slug</label>
            <input value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Description (fr)</label>
            <textarea value={draft.description.fr} onChange={(e) => setDraft((p) => ({ ...p, description: { fr: e.target.value } }))} rows={2} className="admin-textarea" />
          </div>
          <div className="flex gap-3">
            <AdminButton onClick={save}>Enregistrer</AdminButton>
            <AdminButton variant="ghost" onClick={cancelForm}>Annuler</AdminButton>
          </div>
        </div>
      ) : null}

      {themes.length === 0 ? (
        <AdminEmptyState
          title="Aucun theme"
          description='Cliquez sur "+ Ajouter un theme" pour creer votre premiere categorie.'
          action={<AdminButton onClick={startCreate}>+ Ajouter un theme</AdminButton>}
        />
      ) : (
        <div className="space-y-3">
          {themes.map((theme) => (
            <div key={theme.id} className="admin-list-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500">
                {theme.name?.fr?.charAt(0).toUpperCase() || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">{theme.name?.fr || theme.slug}</div>
                <div className="text-xs text-slate-500">/{theme.slug} · {theme.type}</div>
              </div>
              <div className="flex gap-2">
                <AdminButton variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => startEdit(theme)}>Modifier</AdminButton>
                <AdminButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => remove(theme.id)}>Supprimer</AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
