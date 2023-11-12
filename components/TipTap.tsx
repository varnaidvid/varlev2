import { EditorContent } from '@tiptap/react';
import { Toolbar } from '@/components/Toolbar';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';

export default function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: any;
}) {
  const editor = useEditor({
    extensions: [
      Image,
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: { class: 'text-xl font-bold', levels: [2] },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          'rounded-md border min-h-[150px] border-input bg-background-100 p-4',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-strech mb-8">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
