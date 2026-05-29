"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type NavItemConfig = {
  id: string;
  href: string;
  label: string;
  enabled: boolean;
  sort_order: number;
};

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItemConfig[]>([]);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ href: "", label: { fr: "" } });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getNavigation().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setItems(data.map((item: any) => ({
          id: item.id,
          href: item.href || item.path || "",
          label: item.label?.fr || item.label || "",
          enabled: item.is_active ?? item.enabled ?? item.visible ?? true,
          sort_order: item.sort_order ?? 0,
        })));
      }
    }).catch((e) => { console.error("AdminNavigation: failed to load", e); setMsg("Erreur de chargement de la navigation."); });
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 2000);
    return () => clearTimeout(t);
  }, [msg]);

  const persist = useCallback(async (updated: NavItemConfig[]) => {
    setItems(updated);
    try {
      await api.updateNavigationOrder(updated.map((item, i) => ({
        id: item.id,
        sort_order: i,
      })));
      setSaved(true);
    } catch (e) { console.error("AdminNavigation: reorder failed", e); setMsg("Erreur lors du reordonnancement."); }
  }, []);

  function move(from: number, to: number) {
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    persist(copy);
  }

  function toggle(index: number) {
    const item = items[index];
    api.updateNavigationItem(item.id, { is_active: !item.enabled })
      .catch((e) => { console.error("AdminNavigation: toggle failed", e); setMsg("Erreur lors du changement d'etat."); });
    const copy = items.map((it, i) => (i === index ? { ...it, enabled: !it.enabled } : it));
    setItems(copy);
    setSaved(true);
  }

  function startCreate() {
    setForm({ href: "", label: { fr: "" } });
    setCreating(true);
    setEditId(null);
  }

  function startEdit(item: NavItemConfig) {
    setForm({ href: item.href, label: { fr: item.label } });
    setEditId(item.id);
    setCreating(false);
  }

  function cancelForm() {
    setCreating(false);
    setEditId(null);
    setForm({ href: "", label: { fr: "" } });
  }

  async function save() {
    try {
      if (editId) {
        await api.updateNavigationItem(editId, { href: form.href, label: form.label });
        setItems(items.map((it) => (it.id === editId ? { ...it, href: form.href, label: form.label.fr } : it)));
        setMsg("Lien mis a jour");
      } else {
        const payload = { href: form.href, label: form.label, sort_order: items.length };
        const res = await api.createNavigationItem(payload);
        const newItem: NavItemConfig = {
          id: res.id,
          href: res.href || form.href,
          label: res.label?.fr || form.label.fr,
          enabled: res.is_active ?? true,
          sort_order: res.sort_order ?? items.length,
        };
        setItems([...items, newItem]);
        setMsg("Lien ajoute");
      }
      cancelForm();
    } catch (e) { console.error("AdminNavigation: save failed", e); setMsg("Erreur lors de la sauvegarde"); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce lien ?")) return;
    try {
      await api.deleteNavigationItem(id);
      setItems(items.filter((it) => it.id !== id));
      setMsg("Lien supprime");
    } catch (e) { console.error("AdminNavigation: delete failed", e); setMsg("Erreur lors de la suppression"); }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Navigation</h1>
          <p className="text-xs text-gray-500">Ordre, visibilite et activation des pages du menu</p>
        </div>
        <div className="flex items-center gap-3">
          {saved ? <span className="text-xs font-semibold text-secondary">Enregistre</span> : null}
          <button onClick={startCreate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
            + Ajouter un lien
          </button>
        </div>
      </div>

      {msg ? <div className="rounded-lg bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">{msg}</div> : null}

      {(creating || editId) ? (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{editId ? "Modifier le lien" : "Nouveau lien"}</h3>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Label (fr)</label>
            <input value={form.label.fr} onChange={(e) => setForm((p) => ({ ...p, label: { fr: e.target.value } }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Lien (href)</label>
            <input value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} placeholder="/exemple" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90">Enregistrer</button>
            <button onClick={cancelForm} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Annuler</button>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_80px_100px_80px] gap-4 border-b border-gray-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          <span>Page</span>
          <span className="text-center">Visible</span>
          <span className="text-center">Actions</span>
          <span className="text-center">Trier</span>
        </div>

        <div className="divide-y divide-gray-50">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragIndex === null || dragIndex === index) return;
                move(dragIndex, index);
                setDragIndex(index);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`grid grid-cols-[1fr_80px_100px_80px] gap-4 px-5 py-3 transition-colors ${
                dragIndex === index ? "opacity-50" : ""
              } ${!item.enabled ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="cursor-grab text-gray-300 hover:text-gray-500" title="Glisser pour deplacer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                </span>
                <span className={`text-sm ${item.enabled ? "text-gray-900" : "text-gray-400 line-through"}`}>
                  {item.label}
                </span>
                <span className="hidden rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-400 sm:inline">{item.href}</span>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => toggle(index)}
                  className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors ${
                    item.enabled ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      item.enabled ? "translate-x-[18px]" : "translate-x-[2px]"
                    } mt-0.5`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1">
                <button onClick={() => startEdit(item)} className="rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                  Edit
                </button>
                <button onClick={() => remove(item.id)} className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50">
                  Suppr
                </button>
              </div>

              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => index > 0 && move(index, index - 1)}
                  disabled={index === 0}
                  className="rounded p-1 text-gray-300 transition-colors hover:text-gray-600 disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => index < items.length - 1 && move(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="rounded p-1 text-gray-300 transition-colors hover:text-gray-600 disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-5">
        <p className="text-xs text-gray-500">
          <strong className="text-gray-700">Glisser-deposer</strong> les lignes pour reordonner. Utilisez le toggle pour activer/desactiver une page.
          Les pages desactivees n&rsquo;apparaissent plus dans le menu du site.
        </p>
      </div>
    </section>
  );
}
