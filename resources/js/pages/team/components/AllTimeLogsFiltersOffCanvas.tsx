import AllTimeLogsFilters from '@/pages/team/components/AllTimeLogsFilters'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'

type Filters = {
    'start-date': string
    'end-date': string
    user: string
    project: string
    'is-paid': string
    status: string
    tag: string
}

type TeamMember = { id: number; name: string }

type Project = { id: number; name: string }

type Tag = { id: number; name: string }

interface AllTimeLogsFiltersOffCanvasProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: Filters
    teamMembers: TeamMember[]
    projects: Project[]
    tags: Tag[]
}

export default function AllTimeLogsFiltersOffCanvas({ open, onOpenChange, filters, teamMembers, projects, tags }: AllTimeLogsFiltersOffCanvasProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Filters
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down time logs by date range, member, project, tag, payment status or approval status.
                    </SheetDescription>
                </SheetHeader>

                <div className="rounded-md border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-800/30">
                    <AllTimeLogsFilters filters={filters} teamMembers={teamMembers} projects={projects} tags={tags} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
