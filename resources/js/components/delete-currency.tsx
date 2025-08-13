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
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-neutral-200 bg-white p-0 text-neutral-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-red-800/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Delete Currency</DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Are you sure you want to delete the currency "{currencyCode}"? This action cannot be undone.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteCurrency}>
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
