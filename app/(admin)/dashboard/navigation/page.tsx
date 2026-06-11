"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageHeader } from "@/components/admin/ui/page-header";

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
    api.getNavigation(true).then((data: any) => {
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

  const enabledCount = items.filter((it) => it.enabled).length;

  return (
    <AdminPage className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Navigation du site"
        description="Ordre, visibilite et activation des pages du menu principal."
        actions={<AdminButton onClick={startCreate}>+ Ajouter un lien</AdminButton>}
        meta={
          <>
            <span className="admin-badge-neutral">{items.length} lien(s)</span>
            <span className="admin-badge-success">{enabledCount} actif(s)</span>
            {saved ? <span className="admin-badge-info">Enregistre</span> : null}
          </>
        }
      />

      {msg ? <AdminAlert tone={msg.includes("Erreur") ? "error" : "success"}>{msg}</AdminAlert> : null}

      {(creating || editId) ? (
        <div className="admin-form-panel">
          <h3 className="text-base font-bold text-slate-900">{editId ? "Modifier le lien" : "Nouveau lien"}</h3>
          <div>
            <label className="admin-label">Label (fr)</label>
            <input value={form.label.fr} onChange={(e) => setForm((p) => ({ ...p, label: { fr: e.target.value } }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Lien (href)</label>
            <input value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} placeholder="/exemple" className="admin-input" />
          </div>
          <div className="flex gap-3">
            <AdminButton onClick={save}>Enregistrer</AdminButton>
            <AdminButton variant="ghost" onClick={cancelForm}>Annuler</AdminButton>
          </div>
        </div>
      ) : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page</th>
              <th className="text-center">Visible</th>
              <th className="text-center">Actions</th>
              <th className="text-center">Trier</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
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
                className={`${dragIndex === index ? "opacity-50" : ""} ${!item.enabled ? "bg-slate-50/80" : ""}`}
              >
                <td>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="cursor-grab text-slate-300 hover:text-slate-500" title="Glisser pour deplacer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                      </svg>
                    </span>
                    <span className={`text-sm ${item.enabled ? "text-slate-900" : "text-slate-400 line-through"}`}>
                      {item.label}
                    </span>
                    <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-400 sm:inline">{item.href}</span>
                  </div>
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors ${
                      item.enabled ? "bg-primary" : "bg-slate-200"
                    }`}
                    aria-label={item.enabled ? "Desactiver" : "Activer"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                        item.enabled ? "translate-x-[18px]" : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <AdminButton variant="ghost" className="px-2 py-1 text-xs" onClick={() => startEdit(item)}>Modifier</AdminButton>
                    <AdminButton variant="danger" className="px-2 py-1 text-xs" onClick={() => remove(item.id)}>Supprimer</AdminButton>
                  </div>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => index > 0 && move(index, index - 1)}
                      disabled={index === 0}
                      className="admin-btn-ghost rounded p-1 disabled:opacity-30"
                      aria-label="Monter"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => index < items.length - 1 && move(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="admin-btn-ghost rounded p-1 disabled:opacity-30"
                      aria-label="Descendre"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-surface border-dashed p-5">
        <p className="text-sm leading-6 text-slate-500">
          <strong className="text-slate-700">Glisser-deposer</strong> les lignes pour reordonner. Utilisez le toggle pour activer ou desactiver une page.
          Les pages desactivees n&apos;apparaissent plus dans le menu du site.
        </p>
      </div>
    </AdminPage>
  );
}
