"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect } from "react";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
};

export function RichTextEditor({ label, value, onChange, helpText }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Underline,
      TextStyle,
      Color
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] rounded-b-[20px] border border-t-0 border-secondary/12 bg-white px-4 py-4 text-base leading-7 text-gray-800 outline-none"
      }
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
    immediatelyRender: false
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const colorButtons = [
    { label: "N", value: "#111827", title: "Noir" },
    { label: "V", value: "#41b64b", title: "Vert" },
    { label: "O", value: "#ef9221", title: "Orange" }
  ];

  const toolbarButtonClass =
    "flex h-9 min-w-9 items-center justify-center rounded-xl border border-secondary/10 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-secondary/20 hover:bg-secondary/5";

  return (
    <div>
      <div className="mb-2 block text-sm font-semibold text-gray-700">{label}</div>
      <div className="overflow-hidden rounded-[22px] border border-secondary/12 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-secondary/10 bg-[#f8faf7] px-3 py-3">
          <button
            type="button"
            title="Gras"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${toolbarButtonClass} ${editor.isActive("bold") ? "border-primary/20 bg-primary/10 text-primary" : ""}`}
          >
            B
          </button>
          <button
            type="button"
            title="Italique"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${toolbarButtonClass} italic ${editor.isActive("italic") ? "border-primary/20 bg-primary/10 text-primary" : ""}`}
          >
            I
          </button>
          <button
            type="button"
            title="Souligne"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${toolbarButtonClass} underline ${editor.isActive("underline") ? "border-primary/20 bg-primary/10 text-primary" : ""}`}
          >
            U
          </button>
          <button
            type="button"
            title="Liste"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${toolbarButtonClass} ${editor.isActive("bulletList") ? "border-primary/20 bg-primary/10 text-primary" : ""}`}
          >
            •
          </button>
          <button
            type="button"
            title="Citation"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${toolbarButtonClass} ${editor.isActive("blockquote") ? "border-primary/20 bg-primary/10 text-primary" : ""}`}
          >
            "
          </button>
          <button
            type="button"
            title="Titre"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${toolbarButtonClass} ${editor.isActive("heading", { level: 3 }) ? "border-primary/20 bg-primary/10 text-primary" : ""}`}
          >
            H
          </button>
          <div className="mx-1 h-6 w-px bg-secondary/10" />
          {colorButtons.map((color) => (
            <button
              key={color.value}
              type="button"
              title={color.title}
              onClick={() => editor.chain().focus().setColor(color.value).run()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-secondary/10 bg-white text-xs font-bold text-gray-700 transition hover:border-secondary/20 hover:bg-secondary/5"
              style={{ color: color.value }}
            >
              {color.label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      {helpText ? <p className="mt-2 text-sm leading-6 text-gray-500">{helpText}</p> : null}
    </div>
  );
}
