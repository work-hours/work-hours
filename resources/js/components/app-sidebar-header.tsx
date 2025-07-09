import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border/30 bg-background/50 backdrop-blur-sm px-6 transition-all duration-300 ease-in-out shadow-sm group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger
                    className="-ml-1 hover:bg-sidebar-accent/10 hover:text-sidebar-accent transition-colors duration-200"
                />
                <div className="h-4 w-px bg-sidebar-border/30 mx-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
