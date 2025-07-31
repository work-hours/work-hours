import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { HourlyRateStatusBar } from '@/components/hourly-rate-status-bar'
import Background from '@/components/ui/background'
import { Badge } from '@/components/ui/badge'
import { type BreadcrumbItem } from '@/types'
import { all } from '@actions/NotificationsController'
import { Link } from '@inertiajs/react'
import { Bell, ChevronRight, Home } from 'lucide-react'
import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useState } from 'react'

interface MasterContentProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
    collapsed: boolean
    setCollapsed: Dispatch<SetStateAction<boolean>>
}

export function MasterContent({ children, breadcrumbs = [], collapsed, setCollapsed }: MasterContentProps) {
    const [unreadCount, setUnreadCount] = useState(0)

    // Fetch unread notification count when the component mounts
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await all.data({ page: 1 })
                setUnreadCount(response.unread_count)
            } catch (error) {
                console.error('Failed to fetch unread notifications count', error)
            }
        }

        fetchUnreadCount().then()

        // Set up an interval to refresh the count every minute
        const intervalId = setInterval(fetchUnreadCount, 60000)

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="relative flex flex-1 flex-col bg-[#f8f6e9] dark:bg-gray-900">
            <Background showMarginLine={false} showPunches={false} />
            {/* Enhanced header with improved styling */}
            <div className="relative z-10 border-b border-gray-300 bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative flex items-center">
                            <Link
                                href="/dashboard"
                                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                <Home className="h-5 w-5" />
                            </Link>
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="ml-2 rounded-md p-1 transition-all duration-200 hover:bg-gray-200 hover:shadow-sm dark:hover:bg-gray-700"
                                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                {collapsed ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="13 17 18 12 13 7"></polyline>
                                        <polyline points="6 17 11 12 6 7"></polyline>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="11 17 6 12 11 7"></polyline>
                                        <polyline points="18 17 13 12 18 7"></polyline>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {breadcrumbs.length > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-500" />}
                        {breadcrumbs.map((breadcrumb, index) => (
                            <div key={breadcrumb.href} className="flex items-center">
                                {breadcrumb.href ? (
                                    <Link
                                        href={breadcrumb.href}
                                        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                    >
                                        {breadcrumb.title}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{breadcrumb.title}</span>
                                )}
                                {index < breadcrumbs.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Theme Switcher */}
                        <AppearanceToggleDropdown className="rounded-md text-gray-600 dark:text-gray-300" />

                        {/* Notification Link */}
                        <Link
                            href="/notifications"
                            className="relative flex items-center rounded-md p-1.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                            aria-label="View notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full border-0 px-1.5 text-xs font-semibold"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
            <main className="relative z-10 container mx-auto flex-1 overflow-y-auto">
                {/* Hourly rate status bar */}
                <HourlyRateStatusBar />

                {/* Enhanced content container with improved padding */}
                <div className="">{children}</div>
            </main>
        </div>
    )
}
