import { SearchableSelect } from '@/components/ui/searchable-select'
import TagInput from '@/components/ui/tag-input'
import { potentialAssignees as _potentialAssignees } from '@actions/TaskController'
import { Head, useForm, usePage } from '@inertiajs/react'
import { Calendar, CheckSquare, ClipboardList, FileText, LoaderCircle, Save, Trash2 } from 'lucide-react'
import { FormEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

import BackButton from '@/components/back-button'
import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import FileDropzone from '@/components/ui/file-dropzone'
import RichTextEditor from '@/components/ui/rich-text-editor'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type User = {
    id: number
    name: string
    email: string
}

type Project = {
    id: number
    name: string
}

type TaskForm = {
    project_id: string
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    due_date: string
    assignees: number[]
    github_update: boolean
    jira_update: boolean
    tags: string[]
}

type Attachment = {
    name: string
    url: string
    size: number
}

type Props = {
    task: {
        id: number
        project_id: number
        title: string
        description: string | null
        status: 'pending' | 'in_progress' | 'completed'
        priority: 'low' | 'medium' | 'high'
        due_date: string | null
    }
    projects: Project[]
    potentialAssignees: User[]
    assignedUsers: number[]
    taskTags: string[]
    isGithub: boolean
    isJira: boolean
    attachments?: Attachment[]
    isProjectOwner: boolean
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/task',
    },
    {
        title: 'Edit',
        href: '/task/edit',
    },
]

