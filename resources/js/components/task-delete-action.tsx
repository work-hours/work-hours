import { router } from '@inertiajs/react'
import { Trash2 } from 'lucide-react'
import { FormEventHandler, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

interface TaskDeleteActionProps {
    taskId: number
    isGithub?: boolean
    isJira?: boolean
    onDeleteSuccess?: () => Promise<void> | void
}

export default function TaskDeleteAction({ taskId, isGithub = false, isJira = false, onDeleteSuccess }: TaskDeleteActionProps) {
    const [processing, setProcessing] = useState(false)
    const [deleteFromGithub, setDeleteFromGithub] = useState<boolean>(true)
    const [deleteFromJira, setDeleteFromJira] = useState<boolean>(true)

    const deleteTask: FormEventHandler = (e) => {
        e.preventDefault()
        setProcessing(true)

        const data: Record<string, boolean> = {}

        if (isGithub) {
            data.delete_from_github = deleteFromGithub
        }

        if (isJira) {
            data.delete_from_jira = deleteFromJira
        }

        router.delete(route('task.destroy', taskId), {
            data,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Task deleted successfully')
                if (onDeleteSuccess) onDeleteSuccess()
            },
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    className="group cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault()
                    }}
                >
                    <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300" />
                    <span className="text-red-600 dark:text-red-400">Delete</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Are you sure you want to delete this task?
                </DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Once the task is deleted, all of its data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteTask}>
                    {isGithub && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="delete_from_github"
                                checked={deleteFromGithub}
                                onCheckedChange={(checked) => setDeleteFromGithub(checked === true)}
                                className="border-neutral-300 text-neutral-700 focus:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300"
                            />
                            <Label htmlFor="delete_from_github" className="text-sm text-neutral-700 dark:text-neutral-300">
                                Delete from GitHub?
                            </Label>
                        </div>
                    )}
                    {isJira && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="delete_from_jira"
                                checked={deleteFromJira}
                                onCheckedChange={(checked) => setDeleteFromJira(checked === true)}
                                className="border-neutral-300 text-neutral-700 focus:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300"
                            />
                            <Label htmlFor="delete_from_jira" className="text-sm text-neutral-700 dark:text-neutral-300">
                                Delete from Jira?
                            </Label>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            disabled={processing}
                            className="bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-700/80 dark:hover:bg-red-700"
                            asChild
                        >
                            <button type="submit">Delete Task</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
