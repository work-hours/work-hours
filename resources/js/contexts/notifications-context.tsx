import type { SharedData } from '@/types'
import { count as approvalCountAction } from '@actions/ApprovalController'
import { all } from '@actions/NotificationsController'
import { count as taskCount } from '@actions/TaskController'
import { usePage } from '@inertiajs/react'
import { useEcho } from '@laravel/echo-react'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type RealtimeNotification =
    | { type: 'TaskAssigned'; data: TaskAssignedEvent }
    | { type: 'TaskCompleted'; data: TaskCompletedEvent }
    | { type: 'TeamMemberAdded'; data: TeamMemberAddedEvent }
    | { type: 'TimeLogEntryCreated'; data: TimeLogEntryCreatedEvent }
    | { type: 'TimeLogApproved'; data: TimeLogApprovedEvent }
    | { type: 'TimeLogRejected'; data: TimeLogRejectedEvent }
    | { type: 'TaskCommented'; data: TaskCommentedEvent }

export type NotificationsContextType = {
    unreadCount: number
    pendingTaskCount: number
    approvalCount: number
    isAdmin: boolean
    lastRealtimeNotification: RealtimeNotification | null
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
    const [lastRealtimeNotification, setLastRealtimeNotification] = useState<RealtimeNotification | null>(null)

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

    const countRefresher = () => {
        refreshUnreadCount().then()
        refreshPendingTaskCount().then()
        refreshApprovalCount().then()
    }

    useEffect(() => {
        countRefresher()
        const intervalId = window.setInterval(() => {
            refreshUnreadCount().then()
            refreshApprovalCount().then()
        }, 60000)
        return () => window.clearInterval(intervalId)
    }, [])

    useEcho(`App.Models.User.${auth.user.id}`, 'TaskAssigned', (e: TaskAssignedEvent) => {
        setLastRealtimeNotification({ type: 'TaskAssigned', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'TaskCompleted', (e: TaskCompletedEvent) => {
        setLastRealtimeNotification({ type: 'TaskCompleted', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'TeamMemberAdded', (e: TeamMemberAddedEvent) => {
        setLastRealtimeNotification({ type: 'TeamMemberAdded', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'TaskCommented', (e: TaskCommentedEvent) => {
        setLastRealtimeNotification({ type: 'TaskCommented', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'TimeLogEntryCreated', (e: TimeLogEntryCreatedEvent) => {
        setLastRealtimeNotification({ type: 'TimeLogEntryCreated', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'TimeLogApproved', (e: TimeLogApprovedEvent) => {
        setLastRealtimeNotification({ type: 'TimeLogApproved', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'TimeLogRejected', (e: TimeLogRejectedEvent) => {
        setLastRealtimeNotification({ type: 'TimeLogRejected', data: e })
        countRefresher()
    })

    useEcho(`App.Models.User.${auth.user.id}`, 'MarkAsReadNotification', () => {
        countRefresher()
    })

    const value = useMemo<NotificationsContextType>(
        () => ({
            unreadCount,
            pendingTaskCount,
            approvalCount,
            isAdmin,
            lastRealtimeNotification,
            refreshUnreadCount,
            refreshPendingTaskCount,
            refreshApprovalCount,
        }),
        [
            unreadCount,
            pendingTaskCount,
            approvalCount,
            isAdmin,
            lastRealtimeNotification,
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
