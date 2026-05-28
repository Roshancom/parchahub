"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  value?: string;
  onChange: (html: string) => void;
};

const RichTextEditor = ({ value = "", onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] rounded-b-2xl border-x border-b border-brand-bordertext-gray-500 px-4 py-3 text-sm text-white outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = editor.getHTML();
    const next = value || "";

    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[180px] animate-pulse rounded-2xl border border-brand-bordertext-gray-500" />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl text-blue-300 bg-brand-blue">
      <div className="flex flex-wrap gap-2 rounded-t-2xl border border-brand-bordertext-gray-500 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="rounded-md border border-brand-border px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-blue-500 active:bg-blue-600 "
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="rounded-md border border-brand-border px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-blue-500 active:bg-blue-600"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="rounded-md border border-brand-border px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-blue-500 active:bg-blue-600"
        >
          Bullets
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
