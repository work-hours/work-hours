import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import TagInput from '@/components/ui/tag-input'
import { useForm } from '@inertiajs/react'
import { Briefcase, ClipboardList, Clock, LoaderCircle, Save, Timer } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

export type Project = { id: number; name: string }
export type Task = { id: number; title: string; project_id: number; is_imported?: boolean; meta?: { source?: string; source_state?: string } }

export type TimeLogOffCanvasProps = {
    open: boolean
    mode: 'create' | 'edit'
    onClose: () => void
    projects: Project[]
    tasks: Task[]
    timeLog?: {
        id: number
        project_id: number
        task_id: number | null
        start_timestamp: string
        end_timestamp: string
        note: string
        non_billable: boolean
        tags: string[]
    }
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
    tags: string[]
}

export default function TimeLogOffCanvas({ open, mode, onClose, projects, tasks, timeLog }: TimeLogOffCanvasProps) {
    const isEdit = mode === 'edit'

    const { data, setData, post, put, processing, errors, reset } = useForm<TimeLogForm>({
        project_id: isEdit && timeLog ? timeLog.project_id : null,
        task_id: isEdit && timeLog ? timeLog.task_id : null,
        start_timestamp: isEdit && timeLog ? new Date(timeLog.start_timestamp).toISOString() : new Date().toISOString(),
        end_timestamp: isEdit && timeLog && timeLog.end_timestamp ? new Date(timeLog.end_timestamp).toISOString() : '',
        note: isEdit && timeLog ? timeLog.note : '',
        non_billable: isEdit && timeLog ? Boolean(timeLog.non_billable) : false,
        mark_task_complete: false,
        close_github_issue: false,
        mark_jira_done: false,
        tags: isEdit && timeLog ? timeLog.tags || [] : [],
    })

    useEffect(() => {
        if (!open) {
            reset()
            return
        }
        if (isEdit && timeLog) {
            setData({
                project_id: timeLog.project_id,
                task_id: timeLog.task_id,
                start_timestamp: new Date(timeLog.start_timestamp).toISOString(),
                end_timestamp: timeLog.end_timestamp ? new Date(timeLog.end_timestamp).toISOString() : '',
                note: timeLog.note,
                non_billable: Boolean(timeLog.non_billable),
                mark_task_complete: false,
                close_github_issue: false,
                mark_jira_done: false,
                tags: timeLog.tags || [],
            })
        } else {
            setData({
                project_id: null,
                task_id: null,
                start_timestamp: new Date().toISOString(),
                end_timestamp: '',
                note: '',
                non_billable: false,
                mark_task_complete: false,
                close_github_issue: false,
                mark_jira_done: false,
                tags: [],
            })
        }
    }, [open, mode, timeLog])

    const startDate = data.start_timestamp ? new Date(data.start_timestamp) : new Date()
    const endDate = data.end_timestamp ? new Date(data.end_timestamp) : null

    const calculatedHours = useMemo(() => {
        if (!data.start_timestamp || !data.end_timestamp) return null
        const start = new Date(data.start_timestamp)
        const end = new Date(data.end_timestamp)
        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)
        return Math.round(diffHours * 100) / 100
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
            const s = new Date(data.start_timestamp)
            const localDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), date.getHours(), date.getMinutes())
            setData('end_timestamp', localDate.toISOString())
        } else {
            setData('end_timestamp', '')
        }
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit && timeLog) {
            put(route('time-log.update', timeLog.id), {
                onSuccess: () => {
                    window.dispatchEvent(new Event('refresh-time-logs'))
                    toast.success('Time log updated successfully')
                    onClose()
                },
                onError: () => toast.error('Failed to update time log'),
                preserveScroll: true,
            })
        } else {
            post(route('time-log.store'), {
                onSuccess: () => {
                    window.dispatchEvent(new Event('refresh-time-logs'))
                    toast.success('Time log created successfully')
                    onClose()
                },
                onError: () => toast.error('Failed to create time log'),
                preserveScroll: true,
            })
        }
    }

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        {isEdit ? (
                            <>
                                <Clock className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Edit Time Log
                            </>
                        ) : (
                            <>
                                <Clock className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Add Time Log
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update your time entry' : 'Create a new time entry'}
                    </SheetDescription>
                </SheetHeader>

                <div>
                    <form className="flex flex-col gap-8" onSubmit={submit}>
                        <div className="space-y-8">
                            <div className="space-y-5 pt-4">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Project Information</h3>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="project_id" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Project
                                        </Label>
                                        <div className="relative">
                                            <SearchableSelect
                                                id="project_id"
                                                value={data.project_id !== null ? String(data.project_id) : ''}
                                                onChange={(value) => {
                                                    setData('project_id', parseInt(value))
                                                    setData('task_id', null)
                                                }}
                                                options={projects}
                                                placeholder="Select a project"
                                                disabled={processing}
                                                icon={<Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                className="border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.project_id} className="mt-1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="task_id" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Task (Optional)
                                        </Label>
                                        <div className="relative">
                                            <SearchableSelect
                                                id="task_id"
                                                value={data.task_id === null ? '' : String(data.task_id)}
                                                onChange={(value) => setData('task_id', value ? parseInt(value) : null)}
                                                options={tasks
                                                    .filter((t) => t.project_id === (data.project_id ?? -1))
                                                    .map((t) => ({ id: t.id, name: t.title }))}
                                                placeholder="Select a task (optional)"
                                                disabled={processing || data.project_id === null}
                                                icon={<ClipboardList className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                className="border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.task_id} className="mt-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Time Information</h3>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="log_date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
                                                    icon={<Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                    required
                                                    disabled={processing}
                                                    className="h-10 w-full border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                                />
                                            }
                                        />
                                        <InputError message={errors.start_timestamp} className="mt-1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time" className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
                                                    icon={<Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                    required
                                                    disabled={processing}
                                                    className="h-10 w-full border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                                />
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time" className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
                                                const s = new Date(data.start_timestamp)
                                                return (
                                                    date.getDate() === s.getDate() &&
                                                    date.getMonth() === s.getMonth() &&
                                                    date.getFullYear() === s.getFullYear()
                                                )
                                            }}
                                            filterTime={(time) => {
                                                const s = new Date(data.start_timestamp)
                                                const cmp = new Date(s.getFullYear(), s.getMonth(), s.getDate(), time.getHours(), time.getMinutes())
                                                return cmp.getTime() > s.getTime()
                                            }}
                                            customInput={
                                                <CustomInput
                                                    id="end_time"
                                                    icon={<Timer className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                    disabled={processing}
                                                    className="h-10 w-full border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                                />
                                            }
                                        />
                                        <InputError message={errors.end_timestamp} />
                                    </div>
                                </div>

                                {calculatedHours !== null ? (
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Duration: {calculatedHours} hours</p>
                                ) : (
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Leave end time empty if you're still working</p>
                                )}
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Additional Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="note" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Note {data.task_id ? '(Optional)' : ''}
                                    </Label>
                                    <Input
                                        id="note"
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        required={!data.task_id}
                                        disabled={processing}
                                        placeholder="What did you work on?"
                                        className="h-10 border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                    />
                                    <InputError message={errors.note} className="mt-1" />
                                </div>

                                <div className="flex items-center space-x-2 rounded-md border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                                    <div className="flex h-5 items-center">
                                        <Checkbox
                                            id="non_billable"
                                            checked={data.non_billable}
                                            onCheckedChange={(c) => setData('non_billable', c as boolean)}
                                            className="border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800"
                                        />
                                    </div>
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="non_billable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Mark as non-billable
                                        </Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            This time won't be included in payment calculations
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Tags
                                    </Label>
                                    <TagInput
                                        value={data.tags}
                                        onChange={(value) => setData('tags', value)}
                                        placeholder="Add tags (press enter to add)"
                                        className="border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                    />
                                    <InputError message={errors.tags} className="mt-1" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                >
                                    Cancel
                                </Button>
                                <SubmitButton
                                    loading={processing}
                                    idleLabel={isEdit ? 'Update Time Log' : 'Save Time Log'}
                                    loadingLabel={isEdit ? 'Updating...' : 'Saving...'}
                                    idleIcon={<Save className="h-4 w-4" />}
                                    loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
