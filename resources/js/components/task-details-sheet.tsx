import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Info } from 'lucide-react'

type User = {
    id: number
    name: string
    email: string
}

type Project = {
    id: number
    name: string
    user_id: number
}

type Task = {
    id: number
    project_id: number
    title: string
    description: string | null
    status: 'pending' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    due_date: string | null
    project: Project
    assignees: User[]
    created_at?: string
}

type TaskDetailsSheetProps = {
    task: Task | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function TaskDetailsSheet({ task, open, onOpenChange }: TaskDetailsSheetProps) {
    if (!task) return null

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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto sm:max-w-md md:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Task Details
                    </SheetTitle>
                    <SheetDescription>Viewing complete information for this task</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Title</p>
                                <p className="text-base">{task.title}</p>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Project</p>
                                <p className="text-base">{task.project.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Status</p>
                                <p className="text-base">{getStatusBadge(task.status)}</p>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Priority</p>
                                <p className="text-base">{getPriorityBadge(task.priority)}</p>
                            </div>

                            {task.due_date && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Due Date</p>
                                    <p className="text-base">{new Date(task.due_date).toISOString().split('T')[0]}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="space-y-2">
                            <h3 className="ml-4 text-lg font-semibold text-primary">Description</h3>
                            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                                <div>
                                    <p className="text-base whitespace-pre-wrap">{task.description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Assignees */}
                    {task.assignees && task.assignees.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="ml-4 text-lg font-semibold text-primary">Assignees</h3>
                            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                                <div className="flex flex-wrap gap-2">
                                    {task.assignees.map((assignee) => (
                                        <span
                                            key={assignee.id}
                                            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
                                            title={assignee.email}
                                        >
                                            {assignee.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Additional Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            {task.created_at && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Created At</p>
                                    <p className="text-base">{new Date(task.created_at).toISOString().split('T')[0]}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
