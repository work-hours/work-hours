import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import TaskFiltersForm from '@/pages/task/components/TaskFiltersForm'
import type { TaskFilters } from '@/pages/task/types'
import { SlidersHorizontal } from 'lucide-react'

export type TaskFiltersOffCanvasProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: TaskFilters
    projects: { id: number; name: string }[]
    tags: { id: number; name: string; color: string }[]
}

export default function TaskFiltersOffCanvas({ open, onOpenChange, filters, projects, tags }: TaskFiltersOffCanvasProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Filters
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down tasks by status, priority, project, tag, dates or search.
                    </SheetDescription>
                </SheetHeader>

                <div className="rounded-md border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-800/30">
                    <TaskFiltersForm filters={filters} projects={projects} tags={tags} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
