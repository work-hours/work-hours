import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
import { AlertTriangle, CalendarClock, Edit, Save, StickyNote, Trash2, User } from 'lucide-react'
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

type ProjectNotesSheetProps = {
    projectId: number | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ProjectNotesSheet({ projectId, open, onOpenChange }: ProjectNotesSheetProps) {
    const stripHtml = (html: string) =>
        html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;|\s+/g, ' ')
            .trim()
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [body, setBody] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingBody, setEditingBody] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [noteToDelete, setNoteToDelete] = useState<number | null>(null)

    const fetchNotes = async () => {
        if (!projectId) return
        setLoading(true)
        setError(null)
        try {
            const url = route('project.notes', projectId)
            console.log('Fetching notes from:', url)

            const res = await fetch(url)
            if (!res.ok) {
                const errorText = await res.text()
                console.error('Error response:', res.status, errorText)
                throw new Error(`Failed to load notes: ${res.status} ${res.statusText}`)
            }

            const data: Note[] = await res.json()
            setNotes(data)
        } catch (e: unknown) {
            console.error('Error fetching notes:', e)
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
        await router.post(
            route('project.notes.store', projectId),
            { body },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setBody('')
                    fetchNotes()
                },
            },
        )
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
        await router.put(
            route('project.notes.update', { project: projectId, note: noteId }),
            { body: editingBody },
            {
                preserveScroll: true,
                onSuccess: () => {
                    cancelEdit()
                    fetchNotes()
                },
            },
        )
    }

    const deleteNote = async (noteId: number) => {
        if (!projectId) return
        await router.delete(route('project.notes.destroy', { project: projectId, note: noteId }), {
            preserveScroll: true,
            onSuccess: () => fetchNotes(),
        })
    }

    if (!projectId) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pb-4 pl-4 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-neutral-900 dark:text-white">
                        <StickyNote className="h-5 w-5 text-primary" />
                        Project Notes
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        View and manage notes for this project
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Add New Note Section */}
                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                            <Edit className="h-4 w-4 text-primary/80" />
                            Add New Note
                        </h3>
                        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                            <RichTextEditor placeholder="Write a quick note..." value={body} onChange={(html) => setBody(html)} />
                            <div className="mt-3 flex justify-end">
                                <Button
                                    onClick={saveNote}
                                    disabled={stripHtml(body) === ''}
                                    className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                                >
                                    Save Note
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-primary"></div>
                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Loading notes...</p>
                        </div>
                    )}

                    {/* Notes List */}
                    {!loading && notes.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                <StickyNote className="h-4 w-4 text-primary/80" />
                                Project Notes
                            </h3>
                            <div className="space-y-4">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                                                <span className="font-medium text-neutral-900 dark:text-white">{note.user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                <CalendarClock className="h-3.5 w-3.5" />
                                                <span>{format(new Date(note.created_at), 'MMM dd, yyyy HH:mm')}</span>
                                            </div>
                                        </div>

                                        {editingId === note.id ? (
                                            <div className="space-y-3">
                                                <div className="rounded-md border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                                    <RichTextEditor value={editingBody} onChange={(html) => setEditingBody(html)} />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={cancelEdit}
                                                        className="border-neutral-200 dark:border-neutral-700"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => updateNote(note.id)}
                                                        disabled={stripHtml(editingBody) === ''}
                                                        className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                                                    >
                                                        <Save className="mr-2 h-4 w-4" /> Update
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className="prose prose-sm max-w-none rounded-md bg-neutral-50 p-3 text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300"
                                                    dangerouslySetInnerHTML={{ __html: note.body }}
                                                />

                                                {(note.can_edit || note.can_delete) && (
                                                    <div className="mt-3 flex justify-end gap-2">
                                                        {note.can_edit && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => startEdit(note)}
                                                                className="h-8 border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                            >
                                                                <Edit className="mr-1 h-3 w-3" /> Edit
                                                            </Button>
                                                        )}
                                                        {note.can_delete && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setDeleteDialogOpen(true)
                                                                    setNoteToDelete(note.id)
                                                                }}
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
                    {!loading && notes.length === 0 && (
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-800/50">
                            <StickyNote className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                            <h3 className="mb-1 text-lg font-medium text-neutral-800 dark:text-neutral-200">No Notes</h3>
                            <p className="mb-4 text-neutral-500 dark:text-neutral-400">There are no notes for this project yet.</p>
                        </div>
                    )}
                </div>
            </SheetContent>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Confirm Delete
                        </AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this note? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteDialogOpen(false)}
                            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (noteToDelete !== null) {
                                    deleteNote(noteToDelete)
                                    setNoteToDelete(null)
                                }
                                setDeleteDialogOpen(false)
                            }}
                            className="bg-red-600 text-white hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Note
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sheet>
    )
}
