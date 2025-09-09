import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import InvoiceFiltersComponent, { type InvoiceFilters } from '@/pages/invoice/components/InvoiceFilters'
import { SlidersHorizontal } from 'lucide-react'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: InvoiceFilters
    clients: { id: number; name: string }[]
    onApply: (filters: InvoiceFilters) => void
}

export default function InvoiceFiltersOffCanvas({ open, onOpenChange, filters, clients, onApply }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Filters
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down invoices by date range, client, status, or search.
                    </SheetDescription>
                </SheetHeader>

                <div className="rounded-md border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-800/30">
                    <InvoiceFiltersComponent filters={filters} clients={clients} onApply={onApply} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
