import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Badge } from '@/components/ui/badge'
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
import { Edit, Save, Trash2, X, User, CalendarClock } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

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

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      onClose()
    }
  }, [open, onClose])

  useEffect(() => {
    // Add event listener for Escape key
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [handleEscapeKey])

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
    if (!projectId || stripHtml(body) === '') return
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
    <>
      {/* Background overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* OffCanvas */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full transform bg-white shadow-xl transition-transform duration-300 dark:bg-gray-800 sm:w-[400px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold dark:text-gray-100">Project Notes</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && <div className="flex justify-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>}
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {!loading && (
              <div className="space-y-6">
                {/* Add Note Section */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Add New Note</h3>
                  <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-750">
                    <RichTextEditor
                      placeholder="Write a quick note..."
                      value={body}
                      onChange={(html) => setBody(html)}
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        onClick={saveNote}
                        disabled={stripHtml(body) === ''}
                        className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes List */}
                {notes.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Project Notes</h3>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-md border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm dark:border-gray-700 dark:bg-gray-750"
                        >
                          <div className="mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="font-medium text-gray-800 dark:text-gray-200">{note.user.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <CalendarClock className="h-3 w-3" />
                                <span>{format(new Date(note.created_at), 'MMM dd, yyyy HH:mm')}</span>
                              </div>
                            </div>
                          </div>

                          {editingId === note.id ? (
                            <div className="space-y-3">
                              <div className="rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                <RichTextEditor value={editingBody} onChange={(html) => setEditingBody(html)} />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={cancelEdit}
                                  className="border-gray-200 dark:border-gray-700"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => updateNote(note.id)}
                                  disabled={stripHtml(editingBody) === ''}
                                  className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                  <Save className="mr-2 h-4 w-4" /> Update
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="prose prose-sm max-w-none rounded-md bg-white p-3 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                                dangerouslySetInnerHTML={{ __html: note.body }}
                              />

                              {(note.can_edit || note.can_delete) && (
                                <div className="mt-3 flex justify-end gap-2">
                                  {note.can_edit && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => startEdit(note)}
                                      className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                      <Edit className="mr-1 h-3 w-3" /> Edit
                                    </Button>
                                  )}
                                  {note.can_delete && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteNote(note.id)}
                                      className="h-8 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                    >
                                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                                    </Button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {notes.length === 0 && !loading && (
                  <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-750">
                    <p className="text-gray-500 dark:text-gray-400">No notes available for this project yet.</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the form above to add your first note.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
