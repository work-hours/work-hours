import { Link } from '@inertiajs/react'

export default function TimeLogApprovedToast({ e }: { e: TimeLogApprovedEvent }) {
    const projectName = e?.timeLog?.project?.name
    const approverName = e?.approver?.name
    const duration = e?.timeLog?.duration

    const parts: string[] = []
    parts.push('Your time log')
    if (projectName) {
        parts.push(`for ${projectName}`)
    }
    if (duration != null) {
        parts.push(`(${duration}h)`)
    }
    parts.push('has been approved')
    if (approverName) {
        parts.push(`by ${approverName}`)
    }

    return (
        <div className="flex items-start gap-3">
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Time Log Approved</div>
                <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{parts.join(' ')}</div>
            </div>
            <Link
                href={route('time-log.index')}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                View
            </Link>
        </div>
    )
}
