import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/components/ui/loader'
import { Separator } from '@/components/ui/separator'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { all, markAllAsRead, markAsRead } from '@actions/NotificationsController'
import { AlertCircle, Bell, BellOff, CheckCircle, ChevronLeft, ChevronRight, Clock, Info, Mail } from 'lucide-react'
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="mx-auto flex w-10/12 flex-col gap-4 p-4">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-muted-foreground">
                                {notificationsData.notifications?.meta?.total
                                    ? `You have ${notificationsData.notifications.meta.total} notifications`
                                    : 'Manage your notifications'}
                            </p>
                        </div>
                    </div>
                    {(notificationsData.unread_count || 0) > 0 && (
                        <Button onClick={handleMarkAllAsRead} className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Mark All as Read
                            <Badge variant="secondary" className="ml-1">
                                {notificationsData.unread_count}
                            </Badge>
                        </Button>
                    )}
                </div>
                <Separator className="mb-4" />

                {loading ? (
                    <Loader message="Loading notifications..." className="h-40" />
                ) : (
                    <>
                        {!notificationsData.notifications?.data || notificationsData.notifications.data.length === 0 ? (
                            <Card className="border-dashed">
                                <div className="flex flex-col items-center justify-center p-6">
                                    <BellOff className="mb-3 h-10 w-10 text-muted-foreground" />
                                    <h3 className="mb-1 text-lg font-semibold">No notifications</h3>
                                    <p className="max-w-md text-center text-sm text-muted-foreground">
                                        You don't have any notifications at the moment. New notifications will appear here when they arrive.
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {notificationsData.notifications.data?.map((notification) => {
                                    // Determine icon based on notification type
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
                                            className={`transition-all ${
                                                notification.read_at ? 'border-gray-200 bg-gray-50/50' : 'border-l-4 border-l-primary shadow-md'
                                            }`}
                                        >
                                            <CardHeader className="pb-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`rounded-full p-1.5 ${
                                                                notification.read_at ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'
                                                            }`}
                                                        >
                                                            <NotificationIcon className="h-4 w-4" />
                                                        </div>
                                                        <CardTitle className="text-base">{formatNotificationType(notification.type)}</CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CardDescription className="text-xs">{notification.created_at}</CardDescription>
                                                        {!notification.read_at && <Badge variant="default">New</Badge>}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <div className="flex items-center justify-between px-6 py-2">
                                                <p className="text-sm text-gray-700">{notification.data?.message || 'No message content'}</p>
                                                {!notification.read_at ? (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="ml-2 h-8 w-8 flex-shrink-0"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <span className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
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
                                    className="h-9 w-9 transition-all hover:bg-primary/10"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <div className="flex items-center">
                                    {Array.from({ length: Math.min(notificationsData.notifications.meta?.last_page || 1, 5) }, (_, i) => {
                                        // Show first, last, current and adjacent pages
                                        const totalPages = notificationsData.notifications.meta?.last_page || 1
                                        let pageNumbers: number[] = []

                                        if (totalPages <= 5) {
                                            // If 5 or fewer pages, show all
                                            pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
                                        } else if (currentPage <= 3) {
                                            // Near start
                                            pageNumbers = [1, 2, 3, 4, totalPages]
                                        } else if (currentPage >= totalPages - 2) {
                                            // Near end
                                            pageNumbers = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
                                        } else {
                                            // Middle
                                            pageNumbers = [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
                                        }

                                        const pageNum = pageNumbers[i] || 1

                                        // Add ellipsis
                                        if (i > 0 && pageNumbers[i] && pageNumbers[i - 1] && pageNumbers[i] - pageNumbers[i - 1] > 1) {
                                            return (
                                                <div key={`ellipsis-${i}`} className="flex items-center">
                                                    <span className="px-2 text-muted-foreground">...</span>
                                                    <Button
                                                        key={pageNum}
                                                        variant={currentPage === pageNum ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => fetchNotifications(pageNum)}
                                                        className={`h-9 w-9 ${currentPage === pageNum ? 'pointer-events-none' : ''}`}
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
                                                className={`h-9 w-9 ${currentPage === pageNum ? 'pointer-events-none' : ''}`}
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
                                    className="h-9 w-9 transition-all hover:bg-primary/10"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    )
}
