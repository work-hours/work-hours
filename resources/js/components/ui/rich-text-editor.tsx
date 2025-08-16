import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Undo, Redo } from 'lucide-react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}


export default function RichTextEditor({ value, onChange, placeholder = 'Write something…', className, disabled = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const current = el.innerHTML
    if (!isFocused && current !== value) {
      el.innerHTML = value || ''
    }
  }, [value, isFocused])

  const exec = (command: string, valueArg?: string) => {
    if (disabled) return

    document.execCommand(command, false, valueArg)

    const el = ref.current
    if (el) {
      onChange(el.innerHTML)
    }
  }

  const handleLink = () => {
    if (disabled) return
    const url = window.prompt('Enter URL')
    if (url) {
      exec('createLink', url)
    }
  }

  const onInput = () => {
    const el = ref.current
    if (el) onChange(el.innerHTML)
  }

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = () => {





  }

  return (
    <div className={cn('flex w-full flex-col rounded-md border border-input bg-transparent shadow-sm', disabled && 'opacity-60', className)}>
      <div className="flex items-center gap-1 border-b px-2 py-1 text-muted-foreground">
        <ToolbarButton onClick={() => exec('bold')} title="Bold" icon={Bold} disabled={disabled} />
        <ToolbarButton onClick={() => exec('italic')} title="Italic" icon={Italic} disabled={disabled} />
        <ToolbarButton onClick={() => exec('underline')} title="Underline" icon={Underline} disabled={disabled} />
        <div className="mx-1 h-5 w-px bg-gray-200" />
        <ToolbarButton onClick={() => exec('insertUnorderedList')} title="Bulleted list" icon={List} disabled={disabled} />
        <ToolbarButton onClick={() => exec('insertOrderedList')} title="Numbered list" icon={ListOrdered} disabled={disabled} />
        <div className="mx-1 h-5 w-px bg-gray-200" />
        <ToolbarButton onClick={handleLink} title="Insert link" icon={LinkIcon} disabled={disabled} />
        <div className="mx-1 h-5 w-px bg-gray-200" />
        <ToolbarButton onClick={() => exec('undo')} title="Undo" icon={Undo} disabled={disabled} />
        <ToolbarButton onClick={() => exec('redo')} title="Redo" icon={Redo} disabled={disabled} />
      </div>

      <div
        ref={ref}
        className={cn(
          'prose prose-sm max-w-none px-3 py-2 text-gray-900 outline-none dark:text-gray-100',

          'hover:border-primary/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-b-md min-h-28',
        )}
        contentEditable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={onInput}
        onPaste={onPaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: var(--muted-foreground);
        }
        .prose :where(ul) { list-style: disc; padding-left: 1.25rem; }
        .prose :where(ol) { list-style: decimal; padding-left: 1.25rem; }
        .prose :where(a) { color: #2563eb; text-decoration: underline; }
      `}</style>
    </div>
  )
}

function ToolbarButton({ onClick, title, icon: Icon, disabled }: { onClick: () => void; title: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded px-2 text-xs transition-colors',
        'hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
