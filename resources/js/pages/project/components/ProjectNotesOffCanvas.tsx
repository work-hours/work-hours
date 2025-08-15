import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
import { Edit, Save, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Note = {
  id: number
  body: string
  created_at: string
  updated_at: string
  user: { id: number; name: string }
  can_edit: boolean
  can_delete: boolean
}

interface Props {
  projectId: number | null
  open: boolean
  onClose: () => void
}

export default function ProjectNotesOffCanvas({ projectId, open, onClose }: Props) {
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;|\s+/g, ' ').trim()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingBody, setEditingBody] = useState('')

  const fetchNotes = async () => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(route('project.notes', projectId))
      if (!res.ok) throw new Error('Failed to load notes')
      const data: Note[] = await res.json()
      setNotes(data)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load notes'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && projectId) {
      fetchNotes()
    } else {
      setNotes([])
      setBody('')
      setEditingId(null)
      setEditingBody('')
    }
  }, [open, projectId])

  const saveNote = async () => {
    if (!projectId || body.trim() === '') return
    await router.post(route('project.notes.store', projectId), { body }, { preserveScroll: true, onSuccess: () => {
      setBody('')
      fetchNotes()
    } })
  }

  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditingBody(note.body)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingBody('')
  }

  const updateNote = async (noteId: number) => {
    if (!projectId) return
    await router.put(route('project.notes.update', { project: projectId, note: noteId }), { body: editingBody }, { preserveScroll: true, onSuccess: () => {
      cancelEdit()
      fetchNotes()
    } })
  }

  const deleteNote = async (noteId: number) => {
    if (!projectId) return
    await router.delete(route('project.notes.destroy', { project: projectId, note: noteId }), { preserveScroll: true, onSuccess: () => fetchNotes() })
  }

  return (
    <div className={`fixed inset-y-0 right-0 z-60 w-full transform bg-white shadow-xl transition-transform duration-300 sm:w-[400px] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Project Notes</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* New Note */}
          <div className="space-y-2">
            <RichTextEditor placeholder="Write a quick note..." value={body} onChange={(html) => setBody(html)} />
            <div className="flex justify-end">
              <Button onClick={saveNote} disabled={stripHtml(body) === ''}>Save</Button>
            </div>
          </div>

          <div className="my-4 h-px bg-gray-200" />

          {loading && <div className="text-center text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-center text-sm text-red-500">{error}</div>}

          {/* Notes List */}
          <div className="space-y-3">
            {notes.length === 0 && !loading && (
              <div className="text-center text-sm text-gray-500">No notes yet.</div>
            )}
            {notes.map((note) => (
              <div key={note.id} className="rounded-md border p-3 hover:shadow-sm">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">{note.user.name}</span>
                    <span className="mx-1">•</span>
                    <span>{format(new Date(note.created_at), 'PPpp')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.can_edit && editingId !== note.id && (
                      <Button variant="ghost" size="icon" onClick={() => startEdit(note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {note.can_delete && editingId !== note.id && (
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingId === note.id ? (
                  <div className="space-y-2">
                    <RichTextEditor value={editingBody} onChange={(html) => setEditingBody(html)} />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                      <Button onClick={() => updateNote(note.id)} disabled={stripHtml(editingBody) === ''}>
                        <Save className="mr-2 h-4 w-4" /> Update
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-sm text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: note.body }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
