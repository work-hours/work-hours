import { Breadcrumbs } from '@/components/breadcrumbs'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types'

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="mx-auto mt-6 flex h-14 w-10/12 shrink-0 items-center gap-4 rounded-lg border-b border-sidebar-border/30 bg-background/60 px-6 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 md:px-5">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 rounded-md p-2 transition-all duration-200 hover:bg-sidebar-accent/15 hover:text-sidebar-accent hover:shadow-sm" />
                <div className="mx-1 h-5 w-px bg-sidebar-border/40" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto">
                <AppearanceToggleDropdown />
            </div>
        </header>
    )
}
