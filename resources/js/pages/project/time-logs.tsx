import { ExportButton } from '@/components/action-buttons'
import AddNewButton from '@/components/add-new-button'
import BackButton from '@/components/back-button'
import StatsCards from '@/components/dashboard/StatsCards'
import FilterButton from '@/components/filter-button'
import ProjectTaskDeleteAction from '@/components/project-task-delete-action'
import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router, useForm } from '@inertiajs/react'
import {
    AlertCircle,
    Calendar,
    CalendarRange,
    CheckCircle,
    ClipboardList,
    ClockIcon,
    Edit,
    MoreVertical,
    Plus,
    Search,
    TimerReset,
    User,
} from 'lucide-react'
import { FormEventHandler, useState } from 'react'

type TimeLog = {
    id: number
    user_id: number
    user_name: string
    project_name?: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    is_paid: boolean
    note?: string
    hourly_rate?: number
    paid_amount?: number
    currency?: string
    user_non_monetary: boolean
}

type Filters = {
    'start-date': string
    'end-date': string
    user: string
    'is-paid': string
    status: string
}

type Project = {
    id: number
    name: string
    description: string | null
    paid_amount: number
    user: {
        id: number
        name: string
        email: string
    }
}

type TeamMember = {
    id: number
    name: string
    email: string
}

type Task = {
    id: number
    project_id: number
    title: string
    description: string | null
    status: 'pending' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    due_date: string | null
    assignees: {
        id: number
        name: string
        email: string
    }[]
}

type Props = {
    timeLogs: TimeLog[]
    filters: Filters
    project: Project
    teamMembers: TeamMember[]
    totalDuration: number
    unpaidHours: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmountsByCurrency: Record<string, number>
    weeklyAverage: number
    unbillableHours: number
    isCreator: boolean
    tasks: Task[]
}

