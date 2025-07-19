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
        <header className="mx-auto mt-6 flex h-14 w-10/12 shrink-0 items-center gap-4 rounded-none border-b-2 border-gray-400 bg-white px-6 transition-colors group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 md:px-5">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 rounded-none border border-gray-400 p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900" />
                <div className="mx-1 h-5 w-px bg-gray-400" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Link href="/notifications">
                    <Button
                        variant="outline"
                        size="icon"
                        className="relative h-9 w-9 rounded-none border-gray-400 text-gray-700 hover:bg-white/90 hover:text-gray-900"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge
                                variant="default"
                                className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-none border border-red-800 bg-red-100 p-0 px-1 font-['Courier_New',monospace] text-xs font-bold text-red-800"
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
