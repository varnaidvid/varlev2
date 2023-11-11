import React, { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Text } from 'slate';
import { withHistory } from 'slate-history';
import { AnyPtrRecord } from 'dns';
import { BaseElement } from 'slate';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const initialValue: any = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

const RichTextBox = () => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const toggleMark = (format: any) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <div>
        <div>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('bold');
            }}
          >
            Bold
          </button>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('italic');
            }}
          >
            Italic
          </button>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('underline');
            }}
          >
            Underline
          </button>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('code');
            }}
          >
            Code
          </button>
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                toggleMark(mark);
              }
            }
          }}
        />
      </div>
    </Slate>
  );
};

const toggleMark = (editor: any, format: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

type CustomMarks = {
  [key: string]: boolean | undefined;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  // Add other custom marks as needed
};

const isMarkActive = (editor: any, format: keyof CustomMarks) => {
  const marks = Editor.marks(editor) as CustomMarks;
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};

export default RichTextBox;
