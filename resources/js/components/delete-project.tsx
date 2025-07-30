import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DeleteProjectProps {
    projectId: number
    onDelete?: () => void
}

export default function DeleteProject({ projectId, onDelete }: DeleteProjectProps) {
    const { delete: destroy, processing, reset, clearErrors } = useForm({})

    const deleteProject: FormEventHandler = (e) => {
        e.preventDefault()

        destroy(route('project.destroy', projectId), {
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
                <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
                <DialogDescription>
                    Once the project is deleted, all of its data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteProject}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Delete Project</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
