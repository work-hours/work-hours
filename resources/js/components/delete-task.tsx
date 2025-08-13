import { useForm } from '@inertiajs/react'
import { FormEventHandler, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DeleteTaskProps {
    taskId: number
    isGithub?: boolean
    isJira?: boolean
    onDelete?: () => void
}

export default function DeleteTask({ taskId, isGithub = false, isJira = false, onDelete }: DeleteTaskProps) {
    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
        setData,
    } = useForm({
        delete_from_github: true,
        delete_from_jira: true,
    })

    const [deleteFromGithub, setDeleteFromGithub] = useState<boolean>(true)
    const [deleteFromJira, setDeleteFromJira] = useState<boolean>(true)

    const deleteTask: FormEventHandler = (e) => {
        e.preventDefault()

        if (isGithub) {
            setData('delete_from_github', deleteFromGithub as never)
        }

        if (isJira) {
            setData('delete_from_jira', deleteFromJira as never)
        }

        destroy(route('task.destroy', taskId), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal()
                if (onDelete) {
                    onDelete()
                }
            },
            onFinish: () => reset(),
        })
    }

    const closeModal = () => {
        clearErrors()
        reset()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 border-neutral-200 bg-white p-0 text-neutral-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-red-800/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                </Button>
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
                                onClick={closeModal}
                                className="border-neutral-200 bg-white text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
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
