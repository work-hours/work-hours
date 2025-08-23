import { MasterContentProps } from '@/@types/components'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
import { HourlyRateStatusBar } from '@/components/hourly-rate-status-bar'
import RunningTracker from '@/components/running-tracker'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/contexts/notifications-context'
import { Link, usePage } from '@inertiajs/react'
import { Bell, ChevronRight, Home, Settings, MessageSquare } from 'lucide-react'

export function MasterContent({ children, breadcrumbs = [] }: MasterContentProps) {
    const { unreadCount, isAdmin } = useNotifications()
    const { props } = usePage<{ unreadChatUsersCount?: number }>()
    const unreadChatUsersCount = props.unreadChatUsersCount ?? 0

    return (
        <div className="relative flex flex-1 flex-col bg-slate-50 dark:bg-slate-900">
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/90">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-2.5">
                    <div className="flex items-center">
                        <div className="relative flex items-center">
                            <Link
                                href={route('dashboard')}
                                className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            >
                                <Home className="h-5 w-5" />
                            </Link>
                        </div>
                        {breadcrumbs.length > 0 && (
                            <div className="ml-2 flex items-center overflow-x-auto">
                                <ChevronRight className="mx-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <div key={breadcrumb.href || index} className="flex items-center whitespace-nowrap">
                                        {breadcrumb.href ? (
                                            <Link
                                                href={breadcrumb.href}
                                                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                            >
                                                {breadcrumb.title}
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{breadcrumb.title}</span>
                                        )}
                                        {index < breadcrumbs.length - 1 && <ChevronRight className="mx-1 h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-center">
                        <RunningTracker />
                    </div>

                    <div className="flex items-center gap-3">
                        <AppearanceToggleDropdown className="rounded-md text-gray-600 dark:text-gray-300" />

                        <Link
                            href="/calendar"
                            className="relative flex items-center rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            aria-label="View calendar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/administration"
                                className="relative flex items-center rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                                aria-label="Admin Dashboard"
                            >
                                <Settings className="h-5 w-5" />
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new Event('open-chat'))}
                            className="relative flex items-center rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            aria-label="Open chat"
                        >
                            <MessageSquare className="h-5 w-5" />
                            {unreadChatUsersCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full border-0 px-1.5 text-xs font-semibold shadow-sm"
                                >
                                    {unreadChatUsersCount > 99 ? '99+' : unreadChatUsersCount}
                                </Badge>
                            )}
                        </button>

                        <Link
                            href="/notifications"
                            className="relative flex items-center rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            aria-label="View notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full border-0 px-1.5 text-xs font-semibold shadow-sm"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
            <main className="relative z-10 flex-1 overflow-y-auto">
                <HourlyRateStatusBar />

                <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-16">{children}</div>
            </main>
        </div>
    )
}
