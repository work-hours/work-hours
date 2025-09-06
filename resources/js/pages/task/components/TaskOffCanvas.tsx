import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import FileDropzone from '@/components/ui/file-dropzone'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import TagInput from '@/components/ui/tag-input'
import { useForm } from '@inertiajs/react'
import { Calendar, CheckSquare, ClipboardList, FileText, LoaderCircle, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type TaskOffCanvasProps = {
    open: boolean
    mode: 'create' | 'edit'
    onClose: () => void
    projects: { id: number; name: string; source?: string; is_github?: boolean }[]
    taskId?: number
}
type TaskForm = {
    project_id: string
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    due_date: string
    assignees: number[]
    create_github_issue?: boolean
    create_jira_issue?: boolean
    github_update?: boolean
    jira_update?: boolean
    tags: string[]
    is_recurring?: boolean | null
    recurring_frequency?: 'daily' | 'weekly' | 'every_other_week' | 'monthly' | ''
}

type Attachment = { name: string; url: string; size: number }

export default function TaskOffCanvas({ open, mode, onClose, projects, taskId }: TaskOffCanvasProps) {
    const isEdit = mode === 'edit'

    const { data, setData, post, processing, errors, reset, transform } = useForm<TaskForm>({
        project_id: '',
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        assignees: [],
        create_github_issue: false,
        create_jira_issue: false,
        github_update: true,
        jira_update: true,
        tags: [],
        is_recurring: null,
        recurring_frequency: '',
    })

    const [dueDate, setDueDate] = useState<Date | null>(null)
    const [potentialAssignees, setPotentialAssignees] = useState<{ id: number; name: string; email?: string }[]>([])
    const [loadingAssignees, setLoadingAssignees] = useState(false)

    const [isGithubProject, setIsGithubProject] = useState(false)
    const [isJiraProject, setIsJiraProject] = useState(false)

    const [newAttachments, setNewAttachments] = useState<File[]>([])
    const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([])
    const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false)
    useEffect(() => {
        if (!open) {
            return
        }

        if (isEdit && taskId) {
            let endpoint = ''
            try {
                endpoint = route('task.edit-data', taskId) as unknown as string
            } catch {
                endpoint = `/action/app-http-controllers-taskcontroller/edit-data/${taskId}`
            }
            fetch(endpoint)
                .then((r) => {
                    if (!r.ok) throw new Error('Failed to load task')
                    return r.json()
                })
                .then((payload) => {
                    const t = payload.task
                    setExistingAttachments(payload.attachments || [])
                    setIsProjectOwner(!!payload.isProjectOwner)
                    setData({
                        project_id: String(t.project_id ?? ''),
                        title: t.title ?? '',
                        description: t.description ?? '',
                        status: t.status ?? 'pending',
                        priority: t.priority ?? 'medium',
                        due_date: t.due_date ?? '',
                        assignees: payload.assignedUsers || [],
                        github_update: payload.isGithub ?? false,
                        jira_update: payload.isJira ?? false,
                        create_github_issue: false,
                        create_jira_issue: false,
                        tags: payload.taskTags || [],
                        is_recurring: t.is_recurring ?? null,
                        recurring_frequency: t.recurring_frequency ?? '',
                    })
                    setDueDate(t.due_date ? new Date(t.due_date) : null)
                    setPotentialAssignees(payload.potentialAssignees || [])
                    const proj: { id: number; name: string; source?: string; is_github?: boolean } | undefined = (
                        payload.projects ||
                        projects ||
                        []
                    ).find((p: { id: number; name: string; source?: string; is_github?: boolean }) => p.id === t.project_id)
                    if (proj) {
                        setIsGithubProject(!!proj.is_github)
                        setIsJiraProject(!!proj.source && String(proj.source).toLowerCase() === 'jira')
                    }
                })
                .catch(() => {
                    toast.error('Failed to load task')
                    onClose()
                })
        }

        if (!isEdit) {
            setExistingAttachments([])
            setIsProjectOwner(false)
            setData({
                project_id: '',
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                due_date: '',
                assignees: [],
                create_github_issue: false,
                create_jira_issue: false,
                github_update: true,
                jira_update: true,
                tags: [],
                is_recurring: null,
                recurring_frequency: '',
            })
            setDueDate(null)
            setPotentialAssignees([])
        }
    }, [open, mode, taskId])
    useEffect(() => {
        if (data.project_id) {
            setLoadingAssignees(true)
            import('@actions/TaskController').then(({ potentialAssignees }) =>
                potentialAssignees
                    .data({ params: { project: data.project_id } })
                    .then((assignees: { id: number; name: string; email: string }[]) => setPotentialAssignees(assignees))
                    .catch(() => {
                        toast.error('Failed to load potential assignees')
                        setPotentialAssignees([])
                    })
                    .finally(() => setLoadingAssignees(false)),
            )
        } else {
            setPotentialAssignees([])
        }
    }, [data.project_id])
    useEffect(() => {
        const selectedProject = projects.find((p) => p.id === Number(data.project_id))
        setIsGithubProject(!!selectedProject?.is_github)
        setIsJiraProject(!!selectedProject?.source && String(selectedProject.source).toLowerCase() === 'jira')
    }, [data.project_id, projects])

    const handleDueDateChange = (date: Date | null) => {
        setDueDate(date)
        setData('due_date', date ? date.toISOString().split('T')[0] : '')
    }

    const handleAssigneeToggle = (assigneeId: number) => {
        const current = [...data.assignees]
        const idx = current.indexOf(assigneeId)
        if (idx === -1) {
            current.push(assigneeId)
        } else {
            current.splice(idx, 1)
        }
        setData('assignees', current)
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        transform((d) => ({ ...d, attachments: newAttachments }))

        if (isEdit && taskId) {
            post(route('task.update', taskId), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Task updated successfully')
                    setNewAttachments([])
                    window.dispatchEvent(new Event('refresh-tasks'))
                    onClose()
                },
                onError: () => toast.error('Failed to update task'),
                preserveScroll: true,
            })
        } else {
            post(route('task.store'), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Task created successfully')
                    reset()
                    setNewAttachments([])
                    window.dispatchEvent(new Event('refresh-tasks'))
                    onClose()
                },
                onError: () => toast.error('Failed to create task'),
                preserveScroll: true,
            })
        }
    }

    const deleteExistingAttachment = (att: Attachment) => {
        if (!isEdit || !taskId) return
        let del = ''
        try {
            del = route('task.attachments.destroy', [taskId, att.name]) as unknown as string
        } catch {
            del = `/action/app-http-controllers-taskcontroller/destroyattachment/${taskId}/${encodeURIComponent(att.name)}`
        }
        fetch(del, { method: 'DELETE', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(() => {
                setExistingAttachments((prev) => prev.filter((a) => a.name !== att.name))
                toast.success('Attachment deleted')
            })
            .catch(() => toast.error('Failed to delete attachment'))
    }

    const title = isEdit ? 'Edit Task' : 'Add Task'

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-xl md:max-w-2xl dark:bg-neutral-900">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <ClipboardList className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> {title}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update the task details' : 'Create a new task'}
                    </SheetDescription>
                </SheetHeader>

                <div>
                    <form className="flex flex-col gap-8" onSubmit={submit}>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="project_id" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Project
                                    </Label>
                                    <SearchableSelect
                                        id="project_id"
                                        value={data.project_id}
                                        onChange={(value) => setData('project_id', value)}
                                        options={projects}
                                        placeholder="Select a project"
                                        disabled={processing}
                                        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
                                    />
                                    <InputError message={errors.project_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due_date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Due Date <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <DatePicker
                                        selected={dueDate}
                                        onChange={handleDueDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        isClearable
                                        disabled={processing}
                                        placeholderText="Select due date (optional)"
                                        customInput={
                                            <CustomInput
                                                id="due_date"
                                                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                                                disabled={processing}
                                                tabIndex={3}
                                            />
                                        }
                                    />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Task Title
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="title"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        disabled={processing}
                                        placeholder="Task title"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Description <span className="text-xs text-muted-foreground">(optional)</span>
                                </Label>
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(val) => setData('description', val)}
                                    disabled={processing}
                                    placeholder="Task description"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Status
                                    </Label>
                                    <div className="relative rounded-md border p-3">
                                        <div className="pointer-events-none absolute top-3 left-3">
                                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="pl-7">
                                            <RadioGroup
                                                value={data.status}
                                                onValueChange={(value) => setData('status', value as TaskForm['status'])}
                                                className="flex flex-col space-y-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="pending" id="status-pending" />
                                                    <Label htmlFor="status-pending" className="cursor-pointer">
                                                        Pending
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="in_progress" id="status-in-progress" />
                                                    <Label htmlFor="status-in-progress" className="cursor-pointer">
                                                        In Progress
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="completed" id="status-completed" />
                                                    <Label htmlFor="status-completed" className="cursor-pointer">
                                                        Completed
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <InputError message={errors.status} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Priority
                                    </Label>
                                    <div className="relative rounded-md border p-3">
                                        <div className="pointer-events-none absolute top-3 left-3">
                                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="pl-7">
                                            <RadioGroup
                                                value={data.priority}
                                                onValueChange={(value) => setData('priority', value as TaskForm['priority'])}
                                                className="flex flex-col space-y-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="low" id="priority-low" />
                                                    <Label htmlFor="priority-low" className="cursor-pointer">
                                                        Low
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="medium" id="priority-medium" />
                                                    <Label htmlFor="priority-medium" className="cursor-pointer">
                                                        Medium
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="high" id="priority-high" />
                                                    <Label htmlFor="priority-high" className="cursor-pointer">
                                                        High
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <InputError message={errors.priority} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Assignees <span className="text-xs text-muted-foreground">(optional)</span>
                                </Label>
                                <div className="relative rounded-md border p-3">
                                    <div className="pointer-events-none absolute top-3 left-3">
                                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-2 pl-7">
                                        {loadingAssignees ? (
                                            <div className="flex items-center space-x-2">
                                                <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Loading assignees...</p>
                                            </div>
                                        ) : potentialAssignees && potentialAssignees.length > 0 ? (
                                            potentialAssignees.map((assignee) => (
                                                <div key={assignee.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`assignee-${assignee.id}`}
                                                        checked={data.assignees.includes(assignee.id)}
                                                        onCheckedChange={() => handleAssigneeToggle(assignee.id)}
                                                        disabled={processing}
                                                    />
                                                    <Label htmlFor={`assignee-${assignee.id}`} className="cursor-pointer text-sm">
                                                        {assignee.name}
                                                        {assignee.email ? ` (${assignee.email})` : ''}
                                                    </Label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                {data.project_id ? 'No potential assignees available for this project' : 'Select a project first'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <InputError message={errors.assignees} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Tags <span className="text-xs text-muted-foreground">(optional)</span>
                                </Label>
                                <TagInput value={data.tags} onChange={(tags) => setData('tags', tags)} placeholder="Add tags (optional)" />
                                <InputError message={errors.tags} />
                            </div>

                            {!isEdit && isGithubProject && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create_github_issue"
                                        checked={!!data.create_github_issue}
                                        onCheckedChange={(checked) => setData('create_github_issue', checked === true)}
                                        disabled={processing}
                                    />
                                    <Label htmlFor="create_github_issue" className="cursor-pointer text-sm">
                                        Create issue on GitHub
                                    </Label>
                                </div>
                            )}
                            {!isEdit && isJiraProject && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create_jira_issue"
                                        checked={!!data.create_jira_issue}
                                        onCheckedChange={(checked) => setData('create_jira_issue', checked === true)}
                                        disabled={processing}
                                    />
                                    <Label htmlFor="create_jira_issue" className="cursor-pointer text-sm">
                                        Create issue on Jira
                                    </Label>
                                </div>
                            )}
                            {isEdit && isGithubProject && (
                                <div className="ml-1 space-y-2">
                                    <Label className="flex items-center space-x-2">
                                        <Checkbox
                                            id="github_update"
                                            checked={!!data.github_update}
                                            onCheckedChange={(checked) => setData('github_update', checked === true)}
                                            disabled={processing}
                                        />
                                        <span className="text-sm font-medium">Update GitHub issue when task is updated</span>
                                    </Label>
                                    <InputError message={errors.github_update} />
                                </div>
                            )}
                            {isEdit && isJiraProject && (
                                <div className="ml-1 space-y-2">
                                    <Label className="flex items-center space-x-2">
                                        <Checkbox
                                            id="jira_update"
                                            checked={!!data.jira_update}
                                            onCheckedChange={(checked) => setData('jira_update', checked === true)}
                                            disabled={processing}
                                        />
                                        <span className="text-sm font-medium">Update Jira issue when task is updated</span>
                                    </Label>
                                    <InputError message={errors.jira_update} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Recurring</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_recurring"
                                        checked={!!data.is_recurring}
                                        onCheckedChange={(checked) => {
                                            const val = checked === true
                                            setData('is_recurring', val)
                                            if (!val) setData('recurring_frequency', '')
                                        }}
                                        disabled={processing}
                                    />
                                    <Label htmlFor="is_recurring" className="cursor-pointer text-sm">
                                        Is this a recurring task?
                                    </Label>
                                </div>
                                {data.is_recurring === true && (
                                    <div className="space-y-2">
                                        <Label htmlFor="recurring_frequency" className="text-sm font-medium">
                                            Frequency
                                        </Label>
                                        <SearchableSelect
                                            id="recurring_frequency"
                                            value={data.recurring_frequency || ''}
                                            onChange={(value) => setData('recurring_frequency', value as TaskForm['recurring_frequency'])}
                                            options={[
                                                { id: 'daily', name: 'Daily' },
                                                { id: 'weekly', name: 'Weekly' },
                                                { id: 'every_other_week', name: 'Every other week' },
                                                { id: 'monthly', name: 'Monthly' },
                                            ]}
                                            placeholder="Select frequency"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.recurring_frequency} />
                                    </div>
                                )}
                            </div>

                            <FileDropzone
                                value={newAttachments}
                                onChange={setNewAttachments}
                                label="Attachments"
                                description="Drag & drop files here, or click to select"
                                disabled={processing}
                            />

                            {isEdit && existingAttachments.length > 0 && (
                                <div className="mt-2">
                                    <Label className="text-sm font-medium">Existing Attachments</Label>
                                    <ul className="mt-2 divide-y rounded-md border">
                                        {existingAttachments.map((att) => (
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
                                                {isProjectOwner && (
                                                    <div className="shrink-0">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 w-7 border-red-200 bg-red-100 p-0 text-red-600 hover:bg-red-200 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                            onClick={() => deleteExistingAttachment(att)}
                                                            aria-label={`Delete ${att.name}`}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-4 flex justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
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
                                    idleLabel={isEdit ? 'Update Task' : 'Create Task'}
                                    loadingLabel={isEdit ? 'Updating...' : 'Creating...'}
                                    idleIcon={isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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
