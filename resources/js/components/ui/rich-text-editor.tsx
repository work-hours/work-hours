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
  const quillRef = useRef<any>(null)
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

  useEffect(() => {
    if (!quillRef.current || !Quill) return
    try {
      const editor = quillRef.current.getEditor?.()
      const root: HTMLElement | undefined = editor?.root
      if (root) {
        root.style.minHeight = `${minHeightPx}px`
        root.style.fontFamily = 'inherit'
        root.style.fontSize = '120%'
      }
    } catch {
        //
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
        style={{ minHeight: minHeightPx, fontSize: '120%' }}
      >
        {placeholder ?? 'Loading editor...'}
      </div>
    )
  }

  const QuillComponent = Quill as unknown as any
  return (
    <QuillComponent
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
