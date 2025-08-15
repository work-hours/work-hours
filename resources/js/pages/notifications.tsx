import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/components/ui/loader'
import { Separator } from '@/components/ui/separator'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { all, markAllAsRead, markAsRead } from '@actions/NotificationsController'
import { Head } from '@inertiajs/react'
import { AlertCircle, Bell, BellOff, CheckCircle, ChevronLeft, ChevronRight, Clock, Info, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Formats a notification type from PascalCase to space-separated words
 * Examples:
 * - "TimeLogEntry" becomes "Time Log Entry"
 * - "UserRegistered" becomes "User Registered"
 * - "ProjectCreated" becomes "Project Created"
 * - "TaskAssigned" becomes "Task Assigned"
 */
const formatNotificationType = (type: string): string => {
    return type.replace(/([A-Z])/g, (match, p1, offset) => {
        return offset === 0 ? p1 : ' ' + p1
    })
}

interface Notification {
    id: string
    type: string
    data: {
        message: string
    }
    read_at: string | null
    created_at: string
}

interface NotificationsResponse {
    notifications: {
        data: Notification[]
        links: {
            prev: string | null
            next: string | null
        }
        meta: {
            current_page: number
            last_page: number
            from: number
            to: number
            total: number
        }
    }
    unread_count: number
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Notifications',
        href: '/notifications',
    },
]

