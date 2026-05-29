"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mapGalleryItem } from "@/lib/api-mappers";
import { Pagination } from "@/components/admin/pagination";

type MediaItem = { id: string; path: string; name: string };

const PAGE_SIZE = 18;

export function MediaLibraryEditor() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [viewer, setViewer] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function load() {
    api.getGallery().then((res) => {
      const data: any[] = res?.data ?? [];
      setItems(data.map((g: any) => {
        const m = mapGalleryItem(g);
        return { id: m.id, path: m.image, name: m.title.fr || g.file_path?.split("/").pop() || "media" };
      }));
    }).catch((e) => { console.error("MediaLibraryEditor: failed to load media", e); });
  }

  useEffect(() => { load(); }, []);

  async function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files || []).filter((f) => f.type.startsWith("image/"));
      for (const file of files) {
        try {
          const res = await api.uploadMedia(file, { fr: file.name.replace(/\.[^/.]+$/, "") });
          const m = mapGalleryItem(res);
          setItems((prev) => [{ id: m.id, path: m.image, name: m.title.fr || file.name }, ...prev]);
        } catch {}
      }
    };
    input.click();
  }

  async function handleRename(id: string) {
    if (!editValue.trim()) { setEditingId(null); return; }
    try {
      await api.updateGalleryItem(id, { title: { fr: editValue.trim() } });
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name: editValue.trim() } : i)));
    } catch {}
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce fichier ?")) return;
    try {
      await api.deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Bibliotheque media</h1>
          <p className="text-xs text-gray-500">{items.length} fichiers</p>
        </div>
        <button onClick={handleUpload} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          + Ajouter
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {paginated.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="aspect-square overflow-hidden">
              <img
                src={item.path}
                alt={item.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <button onClick={() => setViewer(item.path)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg">Voir</button>
              <button onClick={() => { setEditingId(item.id); setEditValue(item.name); }} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg">Renommer</button>
              <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">Suppr</button>
            </div>
            <div className="truncate px-2.5 py-2 text-xs text-gray-500">
              {editingId === item.id ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleRename(item.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(item.id)}
                  className="w-full rounded border border-primary px-1 py-0.5 text-xs outline-none"
                  autoFocus
                />
              ) : (
                item.name
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination current={page} total={items.length} pageSize={PAGE_SIZE} onChange={setPage} />

      {viewer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setViewer(null)}>
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={viewer} alt="" className="max-h-[80vh] w-full object-contain" />
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <span className="text-xs text-gray-500">{viewer}</span>
              <button onClick={() => setViewer(null)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">Fermer</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
