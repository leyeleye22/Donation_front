"use client";

import { useRef, useState } from "react";

export function ImagePicker({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
      setError(false);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="group relative flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-primary"
        onClick={() => inputRef.current?.click()}
      >
        {preview && !error ? (
          <>
            <img src={preview} alt={label} className="h-full w-full object-cover" onError={() => setError(true)} />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
              <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Changer l&apos;image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm">Cliquez pour uploader</span>
            <span className="text-xs text-gray-300">ou glissez une image</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
