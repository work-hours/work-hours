import React, { useEffect, useRef, useState } from 'react'

export type MentionCandidate = { id: number | string; name: string; handle: string }
export type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minRows?: number
  mentions?: MentionCandidate[]
}

export default function RichTextEditor({ value, onChange, placeholder, disabled, className, minRows = 5, mentions = [] }: RichTextEditorProps) {
  const [QuillCtor, setQuillCtor] = useState<unknown>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<unknown>(null)
  const minHeightPx = Math.max(0, Math.round((minRows || 5) * 24))

  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionAtIndex, setMentionAtIndex] = useState<number | null>(null)
  const [mentionPos, setMentionPos] = useState<{ top: number; left: number } | null>(null)
  const [filteredMentions, setFilteredMentions] = useState<MentionCandidate[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const listRef = useRef<HTMLUListElement | null>(null)
  const selectedIndexRef = useRef<number>(0)
  const filteredRef = useRef<MentionCandidate[]>([])
  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])
  useEffect(() => {
    filteredRef.current = filteredMentions
  }, [filteredMentions])

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
      updateMention(quill)
    }

    const handleSelection = () => {
      updateMention(quill)
    }

    const updateMention = (q: any) => {
      try {
        const sel = q.getSelection()
        if (!sel) {
          setMentionQuery(null)
          setMentionAtIndex(null)
          setFilteredMentions([])
          setMentionPos(null)
          setSelectedIndex(0)
          return
        }
        const index = sel.index

        const [line, offset] = q.getLine(index)
        if (!line) {
          setMentionQuery(null)
          setMentionAtIndex(null)
          setFilteredMentions([])
          setMentionPos(null)
          setSelectedIndex(0)
          return
        }
        const lineStartIndex = index - offset
        const text = q.getText(lineStartIndex, offset)

        const atPos = Math.max(text.lastIndexOf('@'))
        if (atPos === -1) {
          setMentionQuery(null)
          setMentionAtIndex(null)
          setFilteredMentions([])
          setMentionPos(null)
          setSelectedIndex(0)
          return
        }
        const token = text.slice(atPos + 1)

        if (/[^A-Za-z0-9._-]/.test(token)) {
          setMentionQuery(null)
          setMentionAtIndex(null)
          setFilteredMentions([])
          setMentionPos(null)
          setSelectedIndex(0)
          return
        }

        const query = token
        const base = (query || '').toLowerCase()
        const items = (mentions || [])
          .filter((m) => m && (m.handle || m.name))
          .filter((m) => {
            if (!base) return true
            return m.handle.toLowerCase().startsWith(base) || m.name.toLowerCase().includes(base)
          })
          .slice(0, 8)
        if (items.length === 0) {
          setMentionQuery(null)
          setMentionAtIndex(null)
          setFilteredMentions([])
          setMentionPos(null)
          setSelectedIndex(0)
          return
        }
        const bounds = q.getBounds(index)
        setMentionQuery(query)
        setMentionAtIndex(lineStartIndex + atPos)
        setFilteredMentions(items)
        setSelectedIndex(0)
        setMentionPos({ top: bounds.bottom + 4, left: bounds.left })
      } catch (e) {

      }
    }

    quill.on('text-change', handleChange)
    quill.on('selection-change', handleSelection)
    editorRef.current = quill

    const root: HTMLElement = quill.root as HTMLElement
    root.style.minHeight = `${minHeightPx}px`
    root.style.fontFamily = 'inherit'
    root.style.fontSize = '120%'

    const onKeyDown = (e: KeyboardEvent) => {

      const items = filteredRef.current
      if (!items || items.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        e.stopPropagation()
        const next = (selectedIndexRef.current + 1) % items.length
        selectedIndexRef.current = next
        setSelectedIndex(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        const prev = (selectedIndexRef.current - 1 + items.length) % items.length
        selectedIndexRef.current = prev
        setSelectedIndex(prev)
      } else if (e.key === 'Enter' || e.key === 'Tab') {

        e.preventDefault()
        e.stopPropagation()
        const idx = selectedIndexRef.current
        const chosen = items[Math.max(0, Math.min(items.length - 1, idx))]
        if (chosen) insertMention(chosen.handle)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setMentionQuery(null)
        setMentionAtIndex(null)
        setFilteredMentions([])
        setMentionPos(null)
        setSelectedIndex(0)
      }
    }

    root.addEventListener('keydown', onKeyDown, true)

    return () => {
      quill.off('text-change', handleChange)
      editorRef.current = null
      root.removeEventListener('keydown', onKeyDown, true)
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

  useEffect(() => {
    if (!listRef.current) return
    const items = listRef.current.children
    if (!items || items.length === 0) return
    const el = items[Math.max(0, Math.min(items.length - 1, selectedIndex))] as HTMLElement | undefined
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex, filteredMentions])

  const insertMention = (handle: string) => {
    const q = editorRef.current as any
    if (!q || mentionAtIndex == null) return
    const sel = q.getSelection()
    const cursorIndex = sel ? sel.index : (q.getLength ? q.getLength() : 0)
    const from = mentionAtIndex
    const to = cursorIndex
    const len = Math.max(0, to - from)
    q.deleteText(from, len)
    q.insertText(from, `@${handle} `)
    q.setSelection(from + handle.length + 2)
    setMentionQuery(null)
    setMentionAtIndex(null)
    setFilteredMentions([])
    setMentionPos(null)
  }

  return (
    <div
      className={`relative rounded-md border bg-background text-sm ${className ?? ''}`}
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
      {mentionPos && filteredMentions.length > 0 && (
        <div
          className="absolute z-50 w-64 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
          style={{ top: mentionPos.top, left: mentionPos.left }}
        >
          <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto py-1 text-sm">
            {filteredMentions.map((m, idx) => {
              const active = idx === selectedIndex
              return (
                <li
                  key={String(m.id)}
                  role="option"
                  aria-selected={active}
                  className={`cursor-pointer px-3 py-2 ${active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    insertMention(m.handle)
                  }}
                >
                  <span className="font-medium">@{m.handle}</span>
                  <span className="ml-2 text-muted-foreground">{m.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
