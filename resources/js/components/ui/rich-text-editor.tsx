import React, { useEffect, useMemo, useState } from 'react'
import type { ReactQuillProps } from 'react-quill'




export type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, disabled, className }: RichTextEditorProps) {
  const [Quill, setQuill] = useState<React.ComponentType<ReactQuillProps> | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const mod = await import('react-quill')

        await import('react-quill/dist/quill.snow.css')
        if (mounted) setQuill(() => mod.default)
      } catch (e) {
        console.error('Failed to load editor', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'clean'],
      ],
      clipboard: { matchVisual: false },
    }),
    []
  )

  const formats = useMemo(
    () => [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'list',
      'bullet',
      'color',
      'background',
      'align',
      'link',
    ],
    []
  )

  if (Quill == null) {
    return (
      <div className={`min-h-[120px] rounded-md border bg-background p-3 text-sm text-muted-foreground ${className ?? ''}`}>
        {placeholder ?? 'Loading editor...'}
      </div>
    )
  }

  return (
    <Quill
      theme="snow"
      value={value}
      onChange={onChange}
      readOnly={!!disabled}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      className={className}
    />
  )
}
