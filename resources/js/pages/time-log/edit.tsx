import DatePicker from '@/components/ui/date-picker'
import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, Clock, LoaderCircle, Save, Timer } from 'lucide-react'
import { FormEventHandler, forwardRef, useMemo } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type Project = {
    id: number
    name: string
}

type TimeLogForm = {
    project_id: number
    task_id: number | null
    start_timestamp: string
    end_timestamp: string
    note: string
    mark_task_complete: boolean
}

type Task = {
    id: number
    title: string
    project_id: number
}

type Props = {
    timeLog: {
        id: number
        project_id: number
        task_id: number | null
        start_timestamp: string
        end_timestamp: string
        duration: number
        note: string
    }
    projects: Project[]
    tasks: Task[]
}

// Custom input component for DatePicker with icon
interface CustomInputProps {
    value?: string
    onClick?: () => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
    placeholder?: string
    disabled?: boolean
    required?: boolean
    autoFocus?: boolean
    tabIndex?: number
    id: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick, onChange, icon, placeholder, disabled, required, autoFocus, tabIndex, id }, ref) => (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{icon}</div>
            <Input
                id={id}
                ref={ref}
                value={value}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                className="pl-10"
                readOnly={!onChange}
            />
        </div>
    ),
)

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
    {
        title: 'Edit',
        href: '/time-log/edit',
    },
]

export default function EditTimeLog({ timeLog, projects, tasks }: Props) {
    const { data, setData, put, processing, errors } = useForm<TimeLogForm>({
        project_id: timeLog.project_id,
        task_id: timeLog.task_id,
        start_timestamp: new Date(timeLog.start_timestamp).toISOString(),
        end_timestamp: timeLog.end_timestamp ? new Date(timeLog.end_timestamp).toISOString() : '',
        note: timeLog.note,
        mark_task_complete: false,
    })

    // Convert string timestamps to Date objects for DatePicker
    const startDate = data.start_timestamp ? new Date(data.start_timestamp) : new Date()
    const endDate = data.end_timestamp ? new Date(data.end_timestamp) : null

    // Calculate hours between start and end time when both are filled
    const calculatedHours = useMemo(() => {
        if (!data.start_timestamp || !data.end_timestamp) return null

        const start = new Date(data.start_timestamp)
        const end = new Date(data.end_timestamp)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        return Math.round(diffHours * 100) / 100 // Round to 2 decimal places
    }, [data.start_timestamp, data.end_timestamp])

    // Handle date changes
    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            // Store the exact selected date/time without timezone conversion
            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())
            setData('start_timestamp', localDate.toISOString())
        }
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            // Use the date from start_timestamp but time from the selected end time
            const startDate = new Date(data.start_timestamp)
            const localDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), date.getHours(), date.getMinutes())
            setData('end_timestamp', localDate.toISOString())
        } else {
            setData('end_timestamp', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('time-log.update', timeLog.id), {
            onSuccess: () => {
                toast.success('Time log updated successfully')
            },
            onError: () => {
                toast.error('Failed to update time log')
            },
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Time Log" />
            <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Time Entry</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Update the details of your time log</p>
                </section>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Time Entry Details</CardTitle>
                        <CardDescription>Current duration: {timeLog.duration} minutes</CardDescription>
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
                                            value={data.project_id ? data.project_id.toString() : ''}
                                            onChange={(value) => {
                                                setData('project_id', parseInt(value))
                                                // Reset task_id when project changes
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
                                            value={data.task_id ? data.task_id.toString() : ''}
                                            onChange={(value) => setData('task_id', value ? parseInt(value) : null)}
                                            options={tasks
                                                .filter((task) => task.project_id === data.project_id)
                                                .map((task) => ({
                                                    id: task.id,
                                                    name: task.title,
                                                }))}
                                            placeholder="Select a task (optional)"
                                            disabled={processing || !data.project_id}
                                        />
                                        <InputError message={errors.task_id} className="mt-1" />
                                    </div>
                                </div>

                                {/* No tasks message in a separate row */}
                                {data.project_id && tasks.filter((task) => task.project_id === data.project_id).length === 0 && (
                                    <div className="-mt-4">
                                        <p className="text-xs text-muted-foreground">No tasks assigned to you in this project</p>
                                    </div>
                                )}

                                {/* Show checkbox to mark task as complete only when a task is selected */}
                                {data.task_id && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        <Checkbox
                                            id="mark_task_complete"
                                            checked={data.mark_task_complete}
                                            onCheckedChange={(checked) => setData('mark_task_complete', checked as boolean)}
                                        />
                                        <Label htmlFor="mark_task_complete" className="cursor-pointer text-sm font-medium">
                                            Mark task as complete when time log is complete
                                        </Label>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start_timestamp" className="text-sm font-medium">
                                            Start Time
                                        </Label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleStartDateChange}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            required
                                            disabled={processing}
                                            customInput={
                                                <CustomInput
                                                    id="start_timestamp"
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
                                        <Label htmlFor="end_timestamp" className="text-sm font-medium">
                                            End Time
                                        </Label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            disabled={processing}
                                            isClearable
                                            placeholderText="Select end time (optional)"
                                            filterDate={(date) => {
                                                // Only allow the same date as the start date
                                                const start = new Date(data.start_timestamp)
                                                return (
                                                    date.getDate() === start.getDate() &&
                                                    date.getMonth() === start.getMonth() &&
                                                    date.getFullYear() === start.getFullYear()
                                                )
                                            }}
                                            customInput={
                                                <CustomInput
                                                    id="end_timestamp"
                                                    icon={<Timer className="h-4 w-4 text-muted-foreground" />}
                                                    tabIndex={2}
                                                    disabled={processing}
                                                />
                                            }
                                        />
                                        <InputError message={errors.end_timestamp} />
                                    </div>
                                </div>

                                {/* Duration text in a separate row */}
                                {calculatedHours !== null && (
                                    <div className="-mt-4">
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Duration: {calculatedHours} hours</p>
                                    </div>
                                )}

                                {/* Help text in a separate row */}
                                {calculatedHours === null && (
                                    <div className="-mt-5">
                                        <p className="text-xs text-muted-foreground">Leave end time empty if you're still working</p>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="note" className="text-sm font-medium">
                                        Note
                                    </Label>
                                    <Input
                                        id="note"
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        placeholder="Enter a note about this time log"
                                        required
                                        disabled={processing}
                                        tabIndex={3}
                                    />
                                    <InputError message={errors.note} className="mt-1" />
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        tabIndex={5}
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" tabIndex={4} disabled={processing} className="flex items-center gap-2">
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {processing ? 'Updating...' : 'Update Time Log'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
