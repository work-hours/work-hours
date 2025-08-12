import MasterLayout from '@/layouts/master-layout'
import { Head, Link } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ChevronLeft, Flag, Info, User as UserIcon, ExternalLink } from 'lucide-react'
import type { Task } from './types'

type Props = {
    task: Task
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/task' },
]

export default function TaskDetail({ task }: Props) {
    const pageTitle = `${task.title} · Task Details`

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
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" /> Task Details
                        </CardTitle>
                        <CardDescription>Viewing complete information for this task</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-2">
                                <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                    <Info className="h-5 w-5 text-primary" /> Basic Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                    <div>
                                        <p className="text-sm font-bold text-muted-foreground">Title</p>
                                        <p className="text-base">{task.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-muted-foreground">Project</p>
                                        <p className="text-base">{task.project.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Flag className="text-warning h-4 w-4" />
                                        <p className="text-sm font-bold text-muted-foreground">Status</p>
                                        <span className="ml-2">{getStatusBadge(task.status)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Flag className="h-4 w-4 text-primary" />
                                        <p className="text-sm font-bold text-muted-foreground">Priority</p>
                                        <span className="ml-2">{getPriorityBadge(task.priority)}</span>
                                    </div>
                                    {task.due_date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-bold text-muted-foreground">Due Date</p>
                                            <span className="ml-2">{new Date(task.due_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {task.description && (
                                <div className="space-y-2">
                                    <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Info className="h-5 w-5 text-primary" /> Description
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                        <div>
                                            <p className="text-base whitespace-pre-wrap">{task.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Assignees */}
                            {task.assignees && task.assignees.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                        <UserIcon className="h-5 w-5 text-primary" /> Assignees
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                        <div className="flex flex-wrap gap-3">
                                            {task.assignees.map((assignee) => (
                                                <span key={assignee.id} className="flex items-center gap-2 rounded-full border bg-background px-3 py-1 shadow-sm">
                                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-white">
                                                        {assignee.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')
                                                            .toUpperCase()}
                                                    </span>
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
                                    <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Info className="h-5 w-5 text-primary" /> Tags
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
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

                            {/* Source Link if available */}
                            {task.meta?.source_url && (
                                <div className="space-y-2">
                                    <h3 className="ml-4 flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Info className="h-5 w-5 text-primary" /> Source
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4">
                                        <a href={task.meta.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                                            <ExternalLink className="h-4 w-4" /> Open Source Item
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
