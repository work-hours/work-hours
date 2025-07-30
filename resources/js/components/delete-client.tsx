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
                    className="h-7 w-7 border-red-200 bg-red-50 p-0 text-red-700 shadow-sm transition-all hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                    title="Delete Client"
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this client?</DialogTitle>
                <DialogDescription>
                    Once the client is deleted, all of its data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteClient}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Delete Client</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
