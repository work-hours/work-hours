import { router } from '@inertiajs/react'
import { Trash2 } from 'lucide-react'
import { FormEventHandler, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface InvoiceDeleteActionProps {
    invoiceId: number
    invoiceNumber?: string
}

export default function InvoiceDeleteAction({ invoiceId, invoiceNumber }: InvoiceDeleteActionProps) {
    const [processing, setProcessing] = useState(false)

    const deleteInvoice: FormEventHandler = (e) => {
        e.preventDefault()
        setProcessing(true)

        router.delete(route('invoice.destroy', invoiceId), {
            preserveScroll: true,
            onSuccess: () => toast.success('Invoice deleted successfully'),
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
                    Are you sure you want to delete {invoiceNumber ? `Invoice #${invoiceNumber}` : 'this invoice'}?
                </DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Once the invoice is deleted, all of its data will be permanently removed. This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteInvoice}>
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
                            <button type="submit">Delete Invoice</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
