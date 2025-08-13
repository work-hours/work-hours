import React, { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Upload } from 'lucide-react'

export type FileDropzoneProps = {
  value?: File[]
  onChange?: (files: File[]) => void
  accept?: string
  maxFiles?: number
  label?: string
  description?: string
  disabled?: boolean
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  value = [],
  onChange,
  accept,
  maxFiles,
  label = 'Attachments',
  description = 'Drag and drop files here, or click to select',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const triggerFileDialog = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!onChange) return
      const current = value ? [...value] : []
      const toAdd: File[] = []

      for (const f of Array.from(newFiles)) {

        const exists = current.some(
          (c) => c.name === f.name && c.size === f.size && c.lastModified === f.lastModified
        )
        if (!exists) toAdd.push(f)
      }

      let combined = [...current, ...toAdd]
      if (typeof maxFiles === 'number') {
        combined = combined.slice(0, maxFiles)
      }

      onChange(combined)
    },
    [onChange, value, maxFiles]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)

    e.currentTarget.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
      e.dataTransfer.clearData()
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    if (!onChange) return
    const next = [...(value || [])]
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{label}</div>
      <div
        className={
          'rounded-md border border-dashed p-6 text-center transition-colors ' +
          (isDragging ? 'border-primary/60 bg-primary/5 ' : 'border-muted-foreground/30 ') +
          (disabled ? 'opacity-60 cursor-not-allowed ' : 'cursor-pointer hover:border-primary/50 ')
        }
        onClick={triggerFileDialog}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={onInputChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-5 w-5" />
          <div>{description}</div>
          {typeof maxFiles === 'number' && (
            <div className="text-xs">Up to {maxFiles} files</div>
          )}
        </div>
      </div>

      {value && value.length > 0 && (
        <ul className="mt-2 divide-y rounded-md border">
          {value.map((file, idx) => (
            <li key={idx} className="flex items-center justify-between gap-2 p-2 text-sm">
              <div className="truncate">
                {file.name} <span className="text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeFile(idx) }} disabled={disabled}
                aria-label={`Remove ${file.name}`}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileDropzone
