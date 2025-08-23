import { Link } from '@inertiajs/react'

export default function TaskAssignedToast({ e }: { e: TaskAssignedEvent }) {
    const title = e?.task?.title ?? 'A task'
    const projectName = e?.task?.project?.name
    const assignerName = e?.assigner?.name

    const messageParts: string[] = []
    messageParts.push(`You have been assigned to "${title}"`)
    if (assignerName) {
        messageParts.push(`by ${assignerName}`)
    }
    if (projectName) {
        messageParts.push(`in ${projectName}`)
    }

    return (
        <div className="flex items-start gap-3">
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Task Assigned</div>
                <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{messageParts.join(' ')}</div>
            </div>
            <Link
                href={route('task.detail', e.task.id)}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                View
            </Link>
        </div>
    )
}
