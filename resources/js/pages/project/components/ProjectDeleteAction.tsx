import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { router } from '@inertiajs/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

type ProjectDeleteActionProps = {
    projectId: number
    onDeleteSuccess: () => void
}

export default function ProjectDeleteAction({ projectId, onDeleteSuccess }: ProjectDeleteActionProps) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)

    const handleDelete = () => {
        router.delete(route('project.destroy', projectId), {
            onSuccess: () => {
                onDeleteSuccess()
            },
        })
    }

    return (
        <>
            <DropdownMenuItem
                className="group cursor-pointer text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400"
                onSelect={(e) => {
                    e.preventDefault()
                    setShowDeleteAlert(true)
                }}
            >
                <Trash2 className="h-4 w-4 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-300" />
                <span>Delete</span>
            </DropdownMenuItem>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this project and all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
