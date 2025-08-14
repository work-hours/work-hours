import AddNewButton from '@/components/add-new-button'
import BackButton from '@/components/back-button'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RichTextEditor from '@/components/ui/rich-text-editor'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import DOMPurify from 'dompurify'
import { Calendar, ExternalLink, Info, Pencil, Save, Trash, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import type { Task } from './types'

type Attachment = {
    name: string
    url: string
    size: number
}

type Props = {
    task: Task
    attachments?: Attachment[]
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks', href: '/task' }]

export default function TaskDetail({ task, attachments = [] }: Props) {
    const TaskDescription = ({ html }: { html: string }) => {
        const safe = typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html
        return <div dangerouslySetInnerHTML={{ __html: safe }} />
    }
    const { auth } = usePage<SharedData>().props
    const currentUserId = auth.user.id

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null)
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editingBody, setEditingBody] = useState<string>('')

    const stripHtml = (s: string): string =>
        s
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim()

    const handleConfirmDelete = () => {
        if (commentToDelete == null) return
        router.delete(route('task.comments.destroy', { task: task.id, comment: commentToDelete }), {
            preserveScroll: true,
            onFinish: () => {
                setDeleteDialogOpen(false)
                setCommentToDelete(null)
            },
        })
    }

    const pageTitle = `${task.title} · Task Details`

    const { data, setData, post, reset } = useForm<{ body: string }>({ body: '' })

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripHtml(data.body)) return
        post(route('task.comments.store', { task: task.id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset('body')
            },
        })
    }

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

    const formatDate = (value: string) => {
        const d = new Date(value)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    return (
        <MasterLayout breadcrumbs={[...breadcrumbs, { title: 'Details', href: `/task/${task.id}` }]}>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                    <BackButton />
                    {currentUserId === task.project.user_id && (
                        <AddNewButton href={route('task.edit', task.id)}>
                            <Pencil className="h-4 w-4" /> Edit Task
                        </AddNewButton>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-2xl font-bold tracking-tight">{task.title}</CardTitle>
                                <CardDescription className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                                    <span className="inline-flex items-center gap-2">
                                        <Info className="h-4 w-4 text-primary" /> {task.project.name}
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
                                </CardDescription>
                            </div>

                            {/* Assignees */}
                            {task.assignees && task.assignees.length > 0 && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/40">
                                        <div className="flex flex-wrap gap-3">
                                            {task.assignees.map((assignee) => (
                                                <span key={assignee.id} className="flex items-center gap-2 bg-background px-3 py-1 shadow-sm">
                                                    <span className="text-sm">{assignee.name}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/40">
                                        <div className="flex flex-wrap gap-2">
                                            {task.tags.map((tag) => (
                                                <Badge key={tag.id} style={{ backgroundColor: tag.color, color: '#fff' }}>
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            {/* Description */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/40 p-4">
                                    {task.description ? (
                                        <div className="text-base">
                                            {/* Render sanitized HTML description */}
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

                            {/* Source Link if available */}
                            {task.meta?.source_url && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-4 bg-muted/40 p-4">
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

                            {/* Attachments */}
                            {attachments && attachments.length > 0 && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-4 bg-muted/40 p-4">
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
                                                        <span className="shrink-0 text-xs text-muted-foreground">
                                                            {(att.size / 1024).toFixed(1)} KB
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 space-y-2">
                            <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                <div className="space-y-4">
                                    {task.comments && task.comments.length > 0 ? (
                                        task.comments.map((comment) => (
                                            <div key={comment.id} className="rounded-md bg-background p-3 shadow-sm">
                                                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                                    <span className="font-medium text-foreground">{comment.user?.name ?? 'User'}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span>{formatDate(comment.created_at)}</span>
                                                        {(currentUserId === task.project.user_id || currentUserId === (comment.user?.id ?? -1)) && (
                                                            <>
                                                                {editingCommentId === comment.id ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            title="Save comment"
                                                                            className="cursor-pointer text-green-600 hover:text-green-700"
                                                                            onClick={() => {
                                                                                if (!stripHtml(editingBody)) return
                                                                                router.put(
                                                                                    route('task.comments.update', {
                                                                                        task: task.id,
                                                                                        comment: comment.id,
                                                                                    }),
                                                                                    { body: editingBody },
                                                                                    {
                                                                                        preserveScroll: true,
                                                                                        onFinish: () => {
                                                                                            setEditingCommentId(null)
                                                                                            setEditingBody('')
                                                                                        },
                                                                                    },
                                                                                )
                                                                            }}
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
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {editingCommentId === comment.id ? (
                                                    <RichTextEditor
                                                        value={editingBody}
                                                        onChange={(val) => setEditingBody(val)}
                                                        placeholder="Edit comment..."
                                                        minRows={4}
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
                                <form onSubmit={onSubmit} className="mt-2">
                                    <div className="flex flex-col gap-2">
                                        <RichTextEditor
                                            value={data.body}
                                            onChange={(val) => setData('body', val)}
                                            placeholder="Add a comment..."
                                            minRows={4}
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={!stripHtml(data.body)}
                                                className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                            >
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open)
                    if (!open) setCommentToDelete(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Once the comment is deleted, it will be permanently removed. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Comment
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </MasterLayout>
    )
}