export default function ProjectTimeLogs({
    timeLogs,
    filters,
    project,
    teamMembers,
    totalDuration,
    unpaidHours,
    unpaidAmountsByCurrency,
    paidAmountsByCurrency,
    weeklyAverage,
    unbillableHours,
    isCreator,
    tasks,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: '/project',
        },
        {
            title: project.name,
            href: `/project/${project.id}/time-logs`,
        },
    ]

    const [selectedLogs, setSelectedLogs] = useState<number[]>([])

    const handleSelectLog = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedLogs([...selectedLogs, id])
        } else {
            setSelectedLogs(selectedLogs.filter((logId) => logId !== id))
        }
    }

    const markAsPaid = () => {
        if (selectedLogs.length === 0) {
            return
        }

        router.post(
            route('time-log.mark-as-paid'),
            {
                time_log_ids: selectedLogs,
            },
            {
                onSuccess: () => {
                    setSelectedLogs([])
                },
            },
        )
    }

    const { data, setData, get, processing } = useForm<Filters>({
        'start-date': filters['start-date'] || '',
        'end-date': filters['end-date'] || '',
        user: filters.user || '',
        'is-paid': filters['is-paid'] || '',
        status: filters.status || '',
    })

    const startDate = data['start-date'] ? new Date(data['start-date']) : null
    const endDate = data['end-date'] ? new Date(data['end-date']) : null

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setData('start-date', date.toISOString().split('T')[0])
        } else {
            setData('start-date', '')
        }
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setData('end-date', date.toISOString().split('T')[0])
        } else {
            setData('end-date', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        get(route('project.time-logs', project.id), {
            preserveState: true,
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.name} - Time Logs`} />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{project.name} - Time Logs</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage work hours for this project</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                {timeLogs.length > 0 && (
                    <section className="mb-4">
                        <StatsCards
                            teamStats={{
                                count: -1,
                                totalHours: totalDuration,
                                unpaidHours: unpaidHours,
                                unpaidAmount: Object.values(unpaidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                unpaidAmountsByCurrency: unpaidAmountsByCurrency,
                                paidAmount: Object.values(paidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                paidAmountsByCurrency: paidAmountsByCurrency,
                                currency: Object.keys(unpaidAmountsByCurrency)[0] || Object.keys(paidAmountsByCurrency)[0] || 'USD',
                                weeklyAverage: weeklyAverage,
                                clientCount: -1,
                                unbillableHours: unbillableHours,
                            }}
                        />
                    </section>
                )}

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{project.name} - Time Logs</CardTitle>
                                <CardDescription>
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>

                                {(data['start-date'] || data['end-date'] || data.user || data['is-paid'] || data.status) && (
                                    <CardDescription className="mt-1">
                                        {(() => {
                                            let description = ''

                                            if (data['start-date'] && data['end-date']) {
                                                description = `Showing logs from ${data['start-date']} to ${data['end-date']}`
                                            } else if (data['start-date']) {
                                                description = `Showing logs from ${data['start-date']}`
                                            } else if (data['end-date']) {
                                                description = `Showing logs until ${data['end-date']}`
                                            }

                                            if (data.user) {
                                                const selectedMember = teamMembers.find((member) => member.id.toString() === data.user)
                                                const memberName = selectedMember ? selectedMember.name : ''

                                                if (description) {
                                                    description += ` for ${memberName}`
                                                } else {
                                                    description = `Showing logs for ${memberName}`
                                                }
                                            }

                                            if (data['is-paid']) {
                                                const paymentStatus = data['is-paid'] === 'true' ? 'paid' : 'unpaid'

                                                if (description) {
                                                    description += ` (${paymentStatus})`
                                                } else {
                                                    description = `Showing ${paymentStatus} logs`
                                                }
                                            }

                                            if (data.status) {
                                                const statusText =
                                                    data.status === 'pending' ? 'pending' : data.status === 'approved' ? 'approved' : 'rejected'

                                                if (description) {
                                                    description += ` with ${statusText} status`
                                                } else {
                                                    description = `Showing logs with ${statusText} status`
                                                }
                                            }

                                            return description
                                        })()}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <ExportButton
                                    href={`${route('project.export-time-logs')}?project=${project.id}${window.location.search.replace('?', '&')}`}
                                    label="Export"
                                />
                                {isCreator && selectedLogs.length > 0 && (
                                    <Button
                                        onClick={markAsPaid}
                                        className="flex items-center gap-2 bg-gray-900 text-sm text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Mark as Paid ({selectedLogs.length})</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <form onSubmit={submit} className="flex w-full flex-row flex-wrap gap-4">
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="start-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Start Date
                                    </Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        isClearable
                                        disabled={processing}
                                        customInput={
                                            <CustomInput
                                                id="start-date"
                                                icon={<Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                disabled={processing}
                                                placeholder="Select start date"
                                            />
                                        }
                                    />
                                </div>

                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="end-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        End Date
                                    </Label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleEndDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        isClearable
                                        disabled={processing}
                                        customInput={
                                            <CustomInput
                                                id="end-date"
                                                icon={<CalendarRange className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                disabled={processing}
                                                placeholder="Select end date"
                                            />
                                        }
                                    />
                                </div>

                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="user" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Team Member
                                    </Label>
                                    <SearchableSelect
                                        id="user"
                                        value={data.user}
                                        onChange={(value) => setData('user', value)}
                                        options={[{ id: '', name: 'Team Members' }, ...teamMembers]}
                                        placeholder="Select team member"
                                        disabled={processing}
                                        icon={<User className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                    />
                                </div>

                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="is-paid" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Payment Status
                                    </Label>
                                    <SearchableSelect
                                        id="is-paid"
                                        value={data['is-paid']}
                                        onChange={(value) => setData('is-paid', value)}
                                        options={[
                                            { id: '', name: 'Statuses' },
                                            { id: 'true', name: 'Paid' },
                                            { id: 'false', name: 'Unpaid' },
                                        ]}
                                        placeholder="Select status"
                                        disabled={processing}
                                        icon={<CheckCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                    />
                                </div>
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="status" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Approval Status
                                    </Label>
                                    <SearchableSelect
                                        id="status"
                                        value={data.status}
                                        onChange={(value) => setData('status', value)}
                                        options={[
                                            { id: '', name: 'Statuses' },
                                            { id: 'pending', name: 'Pending' },
                                            { id: 'approved', name: 'Approved' },
                                            { id: 'rejected', name: 'Rejected' },
                                        ]}
                                        placeholder="Select approval status"
                                        disabled={processing}
                                        icon={<AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <FilterButton title="Apply filters" disabled={processing}>
                                        <Search className="h-4 w-4" />
                                    </FilterButton>

                                    <FilterButton
                                        variant="clear"
                                        disabled={
                                            processing || (!data['start-date'] && !data['end-date'] && !data.user && !data['is-paid'] && !data.status)
                                        }
                                        onClick={() => {
                                            setData({
                                                'start-date': '',
                                                'end-date': '',
                                                user: '',
                                                'is-paid': '',
                                                status: '',
                                            })
                                            get(route('project.time-logs', project.id), {
                                                preserveState: true,
                                            })
                                        }}
                                        title="Clear filters"
                                    >
                                        <TimerReset className="h-4 w-4" />
                                    </FilterButton>
                                </div>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {timeLogs.length > 0 ? (
                            <TimeLogTable
                                timeLogs={timeLogs as TimeLogEntry[]}
                                showCheckboxes={isCreator}
                                showTeamMember={true}
                                showProject={false}
                                showActions={true}
                                showEditDelete={false}
                                selectedLogs={selectedLogs}
                                onSelectLog={handleSelectLog}
                            />
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Time Logs</h3>
                                    <p className="mb-4 text-muted-foreground">No time logs have been added to this project yet.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{project.name} - Tasks</CardTitle>
                                <CardDescription>
                                    {tasks.length > 0
                                        ? `Showing ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`
                                        : 'No tasks found for this project'}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <AddNewButton href={`/task/create?project_id=${project.id}`}>
                                    <Plus className="h-4 w-4" />
                                    <span>Add Task</span>
                                </AddNewButton>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {tasks.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Task Details
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Actions
                                        </TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow
                                            key={task.id}
                                            className="dark:hover:bg-gray-750 border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700"
                                        >
                                            <TableCell className="max-w-xl">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{task.title}</span>
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            {task.status === 'completed' && (
                                                                <Badge variant="success" className="capitalize">
                                                                    {task.status.replace('_', ' ')}
                                                                </Badge>
                                                            )}
                                                            {task.status === 'in_progress' && (
                                                                <Badge variant="warning" className="capitalize">
                                                                    {task.status.replace('_', ' ')}
                                                                </Badge>
                                                            )}
                                                            {task.status === 'pending' && (
                                                                <Badge variant="secondary" className="capitalize">
                                                                    {task.status.replace('_', ' ')}
                                                                </Badge>
                                                            )}

                                                            {task.priority === 'high' && (
                                                                <Badge variant="destructive" className="capitalize">
                                                                    {task.priority}
                                                                </Badge>
                                                            )}
                                                            {task.priority === 'medium' && (
                                                                <Badge variant="default" className="capitalize">
                                                                    {task.priority}
                                                                </Badge>
                                                            )}
                                                            {task.priority === 'low' && (
                                                                <Badge variant="outline" className="capitalize">
                                                                    {task.priority}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {task.due_date && (
                                                        <div className="flex items-center text-sm text-amber-700 dark:text-amber-400">
                                                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Assigned to:</span>
                                                        {task.assignees && task.assignees.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
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
                                                        ) : (
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">Unassigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <a href={route('task.edit', task.id)}>
                                                            <DropdownMenuItem className="group cursor-pointer">
                                                                <Edit className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                        </a>
                                                        <ProjectTaskDeleteAction taskId={task.id} taskTitle={task.title} />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Tasks</h3>
                                    <p className="mb-4 text-muted-foreground">No tasks have been added to this project yet.</p>
                                    <AddNewButton href={`/task/create?project_id=${project.id}`}>
                                        <Plus className="h-4 w-4" />
                                        <span>Add Task</span>
                                    </AddNewButton>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
