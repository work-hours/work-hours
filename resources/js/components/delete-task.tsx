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
                    className="h-7 w-7 border-red-200 bg-red-50 p-0 text-red-700 shadow-sm transition-all hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                <DialogDescription>
                    Once the task is deleted, all of its data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteTask}>
                    {isGithub && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="delete_from_github"
                                checked={deleteFromGithub}
                                onCheckedChange={(checked) => setDeleteFromGithub(checked === true)}
                            />
                            <Label htmlFor="delete_from_github" className="text-sm">
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
                            />
                            <Label htmlFor="delete_from_jira" className="text-sm">
                                Delete from Jira?
                            </Label>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Delete Task</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
