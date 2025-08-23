import { Link } from '@inertiajs/react'

export default function TaskCommentedToast({ e }: { e: TaskCommentedEvent }) {
    const title = e?.task?.title ?? 'A task'
    const projectName = e?.task?.project?.name
    const commenterName = e?.commenter?.name

    const messageParts: string[] = []
    messageParts.push(`New comment on "${title}"`)
    if (commenterName) {
        messageParts.push(`by ${commenterName}`)
    }
    if (projectName) {
        messageParts.push(`in ${projectName}`)
    }

    return (
        <div className="flex items-start gap-3">
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">New Task Comment</div>
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
