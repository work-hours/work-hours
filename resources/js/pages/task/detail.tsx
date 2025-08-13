import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { Calendar, ChevronLeft, ExternalLink, Info, MessageSquare, Trash, Trash2, Pencil, Save, X } from 'lucide-react'
import { useState } from 'react'
import type { Task } from './types'

type Props = {
    task: Task
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks', href: '/task' }]

export default function TaskDetail({ task }: Props) {
    const { auth } = usePage<SharedData>().props
    const currentUserId = auth.user.id

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null)
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editingBody, setEditingBody] = useState<string>('')

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
        if (!data.body.trim()) return
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
                    <Link href={route('task.index')}>
                        <Button variant="ghost" className="gap-2">
                            <ChevronLeft className="h-4 w-4" /> Back to Tasks
                        </Button>
                    </Link>
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
                                        <div>
                                            <p className="text-base whitespace-pre-wrap">{task.description}</p>
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
                                    <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Info className="h-5 w-5 text-primary" /> Source
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                        <div className="space-y-2">
                                            {(task.meta?.source || task.meta?.source_number) && (
                                                <div className="text-sm text-muted-foreground">
                                                    {task.meta?.source && <span className="font-medium text-foreground">{task.meta.source}</span>}
                                                    {task.meta?.source && task.meta?.source_number && <span className="mx-1">•</span>}
                                                    {task.meta?.source_number && <span>#{task.meta.source_number}</span>}
                                                </div>
                                            )}
                                            <a
                                                href={task.meta.source_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <ExternalLink className="h-4 w-4" /> Open Source Item
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="mt-6 space-y-2">
                            <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                <MessageSquare className="h-5 w-5 text-primary" /> Comments
                            </h3>
                            <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                <div className="space-y-4">
                                    {task.comments && task.comments.length > 0 ? (
                                        task.comments.map((comment) => (
                                            <div key={comment.id} className="rounded-md bg-background p-3 shadow-sm">
                                                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                                    <span className="font-medium text-foreground">{comment.user?.name ?? 'User'}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span>{formatDate(comment.created_at)}</span>
                                                        {(currentUserId === task.project.user_id || currentUserId === (comment.user?.id ?? -1)) && (
                                                            <>
                                                                {editingCommentId === comment.id ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            title="Save comment"
                                                                            className="text-green-600 hover:text-green-700 cursor-pointer"
                                                                            onClick={() => {
                                                                                if (!editingBody.trim()) return
                                                                                router.put(
                                                                                    route('task.comments.update', { task: task.id, comment: comment.id }),
                                                                                    { body: editingBody },
                                                                                    {
                                                                                        preserveScroll: true,
                                                                                        onFinish: () => {
                                                                                            setEditingCommentId(null)
                                                                                            setEditingBody('')
                                                                                        },
                                                                                    }
                                                                                )
                                                                            }}
                                                                        >
                                                                            <Save className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            title="Cancel edit"
                                                                            className="text-muted-foreground hover:text-foreground cursor-pointer"
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
                                                                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
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
                                                                            className="text-red-500 hover:text-red-600 cursor-pointer"
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
                                                    <textarea
                                                        value={editingBody}
                                                        onChange={(e) => setEditingBody(e.target.value)}
                                                        className="w-full min-h-[80px] rounded-md border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                ) : (
                                                    <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
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
                                        <textarea
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Add a comment..."
                                            className="min-h-[80px] w-full rounded-md border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={!data.body.trim()}>
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
