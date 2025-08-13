import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DeleteClientProps {
    clientId: number
    getClients: () => Promise<void>
}

export default function DeleteClient({ clientId, getClients }: DeleteClientProps) {
    const { delete: destroy, processing, reset, clearErrors } = useForm({})

    const deleteClient: FormEventHandler = (e) => {
        e.preventDefault()

        destroy(route('client.destroy', clientId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        })
    }

    const closeModal = () => {
        clearErrors()
        reset()
        getClients().then()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 border-neutral-200 bg-white p-0 text-neutral-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-red-800/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title="Delete Client"
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Are you sure you want to delete this client?</DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Once the client is deleted, all of its data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteClient}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                onClick={closeModal}
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
                            <button type="submit">Delete Client</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
