'use client';

import { type Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Code,
  Minus,
  Pilcrow,
  Undo,
  Image,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { Widget } from '@uploadcare/react-widget';

type Props = {
  editor: Editor | null;
};

import './style.css';

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded">
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <Code className="h-4 w-4"></Code>
      </Toggle>

      <Toggle
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>

      <div className="text-gray-700">
        <Widget
          crop="free, 16:9, 4:3, 5:4, 1:1"
          publicKey="9e050a5302218c1e1d2e"
          clearable
          onChange={(info) =>
            editor
              .chain()
              .focus()
              .setImage({ src: 'https://ucarecdn.com/' + info.uuid + '/' })
              .run()
          }
        />
      </div>
    </div>
  );
}
