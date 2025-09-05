import TeamFiltersComponent from '@/pages/team/components/TeamFilters'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { type TeamFilters } from '@/pages/team/types'
import { Filter, SlidersHorizontal } from 'lucide-react'

interface TeamFiltersOffCanvasProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: TeamFilters
}

export default function TeamFiltersOffCanvas({ open, onOpenChange, filters }: TeamFiltersOffCanvasProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="mb-8">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Filters
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down team members by date range or search.
                    </SheetDescription>
                </SheetHeader>

                <div className="rounded-md border border-neutral-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-800/30">
                    <TeamFiltersComponent filters={filters} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
