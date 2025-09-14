"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useCallback } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your post...",
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={`min-h-[200px] rounded-md border border-gray-300 p-4 ${className}`}
      >
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-md border border-gray-300 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("strike") ? "bg-gray-300" : ""
          }`}
        >
          <s>S</s>
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
          }`}
        >
          H3
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("blockquote") ? "bg-gray-300" : ""
          }`}
        >
          Quote
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        <button
          type="button"
          onClick={setLink}
          className={`rounded px-3 py-1 text-sm hover:bg-gray-200 ${
            editor.isActive("link") ? "bg-gray-300" : ""
          }`}
        >
          Link
        </button>

        <button
          type="button"
          onClick={addImage}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
        >
          Image
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
