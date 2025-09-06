import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Head, router } from '@inertiajs/react'
import DOMPurify from 'dompurify'
import { Calendar, ExternalLink, Glasses, Pencil, Save, Trash, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { Task } from '@/pages/task/types'

interface Attachment {
    name: string
    url: string
    size: number
}

type MentionCandidate = { id: number | string; name: string; handle: string }

export type TaskDetailsOffCanvasProps = {
    open: boolean
    onClose: () => void
    taskId: number | null
}

type CommentItem = {
    id: number
    body: string
    user?: { id?: number; name?: string }
    created_at?: string
}

export default function TaskDetailsOffCanvas({ open, onClose, taskId }: TaskDetailsOffCanvasProps) {
    const [task, setTask] = useState<Task | null>(null)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [mentionableUsers, setMentionableUsers] = useState<MentionCandidate[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [comments, setComments] = useState<CommentItem[]>([])
    const [dataBody, setDataBody] = useState<string>('')
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editingBody, setEditingBody] = useState<string>('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

    const stripHtml = (s: string): string =>
        s
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim()

    const fetchData = async () => {
        if (!taskId) return
        setLoading(true)
        setError(null)
        try {
            let endpoint = ''
            try {
                endpoint = route('task.detail-data', taskId) as unknown as string
            } catch {
                endpoint = `/action/app-http-controllers-taskcontroller/detail-data/${taskId}`
            }
            const res = await fetch(endpoint)
            if (!res.ok) throw new Error('Failed to load task details')
            const payload = await res.json()
            setTask(payload.task)
            setAttachments(payload.attachments || [])
            setMentionableUsers(payload.mentionableUsers || [])
            setComments(Array.isArray(payload.task?.comments) ? payload.task.comments : [])
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Failed to load task details'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open && taskId) {
            fetchData()
        }
        if (!open) {
            setTask(null)
            setAttachments([])
            setMentionableUsers([])
            setComments([])
            setDataBody('')
            setEditingCommentId(null)
            setEditingBody('')
            setDeleteDialogOpen(false)
            setCommentToDelete(null)
        }
    }, [open, taskId])

    const TaskDescription = ({ html }: { html: string }) => {
        const safe = typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html
        return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: safe }} />
    }

    const pageTitle = useMemo(() => (task ? `${task.title} · Task Details` : 'Task Details'), [task])

    const getPriorityBadge = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return (
                    <Badge variant="destructive" className="capitalize">
                        {priority}
                    </Badge>
                )
            case 'medium':
                return (
                    <Badge variant="default" className="capitalize">
                        {priority}
                    </Badge>
                )
            case 'low':
                return (
                    <Badge variant="outline" className="capitalize">
                        {priority}
                    </Badge>
                )
        }
    }

    const getStatusBadge = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge variant="success" className="capitalize">
                        {status.replace('_', ' ')}
                    </Badge>
                )
            case 'in_progress':
                return (
                    <Badge variant="warning" className="capitalize">
                        {status.replace('_', ' ')}
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge variant="secondary" className="capitalize">
                        {status.replace('_', ' ')}
                    </Badge>
                )
        }
    }

    const formatDate = (value?: string) => {
        if (!value) return ''
        const d = new Date(value)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!task || !stripHtml(dataBody)) return
        const currentBody = dataBody
        await router.post(
            route('task.comments.store', { task: task.id }),
            { body: currentBody },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setComments((prev) => [
                        ...prev,
                        {
                            id: Date.now(),
                            body: currentBody,
                            user: { id: undefined, name: 'You' },
                            created_at: new Date().toISOString(),
                        },
                    ])
                    setDataBody('')
                },
            },
        )
    }

    const updateComment = async (commentId: number) => {
        if (!task) return
        if (!stripHtml(editingBody)) return
        await router.put(
            route('task.comments.update', { task: task.id, comment: commentId }),
            { body: editingBody },
            {
                preserveScroll: true,
                onFinish: () => {
                    setEditingCommentId(null)
                    setEditingBody('')
                    fetchData()
                },
            },
        )
    }

    const deleteComment = async () => {
        if (!task || commentToDelete == null) return
        await router.delete(route('task.comments.destroy', { task: task.id, comment: commentToDelete }), {
            preserveScroll: true,
            onFinish: () => {
                setDeleteDialogOpen(false)
                setCommentToDelete(null)
                fetchData()
            },
        })
    }

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <Head title={pageTitle} />
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="mb-2">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <Glasses className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Task Details
                    </SheetTitle>
                </SheetHeader>

                {loading ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">Loading...</div>
                ) : error ? (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                ) : task ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-semibold tracking-tight">{task.title}</h2>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="text-muted-foreground">{task.project.name}</span>
                                    </span>
                                    <span className="hidden text-muted-foreground md:inline">•</span>
                                    <span className="inline-flex items-center gap-2">{getStatusBadge(task.status)}</span>
                                    <span className="hidden text-muted-foreground md:inline">•</span>
                                    <span className="inline-flex items-center gap-2">{getPriorityBadge(task.priority)}</span>
                                    {task.due_date && (
                                        <>
                                            <span className="hidden text-muted-foreground md:inline">•</span>
                                            <span className="inline-flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                Due {formatDate(task.due_date)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {task.assignees && task.assignees.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {task.assignees.map((assignee) => (
                                            <span key={assignee.id} className="flex items-center gap-2 bg-background px-3 py-1 text-sm shadow-sm">
                                                <span>{assignee.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {task.tags && task.tags.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag) => (
                                            <Badge key={tag.id} style={{ backgroundColor: tag.color, color: '#fff' }}>
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="rounded-lg bg-muted/40 p-4">
                                {task.description ? (
                                    <div className="text-sm">
                                        <TaskDescription html={task.description} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-md border border-dashed bg-background/50 p-3 text-sm text-muted-foreground">
                                        <span>No description provided</span>
                                        <span className="hidden md:inline">— add one from the edit page</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {task.meta?.source_url && (
                            <div>
                                <div className="bg-muted/40 p-4">
                                    <div className="space-y-2">
                                        {(task.meta?.source || task.meta?.source_number) && (
                                            <div className="text-sm text-muted-foreground">
                                                {task.meta?.source && <span className="font-medium text-foreground">{task.meta.source}</span>}
                                                {task.meta?.source && task.meta?.source_number && <span className="mx-1">•</span>}
                                                {task.meta?.source_number && <span>#{task.meta.source_number}</span>}
                                                <span className="mx-1">•</span>
                                                <a
                                                    href={task.meta.source_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center text-primary hover:underline"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {attachments && attachments.length > 0 && (
                            <div>
                                <div className="bg-muted/40 p-4">
                                    <ul className="divide-y">
                                        {attachments.map((att) => (
                                            <li key={att.name} className="flex items-center justify-between gap-3 p-3 text-sm">
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <a
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        {att.name}
                                                    </a>
                                                    <span className="shrink-0 text-xs text-muted-foreground">{(att.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <div className="space-y-4">
                                    {comments && comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="rounded-md bg-background p-3 shadow-sm">
                                                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                                    <span className="font-medium text-foreground">{comment.user?.name ?? 'User'}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span>{formatDate(comment.created_at)}</span>
                                                        {editingCommentId === comment.id ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    title="Save comment"
                                                                    className="cursor-pointer text-green-600 hover:text-green-700"
                                                                    onClick={() => updateComment(comment.id)}
                                                                >
                                                                    <Save className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    title="Cancel edit"
                                                                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                                                                    onClick={() => {
                                                                        setEditingCommentId(null)
                                                                        setEditingBody('')
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    title="Edit comment"
                                                                    className="cursor-pointer text-blue-600 hover:text-blue-700"
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment.id)
                                                                        setEditingBody(comment.body)
                                                                    }}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    title="Delete comment"
                                                                    className="cursor-pointer text-red-500 hover:text-red-600"
                                                                    onClick={() => {
                                                                        setCommentToDelete(comment.id)
                                                                        setDeleteDialogOpen(true)
                                                                    }}
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {editingCommentId === comment.id ? (
                                                    <RichTextEditor
                                                        value={editingBody}
                                                        onChange={setEditingBody}
                                                        placeholder="Edit comment..."
                                                        minRows={4}
                                                        mentions={mentionableUsers}
                                                    />
                                                ) : (
                                                    <div
                                                        className="prose prose-sm dark:prose-invert mt-4 max-w-none text-sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                typeof window !== 'undefined'
                                                                    ? DOMPurify.sanitize(comment.body || '')
                                                                    : comment.body || '',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-md border border-dashed bg-background/50 p-3 text-sm text-muted-foreground">
                                            No comments yet
                                        </div>
                                    )}
                                </div>
                                <form onSubmit={submitComment} className="mt-2">
                                    <div className="flex flex-col gap-2">
                                        <RichTextEditor
                                            value={dataBody}
                                            onChange={setDataBody}
                                            placeholder="Add a comment..."
                                            minRows={4}
                                            mentions={mentionableUsers}
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={!stripHtml(dataBody)}
                                                className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                            >
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                </form>

                                {deleteDialogOpen && (
                                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                                        <div className="mb-2 font-medium">Delete this comment?</div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={deleteComment}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Comment
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-sm text-muted-foreground">No task selected</div>
                )}
            </SheetContent>
        </Sheet>
    )
}
