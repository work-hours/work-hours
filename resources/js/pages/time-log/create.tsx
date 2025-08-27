import DatePicker from '@/components/ui/date-picker'
import { Head, useForm } from '@inertiajs/react'
import { Clock, LoaderCircle, Save, Timer } from 'lucide-react'
import { FormEventHandler, useMemo } from 'react'
import { toast } from 'sonner'

import BackButton from '@/components/back-button'
import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import CustomInput from '@/components/ui/custom-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import TagInput from '@/components/ui/tag-input'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type Project = {
    id: number
    name: string
}

type TimeLogForm = {
    project_id: number | null
    task_id: number | null
    start_timestamp: string
    end_timestamp: string
    note: string
    non_billable: boolean
    mark_task_complete: boolean
    close_github_issue: boolean
    mark_jira_done: boolean
    tags?: string[] // Add tags to the form type
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
    {
        title: 'Create',
        href: '/time-log/create',
    },
]

type Task = {
    id: number
    title: string
    project_id: number
    is_imported: boolean
    meta?: {
        source: string
        source_state: string
    }
}

type Props = {
    projects: Project[]
    tasks: Task[]
}

export default function CreateTimeLog({ projects, tasks }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<TimeLogForm>>({
        project_id: null, // Set to null initially to avoid showing "0"
        task_id: null,
        start_timestamp: new Date().toISOString(), // Default to now, using full ISO string
        end_timestamp: '',
        note: '',
        non_billable: false,
        mark_task_complete: false,
        close_github_issue: false,
        mark_jira_done: false,
        tags: [],
    })

    const startDate = data.start_timestamp ? new Date(data.start_timestamp) : new Date()
    const endDate = data.end_timestamp ? new Date(data.end_timestamp) : null

    const calculatedHours = useMemo(() => {
        if (!data.start_timestamp || !data.end_timestamp) return null

        const start = new Date(data.start_timestamp)
        const end = new Date(data.end_timestamp)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        return Math.round(diffHours * 100) / 100 // Round to 2 decimal places
    }, [data.start_timestamp, data.end_timestamp])

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const currentStart = new Date(data.start_timestamp)
            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), currentStart.getHours(), currentStart.getMinutes())
            setData('start_timestamp', localDate.toISOString())

            if (data.end_timestamp) {
                const currentEnd = new Date(data.end_timestamp)
                const newEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), currentEnd.getHours(), currentEnd.getMinutes())
                setData('end_timestamp', newEndDate.toISOString())
            }
        }
    }

    const handleStartTimeChange = (date: Date | null) => {
        if (date) {
            const currentStart = new Date(data.start_timestamp)
            const localDate = new Date(
                currentStart.getFullYear(),
                currentStart.getMonth(),
                currentStart.getDate(),
                date.getHours(),
                date.getMinutes(),
            )
            setData('start_timestamp', localDate.toISOString())

            if (data.end_timestamp) {
                const currentEnd = new Date(data.end_timestamp)
                if (currentEnd.getTime() <= localDate.getTime()) {
                    setData('end_timestamp', '')
                }
            }
        }
    }

    const handleEndTimeChange = (date: Date | null) => {
        if (date) {
            const startDate = new Date(data.start_timestamp)
            const localDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), date.getHours(), date.getMinutes())
            setData('end_timestamp', localDate.toISOString())
        } else {
            setData('end_timestamp', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('time-log.store'), {
            onSuccess: () => {
                toast.success('Time log created successfully')
                reset()
            },
            onError: () => {
                toast.error('Failed to create time log')
            },
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Time Log" />
            <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Log Your Time</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Record your work hours by entering start and end times</p>
                </section>

                <Card className="transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Time Entry Details</CardTitle>
                        <CardDescription>Enter the start and end times for your work session</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="project_id" className="text-sm font-medium">
                                            Project
                                        </Label>
                                        <SearchableSelect
                                            id="project_id"
                                            value={data.project_id !== null ? data.project_id.toString() : ''}
                                            onChange={(value) => {
                                                setData('project_id', parseInt(value))

                                                setData('task_id', null)
                                            }}
                                            options={projects}
                                            placeholder="Select a project"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.project_id} className="mt-1" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="task_id" className="text-sm font-medium">
                                            Task (Optional)
                                        </Label>
                                        <SearchableSelect
                                            id="task_id"
                                            value={data.task_id === null ? '' : data.task_id.toString()}
                                            onChange={(value) => setData('task_id', value ? parseInt(value) : null)}
                                            options={tasks
                                                .filter((task) => task.project_id === data.project_id)
                                                .map((task) => ({
                                                    id: task.id,
                                                    name: task.title,
                                                }))}
                                            placeholder="Select a task (optional)"
                                            disabled={processing || data.project_id === null}
                                        />
                                        <InputError message={errors.task_id} className="mt-1" />
                                    </div>
                                </div>

                                {data.project_id !== null && tasks.filter((task) => task.project_id === data.project_id).length === 0 && (
                                    <div className="-mt-4">
                                        <p className="text-xs text-muted-foreground">No tasks assigned to you in this project</p>
                                    </div>
                                )}

                                {data.task_id && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="mark_task_complete"
                                                checked={data.mark_task_complete}
                                                onCheckedChange={(checked) => setData('mark_task_complete', checked as boolean)}
                                            />
                                            <Label htmlFor="mark_task_complete" className="cursor-pointer text-sm font-medium">
                                                Mark task as complete when time log is complete
                                            </Label>
                                        </div>

                                        {tasks.find((task) => task.id === data.task_id)?.is_imported &&
                                            tasks.find((task) => task.id === data.task_id)?.meta?.source === 'github' &&
                                            tasks.find((task) => task.id === data.task_id)?.meta?.source_state !== 'closed' && (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="close_github_issue"
                                                        checked={data.close_github_issue}
                                                        onCheckedChange={(checked) => setData('close_github_issue', checked as boolean)}
                                                    />
                                                    <Label htmlFor="close_github_issue" className="cursor-pointer text-sm font-medium">
                                                        Close issue on GitHub
                                                    </Label>
                                                </div>
                                            )}

                                        {tasks.find((task) => task.id === data.task_id)?.is_imported &&
                                            tasks.find((task) => task.id === data.task_id)?.meta?.source === 'jira' &&
                                            (tasks.find((task) => task.id === data.task_id)?.meta?.source_state || '').toLowerCase() !== 'done' && (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="mark_jira_done"
                                                        checked={data.mark_jira_done}
                                                        onCheckedChange={(checked) => setData('mark_jira_done', checked as boolean)}
                                                    />
                                                    <Label htmlFor="mark_jira_done" className="cursor-pointer text-sm font-medium">
                                                        Mark issue as Done on Jira
                                                    </Label>
                                                </div>
                                            )}
                                    </div>
                                )}

                                <div className="grid gap-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="log_date" className="text-sm font-medium">
                                                Date
                                            </Label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleDateChange}
                                                dateFormat="yyyy-MM-dd"
                                                required
                                                disabled={processing}
                                                customInput={
                                                    <CustomInput
                                                        id="log_date"
                                                        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        disabled={processing}
                                                    />
                                                }
                                            />
                                            <InputError message={errors.start_timestamp} className="mt-1" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="start_time" className="text-sm font-medium">
                                                Start Time
                                            </Label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleStartTimeChange}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="HH:mm"
                                                required
                                                disabled={processing}
                                                customInput={
                                                    <CustomInput
                                                        id="start_time"
                                                        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                                                        required
                                                        tabIndex={2}
                                                        disabled={processing}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="end_time" className="text-sm font-medium">
                                                End Time
                                            </Label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={handleEndTimeChange}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="HH:mm"
                                                disabled={processing}
                                                isClearable
                                                placeholderText="Select end time (optional)"
                                                filterDate={(date) => {
                                                    const start = new Date(data.start_timestamp)
                                                    return (
                                                        date.getDate() === start.getDate() &&
                                                        date.getMonth() === start.getMonth() &&
                                                        date.getFullYear() === start.getFullYear()
                                                    )
                                                }}
                                                filterTime={(time) => {
                                                    const start = new Date(data.start_timestamp)
                                                    const cmp = new Date(
                                                        start.getFullYear(),
                                                        start.getMonth(),
                                                        start.getDate(),
                                                        time.getHours(),
                                                        time.getMinutes(),
                                                    )
                                                    return cmp.getTime() > start.getTime()
                                                }}
                                                customInput={
                                                    <CustomInput
                                                        id="end_time"
                                                        icon={<Timer className="h-4 w-4 text-muted-foreground" />}
                                                        tabIndex={3}
                                                        disabled={processing}
                                                    />
                                                }
                                            />
                                            <InputError message={errors.end_timestamp} />
                                        </div>
                                    </div>
                                </div>

                                {calculatedHours !== null && (
                                    <div className="-mt-4">
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Duration: {calculatedHours} hours</p>
                                    </div>
                                )}

                                {calculatedHours === null && (
                                    <div className="-mt-5">
                                        <p className="text-xs text-muted-foreground">Leave end time empty if you're still working</p>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="note" className="text-sm font-medium">
                                        Note {data.task_id ? '(Optional)' : ''}
                                    </Label>
                                    <Input
                                        id="note"
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        placeholder="Enter a note about this time log"
                                        required={!data.task_id}
                                        disabled={processing}
                                        tabIndex={3}
                                    />
                                    <InputError message={errors.note} className="mt-1" />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="non_billable"
                                        checked={data.non_billable}
                                        onCheckedChange={(checked) => setData('non_billable', checked as boolean)}
                                        disabled={processing}
                                    />
                                    <div className="flex flex-col">
                                        <Label htmlFor="non_billable" className="cursor-pointer text-sm font-medium">
                                            Mark as non-billable
                                        </Label>
                                        <span className="text-xs text-muted-foreground">
                                            If enabled, This entry will not be considered in monitory calculations.
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tags" className="text-sm font-medium">
                                        Tags (Optional)
                                    </Label>
                                    <TagInput value={data.tags} onChange={(tags) => setData('tags', tags)} placeholder="Add tags for this time log" />
                                    <InputError message={errors.tags} className="mt-1" />
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <BackButton tabIndex={6} disabled={processing} />
                                    <SubmitButton
                                        tabIndex={5}
                                        loading={processing}
                                        idleLabel="Save Time Log"
                                        loadingLabel="Saving..."
                                        idleIcon={<Save className="h-4 w-4" />}
                                        loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                        className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
