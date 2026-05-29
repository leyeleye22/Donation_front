"use client";

import { useEffect, useCallback, useState } from "react";
import { api } from "@/lib/api";

type GalleryPhoto = {
  id: string;
  title: string;
  image: string;
};

type GalleryBlock = {
  id: string;
  name: string;
  photos: GalleryPhoto[];
  collapsed: boolean;
};

function PhotoCard({ photo, onView, onReplace, onDelete }: {
  photo: GalleryPhoto;
  onView: (photo: GalleryPhoto) => void;
  onReplace: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden">
        {error ? (
          <div className="flex h-full items-center justify-center bg-gray-100 text-xs text-gray-400">Image introuvable</div>
        ) : (
          <img
            src={photo.image}
            alt={photo.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setError(true)}
          />
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
        <button
          onClick={() => onView(photo)}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg transition-colors hover:bg-gray-100"
        >
          Visualiser
        </button>
        <button
          onClick={() => onReplace(photo.id)}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-lg transition-colors hover:bg-gray-100"
        >
          Remplacer
        </button>
        <button
          onClick={() => onDelete(photo.id)}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>
      <div className="p-2.5">
        <div className="truncate text-xs font-medium text-gray-900">{photo.title}</div>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [blocks, setBlocks] = useState<GalleryBlock[]>([]);
  const [viewerPhoto, setViewerPhoto] = useState<GalleryPhoto | null>(null);
  const [newBlockName, setNewBlockName] = useState("");
  const [showNewBlock, setShowNewBlock] = useState(false);
  const [pageOffsets, setPageOffsets] = useState<Record<string, number>>({});

  const PHOTOS_PER_PAGE = 8;

  const loadBlocks = useCallback(() => {
    api.getGallery().then((data) => {
      const items = Array.isArray(data) ? data : data?.data ?? [];
      if (items.length > 0) {
        const grouped: Record<string, GalleryBlock> = {};
        for (const item of items) {
          const title = item.title?.fr || item.title || "";
          const image = item.image || item.file_path || "";
          const cats: string[] = item.categories ?? [];
          const cat = cats[0] || "general";
          if (!grouped[cat]) {
            grouped[cat] = { id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), photos: [], collapsed: false };
          }
          grouped[cat].photos.push({ id: item.id, title, image });
        }
        setBlocks(Object.values(grouped));
      }
    }).catch((e) => { console.error("AdminGallery: failed to load gallery", e); });
  }, []);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  function toggleCollapse(id: string) {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, collapsed: !b.collapsed } : b)));
  }

  async function addBlock() {
    if (!newBlockName.trim()) return;
    const id = newBlockName.toLowerCase().replace(/\s+/g, "-");
    if (blocks.find((b) => b.id === id)) return;
    try {
      await api.createCategory({ name: newBlockName.trim(), slug: id, type: "project" });
      await loadBlocks();
    } catch {}
    setNewBlockName("");
    setShowNewBlock(false);
  }

  async function deleteBlock(id: string) {
    if (!confirm(`Supprimer le bloc "${id}" et toutes ses photos ?`)) return;
    try {
      await api.deleteCategory(id);
      for (const photo of blocks.find((b) => b.id === id)?.photos ?? []) {
        await api.deleteGalleryItem(photo.id).catch((e) => { console.error("AdminGallery: failed to delete photo", e); });
      }
    } catch {}
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  async function handleUpload(blockId: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files || []);
      for (const file of files.filter((f) => f.type.startsWith("image/"))) {
        try {
          await api.uploadMedia(
            file,
            { fr: file.name.replace(/\.[^/.]+$/, "") },
            [blockId]
          );
        } catch {}
      }
      await loadBlocks();
    };
    input.click();
  }

  async function replacePhoto(photoId: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      try {
        const res = await api.uploadMedia(file);
        await api.updateGalleryItem(photoId, { file_path: res.file_path || res.url || res.image || "" });
      } catch {}
      await loadBlocks();
    };
    input.click();
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await api.deleteGalleryItem(photoId);
      setBlocks(blocks.map((b) => ({ ...b, photos: b.photos.filter((p) => p.id !== photoId) })));
    } catch {}
  }

  function getPaginatedPhotos(blockId: string, photos: GalleryPhoto[]) {
    const offset = pageOffsets[blockId] || 0;
    return photos.slice(offset, offset + PHOTOS_PER_PAGE);
  }

  function nextPage(blockId: string, total: number) {
    const offset = (pageOffsets[blockId] || 0) + PHOTOS_PER_PAGE;
    if (offset < total) setPageOffsets({ ...pageOffsets, [blockId]: offset });
  }

  function prevPage(blockId: string) {
    const offset = Math.max(0, (pageOffsets[blockId] || 0) - PHOTOS_PER_PAGE);
    setPageOffsets({ ...pageOffsets, [blockId]: offset });
  }

  const totalPhotos = blocks.reduce((sum, b) => sum + b.photos.length, 0);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Galerie</h1>
          <p className="text-xs text-gray-500">{blocks.length} bloc{blocks.length > 1 ? "s" : ""} &middot; {totalPhotos} photo{totalPhotos > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewBlock(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90"
        >
          Nouveau bloc
        </button>
      </div>

      {showNewBlock ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            value={newBlockName}
            onChange={(e) => setNewBlockName(e.target.value)}
            placeholder="Nom du bloc (ex: Forages, Ecoles...)"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            onKeyDown={(e) => e.key === "Enter" && addBlock()}
          />
          <button onClick={addBlock} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
            Creer
          </button>
          <button onClick={() => { setShowNewBlock(false); setNewBlockName(""); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            Annuler
          </button>
        </div>
      ) : null}

      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-gray-400">
          <p className="text-sm">Aucun bloc. Creez-en un.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 py-4">
                <button onClick={() => toggleCollapse(block.id)} className="flex items-center gap-3 text-left">
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${block.collapsed ? "" : "rotate-90"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{block.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{block.photos.length} photo{block.photos.length > 1 ? "s" : ""}</span>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpload(block.id)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    + Ajouter
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    Supprimer le bloc
                  </button>
                </div>
              </div>
              {!block.collapsed && (
                <div className="border-t border-gray-50 px-5 py-4">
                  {block.photos.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-400">Aucune photo. Cliquez sur &quot;+ Ajouter&quot;.</p>
                  ) : (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {getPaginatedPhotos(block.id, block.photos).map((photo) => (
                          <PhotoCard
                            key={photo.id}
                            photo={photo}
                            onView={setViewerPhoto}
                            onReplace={replacePhoto}
                            onDelete={deletePhoto}
                          />
                        ))}
                      </div>
                      {block.photos.length > PHOTOS_PER_PAGE ? (
                        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                          <p className="text-xs text-gray-500">
                            {Math.min((pageOffsets[block.id] || 0) + 1, block.photos.length)}&ndash;{Math.min((pageOffsets[block.id] || 0) + PHOTOS_PER_PAGE, block.photos.length)} sur {block.photos.length}
                          </p>
                          <div className="flex gap-1">
                            <button onClick={() => prevPage(block.id)} disabled={!(pageOffsets[block.id] || 0)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                              Precedent
                            </button>
                            <button onClick={() => nextPage(block.id, block.photos.length)} disabled={(pageOffsets[block.id] || 0) + PHOTOS_PER_PAGE >= block.photos.length} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                              Suivant
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {viewerPhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setViewerPhoto(null)}>
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={viewerPhoto.image} alt={viewerPhoto.title} className="max-h-[80vh] w-full object-contain" />
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <span className="text-sm font-medium text-gray-900">{viewerPhoto.title}</span>
              <button onClick={() => setViewerPhoto(null)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200">
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
