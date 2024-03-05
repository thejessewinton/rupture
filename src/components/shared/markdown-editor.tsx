import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import { forwardRef, type Ref } from 'react'
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
            'dark:bg-neutral-900 h-full pb-6 font-light w-full grow max-w-none prose prose-dark text-neutral-500 focus:outline-none',
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
        className='h-fit w-full resize-none bg-transparent py-2 text-sm text-neutral-500 outline-none transition-all placeholder:text-neutral-500 focus:outline-none'
      />
    )
  }
)

MarkdownEditor.displayName = 'MarkdownEditor'
