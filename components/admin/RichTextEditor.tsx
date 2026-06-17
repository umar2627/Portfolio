"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils/cn";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[120px] px-4 py-3 text-sm text-white outline-none",
      },
    },
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/[0.08] bg-card/50",
        className
      )}
    >
      <div className="flex gap-1 border-b border-white/[0.05] px-3 py-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-white/5 hover:text-white"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-white/5 hover:text-white"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="rounded px-2 py-1 text-xs text-text-secondary hover:bg-white/5 hover:text-white"
        >
          List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