export default function Notifications() {
    const [loading, setLoading] = useState(true)
    const [notificationsData, setNotificationsData] = useState<NotificationsResponse>({
        notifications: {
            data: [],
            links: {
                prev: null,
                next: null,
            },
            meta: {
                current_page: 1,
                last_page: 1,
                from: 0,
                to: 0,
                total: 0,
            },
        },
        unread_count: 0,
    })
    const [currentPage, setCurrentPage] = useState(1)

    const fetchNotifications = async (page = 1): Promise<void> => {
        try {
            setLoading(true)
            const response = await all.data({ page })
            setNotificationsData(response)
            setCurrentPage(page)
        } catch {
            toast.error('Failed to fetch notifications')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (id: string): Promise<void> => {
        try {
            await markAsRead.call({ data: { id } })
            toast.success('Notification marked as read')
            await fetchNotifications(currentPage)
        } catch {
            toast.error('Failed to mark notification as read')
        }
    }

    const handleMarkAllAsRead = async (): Promise<void> => {
        try {
            await markAllAsRead.call({})
            toast.success('All notifications marked as read')
            await fetchNotifications(currentPage)
        } catch {
            toast.error('Failed to mark all notifications as read')
        }
    }

    useEffect(() => {
        fetchNotifications().then()
    }, [])

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="mx-auto max-w-5xl flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Notifications</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {notificationsData.notifications?.meta?.total
                                    ? `You have ${notificationsData.notifications.meta.total} notifications${
                                          notificationsData.unread_count ? ` (${notificationsData.unread_count} unread)` : ''
                                      }`
                                    : 'Stay updated with your latest activities'}
                            </p>
                        </div>
                    </div>
                    {(notificationsData.unread_count || 0) > 0 && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            className="gap-2 bg-primary/90 text-sm hover:bg-primary dark:bg-primary/80 dark:hover:bg-primary"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Mark All as Read
                            <Badge variant="outline" className="ml-1 border-white/20 bg-white/10 text-white">
                                {notificationsData.unread_count}
                            </Badge>
                        </Button>
                    )}
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader message="Loading notifications..." className="h-40" />
                    </div>
                ) : (
                    <>
                        {!notificationsData.notifications?.data || notificationsData.notifications.data.length === 0 ? (
                            <Card className="border border-gray-200 bg-white/50 shadow-sm transition-all hover:bg-white dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-900">
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                                        <BellOff className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">No notifications</h3>
                                    <p className="max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
                                        You don't have any notifications at the moment. New notifications will appear here when they arrive.
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {notificationsData.notifications.data?.map((notification) => {
                                    let NotificationIcon = Info
                                    if (notification.type.toLowerCase().includes('timelog')) {
                                        NotificationIcon = Clock
                                    } else if (notification.type.toLowerCase().includes('mail')) {
                                        NotificationIcon = Mail
                                    } else if (notification.type.toLowerCase().includes('alert')) {
                                        NotificationIcon = AlertCircle
                                    }

                                    return (
                                        <Card
                                            key={notification.id}
                                            className={`overflow-hidden transition-all hover:shadow-md ${
                                                notification.read_at
                                                    ? 'border border-gray-200 bg-white/50 dark:border-gray-800 dark:bg-gray-900/50'
                                                    : 'border border-l-4 border-gray-200 border-l-primary bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900'
                                            }`}
                                        >
                                            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-800">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`rounded-full p-2 ${
                                                                notification.read_at
                                                                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                                    : 'bg-primary/10 text-primary'
                                                            }`}
                                                        >
                                                            <NotificationIcon className="h-4 w-4" />
                                                        </div>
                                                        <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                            {formatNotificationType(notification.type)}
                                                        </CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                                                            {notification.created_at}
                                                        </CardDescription>
                                                        {!notification.read_at && (
                                                            <Badge className="bg-primary/90 text-white hover:bg-primary dark:bg-primary/80 dark:text-white dark:hover:bg-primary">
                                                                New
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <div className="flex items-center justify-between bg-white/50 px-6 py-4 dark:bg-gray-900/50">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {notification.data?.message || 'No message content'}
                                                </p>
                                                {!notification.read_at ? (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="ml-2 h-8 w-8 flex-shrink-0 border-gray-200 bg-white/80 text-primary hover:bg-primary/10 hover:text-primary dark:border-gray-700 dark:bg-gray-800/80 dark:text-primary/90 dark:hover:bg-primary/20"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <span className="ml-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <CheckCircle className="h-3 w-3" /> Read
                                                    </span>
                                                )}
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {notificationsData.notifications.meta?.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={!notificationsData.notifications.links?.prev}
                                    onClick={() => fetchNotifications(currentPage - 1)}
                                    className="h-9 w-9 border-gray-200 bg-white/80 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(notificationsData.notifications.meta?.last_page || 1, 5) }, (_, i) => {
                                        const totalPages = notificationsData.notifications.meta?.last_page || 1
                                        let pageNumbers: number[] = []

                                        if (totalPages <= 5) {
                                            pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
                                        } else if (currentPage <= 3) {
                                            pageNumbers = [1, 2, 3, 4, totalPages]
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNumbers = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
                                        } else {
                                            pageNumbers = [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
                                        }

                                        const pageNum = pageNumbers[i] || 1

                                        if (i > 0 && pageNumbers[i] && pageNumbers[i - 1] && pageNumbers[i] - pageNumbers[i - 1] > 1) {
                                            return (
                                                <div key={`ellipsis-${i}`} className="flex items-center">
                                                    <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                                                    <Button
                                                        key={pageNum}
                                                        variant={currentPage === pageNum ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => fetchNotifications(pageNum)}
                                                        className={`h-9 w-9 ${currentPage === pageNum ? 'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90' : 'border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800'} ${currentPage === pageNum ? 'pointer-events-none' : ''}`}
                                                        aria-label={`Page ${pageNum}`}
                                                        aria-current={currentPage === pageNum ? 'page' : undefined}
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                </div>
                                            )
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => fetchNotifications(pageNum)}
                                                className={`h-9 w-9 ${currentPage === pageNum ? 'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90' : 'border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800'} ${currentPage === pageNum ? 'pointer-events-none' : ''}`}
                                                aria-label={`Page ${pageNum}`}
                                                aria-current={currentPage === pageNum ? 'page' : undefined}
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={!notificationsData.notifications.links?.next}
                                    onClick={() => fetchNotifications(currentPage + 1)}
                                    className="h-9 w-9 border-gray-200 bg-white/80 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MasterLayout>
    )
}
