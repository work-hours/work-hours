import { Pagination } from '@/components/ui/pagination'
import AdminLayout from '@/layouts/admin-layout'
import { formatDate, formatDateTime } from '@/lib/utils'
import { Head } from '@inertiajs/react'

interface Task {
    id: number
    title: string
    status: string
    priority: string
    due_date: string | null
    created_at: string
    project: { id: number; name: string } | null
    creator: { id: number; name: string } | null
    assignees_count: number
    comments_count: number
    tags_count: number
}

interface PaginatedData<T> {
    data: T[]
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
    total?: number
    meta?: {
        total: number
    }
}

interface Props {
    tasks: PaginatedData<Task>
}

export default function Index({ tasks }: Props) {
    const totalCount = tasks.meta?.total ?? tasks.total ?? tasks.data.length
    return (
        <AdminLayout>
            <Head title="Admin - Task Management" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Task Management ({totalCount})</h1>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Creator
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Assignees
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Comments
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Tags
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {tasks.data.map((task: Task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                            {task.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{task.title}</div>
                                            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{task.project?.name ?? '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.creator?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.status}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.priority}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.assignees_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.comments_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.tags_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {task.due_date ? formatDate(task.due_date) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatDateTime(task.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <Pagination links={tasks.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
