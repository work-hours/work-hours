import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactQuillProps } from 'react-quill'

export type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minRows?: number
}

export default function RichTextEditor({ value, onChange, placeholder, disabled, className, minRows = 5 }: RichTextEditorProps) {
  const [Quill, setQuill] = useState<React.ComponentType<ReactQuillProps> | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null)

  // Approximate line height 24px => 5 rows ~ 120px by default
  const minHeightPx = Math.max(0, Math.round((minRows || 5) * 24))

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

  // Enforce minimum height on the underlying contentEditable element (.ql-editor)
  useEffect(() => {
    if (!quillRef.current || !Quill) return
    try {
      const editor = quillRef.current.getEditor?.()
      const root: HTMLElement | undefined = editor?.root
      if (root) {
        root.style.minHeight = `${minHeightPx}px`
      }
    } catch {
      // noop: attempting to set min-height on editor root may fail before mount
    }
  }, [Quill, minHeightPx])

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
      <div
        className={`rounded-md border bg-background p-3 text-sm text-muted-foreground ${className ?? ''}`}
        style={{ minHeight: minHeightPx }}
      >
        {placeholder ?? 'Loading editor...'}
      </div>
    )
  }

  return (
    <Quill
      ref={quillRef}
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
