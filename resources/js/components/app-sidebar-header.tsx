import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types'
import { Link } from '@inertiajs/react'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { all } from '@actions/NotificationsController'

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [unreadCount, setUnreadCount] = useState<number>(0)

    const fetchUnreadCount = async (): Promise<void> => {
        try {
            const response = await all.data({ page: 1 })
            setUnreadCount(response.unread_count || 0)
        } catch (error) {
            console.error('Failed to fetch unread notifications count', error)
        }
    }

    useEffect(() => {
        fetchUnreadCount().then()

        // Set up an interval to refresh the count every minute
        const interval = setInterval(() => {
            fetchUnreadCount().then()
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    return (
        <header className="mx-auto mt-6 flex h-14 w-10/12 shrink-0 items-center gap-4 rounded-lg border-b border-sidebar-border/30 bg-background/60 px-6 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 md:px-5">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 rounded-md p-2 transition-all duration-200 hover:bg-sidebar-accent/15 hover:text-sidebar-accent hover:shadow-sm" />
                <div className="mx-1 h-5 w-px bg-sidebar-border/40" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md relative">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge
                                variant="default"
                                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center p-0 px-1 text-xs"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </Link>
                <AppearanceToggleDropdown />
            </div>
        </header>
    )
}
