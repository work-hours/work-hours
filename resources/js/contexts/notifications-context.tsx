import type { SharedData } from '@/types'
import { count as approvalCountAction } from '@actions/ApprovalController'
import { all } from '@actions/NotificationsController'
import { count as taskCount } from '@actions/TaskController'
import { usePage } from '@inertiajs/react'
import { useEcho } from '@laravel/echo-react'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type NotificationsContextType = {
    unreadCount: number
    pendingTaskCount: number
    approvalCount: number
    isAdmin: boolean
    lastTaskAssignedEvent: TaskAssignedEvent | null
    refreshUnreadCount: () => Promise<void>
    refreshPendingTaskCount: () => Promise<void>
    refreshApprovalCount: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const { auth } = usePage<SharedData>().props

    const [unreadCount, setUnreadCount] = useState(0)
    const [pendingTaskCount, setPendingTaskCount] = useState(0)
    const [approvalCount, setApprovalCount] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const [lastTaskAssignedEvent, setLastTaskAssignedEvent] = useState<TaskAssignedEvent | null>(null)

    const refreshUnreadCount = useCallback(async () => {
        try {
            const response = await all.data({ page: 1 })
            setUnreadCount(response.unread_count)
            if (response.user && response.user.is_admin) {
                setIsAdmin(true)
            }
        } catch (error) {
            console.error('Failed to fetch unread notifications count', error)
        }
    }, [])

    const refreshPendingTaskCount = useCallback(async () => {
        try {
            const response = await taskCount.data({})
            setPendingTaskCount(response.count)
        } catch (error) {
            console.error('Failed to fetch pending task count', error)
        }
    }, [])

    const refreshApprovalCount = useCallback(async () => {
        try {
            const response = await approvalCountAction.data({})
            setApprovalCount(response.count)
        } catch (error) {
            console.error('Failed to fetch approval count', error)
        }
    }, [])

    useEffect(() => {
        refreshUnreadCount().then()
        refreshPendingTaskCount().then()
        refreshApprovalCount().then()
        const intervalId = window.setInterval(() => {
            refreshUnreadCount().then()
            refreshApprovalCount().then()
        }, 60000)
        return () => window.clearInterval(intervalId)
    }, [])

    useEcho(`App.Models.User.${auth.user.id}`, 'TaskAssigned', (e: TaskAssignedEvent) => {
        setLastTaskAssignedEvent(e)
        refreshUnreadCount().then()
        refreshPendingTaskCount().then()
        refreshApprovalCount().then()
    })

    const value = useMemo<NotificationsContextType>(
        () => ({
            unreadCount,
            pendingTaskCount,
            approvalCount,
            isAdmin,
            lastTaskAssignedEvent,
            refreshUnreadCount,
            refreshPendingTaskCount,
            refreshApprovalCount,
        }),
        [
            unreadCount,
            pendingTaskCount,
            approvalCount,
            isAdmin,
            lastTaskAssignedEvent,
            refreshUnreadCount,
            refreshPendingTaskCount,
            refreshApprovalCount,
        ],
    )

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications(): NotificationsContextType {
    const ctx = useContext(NotificationsContext)
    if (!ctx) {
        throw new Error('useNotifications must be used within a NotificationsProvider')
    }
    return ctx
}
