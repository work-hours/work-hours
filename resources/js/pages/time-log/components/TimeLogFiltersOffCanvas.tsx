import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import TimeLogFiltersForm from '@/pages/time-log/components/TimeLogFiltersForm'
import { SlidersHorizontal } from 'lucide-react'

export type TimeLogFiltersOffCanvasProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: {
        'start-date': string
        'end-date': string
        project: string
        'is-paid': string
        status: string
        tag: string
    }
    projects: { id: number; name: string }[]
    tags: { id: number; name: string }[]
}

export default function TimeLogFiltersOffCanvas({ open, onOpenChange, filters, projects, tags, setHasActiveFilters }: TimeLogFiltersOffCanvasProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Filters
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down time logs by dates, project, payment/approval status, or tag.
                    </SheetDescription>
                </SheetHeader>
                <div className="bg-white dark:border-neutral-800 dark:bg-neutral-800/30">
                    <TimeLogFiltersForm filters={filters} projects={projects} tags={tags} setHasActiveFilters={setHasActiveFilters} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
