import clsx from "clsx";
import { useState } from "react";
import {
  useEditor,
  EditorContent,
  type EditorContentProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import sanitizeHtml from "sanitize-html";
import "@mantine/tiptap/styles.css";
import {
  FaBold,
  FaItalic,
  FaHighlighter,
  FaStrikethrough,
  FaCode,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaListOl,
  FaListUl,
} from "react-icons/fa";
const handleContentClick = (
  event: React.MouseEvent<HTMLDivElement> | undefined
) => {
  // Prevent the click event from reaching the parent div
  event?.stopPropagation();
};
const MenuBar = ({ editor }: EditorContentProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-between border-b px-3 py-2"
      onClick={handleContentClick}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("bold") && "bg-gray-300 "
        )}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("italic") && "bg-gray-300 "
        )}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("strike") && "bg-gray-300 "
        )}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("highlight") && "bg-gray-300 "
        )}
      >
        <FaHighlighter />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("code") && "bg-gray-300 "
        )}
      >
        <FaCode />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive({ textAlign: "left" }) && "bg-gray-300 "
        )}
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive({ textAlign: "center" }) && "bg-gray-300 "
        )}
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive({ textAlign: "right" }) && "bg-gray-300 "
        )}
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive({ textAlign: "justify" }) && "bg-gray-300 "
        )}
      >
        <FaAlignJustify />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("orderedList") && "bg-gray-300 "
        )}
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(
          "fa-icons w-auto rounded-md p-2",
          editor.isActive("bulletList") && "bg-gray-300 "
        )}
      >
        <FaListUl />
      </button>
    </div>
  );
};

const TextEditor = ({
  documentValue,
  setDocumentValue,
}: {
  documentValue: string;
  setDocumentValue: (value: string) => void;
}) => {
  const html = `<p>${documentValue}</p>`;
  const sanitizedHtml = sanitizeHtml(html);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Write something …",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: sanitizedHtml,
    onUpdate(event) {
      setDocumentValue(event.editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  return (
    <div
      className="mb-4 max-w-md rounded-lg border border-gray-200 bg-gray-50"
      onClick={handleContentClick}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="cursor-pointer" />
    </div>
  );
};

export default TextEditor;
