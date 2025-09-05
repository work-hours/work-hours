import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import MemberTimeLogsFilters from '@/pages/team/components/MemberTimeLogsFilters'
import { SlidersHorizontal } from 'lucide-react'

type Filters = {
    'start-date': string
    'end-date': string
    project: string
    'is-paid': string
    status: string
}

type Project = { id: number; name: string }

interface MemberTimeLogsFiltersOffCanvasProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: Filters
    projects: Project[]
    userId: number
}

export default function MemberTimeLogsFiltersOffCanvas({ open, onOpenChange, filters, projects, userId }: MemberTimeLogsFiltersOffCanvasProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Filters
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down time logs by date range, project, payment status or approval status.
                    </SheetDescription>
                </SheetHeader>

                <div className="rounded-md border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-800/30">
                    <MemberTimeLogsFilters filters={filters} projects={projects} userId={userId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
