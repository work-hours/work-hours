import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Loader from '@/components/ui/loader'
import { type BreadcrumbItem } from '@/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { all, markAsRead, markAllAsRead } from '@actions/NotificationsController'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

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
        } catch (error: unknown) {
            console.error('Failed to fetch notifications:', error)
            toast.error('Failed to fetch notifications')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (id: string): Promise<void> => {
        try {
            await markAsRead.data({ id })
            toast.success('Notification marked as read')
            fetchNotifications(currentPage)
        } catch (error: unknown) {
            console.error('Failed to mark notification as read:', error)
            toast.error('Failed to mark notification as read')
        }
    }

    const handleMarkAllAsRead = async (): Promise<void> => {
        try {
            await markAllAsRead.data({})
            toast.success('All notifications marked as read')
            fetchNotifications(currentPage)
        } catch (error: unknown) {
            console.error('Failed to mark all notifications as read:', error)
            toast.error('Failed to mark all notifications as read')
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="mx-auto flex w-10/12 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    {(notificationsData.unread_count || 0) > 0 && (
                        <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>
                    )}
                </div>

                {loading ? (
                    <Loader message="Loading notifications..." className="h-40" />
                ) : (
                    <>
                        {!notificationsData.notifications?.data || notificationsData.notifications.data.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-gray-500">No notifications found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {notificationsData.notifications.data.map((notification) => (
                                    <Card key={notification.id} className={notification.read_at ? 'bg-gray-50' : ''}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{notification.type}</CardTitle>
                                                {!notification.read_at && (
                                                    <Badge variant="default">New</Badge>
                                                )}
                                            </div>
                                            <CardDescription>{notification.created_at}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{notification.data?.message || 'No message content'}</p>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            {!notification.read_at && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    Mark as Read
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {notificationsData.notifications.meta?.last_page > 1 && (
                            <div className="flex justify-center space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    disabled={!notificationsData.notifications.links?.prev}
                                    onClick={() => fetchNotifications(currentPage - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4">
                                    Page {currentPage} of {notificationsData.notifications.meta?.last_page || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={!notificationsData.notifications.links?.next}
                                    onClick={() => fetchNotifications(currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    )
}
