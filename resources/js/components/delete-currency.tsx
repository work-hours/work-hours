import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoaderCircle, Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DeleteCurrencyProps {
    currencyId: number
    currencyCode: string
}

export default function DeleteCurrency({ currencyId, currencyCode }: DeleteCurrencyProps) {
    const { delete: destroy, processing, reset, clearErrors } = useForm({})

    const deleteCurrency: FormEventHandler = (e) => {
        e.preventDefault()

        destroy(route('currency.destroy', { currency: currencyId }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Currency deleted successfully')
                closeModal()
            },
            onError: (errors) => {
                if (errors.currency) {
                    toast.error(errors.currency)
                } else {
                    toast.error('Failed to delete currency')
                }
                closeModal()
            },
        })
    }

    const closeModal = () => {
        clearErrors()
        reset()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Currency</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete the currency "{currencyCode}"? This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteCurrency}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing} asChild>
                            {processing ? (
                                <button type="submit" className="flex items-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Deleting...</span>
                                </button>
                            ) : (
                                <button type="submit">Delete Currency</button>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
