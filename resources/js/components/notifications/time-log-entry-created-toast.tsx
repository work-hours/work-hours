import { Link } from '@inertiajs/react'

export default function TimeLogEntryCreatedToast({ e }: { e: TimeLogEntryCreatedEvent }) {
    const projectName = e?.timeLog?.project?.name
    const creatorName = e?.creator?.name
    const duration = e?.timeLog?.duration

    const parts: string[] = []
    parts.push('A new time log entry')
    if (creatorName) {
        parts.push(`by ${creatorName}`)
    }
    if (projectName) {
        parts.push(`for ${projectName}`)
    }
    if (duration != null) {
        parts.push(`(${duration}h)`)
    }

    return (
        <div className="flex items-start gap-3">
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">New Time Log Entry</div>
                <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{parts.join(' ')}</div>
            </div>
            <Link
                href={route('approvals.index')}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                Review
            </Link>
        </div>
    )
}