export default function EditTask({
    task,
    projects,
    potentialAssignees: initialAssignees,
    assignedUsers,
    taskTags,
    isGithub,
    isJira,
    attachments = [],
    isProjectOwner,
}: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props
    const [newAttachments, setNewAttachments] = useState<File[]>([])
    const { data, setData, post, processing, errors, transform } = useForm<TaskForm>({
        project_id: task.project_id.toString(),
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
        assignees: assignedUsers || [],
        github_update: true,
        jira_update: true,
        tags: taskTags || [],
    })

    const [potentialAssignees, setPotentialAssignees] = useState<{ id: number; name: string; email: string }[]>(initialAssignees || [])
    const [loadingAssignees, setLoadingAssignees] = useState<boolean>(false)

    const [dueDate, setDueDate] = useState<Date | null>(data.due_date ? new Date(data.due_date) : null)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null)

    const { delete: destroyAttachment } = useForm({})

    const openDeleteAttachment = (att: Attachment) => {
        setSelectedAttachment(att)
        setDeleteDialogOpen(true)
    }

    const confirmDeleteAttachment: FormEventHandler = (e) => {
        e.preventDefault()
        if (!selectedAttachment) return
        destroyAttachment(route('task.attachments.destroy', [task.id, selectedAttachment.name]), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteDialogOpen(false)
                toast.success('Attachment deleted')
            },
            onError: () => toast.error('Failed to delete attachment'),
        })
    }

    useEffect(() => {
        if (data.project_id) {
            setLoadingAssignees(true)
            _potentialAssignees
                .data({
                    params: {
                        project: parseInt(data.project_id),
                    },
                })
                .then((assignees: User[]) => {
                    setPotentialAssignees(assignees)
                })
                .catch(() => {
                    toast.error('Failed to load potential assignees')
                    setPotentialAssignees([])
                })
                .finally(() => {
                    setLoadingAssignees(false)
                })
        } else {
            setPotentialAssignees([])
        }
    }, [data.project_id])

    const handleDueDateChange = (date: Date | null) => {
        setDueDate(date)
        if (date) {
            setData('due_date', date.toISOString().split('T')[0])
        } else {
            setData('due_date', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        // include newly added attachments to the payload as multipart
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        transform((d) => ({ ...d, attachments: newAttachments }))
        post(route('task.update', task.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Task updated successfully')
                setNewAttachments([])
            },
            onError: () => {
                toast.error('Failed to update task')
            },
        })
    }

    const handleAssigneeToggle = (assigneeId: number) => {
            // Prevent non-owners from removing their own assignment
            if (!isProjectOwner && assigneeId === auth.user.id) {
                return
            }
        const currentAssignees = [...data.assignees]
        const index = currentAssignees.indexOf(assigneeId)

        if (index === -1) {
            currentAssignees.push(assigneeId)
        } else {
            currentAssignees.splice(index, 1)
        }

        setData('assignees', currentAssignees)
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
                <section className="mb-2">
                    <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Edit Task</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update information for {task.title}</p>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Task Information</CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Update the task's details</CardDescription>
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
                                            value={data.project_id}
                                            onChange={(value) => setData('project_id', value)}
                                            options={projects}
                                            placeholder="Select a project"
                                            disabled={processing}
                                            icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
                                        />
                                        <InputError message={errors.project_id} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="due_date" className="text-sm font-medium">
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

                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-sm font-medium">
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

                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-sm font-medium">
                                        Description <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="">
                                            <RichTextEditor
                                                value={data.description}
                                                onChange={(val) => setData('description', val)}
                                                disabled={processing}
                                                placeholder="Task description"
                                            />
                                        </div>
                                    </div>
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="status" className="text-sm font-medium">
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="priority" className="text-sm font-medium">
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

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">
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
                                                            disabled={processing || (!isProjectOwner && assignee.id === auth.user.id)}
                                                        />
                                                        <Label htmlFor={`assignee-${assignee.id}`} className="cursor-pointer text-sm">
                                                            {assignee.name} ({assignee.email})
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

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">
                                        Tags <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <TagInput
                                        value={data.tags}
                                        onChange={(tags) => setData('tags', tags)}
                                        placeholder="Enter tags separated by commas"
                                    />
                                    <InputError message={errors.tags} />
                                </div>

                                {isGithub && (
                                    <div className="ml-1 grid gap-2">
                                        <Label className="flex items-center space-x-2">
                                            <Checkbox
                                                id="github_update"
                                                checked={data.github_update}
                                                onCheckedChange={(checked) => setData('github_update', checked === true)}
                                                disabled={processing}
                                            />
                                            <span className="text-sm font-medium">Update GitHub issue when task is updated</span>
                                        </Label>
                                        <InputError message={errors.github_update} />
                                    </div>
                                )}

                                {isJira && (
                                    <div className="ml-1 grid gap-2">
                                        <Label className="flex items-center space-x-2">
                                            <Checkbox
                                                id="jira_update"
                                                checked={data.jira_update}
                                                onCheckedChange={(checked) => setData('jira_update', checked === true)}
                                                disabled={processing}
                                            />
                                            <span className="text-sm font-medium">Update Jira issue when task is updated</span>
                                        </Label>
                                        <InputError message={errors.jira_update} />
                                    </div>
                                )}

                                <FileDropzone
                                    value={newAttachments}
                                    onChange={setNewAttachments}
                                    label="Attachments"
                                    description="Drag & drop files here, or click to select"
                                    disabled={processing}
                                />

                                {attachments && attachments.length > 0 && (
                                    <div className="mt-4">
                                        <Label className="text-sm font-medium">Existing Attachments</Label>
                                        <ul className="mt-2 divide-y rounded-md border">
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
                                                    <div className="shrink-0">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 w-7 border-red-200 bg-red-100 p-0 text-red-600 hover:bg-red-200 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                            onClick={() => openDeleteAttachment(att)}
                                                            aria-label={`Delete ${att.name}`}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Delete Attachment</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to delete
                                                {selectedAttachment ? ` "${selectedAttachment.name}"` : ''}? This action cannot be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button type="button" variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="button" variant="destructive" onClick={confirmDeleteAttachment}>
                                                Delete
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <div className="mt-4 flex justify-end gap-3">
                                    <BackButton disabled={processing} />
                                    <SubmitButton
                                        loading={processing}
                                        idleLabel="Update Task"
                                        loadingLabel="Updating..."
                                        idleIcon={<Save className="h-4 w-4" />}
                                        loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
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
