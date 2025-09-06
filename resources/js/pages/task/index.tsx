import { ExportButton } from '@/components/action-buttons'
import FilterButton from '@/components/filter-button'
import SourceLinkIcon from '@/components/source-link-icon'
import TaskDeleteAction from '@/components/task-delete-action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { useTimeTracker } from '@/contexts/time-tracker-context'
import MasterLayout from '@/layouts/master-layout'
import { objectToQueryString, parseDate, queryStringToObject } from '@/lib/utils'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { tasks as _tasks } from '@actions/TaskController'
import { Head, Link, usePage } from '@inertiajs/react'
import TaskOffCanvas from '@/pages/task/components/TaskOffCanvas'
import TaskFiltersOffCanvas from '@/pages/task/components/TaskFiltersOffCanvas'
import axios from 'axios'
import {
    AlertCircle,
    Briefcase,
    Calendar,
    CalendarRange,
    ClipboardList,
    Edit,
    FileText,
    Flag,
    Glasses,
    Loader2,
    MoreVertical,
    Play,
    Plus,
    Printer,
    Search,
    TimerReset,
    Filter,
} from 'lucide-react'
import { JSX, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Task, TaskFilters } from './types'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/task',
    },
]

function TaskTrackButton({ task, currentUserId }: { task: Task; currentUserId: number }) {
    const tracker = useTimeTracker()

    if (!task.assignees.some((a) => a.id === currentUserId)) return null

    return (
        <Button
            variant="outline"
            size="sm"
            disabled={tracker.running}
            onClick={() =>
                tracker.start({
                    id: task.id,
                    title: task.title,
                    project_id: task.project_id,
                    project_name: task.project.name,
                })
            }
            className="mt-1 h-7 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            title={tracker.running ? 'Another tracker is running' : 'Start tracking'}
        >
            <Play className="h-3 w-3" />
        </Button>
    )
}

