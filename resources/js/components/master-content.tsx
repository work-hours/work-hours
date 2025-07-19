import { HourlyRateStatusBar } from '@/components/hourly-rate-status-bar'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { Badge } from '@/components/ui/badge'
import { type BreadcrumbItem } from '@/types'
import { Link } from '@inertiajs/react'
import { Bell, ChevronRight, Home } from 'lucide-react'
import { type ReactNode, type Dispatch, type SetStateAction, useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { all } from '@actions/NotificationsController'

interface MasterContentProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
    collapsed: boolean
    setCollapsed: Dispatch<SetStateAction<boolean>>
}

export function MasterContent({ children, breadcrumbs = [], collapsed, setCollapsed }: MasterContentProps) {
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread notification count when component mounts
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await all.data({ page: 1 });
                setUnreadCount(response.unread_count);
            } catch (error) {
                console.error('Failed to fetch unread notifications count', error);
            }
        };

        fetchUnreadCount();

        // Set up an interval to refresh the count every minute
        const intervalId = setInterval(fetchUnreadCount, 60000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col flex-1 bg-[#f8f6e9] dark:bg-gray-900 font-['Courier_New',monospace] relative">
            {/* Enhanced horizontal lines with slightly increased contrast */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_2rem]"
                aria-hidden="true"
            ></div>

            {/* Enhanced vertical lines with slightly increased contrast */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:2rem_100%]"
                aria-hidden="true"
            ></div>

            {/* Enhanced punch card holes with slightly increased contrast */}
            <div
                className="pointer-events-none absolute top-0 bottom-0 left-4 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.12)_3px,transparent_3px)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y"
                aria-hidden="true"
            ></div>

            {/* Enhanced red margin line with slightly increased opacity */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-400/40 dark:bg-red-500/20" aria-hidden="true"></div>

            {/* Enhanced header with improved styling */}
            <div className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-md relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center relative">
                            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                                <Home className="h-5 w-5" />
                            </Link>
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="ml-2 rounded-md p-1 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm"
                                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
                                        className="font-['Courier_New',monospace] text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
                                    >
                                        {breadcrumb.title}
                                    </Link>
                                ) : (
                                    <span className="font-['Courier_New',monospace] text-sm font-medium text-gray-900 dark:text-gray-100">{breadcrumb.title}</span>
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
                            className="flex items-center gap-1 rounded-md p-1.5 text-gray-600 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                            aria-label="View notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="ml-0.5 h-5 min-w-5 flex items-center justify-center rounded-full px-1.5 text-xs font-medium"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
            <main className="container mx-auto flex-1 overflow-y-auto relative z-10">

                {/* Hourly rate status bar */}
                <HourlyRateStatusBar />

                {/* Enhanced content container with improved padding */}
                <div className="p-5">{children}</div>
            </main>
        </div>

    )
}
