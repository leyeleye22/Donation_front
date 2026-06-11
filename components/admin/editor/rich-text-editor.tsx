"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { api } from "@/lib/api";
import { mapGalleryItem } from "@/lib/api-mappers";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-6 w-px bg-slate-200" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Commencez a ecrire votre article...",
}: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const syncingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rich-editor-image" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      if (syncingRef.current) return;
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content min-h-[360px] px-4 py-4 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (current === next || (current === "<p></p>" && !next)) return;
    syncingRef.current = true;
    editor.commands.setContent(next || "", { emitUpdate: false });
    syncingRef.current = false;
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor || !file.type.startsWith("image/")) return;
      try {
        const res = await api.uploadMedia(file, { fr: file.name.replace(/\.[^/.]+$/, "") });
        const mapped = mapGalleryItem(res);
        editor.chain().focus().setImage({ src: mapped.image, alt: mapped.title.fr || file.name }).run();
      } catch (err) {
        console.error("RichTextEditor: upload failed", err);
      }
    },
    [editor],
  );

  const insertImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL de l'image");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) {
    return <div className="rich-editor-shell min-h-[420px] animate-pulse rounded-2xl bg-slate-50" />;
  }

  return (
    <div className="rich-editor-shell overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50/90 px-2 py-2">
        <ToolbarButton
          title="Gras"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Italique"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          title="Souligne"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          title="Barre"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Titre 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Titre 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Paragraphe"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Liste a puces"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          title="Liste numerotee"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Citation"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          "
        </ToolbarButton>
        <ToolbarButton title="Separateur" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          —
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Aligner a gauche"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </ToolbarButton>
        <ToolbarButton
          title="Centrer"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ↔
        </ToolbarButton>
        <ToolbarButton
          title="Aligner a droite"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Lien" active={editor.isActive("link")} onClick={setLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton title="Image depuis fichier" onClick={() => fileRef.current?.click()}>
          🖼
        </ToolbarButton>
        <ToolbarButton title="Image depuis URL" onClick={insertImageFromUrl}>
          URL
        </ToolbarButton>
        <ToolbarButton
          title="Annuler"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          title="Retablir"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) insertImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
