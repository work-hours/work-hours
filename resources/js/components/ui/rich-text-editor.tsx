import React, { useEffect, useRef, useState } from 'react'

export type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minRows?: number
}

export default function RichTextEditor({ value, onChange, placeholder, disabled, className, minRows = 5 }: RichTextEditorProps) {
  const [QuillCtor, setQuillCtor] = useState<unknown>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<unknown>(null)
  const minHeightPx = Math.max(0, Math.round((minRows || 5) * 24))

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const mod = await import('quill')
        await import('react-quill/dist/quill.snow.css')
        if (mounted) setQuillCtor(() => mod.default ?? mod)
      } catch (e) {
        console.error('Failed to load editor', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!QuillCtor || !containerRef.current || editorRef.current) return

    const el = document.createElement('div')
    containerRef.current.appendChild(el)

    const quill = new (QuillCtor as any)(el, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'clean'],
        ],
        clipboard: { matchVisual: false },
      },
      formats: [
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
      placeholder,
      readOnly: !!disabled,
    })

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value)
    }

    const handleChange = () => {
      const html = (quill.root as HTMLElement).innerHTML
      onChange(html)
    }

    quill.on('text-change', handleChange)
    editorRef.current = quill

    const root: HTMLElement = quill.root as HTMLElement
    root.style.minHeight = `${minHeightPx}px`
    root.style.fontFamily = 'inherit'
    root.style.fontSize = '120%'

    return () => {
      quill.off('text-change', handleChange)
      editorRef.current = null
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [QuillCtor, containerRef])

  useEffect(() => {
    const quill = editorRef.current as any
    if (!quill) return
    quill.enable(!disabled)
    ;(quill.root as HTMLElement).setAttribute('data-placeholder', placeholder || '')
    const root: HTMLElement = quill.root as HTMLElement
    root.style.minHeight = `${minHeightPx}px`
  }, [disabled, placeholder, minHeightPx])

  useEffect(() => {
    const quill = editorRef.current as any
    if (!quill) return
    const currentHtml = (quill.root as HTMLElement).innerHTML
    if (value !== currentHtml) {
      const sel = quill.getSelection()
      quill.clipboard.dangerouslyPasteHTML(value || '')
      if (sel) quill.setSelection(sel)
    }
  }, [value])

  return (
    <div
      className={`rounded-md border bg-background text-sm ${className ?? ''}`}
      style={{ fontSize: '120%' }}
    >
      {/* Container where Quill will mount */}
      <div ref={containerRef} />
      {!QuillCtor && (
        <div
          className="p-3 text-muted-foreground"
          style={{ minHeight: minHeightPx }}
        >
          {placeholder ?? 'Loading editor...'}
        </div>
      )}
    </div>
  )
}