export default function Tasks() {
    const { auth, projects, tags } = usePage<
        SharedData & {
            projects: { id: number; name: string }[]
            tags: { id: number; name: string; color: string }[]
        }
    >().props
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<Task['status'] | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [taskToUpdate, setTaskToUpdate] = useState<Task | null>(null)
    const [updateGithub, setUpdateGithub] = useState<boolean>(true)
    const [updateJira, setUpdateJira] = useState<boolean>(true)

    const [filters, setFilters] = useState<TaskFilters>({
        status: 'all',
        priority: 'all',
        project: 'all',
        tag: 'all',
        'due-date-from': '',
        'due-date-to': '',
        'due-today': false,
        search: '',
    })
    const [processing, setProcessing] = useState(false)

        // Filters OffCanvas state
        const [filtersOpen, setFiltersOpen] = useState(false)

    // OffCanvas state for create/edit
    const [offOpen, setOffOpen] = useState(false)
    const [mode, setMode] = useState<'create' | 'edit'>('create')
    const [editTaskId, setEditTaskId] = useState<number | null>(null)

    const handleStatusClick = (task: Task, status: Task['status']): void => {
        setTaskToUpdate(task)
        setSelectedStatus(status)
        setUpdateGithub(true)
        setUpdateJira(true)
        setStatusDialogOpen(true)
    }

    const updateTaskStatus = async (): Promise<void> => {
        if (!taskToUpdate || !selectedStatus || selectedStatus === taskToUpdate.status) {
            setStatusDialogOpen(false)
            return
        }

        setIsUpdating(true)
        try {
            const payload: {
                status: 'pending' | 'in_progress' | 'completed'
                title: string
                project_id: number
                priority: 'low' | 'medium' | 'high'
                description: string | null
                due_date: string | null
                assignees: number[]
                github_update?: boolean
                jira_update?: boolean
            } = {
                status: selectedStatus,
                title: taskToUpdate.title,
                project_id: taskToUpdate.project_id,
                priority: taskToUpdate.priority,
                description: taskToUpdate.description,
                due_date: taskToUpdate.due_date,
                assignees: taskToUpdate.assignees.map((a) => a.id),
            }

            if (taskToUpdate.is_imported && taskToUpdate.meta?.source === 'github') {
                payload.github_update = updateGithub
            }

            if (taskToUpdate.is_imported && taskToUpdate.meta?.source === 'jira') {
                payload.jira_update = updateJira
            }

            await axios.put(route('task.updateStatus', taskToUpdate.id), payload)

            const updatedTasks = tasks.map((task) => {
                if (task.id === taskToUpdate.id) {
                    return { ...task, status: selectedStatus }
                }
                return task
            })

            setTasks(updatedTasks)
            toast.success('Task status updated successfully')
            setStatusDialogOpen(false)
        } catch (error) {
            console.error('Error updating task status:', error)
            toast.error('Failed to update task status')
        } finally {
            setIsUpdating(false)
        }
    }

    const getTasks = async (filters?: TaskFilters): Promise<void> => {
        setLoading(true)
        setError(false)
        setProcessing(true)
        try {
            setTasks(
                await _tasks.data({
                    params: filters,
                }),
            )
        } catch (error) {
            console.error('Error fetching tasks:', error)
            setError(true)
        } finally {
            setLoading(false)
            setProcessing(false)
        }
    }

    const handleFilterChange = (key: keyof TaskFilters, value: string | number | number[] | Date | boolean | null): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const clearFilters = (): void => {
        setFilters({
            status: 'incomplete',
            priority: 'all',
            project: 'all',
            tag: 'all',
            'due-date-from': '',
            'due-date-to': '',
            'due-today': false,
            search: '',
        })
    }

    const getPriorityBadge = (priority: Task['priority']): JSX.Element => {
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
            default:
                return (
                    <Badge variant="outline" className="capitalize">
                        {priority}
                    </Badge>
                )
        }
    }

    const getStatusBadge = (task: Task, status: Task['status']): JSX.Element => {
        const displayStatus = status ? status.toString() : ''

        switch (status) {
            case 'completed':
                return (
                    <Badge variant="success" className="cursor-pointer capitalize hover:opacity-80" onClick={() => handleStatusClick(task, status)}>
                        {displayStatus.replace('_', ' ')}
                    </Badge>
                )
            case 'in_progress':
                return (
                    <Badge variant="warning" className="cursor-pointer capitalize hover:opacity-80" onClick={() => handleStatusClick(task, status)}>
                        {displayStatus.replace('_', ' ')}
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge variant="secondary" className="cursor-pointer capitalize hover:opacity-80" onClick={() => handleStatusClick(task, status)}>
                        {displayStatus.replace('_', ' ')}
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="cursor-pointer capitalize hover:opacity-80" onClick={() => handleStatusClick(task, status)}>
                        {displayStatus.replace('_', ' ')}
                    </Badge>
                )
        }
    }

    const humanizeFrequency = (freq?: Task['recurring_frequency'] | null): string => {
        switch (freq) {
            case 'daily':
                return 'Daily'
            case 'weekly':
                return 'Weekly'
            case 'every_other_week':
                return 'Every other week'
            case 'monthly':
                return 'Monthly'
            default:
                return ''
        }
    }

    /**
     * Helper function to safely format date values (handles both Date objects and strings)
     */
    const formatDateValue = (dateValue: Date | string | ''): string => {
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0]
        } else if (typeof dateValue === 'string' && dateValue) {
            return dateValue
        }
        return ''
    }

    const handleSubmit = (e: { preventDefault: () => void }): void => {
        e.preventDefault()
        const formattedFilters = { ...filters }

        if (formattedFilters['due-date-from'] instanceof Date) {
            const year = formattedFilters['due-date-from'].getFullYear()
            const month = String(formattedFilters['due-date-from'].getMonth() + 1).padStart(2, '0')
            const day = String(formattedFilters['due-date-from'].getDate()).padStart(2, '0')
            formattedFilters['due-date-from'] = `${year}-${month}-${day}`
        }

        if (formattedFilters['due-date-to'] instanceof Date) {
            const year = formattedFilters['due-date-to'].getFullYear()
            const month = String(formattedFilters['due-date-to'].getMonth() + 1).padStart(2, '0')
            const day = String(formattedFilters['due-date-to'].getDate()).padStart(2, '0')
            formattedFilters['due-date-to'] = `${year}-${month}-${day}`
        }

        const filtersString = objectToQueryString(formattedFilters)

        getTasks(formattedFilters).then(() => {
            window.history.pushState({}, '', `?${filtersString}`)
        })
    }

    useEffect(() => {
        const queryParams = queryStringToObject()

        const initialFilters: TaskFilters = {
            status: (queryParams.status as TaskFilters['status']) || 'incomplete',
            priority: queryParams.priority || 'all',
            project: queryParams.project || 'all',
            tag: queryParams.tag || 'all',
            'due-date-from': queryParams['due-date-from'] || '',
            'due-date-to': queryParams['due-date-to'] || '',
            'due-today': ['1', 'true', 'on'].includes((queryParams['due-today'] || '').toString()),
            search: queryParams.search || '',
        }

        setFilters(initialFilters)
        getTasks(initialFilters).then()
    }, [])

    // Open offcanvas if ?open=true (create)
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            if ((params.get('open') || '').toLowerCase() === 'true') {
                setMode('create')
                setEditTaskId(null)
                setOffOpen(true)
            }
        } catch {
            // ignore URL parsing errors
        }
    }, [])

    // refresh listener
    useEffect(() => {
        const handler = () => getTasks(filters)
        window.addEventListener('refresh-tasks', handler)
        return () => window.removeEventListener('refresh-tasks', handler)
    }, [filters])

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="mx-auto flex flex-col gap-4 p-4 print:p-0">
                <section className="mb-2 print:hidden">
                    <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Task Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your tasks</p>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800 print:border-0 print:shadow-none">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700 print:border-0 print:p-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl print:text-base">Tasks</CardTitle>
                                <CardDescription>
                                    {loading ? 'Loading tasks...' : error ? 'Failed to load tasks' : `You have ${tasks.length} tasks`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2 print:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => window.print()}
                                    disabled={loading || processing}
                                    className="flex items-center gap-2"
                                    title="Print current list"
                                >
                                    <Printer className="h-4 w-4" />
                                    <span className="hidden sm:inline">Print</span>
                                </Button>
                                <Button
                                    variant={
                                        filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all' || filters.tag !== 'all' ||
                                        filters['due-date-from'] || filters['due-date-to'] || filters['due-today']
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className={`flex items-center gap-2 ${
                                        filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all' || filters.tag !== 'all' ||
                                        filters['due-date-from'] || filters['due-date-to'] || filters['due-today']
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter className={`h-4 w-4 ${
                                        filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all' || filters.tag !== 'all' ||
                                        filters['due-date-from'] || filters['due-date-to'] || filters['due-today']
                                            ? 'text-primary dark:text-primary-foreground'
                                            : ''
                                    }`} />
                                    <span>{
                                        filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.project !== 'all' || filters.tag !== 'all' ||
                                        filters['due-date-from'] || filters['due-date-to'] || filters['due-today']
                                            ? 'Filters Applied'
                                            : 'Filters'
                                    }</span>
                                </Button>
                                <ExportButton href={route('task.export') + window.location.search} label="Export" />
                                <Button
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setMode('create')
                                        setEditTaskId(null)
                                        setOffOpen(true)
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Task</span>
                                </Button>
                            </div>
                        </div>

                    </CardHeader>
                    <CardContent className="print:p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Loader2 className="mb-4 h-12 w-12 animate-spin text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-medium">Loading Tasks</h3>
                                <p className="mb-4 text-muted-foreground">Please wait while we fetch your tasks...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClipboardList className="mb-4 h-12 w-12 text-red-500" />
                                    <h3 className="mb-1 text-lg font-medium text-red-700 dark:text-red-400">Failed to Load Tasks</h3>
                                    <p className="mb-4 text-red-600 dark:text-red-300">There was an error loading your tasks. Please try again.</p>
                                    <Button onClick={() => getTasks()} className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4" />
                                        <span>Retry</span>
                                    </Button>
                                </div>
                            </div>
                        ) : tasks.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Task Details
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400 print:hidden">
                                            Actions
                                        </TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="max-w-xl">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{task.title}</span>
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            {getStatusBadge(task, task.status)}
                                                            {getPriorityBadge(task.priority)}
                                                            {task.is_recurring === true && (
                                                                <Badge variant="outline" className="gap-1">
                                                                    Recurring
                                                                    {humanizeFrequency(task.recurring_frequency)
                                                                        ? `: ${humanizeFrequency(task.recurring_frequency)}`
                                                                        : ''}
                                                                </Badge>
                                                            )}
                                                            {task.is_imported && task.meta?.source && (
                                                                <SourceLinkIcon source={task.meta.source} sourceUrl={task.meta?.source_url} />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center text-sm">
                                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                            <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                                                            <span>{task.project.name}</span>
                                                        </div>

                                                        {task.due_date && (
                                                            <div className="ml-4 flex items-center text-amber-700 dark:text-amber-400">
                                                                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                                                <span>{new Date(task.due_date).toISOString().split('T')[0]}</span>
                                                            </div>
                                                        )}

                                                        {task.comments_count !== undefined && task.comments_count > 0 && (
                                                            <div className="ml-4 flex items-center text-gray-600 dark:text-gray-400">
                                                                <FileText className="mr-1.5 h-3.5 w-3.5" />
                                                                <span>
                                                                    {task.comments_count} {task.comments_count === 1 ? 'comment' : 'comments'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="flex items-center gap-2">
                                                            {task.tags && task.tags.length > 0 ? (
                                                                <>
                                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                        Tags:
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {task.tags.map((tag) => (
                                                                            <Badge
                                                                                key={tag.id}
                                                                                className="text-xs"
                                                                                style={{ backgroundColor: tag.color, color: '#fff' }}
                                                                            >
                                                                                {tag.name}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 dark:text-gray-500">No tags</span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Assigned to:</span>
                                                            {task.assignees && task.assignees.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {task.assignees.map((assignee) => (
                                                                        <span
                                                                            key={assignee.id}
                                                                            className="inline-flex items-center bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
                                                                            title={assignee.email}
                                                                        >
                                                                            {assignee.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 dark:text-gray-500">Unassigned</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right print:hidden">
                                                <div className="flex justify-end gap-2">
                                                    {task.assignees.some((a) => a.id === auth.user.id) && (
                                                        <TaskTrackButton task={task} currentUserId={auth.user.id} />
                                                    )}
                                                    {task.project.user_id === auth.user.id || task.assignees.some((a) => a.id === auth.user.id) ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                    <span className="sr-only">Open menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <Link href={route('task.detail', task.id)}>
                                                                    <DropdownMenuItem className="group cursor-pointer">
                                                                        <Glasses className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                        <span>View</span>
                                                                    </DropdownMenuItem>
                                                                </Link>

                                                                {(task.project.user_id === auth.user.id || task.created_by === auth.user.id) && (
                                                                    <>
                                                                        <DropdownMenuItem className="group cursor-pointer" onClick={() => { setMode('edit'); setEditTaskId(task.id); setOffOpen(true) }}>
                                                                            <Edit className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                            <span>Edit</span>
                                                                        </DropdownMenuItem>
                                                                        {task.project.user_id === auth.user.id && (
                                                                            <TaskDeleteAction
                                                                                taskId={task.id}
                                                                                isGithub={task.is_imported && task.meta?.source === 'github'}
                                                                                isJira={task.is_imported && task.meta?.source === 'jira'}
                                                                                onDeleteSuccess={() =>
                                                                                    setTasks(tasks.filter((t) => t.id !== task.id))
                                                                                }
                                                                            />
                                                                        )}
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Tasks</h3>
                                    <p className="mb-4 text-muted-foreground">You haven't added any tasks yet.</p>
                                    <Link href={route('task.create')}>
                                        <Button className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Add Task</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Change Task Status</DialogTitle>
                            <DialogDescription>Select a new status for this task.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <RadioGroup
                                value={selectedStatus || ''}
                                onValueChange={(value) => setSelectedStatus(value as Task['status'])}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/30">
                                    <RadioGroupItem value="pending" id="status-pending" />
                                    <Label htmlFor="status-pending" className="cursor-pointer">
                                        Pending
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/30">
                                    <RadioGroupItem value="in_progress" id="status-in-progress" />
                                    <Label htmlFor="status-in-progress" className="cursor-pointer">
                                        In Progress
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/30">
                                    <RadioGroupItem value="completed" id="status-completed" />
                                    <Label htmlFor="status-completed" className="cursor-pointer">
                                        Completed
                                    </Label>
                                </div>
                            </RadioGroup>

                            {taskToUpdate?.is_imported && taskToUpdate?.meta?.source === 'github' && (
                                <div className="mt-2 flex items-center space-x-2 rounded-md border p-2">
                                    <Checkbox
                                        id="update_github"
                                        checked={updateGithub}
                                        onCheckedChange={(checked) => setUpdateGithub(checked === true)}
                                    />
                                    <Label htmlFor="update_github" className="text-sm">
                                        Update in GitHub?
                                    </Label>
                                </div>
                            )}

                            {taskToUpdate?.is_imported && taskToUpdate?.meta?.source === 'jira' && (
                                <div className="mt-2 flex items-center space-x-2 rounded-md border p-2">
                                    <Checkbox id="update_jira" checked={updateJira} onCheckedChange={(checked) => setUpdateJira(checked === true)} />
                                    <Label htmlFor="update_jira" className="text-sm">
                                        Update in Jira?
                                    </Label>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setStatusDialogOpen(false)}
                                disabled={isUpdating}
                                className="h-9 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50/80 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={updateTaskStatus}
                                disabled={isUpdating}
                                className="flex h-9 items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <TaskFiltersOffCanvas open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} projects={projects} tags={tags} />
            <TaskOffCanvas open={offOpen} mode={mode} onClose={() => setOffOpen(false)} projects={projects} taskId={editTaskId ?? undefined} />
        </MasterLayout>
    )
}
