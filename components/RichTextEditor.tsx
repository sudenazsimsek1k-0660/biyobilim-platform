"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] rounded-b-xl border border-[#d4e0d8] bg-white px-4 py-3 outline-none focus:border-[#287fea] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== (editor.isEmpty ? "" : editor.getHTML())) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
      active
        ? "bg-[#2f6f4e] text-white"
        : "bg-white text-[#315441] hover:bg-[#eef5f1]"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-xl border border-b-0 border-[#d4e0d8] bg-[#f5f8f6] p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
          <b>K</b>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>
          <i>İ</i>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>
          Başlık
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>
          • Liste
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}