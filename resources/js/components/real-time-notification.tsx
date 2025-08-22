import TaskAssignedToast from '@/components/notifications/task-assigned-toast'
import TaskCompletedToast from '@/components/notifications/task-completed-toast'
import TeamMemberAddedToast from '@/components/notifications/team-member-added-toast'
import TimeLogEntryCreatedToast from '@/components/notifications/time-log-entry-created-toast'
import TimeLogApprovedToast from '@/components/notifications/time-log-approved-toast'
import TimeLogRejectedToast from '@/components/notifications/time-log-rejected-toast'
import { useNotifications } from '@/contexts/notifications-context'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function RealTimeNotification() {
    const { lastRealtimeNotification } = useNotifications()

    useEffect(() => {
        if (!lastRealtimeNotification) return

        if (lastRealtimeNotification.type === 'TaskAssigned') {
            toast.success(<TaskAssignedToast e={lastRealtimeNotification.data} />)
        } else if (lastRealtimeNotification.type === 'TaskCompleted') {
            toast.success(<TaskCompletedToast e={lastRealtimeNotification.data} />)
        } else if (lastRealtimeNotification.type === 'TeamMemberAdded') {
            toast.success(<TeamMemberAddedToast e={lastRealtimeNotification.data} />)
        } else if (lastRealtimeNotification.type === 'TimeLogEntryCreated') {
            toast.success(<TimeLogEntryCreatedToast e={lastRealtimeNotification.data} />)
        } else if (lastRealtimeNotification.type === 'TimeLogApproved') {
            toast.success(<TimeLogApprovedToast e={lastRealtimeNotification.data} />)
        } else if (lastRealtimeNotification.type === 'TimeLogRejected') {
            toast.error(<TimeLogRejectedToast e={lastRealtimeNotification.data} />)
        }
    }, [lastRealtimeNotification])

    return null
}
