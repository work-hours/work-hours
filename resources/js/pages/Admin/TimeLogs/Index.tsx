import AdminLayout from '@/layouts/admin-layout'
import { formatDateTime } from '@/lib/utils'
import { Head } from '@inertiajs/react'
import { Pagination } from '@/components/ui/pagination'

interface TimeLog {
    id: number
    duration: number
    start_timestamp: string
    end_timestamp: string
    is_paid: boolean
    hourly_rate: number | null
    currency: string | null
    status: string
    created_at: string
    user: { id: number; name: string } | null
    project: { id: number; name: string } | null
    task: { id: number; title: string } | null
    tags_count: number
}

interface PaginatedData<T> {
    data: T[]
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
}

interface Props {
    timeLogs: PaginatedData<TimeLog>
}

function hoursFromDuration(duration: number): string {
    const hours = Math.floor(duration)
    const minutes = Math.round((duration - hours) * 60)
    const parts: string[] = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (parts.length === 0) return '0m'
    return parts.join(' ')
}

export default function Index({ timeLogs }: Props) {
    return (
        <AdminLayout>
            <Head title="Admin - Time Logs" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Time Logs</h1>
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
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Project / Task
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Start - End
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Rate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Paid
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {timeLogs.data.map((log: TimeLog) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">{log.id}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {log.user?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{log.project?.name ?? '-'}</div>
                                            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{log.task?.title ?? '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            <div>{formatDateTime(log.start_timestamp)}</div>
                                            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{formatDateTime(log.end_timestamp)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{hoursFromDuration(log.duration)}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {log.hourly_rate ? `${log.currency ?? ''} ${Number(log.hourly_rate).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{log.is_paid ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{log.status}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{formatDateTime(log.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <Pagination links={timeLogs.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
