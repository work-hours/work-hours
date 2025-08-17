import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface InvoiceDeleteActionProps {
    invoiceId: number
    invoiceNumber?: string
}

export default function InvoiceDeleteAction({ invoiceNumber }: InvoiceDeleteActionProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    className="group cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault()
                        setOpen(true)
                    }}
                >
                    <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">Delete</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Deletion disabled
                </DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Invoices cannot be deleted once created{invoiceNumber ? ` (Invoice #${invoiceNumber})` : ''}. If you need to make changes, edit the invoice or update its status.
                </DialogDescription>
                <div className="mt-4 flex justify-end">
                    <DialogClose asChild>
                        <Button
                            variant="secondary"
                            className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}
