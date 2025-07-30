import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DeleteTeamMemberProps {
    userId: number
}

export default function DeleteTeamMember({ userId }: DeleteTeamMemberProps) {
    const { delete: destroy, processing, reset, clearErrors } = useForm({})

    const deleteTeamMember: FormEventHandler = (e) => {
        e.preventDefault()

        destroy(route('team.destroy', userId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
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
                    className="h-7 w-7 p-0 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300 transition-all shadow-sm"
                    title="Delete Member"
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this team member?</DialogTitle>
                <DialogDescription>
                    Once the team member is deleted, all of their data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteTeamMember}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Delete Team Member</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
