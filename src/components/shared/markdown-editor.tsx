'use client'

import { forwardRef, type Ref } from 'react'

import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { classNames } from '~/utils/core'

interface MarkdownEditorProps {
  defaultValue?: string
  placeholder?: string
  className?: string
  onChange?: (v: string) => void
}

export const MarkdownEditor = forwardRef(
  (
    { defaultValue, placeholder = 'Enter text...', onChange, className, ...rest }: MarkdownEditorProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        Placeholder.configure({
          placeholder: () => {
            return placeholder
          }
        })
      ],
      content: defaultValue,
      editorProps: {
        attributes: {
          class: classNames(
            'dark:bg-neutral-800 h-full border border-neutral-200 text-sm dark:border-neutral-700 pt-2 px-2 rounded pb-6 font-light w-full grow max-w-none prose prose-dark text-white focus:outline-none',
            className
          )
        }
      },
      onUpdate: ({ editor }) => {
        const content = editor.getHTML()
        if (onChange) {
          onChange(content)
        }
      }
    })

    return (
      <EditorContent
        {...rest}
        ref={ref}
        editor={editor}
        className='h-fit w-full resize-none bg-transparent py-2 text-sm text-white outline-none transition-all focus:outline-none'
      />
    )
  }
)

MarkdownEditor.displayName = 'MarkdownEditor'
