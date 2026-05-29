"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Themes</h1>
          <p className="text-xs text-gray-500">{themes.length} themes &middot; Categories de projets</p>
        </div>
        <button onClick={startCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          + Ajouter un theme
        </button>
      </div>

      {msg ? <div className="rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">{msg}</div> : null}

      {creating || editId ? (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{editId ? "Modifier le theme" : "Nouveau theme"}</h3>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Nom (fr)</label>
            <input value={draft.name.fr} onChange={(e) => generateSlug(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Slug</label>
            <input value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Description (fr)</label>
            <textarea value={draft.description.fr} onChange={(e) => setDraft((p) => ({ ...p, description: { fr: e.target.value } }))} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90">Enregistrer</button>
            <button onClick={cancelForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Annuler</button>
          </div>
        </div>
      ) : null}

      {themes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-gray-400">
          <p className="text-sm">Aucun theme. Cliquez sur &quot;+ Ajouter un theme&quot;.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {themes.map((theme) => (
            <div key={theme.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500">
                  {theme.name?.fr?.charAt(0).toUpperCase() || "?"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{theme.name?.fr || theme.slug}</div>
                  <div className="text-xs text-gray-400">/{theme.slug} &middot; {theme.type}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(theme)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Modifier</button>
                <button onClick={() => remove(theme.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
